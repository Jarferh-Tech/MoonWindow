/**
 * Lunar Ephemeris, Libration, and Topographic Visibility Engine
 * Models Sun and Earth positions relative to the Lunar South Pole horizon.
 */

// Astronomical constants for the Moon
export const LUNAR_CONSTANTS = {
  SYNODIC_MONTH_DAYS: 29.530588861,     // Solar illumination day/night cycle
  SIDEREAL_MONTH_DAYS: 27.321661,       // Orbital period relative to fixed stars
  ANOMALISTIC_MONTH_DAYS: 27.554551,    // Perigee to perigee (libration in lon)
  DRACONIC_MONTH_DAYS: 27.2122208,      // Node to node (libration in lat)
  MOON_AXIAL_TILT_DEG: 1.5427,          // Obliquity to ecliptic
  MAX_LAT_LIBRATION_DEG: 6.68,          // Max optical libration in latitude
  MAX_LON_LIBRATION_DEG: 7.91,          // Max optical libration in longitude
  SOLAR_FLUX_W_M2: 1361,                // Solar constant at 1 AU (W/m^2)
  REFERENCE_EPOCH_MS: Date.UTC(2026, 0, 1, 0, 0, 0) // Jan 1, 2026 Reference Epoch
};

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Normalizes an angle to [0, 360) degrees
 */
export function normalize360(deg) {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Calculates the sub-solar coordinates (lat, lon) on the Moon at a given timestamp
 */
export function getSubSolarPoint(timestampMs) {
  const daysSinceEpoch = (timestampMs - LUNAR_CONSTANTS.REFERENCE_EPOCH_MS) / (1000 * 86400);

  // Subsolar longitude progresses westward across the Moon (approx 360° per synodic month)
  const lon = normalize360(0 - (daysSinceEpoch / LUNAR_CONSTANTS.SYNODIC_MONTH_DAYS) * 360);

  // Subsolar latitude oscillates between -1.54° and +1.54° over the draconic year (~346.6 days)
  const draconicYearDays = 346.62;
  const lat = LUNAR_CONSTANTS.MOON_AXIAL_TILT_DEG * Math.sin((daysSinceEpoch / draconicYearDays) * 2 * Math.PI + 0.45);

  return { lat, lon };
}

/**
 * Calculates the sub-Earth coordinates (libration in lat and lon) at a given timestamp
 */
export function getSubEarthPoint(timestampMs) {
  const daysSinceEpoch = (timestampMs - LUNAR_CONSTANTS.REFERENCE_EPOCH_MS) / (1000 * 86400);

  // Optical and physical libration in latitude (draconic cycle ~27.21 days)
  const latLibration = LUNAR_CONSTANTS.MAX_LAT_LIBRATION_DEG * 
    Math.sin((daysSinceEpoch / LUNAR_CONSTANTS.DRACONIC_MONTH_DAYS) * 2 * Math.PI + 1.28);

  // Optical and physical libration in longitude (anomalistic cycle ~27.55 days)
  const lonLibration = LUNAR_CONSTANTS.MAX_LON_LIBRATION_DEG * 
    Math.sin((daysSinceEpoch / LUNAR_CONSTANTS.ANOMALISTIC_MONTH_DAYS) * 2 * Math.PI + 0.82);

  return { lat: latLibration, lon: lonLibration };
}

/**
 * Calculates the local azimuth and elevation of a celestial target (Sun or Earth)
 * seen from a landing site on the Moon.
 * 
 * @param {number} siteLat - Site latitude in degrees (e.g. -89.9)
 * @param {number} siteLon - Site longitude in degrees (0 to 360)
 * @param {number} targetLat - Target sub-point latitude in degrees
 * @param {number} targetLon - Target sub-point longitude in degrees
 * @returns {{ azimuth: number, elevation: number }} in degrees
 */
export function calculateLocalHorizonCoords(siteLat, siteLon, targetLat, targetLon) {
  const phi = siteLat * DEG_TO_RAD;
  const delta = targetLat * DEG_TO_RAD;
  const H = (targetLon - siteLon) * DEG_TO_RAD;

  // Elevation angle alpha:
  // sin(alpha) = sin(phi)*sin(delta) + cos(phi)*cos(delta)*cos(H)
  const sinAlpha = Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H);
  const clampedSinAlpha = Math.max(-1, Math.min(1, sinAlpha));
  const elevation = Math.asin(clampedSinAlpha) * RAD_TO_DEG;

  // Azimuth angle A (measured clockwise from North = 0°):
  // tan(A) = sin(H) / (cos(H)*sin(phi) - tan(delta)*cos(phi))
  const y = Math.sin(H);
  const x = Math.cos(H) * Math.sin(phi) - Math.tan(delta) * Math.cos(phi);
  let azimuth = Math.atan2(y, x) * RAD_TO_DEG;
  azimuth = normalize360(azimuth);

  return { azimuth, elevation };
}

/**
 * Evaluates the topographic horizon elevation at a given azimuth angle.
 * Interpolates between sampled horizon profile points.
 */
export function getHorizonElevation(azimuth, horizonProfile) {
  if (!horizonProfile || horizonProfile.length === 0) return 0;

  // Sort by azimuth just in case
  const sorted = [...horizonProfile].sort((a, b) => a.azimuth - b.azimuth);
  
  // Find surrounding points
  let lower = sorted[sorted.length - 1];
  let upper = sorted[0];

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].azimuth <= azimuth) {
      lower = sorted[i];
    }
    if (sorted[i].azimuth >= azimuth) {
      upper = sorted[i];
      break;
    }
  }

  // Linear interpolation
  let azSpan = upper.azimuth - lower.azimuth;
  if (azSpan < 0) azSpan += 360;

  let offset = azimuth - lower.azimuth;
  if (offset < 0) offset += 360;

  const t = azSpan === 0 ? 0 : offset / azSpan;
  return lower.elevation + t * (upper.elevation - lower.elevation);
}

/**
 * Comprehensive evaluation of Sun and Earth state for a landing site at a specific time.
 */
export function evaluateSiteConditions(site, timestampMs) {
  const subSolar = getSubSolarPoint(timestampMs);
  const subEarth = getSubEarthPoint(timestampMs);

  const sunCoords = calculateLocalHorizonCoords(site.lat, site.lon, subSolar.lat, subSolar.lon);
  const earthCoords = calculateLocalHorizonCoords(site.lat, site.lon, subEarth.lat, subEarth.lon);

  const sunHorizonMask = getHorizonElevation(sunCoords.azimuth, site.horizonProfile);
  const earthHorizonMask = getHorizonElevation(earthCoords.azimuth, site.horizonProfile);

  // Sun visibility: Solar disk has an angular radius of ~0.26°
  const sunMargin = sunCoords.elevation - sunHorizonMask;
  const isSunVisible = sunMargin > -0.26;
  const isSunFull = sunMargin >= 0.26;

  // Solar power efficiency (0 to 100%)
  let solarPowerPercent = 0;
  if (isSunFull) {
    // Vertical solar panel facing sun (cosine factor with grazing elevation)
    // Vertical panels on polar landers capture maximum grazing light
    const verticalIncidence = Math.cos(sunCoords.elevation * DEG_TO_RAD);
    solarPowerPercent = Math.min(100, Math.max(0, Math.round(verticalIncidence * 100)));
  } else if (isSunVisible) {
    // Partial solar disk grazing over the rim
    const fraction = (sunMargin + 0.26) / 0.52;
    solarPowerPercent = Math.round(fraction * 80);
  }

  // Earth line-of-sight visibility
  const earthMargin = earthCoords.elevation - earthHorizonMask;
  const isEarthVisible = earthMargin > 0;
  
  // DTE Link Status: 'OPTIMAL' (> 1.5° margin), 'MARGINAL' (0° to 1.5°), 'OCCLUDED' (< 0°)
  let dteStatus = 'OCCLUDED';
  let dteQualityPercent = 0;
  if (earthMargin >= 1.5) {
    dteStatus = 'OPTIMAL';
    dteQualityPercent = 100;
  } else if (earthMargin > 0) {
    dteStatus = 'MARGINAL';
    dteQualityPercent = Math.round((earthMargin / 1.5) * 80 + 20);
  }

  return {
    timestamp: timestampMs,
    sun: {
      azimuth: sunCoords.azimuth,
      elevation: sunCoords.elevation,
      horizonMask: sunHorizonMask,
      margin: sunMargin,
      isVisible: isSunVisible,
      powerPercent: solarPowerPercent
    },
    earth: {
      azimuth: earthCoords.azimuth,
      elevation: earthCoords.elevation,
      horizonMask: earthHorizonMask,
      margin: earthMargin,
      isVisible: isEarthVisible,
      dteStatus,
      qualityPercent: dteQualityPercent
    },
    subSolar,
    subEarth
  };
}

/**
 * Computes time-series trajectory over a duration (e.g. 14 or 30 days)
 * with a customizable step in hours.
 */
export function generateSiteTimeSeries(site, startMs, durationDays = 29.5, stepHours = 2) {
  const points = [];
  const totalHours = durationDays * 24;
  const stepMs = stepHours * 3600 * 1000;

  let totalSunlitHours = 0;
  let totalDteHours = 0;
  let currentSunlitStreak = 0;
  let maxSunlitStreak = 0;
  let currentShadowStreak = 0;
  let maxShadowStreak = 0;
  let currentDteBlackout = 0;
  let maxDteBlackout = 0;

  for (let h = 0; h <= totalHours; h += stepHours) {
    const t = startMs + h * 3600 * 1000;
    const cond = evaluateSiteConditions(site, t);
    points.push({ ...cond, elapsedHours: h });

    // Track sunlight statistics
    if (cond.sun.isVisible) {
      totalSunlitHours += stepHours;
      currentSunlitStreak += stepHours;
      if (currentSunlitStreak > maxSunlitStreak) maxSunlitStreak = currentSunlitStreak;
      currentShadowStreak = 0;
    } else {
      currentShadowStreak += stepHours;
      if (currentShadowStreak > maxShadowStreak) maxShadowStreak = currentShadowStreak;
      currentSunlitStreak = 0;
    }

    // Track DTE statistics
    if (cond.earth.isVisible) {
      totalDteHours += stepHours;
      currentDteBlackout = 0;
    } else {
      currentDteBlackout += stepHours;
      if (currentDteBlackout > maxDteBlackout) maxDteBlackout = currentDteBlackout;
    }
  }

  const sunlitRatio = Math.round((totalSunlitHours / (totalHours + stepHours)) * 100);
  const dteRatio = Math.round((totalDteHours / (totalHours + stepHours)) * 100);

  return {
    points,
    metrics: {
      totalHours,
      totalSunlitHours,
      sunlitPercentage: sunlitRatio,
      maxContinuousSunHours: maxSunlitStreak,
      maxContinuousShadowHours: maxShadowStreak,
      totalDteHours,
      dtePercentage: dteRatio,
      maxDteBlackoutHours: maxDteBlackout
    }
  };
}

/**
 * Calculates composite Mission Feasibility Score (0-100) based on weighted criteria:
 * - Solar Illumination (weight default: 35%)
 * - DTE Comm Continuity (weight default: 30%)
 * - Safe Slopes (weight default: 20%)
 * - Scientific Value / PSR Proximity (weight default: 15%)
 */
export function calculateFeasibilityScore(site, metrics, weights = { solar: 0.35, dte: 0.30, slope: 0.20, science: 0.15 }) {
  // Solar score: favors high illumination and low maximum shadow streak
  const solarScore = Math.min(100, (metrics.sunlitPercentage * 0.7) + (Math.max(0, 100 - (metrics.maxContinuousShadowHours / 72) * 100) * 0.3));

  // DTE score: favors high DTE visibility and low blackout duration
  const dteScore = Math.min(100, (metrics.dtePercentage * 0.7) + (Math.max(0, 100 - (metrics.maxDteBlackoutHours / 48) * 100) * 0.3));

  // Slope score: slopes < 5° = 100, 10° = 70, 15° = 30, > 20° = 0
  const slope = site.averageSlopeDeg || 8;
  const slopeScore = Math.max(0, Math.min(100, Math.round(100 - (slope / 15) * 80)));

  // Science score: proximity to permanently shadowed regions (PSRs) and volatile traps
  const scienceScore = site.scienceValueScore || 85;

  const totalScore = Math.round(
    solarScore * weights.solar +
    dteScore * weights.dte +
    slopeScore * weights.slope +
    scienceScore * weights.science
  );

  let recommendation = 'GO';
  let badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  if (totalScore < 60 || metrics.maxContinuousShadowHours > 96 || slope > 15) {
    recommendation = 'NO-GO';
    badgeColor = 'text-rose-400 border-rose-500/40 bg-rose-950/40';
  } else if (totalScore < 75 || metrics.maxDteBlackoutHours > 24) {
    recommendation = 'CAUTION';
    badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
  }

  return {
    totalScore,
    solarScore: Math.round(solarScore),
    dteScore: Math.round(dteScore),
    slopeScore,
    scienceScore,
    recommendation,
    badgeColor
  };
}


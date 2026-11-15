import React, { useRef, useEffect } from 'react';
import { 
  Sun, 
  Globe2, 
  Radio, 
  Zap, 
  Mountain, 
  ShieldCheck, 
  AlertTriangle,
  Eye,
  Maximize2
} from 'lucide-react';

export default function HorizonRadar({ 
  site, 
  currentConditions, 
  audienceMode 
}) {
  const canvasRef = useRef(null);

  const { sun, earth } = currentConditions;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Radial gradient dark sky
    const skyGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius);
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.8, '#090d16');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Max elevation mapped to center: 12° elevation = center (radius 0), -2° elevation = outer edge (radius R)
    const minElev = -2;
    const maxElev = 12;
    const elevSpan = maxElev - minElev;

    const getRadiusForElev = (elev) => {
      const clamped = Math.max(minElev, Math.min(maxElev, elev));
      return radius * (1 - (clamped - minElev) / elevSpan);
    };

    // Draw concentric elevation rings (-2°, 0° Horizon, +2°, +5°, +10°)
    const rings = [
      { elev: 0, label: '0° Mean Horizon', color: 'rgba(56, 189, 248, 0.4)', dashed: false, width: 1.5 },
      { elev: 2, label: '+2°', color: 'rgba(255, 255, 255, 0.15)', dashed: true, width: 1 },
      { elev: 5, label: '+5°', color: 'rgba(255, 255, 255, 0.15)', dashed: true, width: 1 },
      { elev: 10, label: '+10°', color: 'rgba(255, 255, 255, 0.15)', dashed: true, width: 1 },
    ];

    rings.forEach(ring => {
      const r = getRadiusForElev(ring.elev);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.width;
      if (ring.dashed) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '9px monospace';
      ctx.fillText(ring.label, centerX + 6, centerY - r + 11);
    });
    ctx.setLineDash([]);

    // Draw cardinal direction spoke lines (Azimuth: 0° N, 90° E, 180° S, 270° W)
    const spokes = [
      { az: 0, label: '0° N' },
      { az: 45, label: '45° NE' },
      { az: 90, label: '90° E' },
      { az: 135, label: '135° SE' },
      { az: 180, label: '180° S' },
      { az: 225, label: '225° SW' },
      { az: 270, label: '270° W' },
      { az: 315, label: '315° NW' }
    ];

    spokes.forEach(spoke => {
      // Azimuth 0° is North (upwards), clockwise
      const rad = (spoke.az - 90) * (Math.PI / 180);
      const x1 = centerX;
      const y1 = centerY;
      const x2 = centerX + radius * Math.cos(rad);
      const y2 = centerY + radius * Math.sin(rad);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label at edge
      const labelX = centerX + (radius + 16) * Math.cos(rad);
      const labelY = centerY + (radius + 16) * Math.sin(rad);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spoke.label, labelX, labelY);
    });

    // Draw Topographic Horizon Profile Mask (Crater rim silhouette polygon)
    if (site.horizonProfile && site.horizonProfile.length > 0) {
      // Interpolate 360 points around circle
      ctx.beginPath();
      for (let az = 0; az <= 360; az += 2) {
        // Find interpolated elevation
        let lower = site.horizonProfile[site.horizonProfile.length - 1];
        let upper = site.horizonProfile[0];
        for (let i = 0; i < site.horizonProfile.length; i++) {
          if (site.horizonProfile[i].azimuth <= az) lower = site.horizonProfile[i];
          if (site.horizonProfile[i].azimuth >= az) { upper = site.horizonProfile[i]; break; }
        }
        let azSpan = upper.azimuth - lower.azimuth;
        if (azSpan < 0) azSpan += 360;
        let offset = az - lower.azimuth;
        if (offset < 0) offset += 360;
        const t = azSpan === 0 ? 0 : offset / azSpan;
        const elev = lower.elevation + t * (upper.elevation - lower.elevation);

        const r = getRadiusForElev(elev);
        const rad = (az - 90) * (Math.PI / 180);
        const px = centerX + r * Math.cos(rad);
        const py = centerY + r * Math.sin(rad);

        if (az === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Fill terrain mask with rugged regolith shading
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer boundary fill: everything from terrain outward to edge is below terrain
      ctx.save();
      ctx.clip();
      // inside mask
      ctx.restore();
    }

    // Helper to get coordinates on radar for celestial body
    const getPos = (az, el) => {
      const r = getRadiusForElev(el);
      const rad = (az - 90) * (Math.PI / 180);
      return {
        x: centerX + r * Math.cos(rad),
        y: centerY + r * Math.sin(rad)
      };
    };

    // Draw Sun Ray from observer to Sun
    const sunPos = getPos(sun.azimuth, sun.elevation);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(sunPos.x, sunPos.y);
    ctx.strokeStyle = sun.isVisible ? 'rgba(251, 191, 36, 0.3)' : 'rgba(100, 116, 139, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Earth Ray from observer to Earth
    const earthPos = getPos(earth.azimuth, earth.elevation);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(earthPos.x, earthPos.y);
    ctx.strokeStyle = earth.isVisible ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Observer at Center (Landing Site)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Sun Orb
    const sunGlow = ctx.createRadialGradient(sunPos.x, sunPos.y, 2, sunPos.x, sunPos.y, 16);
    if (sun.isVisible) {
      sunGlow.addColorStop(0, '#ffffff');
      sunGlow.addColorStop(0.3, '#fef08a');
      sunGlow.addColorStop(0.7, 'rgba(251, 191, 36, 0.5)');
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    } else {
      sunGlow.addColorStop(0, '#94a3b8');
      sunGlow.addColorStop(0.5, 'rgba(100, 116, 139, 0.4)');
      sunGlow.addColorStop(1, 'rgba(100, 116, 139, 0)');
    }
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunPos.x, sunPos.y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = sun.isVisible ? '#fbbf24' : '#64748b';
    ctx.beginPath();
    ctx.arc(sunPos.x, sunPos.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Sun Label
    ctx.fillStyle = sun.isVisible ? '#fef08a' : '#94a3b8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`SUN (${sun.elevation.toFixed(1)}°)`, sunPos.x + 10, sunPos.y - 6);

    // Draw Earth Orb
    const earthGlow = ctx.createRadialGradient(earthPos.x, earthPos.y, 2, earthPos.x, earthPos.y, 14);
    if (earth.isVisible) {
      earthGlow.addColorStop(0, '#e0f2fe');
      earthGlow.addColorStop(0.4, '#38bdf8');
      earthGlow.addColorStop(0.8, 'rgba(56, 189, 248, 0.4)');
      earthGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    } else {
      earthGlow.addColorStop(0, '#f87171');
      earthGlow.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
      earthGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    }
    ctx.fillStyle = earthGlow;
    ctx.beginPath();
    ctx.arc(earthPos.x, earthPos.y, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = earth.isVisible ? '#0284c7' : '#991b1b';
    ctx.beginPath();
    ctx.arc(earthPos.x, earthPos.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Earth Label
    ctx.fillStyle = earth.isVisible ? '#bae6fd' : '#fca5a5';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`EARTH (${earth.elevation.toFixed(1)}°)`, earthPos.x + 10, earthPos.y + 12);

  }, [site, sun, earth]);

  return (
    <div className="nasa-panel rounded-xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Local Horizon Azimuth/Elevation</span>
          <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            360° LOCAL SKY & TOPOGRAPHIC HORIZON RADAR
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Red Line: Crater Rim Mask
          </span>
        </div>
      </div>

      {/* Main Radar Canvas Container */}
      <div className="relative flex items-center justify-center py-2">
        <canvas
          ref={canvasRef}
          width={440}
          height={440}
          className="max-w-full h-auto drop-shadow-2xl"
        />
      </div>

      {/* Status Badges & Real-Time Engineering Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 font-mono text-xs">
        
        {/* Solar Power Status Card */}
        <div className={`p-3 rounded-lg border ${
          sun.isVisible 
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' 
            : 'bg-slate-900 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Sun className="w-4 h-4 text-amber-400" />
              SOLAR POWER GENERATION
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              sun.isVisible ? 'bg-amber-400 text-black' : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {sun.isVisible ? 'SUNLIT' : 'OCCLUDED BY RIM'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[9px]">ELEVATION</span>
              <span className="font-semibold text-slate-100">{sun.elevation.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">AZIMUTH</span>
              <span className="font-semibold text-slate-100">{sun.azimuth.toFixed(1)}°</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">POWER OUTPUT</span>
              <span className="font-semibold text-amber-300">{sun.powerPercent}% (~{(sun.powerPercent * 13.6).toFixed(0)} W/m²)</span>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${sun.powerPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Direct to Earth (DTE) Comm Card */}
        <div className={`p-3 rounded-lg border ${
          earth.isVisible 
            ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200' 
            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-bold">
              <Radio className="w-4 h-4 text-cyan-400" />
              DIRECT-TO-EARTH (DTE) LINK
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              earth.isVisible ? 'bg-cyan-400 text-black' : 'bg-rose-500 text-white'
            }`}>
              {earth.dteStatus}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[11px]">
            <div>
              <span className="text-slate-500 block text-[9px]">ELEVATION</span>
              <span className="font-semibold text-slate-100">{earth.elevation.toFixed(2)}°</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">AZIMUTH</span>
              <span className="font-semibold text-slate-100">{earth.azimuth.toFixed(1)}°</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">LINK MARGIN</span>
              <span className={`font-semibold ${earth.margin > 1.5 ? 'text-emerald-400' : earth.margin > 0 ? 'text-amber-300' : 'text-rose-400'}`}>
                {earth.margin > 0 ? `+${earth.margin.toFixed(2)}°` : `${earth.margin.toFixed(2)}°`}
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${earth.isVisible ? 'bg-cyan-400' : 'bg-rose-500'}`}
              style={{ width: `${earth.qualityPercent}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}


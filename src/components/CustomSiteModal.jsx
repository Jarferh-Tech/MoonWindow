import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Mountain, 
  Compass, 
  Plus, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export default function CustomSiteModal({ onAddSite, onClose }) {
  const [name, setName] = useState('Custom Polar Site Alpha');
  const [lat, setLat] = useState(-88.5);
  const [lon, setLon] = useState(135.0);
  const [elevationM, setElevationM] = useState(1500);
  const [terrainPreset, setTerrainPreset] = useState('ridge');
  const [averageSlopeDeg, setAverageSlopeDeg] = useState(6.5);
  const [psrDistanceKm, setPsrDistanceKm] = useState(2.0);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate synthetic horizon profile based on terrain preset
    let horizonProfile = [];
    if (terrainPreset === 'peak') {
      // Mountain peak: low horizon mask (-0.3° to +0.8°)
      horizonProfile = [
        { azimuth: 0, elevation: -0.2 },
        { azimuth: 60, elevation: 0.4 },
        { azimuth: 120, elevation: -0.1 },
        { azimuth: 180, elevation: 0.6 },
        { azimuth: 240, elevation: 0.1 },
        { azimuth: 300, elevation: -0.3 }
      ];
    } else if (terrainPreset === 'crater-floor') {
      // Crater floor: high horizon mask (+2.5° to +5.0°) - mostly shadowed!
      horizonProfile = [
        { azimuth: 0, elevation: 3.2 },
        { azimuth: 60, elevation: 4.5 },
        { azimuth: 120, elevation: 2.8 },
        { azimuth: 180, elevation: 4.8 },
        { azimuth: 240, elevation: 3.9 },
        { azimuth: 300, elevation: 3.1 }
      ];
    } else {
      // Ridge default: modest horizon mask (+0.5° to +2.0°)
      horizonProfile = [
        { azimuth: 0, elevation: 0.8 },
        { azimuth: 60, elevation: 1.4 },
        { azimuth: 120, elevation: 0.5 },
        { azimuth: 180, elevation: 1.9 },
        { azimuth: 240, elevation: 1.2 },
        { azimuth: 300, elevation: 0.6 }
      ];
    }

    const newSite = {
      id: `custom-site-${Date.now()}`,
      name,
      shortName: name,
      designation: 'CUST-01',
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      elevationM: parseInt(elevationM, 10),
      averageSlopeDeg: parseFloat(averageSlopeDeg),
      maxSlopeDeg: parseFloat(averageSlopeDeg) * 1.5,
      boulderHazard: averageSlopeDeg > 10 ? 'High' : 'Low',
      peakIlluminationPct: terrainPreset === 'peak' ? 90 : terrainPreset === 'crater-floor' ? 25 : 75,
      psrDistanceKm: parseFloat(psrDistanceKm),
      scienceValueScore: 85,
      targetMission: 'User-Defined Mission Concept',
      description: `Custom target defined at ${Math.abs(lat)}°S, ${lon}°E with ${terrainPreset} topography.`,
      geology: 'User-specified lunar terrain sector.',
      horizonProfile
    };

    onAddSite(newSite);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Target Coordinates Input</span>
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              CONFIGURE CUSTOM LANDING SITE
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Site Name / Designation</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Latitude (°S, 80° to 90°)</label>
              <input
                type="number"
                step="0.01"
                min="-90"
                max="-80"
                required
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Longitude (°E, 0° to 360°)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="360"
                required
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Elevation (Meters)</label>
              <input
                type="number"
                step="50"
                value={elevationM}
                onChange={(e) => setElevationM(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Terrain Horizon Preset</label>
              <select
                value={terrainPreset}
                onChange={(e) => setTerrainPreset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="peak">Mountain Peak (Low Obstacles)</option>
                <option value="ridge">Elevated Ridge (Nominal)</option>
                <option value="crater-floor">Crater Floor (Deep Shadow / High Rims)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Average Slope (°)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="30"
                value={averageSlopeDeg}
                onChange={(e) => setAverageSlopeDeg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Distance to PSR (km)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={psrDistanceKm}
                onChange={(e) => setPsrDistanceKm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add & Navigate Site
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}


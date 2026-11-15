import React from 'react';
import { 
  MapPin, 
  Mountain, 
  Sun, 
  Radio, 
  AlertTriangle, 
  Compass, 
  PlusCircle, 
  Info,
  ShieldCheck
} from 'lucide-react';

export default function SiteSelector({ 
  sites, 
  selectedSite, 
  onSelectSite, 
  onOpenCustomSite,
  feasibility
}) {
  return (
    <div className="nasa-panel rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Target Candidate Assessment</span>
          <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            LUNAR SOUTH POLE CANDIDATE SITES
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {feasibility && (
            <div className={`px-3 py-1 rounded-md border text-xs font-mono font-bold flex items-center gap-1.5 ${feasibility.badgeColor}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              STATUS: {feasibility.recommendation} ({feasibility.totalScore}/100)
            </div>
          )}

          <button
            onClick={onOpenCustomSite}
            className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            Custom Site
          </button>
        </div>
      </div>

      {/* Horizontal Site Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sites.map(site => {
          const isSelected = selectedSite?.id === site.id;
          return (
            <button
              key={site.id}
              onClick={() => onSelectSite(site)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-cyan-400">{site.designation}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                  {site.lat}°S
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-100 mt-0.5 truncate max-w-[160px]">
                {site.shortName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Site Details Banner */}
      {selectedSite && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs font-mono">
          <div>
            <span className="text-slate-500 block text-[10px]">COORDINATES</span>
            <span className="font-semibold text-slate-200">
              {Math.abs(selectedSite.lat).toFixed(2)}°S, {selectedSite.lon.toFixed(1)}°E
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">ELEVATION</span>
            <span className="font-semibold text-cyan-300 flex items-center gap-1">
              <Mountain className="w-3 h-3 text-cyan-400" />
              {selectedSite.elevationM > 0 ? `+${selectedSite.elevationM}m` : `${selectedSite.elevationM}m`}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">AVG SLOPE</span>
            <span className={`font-semibold ${selectedSite.averageSlopeDeg > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {selectedSite.averageSlopeDeg}° (Max {selectedSite.maxSlopeDeg}°)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">PSR PROXIMITY</span>
            <span className="font-semibold text-indigo-300">
              {selectedSite.psrDistanceKm} km to Ice Trap
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">PEAK SUNLIGHT</span>
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              {selectedSite.peakIlluminationPct}% synodic
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">BOULDER HAZARD</span>
            <span className="font-semibold text-slate-300">
              {selectedSite.boulderHazard}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}


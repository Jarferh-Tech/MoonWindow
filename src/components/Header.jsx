import React from 'react';
import { 
  Rocket, 
  Satellite, 
  HelpCircle, 
  FileText, 
  BarChart2, 
  Sparkles, 
  Calendar,
  Globe2
} from 'lucide-react';

export default function Header({ 
  currentMission, 
  presetMissions, 
  onSelectMission, 
  audienceMode, 
  setAudienceMode,
  onOpenTradeStudy,
  onOpenBriefing,
  onOpenEduGuide,
  simTime
}) {
  const formattedSimTime = new Date(simTime).toUTCString().replace('GMT', 'UTC');

  return (
    <header className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Title and Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <Rocket className="w-5 h-5 text-cyan-400 -rotate-45" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold font-heading tracking-wider text-slate-100 flex items-center gap-2">
                LUNAR LANDING SITE NAVIGATOR
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                NASA Space Apps
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SOUTH POLE SOLAR & DTE TELEMETRY ENGINE • LRO LOLA DATA
            </p>
          </div>
        </div>

        {/* Center: Mission Profile Selector & UTC Sim Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
            <Calendar className="w-3.5 h-3.5 text-amber-400 mr-2" />
            <span className="text-slate-400 mr-1.5">SIM EPOCH:</span>
            <span className="text-amber-300 font-semibold">{formattedSimTime}</span>
          </div>

          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1">
            <span className="text-xs text-slate-400 mr-2 font-mono hidden md:inline">MISSION:</span>
            <select
              value={currentMission?.id || ''}
              onChange={(e) => {
                const found = presetMissions.find(m => m.id === e.target.value);
                if (found) onSelectMission(found);
              }}
              className="bg-transparent text-xs text-cyan-300 font-medium focus:outline-none cursor-pointer"
            >
              {presetMissions.map(m => (
                <option key={m.id} value={m.id} className="bg-slate-900 text-slate-200">
                  {m.name} ({m.program})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Mode Switcher & Modal Action Triggers */}
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setAudienceMode('planner')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                audienceMode === 'planner'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Full scientific ephemeris, slope analysis, and margin breakdown"
            >
              Planner Mode
            </button>
            <button
              onClick={() => setAudienceMode('educator')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                audienceMode === 'educator'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Simplified visuals and guided science explanations"
            >
              Public / Edu
            </button>
          </div>

          {/* Trade study button */}
          <button
            onClick={onOpenTradeStudy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Compare Sites</span>
          </button>

          {/* Flight Briefing export button */}
          <button
            onClick={onOpenBriefing}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 hover:bg-cyan-900/50 text-cyan-200 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Flight Briefing</span>
          </button>

          {/* Educational guide button */}
          <button
            onClick={onOpenEduGuide}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-amber-300 transition-colors"
            title="Interactive South Pole Science Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}


import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Clock, 
  AlertOctagon,
  FastForward,
  Hourglass
} from 'lucide-react';

export default function TimelineControls({
  simTime,
  baseLaunchTime,
  launchSlipDays,
  setLaunchSlipDays,
  elapsedHours,
  setElapsedHours,
  durationDays,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  onReset
}) {
  const totalHours = durationDays * 24;

  const currentPercent = ((elapsedHours / totalHours) * 100).toFixed(1);

  // Quick slip buttons
  const slipPresets = [0, 1, 3, 7, 14];

  return (
    <div className="nasa-panel rounded-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        
        {/* Playback & Scrubber Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-lg shadow-amber-500/20'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-500/30'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play Ephemeris Animation'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={onReset}
            className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors"
            title="Reset Timeline to Landing Touchdown"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {[1, 5, 20, 50].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded transition-all ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500/30 text-cyan-200 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="text-xs font-mono">
            <span className="text-slate-400">MET: </span>
            <span className="text-cyan-300 font-bold">
              +{Math.floor(elapsedHours / 24)}d {Math.floor(elapsedHours % 24)}h
            </span>
            <span className="text-slate-500 ml-1">/ {durationDays}d</span>
          </div>
        </div>

        {/* Launch Slip Simulator Controls */}
        <div className="flex items-center flex-wrap gap-2 bg-slate-900/90 border border-amber-500/30 rounded-lg p-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-amber-300 mr-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span className="font-bold">LAUNCH SLIP SIMULATOR:</span>
          </div>

          <div className="flex items-center gap-1">
            {slipPresets.map(days => (
              <button
                key={days}
                onClick={() => setLaunchSlipDays(days)}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  launchSlipDays === days
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {days === 0 ? 'Nominal' : `+${days}d`}
              </button>
            ))}
          </div>

          {launchSlipDays > 0 && (
            <span className="text-[11px] text-amber-400 font-semibold ml-1 animate-pulse">
              [Shifted +{launchSlipDays * 24}h]
            </span>
          )}
        </div>

      </div>

      {/* Main Scrubber Slider */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mb-1.5">
          <span>T+00h (Touchdown)</span>
          <span className="text-cyan-300 font-semibold">
            Progress: {currentPercent}% ({elapsedHours.toFixed(1)} / {totalHours} hrs)
          </span>
          <span>T+{totalHours}h (Mission End)</span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={totalHours}
            step="0.5"
            value={elapsedHours}
            onChange={(e) => setElapsedHours(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>
      </div>
    </div>
  );
}


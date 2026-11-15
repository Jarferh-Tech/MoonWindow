import React from 'react';
import { 
  Sun, 
  Radio, 
  BatteryCharging, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function PowerCommGantt({
  timeSeriesData,
  elapsedHours,
  durationDays,
  setElapsedHours,
  launchSlipDays
}) {
  const { points, metrics } = timeSeriesData;
  const totalHours = durationDays * 24;

  // Fraction for progress needle
  const needlePercent = Math.min(100, Math.max(0, (elapsedHours / totalHours) * 100));

  return (
    <div className="nasa-panel rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Mission Duration Ephemeris Profile</span>
          <h3 className="text-base font-bold font-heading text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            POWER GENERATION & DTE COMMUNICATION TIMELINE
          </h3>
        </div>

        {launchSlipDays > 0 && (
          <div className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40">
            ⚠ SIMULATING +{launchSlipDays}d LAUNCH SLIP
          </div>
        )}
      </div>

      {/* Summary KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 font-mono text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
          <span className="text-slate-500 block text-[10px] flex items-center gap-1">
            <Sun className="w-3 h-3 text-amber-400" /> SUNLIT RATIO
          </span>
          <span className="text-base font-bold text-amber-300">
            {metrics.sunlitPercentage}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {metrics.totalSunlitHours} / {metrics.totalHours} hrs
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
          <span className="text-slate-500 block text-[10px] flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-400" /> MAX CONT. SUN
          </span>
          <span className="text-base font-bold text-emerald-400">
            {metrics.maxContinuousSunHours} hrs
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Continuous array power
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
          <span className="text-slate-500 block text-[10px] flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" /> MAX SHADOW
          </span>
          <span className={`text-base font-bold ${metrics.maxContinuousShadowHours > 72 ? 'text-rose-400' : 'text-slate-200'}`}>
            {metrics.maxContinuousShadowHours} hrs
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Battery discharge demand
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5">
          <span className="text-slate-500 block text-[10px] flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" /> DTE COVERAGE
          </span>
          <span className="text-base font-bold text-cyan-300">
            {metrics.dtePercentage}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {metrics.totalDteHours} / {metrics.totalHours} hrs
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 col-span-2 sm:col-span-1">
          <span className="text-slate-500 block text-[10px] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" /> MAX BLACKOUT
          </span>
          <span className={`text-base font-bold ${metrics.maxDteBlackoutHours > 24 ? 'text-amber-400' : 'text-slate-200'}`}>
            {metrics.maxDteBlackoutHours} hrs
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Buffer telemetry needed
          </span>
        </div>
      </div>

      {/* Strip 1: Solar Illumination & Power Strip */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">SOLAR ILLUMINATION WINDOWS</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Green: Sunlit (Array Active) • Gray: Crater Shadow
          </span>
        </div>

        <div 
          className="relative h-7 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickFrac = (e.clientX - rect.left) / rect.width;
            setElapsedHours(clickFrac * totalHours);
          }}
        >
          {points.map((pt, i) => {
            const isLast = i === points.length - 1;
            const widthPct = (1 / points.length) * 100;
            return (
              <div
                key={i}
                className="h-full transition-opacity hover:opacity-80"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: pt.sun.isVisible 
                    ? `rgba(251, 191, 36, ${Math.max(0.3, pt.sun.powerPercent / 100)})` 
                    : '#1e293b'
                }}
                title={`T+${pt.elapsedHours}h: Sun ${pt.sun.elevation.toFixed(1)}° (${pt.sun.isVisible ? 'Sunlit' : 'Shadow'})`}
              />
            );
          })}

          {/* Current Scrubber Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg shadow-white z-10 pointer-events-none"
            style={{ left: `${needlePercent}%` }}
          >
            <div className="w-2.5 h-2.5 bg-white -ml-1 rounded-full shadow -mt-0.5"></div>
          </div>
        </div>
      </div>

      {/* Strip 2: Direct-To-Earth (DTE) Communication Strip */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">DIRECT-TO-EARTH (DTE) COMM WINDOWS</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Cyan: Direct LOS Active • Red: Terrain Occulted
          </span>
        </div>

        <div 
          className="relative h-7 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickFrac = (e.clientX - rect.left) / rect.width;
            setElapsedHours(clickFrac * totalHours);
          }}
        >
          {points.map((pt, i) => {
            const widthPct = (1 / points.length) * 100;
            return (
              <div
                key={i}
                className="h-full transition-opacity hover:opacity-80"
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: pt.earth.isVisible ? '#0284c7' : '#991b1b'
                }}
                title={`T+${pt.elapsedHours}h: Earth ${pt.earth.elevation.toFixed(1)}° (${pt.earth.dteStatus})`}
              />
            );
          })}

          {/* Current Scrubber Needle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg shadow-white z-10 pointer-events-none"
            style={{ left: `${needlePercent}%` }}
          >
            <div className="w-2.5 h-2.5 bg-white -ml-1 rounded-full shadow -mt-0.5"></div>
          </div>
        </div>
      </div>

    </div>
  );
}


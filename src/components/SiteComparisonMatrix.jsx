import React, { useState } from 'react';
import { 
  X, 
  BarChart2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  Download, 
  Sun, 
  Radio, 
  Mountain, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { generateSiteTimeSeries, calculateFeasibilityScore } from '../utils/lunarMath';

export default function SiteComparisonMatrix({
  sites,
  currentSimStartMs,
  durationDays,
  onSelectSite,
  onClose
}) {
  const [weights, setWeights] = useState({
    solar: 0.35,
    dte: 0.30,
    slope: 0.20,
    science: 0.15
  });

  // Calculate metrics and scores for all sites dynamically
  const evaluatedSites = sites.map(site => {
    const timeSeries = generateSiteTimeSeries(site, currentSimStartMs, durationDays, 4);
    const score = calculateFeasibilityScore(site, timeSeries.metrics, weights);
    return {
      site,
      metrics: timeSeries.metrics,
      score
    };
  }).sort((a, b) => b.score.totalScore - a.score.totalScore);

  const exportCsv = () => {
    let csv = "Designation,Site Name,Latitude,Longitude,Elevation(m),Sunlit(%),MaxSunStreak(h),MaxShadow(h),DTE(%),MaxBlackout(h),Slope(deg),ScienceScore,CompositeScore,Status\n";
    evaluatedSites.forEach(({ site, metrics, score }) => {
      csv += `"${site.designation}","${site.shortName}",${site.lat},${site.lon},${site.elevationM},${metrics.sunlitPercentage},${metrics.maxContinuousSunHours},${metrics.maxContinuousShadowHours},${metrics.dtePercentage},${metrics.maxDteBlackoutHours},${site.averageSlopeDeg},${site.scienceValueScore},${score.totalScore},"${score.recommendation}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lunar_site_trade_study_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Multi-Criteria Decision Analysis</span>
            <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-cyan-400" />
              CANDIDATE LANDING SITE TRADE STUDY & COMPARISON
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weights Customizer Bar */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>TRADE-OFF WEIGHTS:</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar ({(weights.solar * 100).toFixed(0)}%):</span>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={weights.solar}
                onChange={(e) => setWeights({ ...weights, solar: parseFloat(e.target.value) })}
                className="w-16 accent-amber-400"
              />
            </label>

            <label className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>DTE ({(weights.dte * 100).toFixed(0)}%):</span>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.05"
                value={weights.dte}
                onChange={(e) => setWeights({ ...weights, dte: parseFloat(e.target.value) })}
                className="w-16 accent-cyan-400"
              />
            </label>

            <label className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-emerald-400" />
              <span>Slopes ({(weights.slope * 100).toFixed(0)}%):</span>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.slope}
                onChange={(e) => setWeights({ ...weights, slope: parseFloat(e.target.value) })}
                className="w-16 accent-emerald-400"
              />
            </label>

            <label className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Science ({(weights.science * 100).toFixed(0)}%):</span>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.05"
                value={weights.science}
                onChange={(e) => setWeights({ ...weights, science: parseFloat(e.target.value) })}
                className="w-16 accent-indigo-400"
              />
            </label>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 pl-2">Rank / Site</th>
                <th className="pb-3">Coordinates</th>
                <th className="pb-3">Sunlit %</th>
                <th className="pb-3">Max Shadow</th>
                <th className="pb-3">DTE Comm %</th>
                <th className="pb-3">Max Blackout</th>
                <th className="pb-3">Slope Hazard</th>
                <th className="pb-3">Composite Score</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {evaluatedSites.map(({ site, metrics, score }, idx) => (
                <tr key={site.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 pl-2 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-slate-100">{site.shortName}</div>
                        <div className="text-[10px] text-cyan-400">{site.designation}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 text-slate-300">
                    <div>{Math.abs(site.lat).toFixed(1)}°S, {site.lon.toFixed(1)}°E</div>
                    <div className="text-[10px] text-slate-500">{site.elevationM > 0 ? `+${site.elevationM}m` : `${site.elevationM}m`}</div>
                  </td>

                  <td className="py-3 text-amber-300 font-bold">
                    {metrics.sunlitPercentage}%
                    <span className="block text-[10px] text-slate-500 font-normal">
                      Max: {metrics.maxContinuousSunHours}h
                    </span>
                  </td>

                  <td className="py-3 text-slate-300">
                    <span className={metrics.maxContinuousShadowHours > 72 ? 'text-rose-400 font-bold' : ''}>
                      {metrics.maxContinuousShadowHours} hrs
                    </span>
                  </td>

                  <td className="py-3 text-cyan-300 font-bold">
                    {metrics.dtePercentage}%
                  </td>

                  <td className="py-3 text-slate-300">
                    <span className={metrics.maxDteBlackoutHours > 24 ? 'text-amber-400 font-bold' : ''}>
                      {metrics.maxDteBlackoutHours} hrs
                    </span>
                  </td>

                  <td className="py-3 text-slate-300">
                    <span className={site.averageSlopeDeg > 8 ? 'text-amber-400' : 'text-emerald-400'}>
                      {site.averageSlopeDeg}°
                    </span>
                  </td>

                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${score.badgeColor}`}>
                        {score.recommendation} ({score.totalScore}/100)
                      </span>
                    </div>
                  </td>

                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => {
                        onSelectSite(site);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-200 text-xs flex items-center gap-1 ml-auto"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Ranking accounts for {durationDays}-day mission duration starting from active sim epoch.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close Study
          </button>
        </div>

      </div>
    </div>
  );
}


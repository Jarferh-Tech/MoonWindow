import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SiteSelector from './components/SiteSelector';
import TimelineControls from './components/TimelineControls';
import HorizonRadar from './components/HorizonRadar';
import PolarMap from './components/PolarMap';
import PowerCommGantt from './components/PowerCommGantt';
import SiteComparisonMatrix from './components/SiteComparisonMatrix';
import CustomSiteModal from './components/CustomSiteModal';
import MissionBriefingModal from './components/MissionBriefingModal';
import EducationalGuideModal from './components/EducationalGuideModal';

import { CANDIDATE_SITES } from './data/landingSites';
import { PRESET_MISSIONS } from './data/missions';
import { 
  evaluateSiteConditions, 
  generateSiteTimeSeries, 
  calculateFeasibilityScore 
} from './utils/lunarMath';

export default function App() {
  const [sites, setSites] = useState(CANDIDATE_SITES);
  const [selectedSite, setSelectedSite] = useState(CANDIDATE_SITES[0]);
  const [currentMission, setCurrentMission] = useState(PRESET_MISSIONS[0]);

  // Mission simulation state
  const [launchSlipDays, setLaunchSlipDays] = useState(0);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  const [audienceMode, setAudienceMode] = useState('planner'); // 'planner' or 'educator'

  // Modals state
  const [isTradeStudyOpen, setIsTradeStudyOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isEduGuideOpen, setIsEduGuideOpen] = useState(false);
  const [isCustomSiteOpen, setIsCustomSiteOpen] = useState(false);

  // Compute actual base launch epoch and current simulation timestamp
  const baseLaunchMs = useMemo(() => {
    return new Date(currentMission.launchDate).getTime();
  }, [currentMission]);

  const effectiveLaunchMs = useMemo(() => {
    return baseLaunchMs + launchSlipDays * 86400 * 1000;
  }, [baseLaunchMs, launchSlipDays]);

  const currentSimTimeMs = useMemo(() => {
    return effectiveLaunchMs + elapsedHours * 3600 * 1000;
  }, [effectiveLaunchMs, elapsedHours]);

  // Compute live conditions for current scrubber position
  const currentConditions = useMemo(() => {
    return evaluateSiteConditions(selectedSite, currentSimTimeMs);
  }, [selectedSite, currentSimTimeMs]);

  // Compute full duration time series and metrics
  const timeSeriesData = useMemo(() => {
    return generateSiteTimeSeries(
      selectedSite, 
      effectiveLaunchMs, 
      currentMission.durationDays, 
      1.5 // 1.5-hour resolution for high performance
    );
  }, [selectedSite, effectiveLaunchMs, currentMission.durationDays]);

  // Compute composite feasibility score
  const feasibility = useMemo(() => {
    return calculateFeasibilityScore(selectedSite, timeSeriesData.metrics);
  }, [selectedSite, timeSeriesData.metrics]);

  // Mission selection handler
  const handleSelectMission = (mission) => {
    setCurrentMission(mission);
    setElapsedHours(0);
    setIsPlaying(false);
    // Find target site if pre-set
    const targetSite = sites.find(s => s.id === mission.targetSiteId);
    if (targetSite) setSelectedSite(targetSite);
  };

  // Add custom site handler
  const handleAddCustomSite = (newSite) => {
    setSites(prev => [newSite, ...prev]);
    setSelectedSite(newSite);
  };

  // Playback timer loop
  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setElapsedHours(prev => {
          const maxHours = currentMission.durationDays * 24;
          const next = prev + (playbackSpeed * 0.2);
          if (next >= maxHours) {
            setIsPlaying(false);
            return maxHours;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, playbackSpeed, currentMission.durationDays]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 grid-bg">
      {/* Header */}
      <Header
        currentMission={currentMission}
        presetMissions={PRESET_MISSIONS}
        onSelectMission={handleSelectMission}
        audienceMode={audienceMode}
        setAudienceMode={setAudienceMode}
        onOpenTradeStudy={() => setIsTradeStudyOpen(true)}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenEduGuide={() => setIsEduGuideOpen(true)}
        simTime={currentSimTimeMs}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        
        {/* Candidate Site Selector Bar */}
        <SiteSelector
          sites={sites}
          selectedSite={selectedSite}
          onSelectSite={(site) => {
            setSelectedSite(site);
          }}
          onOpenCustomSite={() => setIsCustomSiteOpen(true)}
          feasibility={feasibility}
        />

        {/* Dual Primary Visualization Panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Left: 360° Local Sky & Horizon Radar */}
          <HorizonRadar
            site={selectedSite}
            currentConditions={currentConditions}
            audienceMode={audienceMode}
          />

          {/* Right: 2D Polar Stereographic & 3D Globe Visualizer */}
          <PolarMap
            sites={sites}
            selectedSite={selectedSite}
            onSelectSite={setSelectedSite}
            currentConditions={currentConditions}
          />
        </div>

        {/* Power & Comm Ephemeris Gantt Strip */}
        <PowerCommGantt
          timeSeriesData={timeSeriesData}
          elapsedHours={elapsedHours}
          durationDays={currentMission.durationDays}
          setElapsedHours={setElapsedHours}
          launchSlipDays={launchSlipDays}
        />

        {/* Interactive Timeline Scrubber & Launch Slip Simulator */}
        <TimelineControls
          simTime={currentSimTimeMs}
          baseLaunchTime={baseLaunchMs}
          launchSlipDays={launchSlipDays}
          setLaunchSlipDays={setLaunchSlipDays}
          elapsedHours={elapsedHours}
          setElapsedHours={setElapsedHours}
          durationDays={currentMission.durationDays}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          onReset={() => {
            setElapsedHours(0);
            setIsPlaying(false);
          }}
        />

      </main>

      {/* Modals */}
      {isTradeStudyOpen && (
        <SiteComparisonMatrix
          sites={sites}
          currentSimStartMs={effectiveLaunchMs}
          durationDays={currentMission.durationDays}
          onSelectSite={(site) => setSelectedSite(site)}
          onClose={() => setIsTradeStudyOpen(false)}
        />
      )}

      {isCustomSiteOpen && (
        <CustomSiteModal
          onAddSite={handleAddCustomSite}
          onClose={() => setIsCustomSiteOpen(false)}
        />
      )}

      {isBriefingOpen && (
        <MissionBriefingModal
          site={selectedSite}
          mission={currentMission}
          timeSeriesData={timeSeriesData}
          feasibility={feasibility}
          simTime={currentSimTimeMs}
          launchSlipDays={launchSlipDays}
          onClose={() => setIsBriefingOpen(false)}
        />
      )}

      {isEduGuideOpen && (
        <EducationalGuideModal
          onClose={() => setIsEduGuideOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NASA Space Apps Challenge 2026 • Lunar Landing Site Navigator</span>
          <span>Ephemeris: SPICE/Libration Model • Topography: NASA LRO LOLA DEM</span>
        </div>
      </footer>
    </div>
  );
}


import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sun, 
  Globe2, 
  Radio, 
  Mountain, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function EducationalGuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('south-pole');

  const topics = [
    {
      id: 'south-pole',
      title: '1. Why the Lunar South Pole?',
      icon: Sparkles,
      content: (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-cyan-300 font-heading">The Target of 21st Century Deep Space Exploration</h4>
          <p className="leading-relaxed">
            Unlike Apollo missions which landed near the warm, flat lunar equator, the Artemis program and robotic commercial landers (CLPS) target the <strong>Lunar South Pole</strong>.
          </p>
          <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
            <span className="font-bold text-indigo-300 block mb-1">Permanently Shadowed Regions (PSRs):</span>
            Deep crater interiors that haven't seen a ray of sunlight in over 2 billion years. Temperatures plunge below <strong>40 Kelvin (-233°C)</strong>, preserving ancient deposits of water ice and volatile organic molecules that can be converted into drinking water, oxygen, and rocket propellant.
          </div>
          <p className="leading-relaxed">
            By landing on high ridges bordering PSRs (such as Shackleton Crater Rim or Connecting Ridge), astronauts and rovers can harvest solar power on the rim while exploring ice deposits in the dark depths.
          </p>
        </div>
      )
    },
    {
      id: 'grazing-sun',
      title: '2. The Grazing Sun Dilemma',
      icon: Sun,
      content: (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-amber-300 font-heading">A Sun That Skims the Horizon Like a Carousel</h4>
          <p className="leading-relaxed">
            Earth's axial tilt is 23.5°, creating our distinct seasons. The Moon's axial tilt relative to the ecliptic is only <strong>1.54°</strong>.
          </p>
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30">
            <span className="font-bold text-amber-300 block mb-1">The Extreme Low Solar Angle:</span>
            At the South Pole, the Sun never climbs high in the sky. It perpetually skims the horizon at an elevation of only <strong>+0.5° to +1.5°</strong>, circling 360° around the local landscape over a 29.5-day synodic month.
          </div>
          <p className="leading-relaxed">
            Because the Sun is so low, even a small boulder or a gentle 3° crater rim casts shadows that stretch for <strong>dozens of kilometers</strong>. If a lander touches down on the wrong side of a ridge, it faces weeks of freezing darkness.
          </p>
        </div>
      )
    },
    {
      id: 'libration-wobble',
      title: '3. Earth\'s Libration Wobble',
      icon: Globe2,
      content: (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-cyan-300 font-heading">Why Earth Bobs Above and Below the Horizon</h4>
          <p className="leading-relaxed">
            The Moon is tidally locked to Earth, meaning the same face always points toward us. On the lunar equator, Earth is always directly overhead.
          </p>
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
            <span className="font-bold text-cyan-300 block mb-1">Optical and Physical Libration:</span>
            Because the Moon's orbit is elliptical (eccentricity 0.055) and tilted relative to its equator, the Moon appears to "nod" up and down by <strong>±6.7°</strong> and "shake its head" left and right by <strong>±7.9°</strong>.
          </div>
          <p className="leading-relaxed">
            From the South Pole, Earth sits right on the edge of the horizon. Over a 27.3-day cycle, this libration wobble causes Earth to slowly dip behind mountains and crater rims, severing <strong>Direct-To-Earth (DTE) communication</strong> unless relay orbiters or elevated summits (like Malapert Massif) are used.
          </p>
        </div>
      )
    },
    {
      id: 'launch-slips',
      title: '4. The Danger of Launch Slips',
      icon: Radio,
      content: (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-rose-300 font-heading">When Hours Can Make or Break a Mission</h4>
          <p className="leading-relaxed">
            Rocket launches are notoriously unpredictable. Weather on Earth, cryogenic valve leaks, or orbital mechanics can delay a launch by 24 hours, 3 days, or two weeks.
          </p>
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30">
            <span className="font-bold text-rose-300 block mb-1">Dynamic Site Re-Evaluation:</span>
            On Mars or the lunar equator, a 3-day launch delay simply shifts touchdown by 3 days with minimal impact on local day/night. At the lunar South Pole, the Sun is slowly rotating around the horizon. A 3-day delay could mean landing directly into a mountain's shadow just as solar power was expected!
          </div>
          <p className="leading-relaxed">
            Our <strong>Launch Slip Simulator</strong> allows engineers and planners to instantly see what happens if the flight slips, identifying backup candidate sites with overlapping illumination windows.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Educational & Public Science Explorer</span>
            <h2 className="text-lg font-bold font-heading text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              UNDERSTANDING THE LUNAR SOUTH POLE
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body with Left Tabs and Right Detail */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Tabs */}
          <div className="sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-800 p-3 space-y-1 bg-slate-900/30">
            {topics.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/40 font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{t.title}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Detail View */}
          <div className="flex-1 p-6 overflow-y-auto text-xs text-slate-300 font-sans leading-relaxed scrollbar-thin">
            {topics.find(t => t.id === activeTab)?.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Prepared for NASA Space Apps Challenge 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}


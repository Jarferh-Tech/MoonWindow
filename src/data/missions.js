/**
 * Preset NASA and Commercial Mission Scenarios
 */

export const PRESET_MISSIONS = [
  {
    id: 'artemis-iii',
    name: 'Artemis III Crewed Landing',
    program: 'NASA Artemis',
    targetSiteId: 'shackleton-connecting-ridge',
    launchDate: '2026-12-05T12:00:00Z',
    durationDays: 14,
    minContinuousSunHoursRequired: 120,
    maxDteBlackoutHoursAllowed: 12,
    maxSlopeToleranceDeg: 10,
    objectives: 'First crewed lunar south pole landing, deployment of Artemis lunar surface experiments, EVA ice sampling along crater rim.'
  },
  {
    id: 'viper-rover',
    name: 'VIPER Volatiles Prospecting',
    program: 'NASA CLPS / VIPER',
    targetSiteId: 'nobile-rim-viper',
    launchDate: '2026-11-10T08:00:00Z',
    durationDays: 28,
    minContinuousSunHoursRequired: 160,
    maxDteBlackoutHoursAllowed: 24,
    maxSlopeToleranceDeg: 8,
    objectives: '100-day mobile volatiles mapping, sub-surface 1m drill sampling, real-time spectrometer hydrogen analysis in shadowed terrain.'
  },
  {
    id: 'clps-im2',
    name: 'CLPS Nova-C (IM-2 / PRIME-1)',
    program: 'Intuitive Machines / CLPS',
    targetSiteId: 'malapert-massif',
    launchDate: '2027-01-15T00:00:00Z',
    durationDays: 12,
    minContinuousSunHoursRequired: 100,
    maxDteBlackoutHoursAllowed: 6,
    maxSlopeToleranceDeg: 12,
    objectives: 'Ice drill demonstration, mass spectrometer volatile analysis, LTE communication test at Malapert Massif high ground.'
  },
  {
    id: 'lunar-base-camp',
    name: 'Artemis Base Camp Site Trade Study',
    program: 'NASA Moon to Mars Architecture',
    targetSiteId: 'peak-of-eternal-light',
    launchDate: '2027-03-21T06:00:00Z',
    durationDays: 30,
    minContinuousSunHoursRequired: 300,
    maxDteBlackoutHoursAllowed: 18,
    maxSlopeToleranceDeg: 10,
    objectives: 'Continuous habitat deployment assessment, megawatt-scale solar array placement, permanent comm relay baseline.'
  }
];


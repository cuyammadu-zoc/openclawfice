import type { MilitaryBranch } from '../components/types';

export interface OutfitConfig {
  title: string;
  themeColor: string;
  borderColor: string;
  overlayClassName: string;
}

export const OUTFITS: Record<MilitaryBranch, OutfitConfig> = {
  army: {
    title: 'U.S. Army',
    themeColor: '#4d7c0f',
    borderColor: '#a3e635',
    overlayClassName: 'military-outfit-army',
  },
  navy: {
    title: 'U.S. Navy',
    themeColor: '#1d4ed8',
    borderColor: '#93c5fd',
    overlayClassName: 'military-outfit-navy',
  },
  air_force: {
    title: 'U.S. Air Force',
    themeColor: '#0369a1',
    borderColor: '#7dd3fc',
    overlayClassName: 'military-outfit-air-force',
  },
  marines: {
    title: 'U.S. Marines',
    themeColor: '#b91c1c',
    borderColor: '#fca5a5',
    overlayClassName: 'military-outfit-marines',
  },
  coast_guard: {
    title: 'U.S. Coast Guard',
    themeColor: '#c2410c',
    borderColor: '#fdba74',
    overlayClassName: 'military-outfit-coast-guard',
  },
  space_force: {
    title: 'U.S. Space Force',
    themeColor: '#4338ca',
    borderColor: '#c4b5fd',
    overlayClassName: 'military-outfit-space-force',
  },
};

export function parseOutfit(rawOutfit?: string | null): MilitaryBranch | null {
  if (typeof rawOutfit !== 'string') return null;

  const normalized = rawOutfit.trim().toLowerCase().replace(/[ -]+/g, '_');
  return Object.prototype.hasOwnProperty.call(OUTFITS, normalized)
    ? normalized as MilitaryBranch
    : null;
}
// Ending selection (02 §10, 04 §3.2, 11 §3). Endings are data; this picks one.
import type { EndingSpec, RunState } from './types';
import { meetsRequirement } from './requirements';

const byPriority = (a: [string, EndingSpec], b: [string, EndingSpec]) => (b[1].priority ?? 0) - (a[1].priority ?? 0);

// The forced ending that holds right now, highest priority first, or null.
export function forcedEnding(state: RunState, endings: Record<string, EndingSpec>): string | null {
  const hit = Object.entries(endings)
    .filter(([, e]) => e.forcedWhen && meetsRequirement(state, e.forcedWhen))
    .sort(byPriority)[0];
  return hit ? hit[0] : null;
}

// Run-end evaluation: the highest-priority evaluated ending whose requires
// pass, else the fallback. Forced endings are never candidates here.
export function evaluateEnding(state: RunState, endings: Record<string, EndingSpec>): string {
  const evaluated = Object.entries(endings).filter(([, e]) => !e.forcedWhen);
  const hit = evaluated.filter(([, e]) => !e.fallback && meetsRequirement(state, e.requires)).sort(byPriority)[0];
  if (hit) return hit[0];
  const fallback = evaluated.find(([, e]) => e.fallback);
  if (!fallback) throw new Error('no ending matched and no fallback ending is defined');
  return fallback[0];
}

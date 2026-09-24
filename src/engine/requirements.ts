// Evaluates 04 §3 `requires` blocks against the run state.
import type { Requirement, RunState, StatKey, TrackKey } from './types';

export function meetsRequirement(state: RunState, req: Requirement | undefined): boolean {
  if (!req) return true;
  if (req.flags?.some((f) => !state.flags.has(f))) return false;
  if (req.flagsNot?.some((f) => state.flags.has(f))) return false;
  if (req.itemsAny && !req.itemsAny.some((i) => state.items.has(i))) return false;
  for (const [stat, floor] of Object.entries(req.stats ?? {})) {
    if (state.stats[stat as StatKey] < (floor as number)) return false;
  }
  for (const [track, floor] of Object.entries(req.min ?? {})) {
    if (state[track as TrackKey] < (floor as number)) return false;
  }
  for (const [track, ceiling] of Object.entries(req.max ?? {})) {
    if (state[track as TrackKey] > (ceiling as number)) return false;
  }
  for (const [name, floor] of Object.entries(req.countersMin ?? {})) {
    if ((state.counters[name] ?? 0) < floor) return false;
  }
  for (const [name, ceiling] of Object.entries(req.countersMax ?? {})) {
    if ((state.counters[name] ?? 0) > ceiling) return false;
  }
  if (req.anyOf && !req.anyOf.some((r) => meetsRequirement(state, r))) return false;
  return true;
}

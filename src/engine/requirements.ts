// Evaluates 04 §3 `requires` blocks against the run state.
import type { CheckSpec, Choice, Requirement, RunState, StatKey, StoryEvent, TrackKey } from './types';

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

// Sum of a check's `mods` whose `when` holds (04 §3 check mods).
export function checkModPct(state: RunState, check: CheckSpec): number {
  return (check.mods ?? []).reduce((sum, m) => sum + (meetsRequirement(state, m.when) ? m.pct : 0), 0);
}

// Choices the player can see (visibleIf) and, of those, can pick (requires).
export function visibleChoices(state: RunState, event: StoryEvent): Choice[] {
  return event.choices.filter((c) => meetsRequirement(state, c.visibleIf));
}

export function availableChoices(state: RunState, event: StoryEvent): Choice[] {
  return visibleChoices(state, event).filter((c) => meetsRequirement(state, c.requires));
}

// The event body plus any variant lines whose condition holds.
export function eventBody(state: RunState, event: StoryEvent): string {
  const extra = (event.bodyVariants ?? []).filter((v) => meetsRequirement(state, v.when)).map((v) => v.text);
  return [event.body, ...extra].join(' ');
}

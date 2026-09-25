// GDD §8: weighted draw bag, no-repeat until exhausted then reshuffle.
// Simplified for the vertical slice: a single Act-1 pool, no location/season
// filtering yet (that's real EventDirector scope for later phases).
import type { Rng } from './rng';
import type { GameEvent } from './types';

// Events that can be drawn at random in an act. Chain events never are.
export function poolFor(events: GameEvent[], act: number): GameEvent[] {
  return events.filter((e) => !e.inject && (e.acts ?? [1]).includes(act));
}

export function buildWeightedBag(events: GameEvent[], rng: Rng): string[] {
  const expanded: string[] = [];
  for (const e of events) {
    for (let i = 0; i < e.weight; i++) expanded.push(e.id);
  }
  return shuffle(expanded, rng);
}

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draws the next event id, skipping ids already resolved this run when a
// fresh (non-repeated) event is still available in the current bag pass.
// `isEligible` filters out events whose `requires` fail (04 §3). Preference
// order: fresh and eligible, then eligible repeat, then anything, so a
// badly-gated pool degrades to a repeat instead of stalling the run.
export function drawNext(
  bagRemaining: string[],
  bagAll: string[],
  drawnOnce: Set<string>,
  rng: Rng,
  isEligible: (id: string) => boolean = () => true
): { id: string; bagRemaining: string[] } {
  let bag = [...bagRemaining];
  const pick = (ok: (id: string) => boolean) => bag.findIndex(ok);
  let idx = pick((id) => !drawnOnce.has(id) && isEligible(id));
  if (idx < 0) idx = pick(isEligible);
  if (idx < 0) idx = 0;
  const id = bag[idx];
  bag.splice(idx, 1);
  if (bag.length === 0) {
    bag = shuffle(bagAll, rng);
  }
  return { id, bagRemaining: bag };
}

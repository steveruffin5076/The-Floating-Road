// GDD §8: weighted draw bag, no-repeat until exhausted then reshuffle.
// Simplified for the vertical slice: a single Act-1 pool, no location/season
// filtering yet (that's real EventDirector scope for later phases).
import type { Rng } from './rng';
import type { GameEvent } from './types';

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
export function drawNext(
  bagRemaining: string[],
  bagAll: string[],
  drawnOnce: Set<string>,
  rng: Rng
): { id: string; bagRemaining: string[] } {
  let bag = [...bagRemaining];
  // find the next entry whose underlying event hasn't been drawn this run,
  // if possible, before allowing a repeat within the same bag pass.
  const freshIndex = bag.findIndex((id) => !drawnOnce.has(id));
  const idx = freshIndex >= 0 ? freshIndex : 0;
  const id = bag[idx];
  bag.splice(idx, 1);
  if (bag.length === 0) {
    bag = shuffle(bagAll, rng);
  }
  return { id, bagRemaining: bag };
}

import type { Rng } from './rng';

// An Rng that returns the given values in order, then repeats the last one.
export function fixedRng(...values: number[]): Rng {
  let i = 0;
  const rng = (() => values[Math.min(i++, values.length - 1)]) as Rng;
  rng.getState = () => i;
  return rng;
}

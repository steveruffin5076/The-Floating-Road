// GDD §7.1: combat formula, chō-han bet, stance choices.
import type { Rng } from './rng';
import type { RunState } from './types';

export interface CombatSetup {
  youPower: number;
  foePower: number;
  baseWinPct: number; // before chō-han bet / stance
}

export function setupCombat(state: RunState, foePower: number, rng: Rng, winPctMod = 0): CombatSetup {
  const condition = -Math.floor(rng() * 11); // 0..-10 wear/fatigue drag (placeholder, see game-plan/06)
  const youPower =
    state.weaponTier * 4 + state.stats.chikara + state.stats.waza + state.armorBonus + condition;
  const baseWinPct = clampPct(50 + (youPower - foePower) * 6 + winPctMod);
  return { youPower, foePower, baseWinPct };
}

export type ChoHanCall = 'even' | 'odd' | 'skip';
export type Stance = 'aggressive' | 'defensive' | 'escape';

export function applyChoHan(
  baseWinPct: number,
  rng: Rng,
  call: ChoHanCall
): { winPct: number; correct: boolean | null; d1: number | null; d2: number | null } {
  if (call === 'skip') return { winPct: baseWinPct, correct: null, d1: null, d2: null };
  const d1 = 1 + Math.floor(rng() * 6);
  const d2 = 1 + Math.floor(rng() * 6);
  const isEven = (d1 + d2) % 2 === 0;
  const correct = (call === 'even') === isEven;
  // Intentional zero-EV variance injector: 0.5*(+20) + 0.5*(-20) = 0 (game-plan/02 §7.1)
  const winPct = clampPct(baseWinPct + (correct ? 20 : -20));
  return { winPct, correct, d1, d2 };
}

export function resolveCombat(rng: Rng, winPct: number): boolean {
  return rng() * 100 < winPct;
}

function clampPct(v: number): number {
  return Math.min(95, Math.max(5, v));
}

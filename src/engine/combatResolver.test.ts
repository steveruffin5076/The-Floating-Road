import { describe, expect, it } from 'vitest';
import { applyChoHan, resolveCombat, setupCombat } from './combatResolver';
import { mulberry32 } from './rng';
import { createInitialState } from './state';
import { fixedRng } from './testUtils';
import { STARTING_STATS } from '../content/tale';

const state = () => createInitialState({ ...STARTING_STATS }, [], mulberry32(1));

describe('setupCombat (02 §7.1)', () => {
  it('computes You = weapon_tier x 4 + Chikara + Waza + armor + condition', () => {
    const s = state();
    // rng 0 → condition 0; starting stats chikara 4 + waza 4, weaponTier 1, armor 0
    const setup = setupCombat(s, 8, fixedRng(0));
    expect(setup.youPower).toBe(12);
    expect(setup.baseWinPct).toBe(50 + (12 - 8) * 6);
  });

  it('applies a 0 to -10 condition drag', () => {
    const setup = setupCombat(state(), 8, fixedRng(0.999));
    expect(setup.youPower).toBe(2);
  });

  it('clamps win% to 5-95', () => {
    expect(setupCombat(state(), 40, fixedRng(0)).baseWinPct).toBe(5);
    expect(setupCombat(state(), 0, fixedRng(0)).baseWinPct).toBe(95);
  });
});

describe('applyChoHan', () => {
  it('moves win% by exactly +/-20 and leaves it alone on skip', () => {
    // dice 1+1 = 2, even
    expect(applyChoHan(50, fixedRng(0, 0), 'even')).toMatchObject({ winPct: 70, correct: true, d1: 1, d2: 1 });
    expect(applyChoHan(50, fixedRng(0, 0), 'odd')).toMatchObject({ winPct: 30, correct: false });
    expect(applyChoHan(50, fixedRng(0, 0), 'skip')).toEqual({ winPct: 50, correct: null, d1: null, d2: null });
  });

  it('is zero expected value away from the clamps (02 §7.1)', () => {
    const rng = mulberry32(2026);
    let total = 0;
    const n = 100_000;
    for (let i = 0; i < n; i++) total += applyChoHan(50, rng, i % 2 ? 'even' : 'odd').winPct - 50;
    expect(Math.abs(total / n)).toBeLessThan(0.3);
  });
});

describe('resolveCombat', () => {
  it('wins when the roll is under win%', () => {
    expect(resolveCombat(fixedRng(0.59), 60)).toBe(true);
    expect(resolveCombat(fixedRng(0.6), 60)).toBe(false);
  });
});

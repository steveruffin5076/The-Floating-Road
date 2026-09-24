import { describe, expect, it } from 'vitest';
import { isNearFloor, previewCheck, resolveCheck } from './checkResolver';
import { fixedRng } from './testUtils';

describe('previewCheck (02 §6)', () => {
  it('follows 50 + (stat - DC) x 8', () => {
    expect(previewCheck(5, 6, 0).successPct).toBe(42);
    expect(previewCheck(6, 6, 0).successPct).toBe(50);
    expect(previewCheck(8, 6, 0).successPct).toBe(66);
  });

  it('clamps to 5-95', () => {
    expect(previewCheck(1, 10, 0).successPct).toBe(5);
    expect(previewCheck(15, 8, 0).successPct).toBe(95);
  });

  it('auto-succeeds only on DC <= 4 with a margin of +6 or more', () => {
    expect(previewCheck(10, 4, 0)).toEqual({ autoSuccess: true, successPct: 100 });
    expect(previewCheck(9, 4, 0).autoSuccess).toBe(false);
    expect(previewCheck(15, 5, 0).autoSuccess).toBe(false); // moderate+ DCs always roll
  });

  it('adds scaling pity from the 2nd consecutive failure, capped at +25', () => {
    expect(previewCheck(5, 6, 0).successPct).toBe(42);
    expect(previewCheck(5, 6, 1).successPct).toBe(42);
    expect(previewCheck(5, 6, 2).successPct).toBe(47);
    expect(previewCheck(5, 6, 6).successPct).toBe(67);
    expect(previewCheck(5, 6, 20).successPct).toBe(67);
  });

  it('keeps the 95% ceiling even with pity', () => {
    expect(previewCheck(11, 6, 10).successPct).toBe(95);
  });
});

describe('resolveCheck', () => {
  it('passes when the roll is under the shown odds and fails otherwise', () => {
    expect(resolveCheck(fixedRng(0.41), 5, 6, 0).passed).toBe(true);
    expect(resolveCheck(fixedRng(0.42), 5, 6, 0).passed).toBe(false);
  });

  it('never consumes a roll on auto-success', () => {
    const rng = fixedRng(0.99);
    const out = resolveCheck(rng, 10, 4, 0);
    expect(out).toMatchObject({ passed: true, autoSuccess: true });
    expect(rng.getState()).toBe(0);
  });

  it('reports the pity bonus it applied', () => {
    expect(resolveCheck(fixedRng(0.5), 5, 6, 3).pityBonus).toBe(10);
  });
});

describe('isNearFloor', () => {
  it('flags margins of -6 or worse', () => {
    expect(isNearFloor(2, 8)).toBe(true);
    expect(isNearFloor(3, 8)).toBe(false);
  });
});

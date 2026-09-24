import { describe, expect, it } from 'vitest';
import { mulberry32 } from './rng';

describe('mulberry32', () => {
  it('is deterministic for a seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) expect(a()).toBe(b());
  });

  it('stays in [0, 1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 10_000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('resumes the exact sequence from getState() (save/resume relies on this)', () => {
    const original = mulberry32(123);
    for (let i = 0; i < 17; i++) original();
    const resumed = mulberry32(original.getState());
    for (let i = 0; i < 50; i++) expect(resumed()).toBe(original());
  });
});

import { describe, expect, it } from 'vitest';
import { evaluateEnding, forcedEnding } from './endings';
import { mulberry32 } from './rng';
import { createInitialState } from './state';
import type { EndingSpec } from './types';
import { ENDINGS } from '../content/endings';
import { STARTING_STATS } from '../content/tale';

const fresh = () => createInitialState({ ...STARTING_STATS }, [], mulberry32(1));
const e = (extra: Partial<EndingSpec>): EndingSpec => ({ title: 't', epilogue: 'e', historicalNote: 'n', ...extra });

describe('forcedEnding (built endings)', () => {
  it('returns death, despair and arrest in priority order', () => {
    const s = fresh();
    expect(forcedEnding(s, ENDINGS)).toBeNull();
    s.suspicion = 5;
    expect(forcedEnding(s, ENDINGS)).toBe('arrested');
    s.resolve = 0;
    expect(forcedEnding(s, ENDINGS)).toBe('despair');
    s.health = 0;
    expect(forcedEnding(s, ENDINGS)).toBe('death');
  });

  it('never fires the evaluated endings', () => {
    const s = fresh();
    s.items.add('fathers_letter');
    expect(forcedEnding(s, ENDINGS)).toBeNull();
  });
});

describe('evaluateEnding', () => {
  const endings = {
    fallback: e({ fallback: true }),
    low: e({ requires: { min: { reputation: 1 } }, priority: 1 }),
    high: e({ requires: { min: { reputation: 3 } }, priority: 5 }),
    forced: e({ forcedWhen: { max: { health: 0 } }, priority: 99 }),
  };

  it('picks the highest-priority match', () => {
    const s = fresh();
    s.reputation = 3;
    expect(evaluateEnding(s, endings)).toBe('high');
    s.reputation = 1;
    expect(evaluateEnding(s, endings)).toBe('low');
  });

  it('uses the fallback when nothing matches, and never picks a forced ending', () => {
    const s = fresh();
    s.health = 0;
    expect(evaluateEnding(s, endings)).toBe('fallback');
  });

  it('throws when nothing matches and there is no fallback', () => {
    expect(() => evaluateEnding(fresh(), { only: e({ requires: { flags: ['x'] } }) })).toThrow('no fallback');
  });
});

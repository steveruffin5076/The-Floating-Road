import { describe, expect, it } from 'vitest';
import { meetsRequirement } from './requirements';
import { mulberry32 } from './rng';
import { createInitialState } from './state';
import { STARTING_STATS } from '../content/tale';

const fresh = () => createInitialState({ ...STARTING_STATS }, [], mulberry32(1));

describe('meetsRequirement (04 §3 requires)', () => {
  it('passes when there is no requirement', () => {
    expect(meetsRequirement(fresh(), undefined)).toBe(true);
    expect(meetsRequirement(fresh(), {})).toBe(true);
  });

  it('checks flags and flagsNot', () => {
    const s = fresh();
    expect(meetsRequirement(s, { flags: ['refused_yui'] })).toBe(false);
    s.flags.add('refused_yui');
    expect(meetsRequirement(s, { flags: ['refused_yui'] })).toBe(true);
    expect(meetsRequirement(s, { flagsNot: ['refused_yui'] })).toBe(false);
  });

  it('checks itemsAny', () => {
    const s = fresh();
    expect(meetsRequirement(s, { itemsAny: ['fathers_letter', 'permit_good'] })).toBe(false);
    s.items.add('permit_good');
    expect(meetsRequirement(s, { itemsAny: ['fathers_letter', 'permit_good'] })).toBe(true);
  });

  it('treats stats as floors', () => {
    const s = fresh(); // chi 2
    expect(meetsRequirement(s, { stats: { chi: 2 } })).toBe(true);
    expect(meetsRequirement(s, { stats: { chi: 3 } })).toBe(false);
  });

  it('checks track floors and ceilings', () => {
    const s = fresh(); // money 300, suspicion 0
    expect(meetsRequirement(s, { min: { money: 100 } })).toBe(true);
    expect(meetsRequirement(s, { min: { money: 301 } })).toBe(false);
    s.suspicion = 2;
    expect(meetsRequirement(s, { max: { suspicion: 1 } })).toBe(false);
    expect(meetsRequirement(s, { max: { suspicion: 2 } })).toBe(true);
    s.gi = -3;
    expect(meetsRequirement(s, { max: { gi: -3 } })).toBe(true); // "Gi/Aku ≤ −3"
  });

  it('treats missing counters as 0', () => {
    const s = fresh();
    expect(meetsRequirement(s, { countersMax: { employer_contracts: 0 } })).toBe(true);
    expect(meetsRequirement(s, { countersMin: { employer_contracts: 2 } })).toBe(false);
    s.counters.employer_contracts = 2;
    expect(meetsRequirement(s, { countersMin: { employer_contracts: 2 } })).toBe(true);
  });

  it('supports OR through anyOf, combined with other conditions by AND', () => {
    const s = fresh(); // chi 2, kuchi 2
    const req = { anyOf: [{ stats: { chi: 8 } }, { stats: { kuchi: 8 } }], max: { suspicion: 2 } };
    expect(meetsRequirement(s, req)).toBe(false);
    s.stats.kuchi = 8;
    expect(meetsRequirement(s, req)).toBe(true);
    s.suspicion = 3;
    expect(meetsRequirement(s, req)).toBe(false);
  });
});

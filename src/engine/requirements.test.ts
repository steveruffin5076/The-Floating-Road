import { describe, expect, it } from 'vitest';
import { availableChoices, checkModPct, eventBody, meetsRequirement, visibleChoices } from './requirements';
import type { StoryEvent } from './types';
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

describe('checkModPct', () => {
  it('sums the mods whose condition holds', () => {
    const s = fresh();
    const check = {
      stat: 'kuchi' as const,
      dc: 5,
      mods: [
        { when: { flags: ['river_fool'] }, pct: -5 },
        { when: { flags: ['crest_honored'] }, pct: 10 },
      ],
    };
    expect(checkModPct(s, check)).toBe(0);
    s.flags.add('crest_honored');
    expect(checkModPct(s, check)).toBe(10);
    s.flags.add('river_fool');
    expect(checkModPct(s, check)).toBe(5);
  });
});

describe('visibleIf, requires and body variants', () => {
  const event: StoryEvent = {
    id: 'e',
    type: 'story',
    title: 't',
    body: 'Yui pours the tea.',
    weight: 1,
    bodyVariants: [{ when: { flags: ['fujieda_intervened'] }, text: 'He has heard of the one at Fujieda.' }],
    choices: [
      { text: 'Refuse.', onResolve: { text: 'ok' } },
      {
        text: 'Go to the metsuke.',
        visibleIf: { flags: ['knows_the_plan'] },
        requires: { stats: { kuchi: 7 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Kuchi 7',
        onResolve: { text: 'ok' },
      },
    ],
  };

  it('hides a choice until visibleIf holds, then gates it on requires', () => {
    const s = fresh(); // kuchi 2
    expect(visibleChoices(s, event).map((c) => c.text)).toEqual(['Refuse.']);
    s.flags.add('knows_the_plan');
    expect(visibleChoices(s, event)).toHaveLength(2);
    expect(availableChoices(s, event)).toHaveLength(1);
    s.stats.kuchi = 7;
    expect(availableChoices(s, event)).toHaveLength(2);
  });

  it('appends body variants whose condition holds', () => {
    const s = fresh();
    expect(eventBody(s, event)).toBe('Yui pours the tea.');
    s.flags.add('fujieda_intervened');
    expect(eventBody(s, event)).toBe('Yui pours the tea. He has heard of the one at Fujieda.');
  });
});

import { describe, expect, it } from 'vitest';
import { mulberry32 } from './rng';
import { applyOutcomeEffects, createInitialState, grantLevelUp, noteCombatWin, withTraitRiders } from './state';
import { STARTING_STATS } from '../content/tale';
import { ACT1_EVENTS } from '../content/events.act1';

const fresh = () => createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, mulberry32(3));

describe('createInitialState', () => {
  it('starts with the documented rōnin loadout and vitals', () => {
    const s = fresh();
    expect(s).toMatchObject({ health: 20, healthMax: 20, resolve: 10, money: 300, suspicion: 0, weaponTier: 1, armorBonus: 0 });
    expect(s.bagAll).toHaveLength(ACT1_EVENTS.reduce((n, e) => n + e.weight, 0));
  });

  it('copies the starting stats rather than aliasing them', () => {
    const stats = { ...STARTING_STATS };
    const s = createInitialState(stats, [], mulberry32(1));
    s.stats.waza = 99;
    expect(stats.waza).toBe(STARTING_STATS.waza);
  });
});

describe('applyOutcomeEffects', () => {
  it('clamps every track to its range (02 §5)', () => {
    const s = fresh();
    applyOutcomeEffects(s, { text: 'a', effects: { health: 50, resolve: 50, suspicion: 50, reputation: 50, gi: 50 } });
    expect(s).toMatchObject({ health: 20, resolve: 10, suspicion: 5, reputation: 5, gi: 5 });
    applyOutcomeEffects(s, { text: 'b', effects: { health: -99, resolve: -99, money: -9999, suspicion: -99, reputation: -99, gi: -99 } });
    expect(s).toMatchObject({ health: 0, resolve: 0, money: 0, suspicion: 0, reputation: -5, gi: -5 });
  });

  it('sets and clears flags, bumps counters, and moves items', () => {
    const s = fresh();
    applyOutcomeEffects(s, { text: 'a', setFlags: ['knows_the_plan'], counters: { employer_contracts: 1 }, addItems: ['fathers_letter'] });
    applyOutcomeEffects(s, { text: 'b', counters: { employer_contracts: 2 } });
    expect(s.flags.has('knows_the_plan')).toBe(true);
    expect(s.counters.employer_contracts).toBe(3);
    expect(s.items.has('fathers_letter')).toBe(true);
    applyOutcomeEffects(s, { text: 'c', clearFlags: ['knows_the_plan'], removeItems: ['fathers_letter'], counters: { employer_contracts: -1 } });
    expect(s.flags.has('knows_the_plan')).toBe(false);
    expect(s.items.has('fathers_letter')).toBe(false);
    expect(s.counters.employer_contracts).toBe(2);
  });

  it('applies permanent stat changes within 1-15 (stat_delta)', () => {
    const s = fresh(); // waza 4
    applyOutcomeEffects(s, { text: 'fingers broken', statDelta: { waza: -1 } });
    expect(s.stats.waza).toBe(3);
    applyOutcomeEffects(s, { text: 'x', statDelta: { waza: -10, chi: 20 } });
    expect(s.stats.waza).toBe(1);
    expect(s.stats.chi).toBe(15);
  });

  it('queues spawned events', () => {
    const s = fresh();
    applyOutcomeEffects(s, { text: 'a', spawnEvents: ['t1_sagawa_sweep'] });
    expect(s.pendingSpawns).toEqual(['t1_sagawa_sweep']);
  });

  it('applies money_mult after deltas, rounding down', () => {
    const s = fresh(); // 300 mon
    applyOutcomeEffects(s, { text: 'robbed', effects: { money: 5 }, moneyMult: 0.5 });
    expect(s.money).toBe(152);
  });

  it('sets tracks to a value, clamped', () => {
    const s = fresh();
    applyOutcomeEffects(s, { text: 'wanted', setTracks: { suspicion: 9, health: 4 } });
    expect(s.suspicion).toBe(5);
    expect(s.health).toBe(4);
  });

  it('logs the outcome text', () => {
    const s = fresh();
    applyOutcomeEffects(s, { text: 'You walk on.' });
    expect(s.log.at(-1)).toBe('You walk on.');
  });
});

describe('grantLevelUp (02 §4.3)', () => {
  it('adds 2 to the stat, capped at 15, and 1 max health', () => {
    const s = fresh();
    s.stats.waza = 14;
    grantLevelUp(s, 'waza');
    expect(s.stats.waza).toBe(15);
    expect(s.healthMax).toBe(21);
    expect(s.levelUps).toBe(1);
  });
});

describe('withTraitRiders', () => {
  const bluff = { stat: 'kuchi' as const, dc: 5 };
  const caught = { text: 'He writes it down.', effects: { suspicion: 1 } };

  it('adds +1 Suspicion to a failed Kuchi check for Silver Tongue', () => {
    const s = fresh();
    s.flags.add('silver_tongue');
    expect(withTraitRiders(s, bluff, false, caught).effects?.suspicion).toBe(2);
  });

  it('leaves everything else alone', () => {
    const s = fresh();
    expect(withTraitRiders(s, bluff, false, caught)).toBe(caught); // no trait
    s.flags.add('silver_tongue');
    expect(withTraitRiders(s, bluff, true, caught)).toBe(caught); // passed
    expect(withTraitRiders(s, { stat: 'me', dc: 5 }, false, caught)).toBe(caught); // not Kuchi
    const noSuspicion = { text: 'Nothing comes of it.', effects: { money: -10 } };
    expect(withTraitRiders(s, bluff, false, noSuspicion)).toBe(noSuspicion);
  });

  it('does not mutate the authored outcome', () => {
    const s = fresh();
    s.flags.add('silver_tongue');
    withTraitRiders(s, bluff, false, caught);
    expect(caught.effects.suspicion).toBe(1);
  });
});

describe('noteCombatWin', () => {
  it('counts combat wins in the engine-maintained counter', () => {
    const s = fresh();
    noteCombatWin(s);
    noteCombatWin(s);
    expect(s.counters.combat_wins).toBe(2);
  });
});

import { describe, expect, it } from 'vitest';
import { mulberry32 } from './rng';
import { applyOutcomeEffects, checkForEnding, createInitialState, grantLevelUp, RUN_EVENT_TARGET } from './state';
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

describe('checkForEnding', () => {
  it('returns death, despair, arrest and completion in priority order', () => {
    const s = fresh();
    expect(checkForEnding(s)).toBeNull();
    s.eventsResolved = RUN_EVENT_TARGET;
    expect(checkForEnding(s)).toBe('reached_edo');
    s.suspicion = 5;
    expect(checkForEnding(s)).toBe('arrested');
    s.resolve = 0;
    expect(checkForEnding(s)).toBe('despair');
    s.health = 0;
    expect(checkForEnding(s)).toBe('death');
  });
});

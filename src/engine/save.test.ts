import { beforeEach, describe, expect, it } from 'vitest';
import { mulberry32 } from './rng';
import { clearSavedGame, hasSavedGame, loadGame, saveGame } from './save';
import { createInitialState } from './state';
import { STARTING_STATS } from '../content/tale';
import { ACT1_EVENTS } from '../content/events.act1';

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(k: string) {
    return this.data.has(k) ? this.data.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
});

describe('save/resume (02 §14)', () => {
  it('round-trips run state, including the drawnOnce Set', () => {
    const rng = mulberry32(77);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    state.drawnOnce.add('wayside_shrine');
    state.money = 123;
    saveGame(state, rng, { kind: 'event', eventId: 'day_labor' });

    const loaded = loadGame();
    expect(loaded).not.toBeNull();
    expect(loaded!.state.money).toBe(123);
    expect(loaded!.state.drawnOnce).toBeInstanceOf(Set);
    expect([...loaded!.state.drawnOnce]).toEqual(['wayside_shrine']);
    expect(loaded!.screen).toEqual({ kind: 'event', eventId: 'day_labor' });
  });

  it('round-trips flags, counters and items', () => {
    const rng = mulberry32(8);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    state.flags.add('refused_yui');
    state.counters.employer_contracts = 2;
    state.items.add('fathers_letter');
    saveGame(state, rng, { kind: 'rest' });
    const loaded = loadGame()!;
    expect(loaded.state.flags).toEqual(new Set(['refused_yui']));
    expect(loaded.state.counters).toEqual({ employer_contracts: 2 });
    expect(loaded.state.items).toEqual(new Set(['fathers_letter']));
  });

  it('migrates a v1 save (no flags, counters or items) instead of dropping it', () => {
    const rng = mulberry32(9);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    const { flags: _f, counters: _c, items: _i, act: _a, actEvent: _e, actSlotOf: _s, firedInjections: _fi, pendingSpawns: _p, pendingActAdvance: _t, ...v1State } = state;
    localStorage.setItem(
      'floating-road-save-v1',
      JSON.stringify({ version: 1, rngState: rng.getState(), screen: { kind: 'rest' }, state: { ...v1State, drawnOnce: [] } })
    );
    const loaded = loadGame()!;
    expect(loaded).not.toBeNull();
    expect(loaded.state.flags).toEqual(new Set());
    expect(loaded.state.counters).toEqual({});
    expect(loaded.state.items).toEqual(new Set());
    expect(loaded.state.money).toBe(state.money);
  });

  it('round-trips the act director state', () => {
    const rng = mulberry32(10);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    state.act = 2;
    state.actEvent = 5;
    state.actSlotOf = { t1_livelihood: 1 };
    state.firedInjections.add('t1_livelihood');
    state.pendingSpawns.push('t1_sagawa_sweep');
    saveGame(state, rng, { kind: 'rest' });
    const loaded = loadGame()!.state;
    expect(loaded).toMatchObject({ act: 2, actEvent: 5, actSlotOf: { t1_livelihood: 1 }, pendingSpawns: ['t1_sagawa_sweep'] });
    expect(loaded.firedInjections).toEqual(new Set(['t1_livelihood']));
  });

  it('migrates a v2 save: single act, actEvent from eventsResolved', () => {
    const rng = mulberry32(12);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    state.eventsResolved = 7;
    const { act: _a, actEvent: _e, actSlotOf: _s, firedInjections: _f, pendingSpawns: _p, pendingActAdvance: _t, ...v2 } = state;
    localStorage.setItem(
      'floating-road-save-v1',
      JSON.stringify({ version: 2, rngState: 1, screen: { kind: 'rest' }, state: { ...v2, drawnOnce: [], flags: [], items: [] } })
    );
    const loaded = loadGame()!.state;
    expect(loaded).toMatchObject({ act: 1, actEvent: 7, actSlotOf: {}, pendingSpawns: [], pendingActAdvance: false });
    expect(loaded.firedInjections).toEqual(new Set());
  });

  it('resumes the RNG exactly where it stopped', () => {
    const rng = mulberry32(5);
    const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
    saveGame(state, rng, { kind: 'rest' });
    const loaded = loadGame()!;
    for (let i = 0; i < 20; i++) expect(loaded.rng()).toBe(rng());
  });

  it('rejects a save from another version', () => {
    localStorage.setItem('floating-road-save-v1', JSON.stringify({ version: 999 }));
    expect(loadGame()).toBeNull();
    localStorage.setItem('floating-road-save-v1', JSON.stringify({ version: 0 }));
    expect(loadGame()).toBeNull();
  });

  it('rejects corrupt JSON instead of throwing', () => {
    localStorage.setItem('floating-road-save-v1', '{not json');
    expect(loadGame()).toBeNull();
  });

  it('reports and clears the slot', () => {
    expect(hasSavedGame()).toBe(false);
    const rng = mulberry32(1);
    saveGame(createInitialState({ ...STARTING_STATS }, [], rng), rng, { kind: 'rest' });
    expect(hasSavedGame()).toBe(true);
    clearSavedGame();
    expect(hasSavedGame()).toBe(false);
  });
});

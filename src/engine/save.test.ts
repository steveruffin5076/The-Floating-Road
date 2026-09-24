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

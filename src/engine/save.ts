// GDD §14 "save anywhere". A single localStorage slot, checkpointed on every
// screen transition (see main.ts's render()) so refreshing mid-run resumes
// exactly where the player left off, combat included.
import type { RunState } from './types';
import type { CombatSetup } from './combatResolver';
import { mulberry32, type Rng } from './rng';

const SAVE_KEY = 'floating-road-save-v1';
const SAVE_VERSION = 2; // v2 adds flags, counters, items; v1 saves are migrated

export type SavedScreen =
  | { kind: 'event'; eventId: string }
  | {
      kind: 'combat';
      eventId: string;
      step: 'chohan' | 'stance' | 'resolved';
      setup: CombatSetup;
      winPct: number;
      betResult: { correct: boolean | null; d1: number | null; d2: number | null } | null;
      outcomeText?: string;
    }
  | { kind: 'levelup' }
  | { kind: 'rest' }
  | { kind: 'ending'; endingId: string };

type SetFields = 'drawnOnce' | 'flags' | 'items';

interface SaveFile {
  version: number;
  rngState: number;
  screen: SavedScreen;
  state: Omit<RunState, SetFields> & { drawnOnce: string[]; flags?: string[]; items?: string[] };
}

export function saveGame(state: RunState, rng: Rng, screen: SavedScreen): void {
  const file: SaveFile = {
    version: SAVE_VERSION,
    rngState: rng.getState(),
    screen,
    state: { ...state, drawnOnce: [...state.drawnOnce], flags: [...state.flags], items: [...state.items] },
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(file));
  } catch {
    // Best-effort: private browsing / full quota just means no save this time.
  }
}

export function loadGame(): { state: RunState; rng: Rng; screen: SavedScreen } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const file = JSON.parse(raw) as SaveFile;
    if (file.version !== SAVE_VERSION && file.version !== 1) return null;
    // v1 predates flags/counters/items; they start empty.
    const { drawnOnce, flags, items, ...rest } = file.state;
    const state: RunState = {
      ...rest,
      counters: rest.counters ?? {},
      drawnOnce: new Set(drawnOnce),
      flags: new Set(flags ?? []),
      items: new Set(items ?? []),
    };
    return { state, rng: mulberry32(file.rngState), screen: file.screen };
  } catch {
    return null;
  }
}

export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

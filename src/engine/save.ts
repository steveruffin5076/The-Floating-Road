// GDD §14 "save anywhere". A single localStorage slot, checkpointed on every
// screen transition (see main.ts's render()) so refreshing mid-run resumes
// exactly where the player left off, combat included.
import type { RunState } from './types';
import type { CombatSetup } from './combatResolver';
import { mulberry32, type Rng } from './rng';

const SAVE_KEY = 'floating-road-save-v1';
const SAVE_VERSION = 1;

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

interface SaveFile {
  version: number;
  rngState: number;
  screen: SavedScreen;
  state: Omit<RunState, 'drawnOnce'> & { drawnOnce: string[] };
}

export function saveGame(state: RunState, rng: Rng, screen: SavedScreen): void {
  const file: SaveFile = {
    version: SAVE_VERSION,
    rngState: rng.getState(),
    screen,
    state: { ...state, drawnOnce: [...state.drawnOnce] },
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
    if (file.version !== SAVE_VERSION) return null;
    const { drawnOnce, ...rest } = file.state;
    const state: RunState = { ...rest, drawnOnce: new Set(drawnOnce) };
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

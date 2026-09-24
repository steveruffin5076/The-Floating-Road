// GDD §14 "save anywhere". A single localStorage slot, checkpointed on every
// screen transition (see main.ts's render()) so refreshing mid-run resumes
// exactly where the player left off, combat included.
import type { RunState } from './types';
import type { CombatSetup } from './combatResolver';
import { mulberry32, type Rng } from './rng';

const SAVE_KEY = 'floating-road-save-v1';
// v2 added flags, counters, items; v3 adds the act director's state. Older
// saves are migrated, not dropped.
const SAVE_VERSION = 3;

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
      result?: 'won' | 'lost' | 'escaped';
    }
  | { kind: 'levelup' }
  | { kind: 'rest' }
  | { kind: 'ending'; endingId: string };

type SetFields = 'drawnOnce' | 'flags' | 'items' | 'firedInjections';

interface SaveFile {
  version: number;
  rngState: number;
  screen: SavedScreen;
  state: Omit<RunState, SetFields> & { drawnOnce: string[]; flags?: string[]; items?: string[]; firedInjections?: string[] };
}

export function saveGame(state: RunState, rng: Rng, screen: SavedScreen): void {
  const file: SaveFile = {
    version: SAVE_VERSION,
    rngState: rng.getState(),
    screen,
    state: {
      ...state,
      drawnOnce: [...state.drawnOnce],
      flags: [...state.flags],
      items: [...state.items],
      firedInjections: [...state.firedInjections],
    },
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
    if (file.version < 1 || file.version > SAVE_VERSION) return null;
    // Fields newer than the save start empty. v1/v2 runs were single-act, so
    // actEvent equals eventsResolved.
    const { drawnOnce, flags, items, firedInjections, ...rest } = file.state;
    const state: RunState = {
      ...rest,
      counters: rest.counters ?? {},
      act: rest.act ?? 1,
      actEvent: rest.actEvent ?? rest.eventsResolved,
      actSlotOf: rest.actSlotOf ?? {},
      pendingSpawns: rest.pendingSpawns ?? [],
      pendingActAdvance: rest.pendingActAdvance ?? false,
      drawnOnce: new Set(drawnOnce),
      flags: new Set(flags ?? []),
      items: new Set(items ?? []),
      firedInjections: new Set(firedInjections ?? []),
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

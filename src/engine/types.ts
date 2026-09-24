// Core types for the vertical slice. Mirrors game-plan/02-game-design.md
// §4.3 (stats), §5 (vitals), §6 (checks), §7 (combat).

export type StatKey = 'chikara' | 'waza' | 'chi' | 'kuchi' | 'me' | 'tan';

export const STAT_LABELS: Record<StatKey, string> = {
  chikara: 'Chikara (力) — Strength',
  waza: 'Waza (技) — Technique',
  chi: 'Chi (智) — Learning',
  kuchi: 'Kuchi (口) — Speech',
  me: 'Me (目) — Awareness',
  tan: 'Tan (胆) — Nerve',
};

export type Stats = Record<StatKey, number>;

export interface RunState {
  stats: Stats;
  health: number;
  healthMax: number;
  resolve: number;
  resolveMax: number;
  money: number; // mon
  suspicion: number; // hidden 0-5
  reputation: number; // -5..5
  gi: number; // -5 (aku) .. +5 (gi)
  weaponTier: number; // 0 rusted .. 3 meibutsu (GDD §7.1 you=weapon_tier*4+...)
  armorBonus: number;

  eventsResolved: number;
  eventsSinceLevel: number;
  eventsSinceRest: number;
  consecutiveFails: number;
  levelUps: number;

  bagRemaining: string[];
  bagAll: string[];
  drawnOnce: Set<string>;

  flags: Set<string>;
  counters: Record<string, number>;
  items: Set<string>; // key items only for now; no stacking or inventory slots yet

  // Act director (11 §1.1). actEvent counts events resolved in the current act,
  // injected and drawn alike, so the next event occupies slot actEvent + 1.
  act: number;
  actEvent: number;
  actSlotOf: Record<string, number>; // slot each event resolved at, this act
  firedInjections: Set<string>; // fired or lapsed
  pendingSpawns: string[]; // spawn_event queue: these fire before anything else
  pendingActAdvance: boolean; // a transition event is on screen

  log: string[];
  ended: boolean;
  endingId: string | null;
}

export interface CheckSpec {
  stat: StatKey;
  dc: number;
  mods?: { when: Requirement; pct: number }[]; // 04 §3 check mods, added to the odds
}

export type TrackKey = 'health' | 'resolve' | 'money' | 'suspicion' | 'reputation' | 'gi';

// 04 §3 `requires`, in TypeScript form. Every listed condition must pass;
// `anyOf` passes if at least one of its entries does. `stats` are floors.
export interface Requirement {
  flags?: string[];
  flagsNot?: string[];
  itemsAny?: string[];
  stats?: Partial<Stats>;
  min?: Partial<Record<TrackKey, number>>;
  max?: Partial<Record<TrackKey, number>>;
  countersMin?: Record<string, number>;
  countersMax?: Record<string, number>;
  anyOf?: Requirement[];
}

// Maps to 04 §3's effects vocabulary: `effects` = track deltas,
// setFlags/clearFlags = set_flag/clear_flag, counters = counter_inc (signed),
// statDelta = stat_delta, addItems/removeItems = add_item/remove_item.
export interface Outcome {
  text: string;
  effects?: Partial<Pick<RunState, TrackKey>>;
  setFlags?: string[];
  clearFlags?: string[];
  counters?: Record<string, number>;
  statDelta?: Partial<Stats>;
  addItems?: string[];
  removeItems?: string[];
  spawnEvents?: string[]; // spawn_event: fire these next, in order
  moneyMult?: number; // money_mult, applied after deltas, rounded down
  setTracks?: Partial<Record<TrackKey, number>>; // set a track to a value (clamped)
  goto?: string; // continue the same beat at a node event (04 §3 goto)
  endingId?: string;
}

// 02 §10 / 04 §3.2. A forced ending fires the moment `forcedWhen` holds
// (checked after every outcome). The others are evaluated when an act ends
// with `evaluateEndings`: the highest-priority match wins, else the fallback.
export interface EndingSpec {
  title: string;
  epilogue: string;
  historicalNote: string;
  forcedWhen?: Requirement;
  requires?: Requirement;
  priority?: number;
  fallback?: boolean;
}

// 11 §1.1 `inject` block. A chain event fires at a slot of its act instead of
// a random draw. `slot` is 1-based; if blocked (a collision or an unmet gate)
// it may fire up to `window` slots late. With `afterEvent`, the slot counts from
// where that event resolved in this act. Mandatory injections hold the act open
// until they fire; others lapse when their window closes and apply `onLapse`.
export interface InjectSpec {
  act: number;
  slot: number;
  window?: number;
  afterEvent?: string;
  priority?: number;
  mandatory?: boolean;
  onLapse?: Omit<Outcome, 'text' | 'endingId'>;
}

// An act ends after `length` events, then either ends the run (`endingId`) or
// shows `transitionEventId` and moves to the next act.
export interface ActSpec {
  act: number;
  length: number;
  levelInterval: number;
  endingId?: string;
  evaluateEndings?: boolean;
  transitionEventId?: string;
}

export interface Choice {
  text: string;
  requires?: Requirement;
  // 02 §12: "hide" for Tale/flag gates the player shouldn't see (default),
  // "locked_hint" to show it greyed out with `lockedHint` when it's something
  // the player can work toward.
  displayWhenUnmet?: 'hide' | 'locked_hint';
  lockedHint?: string;
  check?: CheckSpec;
  onSuccess?: Outcome;
  onFailure?: Outcome;
  onResolve?: Outcome; // ungated choice
}

export interface StoryEvent {
  id: string;
  type: 'story';
  title: string;
  body: string;
  weight: number;
  acts?: number[]; // random pools this event belongs to; default [1]
  inject?: InjectSpec; // chain event: never drawn from a bag
  requires?: Requirement;
  choices: Choice[];
}

export interface CombatEvent {
  id: string;
  type: 'combat';
  title: string;
  body: string;
  weight: number;
  acts?: number[];
  inject?: InjectSpec;
  requires?: Requirement;
  foe: { name: string; power: number };
  winPctMod?: number; // added to the base win% before the chō-han bet
  onWin: Outcome;
  onLose: Outcome;
}

export type GameEvent = StoryEvent | CombatEvent;

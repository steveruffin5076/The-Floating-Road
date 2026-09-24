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

  log: string[];
  ended: boolean;
  endingId: string | null;
}

export interface CheckSpec {
  stat: StatKey;
  dc: number;
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
  endingId?: string;
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
  requires?: Requirement;
  choices: Choice[];
}

export interface CombatEvent {
  id: string;
  type: 'combat';
  title: string;
  body: string;
  weight: number;
  requires?: Requirement;
  foe: { name: string; power: number };
  onWin: Outcome;
  onLose: Outcome;
}

export type GameEvent = StoryEvent | CombatEvent;

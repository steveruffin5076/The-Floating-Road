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

  log: string[];
  ended: boolean;
  endingId: string | null;
}

export interface CheckSpec {
  stat: StatKey;
  dc: number;
}

export interface Outcome {
  text: string;
  effects?: Partial<
    Pick<RunState, 'health' | 'resolve' | 'money' | 'suspicion' | 'reputation' | 'gi'>
  >;
  endingId?: string;
}

export interface Choice {
  text: string;
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
  choices: Choice[];
}

export interface CombatEvent {
  id: string;
  type: 'combat';
  title: string;
  body: string;
  weight: number;
  foe: { name: string; power: number };
  onWin: Outcome;
  onLose: Outcome;
}

export type GameEvent = StoryEvent | CombatEvent;

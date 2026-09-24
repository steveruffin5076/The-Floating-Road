// Tale 1: "The Masterless Blade" (rōnin) — GDD §4.1. Only Tale in the
// vertical slice; other Tales are out of scope until the MVP pass (GDD §16).
import type { ActSpec, Stats, StatKey } from '../engine/types';

export const TALE_ID = 'ronin';
export const TALE_NAME = 'The Masterless Blade';

// Tale 1's three acts (11 §4.1): the road (14 events), Edo (16) and the Keian
// summer (8; conspirators' runs usually end at slot 6). Level-ups every 3
// events in Act 1 are §4.3's front-loaded cadence, then every 4. In Edo,
// Suspicion reaching 5 brings the constable (C12) instead of a direct arrest;
// once you have fought your way past him you are hunted, and he stops knocking.
const SAGAWA_WATCH = { when: { min: { suspicion: 5 }, flagsNot: ['sagawa_hunted'] }, spawn: 't1_sagawa_raid' };

export const ACTS: ActSpec[] = [
  { act: 1, length: 14, levelInterval: 3, transitionEventId: 't1_gates_of_edo' },
  { act: 2, length: 16, levelInterval: 4, transitionEventId: 't1_shogun_is_dead', watches: [SAGAWA_WATCH] },
  { act: 3, length: 8, levelInterval: 4, evaluateEndings: true, watches: [SAGAWA_WATCH] },
];

// Premise: "a name on a list of 'unattached swordsmen' the sekisho are told to
// watch for" (03 §4 Tale 1).
export const TALE_START_FLAGS = ['watch_list_active'];

export const STARTING_STATS: Stats = {
  chikara: 4,
  waza: 4,
  chi: 2,
  kuchi: 2,
  me: 3,
  tan: 3,
};

export interface TraitOption {
  id: string;
  name: string;
  description: string;
  statBonus?: { stat: StatKey; amount: number };
  flag?: string;
}

// Subset of GDD §4.2's trait list, chosen for relevance to a rōnin run.
export const TRAITS: TraitOption[] = [
  {
    id: 'dojo_trained',
    name: 'Dojo-Trained',
    description: '+2 Waza. You were taught properly, before it all fell apart.',
    statBonus: { stat: 'waza', amount: 2 },
  },
  {
    id: 'silver_tongue',
    name: 'Silver Tongue',
    description: '+2 Kuchi, but a failed bluff raises Suspicion a little more than usual.',
    statBonus: { stat: 'kuchi', amount: 2 },
    flag: 'silver_tongue',
  },
  {
    id: 'night_eyes',
    name: 'Night Eyes',
    description: '+1 Me. You see what others miss after dark.',
    statBonus: { stat: 'me', amount: 1 },
  },
  {
    id: 'temple_lettered',
    name: 'Temple-Lettered',
    description: '+2 Chi. You can read what most travelers cannot.',
    statBonus: { stat: 'chi', amount: 2 },
  },
];

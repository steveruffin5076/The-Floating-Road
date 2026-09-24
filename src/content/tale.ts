// Tale 1: "The Masterless Blade" (rōnin) — GDD §4.1. Only Tale in the
// vertical slice; other Tales are out of scope until the MVP pass (GDD §16).
import type { ActSpec, Stats, StatKey } from '../engine/types';

export const TALE_ID = 'ronin';
export const TALE_NAME = 'The Masterless Blade';

// The slice is Act 1 only: 14 events (11 §4.1 slot map), the intro plus five
// Tale 1 chain events (chain.tale1.act1.ts) plus 8 random draws from a 23-event
// bag. Level-ups every 3 events are §4.3's front-loaded Act 1 cadence. The act
// evaluates endings until Act 2 has content; then the reached_edo family
// becomes the transition event `t1_gates_of_edo` (11 §4.2).
export const ACTS: ActSpec[] = [{ act: 1, length: 14, levelInterval: 3, evaluateEndings: true }];

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

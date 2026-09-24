// A three-act configuration for measuring Acts 2 and 3 before the game ships
// them: random pools only (their chains aren't authored yet), each act sized to
// its pool so nothing repeats, joined by stand-in transition nodes.
import type { ActSpec, GameEvent } from '../engine/types';
import { ACTS } from '../content/tale';
import { ACT1_EVENTS, INTRO_EVENT } from '../content/events.act1';
import { TALE1_ACT1_CHAIN } from '../content/chain.tale1.act1';
import { ACT2_EVENTS } from '../content/events.act2';
import { ACT3_EVENTS } from '../content/events.act3';

const transition = (id: string): GameEvent => ({
  id,
  type: 'story',
  title: 'Preview transition',
  body: 'Time passes.',
  weight: 1,
  acts: [],
  choices: [
    { text: 'Go on.', onResolve: { text: 'You go on.' } },
    { text: 'Wait a while.', onResolve: { text: 'You wait.' } },
  ],
});

export const PREVIEW_ACTS: ActSpec[] = [
  { ...ACTS[0], evaluateEndings: undefined, transitionEventId: 'preview_to_act2' },
  { act: 2, length: ACT2_EVENTS.length, levelInterval: 4, transitionEventId: 'preview_to_act3' },
  { act: 3, length: ACT3_EVENTS.length, levelInterval: 4, evaluateEndings: true },
];

export const PREVIEW_EVENTS: GameEvent[] = [
  INTRO_EVENT,
  ...ACT1_EVENTS,
  ...TALE1_ACT1_CHAIN,
  ...ACT2_EVENTS,
  ...ACT3_EVENTS,
  transition('preview_to_act2'),
  transition('preview_to_act3'),
];

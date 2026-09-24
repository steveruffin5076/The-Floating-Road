// Every Tale 1 event, in one list: the game, the sim and the tests all load this.
import type { GameEvent } from '../engine/types';
import { ACT1_EVENTS, INTRO_EVENT } from './events.act1';
import { ACT2_EVENTS } from './events.act2';
import { ACT3_EVENTS } from './events.act3';
import { TALE1_ACT1_CHAIN } from './chain.tale1.act1';
import { TALE1_ACT2_CHAIN } from './chain.tale1.act2';
import { TALE1_ACT3_CHAIN } from './chain.tale1.act3';

export { INTRO_EVENT };

export const ALL_EVENTS: GameEvent[] = [
  INTRO_EVENT,
  ...ACT1_EVENTS,
  ...TALE1_ACT1_CHAIN,
  ...ACT2_EVENTS,
  ...TALE1_ACT2_CHAIN,
  ...ACT3_EVENTS,
  ...TALE1_ACT3_CHAIN,
];

// The game's rules loop, with no DOM. main.ts turns its answers into screens;
// the sim harness (src/sim) drives it with bot policies. Keeping both on this
// one module is what makes the sim's numbers true of the real game.
import type { ActSpec, Choice, CombatEvent, EndingSpec, GameEvent, Outcome, RunState, StatKey } from './types';
import type { Rng } from './rng';
import { resolveCheck } from './checkResolver';
import { resolveCombat, type Stance } from './combatResolver';
import { checkModPct } from './requirements';
import { actSpec, enterNode, nextStep, recordResolved, runCompleteEnding } from './director';
import { forcedEnding } from './endings';
import { applyOutcomeEffects, grantLevelUp, noteCombatWin, REST_INTERVAL, withTraitRiders } from './state';

export interface Content {
  events: GameEvent[];
  byId: Map<string, GameEvent>;
  acts: ActSpec[];
  endings: Record<string, EndingSpec>;
}

export function makeContent(events: GameEvent[], acts: ActSpec[], endings: Record<string, EndingSpec>): Content {
  return { events, byId: new Map(events.map((e) => [e.id, e])), acts, endings };
}

// 05 §3: every rest node has a free option, so a broke run can always stop the Resolve bleed.
export const REST = {
  free: { text: 'You sleep poorly but wake alive and dry enough.', effects: { health: 1 } },
  inn: { text: 'A hot meal, a real futon, and a locked door. You sleep well.', effects: { money: -150, health: 4, resolve: 3 } },
  innCost: 150,
} satisfies Record<string, unknown>;

export interface ChoiceResult {
  outcome?: Outcome;
  check?: { stat: StatKey; dc: number; successPct: number; passed: boolean };
}

// Resolves a story choice and applies its outcome.
export function resolveChoice(state: RunState, choice: Choice, rng: Rng): ChoiceResult {
  if (!choice.check) {
    if (choice.onResolve) applyOutcomeEffects(state, choice.onResolve);
    return { outcome: choice.onResolve };
  }
  const c = choice.check;
  const roll = resolveCheck(rng, state.stats[c.stat], c.dc, state.consecutiveFails, checkModPct(state, c));
  state.consecutiveFails = roll.passed ? 0 : state.consecutiveFails + 1;
  const raw = roll.passed ? choice.onSuccess : choice.onFailure;
  const outcome = raw && withTraitRiders(state, c, roll.passed, raw);
  if (outcome) applyOutcomeEffects(state, outcome);
  return { outcome, check: { stat: c.stat, dc: c.dc, successPct: roll.successPct, passed: roll.passed } };
}

export type FightResult = 'won' | 'lost' | 'escaped';

const ESCAPE_TEXT = 'You slip away before it turns to violence.';

// Resolves a fight after the chō-han bet (02 §7.1 stances). Escape is a Me DC 6
// check; failing it forces the fight at -15% with aggressive-stance wounds.
export function resolveFight(
  state: RunState,
  event: CombatEvent,
  winPct: number,
  stance: Stance,
  rng: Rng
): { result: FightResult; outcome?: Outcome; text: string; winPct: number } {
  if (stance === 'escape') {
    if (resolveCheck(rng, state.stats.me, 6, state.consecutiveFails).passed) {
      applyOutcomeEffects(state, { text: ESCAPE_TEXT });
      return { result: 'escaped', text: ESCAPE_TEXT, winPct };
    }
    return resolveFight(state, event, Math.max(5, winPct - 15), 'aggressive', rng);
  }
  const won = resolveCombat(rng, winPct);
  const authored = won ? event.onWin : event.onLose;
  const outcome = { ...authored, effects: { ...authored.effects } };
  if (!won && outcome.effects.health !== undefined) {
    const mult = stance === 'aggressive' ? 1.5 : stance === 'defensive' ? 0.6 : 1;
    outcome.effects.health = Math.round(outcome.effects.health * mult);
  }
  applyOutcomeEffects(state, outcome);
  if (won) noteCombatWin(state);
  return { result: won ? 'won' : 'lost', outcome: won ? event.onWin : event.onLose, text: outcome.text, winPct };
}

export type Next =
  | { kind: 'ending'; endingId: string }
  | { kind: 'event'; event: GameEvent }
  | { kind: 'levelup' }
  | { kind: 'rest' };

// What comes after an outcome whose effects are already applied. `currentId`
// is the event just resolved (null outside events).
export function afterOutcome(
  state: RunState,
  content: Content,
  currentId: string | null,
  outcome: Outcome | undefined,
  rng: Rng
): Next {
  const forced = outcome?.endingId ?? forcedEnding(state, content.endings);
  if (forced) return end(state, forced);

  if (outcome?.goto && currentId) {
    enterNode(state, currentId, outcome.goto);
    return { kind: 'event', event: content.byId.get(outcome.goto)! };
  }

  if (currentId) recordResolved(state, currentId, content.events, rng);
  state.eventsSinceLevel += 1;
  state.eventsSinceRest += 1;

  const done = runCompleteEnding(state, content.events, content.acts, content.endings);
  if (done) return end(state, done);

  if (state.eventsSinceLevel >= actSpec(content.acts, state.act).levelInterval) {
    state.eventsSinceLevel = 0;
    return { kind: 'levelup' };
  }
  return afterLevelUp(state, content, rng);
}

export function levelUp(state: RunState, content: Content, stat: StatKey, rng: Rng): Next {
  grantLevelUp(state, stat);
  return afterLevelUp(state, content, rng);
}

function afterLevelUp(state: RunState, content: Content, rng: Rng): Next {
  if (state.eventsSinceRest >= REST_INTERVAL) {
    state.eventsSinceRest = 0;
    return { kind: 'rest' };
  }
  return draw(state, content, rng);
}

export function rest(state: RunState, content: Content, option: 'free' | 'inn', rng: Rng): Next {
  if (option === 'inn' && state.money >= REST.innCost) applyOutcomeEffects(state, REST.inn);
  else applyOutcomeEffects(state, REST.free);
  return draw(state, content, rng);
}

export function draw(state: RunState, content: Content, rng: Rng): Next {
  const step = nextStep(state, content.events, content.acts, content.endings, rng);
  if (step.kind === 'ending') return end(state, step.endingId);
  return { kind: 'event', event: content.byId.get(step.id)! };
}

function end(state: RunState, endingId: string): Next {
  state.ended = true;
  state.endingId = endingId;
  return { kind: 'ending', endingId };
}

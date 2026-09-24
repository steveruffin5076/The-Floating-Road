// Act director (11 §1.1, 04 §4): decides what comes next. Order of precedence:
// spawned events, then chain injections due at this slot, then a random draw
// from the act's bag. At the end of an act, mandatory injections still waiting
// fire first; then the act either ends the run or transitions.
import type { ActSpec, GameEvent, InjectSpec, RunState } from './types';
import type { Rng } from './rng';
import { meetsRequirement } from './requirements';
import { buildWeightedBag, drawNext, poolFor } from './eventDirector';
import { applyEffects } from './state';

export type NextStep = { kind: 'event'; id: string; transition?: boolean } | { kind: 'ending'; endingId: string };

export function actSpec(acts: ActSpec[], act: number): ActSpec {
  const spec = acts.find((a) => a.act === act);
  if (!spec) throw new Error(`no ActSpec for act ${act}`);
  return spec;
}

function windowOf(inj: InjectSpec, state: RunState): { start: number; end: number } | null {
  let base = inj.slot;
  if (inj.afterEvent) {
    const at = state.actSlotOf[inj.afterEvent];
    if (at === undefined) return null;
    base = at + inj.slot;
  }
  return { start: base - (inj.early ?? 0), end: base + (inj.window ?? 0) };
}

function pending(state: RunState, events: GameEvent[]): GameEvent[] {
  return events.filter((e) => e.inject?.act === state.act && !state.firedInjections.has(e.id));
}

// Higher priority first, then the earlier window, then authoring order.
function best(state: RunState, candidates: GameEvent[]): GameEvent {
  return [...candidates].sort((a, b) => {
    const pa = a.inject!.priority ?? 0;
    const pb = b.inject!.priority ?? 0;
    if (pa !== pb) return pb - pa;
    return (windowOf(a.inject!, state)?.start ?? 0) - (windowOf(b.inject!, state)?.start ?? 0);
  })[0];
}

function lapse(state: RunState, e: GameEvent): void {
  state.firedInjections.add(e.id);
  if (e.inject?.onLapse) applyEffects(state, e.inject.onLapse);
}

function fire(state: RunState, e: GameEvent): NextStep {
  state.firedInjections.add(e.id);
  state.drawnOnce.add(e.id);
  return { kind: 'event', id: e.id };
}

function mandatoryReady(state: RunState, events: GameEvent[]): GameEvent[] {
  return pending(state, events).filter((e) => e.inject!.mandatory && meetsRequirement(state, e.requires));
}

export function advanceAct(state: RunState, events: GameEvent[], rng: Rng): void {
  state.act += 1;
  state.actEvent = 0;
  state.actSlotOf = {};
  state.pendingActAdvance = false;
  const bag = buildWeightedBag(poolFor(events, state.act), rng);
  state.bagAll = bag;
  state.bagRemaining = bag;
}

// Call once per resolved event, before asking for the next step.
export function recordResolved(state: RunState, eventId: string, events: GameEvent[], rng: Rng): void {
  state.eventsResolved += 1;
  state.actEvent += 1;
  state.actSlotOf[eventId] = state.actEvent;
  if (state.pendingActAdvance) advanceAct(state, events, rng);
}

// The ending the run reaches now that the act is over, or null. Pure: safe to
// call before level-up and rest screens.
export function runCompleteEnding(state: RunState, events: GameEvent[], acts: ActSpec[]): string | null {
  const spec = actSpec(acts, state.act);
  if (state.actEvent < spec.length || state.pendingSpawns.length) return null;
  if (mandatoryReady(state, events).length) return null;
  return spec.endingId ?? null;
}

export function nextStep(state: RunState, events: GameEvent[], acts: ActSpec[], rng: Rng): NextStep {
  if (state.pendingSpawns.length) {
    const id = state.pendingSpawns.shift()!;
    state.drawnOnce.add(id);
    return { kind: 'event', id };
  }

  const spec = actSpec(acts, state.act);
  if (state.actEvent >= spec.length) {
    const ready = mandatoryReady(state, events);
    if (ready.length) return fire(state, best(state, ready));
    for (const e of pending(state, events)) lapse(state, e);
    if (spec.endingId) return { kind: 'ending', endingId: spec.endingId };
    if (spec.transitionEventId) {
      state.pendingActAdvance = true;
      state.drawnOnce.add(spec.transitionEventId);
      return { kind: 'event', id: spec.transitionEventId, transition: true };
    }
    advanceAct(state, events, rng);
    return nextStep(state, events, acts, rng);
  }

  const slot = state.actEvent + 1;
  for (const e of pending(state, events)) {
    const w = windowOf(e.inject!, state);
    if (w && slot > w.end && !e.inject!.mandatory) lapse(state, e);
  }
  const due = pending(state, events).filter((e) => {
    const w = windowOf(e.inject!, state);
    return w !== null && slot >= w.start && slot <= w.end && meetsRequirement(state, e.requires);
  });
  if (due.length) return fire(state, best(state, due));

  if (!state.bagAll.length) throw new Error(`act ${state.act} has no random pool`);
  const byId = new Map(events.map((e) => [e.id, e]));
  const { id, bagRemaining } = drawNext(state.bagRemaining, state.bagAll, state.drawnOnce, rng, (eid) =>
    meetsRequirement(state, byId.get(eid)?.requires)
  );
  state.bagRemaining = bagRemaining;
  state.drawnOnce.add(id);
  return { kind: 'event', id };
}

import type { RunState, Stats, Outcome, StatKey, CheckSpec } from './types';
import type { Rng } from './rng';
import { buildWeightedBag } from './eventDirector';
import type { GameEvent } from './types';

// GDD §4.3: "~1 level (2 stat points) every ~4 resolved events, front-loaded
// slightly in Act 1" (added per the design review). The vertical slice is
// Act 1 only, so it uses the front-loaded interval throughout.
export const LEVEL_INTERVAL = 3;
// GDD §3: "rest nodes appear every ~4-5 events."
export const REST_INTERVAL = 4;
// Vertical slice run length target: GDD §3 sizes Act 1 at "≈12-15 events."
// With 24 events now in the pool (1 intro + 23 bag), 13 draws never repeat
// within a run (see the no-repeat-until-exhausted bag in eventDirector.ts).
// That meets the ~20-25 event vertical-slice target from GDD §16.
export const RUN_EVENT_TARGET = 13;

export function createInitialState(startingStats: Stats, events: GameEvent[], rng: Rng): RunState {
  const bag = buildWeightedBag(events, rng);
  return {
    stats: { ...startingStats },
    health: 20,
    healthMax: 20,
    resolve: 10,
    resolveMax: 10,
    money: 300,
    suspicion: 0,
    reputation: 0,
    gi: 0,
    // Starting loadout for the rōnin Tale: a serviceable katana (tier 1 of
    // 0-3, GDD §5 inventory) and travel clothes (GDD §5's base armor tier,
    // 0 bonus — better armor is a purchase this slice doesn't model yet).
    // Foe power in events.act1.ts's two combats is calibrated against
    // exactly this loadout; see progress.md's combat-numbers pass.
    weaponTier: 1,
    armorBonus: 0,
    eventsResolved: 0,
    eventsSinceLevel: 0,
    eventsSinceRest: 0,
    consecutiveFails: 0,
    levelUps: 0,
    bagRemaining: bag,
    bagAll: bag,
    drawnOnce: new Set(),
    flags: new Set(),
    counters: {},
    items: new Set(),
    log: [],
    ended: false,
    endingId: null,
  };
}

export function applyOutcomeEffects(state: RunState, outcome: Outcome): void {
  const e = outcome.effects;
  if (e) {
    if (e.health !== undefined) state.health = clamp(state.health + e.health, 0, state.healthMax);
    if (e.resolve !== undefined) state.resolve = clamp(state.resolve + e.resolve, 0, state.resolveMax);
    if (e.money !== undefined) state.money = Math.max(0, state.money + e.money);
    if (e.suspicion !== undefined) state.suspicion = clamp(state.suspicion + e.suspicion, 0, 5);
    if (e.reputation !== undefined) state.reputation = clamp(state.reputation + e.reputation, -5, 5);
    if (e.gi !== undefined) state.gi = clamp(state.gi + e.gi, -5, 5);
  }
  for (const f of outcome.setFlags ?? []) state.flags.add(f);
  for (const f of outcome.clearFlags ?? []) state.flags.delete(f);
  for (const [name, by] of Object.entries(outcome.counters ?? {})) {
    state.counters[name] = (state.counters[name] ?? 0) + by;
  }
  for (const [stat, delta] of Object.entries(outcome.statDelta ?? {})) {
    const k = stat as StatKey;
    state.stats[k] = clamp(state.stats[k] + (delta as number), 1, 15); // 02 §4.3 range
  }
  for (const i of outcome.addItems ?? []) state.items.add(i);
  for (const i of outcome.removeItems ?? []) state.items.delete(i);
  state.log.push(outcome.text);
}

// Trait riders on a resolved check. Silver Tongue (tale.ts): a failed Kuchi
// bluff that already raises Suspicion raises it one more.
export function withTraitRiders(
  state: RunState,
  check: CheckSpec,
  passed: boolean,
  outcome: Outcome
): Outcome {
  const raisesSuspicion = (outcome.effects?.suspicion ?? 0) > 0;
  if (!passed && check.stat === 'kuchi' && raisesSuspicion && state.flags.has('silver_tongue')) {
    return { ...outcome, effects: { ...outcome.effects, suspicion: outcome.effects!.suspicion! + 1 } };
  }
  return outcome;
}

export function grantLevelUp(state: RunState, stat: StatKey): void {
  state.stats[stat] = Math.min(15, state.stats[stat] + 2); // GDD §4.3 stat cap
  state.healthMax += 1;
  state.health = Math.min(state.healthMax, state.health + 1);
  state.levelUps += 1;
}

// GDD §5 ending thresholds; §10's Keian/city convergence is out of scope for
// an Act-1-only slice, so "reached_edo" stands in as the slice's own
// completion ending.
export function checkForEnding(state: RunState): string | null {
  if (state.health <= 0) return 'death';
  if (state.resolve <= 0) return 'despair';
  if (state.suspicion >= 5) return 'arrested';
  if (state.eventsResolved >= RUN_EVENT_TARGET) return 'reached_edo';
  return null;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

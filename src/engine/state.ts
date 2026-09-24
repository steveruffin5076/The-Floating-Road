import type { RunState, Stats, Outcome, StatKey, CheckSpec } from './types';
import type { Rng } from './rng';
import { buildWeightedBag, poolFor } from './eventDirector';
import type { GameEvent } from './types';

// GDD §3: "rest nodes appear every ~4-5 events."
export const REST_INTERVAL = 4;

export function createInitialState(startingStats: Stats, events: GameEvent[], rng: Rng): RunState {
  const bag = buildWeightedBag(poolFor(events, 1), rng);
  return {
    stats: { ...startingStats },
    health: 20,
    healthMax: 20,
    // Starts worn, not full (Tale 1: 33 years after Osaka, walking east with
    // nothing). At 10/10, Act 1 never pushed any sim policy below Resolve 3;
    // at 7 it becomes a visible second clock (game-plan/12-act1-balance-report.md).
    resolve: 7,
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
    act: 1,
    actEvent: 0,
    actSlotOf: {},
    firedInjections: new Set(),
    pendingSpawns: [],
    pendingActAdvance: false,
    log: [],
    ended: false,
    endingId: null,
  };
}

export function applyOutcomeEffects(state: RunState, outcome: Outcome): void {
  applyEffects(state, outcome);
  state.log.push(outcome.text);
}

// Everything an outcome does except logging its text (used for onLapse).
export function applyEffects(state: RunState, outcome: Omit<Outcome, 'text' | 'endingId'>): void {
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
  if (outcome.moneyMult !== undefined) state.money = Math.floor(state.money * outcome.moneyMult);
  const set = outcome.setTracks;
  if (set) {
    if (set.health !== undefined) state.health = clamp(set.health, 0, state.healthMax);
    if (set.resolve !== undefined) state.resolve = clamp(set.resolve, 0, state.resolveMax);
    if (set.money !== undefined) state.money = Math.max(0, set.money);
    if (set.suspicion !== undefined) state.suspicion = clamp(set.suspicion, 0, 5);
    if (set.reputation !== undefined) state.reputation = clamp(set.reputation, -5, 5);
    if (set.gi !== undefined) state.gi = clamp(set.gi, -5, 5);
  }
  state.pendingSpawns.push(...(outcome.spawnEvents ?? []));
}

// Engine-maintained counter (11 §2.2): every combat win, lethal or not.
export function noteCombatWin(state: RunState): void {
  state.counters.combat_wins = (state.counters.combat_wins ?? 0) + 1;
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

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

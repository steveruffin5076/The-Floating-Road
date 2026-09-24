// Balance harness (02 §15, 04 §5): plays whole runs headlessly through the same
// runner the browser uses, with bot policies standing in for players.
import type { Choice, GameEvent, Outcome, RunState, StatKey, TrackKey } from '../engine/types';
import { mulberry32, type Rng } from '../engine/rng';
import { createInitialState } from '../engine/state';
import { previewCheck } from '../engine/checkResolver';
import { applyChoHan, setupCombat, type ChoHanCall, type Stance } from '../engine/combatResolver';
import { checkModPct, meetsRequirement } from '../engine/requirements';
import * as runner from '../engine/runner';

export interface Policy {
  name: string;
  build: StatKey[];
  choose(state: RunState, options: Choice[], rng: Rng): Choice;
  levelUp(state: RunState, rng: Rng): StatKey;
  rest(state: RunState, rng: Rng): 'free' | 'inn';
  chohan(rng: Rng): ChoHanCall;
  stance(state: RunState, winPct: number, rng: Rng): Stance;
}

const STATS: StatKey[] = ['chikara', 'waza', 'chi', 'kuchi', 'me', 'tan'];
const pickOne = <T>(xs: T[], rng: Rng): T => xs[Math.floor(rng() * xs.length)];

export const randomPolicy: Policy = {
  name: 'random',
  build: [],
  choose: (_s, options, rng) => pickOne(options, rng),
  levelUp: (_s, rng) => pickOne(STATS, rng),
  rest: (s, rng) => (s.money >= runner.REST.innCost && rng() < 0.5 ? 'inn' : 'free'),
  chohan: (rng) => pickOne<ChoHanCall>(['even', 'odd', 'skip'], rng),
  stance: (_s, _w, rng) => pickOne<Stance>(['aggressive', 'defensive', 'escape'], rng),
};

// Scores an outcome the way a careful player would: Suspicion is dangerous,
// low health and Resolve matter more as they run out.
function value(s: RunState, o: Outcome | undefined, content: runner.Content): number {
  if (!o) return 0;
  const e: Partial<Record<TrackKey, number>> = o.effects ?? {};
  let v =
    (e.health ?? 0) * (s.health < 8 ? 2 : 1) +
    (e.resolve ?? 0) * (s.resolve < 4 ? 2.5 : 1.2) +
    (e.money ?? 0) * 0.02 +
    (e.suspicion ?? 0) * (s.suspicion >= 3 ? -8 : -3) +
    (e.reputation ?? 0) * 0.8 +
    (e.gi ?? 0) * 0.3;
  if (o.goto && content.byId.get(o.goto)?.type === 'combat') v -= 2; // a fight: real risk
  if (o.moneyMult !== undefined) v -= s.money * (1 - o.moneyMult) * 0.02;
  v += (o.addItems?.length ?? 0) * 2 + (o.setFlags?.length ?? 0) * 0.3; // story progress has worth
  return v;
}

function expected(s: RunState, c: Choice, content: runner.Content): number {
  if (!c.check) return value(s, c.onResolve, content);
  const p = previewCheck(s.stats[c.check.stat], c.check.dc, s.consecutiveFails, checkModPct(s, c.check)).successPct / 100;
  return p * value(s, c.onSuccess, content) + (1 - p) * value(s, c.onFailure, content);
}

// `temperature` 0 always takes the best-valued choice; higher values pick
// by softmax, so the bot usually but not always does the sensible thing.
function careful(name: string, build: StatKey[], content: runner.Content, temperature = 0): Policy {
  return {
    name,
    build,
    choose(s, options, rng) {
      const vs = options.map((c) => expected(s, c, content));
      if (temperature > 0) {
        const max = Math.max(...vs);
        const w = vs.map((v) => Math.exp((v - max) / temperature));
        let r = rng() * w.reduce((a, b) => a + b, 0);
        for (let i = 0; i < w.length; i++) if ((r -= w[i]) <= 0) return options[i];
        return options[options.length - 1];
      }
      const best = Math.max(...vs);
      return pickOne(options.filter((_, i) => vs[i] >= best - 1e-9), rng);
    },
    levelUp: (s) => [...build].sort((a, b) => s.stats[a] - s.stats[b])[0],
    rest: (s) => (s.money >= 300 || (s.health <= 12 && s.money >= runner.REST.innCost) ? 'inn' : 'free'),
    chohan: () => 'skip',
    stance: () => 'defensive',
  };
}

export function policies(content: runner.Content): Policy[] {
  const firstTimer = careful('first-timer', ['chikara', 'waza'], content, 1.5);
  // A first-time player bets and picks stances like a coin flip, not a planner.
  return [
    randomPolicy,
    { ...firstTimer, chohan: randomPolicy.chohan, stance: (_s, _w, rng) => pickOne<Stance>(['aggressive', 'defensive'], rng) },
    careful('careful-fighter', ['chikara', 'waza'], content),
    careful('careful-talker', ['kuchi', 'me'], content),
  ];
}

export interface RunRecord {
  ending: string;
  events: number;
  checks: { stat: StatKey; dc: number; pct: number; passed: boolean; onBuild: boolean }[];
  fights: { winPct: number; won: boolean }[];
  money: number;
  suspicion: number;
  repeats: number;
  shown: string[];
  items: string[];
  minResolve: number;
  minHealth: number;
  lastAct: number;
  // Per act: events resolved and net track change, for the per-event budgets in 12.
  byAct: Record<number, { events: number; resolve: number; health: number; suspicion: number }>;
  // Track changes attributed to the event (root or node) that caused them.
  deltas: Record<string, { suspicion: number; resolve: number; health: number }>;
}

export function playRun(
  content: runner.Content,
  intro: GameEvent,
  startingStats: RunState['stats'],
  startFlags: string[],
  policy: Policy,
  seed: number
): RunRecord {
  const rng = mulberry32(seed);
  const botRng = mulberry32(seed ^ 0x5bd1e995);
  const state = createInitialState({ ...startingStats }, content.events, rng);
  for (const f of startFlags) state.flags.add(f);
  state.drawnOnce.add(intro.id);
  const rec: RunRecord = { ending: 'stuck', events: 0, checks: [], fights: [], money: 0, suspicion: 0, repeats: 0, shown: [], items: [], deltas: {}, minResolve: state.resolve, minHealth: state.health, lastAct: 1, byAct: {} };
  const seenRoots = new Set<string>();
  let next: runner.Next = { kind: 'event', event: intro };

  for (let guard = 0; guard < 500 && next.kind !== 'ending'; guard++) {
    if (next.kind === 'levelup') next = runner.levelUp(state, content, policy.levelUp(state, botRng), rng);
    else if (next.kind === 'rest') next = runner.rest(state, content, policy.rest(state, botRng), rng);
    else {
      const ev = next.event;
      rec.shown.push(ev.id);
      if ((ev.acts ?? [1]).length && seenRoots.has(ev.id)) rec.repeats++;
      seenRoots.add(ev.id);
      const before = { suspicion: state.suspicion, resolve: state.resolve, health: state.health };
      let outcome: Outcome | undefined;
      if (ev.type === 'story') {
        const options = ev.choices.filter((c) => meetsRequirement(state, c.requires));
        const r = runner.resolveChoice(state, policy.choose(state, options, botRng), rng);
        outcome = r.outcome;
        if (r.check) rec.checks.push({ ...r.check, pct: r.check.successPct, onBuild: policy.build.includes(r.check.stat) });
      } else {
        const setup = setupCombat(state, ev.foe.power, rng, ev.winPctMod ?? 0);
        const bet = applyChoHan(setup.baseWinPct, rng, policy.chohan(botRng));
        const f = runner.resolveFight(state, ev, bet.winPct, policy.stance(state, bet.winPct, botRng), rng);
        if (f.result !== 'escaped') rec.fights.push({ winPct: f.winPct, won: f.result === 'won' });
        outcome = f.outcome;
      }
      const d = (rec.deltas[ev.id] ??= { suspicion: 0, resolve: 0, health: 0 });
      d.suspicion += state.suspicion - before.suspicion;
      d.resolve += state.resolve - before.resolve;
      d.health += state.health - before.health;
      const a = (rec.byAct[state.act] ??= { events: 0, resolve: 0, health: 0, suspicion: 0 });
      if (ev.acts?.length !== 0 || ev.inject) a.events++; // count roots, not nodes/transitions
      a.resolve += state.resolve - before.resolve;
      a.health += state.health - before.health;
      a.suspicion += state.suspicion - before.suspicion;
      rec.minResolve = Math.min(rec.minResolve, state.resolve);
      rec.minHealth = Math.min(rec.minHealth, state.health);
      next = runner.afterOutcome(state, content, ev.id, outcome, rng);
    }
  }
  rec.ending = next.kind === 'ending' ? next.endingId : 'stuck';
  rec.lastAct = state.act;
  rec.events = state.eventsResolved;
  rec.money = state.money;
  rec.suspicion = state.suspicion;
  rec.items = [...state.items];
  return rec;
}

const pct = (n: number, d: number) => (d ? `${((100 * n) / d).toFixed(1)}%` : '—');

export function report(policy: Policy, runs: RunRecord[]): string {
  const n = runs.length;
  const lines: string[] = [`### ${policy.name} (${n} runs)`, ''];
  const endings: Record<string, number> = {};
  for (const r of runs) endings[r.ending] = (endings[r.ending] ?? 0) + 1;
  lines.push('| Ending | Share |', '|---|---|');
  for (const [k, v] of Object.entries(endings).sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${pct(v, n)} |`);

  const checks = runs.flatMap((r) => r.checks);
  const on = checks.filter((c) => c.onBuild);
  const off = checks.filter((c) => !c.onBuild);
  const passRate = (cs: typeof checks) => pct(cs.filter((c) => c.passed).length, cs.length);
  lines.push('', `Checks: ${passRate(checks)} pass overall · on-build ${passRate(on)} (n=${on.length}) · off-build ${passRate(off)} (n=${off.length})`);
  const byDc = new Map<number, typeof checks>();
  for (const c of checks) byDc.set(c.dc, [...(byDc.get(c.dc) ?? []), c]);
  lines.push(`By DC: ${[...byDc.keys()].sort((a, b) => a - b).map((dc) => `DC${dc} ${passRate(byDc.get(dc)!)}`).join(' · ')}`);

  const fights = runs.flatMap((r) => r.fights);
  const shownWin = fights.reduce((s, f) => s + f.winPct, 0) / (fights.length || 1);
  lines.push(`Fights: ${fights.length} · shown win% ${shownWin.toFixed(1)} vs realized ${pct(fights.filter((f) => f.won).length, fights.length)}`);

  const mean = (xs: number[]) => (xs.reduce((a, b) => a + b, 0) / (xs.length || 1)).toFixed(1);
  lines.push(
    `End state: events ${mean(runs.map((r) => r.events))} · money ${mean(runs.map((r) => r.money))} · suspicion ${mean(runs.map((r) => r.suspicion))} · letter carried ${pct(runs.filter((r) => r.items.includes('fathers_letter')).length, n)}`,
    `Repeated events within a run: ${runs.reduce((s, r) => s + r.repeats, 0)} (must be 0)`,
    `Lowest point: Resolve mean ${mean(runs.map((r) => r.minResolve))}, ≤3 in ${pct(runs.filter((r) => r.minResolve <= 3).length, n)} · Health mean ${mean(runs.map((r) => r.minHealth))}, ≤5 in ${pct(runs.filter((r) => r.minHealth <= 5).length, n)}`
  );
  const totals: Record<string, { suspicion: number; resolve: number; health: number }> = {};
  for (const r of runs) {
    for (const [id, d] of Object.entries(r.deltas)) {
      const t = (totals[id] ??= { suspicion: 0, resolve: 0, health: 0 });
      t.suspicion += d.suspicion;
      t.resolve += d.resolve;
      t.health += d.health;
    }
  }
  const top = (k: 'suspicion' | 'resolve' | 'health', sign: 1 | -1) =>
    Object.entries(totals)
      .sort((a, b) => sign * (b[1][k] - a[1][k]))
      .slice(0, 5)
      .map(([id, t]) => `${id} ${(t[k] / n).toFixed(2)}`)
      .join(' · ');
  lines.push(`Top Suspicion sources (per run): ${top('suspicion', 1)}`, `Top Resolve drains (per run): ${top('resolve', -1)}`);
  const acts = [...new Set(runs.map((r) => r.lastAct))].sort();
  if (acts.length > 1 || acts[0] > 1) {
    for (const act of [1, 2, 3]) {
      const reached = runs.filter((r) => r.lastAct >= act);
      if (!reached.length) continue;
      const lost = reached.filter((r) => r.lastAct === act && !r.ending.startsWith('reached_edo'));
      const agg = reached.reduce(
        (t, r) => {
          const a = r.byAct[act];
          if (a) {
            t.events += a.events;
            t.resolve += a.resolve;
            t.health += a.health;
            t.suspicion += a.suspicion;
          }
          return t;
        },
        { events: 0, resolve: 0, health: 0, suspicion: 0 }
      );
      const per = (x: number) => (x / (agg.events || 1)).toFixed(2);
      lines.push(
        `Act ${act}: reached ${pct(reached.length, n)} · lost here ${pct(lost.length, reached.length)} of those · per event: Resolve ${per(agg.resolve)}, Health ${per(agg.health)}, Suspicion ${per(agg.suspicion)}`
      );
    }
  }
  lines.push('');
  return lines.join('\n');
}

// Realized-vs-shown combat accuracy by 10-point bucket (02 §15: within ±5%).
export function combatAccuracy(runs: RunRecord[]): { bucket: string; n: number; shown: number; realized: number }[] {
  const fights = runs.flatMap((r) => r.fights);
  const out = [];
  for (let lo = 0; lo < 100; lo += 10) {
    const fs = fights.filter((f) => f.winPct >= lo && f.winPct < lo + 10);
    if (fs.length < 200) continue;
    out.push({
      bucket: `${lo}-${lo + 9}`,
      n: fs.length,
      shown: fs.reduce((s, f) => s + f.winPct, 0) / fs.length,
      realized: (100 * fs.filter((f) => f.won).length) / fs.length,
    });
  }
  return out;
}

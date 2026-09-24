// npm run sim [-- --runs N] : plays N seeded runs per policy and prints a report.
import { combatAccuracy, playRun, policies, report } from './harness';
import * as runner from '../engine/runner';
import { ACT1_EVENTS, INTRO_EVENT } from '../content/events.act1';
import { TALE1_ACT1_CHAIN } from '../content/chain.tale1.act1';
import { ENDINGS } from '../content/endings';
import { ACTS, STARTING_STATS, TALE_START_FLAGS } from '../content/tale';

// vite-node provides Node's process; the browser tsconfig has no Node types.
declare const process: { argv: string[] };

const arg = process.argv.indexOf('--runs');
const runs = arg > 0 ? Number(process.argv[arg + 1]) : 10_000;
const content = runner.makeContent([INTRO_EVENT, ...ACT1_EVENTS, ...TALE1_ACT1_CHAIN], ACTS, ENDINGS);

const all = [];
for (const policy of policies(content)) {
  const recs = Array.from({ length: runs }, (_, i) => playRun(content, INTRO_EVENT, STARTING_STATS, TALE_START_FLAGS, policy, i + 1));
  all.push(...recs);
  console.log(report(policy, recs));
}
console.log('### Combat accuracy, all policies (shown vs realized win%)\n');
for (const b of combatAccuracy(all)) {
  console.log(`${b.bucket}%: n=${b.n} shown ${b.shown.toFixed(1)} realized ${b.realized.toFixed(1)} (Δ ${(b.realized - b.shown).toFixed(1)})`);
}

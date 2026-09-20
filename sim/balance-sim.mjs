// The Floating Road — standalone balance-sim prototype
//
// Purpose: validate the check formula (GDD §6), leveling cadence (GDD §4.3),
// and combat formula (GDD §7.1) against the balance targets in GDD §15,
// BEFORE the real engine or any content exists. This is deliberately not the
// "real" simulation harness described in 04-technical-plan.md §5 (that one
// runs the actual EventDirector/RunReducer against real event/item data once
// they exist, per the P2 MVP roadmap item). This script re-implements just
// the three formulas in isolation with placeholder content assumptions,
// documented inline and in game-plan/06-balance-sim-report.md, so the
// constants can be sanity-checked cheaply and re-run whenever a formula
// changes.
//
// Run with: node sim/balance-sim.mjs

// ---------- seeded RNG (mulberry32, per GDD/tech-plan RNG choice) ----------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- GDD §6: skill check formula ----------
// success% = clamp(50 + (stat - DC) * 8 + modifiers, 5, 95)
// Auto-success: DC <= 4 and margin (stat - DC) >= 6 -> no roll, always passes.
// Bad-luck protection (scaling): from the 2nd consecutive failure on, +5% per
// additional consecutive failure, capping at +25%, reset on any success.
function checkOutcome(rng, stat, dc, consecutiveFails) {
  const margin = stat - dc;
  if (dc <= 4 && margin >= 6) {
    return { passed: true, autoSuccess: true, successPct: 100, pityBonus: 0 };
  }
  const pityBonus = Math.min(25, Math.max(0, (consecutiveFails - 1) * 5));
  const successPct = Math.min(95, Math.max(5, 50 + margin * 8 + pityBonus));
  const passed = rng() * 100 < successPct;
  return { passed, autoSuccess: false, successPct, pityBonus };
}

// ---------- GDD §7.1: combat formula ----------
// Win% = clamp(50 + (You - Foe) * 6, 5, 95)
// You = weapon_tier*4 + Chikara + Waza + armor + condition
// Placeholder item numbers (NOT yet specified in the GDD - flagged as such):
//   weapon tier index 0..3 (rusted/serviceable/fine/meibutsu) -> tier*4 = 0/4/8/12
//   armor flat bonus by act-appropriate gear: 0 / 3 / 6
//   condition: weapon wear, modeled as a random -10..0 drag
function combatWinPct(rng, chikara, waza, weaponTier, armorBonus) {
  const condition = -Math.floor(rng() * 11); // 0..-10
  const you = weaponTier * 4 + chikara + waza + armorBonus + condition;
  return you; // caller combines with foe power
}

// ---------- run/act structure (GDD §3, §15) ----------
const ACTS = [
  { name: 'Act 1', events: 13, levelInterval: 3, dcWeights: { 2: 0.20, 4: 0.35, 6: 0.35, 8: 0.10 } },
  { name: 'Act 2', events: 17, levelInterval: 4, dcWeights: { 4: 0.20, 6: 0.40, 8: 0.30, 10: 0.10 } },
  { name: 'Act 3', events: 8, levelInterval: 4, dcWeights: { 6: 0.15, 8: 0.40, 10: 0.35, 12: 0.10 } },
];
const GATED_FRACTION = 0.6; // "~40% of choices are ungated" (GDD §17)
const ALIGNED_CHECK_FRACTION = 0.55; // fraction of gated checks that use a stat the bot actually built

function weightedPick(rng, weights) {
  const entries = Object.entries(weights);
  let r = rng();
  for (const [k, w] of entries) {
    if (r < w) return Number(k);
    r -= w;
  }
  return Number(entries[entries.length - 1][0]);
}

// ---------- bot policies (stat archetypes, GDD §4.3) ----------
// Six stats: [Chikara, Waza, Chi, Kuchi, Me, Tan]. Index 0/1 treated as the
// "build" pair for the Focused/Balanced archetypes (arbitrary but consistent
// choice - a real sim would vary this per Tale).
const STAT_CAP = 15; // GDD §4.3: "Range 1-15 in practice"

function makeBot(archetype) {
  if (archetype === 'focused') {
    return {
      name: 'Focused (dumps into one stat)',
      stats: [5, 3, 2, 2, 1, 1],
      levelUp(stats) { stats[0] = Math.min(STAT_CAP, stats[0] + 2); },
    };
  }
  if (archetype === 'balanced') {
    return {
      name: 'Balanced (spreads across two stats)',
      stats: [3, 3, 2, 2, 2, 2],
      levelUp(stats, i) { const j = i % 2; stats[j] = Math.min(STAT_CAP, stats[j] + 2); },
    };
  }
  return {
    name: 'Random (no build plan)',
    stats: [3, 2, 3, 2, 2, 2],
    levelUp(stats, i, rng) { const j = Math.floor(rng() * 6); stats[j] = Math.min(STAT_CAP, stats[j] + 2); },
  };
}

function simulateRun(rng, archetype) {
  const bot = makeBot(archetype);
  const stats = [...bot.stats];
  let consecutiveFails = 0;
  let levelUpCount = 0;
  let eventIndex = 0;
  const results = {
    totalChecks: 0, passes: 0, autoSuccesses: 0, pityApplied: 0, byDc: {},
    aligned: { total: 0, passes: 0 }, unaligned: { total: 0, passes: 0 },
  };
  const combatWins = [];

  for (const act of ACTS) {
    let sinceLevel = 0;
    for (let i = 0; i < act.events; i++) {
      eventIndex++;
      sinceLevel++;
      if (sinceLevel >= act.levelInterval) {
        sinceLevel = 0;
        bot.levelUp(stats, levelUpCount, rng);
        levelUpCount++;
      }

      if (rng() < GATED_FRACTION) {
        const dc = weightedPick(rng, act.dcWeights);
        const aligned = rng() < ALIGNED_CHECK_FRACTION;
        const statIdx = aligned ? (archetype === 'random' ? Math.floor(rng() * 6) : rng() < 0.5 ? 0 : 1) : Math.floor(rng() * 6);
        const stat = stats[statIdx];

        const outcome = checkOutcome(rng, stat, dc, consecutiveFails);
        results.totalChecks++;
        if (!results.byDc[dc]) results.byDc[dc] = { total: 0, passes: 0 };
        results.byDc[dc].total++;
        const bucket = aligned ? results.aligned : results.unaligned;
        bucket.total++;
        if (outcome.passed) {
          results.passes++;
          results.byDc[dc].passes++;
          bucket.passes++;
          consecutiveFails = 0;
        } else {
          consecutiveFails++;
        }
        if (outcome.autoSuccess) results.autoSuccesses++;
        if (outcome.pityBonus > 0) results.pityApplied++;
      }

      // one combat encounter per act, roughly (placeholder cadence)
      if (i === Math.floor(act.events / 2)) {
        const weaponTier = act === ACTS[0] ? 1 : act === ACTS[1] ? 2 : 3;
        const armorBonus = act === ACTS[0] ? 0 : act === ACTS[1] ? 3 : 6;
        const you = combatWinPct(rng, stats[0], stats[1], weaponTier, armorBonus);
        const foePower = act === ACTS[0] ? 12 : act === ACTS[1] ? 20 : 30; // placeholder printed foe power, rising per act
        const winPct = Math.min(95, Math.max(5, 50 + (you - foePower) * 6));
        combatWins.push({ act: act.name, winPct });
      }
    }
  }

  return { results, combatWins, finalStats: stats };
}

function runSimulation(archetype, n, seedBase) {
  const agg = {
    totalChecks: 0, passes: 0, autoSuccesses: 0, pityApplied: 0, byDc: {},
    aligned: { total: 0, passes: 0 }, unaligned: { total: 0, passes: 0 },
  };
  const combatByAct = {};
  for (let run = 0; run < n; run++) {
    const rng = mulberry32(seedBase + run);
    const { results, combatWins } = simulateRun(rng, archetype);
    agg.totalChecks += results.totalChecks;
    agg.passes += results.passes;
    agg.autoSuccesses += results.autoSuccesses;
    agg.pityApplied += results.pityApplied;
    agg.aligned.total += results.aligned.total;
    agg.aligned.passes += results.aligned.passes;
    agg.unaligned.total += results.unaligned.total;
    agg.unaligned.passes += results.unaligned.passes;
    for (const [dc, v] of Object.entries(results.byDc)) {
      if (!agg.byDc[dc]) agg.byDc[dc] = { total: 0, passes: 0 };
      agg.byDc[dc].total += v.total;
      agg.byDc[dc].passes += v.passes;
    }
    for (const cw of combatWins) {
      if (!combatByAct[cw.act]) combatByAct[cw.act] = [];
      combatByAct[cw.act].push(cw.winPct);
    }
  }
  return { agg, combatByAct };
}

function pct(n, d) { return d === 0 ? 0 : (100 * n / d).toFixed(1); }
function avg(arr) { return arr.length === 0 ? 0 : (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1); }

const N_RUNS = 10000;
const SEED_BASE = 20260920;

console.log(`\n=== The Floating Road — balance-sim prototype (${N_RUNS} runs/archetype) ===\n`);

for (const archetype of ['focused', 'balanced', 'random']) {
  const { agg, combatByAct } = runSimulation(archetype, N_RUNS, SEED_BASE);
  const bot = makeBot(archetype);
  console.log(`--- ${bot.name} ---`);
  console.log(`Overall check pass rate: ${pct(agg.passes, agg.totalChecks)}%  (target: 55-65%, GDD §15)`);
  console.log(`  - on trained/aligned-stat checks: ${pct(agg.aligned.passes, agg.aligned.total)}%  (n=${agg.aligned.total})`);
  console.log(`  - on off-build/unaligned checks:  ${pct(agg.unaligned.passes, agg.unaligned.total)}%  (n=${agg.unaligned.total})`);
  console.log(`Auto-success rate (of all checks): ${pct(agg.autoSuccesses, agg.totalChecks)}%`);
  console.log(`Checks with pity bonus applied: ${pct(agg.pityApplied, agg.totalChecks)}%`);
  console.log('Pass rate by DC:');
  for (const dc of Object.keys(agg.byDc).map(Number).sort((a, b) => a - b)) {
    const v = agg.byDc[dc];
    console.log(`  DC ${dc}: ${pct(v.passes, v.total)}%  (n=${v.total})`);
  }
  console.log('Combat win% by act (avg of Win% shown to player, pre-roll):');
  for (const [act, arr] of Object.entries(combatByAct)) {
    console.log(`  ${act}: avg ${avg(arr)}%`);
  }
  console.log('');
}

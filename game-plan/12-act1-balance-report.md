# 12 — Act 1 Balance Report (sim harness, first pass)

The first run of the real balance harness that `02` §15 and `04` §5 call for.
Unlike `06-balance-sim-report.md`, which re-implemented the formulas in
isolation, this plays whole runs through the **same engine code the browser
uses** (`src/engine/runner.ts`), over the real content: the intro, the 23-event
Act 1 pool and Tale 1's Act 1 chain.

Run it with `npm run sim` (or `npm run sim -- --runs N`). Code:
`src/sim/harness.ts`, `src/sim/run.ts`. Guard-rail tests in
`src/sim/harness.test.ts` keep the headline numbers from drifting unnoticed.

## Method

10,000 seeded runs per policy. Four bot policies stand in for players:

| Policy | Choices | Level-ups | Combat | Rest |
|---|---|---|---|---|
| **random** | uniform among available choices | random stat | random bet, random stance (incl. escape) | inn half the time if affordable |
| **first-timer** | softmax over expected value (temperature 1.5): usually sensible, sometimes not | Chikara/Waza | random bet, aggressive or defensive | as careful |
| **careful-fighter** | best expected value | Chikara/Waza, lowest first | skip bet, defensive | inn if ≥ 300 mon or hurt and ≥ 150 |
| **careful-talker** | best expected value | Kuchi/Me, lowest first | skip bet, defensive | as above |

"Expected value" weighs Suspicion heavily (−3 per point, −8 once at 3+), health
and Resolve more as they run low, money lightly, and gives story progress
(flags, items) a small positive value. Follow-ups that start a fight count as
risk.

## Before tuning: what the harness found

| | random | first-timer | careful |
|---|---|---|---|
| Survive Act 1 | 73% | 94% | 100% |
| Arrested | 22% | 4.5% | 0% |
| Died | 3.7% | 1.6% | 0% |
| **Despair** | **0%** | **0%** | **0%** |
| Lowest Resolve reached (mean) | 8.3 | 8.5 | 8.9 |
| Runs ever at Resolve ≤ 3 | 0% | 0% | 0% |

**Resolve was decoration.** `02` §5 calls it the second death clock, but no
policy, random included, ever dropped below Resolve 3 in Act 1. Losses were
small (−1, occasionally −2), and the free rest node gave +1 every 4 events.
Suspicion was effectively the only way to fail.

## Changes

1. **The free rest option gives health only, not Resolve.** `02` §3 (core loop) says it
   "recovers little ... but it always stops a Resolve bleed". It must never
   *cost* Resolve; it doesn't have to *restore* it. The paid inn still gives +3.
2. **`kirisute_tension`, "Bow low": Resolve −1 → −2.** This matches `03` sample 5,
   the fully written version of the same scene ("kneel ... −Resolve 2").
3. **`t1_fujieda_duel`, "Walk on": Resolve −1 → −2.** Leaving a man to be cut
   down is "atrocity witnessed" in `02` §5's list of Resolve drains.
4. **Starting Resolve 10 → 7 (max stays 10).** A rōnin 33 years after Osaka,
   walking east with nothing, starts worn, not full. Changes 1–3 alone moved the
   mean low point only from 8.3 to 7.4. Act 1 content carries too little Resolve
   loss to matter from a full bar, and making every event harsher would cut
   against Act 1's gentler role. Starting at 8 gave random runs 0.4% despair;
   7 gives 1%.

Suspicion was left alone. First-timer arrests sit around 5%. The top sources
are the two barriers (the mandatory Arai watch-list and the random Hakone
event), which were historically the road's real danger (`01` §B3). Random-play
arrests of 22% are a floor for careless play, not a target.

## After tuning

| | random | first-timer | careful-fighter | careful-talker |
|---|---|---|---|---|
| Survive Act 1 | 72% | 93% | 100% | 100% |
| ...carrying the father's letter | 23% | 42% | 100% | 100% |
| Arrested | 23% | 5.2% | 0% | 0% |
| Died | 3.9% | 1.7% | 0% | 0% |
| Despair | 1.0% | 0.0% | 0% | 0% |
| Lowest Resolve reached (mean) | 5.3 | 6.1 | 6.8 | 6.9 |
| Runs ever at Resolve ≤ 3 | 15% | 5.2% | 0% | 0% |
| Runs ever at Health ≤ 5 | 11% | 6.8% | 0% | 0% |

### Against `02` §15's targets

| Target | Result | |
|---|---|---|
| Check pass rate 55–65% on the build's stats | 59.7% first-timer, 58.9% fighter, 55.5% talker | ✓ |
| Combat odds within ±5% of realized | every 10-point bucket within 1.7 points | ✓ |
| No repeated events per run | 0 repeats in 40,000 runs | ✓ |
| First-run survival ~40% | 93% for a first-timer, **for Act 1 alone** | see below |
| Run length 30–45 events | 14 (Act 1 only) | n/a until Acts 2–3 exist |

**Survival.** The ~40% target is for a full three-act run. With Act 1 at about
93% for a first-timer, Acts 2 and 3 together have to bring survival down to
about 43%, i.e. roughly 55–65% survival each. That is a real difficulty ramp,
consistent with Act 1's gentler role (`02` §3), but it means Acts 2–3 need
substantially more lethal content per event than Act 1 has. Guidance for that
authoring:
- **Resolve:** Act 1 content averages about −0.2 Resolve per event net. For
  Resolve to be a live clock in Acts 2–3 (starvation, humiliation in Edo,
  betrayal, the Keian executions), aim for roughly −0.4 to −0.5 per event net,
  with festivals, kindness and inns as the counterweight.
- **Failure variety:** the forced endings should each claim some runs. After
  tuning, careless play fails as arrest > death > despair (23% / 4% / 1%). Keep
  arrest from being the only way to lose.
- **Re-run `npm run sim` after every content drop.** The guard-rail test fails
  if careful play stops clearing Act 1 or random play starts clearing it
  reliably.

## Known limits

- The bots are heuristics, not people. "First-timer" is a guess at a new
  player's decision quality; real playtests (`04` §5's protocol) should
  calibrate it.
- One Tale, one act. Tale-tagged content and later acts will need their own
  policies (e.g. an underworld-leaning bot for the Aku routes).
- Money never binds in Act 1 (runs end with ~90–170 mon). It will matter once
  shops, the gambling den (`02` §9.2) and peddling (`02` §9.3) exist.

## Follow-up: Acts 2 and 3 random pools, previewed

The Act 2 (`src/content/events.act2.ts`, 10 Edo events) and Act 3
(`src/content/events.act3.ts`, 6 events from the Keian summer) random pools
are written. They aren't playable yet: the game still ends at Edo, because
the Act 2–3 chains and Tale 1's 12 endings aren't authored. To measure them
now, `npm run sim -- --preview` plays all three acts (`src/sim/preview.ts`).
Acts 2 and 3 use their pools only, each sized to its pool (10 and 6 events)
so nothing repeats, joined by stand-in transitions.

Preview, 10,000 runs per policy:

| | random | first-timer | careful-fighter | careful-talker |
|---|---|---|---|---|
| Survive all three acts | 7% | 63% | 99% | 93% |
| Lost in Act 1 / 2 / 3 (of those who reached it) | 28 / 46 / 82% | 7 / 10 / 25% | 0 / 0 / 1% | 0 / 0 / 7% |
| Resolve per event, Act 2 / Act 3 | −0.54 / −0.55 | −0.54 / −0.52 | −0.51 / −0.45 | −0.64 / −0.33 |
| Arrested / despair / died | 60 / 22 / 11% | 25 / 10 / 3% | 0.7 / 0.4 / 0% | 6.7 / 0.4 / 0% |

- **Resolve is on budget:** about −0.5 per event in Acts 2–3, as guided above.
  Despair is now a real way to lose.
- **Difficulty ramps by act:** first-timers lose 7%, then 10%, then 25% of
  those still going.
- **Fights calibrated:** Act 2's kabukimono went from foe power 12 to 14, and
  Act 3's hunted rōnin from 14 to 16. That pulls fighters from ~79% to ~74%
  shown win odds across the run and adds health pressure. Combat accuracy
  stays within ±2%.
- **One duplicate removed:** both pools had a "lantern-less bridge" fight.
  Act 2's kabukimono toll moved to a lane behind the timber yards; Act 3 keeps
  the bridge, where the hunted rōnin mirrors the player.
- **First-timer survival here is 63%, above `02` §15's ~40%.** That's
  expected: these acts are 10 and 6 events against 16 and 8 at full length
  (`11` §4.1), and they carry none of their chain beats. The chains hold the
  deadliest fights (the Katsuragi duel, the Sagawa sweeps, Sunpu). Death is
  still rare (3% for first-timers), so the chain fights are where lethality
  should come from. Re-measure when the chains are in before tuning further.

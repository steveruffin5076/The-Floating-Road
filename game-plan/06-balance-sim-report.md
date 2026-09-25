# 06 — Balance-Sim Report (prototype pass)

Companion to `05-design-review.md`. That review flagged that the §15 balance
targets couldn't be validated because no document specified a leveling
cadence or a DC distribution per act. `02-game-design.md` §4.3 has since fixed
the cadence (~1 level/4 events, front-loaded in Act 1). This report runs that
number, plus the §6 check formula and §7.1 combat formula, through a small
standalone simulator — **not** the real engine (none exists yet), and not the
full bot-policy harness described in `04-technical-plan.md` §5 (that one runs
against real event/item/enemy data once it exists, per the P2 MVP roadmap
item). This is a cheaper, earlier check: does the *math* work before any of
that data exists?

Code: [`sim/balance-sim.mjs`](../sim/balance-sim.mjs). Zero dependencies, runs
with `node sim/balance-sim.mjs`. Seeded (mulberry32) for reproducibility.

## Method

- 3 acts sized per §3 (13/17/8 events ≈ 38 total, inside the 30–45 target).
- Leveling: 1 level (2 stat points) every 3 events in Act 1, every 4 in Acts
  2–3 (the "front-loaded" cadence from §4.3), capped at the stated practical
  stat ceiling of 15.
- Three stat archetypes: **Focused** (all level-up points into one stat),
  **Balanced** (alternates between two stats), **Random** (points scattered
  across all six — the "no build" baseline).
- 60% of events are gated checks (per §17's "~40% ungated" note). Of those,
  55% draw a stat the archetype actually invested in ("aligned"); 45% draw an
  arbitrary stat, including dump stats ("unaligned") — this fraction is an
  assumption, not sourced from a doc, since no event-authoring data exists yet
  to measure it from.
- DC per check drawn from a per-act weighted table I invented for this pass
  (Act 1 tops out at DC 8 rarely, Acts 2–3 skew harder) — **placeholder**,
  since no doc specifies the actual DC mix per act; only the tier *labels*
  (§6) and the "Act 1 rarely exceeds DC 6" note (§6) exist.
- **Not modeled:** item/trait/NPC modifiers (§6 lists +5..+15 typical item
  bonuses). This sim isolates raw stat-vs-DC only, so its absolute pass rates
  are a lower bound — real modifiers should only push realized rates upward
  from what's reported here.
- Combat: uses the §7.1 formula with placeholder weapon-tier/armor/foe-power
  numbers (none are specified in any doc yet) — included for a formula sanity
  check only, not as a claim about real combat balance.

10,000 seeded runs per archetype.

## Results

| Archetype | Overall pass rate | On trained/aligned checks | On off-build checks |
|---|---|---|---|
| Focused (one stat) | 45.8% | **57.9%** | 31.0% |
| Balanced (two stats) | 51.7% | **65.4%** | 34.9% |
| Random (no build) | 35.5% | 35.6% | 35.3% |

Target from §15: **55–65% average realized pass rate for well-built
characters.**

Pass rate by DC (Balanced archetype):

| DC | Pass rate |
|---|---|
| 2 | 68.3% |
| 4 | 61.3% |
| 6 | 51.5% |
| 8 | 45.1% |
| 10 | 42.4% |
| 12 | 37.2% |

Combat: avg displayed Win% by act (Balanced archetype, placeholder gear
numbers): Act 1 **32.5%**, Act 2 **73.1%**, Act 3 **85.2%**.

## Verdict

**The formula and the new leveling cadence are basically right, once the §15
target is read as applying to checks that test what the character actually
invested in.** Both Focused (57.9%) and Balanced (65.4%) land inside or right
at the edge of the 55–65% target band on aligned checks — that's the formula
fix from the review (auto-success, scaled pity, the leveling cadence) working
as intended. The Random/no-build archetype sits at 35.5% across the board,
clearly below target — which is correct and desirable: §2's "class defines
the game" pillar means an uncommitted build *should* underperform.

**Two things worth deciding, not fixing:**

1. **§15's target wording is ambiguous about which checks it's averaged
   over.** Blended across *all* checks including off-build ones, even a
   well-built character only hits 45.8–51.7%, below target. Read narrowly
   (checks matching the build), it's on target. Recommend editing §15's
   target line to say explicitly "on checks matching the character's
   invested stats" so this sim (and the real one, later) has an unambiguous
   number to check against.
2. **Off-build checks fail 65–69% of the time**, and get worse at high DCs
   late-run where dump stats haven't moved. That's the intended cost of
   specialization, but combined with the existing partial-success floor
   (§6) it should be double-checked in actual play — a run where nearly half
   of all checks are against the character's weak stats could still *feel*
   punishing even though no individual failure is catastrophic. Worth
   watching in the vertical-slice playtest (§16), not a formula change now.

**One placeholder-data finding worth flagging early, even though the numbers
themselves aren't final:** with invented but not-unreasonable Act-1 gear/foe
values, Act 1 combat came out *harder* on average (32.5% win) than Act 2
(73.1%) or Act 3 (85.2%) — the opposite of Act 1's "tutorial-ish" framing in
§3. The specific percentages don't mean anything yet (the underlying weapon
tier / armor / foe-power numbers are placeholders), but the failure mode is
real and worth designing against directly: **when real enemy and starting-gear
numbers are set, explicitly check that a freshly-leveled Act 1 character's
equipped power clears Act 1 foes comfortably**, rather than assuming "later
acts are harder" is automatically true once armor/weapon-tier gating scales
with acts too.

## What this does and doesn't prove

Does: the §6/§7.1 formulas and the §4.3 leveling cadence are internally
consistent and can hit the stated targets under reasonable assumptions.

Doesn't: predict real player pass rates, since it has no real events, items,
or enemies to draw from — that's still the job of the full harness in
`04-technical-plan.md` §5, once there's content to run it against. Treat this
as the thing that should have been true before content gets written, now
confirmed, rather than a replacement for that harness.

## Follow-up (2026-09-20): Act 1 combat numbers pinned

The "Act 1 harder than Act 2/3" finding above was about this report's
invented placeholder foe power (12, vs. this sim's placeholder weaponTier
1/armor 0), not a formula problem. The vertical slice's actual Act 1
content (`src/content/events.act1.ts`) has since had its two combat foe
powers set for real — 8 (Bandit rōnin) and 9 (Night tsujigiri attacker) —
calibrated directly against the real `combatResolver` formula and this
slice's real starting loadout and stat ranges, landing base win% around
44-68% and 38-62% respectively depending on Chikara/Waza investment. See
`progress.md`'s "Real combat numbers" entry for the calibration method.
This doesn't touch Acts 2-3 (they don't exist yet in the vertical slice),
so the same check applies again once their content is written.

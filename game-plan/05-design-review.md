# 05 — Design Review (Mechanics, Balance & Progression)

A game-design pass over `02-game-design.md`, cross-checked against the *Life In
Adventure* flaws documented in `01-research.md` (§A4) and the scope plan in §16.
This is a critique document — it proposes changes, it does not restate the GDD.

## Summary verdict

The core loop and pillars are sound and the historical mapping (§Part C of
`01-research.md`) is genuinely strong content design. Three things need attention
before content authoring scales up, because fixing them later means rewriting
already-written events:

1. **The balance targets in §15 cannot yet be validated** — the doc is missing the
   one number that determines everything else: how many stat points a character
   accumulates over a run (level-up cadence). Without it, "55–65% average pass
   rate" is a hope, not a design.
2. **Two of the five documented LiA flaws (§A4 items 2 and 3) are only partially
   fixed** — the 95%-cap trivial-check problem and hidden-Suspicion opacity are
   the same shapes as the original complaints, just smaller.
3. **MVP scope (§16) is sized like a full vertical release, not a first
   playable** — recommend cutting it down before 84 events get written against
   formulas that haven't been played yet.

Nothing here is a pillar-level objection — the fixes are formula tweaks, one
missing data table, and a scope cut.

---

## 1. Skill-check and combat math

### 1.1 The missing variable: level-up cadence

`success% = clamp(50 + (stat − DC) × 8 + modifiers, 5, 95)` and the balance
target of ~55–65% realized pass rate for "well-built characters" both depend on
*how much stat a character has accumulated relative to the DCs they're facing at
that point in the run*. §4.3 fixes the rate (+2/level) but no document states
how many level-ups happen, or on what event-count cadence. `04-technical-plan.md`
confirms this isn't specified anywhere (only a generic `xp/level` effect hook
exists in the data schema).

This blocks the balance-sim harness promised in §15/tech-doc §6 from meaning
anything — it needs a leveling curve to simulate against.

**Recommendation:** pin a concrete curve now, e.g. "1 level every ~4 resolved
events, front-loaded slightly in Act 1 so early checks don't feel like a wall."
For a 35-event run that's ~8–9 level-ups × 2 points = 16–18 points into a
character's build, mostly concentrated (per §4.2/§4.3) in 1–2 stats. Check that
against DCs: a focused stat starting at ~5 (origin-biased seed) plus ~12–14
points invested in it by Act 3 reaches ~17–19 — comfortably clearing "brutal"
DC 10+ checks (margin +7–9 → 50+56–72% baseline, clamped to 95%). That tracks
with the pillar. A *dump* stat, seeded ~2 and never invested, stays near DC-6
"moderate" checks at a −4 margin (50−32 = 18%, before modifiers) — which is
the intended "class defines the game" pressure, not a bug. Once a cadence
number is picked, run this same arithmetic for real and adjust the constant
(currently 8) if the sim disagrees.

### 1.2 The clamp ceiling reproduces LiA flaw #3, just smaller

Pillar #2 claims high investment "approaches near-certainty on trivial tasks,"
explicitly framed as the fix for LiA's "30 STR fails to crush an apple a
quarter of the time" complaint (`01-research.md` §A4.3). But the formula clamps
at 95% *unconditionally* — a maxed stat (15) against a trivial DC (2) is
50 + 13×8 = 154, clamped to 95%. That is the same complaint at 1-in-20 instead
of 1-in-4: a permanently unbeatable 5% fail chance on the easiest task in the
game, for the entire run, no matter how invested the character is.

**Recommendation:** don't spend the clamp ceiling on checks where the margin is
already enormous. Two options, either works:
- Auto-succeed (no roll, no odds line) when stat exceeds DC by some large
  margin (e.g. ≥6) on non-combat, non-climax checks — consistent with "readable
  risk," since there's nothing to read when the outcome isn't in doubt.
- Or split the clamp: keep 95% as the ceiling for moderate+ DCs (where tension
  is wanted) but raise it to 99% (or remove it) specifically for trivial/easy
  DCs, so the apple actually gets crushed.

### 1.3 8%-per-point is a steep coefficient relative to the DC spacing

DC tiers are 2 apart (2/4/6/8/10+) but each point of margin swings the odds 8
points — so the entire 5–95% range is spanned by just ~11 points of net
margin. Combined with practical stat range 1–15, an outmatched character (dump
stat vs. a DC well above it) hits the 5% floor fast and stays there for the
rest of the run on that check type. The existing **partial-success** rule
(§6) already softens this for non-combat checks, which is the right instinct —
but it's described only as "weighted by margin," and at the 5% floor the
margin is maximally bad, meaning a floored check could still roll the worst
outcome tier most of the time.

**Recommendation:** make explicit that partial-success weighting has its own
floor — e.g. below some margin threshold, the roll can *only* select from
"lesser outcome" and "full failure," never a third harsher tier some events may
define, so being badly outmatched costs you the win but never spikes to the
game's worst punishment on a coin-flip-adjacent 5% roll.

### 1.4 Combat formula can't be sanity-checked yet — flag, don't block

`Win% = clamp(50 + (You − Foe) × 6, 5, 95)` with
`You = weapon_tier×4 + Chikara + Waza + armor + condition` is structurally fine
(same clamp-and-linear shape as the check formula, slightly gentler slope),
but none of the actual tier/armor/condition numbers are pinned down yet
(weapon tiers, armor bonuses, condition penalties are named in §5's inventory
section but not valued). This is fine to leave for the balance-sim pass in
`04-technical-plan.md` §6, but note it explicitly as a prerequisite there
rather than assuming §7's formula is validated — right now it's unvalidated
in the same way as §1.1 above, for the same missing-numbers reason.

The **chō-han bet** (+20/−20 on a 50/50 call) is a clean, intentional
zero-expected-value variance injector — worth stating that explicitly in the
doc so a future balance pass doesn't "fix" it into a positive-EV freebie by
accident. The **stance choices** (aggressive/defensive/escape) modify
consequences rather than win%, which is good design — no changes needed there.

### 1.5 Bad-luck protection is a single weak pulse, not a safety net

"+10% after 3 consecutive failures, resets on success" is a one-shot nudge. It
fires rarely (needs a genuine streak) and applies to exactly one roll before
resetting, so statistically it barely moves outcomes over a full run — a thin
answer to the flaw it's meant to fix (`01-research.md` §A4.4, "no counterplay
to bad luck streaks").

**Recommendation:** make it scale with streak length instead of triggering
once — e.g. +5% per consecutive failure starting at the 2nd, capping at +25%,
resetting on any success. This costs nothing extra to implement (it's the same
counter, just a multiplier instead of a boolean) and actually behaves like a
pity system under a real bad-luck run instead of a single lucky break.

---

## 2. Economy pacing

No document currently gives numeric wage/price values for the income sources
listed in §9 (day-labor, bodyguard contracts, bounty-hunting, peddling, etc. —
all described only qualitatively: "safe, low," "pays more"). `01-research.md`
§B4 has real period price anchors (noodles ~16–20 mon, cheap inn ~100–200 mon,
a decent katana 1–3 ryō) that §9 never converts into a game wage table. This
blocks the same balance-sim harness as §1.1 — it can't simulate money curves
without income numbers to roll.

**Recommendation:** add a wage/price table to §9 before content authoring
locks in event rewards, seeded from the §B4 research anchors already done.

**The Tale-3 debt mechanic compounds faster than it may look.** Principal 100
ryō at 25%/tick, with "each act ≈ 2–3 season ticks" over 3 acts ≈ 7–8 ticks in
a full run: `100 × 1.25^8 ≈ 596 ryō` if left untouched — roughly a 6× blowup,
against a wage scale where a kago ride costs "a ryō or more per day." If that
spiral is intentional — the doc's phrasing ("worked off via underworld jobs →
slides Aku") suggests it is, pushing debtor-Tale players toward the
underworld path rather than honest repayment — then say so explicitly in §9 as
designed pressure, and pair it with:
- an early lump-sum payoff option (a discounted "buy out the note" event
  available while the balance is still small) so a player who saves
  aggressively gets a real honest-path payoff instead of the debt always
  outrunning them, and
- a compounding cutoff (e.g. interest freezes once Act 3 begins) so a debtor
  who ignored the underworld route isn't mathematically locked out of a
  clean ending in the final act, which would cut against the "no wasted runs"
  pillar (§2.3).

---

## 3. Resolve / Suspicion / Reputation as pressure valves

**Resolve** drains partly from "rain-sodden nights," and the world already has
weather-driven stranding events (plum-rain floods at the Ōi ford, per §8 and
`01-research.md` §B3/§B8). A broke character stuck at a flooded crossing with
no inn money is exposed to repeated nightly Resolve loss with no obvious way
to break the loop — structurally the same shape as LiA flaw #4 (no
counterplay to a bad streak), just running on the Resolve clock instead of
Health. The research doc already names the period-accurate answer ("sleeping
rough under eaves or in straw capes," §B8).

**Recommendation:** guarantee a free or near-free "shelter for the night"
choice at every rest node, always available regardless of money, so a
stranded/broke run can always stop the Resolve bleed even if the outcome text
is mildly unpleasant. This costs no new system — it's a floor option on nodes
that already exist.

**Suspicion is hidden**, but §10 explicitly designs endings *not* to hide their
direction from the player ("visible trajectory... so hidden gates never
blindside the player," directly answering LiA flaw #2). Suspicion crossing 3
(patrols turn hostile) or 5 (wanted-poster chain, possible arrest) is exactly
the kind of consequence that flaw was about, but the track itself carries no
visible signal.

**Recommendation:** give Suspicion the same rumor-line treatment §10 already
uses for endings — a status-screen hint at tier boundaries ("people are
starting to eye you at checkpoints") rather than an exact number. That keeps
the number hidden (so it's not gameable) while keeping the *direction* legible,
consistent with the principle the doc already commits to elsewhere.

---

## 4. Event Director vs. the documented LiA flaws

Checked against `01-research.md` §A4 point by point:

| LiA flaw | Fix in §8 | Assessment |
|---|---|---|
| #1 Repetitive pool within a run | No-repeat bag, reshuffle on exhaustion, rare-event guaranteed-spawn counter | Solid — directly solves the stated problem |
| #5 Unconnected quests | Guaranteed spine (10–14 chain events/Tale at act milestones) + act structure + historical spine | Solid |
| #3 Punishing flat RNG | DC-relative scaling + partial success | Mostly solid — see §1.2–1.3 above for the remaining edge |
| #4 No counterplay to bad luck | Bad-luck protection | Weak as specified — see §1.5 |
| #2 Opaque ending gates | Visible ending trajectory (§10) | Solid, but see §3 — Suspicion doesn't get the same treatment |

**One gap not covered by the table above:** the no-repeat bag resets *per run*,
which solves within-run repetition but not *across consecutive runs* — a
player restarting immediately after a death can plausibly draw a very similar
opening sequence twice in a row, since the bag reshuffles fresh each run. This
is a different complaint than the one §8 was built to fix, and isn't
necessarily worth solving for MVP, but it should be a named, deliberate scope
decision in §17's risk table rather than an implicit gap — "cross-run event
recency" as a V1.x nice-to-have (e.g. don't let last-run's opening event repeat
immediately) is cheap to add later if it starts feeling repetitive quicker than
within-run reuse would.

---

## 5. MVP scope risk (§16)

The stated MVP is: 2 full Tales, all 3 Acts including the Keian set-piece
climax, 60 generic + 24 chain events, combat + chō-han, 2 shops, 12 endings,
traits/omoide meta, codex v1, and ~12–15 pieces of commissioned art. That's a
complete small game, not a first playable — and §17 already names the
project's biggest risk as "text volume is the whole game (content
treadmill)." Committing 84 authored events and a full art pass against check
and combat formulas that (per §1.1 and §1.4 above) haven't been simulated or
played yet means a formula fix after the fact could invalidate tuning across
all of it.

**Recommendation:** cut a smaller true vertical slice ahead of the current
MVP: one Tale, Act 1 only (~20–25 events, no chain-climax requirement), no
commissioned art (placeholder/none), 3–4 endings. Use it to playtest the
check-odds feel and run the balance-sim harness for real, lock the formula
constants from §1, *then* commit to authoring the full 84-event/12-ending MVP
against numbers that are known to work. This doesn't change any content
already planned — §16's MVP can stay as the target, this just inserts a
cheaper checkpoint before the expensive part.

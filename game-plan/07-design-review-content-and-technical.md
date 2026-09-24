# 07 — Design Review (Content & Technical)

A pass over `03-story-and-content.md` and `04-technical-plan.md`, cross-checked
against `02-game-design.md` (as already revised by `05-design-review.md`) and
against what `progress.md` says is actually built. This is a critique
document — it proposes changes, it does not restate either source doc.

## Summary verdict

The world-building and the six Tales are the strongest asset in the whole
project: period-accurate, structurally sound (every Tale's endings map
cleanly onto stats/tracks §02 actually has), and the six sample events in
`03` §7 are good enough to author against almost as-written. `04`'s stack
choice and architecture are sensible and the schema sketch is clearly
*trying* to match `03`'s content style — in one case (`checkpoint_hakone_papers`
/ flag `guard_face_remembered`) `04`'s own schema example is lifted verbatim
from `03`'s sample event, which is a good sign of deliberate cross-doc
discipline, not an accident.

Four things need attention before content authoring scales past the current
vertical slice:

1. **`04`'s event schema has no per-choice gating field.** Nearly every
   sample event in `03` §7 gates individual *choices* on items, money, stats,
   Tale, or flags (`[requires ≥ 100 mon]`, `(Tale 1 only)`, `[requires item:
   guide's tally OR Me ≥ 7...]`), and `02` §12's UI mock explicitly shows a
   greyed-out locked choice. `04`'s schema (§3) only shows a `requires` block
   at the whole-*event* level. As written, the documented schema cannot
   express most of `03`'s content.
2. **Two named mini-systems have no formula home anywhere.** The standalone
   chō-han gambling den (03 §7 sample 3, and Tale 4's entire core mechanic)
   and the buy-low/sell-high peddling loop (02 §9, 03 Tale 3) are described
   in prose only — `02` formalizes just the pre-*combat* chō-han bet, not the
   den economy, and `04`'s effects vocabulary has no wager/stake/house-cut or
   goods-price concepts at all.
3. **`04`'s roadmap still describes the pre-`05` scope.** `05-design-review.md`
   §5 got its "insert a smaller vertical slice before the MVP" recommendation
   folded into `02` §16 — but `04` §6's roadmap still uses the term "Vertical
   slice" for the *old*, bigger P1 (Tale 1 full chain, 30 events, director +
   save + epilogue/ending flow). Two sibling docs now use the same phrase for
   two different scopes, and the thing actually built (per `progress.md`)
   matches `02`'s definition, not `04`'s.
4. **A couple of small but real internal-consistency slips in `03`**: the
   Gi/Aku slider is used inconsistently (both as a single bipolar value and
   as two independent non-negative meters), and the wanted-poster Suspicion
   threshold in `03`'s event bank (≥3) contradicts `02`'s own definition of
   that event (=5).

Nothing here is pillar-level — same verdict shape as `05`: formula/schema
gaps and scope-note edits, not a redesign.

---

## 1. Internal consistency — `03` vs `02`'s mechanics

### 1.1 Gi/Aku is used as two meters, not the one slider `02` defines

`02` §5 defines it as a single axis: `Gi 義 vs Aku 悪 | single slider −5…+5`.
That means there is one number; "Gi" and "Aku" are just the two poles of it.

`03`'s ending tables don't treat it that way. Tale 1: *The Garden Gate*
requires **"Aku ≥ +3"**, *Kabukimono* requires **"Aku ≥ +4"**, *The Plow*
requires **"Gi ≥ +2"** — three separate requirement lines, each phrased as if
Gi and Aku were independent non-negative tracks you accumulate rather than
two ends of one line. Then Tale 6 breaks its own pattern again: the
"betrayal-for-survival" ending is tagged **"Aku −5"** (a negative value,
implying the single-slider reading after all — very negative = deep in Aku
territory). So `03` contains both readings of the same mechanic in different
places.

**Recommendation:** pick one notation and use it everywhere. If it stays a
single slider (cheaper — no `02` change needed), rewrite the Tale 1/2/3
requirement lines as slider comparisons: "slider ≤ −3" for the Aku-leaning
endings, "slider ≥ +2" for the Gi-leaning ones. This is a pure `03` text
edit, no mechanic change.

### 1.2 Suspicion threshold for the wanted-poster event contradicts `02`

`02` §5: *"3+ = patrol/checkpoint events turn hostile; **5 = wanted-poster
event chain, arrest possible**."*

`03` §6, checkpoint pool: *"wanted-poster board (**if Suspicion ≥ 3** your
face is there — instant crisis)."*

These are describing the same event and disagree on its trigger by two whole
tiers (patrol-hostile territory vs. the top of the track). By contrast, the
other Suspicion-gated event in the same list — *"fumi-e inspection day (Tale
6 / Suspicion 4+ only)"* — matches `02` §8's own worked example
("`Fumi-e Test` only fires for Tale 6 or Suspicion≥4") exactly, so this isn't
a systemic pattern, just one drifted number.

**Recommendation:** fix `03`'s wanted-poster entry to `Suspicion ≥ 5` (or,
if 3 was actually intended as a design change, fix `02` §5 instead and note
why) — a one-line edit either way, but it should be a deliberate choice, not
a leftover mismatch.

### 1.3 Tale-specific tracks and mini-systems with no formula in `02`

- **Tale 4** "gets a den-network reputation track instead of the usual
  employer track." `02` §5's track list (Health, Resolve, Money, Suspicion,
  Reputation, Gi/Aux) has no concept of a Tale swapping in a bespoke track.
  Functionally this reads like Reputation with different flavor text and a
  different NPC-facing name — if that's the intent, say so explicitly in `03`
  (cheapest fix); if it's meant to be numerically distinct (e.g., tracked
  per-den rather than as one global number, since dens are per-post-town),
  that's a real new system `02`/`04` need to spec, not just name.
- **The standalone chō-han gambling den** (03 §7 sample 3: stakes, a 10%
  house cut, cheat/detect-tell sub-games, a loan hook for Tale 3) is a
  different mechanic from the one `02` §7.1 actually formalizes (the
  pre-*combat* bet: call chō/han, ±20% to Win%, zero-EV by design). Tale 4 is
  built entirely around the den version — "this Tale starts with the chō-han
  system fully unlocked" — but that version's math (stake sizing, house cut,
  what a successful "watch the wrist" or "sleeve the die" check actually pays
  relative to stake) isn't specified anywhere in `02`.
- **The peddling buy-low/sell-high loop** (02 §9 names it; 03 Tale 3 calls it
  out as "unlocked as a mechanic-teaching chain") has no price table or
  station-to-station price-variance formula in either doc.

**Recommendation:** these are all fine to defer past the current vertical
slice (none of the three are needed for a Tale-1/Act-1 slice), but they
should be named as **open formula work**, not implicitly assumed to already
exist because they're described narratively in `03`. Suggest a short new
subsection in `02` (or an addendum) once Tale 3/4 authoring actually starts.

### 1.4 Minor: sample-event DCs don't stick to `02`'s named tier scale

`02` §6 names five DC values: trivial 2, easy 4, moderate 6, hard 8, brutal
10+. `03`'s six sample events use DC 3, 5, and 7 constantly (e.g., sample 1's
Kuchi DC 5 and Tan DC 5, sample 3's Kuchi DC 7 and Waza DC 7, sample 5's
Kuchi DC 3). This is very likely intentional fine-grained tuning and not a
bug — but as written, `02` §6 reads like an exhaustive list rather than
labeled anchors, so a future content author could reasonably wonder whether
odd DCs are "off the intended scale."

**Recommendation:** one clarifying sentence in `02` §6 — "these are named
anchors, not the exhaustive set of legal DCs; intermediate values are
expected for finer-grained tuning" — resolves it without touching any
content.

### 1.5 What's solid here

- The chain-event count claim is consistent both places: `02` §8 says
  "~10–14 chain events injected at act milestones," `03` §4's intro says the
  same ("~10–14 chain events per Tale at full content") — same number, not
  independently invented twice.
- The Tale 3 debt numbers match exactly: `02` §9's "principal 100 ryō...
  25%/tick" is the same 100 ryō / 25%-per-season figure `03`'s Tale 3 premise
  states. (Worth double-checking, when Tale 3 events are actually authored,
  that they also implement the two debt-spiral safety valves `02` §9 added
  per `05`'s review — the early lump-sum payoff and the Act-3 compounding
  freeze — since `03`'s Act 2/3 beats describe the negotiation forks but
  don't call those two mitigations out by name.)
- Enemy numbers cross-check well: `03` sample 2's night-tsujigiri encounter
  is specified at Power 8 (direct confrontation) / Power 9 (ambushed), and
  the real vertical slice's calibrated value for the same enemy
  ("Night tsujigiri attacker") is Power 9 per `progress.md` — independently
  converged or directly reused, either way a good sign the sample content's
  numbers are usable as real tuning targets, not just flavor.
- The Tale 1 ending stat gates (Waza ≥ 9, Chi/Kuchi ≥ 8) sit comfortably
  inside the validated stat range from `06-balance-sim-report.md` (a focused
  build can reach ~15–17 in its main stat by endgame under the accepted
  leveling cadence) — these gates are achievable-but-not-trivial, which is
  the intended shape.

---

## 2. Content-volume math vs. the accepted MVP cut-down

`03` §4 and §8 both self-label their totals as **"at full content"**: "~10–14
chain events per Tale at full content," "~50 endings at full content." The
event bank in §6 (92 generic events across seven pools) is presented the same
way — a full-content target, not an MVP claim. So `03` isn't contradicting
`05`'s accepted recommendation to cut the MVP down; it's describing the V1.x
end-state `02` §16's four-tier scope ladder (vertical slice → MVP → V1.0 →
V1.x) is building *toward*.

The actual gap: **`03` never partitions its own content bank against that
ladder.** Given the full 92-event / ~50-ending list as written, there's no
way to tell from `03` alone which ~20–25 events belong in the vertical slice,
which subset of the 84 events/12 endings is the MVP slice, and which parts
are V1.0/V1.x-only. That mapping currently exists only in `02` §16 (numbers)
and in `progress.md` (what actually got built).

And what actually got built diverges from `03` outright: the real vertical
slice's `checkpoint_hakone` event (in `src/content/events.act1.ts`) is a
different, simpler event from `03`'s sample `checkpoint_hakone_papers` —
different id, different DCs (4/6 vs. the sample's 5/4/4/5), no sub-branches,
no bribe-vs-incorruptible-guard fork. That's not a defect — the file's own
comment already says *"this is the pre-MVP checkpoint, not the real pool"* —
but it means **`03` is not currently the source of truth for anything that's
actually been built**, and nothing in either doc says so explicitly.

**Recommendation:** add one short paragraph to `03` (top of §6) stating
plainly: *this bank is the full-content (V1.x) target; see `02` §16 for which
slice of it is authored in which phase, and `progress.md` for what's actually
built today, which currently does not draw from this bank.* Cheap, and it
stops a future reader (or a future content-authoring pass) from assuming the
vertical slice's events are meant to be drawn from here, or that this bank
was already used and abandoned.

---

## 3. Historical-sensitivity commitments — testable, or just stated?

**`03` §5 (cameos policy)** is the more concrete of the two: named figures
appear only where the historical record (already cited in `01-research.md`)
supports it, Musashi is explicitly barred from appearing in person, and the
doc even flags its own risk case (O-Tsu vs. the *Musashi*-novel character)
proactively. This is close to self-checking already — the only cheap
strengthening would be tagging each named-cameo event with the `01-research.md`
source line it's grounded in, so a reviewer (or future the sensitivity pass)
can check it mechanically instead of by re-deriving it.

**`03` §9 (writing style guide)** splits into two very different kinds of
claim:

- **Objectively testable rules** — word caps ("event body ≤ 180 words,"
  "outcome ≤ 120 words," "epilogues ≤ 250"), "no exclamation points in
  narration," "gloss Japanese terms once per run." These are lint-able today.
- **Subjective/process rules** — "eta/hinin characters written as individuals
  with trades and dignity," "period restrictions depicted as the difficulty
  they were, never titillation," and specifically: *"Tale 5's writers'
  checklist includes the Bechdel pass on its shelter-network chain."* This
  names a "writers' checklist" as if it's an existing artifact. It isn't —
  it doesn't appear anywhere in `03`, in any other doc, or in the repo.
  `progress.md`'s own "Not done yet" list already names this gap directly:
  *"No historical-sensitivity review pass yet (flagged as a pre-release risk
  in GDD §17, not urgent but cheap to do early)."* `02` §17's mitigation for
  the same risk is *"review pass with sensitivity checklist before
  release"* — also a name-drop of a checklist that doesn't exist yet.

So right now there are three separate references (03 §9, 02 §17,
progress.md) to a sensitivity checklist/process, and zero copies of it.

**Recommendation, in two parts:**
1. Fold the objectively-testable §9 rules (word counts, punctuation rules)
   into the schema validator `04` §5 already calls for — cheap, mechanical,
   and catches drift automatically as content gets authored, rather than
   relying on editorial memory.
2. Either draft the actual checklist now (it's cheap, per `progress.md`'s
   own assessment, and doc-writing is exactly the mode this review is in) as
   a short appendix to `03` §9, or — if that's explicitly being deferred —
   change the wording in `03` §9 and `02` §17 from "the writers' checklist
   includes..." / "review pass with sensitivity checklist" (present tense,
   implying it exists) to a flagged TODO that points at the `progress.md`
   entry, so the docs don't accidentally read as a process that's already in
   place.

---

## 4. Sample events vs. `04`'s schema (and `02`'s check formula)

### 4.1 No per-choice gating field — the headline finding

Every one of `03`'s six sample events gates individual choices on something
other than the check itself:

- `[requires ≥ 100 mon]` (sample 1, bribe choice)
- `[requires item: guide's tally OR Me ≥ 7 to have noticed him earlier]`
  (sample 1, bypass choice)
- `(Tale 1 only)` / `(non-samurai PC)` / `*(Tale 4 only)*` (samples 1, 5, 3)
- `[requires Tale 1, or Tale 3 with brother-chain active]` (sample 6)
- `[fires if flag 'watch_list_active']` (sample 1's Tale-1-only branch)

`02` §12's UI mock backs this up as a real player-facing feature: *"▸ Choice
C (requires item) — locked = greyed + hint."*

But `04` §3's event schema shows `requires` only at the whole-*event* level
(`tales`, `flags_not`, `min_suspicion`, `items_any`, `stats`). The choice
objects in the schema (`text_key`, `check`, `outcomes`/`on_success`/
`on_failure`) have no `requires`/`visible_if`/`enabled_if` field at all. As
documented, the schema cannot express the majority of `03`'s written content.

**Recommendation:** add a `requires` block to the choice object, mirroring
the event-level one (tales/flags/items/stats/min-money), plus a
`display_when_unmet` flag so the "greyed + hint" UI behavior from `02` §12
has something to key off. This is the single most load-bearing schema gap in
the review — it should land before Tale-1's full chain (not just Act 1) gets
authored, since the Katsuragi/Yui chain events in `03` depend on exactly this
feature.

### 4.2 Multi-check "AND" combination isn't representable

`03` sample 4 (`road_oi_river_ford`), the wade-it-yourself choice: *"[Chikara
DC 5 AND Tan DC 4 — two checks, both shown]"* with three distinct outcomes
(both pass / one fails / both fail). `04`'s schema models exactly one `check`
object per choice with a binary success/failure branch. There's no field for
a compound check or a three-way outcome table.

**Recommendation:** either add a `checks: [...]` array with an explicit
combination rule (`all`/`any`/`count`), or — cheaper, no schema change —
model it as a two-step `goto` chain (first check's failure branch routes into
a second mini-event that runs the second check). The second option costs
nothing new but should be written down as the intended pattern so content
authors don't invent three different ways to do it.

### 4.3 Permanent stat modification isn't in the effects vocabulary

`04` §3 effects vocabulary: `health/resolve/money/suspicion/reputation/gi`,
`set_flag/clear_flag`, `add_item/remove_item/condition_delta`, `xp/level`,
`goto`, `end_run`, `spawn_event`. Notice the six core stats (Chikara, Waza,
Chi, Kuchi, Me, Tan) never appear as a direct effect target — only indirectly
through `xp/level`.

But `03` sample 3's cheating-at-dice failure branch is explicit: *"Caught
(fingers broken: −Health 4, **permanent −1 Waza for the run**, thrown out)."*
Tale 4's finger-forfeiture choice does the same thing as its headline
mechanic. This is a real gap, not a hypothetical one — it's already load-
bearing in content that's fully written.

**Recommendation:** add a `stat_delta` effect (`{"stat": "waza", "delta":
-1}`) to the vocabulary in `04` §3. Small, mechanical fix.

### 4.4 What's solid here

The probabilistic-flag pattern (`{"set_flag":"guard_face_remembered","pct":20}`)
that `03` sample 1 uses in prose ("flag `guard_face_remembered` 20%") is
*exactly* what `04` §3's schema example implements — same event id, same flag
name, same mechanic. That's not a coincidence; it means at least one full
round-trip from content design to schema design happened correctly and
deliberately. Cross-event flags generally (`flags_not`, `set_flag`/`clear_flag`
read across events) are well-supported by the schema as documented — no
changes needed there.

---

## 5. Does `04`'s schema support everything `03` needs? (summary)

| `03` requirement | `04` schema support | Verdict |
|---|---|---|
| Branching outcomes within an event | `goto`, `on_success`/`on_failure` | Solid |
| Cross-event flags | `set_flag`/`clear_flag`, `flags_not` | Solid |
| Per-choice item/stat/Tale/flag gating | Not modeled (event-level only) | Gap — §4.1 above |
| Compound ("both checks") outcomes | Not modeled | Gap — §4.2 above |
| Permanent stat effects | Not modeled | Gap — §4.3 above |
| Chō-han **combat** bet | `02` §7.1 formula exists | Solid |
| Chō-han **gambling den** (stakes, house cut, cheating) | No schema or formula anywhere | Gap — §1.3 above |
| Peddling buy/sell loop | No schema or formula anywhere | Gap — §1.3 above |
| Tale chain injection ("milestone counters") | Described in `04` §4 prose only, no JSON fields shown | Minor gap, not urgent |
| **Ending** requirements (OR conditions like "Chi ≥8 or Kuchi ≥8," count conditions like "2+ employer contracts" or "3+ sheltered-woman events," ceiling conditions like "Suspicion ≤ 1") | No ending schema shown anywhere in `04` — only an `end_run(ending_id)` effect and an `endings.json` filename in the architecture diagram | **Gap — see below** |

The missing ending schema is worth calling out on its own: `03` §4's ~50
endings depend on OR logic between stats, minimum *and* maximum thresholds on
the same track (most event-level `requires` fields in `04` only show a floor,
e.g. `min_suspicion`, with no ceiling equivalent — but several endings need
"Suspicion ≤ 1" or "≤ 2"), and count-based conditions ("2+ employer
contracts," "3+ sheltered-woman chain events," "5+ dens allied," "4+ combat
wins") that need some kind of counter, not just a boolean flag. None of this
is sketched in `04` at all — endings are only ever referenced as an opaque
`ending_id` string. Given endings are one of the three documents' most
content-heavy systems (50 of them, each with multi-part requirements), this
deserves its own schema sketch before Tale 1's full ending set gets authored
— it doesn't block the current Act-1-only vertical slice (which only needs
2–4 simple endings), so it's fair to treat as **near-term, not urgent-today**.

---

## 6. Roadmap (`04` §6) vs. `05`'s accepted vertical-slice recommendation

`05-design-review.md` §5 recommended inserting a cheaper checkpoint *before*
the existing MVP: "one Tale, Act 1 only (~20–25 events, no chain-climax
requirement), no commissioned art, 3–4 endings," explicitly to validate
formulas before authoring the full MVP content. `02` §16 was edited to match
this exactly, under the heading **"Vertical slice (pre-MVP checkpoint)."**

`04` §6's roadmap was not updated to match. Its P1 is still:

> **P1 Vertical slice** | Tale 1 full chain, Act 1 pool (30 events),
> director, save, epilogue+ending flow | ~3–4 weeks

This is a materially bigger scope than `02` §16's post-`05` vertical
slice — "Tale 1 **full chain**" implies more than Act 1 (a Tale's chain runs
through all three acts per `03` §4's structure), 30 events instead of 20–25,
and it bundles in the director/save/epilogue/ending systems that `05`'s
recommendation was explicitly trying to defer cost on. So the same phrase,
"vertical slice," now names two different scopes in two sibling documents.

`progress.md` confirms which one actually got built: *"one Tale (rōnin), Act
1 only, 19 events, 4 endings"* — that's `02` §16's definition, not `04` §6's.
So `04`'s roadmap is now stale on two counts: it doesn't reflect the accepted
`05` recommendation, and it doesn't reflect what was actually built.

**Recommendation:** resize `04` §6's P1 to match `02` §16's vertical-slice
definition (Act 1 only, no chain-climax requirement, no art, 3–4 endings),
and push "Tale 1 full chain, director, save, epilogue/ending flow, 30-event
pool" down into what's currently P2 (or a new P1.5) so the roadmap actually
shows the two-step "cheap checkpoint, then real MVP" structure `05`
recommended and `02` adopted. This is a roadmap-table edit, not new design
work — the content itself doesn't change, just which phase name it sits
under.

---

## 7. Testing/balance plan (`04` §5) vs. what's actually built

`04` §5 calls for four things: a schema validator (zod/ajv, in CI), a
simulation harness (headless engine + bot policies × 10k runs), unit tests
(CheckResolver, CombatResolver, bag no-repeat, debt tick, pity counter), and
a playtest protocol (5 human runs per content drop).

`progress.md`'s "Not done yet" list is direct about the gap: *"No automated
tests yet... `04-technical-plan.md` §5 calls for these."* What exists instead
is `sim/balance-sim.mjs`, and `06-balance-sim-report.md` is explicit that
this is **not** the §5 harness: *"not the full bot-policy harness described
in `04-technical-plan.md` §5 (that one runs against real event/item/enemy
data once it exists)."* Zero unit tests exist. Zero schema validator exists.
The playtest protocol hasn't been run either (no playtest-log artifact
anywhere in the repo).

Meanwhile the vertical slice is already playable end-to-end — 19 events,
save/resume, combat, endings — with none of `04` §5's infrastructure in
place. That's a legitimate sequencing choice for a one-Tale/Act-1 slice
built by a single author who can hold the schema in their head. It stops
being a free pass the moment content authoring scales past that: this review
itself found a schema gap (§4.1–4.3 above — missing per-choice `requires`,
missing compound checks, missing permanent stat effects) that a schema
validator would have caught mechanically the moment those sample events were
encoded, rather than requiring a manual doc-review pass to surface.

**Recommendation:** add an explicit status line to `04` §5 (e.g., "Status as
of `progress.md`: none of the below is built yet; the vertical slice was
authored without it") so the doc doesn't read as already-implemented process.
More substantively: given §4's findings, prioritize the **schema validator**
specifically — not the full simulation harness — as the next infrastructure
piece, since it's the cheapest of the four to build and it's the one that
would have caught concrete, already-real gaps instead of hypothetical ones.
The simulation harness and playtest protocol can reasonably wait for Tale 1's
full chain (matching the resized roadmap in §6 above); they're not blocking
anything at Act-1-only scope.

---

## 8. `04` §7 scope cuts vs. `03`'s assumptions

Checked `04` §7's "deliberately not built" list (no accounts/cloud saves, no
monetization, no per-event art dependency, no multiplayer) against `03`: no
conflicts found. `03` never assumes per-event illustration (its art
assumptions match `02` §13's per-pool ink-vignette plan exactly), and nothing
in the six Tales or the event bank references accounts, monetization, or
multiplayer/social features. This is one area where the two docs are already
in good agreement — worth stating plainly rather than manufacturing a
problem where `05`'s own summary-verdict style wouldn't invent one.

The one thing worth flagging in the other direction (content assuming a
system that isn't scoped as built *or* cut) is the same one from §1.3/§5
above: the gambling-den economy and the peddling loop are real, load-bearing
parts of `03`'s content plan (all of Tale 4; a chunk of Tale 3) that are
simply absent from `04` — not cut, not built, not mentioned. They should
either get an explicit "not built yet, needed before Tale 3/4" note in `04`
§7, or a schema sketch, before those Tales get authored.

---

## Follow-up: findings applied

These findings were folded directly into the source docs, the same way `05`'s
were folded into `02`:

- **§1.1 Gi/Aku:** `03` §4 now opens with a notation note (single slider, + = Gi).
  Every ending requirement and effect in `03` is rewritten as `Gi/Aku ≥ +n` /
  `Gi/Aku ≤ −n` / `Gi/Aku ±n`. Tale 1's vague "Aku path" (Informant) became
  `Gi/Aku ≤ −1`.
- **§1.2 Wanted poster:** `03` §6 now says Suspicion ≥ 5, matching `02` §5.
- **§1.3 Open formulas:** named in the new `02` §9.2, cross-referenced from `03`
  Tale 4's mechanics hook and `04` §7.
- **§1.4 DC anchors:** clarifying sentence added to `02` §6.
- **§2 Content bank scope:** scope note added at the top of `03` §6. The heading's
  "(MVP list)" label, which contradicted the 92-event count, is now "(full-content list)".
- **§3 Sensitivity checklist:** `03` §9 and `02` §17 now mark it as a TODO
  pointing at `progress.md`.
- **§4.1 Per-choice gating:** `04` §3 adds choice-level `requires` +
  `display_when_unmet`, shown on the bribe choice in the JSONC example.
- **§4.2 Compound checks:** `04` §3.1 documents the two-step `goto` chain as the
  standard pattern. No `checks[]` array.
- **§4.3 Permanent stat effects:** `stat_delta` added to `04` §3's effects vocabulary.
- **§5 Ending schema:** `04` §3.2 sketches `endings.json` (AND/`any_of`,
  `min_`/`max_` track thresholds, `counters_min`/`counters_max` +
  `counter_inc`). `max_suspicion` was added at the event `requires` level.
- **§6 Roadmap:** `04` §6 P1 is resized to `02` §16's slice. The old P1 scope moved
  to a new P1.5. P0/P1 are marked done. `04`'s title no longer says "development
  not started."
- **§7 Testing status:** status line added to `04` §5, naming the schema validator
  as the next infrastructure piece.
- **§8 Unscoped systems:** "not built, not cut" note added to `04` §7.
- **§1.3 open formulas, now specified:** gambling den in `02` §9.2, peddling in
  `02` §9.3, den network (per-den counters, not Reputation) in `02` §9.4, schema
  keys in `04` §3.3. `04` §7, `03` Tale 4, and `03` sample 3 point to them.

**Deliberately left open:**

- ~~The three undefined formulas~~. Specified since; see the §1.3 line above. Still
  not implemented.
- The sensitivity checklist itself. It's marked TODO in `03` §9 and `02` §17, and
  drafting it is a separate task.
- §3's optional cameo source-tagging (tagging named-cameo events with their
  `01-research.md` source line). Not applied.
- §3's suggestion to lint `03` §9's word caps in the schema validator. It waits on
  the validator being built.

# 10 — Player-Character Gender: Tale 1 and the Rest (Decision Proposal)

A decision document, like `05`, `07` and `08`. It lays out options and
recommends one. It changes nothing: no other file under `game-plan/` or `src/`
was edited. It closes `08` N4 once the user picks.

Section refs are to the files as read on 2026-09-24. `01` is being edited in
parallel, so its line numbers may drift. Its section numbers should not.

---

## 1. The contradiction

`01` §B2, "Women" bullet:

> **Women** — legally subordinate; travel required stricter permits and many
> sekisho inspected women against written descriptions. An onna-musha fantasy
> does not exist in this era; a *pilgrim, entertainer, merchant's daughter, or
> widow running a shop* does. (Design uses these.)

`02` §4.1, below the Tales table:

> Gender/name are freely chosen for all Tales; Tale 5 explicitly frames the
> period's travel restrictions for women as its difficulty hook (historically
> grounded).

`03` §9.1, item C5, tries to cover both:

> C5. `02` §4.1 lets players choose gender. Does the text avoid hard-coding the
> PC's gender ("men like you")? If not, has the Tale deliberately fixed it for
> historical reasons and said so?

The two positions can't both hold for Tale 1. Its premise (`03` §4) is a
two-sworded rōnin on a sekisho watch-list of "unattached swordsmen". `01` §B2
says only samurai wear two swords, and it rules out the woman-warrior version
of that figure for this era. `02` §4.1 offers that version anyway. Tale 5 is
the reverse case. Its premise is a woman (`03` §4, "You are **O-Tsu**, a
widow"), so "freely chosen" can't apply to it either. `02` §4.1 contradicts
itself in the same sentence.

Supporting commitments on the strict side:
- `README.md`, "Key decisions already made (by you)", item 3: "**Tone:**
  Strictly historical."
- `02` §2 pillar 1, "History is the content ... Every event teaches one true
  thing about the era", and pillar 4, "Class defines the game ... how the law
  treats you."
- `03` §1: "Rules of the world (strictly historical)" and "Class is physics."
- `03` §1 names the cast as "a masterless samurai, a runaway farmer, a debtor,
  a gambler, a woman who should not be traveling alone." Gender is already
  written into the Tale list, not left open.

## 2. Historical grounding

### 2.1 What `01` supports

| Claim | Source |
|---|---|
| Only the samurai class may wear two swords (daishō). | `01` §B2, Samurai bullet |
| A rōnin's sword is "his only asset and his identity card"; a commoner owning a katana is suspicious. | `01` §B2, "Sword carry" |
| Women were legally subordinate and needed stricter travel permits. Many sekisho checked women against written descriptions. | `01` §B2, Women bullet |
| Sekisho looked especially for women and guns. Hakone and Arai were the strictest. | `01` §B3 |
| Period-plausible women's roles: pilgrim, entertainer, merchant's daughter, widow running a shop. | `01` §B2, Women bullet |
| "An onna-musha fantasy does not exist in this era." | `01` §B2, Women bullet |
| At checkpoints, a woman needs better papers. | `01` Part C, sekisho row |
| Kirisute-gomen, adauchi and dueling are framed by **class**. Nothing is said about gender. | `01` §B2, "Notable legal color" |

Put together, `01` supports this much: a woman on the Tōkaidō in 1648 is
plausible, and her difficulty is papers and scrutiny. A woman wearing daishō as
a masterless samurai is not supported. `01` gives no case of one, and its one
sentence on the subject says the figure doesn't belong to the era.

The design already has a historically grounded version of "a woman from a
ruined samurai house". Tale 5's O-Tsu is "a widow (or a divorced daughter) of a
minor samurai household dissolved in a domain confiscation" (`03` §4). That is
the same backstory as Tale 1, but `03` writes her as a traveler under permit
scrutiny, not as a swordswoman. So the design has already answered "what would
a woman in the Tale 1 situation have been" once, in Tale 5.

### 2.2 What `01` does not cover (needs research before any text relies on it)

None of these are asserted here. Each needs a source added to `01` before
content uses it (checklist I2).

1. **Direction of the "women and guns" rule. This matters now.** `01` §B3 and
   `03` sample 1 both write "women entering Edo, guns leaving Edo." My
   understanding is that the usual phrase, *iri-deppō ni de-onna*, runs the
   other way: guns *entering* Edo and women *leaving* it, because hostage
   families were escaping. **Verify.** If that understanding is right, the
   scrutiny falls mainly on westbound women. Tale 5 defaults to eastbound
   (`03` §2), so its central difficulty hook would sit on the less-scrutinized
   direction. This affects Tale 5 whatever is decided here.
2. **Women's travel permits.** Their name, who issued them, and what the
   written description contained. `01` only says "stricter permits".
3. **Whether women of samurai households carried a blade or trained with the
   naginata in the 1640s.** Both are often asserted for the Edo period. The
   date matters, and `01` says nothing about it.
4. **Whether "rōnin" applied to women at all**, as a legal or social category,
   when a household was dissolved. `01` uses the word only for men.
5. **Women in sanctioned vendettas (adauchi).** I believe some Edo-period
   vendetta records involve women. This is unverified, and nothing should cite
   it until it's sourced. It's the one edge case that could support a lawful
   female revenge route.
6. **Women traveling disguised as men.** Not in `01`. Don't use it without a
   source.
7. **Women defending castles in the Sengoku wars.** This is earlier than our
   window and changes nothing about 1648 practice. If it's ever mentioned, it
   belongs in a codex card as background, not as a PC premise.
8. **Kirisute-gomen, hatashiai and women.** `01` frames all of these by class.
   How a woman of samurai birth, with no house, stood under them is unknown.
9. **Women at shrine sumo.** Relevant to the built `sumo_exhibition`. My
   understanding is that women's sumo as a spectacle is later-Edo, but that is
   unverified.

## 3. What is gendered in the built text today

Built content: `src/content/events.act1.ts` (24 events, 1 intro + 23 in the bag),
`src/content/endings.ts` (4 endings), `src/content/tale.ts` (trait text),
`src/main.ts` (UI strings). `tale.ts` and `main.ts` contain no gendered text.

**Tier 1. Grammatically male PC (5 phrases, 4 items).** These have to change
before anyone but a male PC can see them.

| Location | Text |
|---|---|
| `events.act1.ts` `kirisute_tension` body (l. 255) | "is not meant for **men like you**" |
| `events.act1.ts` `night_tsujigiri` onWin (l. 240) | "someone will remember **a masterless man** walked this stretch" |
| `endings.ts` `death` epilogue (l. 15) | "as the road always has for **men like you**" |
| `endings.ts` `reached_edo` epilogue (l. 46) | "a city that swallows **men like you**" |
| `endings.ts` `reached_edo` historicalNote (l. 49) | "whatever city life **awaits him**" |

`kirisute_tension`'s "men like you" was added by the `08` M1 fix after `08`
was written, so it isn't in `08` N4's list.

**Tier 2. Generic male reference that reads onto the PC (2).**
`sumo_exhibition` body ("Masterless men have wrestled at such fund-raisers for
as long as there have been masterless men") and the `death` historicalNote
("no one to claim him", about a generic rōnin traveler). Both are correct as
generic statements. They only become a problem if the PC isn't a man.

**Tier 3. Gender-neutral grammar, but the premise assumes a two-sworded male
rōnin (9 events).** `wayside_shrine` ("a masterless blade"), `bandit_ambush`
("bandit rōnin same as you might have become"), `day_labor` ("set your swords
in the foreman's keeping"), `kirisute_tension` (the whole body: "You wear two
swords, same as he does"), `lodging_seized` ("a masterless dog"),
`five_households` ("A traveler with two swords and no lord"), `widows_teahouse`
("takes in your swords"), `polishers_bench` ("the thing that says what you
are"), `sumo_exhibition` (the PC steps into the ring). Replacing words won't
fix these. A woman in these scenes would be a different scene.

**Mechanical (1).** `checkpoint_hakone` gives every PC the same DCs. If the PC
could be a woman, `01` §B2/§B3 and Part C require harsher checks for her.

The remaining 14 events are neutral as written.

**Engine and schema, today.** `src/engine/types.ts` has no gender field on
`RunState` and no `requires` on events or choices at all, since the slice
predates them. `04` §3's planned `requires` keys (`tales`, `flags`,
`flags_not`, `items_any`, `stats`, `min_money`, `min_`/`max_` tracks,
`counters_min`/`max`) include no gender key. `04` §2's hard rule ("content
contains zero logic beyond declarative requirements/effects") rules out
pronoun-substitution tokens in strings unless the rule is amended. Gendered
variants would have to be gated choices, sub-nodes, or duplicate events.

---

## 4. Options

### Option A — Gender fixed by Tale where the premise requires it; free elsewhere

- **Tale 1** is male, fixed. The premise is a two-sworded rōnin (`01` §B2).
- **Tale 5** is female, fixed. The premise is a woman traveling alone (`03`
  §4).
- **Tales 2, 3, 4, 6** are chosen at creation. Each gets a premise audit before
  it is authored (see "Hidden cost" below).
- Authoring rule: **only Tale-exclusive content may assume a gender.** Shared
  events (03 §6 "all Tales") and the shared death-ending family (`02` §10) must
  be neutral.

**Text cost.** Tale 1-exclusive text can stay as it is, so none of Tiers 1–3
*must* change for Tale 1. Two items become shared as soon as a second Tale
ships (MVP adds Tale 2, `02` §16), and they must be neutralized then:
- `death` epilogue, "men like you" (part of the shared death family). Suggested
  rewrite: "as the road always has for people with no one to send for them."
- `night_tsujigiri` onWin, "a masterless man". `03` sample 2 is marked "all
  Tales". Suggested rewrite: "someone will remember an armed stranger walked
  this stretch last night." For non-samurai Tales, the whole premise of armed
  self-defense needs its own variant anyway.

`reached_edo` (Tale 1's stand-in for the Act 2 transition) and
`kirisute_tension` (a rōnin-specific event) can stay Tale 1-only. Total: 2
lines, at MVP time.

**Engine cost.** None for Tale 1 or Tale 5. The creation screen shows gender as
fixed text on those Tales. A picker, and a `pcGender` field on `RunState`, are
first needed when Tale 2 ships. Gating Tale 2 content on gender needs either:
- a new `requires` key, `pc_gender: "f" | "m"`, one line in `04` §3's key list,
  and validator-checkable; or
- a flag set at creation (`pc_female`), gated with the existing `flags` key. No
  schema change, but it's easier to misspell and the validator can't tell it
  apart from story flags.

**Hidden cost: Tales 2–4 aren't gender-neutral as written.**
- `02` §4.1 table, Tale 2: "can **he** ever go home?"
- Tale 2 *Fireman of Edo* rests on "the town brigades hire strong desperate
  men". Jihei would be a man and a woman walking together, which is its own
  period situation.
- Tale 3: *The Pawnshop* ends in marriage into O-Sumi's family with the debt
  "absorbed as bride-price negotiation". A woman as her brother's guarantor
  needs a source.
- Tale 4: Koharu's *Ninkyō* ending is a "cross-network marriage alliance".

None of these Tales is built, so the cost is design time, not rewrites. But
"free elsewhere" means each of those Tales is Option B in miniature (branch
the premise and endings on gender), or it is also fixed.

**Pillars.** Pillars 1 and 4 and `03` §1 "class is physics" are fully kept.
This is the only option under which the README's "Strictly historical"
decision holds without exceptions.

**Sensitivity checklist.** C5's second clause ("has the Tale deliberately
fixed it ... and said so?") passes for Tales 1 and 5, as long as `02` and `03`
say so. `08` N4 closes.

**Player expectations.** A player who wants to play a woman can't do it in the
default Tale. If Tale 2 is also fixed male, the **MVP (Tales 1–2) has no female
PC at all**, and the first one arrives with Tale 5 at V1.x behind an omoide
purchase (`02` §4.1, §16). If Tale 2 is free, a female PC is available from the
first run.

**Docs and lines to change.**
- `02` §4.1, ll. 81–82: replace with "Gender is fixed where the Tale's premise
  requires it: Tale 1 (male; a two-sworded rōnin, `01` §B2) and Tale 5 (female).
  Other Tales choose at creation; each Tale's section in `03` §4 states which."
  Tale 2 row, l. 75: "he" → "they".
- `03` §4, Tale 1 premise: add one line: "*PC gender: male, fixed (`01` §B2).*"
  Add a matching line to each other Tale.
- `03` §9.1 C5: reword to "Tale-exclusive text may assume the Tale's fixed
  gender, if `03` §4 states it. Shared events and shared endings must not."
- `04` §3: add `pc_gender` to the `requires` list (when Tale 2 is authored).
- `src/content/endings.ts` l. 15 and `events.act1.ts` l. 240: neutralize at MVP.
- `08` N4: mark closed.

### Option B — Free choice everywhere; Tale 1 made gender-aware

A female Tale 1 PC exists, and the world reacts to her honestly. There are two
ways to write her.

- **B1, re-premised.** She is the daughter of the dispossessed house, carrying
  her father's blade *as property and evidence*, not wearing daishō as a
  samurai. This is historically cautious. It is also essentially Tale 5's O-Tsu
  with a sword in her luggage.
- **B2, same premise.** She wears two swords, and the world treats her as an
  anomaly. `01` gives no support for this. Every reaction scene would be
  invented history.

**What changes in Tale 1 (from `03` §4).**
- **Watch-list and sekisho.** *[Watch-list]* assumes the "unattached
  swordsmen" list. A woman would instead face `01` §B3's scrutiny of women,
  and carrying a sword through a barrier would add the arms question on top.
  `checkpoint_hakone` needs harsher DCs for her (the Tale 5 hook), and this
  depends on research item 1 (direction of travel).
- **Kirisute and duel law.** `kirisute_tension` is built on "You wear two
  swords, same as he does." Under B1 she's no longer the two-sworded equal,
  and the event becomes `03` sample 5's non-samurai branch. *[The Duel at
  Fujieda]* and the illegal hatashiai route (*First Blood at Dawn*) have no
  source for a female duelist (research item 8).
- **The Katsuragi confrontation.** Of the three approaches, the lawful adauchi
  petition could become "petition the bugyō as a wronged gentlewoman", which
  is already Tale 5's Act 2 route, pending research item 5. The duel approach
  has no source. Blackmail works regardless of gender.
- **Cast.** Yui's recruitment (`03` sample 6, "Say yes before he asks",
  requires Tale 1) would mean a woman joining the Keian plot, which has no
  source. Marubashi's friendship chain, O-Ryō (a widow brokering information
  "for drifting samurai"), and Katsuragi's view of her would all need
  rewriting.
- **Endings.** About half of the 12 assume a man: *A New Banner* (employment
  or adoption under a lord via bodyguard work), *First Blood at Dawn*, *Sunpu,
  September 10th* (joined Yui; seppuku), *The Fever Betrayal* (joined), *Sword
  for Sale* (mercenary instructor), *Kabukimono*. *The Plow* ("marry into
  O-Ryō's teahouse") needs a rewrite. Each of these gets a female variant, is
  closed to her, or leans on unsourced history.

**Text cost, built.** 5 Tier-1 phrases plus 2 Tier-2 phrases neutralized
(cheap, about 7 lines). Female variants for the 9 Tier-3 events: at minimum a
rewritten body paragraph each, and `kirisute_tension` becomes a different
event. A mechanical change to `checkpoint_hakone`. Roughly **10 of 24 events
touched**, about 40% of the slice.

**Text cost, unbuilt.** A female branch through Tale 1's 10–14 chain events
and about 6 endings, plus the `01` research items (1, 3, 4, 5, 8) before any of
it can be written (checklist I2).

**Engine cost.** `pcGender` on `RunState`. A `requires` key (or flag) on
events and choices. Duplicate events or gated sub-nodes for every Tier-3
variant, because `04` §2 bans string tokens. This depends on choice-level
`requires`, which isn't built (`04` §6, P1.5).

**Pillars.** B1 keeps pillar 1 but thins Tale 1's identity. Its female branch
converges on Tale 5, and two default-unlock Tales become one fantasy with two
skins. B2 breaks pillar 1 and `03` §1 in the default Tale, which most players
see first, while presenting the result as history. Pillar 4 ("how the law
treats you") is honored only as far as the law is researched.

**Sensitivity.** C5 passes. Section C (C1, C3, C4) now applies across all of
Tale 1, not just Tale 5, and has never been tested (`08` N7). A2 needs a new
line on how kirisute-gomen framing applies when the PC is a woman of samurai
birth.

**Player expectations.** Players who pick a female rōnin expect the rōnin
fantasy. Honest B1 text refuses most of it: the duel, the plot, the lord, and
about half the endings. That risks reading as punishment for the choice. B2
delivers the fantasy, but in the one Tale where the docs claim the most
historical care.

**Docs and lines to change.** `02` §4.1 ll. 81–82 (keep "free", drop "all
Tales" for Tale 5). `03` §4 Tale 1: premise, cast, act beats, and the endings
table (about 6 rows). `03` §9.1 A2 and C5. `01` §B2: a new research
subsection. `04` §3: a gender key and a variant-authoring pattern.
`events.act1.ts`: about 10 events. `endings.ts`: 2 endings.

### Option C — Free choice as a clearly labeled optional setting

The default is Option A. A creation toggle, off by default and placed beside
Wayfarer/Gekokujo (`02` §14), unlocks free gender in every Tale except Tale 5.
Tale 5's premise is its mechanics. Under the toggle the world does **not**
react to the PC's gender. Tale 1 text is written neutrally so it reads the same
either way.

Label it honestly. A suggested name is **"The road does not ask"**, with the
description: *"Choose your character's gender in any Tale. With this on, the
world treats it as unremarkable. That is a departure from 1648, where a woman
with two swords would not have passed unremarked. See the codex."* Avoid a
label like "ahistorical mode" that reads as "the woman option is fake". The
departure is that nobody remarks on her, not that she exists.

**Text cost.** 5 Tier-1 phrases plus 2 Tier-2 phrases neutralized (about 7
lines, once). No Tier-3 variants: under the toggle the premise is deliberately
unremarked. One codex card, "Women, swords, and the road in 1648", sourced
from `01` §B2/§B3 plus whichever of the §2.2 items are confirmed. Tale 1's
future chain and endings need neutral-grammar authoring, which is a rule, not
extra content.

**Engine cost.** One boolean in run settings, and `pcGender` on `RunState` for
the picker. **No `requires` key needed for Tale 1**, because no content
branches on gender. The toggle itself needs a gate: Tales that *do* branch
(Tale 2 or 3 under Option A's audit) read `pcGender` as normal. Other things to
decide:
- Should daily seeds (`02` §11) force the toggle off?
- Should the ending screen's historical note gain a one-line flag when the
  toggle is on?

**Pillars.** Pillar 1 is broken knowingly, only when the player opts in, and
only in the one respect the label names. With the toggle off, everything is as
in Option A. `03` §1 needs an explicit exception line so authors don't read the
toggle as permission to drift elsewhere.

**Sensitivity.** C5 passes. A1 ("does every character, the PC included, act
within their class's legal reality?") fails by design under the toggle for a
female Tale 1 PC, so §9.1 needs a stated exemption. Otherwise every reviewer
will keep flagging it as a new `08` N4.

**Player expectations.** The clearest of the three. Historically minded
players get the strict game by default. Players who want to play a woman get
it in the default Tale without a punishing half-game, and they're told what
the concession is. The risk is framing: the label has to read as a courtesy,
not a disclaimer.

**Docs and lines to change.**
- `02` §4.1 ll. 81–82: Option A text plus "An optional creation setting
  (§14) lifts the fixed gender on Tale 1 and removes the world's reaction to
  gender; Tale 5 is always female."
- `02` §14: add the setting.
- `02` §11: the daily-seed rule.
- `03` §1: add an exception line under "Rules of the world".
- `03` §9.1 A1 and C5: the exemption.
- `04` §3: none for Tale 1.
- `events.act1.ts` ll. 240, 255, 307–308 and `endings.ts` ll. 15, 18–19, 46,
  49: neutralize.
- `main.ts` creation screen: the toggle and picker.
- Codex: 1 card.

### Summary

| | A. Fixed by Tale | B. Free, gender-aware | C. Optional labeled setting |
|---|---|---|---|
| Built lines changed | 2 (at MVP) | ~7 phrases + ~10 events reworked | ~7 phrases |
| Unbuilt Tale 1 work | none | female branch through chain + ~6 endings | neutral-grammar rule only |
| `01` research before authoring | Tale 2–4 audits only | items 1, 3, 4, 5, 8 | item 1 (for Tale 5); codex card |
| `requires` gender key | yes, when Tale 2 ships | yes, now | no for Tale 1; yes if Tale 2 branches |
| Strict-history pillar | intact | B1 intact but thin / B2 broken | intact by default; opt-in exception |
| Female PC available at MVP | only if Tale 2 is free | yes | yes |
| C5 / A1 | pass / pass | pass / new A2 line needed | pass / stated exemption |

---

## 5. Recommendation

**Option A now, with Tale 2 free, and Option C's neutral-grammar pass done
anyway. Decide on Option C's toggle when Tale 5 ships.**

1. **Fix Tale 1 as male and Tale 5 as female, and say so in `02` §4.1 and
   `03` §4.** This is the only option that keeps the README's "Strictly
   historical" decision and `03` §1's rules without exceptions. It costs
   almost nothing, and it matches what `01` §B2 can actually source. The
   female version of Tale 1's backstory already exists, sourced, as Tale 5.
2. **Make Tale 2 free, and audit its premise for gender before authoring
   it.** Without this, the MVP ships with no female PC. That's a real
   inclusion cost, and nothing historical requires it. A runaway farm woman
   is squarely inside `01` §B2's plausible roles. She also gets the
   women's-papers difficulty (`01` Part C) as honest texture, not a
   penalty. The *Fireman* ending and the Jihei companion need gendered
   variants. That's a design-time cost, because Tale 2 is unbuilt.
3. **Neutralize the Tier-1 and Tier-2 lines now (about 7 lines), not just the
   2 that Option A requires.** It's cheap. It enforces the shared-pool rule
   early, since several slice events are adaptations of 03 §6 "all Tales"
   events. It also keeps Option C available later with no rework.
4. **Defer the toggle, but don't bury it.** When Tale 5 ships and the section-C
   checklist has been tested for real (`08` N7), check whether players are
   asking for a female rōnin. If they are, Option C is the honest way to
   provide it. Option B isn't: it costs the most, delivers a truncated Tale 1
   for female players (B1) or unsourced history in the flagship Tale (B2),
   and satisfies neither the strictness pillar nor those players fully.

**The trade-off, stated plainly.** Under this recommendation, a player who
wants to play a woman can't do it in the game's default, flagship Tale. That
is a real cost to inclusion, and its justification is a pillar the user chose,
not a necessity. If the user ranks "play Tale 1 as a woman" above "the default
game is strictly historical", pick Option C now instead. It costs about 7
lines and one boolean, and its label tells the player exactly what was traded.
Choose between A and C on that ranking alone. B is the most expensive option
and does worst on both sides.

**Independent of the choice.** Research item 1 in §2.2 (the direction of
*iri-deppō ni de-onna*) should go to whoever is editing `01`. If my reading is
right, `01` §B3 and `03` sample 1 have the rule backwards, and Tale 5's
eastbound default misses its own difficulty hook.

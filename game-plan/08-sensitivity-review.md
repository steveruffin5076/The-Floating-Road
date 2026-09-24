# 08 — Sensitivity Review (Vertical Slice)

The first run of the `03` §9.1 sensitivity checklist over the vertical slice as
built: `src/content/events.act1.ts` (19 events), `src/content/endings.ts` (4
endings), and `src/content/tale.ts` (trait text). Like `05` and `07`, this is a
critique document. It suggests fixes and does not apply them. Nothing under
`src/` was changed. Checklist item numbers (A2, G1, ...) refer to `03` §9.1.

## Summary verdict

The slice is in good shape. It is dry, concrete, and free of exoticism. Its
violence is stated plainly with no gore. It keeps Musashi off-stage exactly as
§5 requires, and its best moments are the ones that get the class texture
right: `hungry_villager`'s "bows too low for comfort," and the Resolve cost of
bowing in `kirisute_tension`. Nothing in it is offensive or gratuitous.

Most findings are **accuracy and voice**, not harm. That is expected for a
slice this narrow. It never touches outcast groups (section B), women as
characters (C), Tale 6 (D), or on-screen executions (E), so this pass is **not
clearance** for those areas. Those sections were N/A throughout and will be
tested first by Tale 5/6 and the Act 3 Keian content.

**Counts:** 1 must fix before release, 11 should fix, 7 fine (noting only).

- **Must fix:** `kirisute_tension` states the one piece of class law the
  slice teaches, kirisute-gomen, wrongly on two counts.
- **Should fix, headline items:** two modern idioms in player text
  ("side-hustle", "processing fee"); a killing with no Suspicion
  (`night_tsujigiri`); manual labor with no face cost for a samurai
  (`day_labor`); a Musashi event that overstates how far *Go Rin no Sho* had
  circulated; two ending notes that overstate or can't be sourced (`arrested`,
  `death`); and several Japanese terms never glossed anywhere in the slice.

---

## Must fix before release

### M1. `kirisute_tension`: kirisute-gomen misstated (A2, I2)

> "A low-ranking samurai, deep in his cups outside a teahouse, decides your face
> offends him. A sober man in his position could claim kirisute gomen for far
> less — and answer for it later, or not."

Three problems in two sentences:

1. **Wrong target.** The PC is a rōnin wearing two swords. Per `01` §B2,
   kirisute-gomen is a samurai's claimed right against a *commoner*. `03`
   sample 5 is careful about this and splits the armed-samurai PC from the
   non-samurai PC. This event collapses the two.
2. **"For far less."** `01` §B2 requires *gross* insolence. This line tells the
   player that a trivial offense would do.
3. **"Or not."** `01` §B2: "In practice it triggered investigations; unjustified
   use ruined the samurai." The line implies routine impunity, which is the
   opposite.

It's rated must-fix because this is the one place the slice states the class
law to the player, and it is the law `02` §17 names as a sensitivity risk. The
fix is cheap.

**Suggested body** (about 80 words, under the 180 cap):

> A low-ranking retainer, deep in his cups outside a teahouse, decides your face
> offends him. You wear two swords, same as he does, so the law gives him no
> easy cut: kirisute gomen, a samurai's right to strike down a commoner for
> gross insolence, is not meant for men like you, and even against a townsman
> it means an inquiry afterward. But he is drunk, you are masterless, and no
> lord will come asking after you.

The choices and outcomes can stay as they are. Before the codex card ships,
add a line to `01` §B2 on how a rōnin stood in relation to kirisute-gomen and
duel law (I2). Note that "men like you" also bears on N4.

---

## Should fix

### S1. `sumo_exhibition`: modern idiom (G1)

> "a real side-hustle for rōnin between jobs"

"Side-hustle" (and "between jobs") comes straight from `01` §B8's research
shorthand. **Rewrite:** "A shrine is raising money with an open sumo bout.
Masterless men have wrestled at such fund-raisers for as long as there have
been masterless men. Win, and the crowd's coin is yours."

### S2. `checkpoint_hakone`: modern idiom (G1)

> 'You pay a "processing fee" to be let through.'

**Rewrite:** 'The guard squints at your papers too long. A string of mon on
his tray, "for the guardhouse brazier," shortens his reading.'

### S3. `checkpoint_hakone`: guaranteed, riskless bribe at the strictest barrier (I1, I2)

> Body: "The sekisho at Hakone is the strictest on the whole road"
> Choice: "Simply pay the guard to look elsewhere." → "Money changes hands
> quietly. No questions, no trouble."

The event says in one line that Hakone is the strictest barrier and in the next
offers a bribe with no check and no risk. `01` §B3 says the system leaked, but
it names Hakone and Arai as the places it leaked *least*. `03` sample 1 models
this as picking the bribable guard (Me check, with a failure branch). **Fix:**
keep the choice ungated if you want the ~40% ungated share from `02` §17, but
give it a cost: "Money changes hands. Even a bought guard at Hakone remembers
a face." (`money −80, suspicion +1`). Alternatively, add a Me check for picking
the right guard.

### S4. `day_labor`: samurai manual labor with no face cost (A1)

> "Honest work, if grueling — hauling baggage for men who will never learn your
> name." / "You carry your share and more. The foreman pays fairly."

`03` §1: "A samurai who works with his hands loses face." The event treats
porter work as neutral for a rōnin. That's plausible historically (rōnin did
take day work), but in this game it should cost something. **Fix:** add
`resolve: −1` to both outcomes of the labor choice, and add one line to the
success text: "You set your swords in the foreman's keeping and shoulder
crates beside men who would have bowed to your father." This makes the
`despair` ending's note, about rōnin drifting into commoner labor, something
the player has already felt.

### S5. `night_tsujigiri`: a killing with no Suspicion (A3)

> onWin: "He misjudged you. You leave him where he falls and take back the
> road." (`money +20`)

"Where he falls" reads as a death, and the player takes his coin. `03` §1:
"Every killing raises Suspicion unless witnessed as lawful." This one is
unwitnessed. **Fix, either:** (a) make it non-fatal: "He misjudged you. He
breaks off into the dark, bleeding, and leaves a dropped purse in the road."
Or (b) keep the death and add `suspicion: 1`: "...By morning someone will find
him, and someone will remember a masterless man walked this stretch last
night." Related, and outside this review's three files: the stance label in
`src/main.ts`, "攻 Aggressive — clean kill if you win", promises a kill in
*both* combat events with no Suspicion. The same rule applies there.

### S6. `musashi_scroll`: *Go Rin no Sho*'s circulation overstated (F2, I2)

> "a hand-copied page from Musashi's own Go Rin no Sho — freshly famous, since
> the old sword-saint died only a few years back. Copies are everywhere."
> onSuccess: "The brushwork checks out. A real find, cheaply bought."

The cameo policy is followed: Musashi never appears in person. The trouble is
the book. It was written in 1643–45 as a private transmission to his student
(Terao Magonojō) and passed within his school. It was not a well-known book
with "copies everywhere" in 1648. That fame is much later. `01` §B1's own
phrase "his book circulates" is the source of the overstatement and should
be qualified in `01`. It isn't edited here, because this pass is limited to
08 and the two TODO lines. Changed the right way, the event gets *better*: it
becomes a rumor-economy event, which is §1's own pillar. **Rewrite:**

> A stall-keeper offers what he swears is a page from Go Rin no Sho, the Book
> of Five Rings, which Musashi wrote for his students a few years before he
> died. The old sword-saint's name sells anything. Almost no one outside his
> school has seen the book; that has not stopped anyone selling it.

Success outcome: "The brushwork is a student's, not a forger's: a school
copy, sold by someone who needed rice more than strategy." Tag the event
`// source: 01 §B1, 1645 row` (F2).

### S7. `gambling_den`: a rumor stated as fact (H2)

> "A professional ear can sometimes tell odd from even by sound alone."

`01` §B7: professional gamblers "were *rumored* to be able to tell the roll by
sound." **Rewrite:** "They say a professional ear can tell odd from even by
the sound of the dice alone." The Waza check can stay. The player is testing
the rumor, which is the right framing.

### S8. `shrine_festival`: "Mid-Famine" in 1648 (I2)

> Title: "A Festival Mid-Famine"

The Kan'ei famine ran 1640–43 (`01` §B1). The run begins in 1648, so there is
no famine going on. The body's "a hard year ... empty granaries" is fine, since
local bad harvests are plausible. **Rewrite the title:** "A Festival in a Lean
Year".

### S9. `arrested` ending: wrong institution for the place (G5, I3)

> Title: "Taken at the Barrier." Epilogue: "A dōshin patrol finally has enough
> cause..." Note: "The machi-bugyō and their dōshin kept watch-lists and
> informant networks (okappiki) specifically for masterless samurai..."

Dōshin were the Edo city magistrates' constables (`01` §B6), not a patrol on
the highway or at a barrier. Hakone's guards were domain men. "Specifically
for masterless samurai" also overstates: rōnin were one population they
watched, not the reason the system existed. **Rewrite, place-neutral** (the
ending fires on Suspicion wherever you are, so "at the Barrier" may be wrong
anyway):

> Title: "Taken on the Road." Epilogue: "Your face reaches the right office at
> last. They take you at an inn before dawn, bind you with cord, and send you
> east under escort, your case bound for Kodenmachō, Edo's jailhouse, and
> whatever the magistrate decides."
> Note: "Edo's city magistrates (machi-bugyō) and their dōshin constables
> worked through informants (okappiki), often ex-criminals themselves, and
> masterless samurai were among the people they watched most closely.
> Suspicion, in the game, stands in for exactly this kind of accumulating
> official attention."

### S10. `death` ending: historical note that can't be sourced (I3)

> "way-stations kept modest burial grounds for travelers who died anonymously"

Nothing in `01` supports this, and it states a specific institution as fact.
**Rewrite to what's defensible:** "No domain was obligated to claim a rōnin's
body. A traveler who died on the road with no one to claim him was buried
where he fell, or by whichever temple or village would take the trouble." If
the more specific claim is wanted, source it in `01` first.

### S11. Japanese terms never glossed anywhere in the slice (G2, G3; §9 gloss rule)

Most terms are glossed well (see "handled well"). These are used with no gloss
in any built text, and because the bag order is random, a player can meet any
of them first:

| Term | Where | Suggested inline gloss |
|---|---|---|
| sankin-kōtai | `day_labor` | "a daimyō's procession, marching to his alternate year in Edo," |
| dōshin | `informant_whisper`, `arrested` | "not quite a dōshin, a magistrate's constable, but works for one" |
| hatago | `fire_disaster` (also the rest-node button in `src/main.ts`) | "the thatch of a hatago inn" |
| kirisute gomen | `kirisute_tension` | covered by the M1 rewrite |
| Go Rin no Sho | `musashi_scroll` | covered by the S6 rewrite |
| Kodenmachō, machi-bugyō | `arrested` | covered by the S9 rewrite |

The first-use rule ("once per run") can't be met by hand in a random bag.
Until the codex or glossary system exists, gloss each term inline in every
event that uses it. Once the `04` §5 validator exists, it can check first use
against a term list.

---

## Fine, noting only

- **N1. `checkpoint_hakone`, going around the barrier.** "They rough you up
  before letting you go." Breaking a barrier (sekisho-yaburi) was, on the
  books, a grave and potentially capital crime. The lenient outcome is a fair
  Act 1 gameplay concession. The eventual codex card should state the real
  penalty (verify it and add it to `01` first, per I2).
- **N2. `river_ford_oi`.** "The porter guild will carry you across." Check
  whether the formal Ōi river-porter system (kawagoshi) and its ban on
  crossing unassisted predate 1648. My understanding is that it was
  formalized later in the 17th century. That would soften "guild" and could
  make self-fording illegal rather than just risky. Research follow-up for
  `01`, no text change yet.
- **N3. `informant_whisper`.** The okappiki is "at the village well". Okappiki
  were an Edo-city arrangement, so one working a Tōkaidō village is a stretch.
  Harmless in Act 1. It could be moved to a post-town if the event is revised
  anyway.
- **N4. PC gender (C5).** `wayside_shrine` ("a masterless blade"),
  `death` ("men like you"), `reached_edo` ("swallows men like you",
  "awaits him") all assume a male PC. That is period-correct for a rōnin
  (`01` §B2: "an onna-musha fantasy does not exist in this era"), and the
  slice has no gender picker. However, `02` §4.1 says "Gender/name are freely
  chosen for all Tales." That is a design contradiction between `01` and `02`,
  not a text bug. Decide whether Tale 1 fixes gender (and say so in `02`
  §4.1) before a gender picker is built.
- **N5. Weak codex test (I1): `suspicious_offer`, `pickpocket_crowd`,
  `watching_the_road`.** All three are generic road texture with no
  period-specific truth yet. That's fine for a slice without a codex, but each
  needs a card when the codex lands. Suggestions: the fence → contraband
  moving on the highway and how okappiki recruited from fences; pickpocket
  → punishment for theft (tattooing, `01` §B6); watching the road →
  highway banditry by rōnin (`01` §B1 scale note).
- **N6. `reached_edo`.** The epilogue's "the zero marker of every road in the
  realm" is looser than its own note ("all five shogunate highways"). It's
  acceptable poetic license. "Of the five great roads" is tighter, if you
  want it.
- **N7. Coverage.** Sections B, C (apart from C5), D, and E were N/A for
  every row. The slice mentions an execution only once, and only by reference
  ("whatever the magistrate decides", `arrested`), which is correct per E1.
  Don't read this pass as evidence that the checklist's hardest sections work
  in practice. They get their first real test with Tale 5/6 content.

---

## Handled well

- **`night_tsujigiri`** glosses its term in context ("a night-cutter who tests
  his blade on whoever walks past") and dates it correctly ("banned this
  decades ago", 1602 → 1648). The model gloss for the slice.
- **`hungry_villager`**: "The farmer bows too low for comfort" shows class in
  six words, without a lecture.
- **`kirisute_tension`'s bow choice**: "It costs you nothing but the taste of
  it" (Resolve −1). This is the right cost structure (A4), even though the body
  text needs M1.
- **`bandit_ambush`**: "or bandit rōnin same as you might have become." It
  keeps the enemy human and ties it to the PC's own precarity.
- **`informant_whisper`** glosses okappiki in plain English ("a man who is not
  quite a dōshin but works for one ... paid to notice travelers").
- **`musashi_scroll`** follows §5 to the letter: Musashi is dead and off-stage,
  present only as a legend and a market for fakes.
- **`despair`**: the historical note on rōnin drifting into commoner life is
  accurate and humane, and it gives the "failure" ending real dignity.
- **`medicine_seller`, `gambling_den`**: period commerce treated as commerce.
  Colored flour and house-favoring dice are neither mocked nor mystified (H3).
- No exoticism anywhere (G4). No bushidō clichés, no "mysterious East," and
  every Japanese term does work.
- Violence throughout is stated as outcome ("bleeding and lighter of pocket"),
  never lingered on (E2).
- `tale.ts` trait text is clean.

---

## Coverage table

| # | id | Kind | Sections applied | Result | Findings |
|---|---|---|---|---|---|
| 1 | `wayside_shrine` | event (intro) | A, G, H, I | pass (note) | N4 |
| 2 | `checkpoint_hakone` | event | A, G, I | finding | S2, S3, N1 |
| 3 | `hungry_villager` | event | A, I | pass | — |
| 4 | `bandit_ambush` | event (combat) | A, E, I | pass | (see S5 note on stance label) |
| 5 | `day_labor` | event | A, G, I | finding | S4, S11 |
| 6 | `gambling_den` | event | G, H, I | finding | S7 |
| 7 | `suspicious_offer` | event | A, I | pass (note) | N5 |
| 8 | `medicine_seller` | event | H, I | pass | — |
| 9 | `night_tsujigiri` | event (combat) | A, E, G, I | finding | S5 |
| 10 | `kirisute_tension` | event | A, G, I | **must fix** | M1, S11 |
| 11 | `river_ford_oi` | event | I | pass (note) | N2 |
| 12 | `sumo_exhibition` | event | A, G, I | finding | S1 |
| 13 | `letter_writer` | event | A, I | pass | — |
| 14 | `shrine_festival` | event | I | finding | S8 |
| 15 | `informant_whisper` | event | G, I | finding | S11, N3 |
| 16 | `musashi_scroll` | event | F, G, H, I | finding | S6, S11 |
| 17 | `fire_disaster` | event | E, G, I | finding | S11 |
| 18 | `pickpocket_crowd` | event | A, I | pass (note) | N5 |
| 19 | `watching_the_road` | event | H, I | pass (note) | N5 |
| 20 | `death` | ending | C5, E, I | finding | S10, N4 |
| 21 | `despair` | ending | A, I | pass | — |
| 22 | `arrested` | ending | E, G, I | finding | S9, S11 |
| 23 | `reached_edo` | ending | C5, I | pass (note) | N4, N6 |
| — | `tale.ts` traits | setup text | G | pass | — |

Sections B, C (except C5), and D: N/A for every row (see N7).

## Follow-up

- Nothing has been applied. Every fix above is to `src/content/`, pending the
  user's call.
- `progress.md` still lists "No historical-sensitivity review pass yet." It
  should be updated to point here once the user accepts this pass.
- Research follow-ups for `01` (not edited here): qualify "his book
  circulates" (S6); add the rōnin/kirisute-gomen standing (M1); verify the
  sekisho-yaburi penalty (N1) and the date of the Ōi kawagoshi system (N2).

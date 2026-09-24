# 11 — Tale 1 Chain Spec (*The Masterless Blade*)

The design half of roadmap phase **P1.5** (`04` §6): Tale 1's chain events,
the flags and counters they use, the 12 endings wired as `04` §3.2 entries,
pacing across a full run, a sensitivity pre-check, and what the engine must add.

This is a spec, not prose. Beat summaries are short and choices are sketched.
Event bodies get written against `03` §7's tone guide and §9's caps when the
content is authored. Sources: `03` §1, §3, §4 (Tale 1), §7 samples 1/5/6, §9.1;
`02` §3, §5, §6, §7.1, §8, §10, §15; `04` §3, §3.1, §3.2, §4; `01` §B1–B6;
`src/content/*` and `src/engine/*` as built.

**Conventions.**
- Gi/Aku is the single slider (−5…+5, + = Gi). Effects are written `gi −1`, and
  gates as `max_gi: -3` / `min_gi: 2`.
- Checks are `[Stat DC n]`. The DCs follow `02` §6: Act 1 ≤ 6, Act 2 at 5–8,
  Act 3 climaxes at 8–10.
- Combat foe Power values are **placeholders** until the sim (`02` §15) has
  calibrated them. PC Power = weapon_tier×4 + Chikara + Waza + armor + condition,
  where condition is 0…−10 (mean −5, per `combatResolver.ts`). With the starting
  tier-1 katana, a fresh PC averages about 7. A combat build averages about 13 in
  mid Act 2 and about 16 in Act 3. Foe bands: Act 1 8–9 (matching the slice),
  Act 2 11–13, Act 3 14–16.
- **Mirror rule.** When an ending has a stat or track gate, the decisive choice
  that commits the player to that ending carries the same gate as a choice-level
  `requires` with `display_when_unmet: "locked_hint"`. This means an ending can't
  fall through *after* the player has committed to it, and it follows `02` §10's
  "hidden gates never blindside the player". It is used for *Sunpu*, *Informant*,
  *Lawful Vendetta*, *First Blood* and *The Plow*.
- Tale 1 is **eastbound only**. `03` §2 allows either direction, but Act 2 is Edo
  and the premise says "You are walking east." The Act 1 beats are placed in the
  eastbound order Arai → Fujieda → Mariko → Sunpu.

---

## 1. Chain structure

### 1.0 Overview

There are **14 Tale 1 chain events**, counting `spine2_scholars_school`, which
`03` makes a Tale 1 beat. Two more **shared spine** events (`spine1`, `spine3`)
use the same injection mechanism and carry Tale 1 choice variants. That's 16
injected events authored, and 12–15 fire in any one run.

| # | id | Act | Slot (window) | Gate | Mandatory? | Covers `03` beat |
|---|---|---|---|---|---|---|
| C1 | `checkpoint_watchlist` | 1 | 4 (±2) | `watch_list_active` | yes | *[Watch-list]* (id from sample 1) |
| S1 | `spine1_men_with_no_banners` | 1 | 6 (±2) | — | yes | spine 1 |
| C2 | `t1_fujieda_duel` | 1 | 8 (+2) | — | yes | *[The Duel at Fujieda]* |
| C3 | `t1_oryo_mariko` | 1 | 9 (+2) | — | yes | O-Ryō chain I (needed for *The Plow*) |
| C4 | `t1_old_retainer` | 1 | 12 (+2) | — | yes | *[Old Retainer]*, father's letter |
| — | *transition* `t1_gates_of_edo` | 1→2 | after Act-1 slot 14 | all Act 1 mandatories resolved | — | replaces the `reached_edo` ending |
| C5 | `t1_livelihood` | 2 | 1 | — | yes | Act 2 livelihood choice |
| C6 | `spine2_scholars_school` | 2 | 3 (+1) | — | yes | *[The Scholar's Invitation]* (sample 6) |
| C7 | `t1_oryo_letter` | 2 | 6 (+2) | `met_oryo` | no | O-Ryō chain II |
| C8 | `t1_yui_second_cup` | 2 | 7 (+3) | Yui status open, plus a hook flag | no (lapse effect) | recruit / refuse / inform |
| C9 | `t1_second_job` | 2 | 9 (+2) | a `livelihood_*` flag | yes | livelihood follow-up (contracts, gang jobs) |
| C10 | `t1_katsuragi_garden` | 2 | 11 (+2) | — | yes | *[Katsuragi's Garden]*, three approaches |
| C11 | `t1_fever_friend` | 2 | 13 (+2) | `keian_conspirator` | yes if gated in | *[The Fever Friend]*, Act 3 placement |
| — | *transition* `t1_shogun_is_dead` | 2→3 | after Act-2 slot 16 | C5, C6, C9, C10 resolved; Yui status set | — | Iemitsu's death, June 1651 (`01` §B1) |
| C12 | `t1_sagawa_sweep` | 2–3 | see trigger | Suspicion / crime flags | no | arrest sweeps; the "Sagawa chain" |
| S3 | `spine3_fever_talk` | 3 | 3 (not recruited) / 6 (recruited) | — | yes | spine 3, recruited climax |
| C13 | `t1_katsuragi_reckoning` | 3 | 3 slots after S3 | petition or blackmail open | no | the non-recruited Katsuragi finale |
| C14 | `t1_oryo_autumn` | 3 | final slot (8) | `oryo_bond` ≥ 2 | no | O-Ryō chain III, *The Plow* |

**"Yui status."** By the end of Act 2, exactly one of `keian_conspirator`,
`refused_yui` or `informed_on_yui` is set. C6 sets one directly, or C8 resolves
it, or C8's `on_lapse` sets `refused_yui`. The Act 2→3 transition asserts this.

### 1.1 Injection model (what "milestone" means here)

This turns `04` §4's "injected at milestone counters, overriding a draw" into
data. Each chain event carries an `inject` block:

```jsonc
"inject": {
  "act": 2,
  "slot": 11,              // engine counter act_event: the Nth event of this act (1-based,
                           // counting injected and drawn events alike)
  "window": 2,             // may fire at slots 11..13 if blocked (collision or unmet gate)
  "after_event": null,     // alternative trigger: fire N slots after a named event resolves,
  "after_offset": 0,       //   e.g. { "after_event": "spine3_fever_talk", "after_offset": 1 }
  "priority": 10,          // on collision, higher fires first; the loser slides +1 within its window
  "mandatory": true,       // the act transition waits: if the act's length is reached and this
                           // hasn't fired, it's injected before the transition
  "on_lapse": [ ]          // effects applied if the window closes unfired (gate never met)
}
```

Event-level `requires` (from `04` §3) is the gate. The director checks every
pending `inject` before each draw. The first eligible one, by priority, replaces
the random draw. Chain events are `unique: true` and never enter a bag.

A second trigger type, **`spawn_event`** (already in `04` §3's effects list), is
used for reactive injection. In Acts 2–3, Suspicion reaching 5 spawns
`t1_sagawa_sweep` as the next event (see C12).

### 1.2 Act 1 (the road, spring 1648 → 1649)

---

**C1 — `checkpoint_watchlist`** / checkpoint (Arai) / Act 1
- **Trigger:** slot 4, window ±2 (it may fire at 2–6). It also fires as a `goto`
  from sample 1's Tale 1 choice if `checkpoint_hakone_papers` is drawn first. In
  that case this injection is consumed.
- **Prereqs:** `watch_list_active`, which is set at Tale start (premise: "a name
  on a list").
- **Beat.** The Arai barrier's inspector compares your sword's crest to an
  inked list of "unattached swordsmen" from dissolved houses. He's seen that
  crest before. The line behind you goes quiet. This is the first time the Tale
  tells you the state knows your name.
- **Choices:**
  - *A dead house's crest, bought at a pawnshop.* [Kuchi DC 5] → pass. Fail:
    detained a day, `suspicion +1`, `money −50`, `resolve −1`.
  - *Pay the clerk to misfile the page.* [requires `min_money: 200`,
    locked_hint] [Me DC 5 to pick the clerk] → success: `money −200`,
    **`clear_flag watch_list_active`**. Fail: `money −200`, `suspicion +2`.
  - *Show the crest and give your true name.* [Tan DC 5] → the old captain
    stood at Osaka too: pass, `reputation +1`, `set_flag crest_honored`. The
    watch-list stays. Fail: `suspicion +1`, pass after questioning.
  - *Break for the hills.* → combat, `barrier_guards`, Power 9. Win:
    `suspicion +2`, `set_flag barrier_broken`, `combat_wins +1` (engine). Lose:
    `health −6`, `suspicion +2`, `money_mult 0.5`. Sekisho-yaburi was a grave
    crime on the books (`08` N1), and the codex card says so.

---

**S1 — `spine1_men_with_no_banners`** / road / Act 1 (shared spine, Tale 1 variant)
- **Trigger:** slot 6, window ±2. **Prereqs:** none.
- **Beat.** A column of confiscated-domain samurai walk east with their
  households and bedding. For Tale 1, one old man recognizes your crest and
  shares a fire. He plants `03` §3's line, *"the world is upside down, and someone
  will have to right it,"* and mentions a teacher in Kanda "who takes our kind."
- **Choices (Tale 1 variant):**
  - *Share your rice and the fire.* → `money −20`, `resolve +1`, `gi +1`,
    `set_flag heard_the_phrase`, `set_flag yui_name_heard`.
  - *Ask whether he knew Katsuragi Hyōgo.* [Kuchi DC 4] → success: Katsuragi
    holds a small office in Edo now, `set_flag katsuragi_rumor`, plus
    `heard_the_phrase`. Fail: `heard_the_phrase` only.
  - *Walk on; you are not one of them yet.* → `resolve −1`,
    `set_flag heard_the_phrase`.

---

**C2 — `t1_fujieda_duel`** / post-town (Fujieda) / Act 1
- **Trigger:** slot 8, window +2. **Prereqs:** none.
- **Beat.** A kabukimono, a hatamoto household's younger son in outrageous
  dress, has a porter on his knees in the street. He's loudly *claiming*
  kirisute-gomen over a jostled shoulder. The crowd knows what the claim is
  worth: an inquiry later, which won't bring the porter back. You wear two
  swords, so you're the only person here he can't simply dismiss.
- **Choices:**
  - *Step between them and talk him down.* [Tan DC 5] → success: he laughs it off
    and leaves, and the porter runs. `reputation +1`, `suspicion +1` (a scene with
    witnesses), `gi +1`, `set_flag fujieda_intervened`. Fail: he draws → combat
    vs `kabukimono`, Power 9. Win: he flees wounded (not killed), same effects
    plus `combat_wins +1`. Lose: `health −6`, and the porter escapes in the
    confusion (`set_flag fujieda_intervened`).
  - *Put your hand on your hilt first.* → combat vs `kabukimono`, Power 9, no
    talk. Win: `reputation +1`, `suspicion +2` (steel drawn in a post-town),
    `combat_wins +1`, `set_flag fujieda_intervened`. Lose: as above.
  - *Walk on.* → `resolve −1` (`03`: "walk on = Resolve−"),
    `set_flag fujieda_walked`.
  - *Laugh along and accept his sake.* → `gi −2`, `resolve −1`,
    `set_flag kabukimono_contact`. This is the gang hook read by C5.

---

**C3 — `t1_oryo_mariko`** / post-town (Mariko teahouse) / Act 1
- **Trigger:** slot 9, window +2. **Prereqs:** none.
- **Beat.** O-Ryō, a widow, runs the teahouse at Mariko on grated-yam soup and
  news. In the Osaka camps she cooked and sold provisions. Now she brokers
  information for drifting samurai. What she wants is to keep her teahouse her
  own. She has heard of a dying man near Sunpu who asks every traveler about
  your crest.
- **Choices:**
  - *Pay for what she knows.* [requires `min_money: 100`, locked_hint] →
    `money −100`, `set_flag met_oryo`, `set_flag oryo_lead`,
    `counter_inc oryo_bond`.
  - *Settle the drunk who's troubling her tables.* [Kuchi DC 4] → success:
    `met_oryo`, `oryo_lead`, `counter_inc oryo_bond`, `reputation +1`. Fail:
    `met_oryo`, `health −2`, and she tells you anyway, shortly.
  - *Tell her why you walk east.* [none] → `met_oryo`,
    `set_flag oryo_knows_katsuragi`, `counter_inc oryo_bond`, `resolve +1`. No
    `oryo_lead`: she didn't hear the question you didn't ask.
  - *Drink and go.* → `met_oryo`, `money −10`.

---

**C4 — `t1_old_retainer`** / temple outside Sunpu / Act 1
- **Trigger:** slot 12, window +2. **Prereqs:** none. `oryo_lead` changes the
  opening check.
- **Beat.** Sahei, a servant of your house, has kept your father's last letter
  for thirty-three years. The letter is in your father's hand, written the night
  before the surrender. It names Katsuragi as the man negotiating in secret and
  says your father will refuse. Sahei's account adds the rest: your father was
  cut down by Katsuragi's own men, not by the besiegers. *(This refines `03`'s
  "died in the siege". See §5, the adauchi finding. It's what makes a lawful
  vendetta legally possible.)*
- **Opening check** (a compound, `04` §3.1): with `oryo_lead` he is alive, so
  skip it. Without it: [Me DC 5] to find him in time. Fail: he died two days
  ago, and the priest gives you the letter. `add_item fathers_letter`, and the
  choices below are replaced by *Take it* / *Burn it*.
- **Choices:**
  - *Sit with him through the night.* → `add_item fathers_letter`,
    `set_flag retainer_testimony`, `resolve −1`, `gi +1`.
  - *Have the priest take down his words as a witnessed statement.* [Chi DC 5]
    → success: `fathers_letter`, `retainer_testimony`,
    **`set_flag sworn_testimony`** (DC −1 on the adauchi petition steps in C10
    and C13). Fail: `fathers_letter`, `retainer_testimony`.
  - *Take the letter and go before he wakes.* → `fathers_letter`, `gi −1`.
  - *Burn it. Let the dead keep it.* → `set_flag letter_burned`, `resolve +1`.
    This closes the adauchi and blackmail choices in C10.
- `fathers_letter` is a **protected key item**: generic theft and "lose a
  pack item" outcomes skip it.

---

**Transition 1→2 — `t1_gates_of_edo`** (a node, not an event and not an ending)
- **Fires** after Act 1 slot 14, once C1–C4 and S1 have fired or lapsed.
- **Content:** reuses the slice's `reached_edo` title and text as narration
  ("The Gates of Edo"), with the text fixes from §5 applied. Its historical note
  becomes codex card `nihonbashi`.
- **Effects:** `act = 2`, a season tick, a bag swap to the Act 2 pool, level
  interval 3 → 4 (`02` §4.3's front-loading ends), and a free rest node.

### 1.3 Act 2 (Edo, 1649 → spring 1651)

---

**C5 — `t1_livelihood`** / city-edo / Act 2
- **Trigger:** slot 1 (the first event in Edo). **Prereqs:** none.
- **Beat.** Edo is full of swords with nothing to cut. Your money won't last a
  season. There are four doors, and each is a different answer to what a
  masterless samurai may do with their hands.
- **Choices** (exactly one `livelihood_*` flag is set):
  - *Bodyguard to a Nihonbashi money-changer.* [Kuchi DC 5, +10% if
    `crest_honored` or `fujieda_intervened`] → success: `money +200`,
    `counter_inc employer_contracts`, `set_flag livelihood_bodyguard`. Fail
    (lesser outcome): half pay (`money +100`), still hired, still `+1` contract.
  - *Assistant at a Kanda sword school.* [Waza DC 6] → success: `money +100`,
    `reputation +1`, `set_flag livelihood_dojo`. Fail: you sweep floors,
    `resolve −1`, flag still set.
  - *Exhibition sumo at Fukagawa.* → non-lethal combat vs `sumo_wrestler`,
    Power 11. Win: `money +150`, `combat_wins +1`. Lose: `health −3`. Both set
    `livelihood_sumo` and `resolve −1` the first time (face cost, `03` §1).
  - *Muscle for a bakuto house.* [requires `any_of: [ {max_gi: 0}, {flags:
    [kabukimono_contact]} ]`, locked_hint] → `money +250`, `gi −1`,
    `suspicion +1`, `counter_inc gang_jobs`, `set_flag livelihood_underworld`.

---

**C6 — `spine2_scholars_school`** / city-edo (Kanda) / Act 2 — **reuse `03` sample 6 verbatim**
- **Trigger:** slot 3, window +1. **Prereqs:** none (mandatory for Tale 1).
- **Tale 1 additions** (body-line variants only, no new choices):
  `yui_name_heard` → "the old man by the fire was right about the sandals";
  `fujieda_intervened` → Yui has heard of "the one at Fujieda."
- **Choices and flags, as sample 6:** *Refuse* → `refused_yui`, and if Chi ≥ 7
  also `set_flag yui_roster_seen` (the ledger is a roster). *Ask what he would
  do* [Chi DC 5] → success `knows_the_plan`, fail `yui_measuring_you` (neither
  settles Yui status, so C8 does). *Say yes before he asks* →
  `keian_conspirator`, `suspicion +1`.

---

**C7 — `t1_oryo_letter`** / city-edo (a letter from Mariko) / Act 2
- **Trigger:** slot 6, window +2. **Prereqs:** `met_oryo`.
- **Beat.** O-Ryō writes that a Sunpu merchant is buying her teahouse's ground
  lease out from under her. She wants help, not rescue: money toward the lease,
  or a petition to the station officials in a better hand than hers. If
  `oryo_knows_katsuragi`, she adds a line. A traveler saw Katsuragi's palanquin
  enter a house in Banchō.
- **Choices:**
  - *Send money.* [requires `min_money: 300`, locked_hint] → `money −300`,
    `counter_inc oryo_bond`.
  - *Draft the petition for her.* [Chi DC 6] → success: `counter_inc oryo_bond`,
    `resolve +1`. Fail: she thanks you and has it redone, and the bond doesn't
    change.
  - *Write that you can't help.* → `resolve −1`.
  - In every branch, if `oryo_knows_katsuragi`: `set_flag
    oryo_katsuragi_address`.

---

**C8 — `t1_yui_second_cup`** / city-edo / Act 2
- **Trigger:** slot 7, window +3.
- **Prereqs:** `flags_not: [keian_conspirator, refused_yui, informed_on_yui]`
  AND `any_of: [yui_measuring_you, knows_the_plan, yui_roster_seen]`.
- **`on_lapse`:** if no Yui status flag is set, `set_flag refused_yui`.
- **Beat.** Yui sends a student with an invitation to tea, a third visit. If
  `yui_measuring_you`, he offers better terms (a place in the Sunpu party).
  If `knows_the_plan`, you now know exactly what the tea is for, and so does he.
- **Choices:**
  - *Accept.* → `keian_conspirator`, `suspicion +1`. With
    `yui_measuring_you`, also `set_flag yui_trusted` (the Sunpu choice in C11 is
    offered first).
  - *Go to the metsuke.* [requires `any_of: [knows_the_plan, yui_roster_seen]`,
    hide] [requires `stats: {kuchi: 7, chi: 6}`, locked_hint] (mirror rule)
    [Kuchi DC 7] → success: `set_flag informed_on_yui`, `money +500`, `gi −3`,
    `resolve −1`. Fail: a rōnin's word counts for little. `set_flag
    metsuke_doubts_you`, `suspicion +2`, and Yui status becomes `refused_yui`.
  - *Stay away from Kanda.* → `refused_yui`.

---

**C9 — `t1_second_job`** / city-edo / Act 2 — one event, four variants
- **Trigger:** slot 9, window +2. **Prereqs:** any `livelihood_*`.
- **Beat and choices.** Each variant is a set of choices with a choice-level
  `requires` on its livelihood flag and `display_when_unmet: "hide"`.
  - **Bodyguard: the rival house sends men.**
    *Hold the gate* → combat Power 12. Win: `counter_inc employer_contracts`,
    `combat_wins +1`, `reputation +1`, and if Rep ≥ 2 after this, `set_flag
    honest_patron` (a hatamoto house asks your name). Lose: `health −8`, and the
    contract still counts (you held long enough).
    *Talk them off the step* [Kuchi DC 7] → contract +1, `reputation +1`.
  - **Sword school: a dōjō-breaker's challenge.** Wooden swords, non-lethal
    combat Power 12. Win: `combat_wins +1`, `reputation +2`, `set_flag
    dojo_name`. Lose: `reputation −1`, `resolve −1`.
    *Decline for the master* [Tan DC 6] → no change, `resolve +1`.
  - **Sumo: the big shrine bout.** Non-lethal combat Power 13. Win: `money
    +250`, `combat_wins +1`, `reputation +1`. Lose: `health −4`.
  - **Underworld: collect from a debtor who can't pay.**
    *Collect* [Tan DC 6, or combat Power 11 if the debtor's sons stand up] →
    `counter_inc gang_jobs`, `gi −1`, `suspicion +1`, `money +150`.
    *Refuse to lay hands on him* → `gi +1`, `set_flag gang_quit`, and the house
    turns you out (`money −50`).

---

**C10 — `t1_katsuragi_garden`** / city-edo (Banchō) / Act 2 — the Tale's crux
- **Trigger:** slot 11, window +2. **Prereqs:** none.
- **Locating** (a compound opening, `04` §3.1): skip it if
  `oryo_katsuragi_address` or `katsuragi_rumor`. Otherwise [Me DC 6]. Fail:
  two days and `money −100` asking around, then found. *(It's a cost, not a
  lockout: no wasted runs.)*
- **Beat.** Katsuragi is old, pruning a black pine in a small walled garden. He
  knows you before you speak. He tells it plainly: four hundred households were
  alive because he signed, and he would sign again. He isn't a cartoon (`03`
  cast), and the text lets him be right about the households.
  If `swallowed_insult` (sample 5): "you know what things cost now."
- **Choices:**
  - *Petition for a licensed vendetta (adauchi).* [requires item
    `fathers_letter`, hide if `letter_burned`] Two parallel choices, so the
    player argues from their best stat: [Chi DC 7] from the documents, or
    [Kuchi DC 7] from the testimony. Both are −1 DC with `sworn_testimony`.
    Success: `set_flag adauchi_petition_filed`, `reputation +1`. Fail (lesser
    outcome): `adauchi_petition_filed` + `set_flag petition_weak` (C13's first
    step at DC +1). *Slow and lawful: it resolves in Act 3.*
  - *Challenge him to a duel at dawn (hatashiai).* [requires `stats: {waza: 9}`,
    locked_hint] (mirror rule, *First Blood*). First [Waza DC 7] to set fair
    terms (seconds, ground, first blood or death): success gives +10% win,
    failure means he brings extra men, −10% win. Then combat vs `katsuragi_hyogo`,
    Power 13 (old, still dangerous). Win: `set_flag hatashiai_won`,
    `combat_wins +1`, `suspicion +2`, then an ungated follow-up, *finish it*
    (`set_flag katsuragi_dead`, `gi −1`) or *first blood is enough*
    (`set_flag katsuragi_spared_duel`, `gi +1`). Lose: `health −10` (death
    possible), `resolve −3`, `set_flag duel_lost`, `set_flag
    vendetta_set_aside` (he spares you, which is worse). *Fast and criminal.*
  - *Blackmail him with the letter.* [requires item `fathers_letter`] [Me DC 6 to
    find the go-between, then Kuchi DC 6 to set terms, a compound per `04` §3.1]
    → both pass: `set_flag blackmail_katsuragi`, `money +300`, `gi −1`. Either
    fails: `blackmail_katsuragi` + `set_flag blackmail_exposed`, `suspicion +1`
    (he knows exactly who you are).
  - *Leave him to his pine.* → `set_flag vendetta_set_aside`, `gi +1`,
    `resolve −1` (or `resolve +1` if `swallowed_insult`).

---

**C11 — `t1_fever_friend`** / city-edo / Act 2 — recruited branch only
- **Trigger:** slot 13, window +2. **Prereqs:** `keian_conspirator`.
- **`on_lapse`:** `set_flag in_edo_act3`, so there is always a placement.
- **Beat.** Marubashi Chūya, spearman and Yui's Edo lieutenant, is feverish,
  expansive, and talks too much. He drinks with you and tells you what the fire
  in the merchant wards will look like. Then Yui asks who will go ahead with him
  to Sunpu.
- **Choices** (each sets exactly one placement flag):
  - *Sit with Marubashi through the fever.* → `set_flag marubashi_friend`,
    `set_flag in_edo_act3`, `resolve +1`.
  - *Tell him to stop talking before he hangs you all.* [Kuchi DC 7] → success:
    `marubashi_friend`, `in_edo_act3`, `set_flag warned_marubashi_early`. It
    changes nothing historically, only Act 3's lines. Fail: `in_edo_act3`,
    `resolve −1` (he takes offense and you aren't friends).
  - *Go ahead to Sunpu with Yui's party.* (listed first if `yui_trusted`) →
    `set_flag in_sunpu_act3`.
  - *Sell them.* [requires `stats: {kuchi: 7, chi: 6}`, locked_hint] [Kuchi DC 6:
    an insider is believed more easily than C8's outsider] → success:
    `clear_flag keian_conspirator`, `set_flag informed_on_yui`, `money +500`,
    `gi −3`, `resolve −2`, `in_edo_act3`. Fail: `suspicion +2`, and you are still
    a conspirator (`in_edo_act3`).

---

**Transition 2→3 — `t1_shogun_is_dead`** (node)
- **Fires** after Act 2 slot 16 once C5, C6, C9 and C10 are resolved and the Yui
  status is asserted.
- **Content:** June 1651: Iemitsu is dead, and his heir is a child (`01` §B1).
- **Effects:** `act = 3`, a season tick, the Act 3 bag, and a free rest node.
  If `keian_conspirator`: `suspicion +1` (the city tightens).

### 1.4 Act 3 (Keian, summer → autumn 1651)

---

**C12 — `t1_sagawa_sweep`** / city-edo / Acts 2–3 — the arrest chain and "Sagawa chain"
- **Triggers** (the first that applies. It fires at most once as an Act 3
  injection, plus any Suspicion-5 spawns):
  1. **Recruited, before the collapse:** Act 3 slot 3, window +1. Requires
     `keian_conspirator` and `min_suspicion: 3`.
  2. **Not recruited, after the collapse:** `after_event: spine3_fever_talk`,
     offset 1. Requires `flags_not: [keian_conspirator]` and `any_of: [
     {min_suspicion: 3}, {flags: [hatashiai_won]}, {flags: [blackmail_exposed]} ]`
     and `flags_not: [informed_on_yui]` (the metsuke protect their informants).
  3. **Reactive (Acts 2–3):** any effect that brings Suspicion to 5 does
     `spawn_event t1_sagawa_sweep` as the next event. In Act 1, Suspicion 5 keeps
     the slice's direct arrest (`end_run ronin_kodenmacho`), because dōshin are
     Edo city police and have no jurisdiction on the road (`03` §9.1 G5).
- **Beat.** Sagawa Jin'emon, a dōshin, isn't evil, only thorough. He has a list,
  your name is on it, and his okappiki are at both ends of the lane.
- **Choices.** All checks get +1 DC if `watch_list_active` (mod `if_flag`).
  - *Answer every question.* [Kuchi DC 8] → `set_flag escaped_sagawa`,
    `suspicion −1`. Fail → arrest.
  - *Out the back and over the roofs.* [Me DC 8] → `escaped_sagawa`, `resolve −1`.
    Fail → arrest.
  - *Cut through his men.* → combat vs `doshin_patrol`, Power 15. Win:
    `escaped_sagawa`, `combat_wins +1`, `suspicion` set to 5 (you are now
    hunted). Lose → arrest (or death on a wound roll).
  - *Pay the okappiki, not Sagawa.* [requires `min_money: 1000`, `max_suspicion:
    4`, locked_hint] [Me DC 6] → `money −1000`, `escaped_sagawa`. Fail: `money
    −1000`, then arrest.
  - *Go to ground with O-Ryō's people.* [requires `counters_min: {oryo_bond: 2}`,
    hide] → no check, `escaped_sagawa`, `counter_inc oryo_bond by −1` (you put
    her at risk).
  - **Arrest** (shared failure sub-node) → `set_flag taken_into_custody`,
    `end_run ronin_kodenmacho`. The recruited variant's text says that the
    conspirators' families go with them (E4).

---

**S3 — `spine3_fever_talk`** / city-edo or Sunpu / Act 3 (shared spine, Tale 1 variants)
- **Trigger:** not recruited: Act 3 slot 3, window +1. Recruited: slot 6,
  window +1. Two `inject` entries with complementary `requires`.

**S3-a. Recruited, `in_sunpu_act3`: "Sunpu, the tenth day."** The
magistrate's men surround the inn where Yui is staying (`01` §B1: seppuku at
Sunpu, Sep 10). Yui is calm. The walls close.
- *Kneel beside him.* [requires `min_resolve: 6`, locked_hint] (mirror rule) →
  `set_flag chose_seppuku`, `end_run ronin_sunpu_sept10`.
- *Stand at the door with your sword.* → `end_run death` with variant key
  `death.sweep` (the shared death family, `02` §10).
- *Cut a way out through the garden wall.* → combat Power 16. Win: `set_flag
  broke_the_cordon`, `set_flag fled_the_plot`, `combat_wins +1`, `suspicion`
  set to 5, then the run ends and endings are evaluated. Lose: `end_run death`.
- *Slip out with the kitchen staff before the cordon closes.* [Me DC 8, +1 DC if
  `watch_list_active`] → `fled_the_plot`, then evaluated. Fail: `set_flag
  taken_into_custody`, `end_run ronin_kodenmacho`.

**S3-b. Recruited, `in_edo_act3`: "Fever talk."** Marubashi has talked in his
fever. The arrests begin in Edo before dawn.
- *Run to warn him.* [requires `marubashi_friend`, hide] → `set_flag
  warned_marubashi_act3`, `end_run ronin_fever_betrayal`. You reach his house
  with the dōshin.
- *Go to ground.* [Tan DC 8 or Me DC 8, two parallel choices] → `fled_the_plot`,
  then evaluated. Fail: `taken_into_custody`, `end_run ronin_kodenmacho`.
- *Wait at your lodging for them.* → `taken_into_custody`, `end_run
  ronin_kodenmacho`.

**S3-c. Not recruited (all of them are in Edo in Act 3).** The news arrives as
rumor in the teahouses, then as notices on the metsuke's board: Yui dead at
Sunpu, Marubashi taken, the families with them. It resolves as witness or
bystander, and the run continues.
- *Go to see the execution ground.* → `resolve −2`, `set_flag saw_the_heads`.
  The epilogues remember it (E5). The historical note gives Sep 24.
- *Stay away and keep your head down.* → `resolve −1`.
- *(If `informed_on_yui`) Collect the rest of the reward.* → `money +300`,
  `reputation −1` (word gets around), `resolve −2`.
- *(If `knows_the_plan` and not informed) Burn the notes you kept.* →
  `suspicion −1`, `resolve −1`.

---

**C13 — `t1_katsuragi_reckoning`** / city-edo / Act 3 — non-recruited finale
- **Trigger:** `after_event: spine3_fever_talk`, offset 3 (or offset 2 if C12
  didn't fire). Window +1.
- **Prereqs:** `flags_not: [keian_conspirator, katsuragi_dead,
  vendetta_set_aside]` AND `any_of: [adauchi_petition_filed,
  blackmail_katsuragi]`.
- **Beat.** The city is on edge, with every rōnin a suspect. Katsuragi, a man
  with an office, is safer than he's been in years. Your business with him ends
  now.
- **Variant A, the adauchi hearing** (`adauchi_petition_filed`). A compound in
  two steps, `04` §3.1, each with parallel Chi/Kuchi choices and each with the
  mirror-rule gate:
  - Step 1, *the clerk examines the letter*: [Chi DC 7 | Kuchi DC 7], +1 if
    `petition_weak`, −1 if `sworn_testimony`. Fail = lesser outcome: `money
    −300` for a scrivener, step 2 at DC +1.
  - Step 2, *the magistrate's hearing*: [requires `stats: {chi: 8}`] Chi DC 8 |
    [requires `stats: {kuchi: 8}`] Kuchi DC 8, locked_hint. Success: `set_flag
    adauchi_granted`, `reputation +1`. Fail: `set_flag adauchi_deferred` (no
    license, and the vendetta stays open. It falls through to the other endings).
  - Then, if granted, *the sanctioned duel before witnesses*: combat vs
    `katsuragi_hyogo`, Power 14. Win: `set_flag katsuragi_killed_lawful`,
    `katsuragi_dead`, `set_flag submitted_to_review`, `reputation +2`, and **no**
    Suspicion (lawful and witnessed, `03` §1). Lose: `end_run death` (variant
    `death.duel`).
- **Variant B, the blackmail comes due** (`blackmail_katsuragi`).
  - *Send the letter to his superiors.* → `gi −2`, `set_flag katsuragi_ruined`,
    then his hired men find you: combat vs `katsuragi_hirelings`, Power 14. Win:
    `combat_wins +1`, `suspicion +2`. Lose: `end_run death`. Either way the
    garden gate has closed on both of you. From a neutral start, C10's −1 plus
    this −2 reaches `max_gi: -3` by construction.
  - *Burn your copy and let it end.* → `set_flag vendetta_set_aside`, `gi +1`,
    `resolve −1`.

---

**C14 — `t1_oryo_autumn`** / post-town (Mariko) or city-edo / Act 3 — final slot
- **Trigger:** Act 3 slot 8 (the final slot). It's the last event before
  endings are evaluated.
- **Prereqs:** `counters_min: {oryo_bond: 2}`, `flags_not: [keian_conspirator,
  fled_the_plot, hatashiai_won]`.
- **Beat.** Autumn. O-Ryō has kept her lease (if C7 helped) or lost it and
  started again. She offers a place. She isn't offering rescue: there's work,
  and she's tired of doing it alone.
- **Choices:**
  - *Put the sword in the ground behind the teahouse.* [requires `min_gi: 2`,
    `min_resolve: 6`, locked_hint "you are not yet someone who could stay"]
    (mirror rule; the +2 reaches *The Plow*'s Resolve ≥ 8) → `set_flag
    oryo_chain_complete`, `set_flag sword_buried`, `resolve +2`.
  - *Take the farm plot her cousin can't work.* [same requires] → same effects +
    `set_flag plow_farm`.
  - *Not yet.* → `resolve +1`. The run ends and other endings are evaluated.

---

## 2. Flag and counter ledger

`E` = engine-maintained. "Start" = Tale start effects. All flags are booleans
on `RunState.flags`. Counters are integers from 0 (`04` §3.2).

### 2.1 Flags

| Flag | Set by | Cleared by | Read by |
|---|---|---|---|
| `watch_list_active` | Start (Tale 1) | C1 misfile success | C1 prereq; sample 1 Tale 1 choice; C12 and S3-a (+1 DC mod) |
| `crest_honored` | C1 Tan success | — | C5 bodyguard (+10%) |
| `barrier_broken` | C1 fight | — | epilogue variant lines only |
| `heard_the_phrase` | S1 (all choices) | — | spine flavor; epilogues (`03` §3) |
| `yui_name_heard` | S1 share | — | C6 body variant |
| `katsuragi_rumor` | S1 Kuchi success | — | C10 (skip the locate check) |
| `fujieda_intervened` | C2 intervene/draw | — | C5 (+10%); C6 body variant; epilogues |
| `fujieda_walked` | C2 walk on | — | epilogues |
| `kabukimono_contact` | C2 laugh along | — | C5 underworld `any_of` gate |
| `met_oryo` | C3 (all choices) | — | C7 prereq |
| `oryo_lead` | C3 pay/settle | — | C4 (skip the Me check) |
| `oryo_knows_katsuragi` | C3 tell her | — | C7 (sets the address) |
| `oryo_katsuragi_address` | C7 (if `oryo_knows_katsuragi`) | — | C10 (skip the locate check) |
| `fathers_letter` *(item)* | C4 (all but burn) | never (protected) | C10 adauchi/blackmail gates; **Lawful Vendetta** |
| `retainer_testimony` | C4 sit / witness | — | C13 body lines |
| `sworn_testimony` | C4 Chi success | — | C10 and C13 (DC −1) |
| `letter_burned` | C4 burn | — | C10 (hides the petition) |
| `swallowed_insult` | sample 5 kneel success; recommend the slice's `kirisute_tension` "Bow low" also sets it | — | C10 body and let-it-go Resolve |
| `livelihood_bodyguard` / `_dojo` / `_sumo` / `_underworld` | C5 (exactly one) | — | C9 variants |
| `honest_patron` | C9 bodyguard (Rep ≥ 2) | — | New Banner epilogue variant |
| `dojo_name` | C9 dojo win | — | Sword for Sale epilogue variant |
| `gang_quit` | C9 underworld refusal | — | **Kabukimono** (`flags_not`) |
| `refused_yui` | C6 refuse; C8 stay away / metsuke fail; C8 `on_lapse` | — | **New Banner**, **Sword for Sale**; C8 prereq |
| `knows_the_plan` | C6 Chi success | — | C8 gate + metsuke choice; S3-c |
| `yui_measuring_you` | C6 Chi fail | — | C8 gate (better terms) |
| `yui_roster_seen` | C6 refuse with Chi ≥ 7 | — | C8 gate + metsuke choice |
| `yui_trusted` | C8 accept while measured | — | C11 (Sunpu offered first) |
| `keian_conspirator` | C6 say yes; C8 accept | C11 sell them | C11 prereq; C12/S3 branch; C13/C14 `flags_not`; **Sunpu**, **Fever Betrayal**; **Sword for Sale** `flags_not` |
| `informed_on_yui` | C8 metsuke success; C11 sell them | — | **Informant**; C12 (suppressed); S3-c; **Sword for Sale** `flags_not` |
| `metsuke_doubts_you` | C8 metsuke fail | — | Act 3 random events (flavor) |
| `marubashi_friend` | C11 sit / warn success | — | S3-b warn choice; **Fever Betrayal** |
| `warned_marubashi_early` | C11 warn success | — | S3-b text |
| `in_edo_act3` | C11 (most choices; `on_lapse`) | — | S3-b; **Fever Betrayal** |
| `in_sunpu_act3` | C11 Sunpu | — | S3-a; **Sunpu** |
| `adauchi_petition_filed` | C10 petition | — | C13 prereq/variant A |
| `petition_weak` | C10 petition fail | — | C13 step 1 (+1 DC) |
| `hatashiai_won` | C10 duel win | — | C12 trigger 2; C14 `flags_not`; **First Blood** |
| `katsuragi_dead` | C10 finish it; C13 lawful kill | — | C13 prereq (`flags_not`) |
| `katsuragi_spared_duel` | C10 first blood | — | First Blood epilogue variant |
| `duel_lost` | C10 duel loss | — | epilogues |
| `blackmail_katsuragi` | C10 blackmail | — | C13 variant B; **Garden Gate** |
| `blackmail_exposed` | C10 blackmail fail | — | C12 trigger 2 |
| `vendetta_set_aside` | C10 leave him; C10 duel loss; C13-B burn | — | C13 prereq (`flags_not`); **New Banner**, **Sword for Sale** |
| `adauchi_granted` | C13 step 2 success | — | **Lawful Vendetta** |
| `adauchi_deferred` | C13 step 2 fail | — | epilogues |
| `katsuragi_killed_lawful` | C13-A duel win | — | **Lawful Vendetta** |
| `submitted_to_review` | C13-A duel win | — | Lawful Vendetta epilogue |
| `katsuragi_ruined` | C13-B send letter | — | **Garden Gate** |
| `escaped_sagawa` | C12 any escape | — | **First Blood** |
| `taken_into_custody` | C12 arrest; S3-a/b failures; Act 1 Suspicion 5 | — | **Kodenmachō** |
| `chose_seppuku` | S3-a kneel | — | **Sunpu** |
| `warned_marubashi_act3` | S3-b warn | — | **Fever Betrayal** |
| `fled_the_plot` | S3-a/b escapes | — | C14 `flags_not`; Road Ends Here "walked away" variant |
| `broke_the_cordon` | S3-a fight win | — | epilogue variant |
| `saw_the_heads` | S3-c | — | all epilogues' "where you stood" line (`03` §3) |
| `oryo_chain_complete` | C14 stay / farm | — | **The Plow** |
| `sword_buried` | C14 stay / farm | — | **The Plow** |
| `plow_farm` | C14 farm | — | Plow epilogue variant |

Flags from `03` samples that are **not** read by the Tale 1 chain (they stay in
their own events): `guard_face_remembered`, `seen_bypassing`, `village_favor`,
`cursed_blade_carried`, `den_marked_you`, `cheated_den`, `river_fool`,
`oi_guild_respect`, `patient_one`, `brother_found` (Tale 3). One optional
hook: sample 5's `teahouse_name` ("20% Act 2 job offer") should, when authored
as an Act 2 random event, `counter_inc employer_contracts`. It's a second
source for New Banner.

### 2.2 Counters

| Counter | Kind | Incremented by | Read by |
|---|---|---|---|
| `employer_contracts` | content | C5 bodyguard (+1); C9 bodyguard (+1); Act 2 random job events (`teahouse_name` offer, dole-line job) | **New Banner** (≥ 2) |
| `combat_wins` | **E** (every combat win, including non-lethal sumo and dojo bouts) | C1, C2, C5 sumo, C9, C10, C12, C13, S3-a, plus random combats | **Sword for Sale** (≥ 4) |
| `gang_jobs` | content | C5 underworld (+1); C9 underworld collect (+1); Act 2 underworld random events | **Kabukimono** (≥ 2) |
| `oryo_bond` | content (signed, clamp 0–3) | C3 (+1), C7 (+1), C12 go to ground (−1) | C12 go to ground (≥ 2); C14 prereq (≥ 2) |
| `act` | **E** | transitions | every `inject`, event `acts` filters |
| `act_event` | **E** (reset per act) | every resolved event | `inject.slot` |

### 2.3 Producibility check (every ending requirement has a source)

| Ending requirement | Produced by (one path) |
|---|---|
| `min_reputation 3` (New Banner) | C2 +1, C5 bodyguard, C9 +1, plus random Rep events (`porter_in_the_current` +2, `fire_disaster` +2) |
| `max_suspicion 1` / `2` | stay clean; `widows_teahouse` −1; C12 Kuchi −1 |
| `employer_contracts ≥ 2` | C5 bodyguard + C9 bodyguard (both count even on the lesser outcome) |
| `refused_yui` | C6 refuse, C8 stay away, or C8 lapse |
| `vendetta_set_aside` | C10 leave him (always available) |
| `fathers_letter` | C4 (every branch but burn) |
| Chi ≥ 8 or Kuchi ≥ 8 | about 3 level-ups into one stat (2 with *Temple-Lettered* / *Silver Tongue*). Mirrored at C13 step 2 |
| `adauchi_granted`, `katsuragi_killed_lawful` | C10 petition → C13-A |
| Waza ≥ 9, `hatashiai_won` | C10 duel (mirror-gated at Waza 9) |
| `escaped_sagawa` | C12 (guaranteed to fire after `hatashiai_won`) |
| `blackmail_katsuragi`, `katsuragi_ruined`, Gi ≤ −3 | C10 blackmail (−1) → C13-B send (−2) |
| `keian_conspirator`, `in_sunpu_act3`, `chose_seppuku`, Resolve ≥ 6 | C6/C8 join → C11 Sunpu → S3-a kneel (mirror-gated) |
| `marubashi_friend`, `in_edo_act3`, `warned_marubashi_act3` | C6/C8 join → C11 sit → S3-b warn |
| `informed_on_yui`, Kuchi ≥ 7, Chi ≥ 6, Gi ≤ −1 | C6 Chi success or roster → C8 metsuke (mirror-gated, `gi −3`); or C11 sell |
| `combat_wins ≥ 4`, Rep ≥ 2 | Act 1 random (2 combats in the slice) + C2 + C5/C9 bouts |
| `oryo_chain_complete`, `sword_buried`, Resolve ≥ 8, Gi ≥ 2 | C3 + C7 (bond 2) → C14 (mirror-gated, Resolve +2) |
| Gi ≤ −4, `gang_jobs ≥ 2` | C2 laugh (−2), C5 underworld (−1), C9 collect (−1), plus the slice's Aku choices (`hungry_villager` −2, `suspicious_offer` −2, `pickpocket_crowd` −2) |
| `taken_into_custody` | C12 arrest, S3 failures, Act 1 Suspicion 5 |
| Resolve 0 / fallback | forced, or no other ending matched |

---

## 3. Ending wiring (`endings.json`, per `04` §3.2)

**Evaluation.** Endings with `"forced": true` fire only through `end_run` at
the named beat. Their `requires` block documents the path, drives the §10
trajectory hints, and is asserted by the validator. Every other ending is
evaluated **once**, when the run ends without a forced ending. That happens
after C14, after Act 3's final slot, or after S3's evaluated escapes. The
highest `priority` among those that match wins.

**Adjustment to `03`: a fallback is needed.** `03`'s table has no catch-all,
so a run that matches nothing (for example, a conspirator who fled Sunpu, or a
bodyguard at Suspicion 2) would have no ending. *The Road Ends Here* becomes
both the forced Resolve-0 ending and the priority-1 fallback. The slice's
`despair` text already describes drifting into commoner life, which fits both.
Its epilogue gets a `fled_the_plot` variant line ("you walked away from the name,
and the country roads kept you"). The alternative is a 13th neutral ending. It
isn't recommended, because it would dilute the 12.

```jsonc
[
  { "id": "ronin_fever_betrayal", "tale": "ronin", "tone": "tragic", "priority": 90, "forced": true,
    "requires": { "flags": ["keian_conspirator", "marubashi_friend", "in_edo_act3", "warned_marubashi_act3"] } },

  { "id": "ronin_sunpu_sept10", "tale": "ronin", "tone": "tragic-heroic", "priority": 90, "forced": true,
    "requires": { "flags": ["keian_conspirator", "in_sunpu_act3", "chose_seppuku"], "min_resolve": 6 } },

  { "id": "ronin_kodenmacho", "tale": "ronin", "tone": "death", "priority": 85, "forced": true,
    "requires": { "flags": ["taken_into_custody"] } },

  { "id": "ronin_plow", "tale": "ronin", "tone": "quiet-bright", "priority": 70,
    "requires": { "flags": ["oryo_chain_complete", "sword_buried"], "min_resolve": 8, "min_gi": 2 } },

  { "id": "ronin_informant", "tale": "ronin", "tone": "grim-survival", "priority": 65,
    "requires": { "flags": ["informed_on_yui"], "stats": { "kuchi": 7, "chi": 6 }, "max_gi": -1 } },

  { "id": "ronin_lawful_vendetta", "tale": "ronin", "tone": "solemn", "priority": 60,
    "requires": {
      "any_of": [ { "stats": { "chi": 8 } }, { "stats": { "kuchi": 8 } } ],
      "items_any": ["fathers_letter"],
      "flags": ["adauchi_granted", "katsuragi_killed_lawful"],
      "max_suspicion": 2,
      "min_reputation": 1 } },

  { "id": "ronin_new_banner", "tale": "ronin", "tone": "bright", "priority": 50,
    "requires": {
      "min_reputation": 3,
      "max_suspicion": 1,
      "counters_min": { "employer_contracts": 2 },
      "flags": ["refused_yui", "vendetta_set_aside"] } },

  { "id": "ronin_first_blood", "tale": "ronin", "tone": "dark-neutral", "priority": 45,
    "requires": { "stats": { "waza": 9 }, "flags": ["hatashiai_won", "escaped_sagawa"] } },

  { "id": "ronin_garden_gate", "tale": "ronin", "tone": "dark", "priority": 42,
    "requires": { "flags": ["blackmail_katsuragi", "katsuragi_ruined"], "max_gi": -3 } },

  { "id": "ronin_kabukimono", "tale": "ronin", "tone": "dark", "priority": 40,
    "requires": { "max_gi": -4, "counters_min": { "gang_jobs": 2 }, "flags_not": ["gang_quit"] } },

  { "id": "ronin_sword_for_sale", "tale": "ronin", "tone": "neutral", "priority": 20,
    "requires": {
      "counters_min": { "combat_wins": 4 },
      "min_reputation": 2,
      "flags": ["refused_yui", "vendetta_set_aside"],
      "flags_not": ["keian_conspirator", "informed_on_yui"] } },

  { "id": "ronin_road_ends_here", "tale": "ronin", "tone": "despair", "priority": 1, "fallback": true,
    "requires": {} }            // also forced by Resolve 0 (end_run), as the slice's despair is today
]
```

**Priority rationale.** The forced endings sit at the top. The Plow outranks
the evaluated endings because it's an explicit final choice. Informant (65)
outranks Lawful Vendetta (60) because informing defines a life. Garden Gate
(42) outranks Kabukimono (40) because the Katsuragi resolution is the Tale's
crux. Most pairs are mutually exclusive anyway, by Gi sign or by opposite flags
(`vendetta_set_aside` vs `hatashiai_won` / `adauchi_granted` /
`blackmail_katsuragi`).

### 3.1 Changes from `03`'s requirement table

| Ending | `03` as written | Problem | Wired as |
|---|---|---|---|
| Garden Gate | Gi ≤ −3 only | **Trivially reachable.** Every Aku run gets it, blackmail or not | + `blackmail_katsuragi`, `katsuragi_ruined` |
| Informant | Kuchi ≥ 7, Chi ≥ 6, Gi ≤ −1 | **Trivially reachable** for any Aku talker who never informed | + `informed_on_yui`; stats mirror-gated at the choice |
| Lawful Vendetta | stats + letter + Susp + Rep | Reachable **without killing Katsuragi**, even as a conspirator | + `adauchi_granted`, `katsuragi_killed_lawful` |
| A New Banner | "legal revenge path abandoned" | Undefined in flag terms | + `vendetta_set_aside` |
| Sword for Sale | "refused all causes" | Undefined | `refused_yui` + `vendetta_set_aside`, not conspirator or informant |
| Kabukimono | "gang chain events" | No gang chain exists in `03` | `gang_jobs ≥ 2` from C5/C9 underworld; `gang_quit` excludes |
| First Blood | "escaped Sagawa chain" | No Sagawa chain in `03` | C12 is the Sagawa chain (guaranteed after `hatashiai_won`) |
| The Plow | Resolve ≥ 8 | **Tight.** Act 3 drains Resolve, and a max of 10 leaves little room | kept at ≥ 8, but C14 grants +2 and is gated at Resolve ≥ 6 (an effective softening) |
| Kodenmachō | "arrest chain failure" | No arrest chain in `03` | C12 arrest, S3 failures, Act 1 Suspicion 5 |
| Road Ends Here | Resolve 0 | No catch-all ending existed | + priority-1 fallback |

**Recruited Act 3 mapping** (`03` lists four outcomes and two endings):
seppuku → *Sunpu*. Stand and die → shared `death` (variant `death.sweep`).
Fight out or flee → evaluated, usually *The Road Ends Here* ("walked away").
Warn Marubashi → *Fever Betrayal*. Caught → *Kodenmachō*.

**Known edge, accepted:** a Gi ≥ +3 player who informs ends at Gi ≥ 0 despite
the −3, misses *Informant*, and gets the fallback. This is under 1% of runs,
and the epilogue can carry an informant line.

### 3.2 Reachability per ending

The fractions are rough, over all runs, at P1.5 content, for an average mix of
players. First-run survival targets about 40% (`02` §15), so the death family
is large. They sum to 100% with the shared `death` ending (outside the 12)
taken as about 21%. **Validate these with the sim harness (`04` §5), not by
hand.**

| Ending | Chain path | Est. share | Verdict |
|---|---|---|---|
| **A New Banner** | C5 bodyguard → C9 bodyguard → C6/C8 refuse → C10 leave him; Rep 3, Susp ≤ 1 | ~7% | OK. Suspicion ≤ 1 is the hard part |
| **The Lawful Vendetta** | C4 letter → C10 petition → C13-A both steps → duel win | ~3% | Rare by design ("slow, lawful"). Needs Chi or Kuchi 8 |
| **First Blood at Dawn** | Waza 9 at C10 → duel win → C12 escape | ~4% | OK. Waza builds only |
| **The Garden Gate** | C4 letter → C10 blackmail → C13-B send → survive the hirelings | ~5% | OK after the fix |
| **Sunpu, September 10th** | join → C11 Sunpu → S3-a kneel (Resolve ≥ 6) | ~5% | OK |
| **The Fever Betrayal** | join → C11 sit/warn → S3-b warn | ~4% | OK |
| **Informant** | C6 Chi DC 5 or roster → C8 metsuke (Kuchi 7, Chi 6) or C11 sell | ~3% | Rare. It needs a split Kuchi/Chi build by mid Act 2 |
| **Sword for Sale** | refuse + leave him + 4 combat wins + Rep 2 | ~9% | OK. The common "survived, sold my sword" result |
| **The Plow** | C3 + C7 bond 2 → C14 stay (Gi 2, Resolve 6) | ~5% | OK after the softening |
| **Kabukimono** | C2 laugh → C5 underworld → C9 collect, Gi ≤ −4 | ~4% | OK |
| **Kodenmachō** | Suspicion 5 / C12 fail / S3 capture | ~13% | OK. Includes about 4% conspirators caught |
| **The Road Ends Here** | Resolve 0 (~9%) + fallback (~8%) | ~17% | Watch the fallback share. If the sim shows more than 10%, loosen New Banner's Suspicion to ≤ 2 first |

**Unreachable:** none after the §3.1 fixes. **Trivially reachable as
written:** Garden Gate and Informant, both fixed. After ten runs, an average
player sees roughly 4–5 of the 12, which matches `02` §15's 30–40% target.

---

## 4. Pacing

### 4.1 A full run, about 38 events

| Act | Length | Chain (injected) | Random draws | Transition |
|---|---|---|---|---|
| 1, the road | 14 (the slice's 13 + 1) | 5: C1, S1, C2, C3, C4 | 8 + intro (`wayside_shrine`) | `t1_gates_of_edo` after slot 14 |
| 2, Edo | 16 | 5–7: C5, C6, C9, C10 always; C7 if `met_oryo` (always, via C3); C8 if hooked; C11 if recruited | 9–11 | `t1_shogun_is_dead` after slot 16 |
| 3, Keian | 8 (recruited runs usually end at slot 6) | 1–4: S3 always; C12 if gated; C13, C14 if gated | 4–6 | endings evaluated |
| **Total** | **~38** (recruited ~36) | **12–15** | **~22** | |

**Slot maps** (R = random draw):

```
Act 1:  1 intro · 2 R · 3 R · 4 C1 · 5 R · 6 S1 · 7 R · 8 C2 · 9 C3 · 10 R · 11 R · 12 C4 · 13 R · 14 R → Gates of Edo
Act 2:  1 C5 · 2 R · 3 C6 · 4 R · 5 R · 6 C7 · 7 C8? · 8 R · 9 C9 · 10 R · 11 C10 · 12 R · 13 C11? · 14 R · 15 R · 16 R → Shōgun is dead
Act 3 (not recruited):  1 R · 2 R · 3 S3 · 4 C12? · 5 R · 6 C13? · 7 R · 8 C14? or R → evaluate
Act 3 (recruited):      1 R · 2 R · 3 C12? · 4 R · 5 R · 6 S3 → end_run or evaluate
```

Level-ups: every 3 events in Act 1 (4 levels by the transition), then every 4
(about 4 in Act 2, 2 in Act 3). That's about 10 levels and 20 points. At C10
(overall event ~25) a PC has about 6 levels. Waza 9 is reachable there for a
focused build, which the C10 mirror gate needs. Rest nodes stay every 4 events.

**Deviation from `02` §8.** The Act 1 pacing table's "10% Tale-chain" can't hold
with `03`'s three named Act 1 beats, O-Ryō and spine 1 in a 14-event act. That's
36% by count. Read the 10% as the *drawn* category mix, with injections sitting
outside it. The alternative is stretching Act 1 to 15.

**Scope risk (P1.5).** `04` §6's P1.5 scope lists an "Act 1 pool (30 events)"
but no Act 2 or Act 3 random pools, and this pacing needs about 10 Act 2 and 5
Act 3 draws. Minimum fix: tag the existing multi-act events (samples 1, 3, 5
and the slice's post-town/night events) as `acts: [1, 2, 3]`, and add about 8
`city-edo` and 4 Act 3 "aftermath" events. Otherwise Act 2 repeats Act 1's
road inside Edo.

### 4.2 The four built endings in the 12

| Slice ending | Becomes |
|---|---|
| `reached_edo` | **Not an ending.** It becomes the Act 1→2 transition node `t1_gates_of_edo`. Remove it from `endings.json`, and move its note to the codex (`nihonbashi`) |
| `despair` | `ronin_road_ends_here` (forced at Resolve 0, and the fallback). Reuse the text |
| `arrested` | `ronin_kodenmacho`. In Act 1 it's the direct end at Suspicion 5 (the text already says "bound for Kodenmachō"). In Acts 2–3, Suspicion 5 spawns C12 first |
| `death` | Stays as the **shared** death ending (`02` §10), outside the 12, with variant keys `death.duel` and `death.sweep` |

`RUN_EVENT_TARGET = 13` in `state.ts` goes away. Run length comes from act
lengths plus transitions.

---

## 5. Sensitivity pre-check (`03` §9.1, outline level)

This is a pre-check on beats, not on prose. Every event gets the full checklist
again once it's written. Rows are ordered by how much care they need.

| Beat | Sections | Care | Pre-check notes |
|---|---|---|---|
| C10 / C13 adauchi + hatashiai (duel law) | A3, F2, I2 | **Highest** | See §5.1 |
| S3-a seppuku at Sunpu | E1, E3, E4, F1–F3 | **Highest** | See §5.2 |
| S3-c / C12 / Kodenmachō: executions and crucifixion | E1, E4, E5, B1, G5 | **Highest** | See §5.3 |
| C8 / C11 Informant | F2, F3, H2, D1 (by analogy) | **High** | See §5.4 |
| C2 Fujieda kirisute-gomen | A2, A3, A4 | **High** | See §5.5 |
| C1 watch-list / barrier-breaking | A1, G5, I2 | Medium | Sekisho guards are domain or shogunal barrier men, not dōshin (G5). If C1's fight branch keeps the lenient Act 1 outcome, the codex card must state the real penalty (`08` N1). **Needs a `01` line** on the sekisho-yaburi penalty |
| C11 Marubashi | F1, F3, H2 | Medium | `03`'s "coughs blood" isn't in `01`; `01` supports only "fever-talk." Hedge it or source it. Give him no invented confession. His "fever" reveals the plot as `01` records it |
| C5 / C9 livelihoods | A1, A4 | Medium | A samurai doing sumo or porter-scale work pays face (a Resolve cost on first use, as C5 does). Rōnin street sumo is documented (`01` §B8). The debtor in C9 must be a person, not a prop (A4). The "refuse" option isn't framed as naive (B4 by analogy) |
| C3 / C7 / C14 O-Ryō | C1, C2, C4, F4 | Medium | "Ex-Toyotomi camp follower" (`03`) must not imply sex work for titillation. She was a provisioner and cook (spec'd above), with a codex card on camp economies. She wants her lease and her independence (C4). C14's offer is work and partnership, not rescue |
| C10 Katsuragi | E4, D5 (by analogy) | Medium | "400 households from execution" is collective punishment (E4). Keep it as his real argument, and let him be a person carrying out a choice (the D5 principle) |
| C6 Yui (sample 6) | F1–F3 | Low | Already written. Keep his lines to character. He never names the plot outright |
| S1 men with no banners | A1, I1 | Low | Codex: domain confiscations (`01` §B1 scale note) |

### 5.1 Duel law (C10, C13): the biggest historical finding

- **Adauchi needs a killing.** `01` §B2 says adauchi was legal only with
  authorization and a paper trail. Historically it avenged the *killing* of a
  parent or senior kin. `03`'s premise has the father "die in the siege" and
  Katsuragi guilty of *surrender*, which is not grounds for a licensed vendetta.
  The spec's fix is in C4: the letter plus Sahei's testimony show that the
  father was **cut down by Katsuragi's men** for refusing the surrender.
  **`03` §4 Tale 1's premise should be updated to match.**
- **Who authorizes, with the domain dissolved?** `01` says "domain
  authorization". The PC's domain no longer exists. C10/C13 assume a petition
  through the Edo city magistrate's office with a sponsor. **Research
  follow-up for `01` before authoring (I2):** the mechanism for a rōnin's
  vendetta license and registration, and whether it could lie against a man
  now in shogunal service.
- **Hatashiai are criminal.** `01` §B2 says private duels were suppressed and
  persisted illegally. So `hatashiai_won` always raises Suspicion (+2) and
  always triggers C12, even though the duel had seconds. "Witnessed as lawful"
  (`03` §1) applies **only** to C13-A's sanctioned duel. Outcomes state
  whether Katsuragi died or lived (A3).
- **Timeline sanity.** Osaka was 1615, so the PC is in their mid-30s or older
  in 1648, and Katsuragi is in his 60s or 70s. Write him old. His Power 13–14
  reflects skill, not youth.

### 5.2 Seppuku at Sunpu (S3-a)

- E3: state the fact, the date (Sep 10, `01` §B1), and what it meant for
  those left: **the conspirators' families were executed** (E4, and it must be
  kept in). The PC's seppuku spares no one. No "beautiful death" language, no
  ritual choreography (E1), and no codified "bushidō" framing (G4).
- F2: Yui's presence at Sunpu and his seppuku are sourced (`01` §B1).
  Details such as the inn or the surrounding officials need a `01` line before
  the historical note names them (I3).
- The mirror gate (Resolve ≥ 6) is mechanical, not moral. The locked hint must
  not read as "you're not worthy."

### 5.3 Executions and crucifixion (S3-c, C12, Kodenmachō)

- Marubashi's crucifixion (Sep 24, `01` §B1) is **referenced, never depicted**
  (E1): a notice, a rumor, a crowd's silence.
- **Location check (F2, G5).** `03` §3 and §6 put "heads on display at
  Kodenmachō." `01` §B5 names Kodenmachō as the *prison* and Suzugamori as an
  *execution ground*. Verify where the Keian executions and any display took
  place before writing S3-c. The spec says "the execution ground" until then.
- E5: *go to see* costs Resolve −2 and is never a trophy. Every epilogue
  references `saw_the_heads` / placement ("where you stood", `03` §3).
- B1/B3: if execution-ground labor appears, it's done by named individuals with
  a trade (hinin), and the codex card covers the system.
- C12's recruited arrest text keeps the families (E4).

### 5.4 Informant (C8, C11, ending)

- **It must not be written as *the* betrayal.** `01` §B1 attributes the plot's
  exposure to Marubashi's fever-talk. The PC's report is one voice among the
  things the metsuke were already hearing. It changes nothing in history, only
  the PC's life. F3: no invented confession. **Research follow-up for `01`:**
  whether other informants are recorded. If so, the PC can stand among them.
- No victory framing (the D1 principle applied here): "rewarded, then despised;
  your name survives in no song" (`03`). The money is real and so is the
  isolation. S3-c's *collect the rest* costs Reputation and Resolve.
- G5: check "metsuke" versus the machi-bugyō as the office a rōnin would
  realistically reach. Metsuke inspected samurai officials, and the city
  magistrates policed Edo. Confirm in `01`.

### 5.5 Kirisute-gomen at Fujieda (C2)

- A2: the kabukimono *claims* the right, against a commoner (the porter), for
  alleged gross insolence. The text must show that it's a claim, that an inquiry
  follows, and that unjustified use ruins the claimant (`01` §B2). The crowd
  knows all three. It is **not** a right one two-sworded man holds over another,
  so he can't invoke it against the PC (the `08` M1 lesson).
- A3: C2's fights end with him fleeing wounded, not killed, and Suspicion rises
  anyway (steel in a street, witnesses).
- A4: the porter's humiliation costs him something visible, and it isn't
  comedy. *Laugh along* is offered honestly, with Gi −2.

### 5.6 Player gender (C5): decided

Tale 1's PC is **male, fixed** (`02` §4.1; `10-tale1-gender-options.md`
Option A). Tale-1-exclusive chain text may assume it; `03` §4 now states it,
which is what checklist C5 asks. The chain text above still uses "you" and
needs no change. Shared content must stay neutral: the slice's `death`
epilogue and `night_tsujigiri` win text were neutralized when the decision
was applied. `reached_edo` becomes a Tale-1-only transition node (§4.2) and
may keep its wording. The gender-variant table from the draft of this
section (livelihood doors, Yui recruitment, a woman's vendetta) no longer
applies to Tale 1; keep it in mind for the premise audits of Tales 2–4.

---

## 6. Engine requirements

What the built engine must add to run this chain. The "Exists?" column was
checked against `src/engine/types.ts`, `eventDirector.ts`, `state.ts`,
`save.ts`, `main.ts` and `src/content/endings.ts`, as built.

| # | Requirement | `04` ref | Exists? | Notes |
|---|---|---|---|---|
| 1 | **Flags** on `RunState` (`flags: Set<string>`), effects `set_flag` / `clear_flag`, and Tale-start flags (`watch_list_active`) | §3 effects | **No** | `RunState` has no flags. The `TraitOption.flag` in `tale.ts` is never applied |
| 2 | **Counters** (`counters: Record<string, number>`), `counter_inc` with signed `by`, clamps, and engine-maintained `combat_wins`, `act`, `act_event` | §3, §3.2, §3.3 | **No** | Nothing counts combat wins today |
| 3 | **Items / key items**: `add_item`, `items_any`, the protected flag for `fathers_letter` | §3 | **No** | No inventory in the slice |
| 4 | **Event-level `requires`** and **choice-level `requires`** with `display_when_unmet` (`hide` / `locked_hint`), `any_of`, `stats`, `min_`/`max_` tracks, `counters_min`, `min_money` | §3 | **No** | `Choice` has only `text/check/on*`. `StoryEvent` has no `requires`/`acts`/`unique`. `main.ts` renders every choice |
| 5 | **Sub-nodes and `goto`** (compound checks, lesser outcomes, C10's locate step, C13's two steps) | §3, §3.1 | **No** | Outcomes are terminal |
| 6 | **Combat launched from a story choice** (C1, C2, C9, C10, C12, C13, S3), including pre-combat win% mods (C10's ±10%) and non-lethal bouts (sumo, dojo) | §3 `goto`, `02` §7.1 | **No** | Combat is a separate event type drawn from the bag. Needs a `combat` outcome or a goto to a combat node |
| 7 | **Check mods** (`if_flag` pct; DC ±1 for `sworn_testimony`, `watch_list_active`, `petition_weak`) | §3 check `mods` | **No** | `CheckSpec` is `{stat, dc}` only |
| 8 | **Milestone injection**: the `inject` block (§1.1: slot, window, after_event, priority, mandatory, on_lapse) plus reactive `spawn_event` | §4, §3 `spawn_event` | **No** | `eventDirector.ts` is one weighted bag with no injection |
| 9 | **Acts and transitions**: `act`/`act_event` state, per-act bags, transition nodes (text + effects: season tick, bag swap, level interval 3→4, rest), mandatory-chain gating | §4, `02` §3 | **No** | Single Act 1 pool; `RUN_EVENT_TARGET = 13` ends the run |
| 10 | **`endings.json` evaluator**: `forced` vs evaluated, `priority`, `any_of`, `min_`/`max_`, `counters_min`, `flags_not`, `fallback`; `end_run(id)` with variant keys (`death.duel`) | §3.2 | **Partial** | `Outcome.endingId` already works as `end_run`. But `checkForEnding` in `state.ts` is hard-coded, and `ENDINGS` has no requirements or priority |
| 11 | **Effects vocabulary**: `money_mult`, `stat_delta`, setting a track to a value (C12 "Suspicion set to 5") | §3 | **No** | Only additive deltas on 6 tracks |
| 12 | **Save migration**: `SAVE_VERSION` 1 → 2, with flags, counters, items, act, pending injections and sub-node position serialized | §4 Save | **No** | `save.ts` has a version check but no migration, so old saves are dropped. Acceptable pre-MVP |
| 13 | **Trajectory hints** (`02` §10): ending candidates as rumor lines, driven by the `requires` blocks | `02` §10 | **No** | Nice-to-have for P1.5. The mirror rule's `locked_hint`s cover the decisive beats meanwhile |
| 14 | **Schema validator**: broken `goto`s, unknown flags (checked against §2's ledger), and unreachable `requires` | §5 | **No** | Strongly recommended first. §2's ledger is its fixture |

*Update:* #1 (flags), #2 (counters, minus engine-maintained ones), #3 (key
items as a set), #4 (event- and choice-level `requires` with `displayWhenUnmet`)
and the `stat_delta` part of #11 are now built (`src/engine/requirements.ts`,
`types.ts`, `state.ts`), with save format v2 and a v1 migration (part of #12).
#14's validator exists and checks the flag/counter/item ledger.
#8 (milestone injection, per §1.1: slot, window, early, afterEvent,
priority, mandatory, onLapse, plus `spawnEvents`) and #9 (acts, per-act
bags, transition events, per-act level interval) are built in
`src/engine/director.ts`, save format v3. The slice runs as one 13-event act
that still ends at `reached_edo`; switching it to `t1_gates_of_edo` is a
one-line `ACTS` change once Act 2 has a pool. Remaining: #5–#7, #10, #11
(`money_mult`, set-to-value), #13.

**Top three gaps**, in build order:
1. **Run state and requires:** flags, counters and items, with event- and
   choice-level `requires` (#1–#4). Nothing in this chain can gate without them.
2. **The director:** acts, per-act bags, milestone injection and transitions
   (#8, #9). The slice's single bag and fixed 13-event end must become an act
   model.
3. **The `endings.json` evaluator** with priority, forced endings and a fallback
   (#10), replacing the hard-coded `checkForEnding`.

The runner-up is #5–#6 (sub-nodes, and combat launched from a choice). About
half of the chain's choices use a compound check or a combat follow-up.

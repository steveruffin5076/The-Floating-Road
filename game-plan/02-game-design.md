# 02 — Game Design Document

## 1. High concept

**THE FLOATING ROAD** (title confirmed) — a text-based roguelike adventure set in
historical Japan, 1648–1651. You build a character from a lower-class or fallen-samurai
origin, travel the Tōkaidō highway, survive random events resolved by stat checks and
auto-combat, pursue your origin's personal questline, and reach one of many endings —
most of them brushing against the historical Keian Uprising of 1651. Death is permanent
for the character, not for the player: each run banks **Omoide (memories)** that unlock
new origins, traits, and codex knowledge.

**Genre:** Narrative roguelike / choice-based RPG (the *Life In Adventure* genre).
**Platform:** Web (desktop + mobile browser). **Sessions:** 20–40 min runs.
**Rating target:** Teen+ (violence, gambling themes, execution depicted in text — never graphic).

### Title
**The Floating Road** — confirmed 2026-09-20. ("Floating" = ukiyo transience + a life
adrift; "road" = the Tōkaidō. Works for all six origins, not just rōnin.)
Rejected alternatives: *Masterless*, *Tōkaidō Nights*, *Kaidō: Wayfarers of Edo*,
*Rōnin's Fortune*.

## 2. Design pillars

1. **History is the content.** No invented monsters needed — checkpoints, famine, debt, duels, fires, persecution, and a real coup plot are stranger and sharper than fiction. Every event teaches one true thing about the era (codex payoff).
2. **Readable risk, meaningful builds.** Every check shows its stat and odds; the player always knows why they won or lost. High investment approaches near-certainty on trivial tasks (fixes LiA's "30 STR fails to crush an apple" complaint).
3. **No wasted runs.** A failed run still banks progress (omoide, codex, ending unlocks). Every death produces an epilogue worth reading.
4. **Class defines the game.** Origin isn't a stat skin — it changes which events fire, which choices exist, which endings are reachable, and how the law treats you.
5. **The road itself is the map.** Progression is literal: Kyoto → 53 stations → Edo, with detours. Location tags drive event selection.

## 3. Core loop (per run)

```
CHARACTER CREATION
  origin Tale → traits → stat seed → name/appearance → optional daily seed
        │
        ▼
ACT 1 — THE ROAD (≈12–15 events)
  random events tagged to road/village/post-town; tutorial-ish checks;
  earn money, gear, first omen events of the rōnin unrest
        │
        ▼
ACT 2 — THE CITY (≈15–20 events)
  arrive Edo (or Osaka/Kyoto per Tale); personal questline chain events
  interleave with random city events; shops, gambling, employment, law
        │
        ▼
ACT 3 — KEIAN (≈6–10 events)
  spring–autumn 1651; questline climax + historical convergence point;
  the uprising happens around you whether or not you join it
        │
        ▼
ENDING → epilogue text + title + omoide payout → meta screen → new run
  (any time: Health ≤ 0, or Resolve ≤ 0 → "gave up" ending variant)
```

Between events the player sees a compact status bar and a "travel onward" button;
rest nodes (camp/inn) appear every ~4–5 events for recovery and inventory management.
Every rest node always includes a free **"shelter for the night"** option (sleeping
rough under eaves, huddled in a straw rain cape) regardless of money — it recovers
little and the outcome text may be unpleasant, but it always stops a Resolve bleed,
so a broke or stranded character (e.g. flooded out at a river-ford) can never be
trapped in a no-money Resolve spiral.

## 4. Character creation

### 4.1 Origins ("Tales")

Unlocked progressively like LiA's Tales. Each Tale = starting kit + exclusive quest
chain + exclusive endings + event-pool tags.

| # | Tale | Class | Unlock | Core fantasy |
|---|---|---|---|---|
| 1 | **The Masterless Blade** (rōnin) | Samurai | default | Honor vs survival; the Keian choice; legal revenge vs outlawry |
| 2 | **The Famine Road** (runaway peasant) | Farmer | default | Survival from nothing; can he ever go home? |
| 3 | **The Debtor's Ledger** (townsman) | Merchant/craftsman | default | A ticking debt to a bakuto lender; buy freedom or buy power |
| 4 | **Rolling Bones** (bakuto gambler) | Underworld | finish any run with Tale 1–3 | Dice, dens, oyabun loyalty; the underworld's own honor code |
| 5 | **The Pilgrim's Way** (woman traveling alone) | Commoner/pilgrim | buy with omoide | Hardest travel checks (period-accurate permit scrutiny); shrine economies, entertainer work |
| 6 | **The Hidden Cross** (kakure kirishitan) | Outcast | buy with omoide (post-MVP) | Paranoia run: fumi-e tests, informants, smuggling networks |

Gender/name are freely chosen for all Tales; Tale 5 explicitly frames the period's
travel restrictions for women as its difficulty hook (historically grounded).

### 4.2 Traits (pick 1, more unlockable)

Small permanent run modifiers, e.g.:
- **Dojo-Trained** (+2 Waza) — rōnin/merchant families
- **Big Eater** (+2 Chikara, food costs +50%)
- **Silver Tongue** (+2 Kuchi, but Suspicion gains +1 when lying fails)
- **Night Eyes** (+1 Me, night events get extra choice)
- **Gambler's Ear** (chō-han bets show a hint of the true odds)
- **Farmer's Back** (+2 Tan, cannot be flagged as runaway before Act 2)
- **Sword-Polisher's Son** (blades degrade slower; can appraise swords)
- **Temple-Lettered** (+2 Chi, can read official notices — hidden info revealed)

### 4.3 Stats — the Six Ways

| Stat | Kanji | Meaning | Gates |
|---|---|---|---|
| **Chikara** | 力 | Strength | Brawls, labor, fording rivers, breaking things |
| **Waza** | 技 | Technique | Swordsmanship, sleight of hand, crafts, cheating at dice |
| **Chi** | 智 | Learning | Reading permits, medicine, strategy, merchant math |
| **Kuchi** | 口 | Speech | Persuasion, haggling, bluffing checkpoints, calming crowds |
| **Me** | 目 | Awareness | Ambush detection, gambling tells, finding paths, tracking |
| **Tan** | 胆 | Nerve | Endurance, pain, intimidation *resistance*, keeping Resolve |

Stats seeded 1–5 (origin-biased, one roll or 8-point buy), +2 on level-up choice
(2 points/level — slower than LiA's 4 to keep checks meaningful). Range 1–15 in practice.

**Level-up cadence:** ~1 level (2 stat points) every ~4 resolved events, front-loaded
slightly in Act 1 so early checks don't feel like a wall before a fresh character has
any build. For a ~35-event run that's **~8–9 level-ups, i.e. ~16–18 stat points invested
by endgame** — mostly concentrated in 1–2 stats per §4.2. This is the number the §15
balance targets and the balance-sim harness are tuned against; if the sim disagrees,
adjust this cadence or the ×8 coefficient in §6 before touching content.

## 5. Vitals, tracks, and resources

| Track | Range | Falls from | Rises from | At zero / max |
|---|---|---|---|---|
| **Health (Karada)** 体 | 0–20 (grows w/ level) | Wounds, hunger, illness, disasters | Food, rest, medicine, baths | 0 = death → ending |
| **Resolve (Kokoro)** 心 | 0–10 | Humiliation, atrocity witnessed, starvation, betrayal, rain-sodden nights | Sake, festivals, kindness given/received, victories, shrine prayer | 0 = "The Road Ends Here" — character gives up (despair ending family) |
| **Money (Seni)** 銭 | mon; 1 ryō = 1,000 mon (game-fixed rate) | Everything | Work, gambling, loot, trade | Gates shops, bribes, inns |
| **Suspicion (Ayashisa)** 怪 | hidden 0–5 | Crimes, violence witnessed-by-others, failed bluffs, owning illegal goods | Time, bribes, good deeds with witnesses, new identity papers | 3+ = patrol/checkpoint events turn hostile; 5 = wanted-poster event chain, arrest possible |
| **Reputation (Na)** 名 | −5 … +5 | Heroic/devious public acts | — | Gates endings, employer quality, duel invitations |
| **Gi 義 vs Aku 悪** | single slider −5…+5 | Moral choices (share rice vs steal it) | — | Colors dialogue, NPC reactions, ending variants |

Replaces LiA's "sanity": **Resolve** is the same mechanical role (second death clock,
pressure valve) but period-legible — *ki*, the spirit to keep walking. Suspicion is the
new historical track that makes crime cost something across a run.

Suspicion is hidden as a number, but gets the same **visible-trajectory** treatment
endings already use in §10: status-bar hint lines surface at tier boundaries instead
of an exact value — e.g. "people are starting to eye you at checkpoints" as tier 3
approaches, "your face is becoming known to the wrong people" nearing tier 5. The
number stays hidden (so it can't be min-maxed to the decimal) but the *direction* is
always legible, consistent with the "hidden gates never blindside the player"
principle stated in §10.

### Inventory
8 slots (upgradeable item: ō-banashi furoshiki wrapping cloth → +2). Categories:
- **Weapons** (tier drives combat): rusted blade / serviceable katana / fine katana / meibutsu (named masterwork); also bō staff, naginata, wakizashi pair, kusarigama, fisherman's gaff.
- **Armor/clothing**: travel clothes / padded haori / dō chestplate / lacquered armor set (rōnin-only purchase; wearing armor raises Suspicion in cities — accurate!).
- **Consumables**: onigiri, dried fish, sake flask, kintan pills (medicine), bandages, straw rain cape, torch.
- **Key items**: tegata travel permit (quality tiers!), letter of introduction, dice cup, Musashi's copied scroll, Christian rosary (contraband — Suspicion bomb), stolen seal.
- **Blade condition**: weapons have 0–100% condition; degrade in combat/usage; a chipped katana fights like a worse tier. Polishing costs money (adds the LiA-style "gear maintenance" pressure, historically real).

## 6. Skill checks

Every gated choice displays: `[Stat name] — XX% chance`.

```
success% = clamp( 50 + (stat − DC) × 8  +  modifiers ,  5,  95 )

modifiers (typical): item +5..+15, condition (drunk, wounded) −5..−20,
trait ±5, alignment/NPC attitude ±10, act-appropriate DC tuning
```

- **DC scale:** trivial 2, easy 4, moderate 6, hard 8, brutal 10+. Act 1 rarely exceeds DC 6; Act 3 climax checks run DC 8–10. These named tiers are anchors, not the full set of legal DCs. Intermediate values (3, 5, 7, …) are expected for finer tuning.
- **Auto-success on trivial/easy checks:** DC ≤ 4 checks skip the roll entirely (no odds line shown) once the stat margin reaches **≥ +6** — a well-invested character shouldn't carry a permanent 5% fail chance on the easiest tasks in the game for the whole run (that's LiA's "30 STR fails to crush an apple" complaint at 1-in-20 instead of 1-in-4). Below that margin, trivial/easy checks still roll normally under the clamped formula. Moderate+ DCs always roll and keep the 95% ceiling — tension is wanted there.
- **Partial success:** failed checks on *non-combat* events may still yield a "lesser outcome" instead of pure punishment (weighted by margin), e.g. you don't talk past the checkpoint but the guard lets you turn back instead of arresting you. Fixes LiA's binary cruelty. Below a bad-margin threshold (net margin ≤ −6, i.e. near the 5% floor), the weighting locks to two outcomes only — "lesser outcome" or full failure — excluding any harsher third tier an event may define, so being badly outmatched costs you the win but never spikes to the game's worst punishment on a near-floor roll.
- **Bad-luck protection (scaling):** starting at the 2nd consecutive failed check, each further consecutive failure adds +5% (hidden) to the next check's odds, capping at +25%; resets to 0 on any success. Scales with streak length instead of firing once, so it behaves like a real pity system across a genuine bad-luck run.
- **Unskewed display:** odds shown are the true odds. No hidden modifiers except the pity system. Auto-succeeded checks (above) show no odds line at all — nothing to read when the outcome isn't in doubt.

## 7. Combat

Auto-resolved like LiA, but the pre-battle ritual is **chō-han**, the bakuto dice
game — thematically perfect and mechanically identical to LiA's optional d20.

### 7.1 Flow

```
ENCOUNTER → combat card shown:
  You:  Power = weapon_tier×4 + Chikara + Waza + armor + condition
  Foe:  Power = printed
  Win%  = clamp(50 + (You − Foe)×6, 5, 95)
        │
        ▼  (optional, once per fight)
CHŌ-HAN BET: call 丁 (even) or 半 (odd). Two dice rolled in the cup.
  • correct  → Win% +20  ("the dice favor you")
  • wrong    → Win% −20
  • skip     → unchanged
        │
        ▼  optional STANCE choice (1 of 3, replaces full passivity):
  • 攻 AGGRESSIVE — win → clean kill, lose → +50% damage taken
  • 守 DEFENSIVE — win → longer fight (small extra damage), lose → −40% damage, may flee
  • 逃 ESCAPE ATTEMPT — Me check instead of fight; fail → fight starts at −15% win
        │
        ▼
RESOLVE → outcome text: victory (loot, XP, wound level by margin),
defeat (death / capture / severe wound — capture sends you to the
prison chain: Kodenmachō events, trial, escape or execution)
```

The chō-han bet is an intentional **zero-expected-value variance injector**
(0.5×(+20) + 0.5×(−20) = 0) — a way to add tension without a hidden thumb on
the scale. Future balance passes should preserve that symmetry rather than
"fixing" it into a positive-EV freebie.

### 7.2 Enemy roster (historical, no fantasy)

Bandit rōnin, kabukimono gangers, drunken samurai (duel!), night tsujigiri attacker,
thief in a crowd, yakuza enforcers, dōshin patrol (fight = big Suspicion even if you
win), wild dogs, river-flood swim, fire (disaster "combat" — same system vs an
elemental Power number), sumo bout (non-lethal variant), formal hatashiai duel
(Act-2/3 set pieces, rules-bound: seconds, ground, first blood or death).

## 8. The Event Director (fixing LiA's repetition problem)

- Events live in a **weighted draw bag** per location tag: `road`, `village`, `post-town`, `river-ford`, `mountain-pass`, `city-edo`, `city-osaka`, `temple-grounds`, `night`.
- **No-repeat bag:** a drawn event cannot re-fire until the bag is exhausted and reshuffled (shuffled with seed). Rare events (weight 1) get a guaranteed-spawn counter if never drawn by late Act 2.
- **Act pacing table:** each act has a target mix, e.g. Act 1 = 50% road/travel, 20% encounter, 15% economy, 10% Tale-chain, 5% disaster. Act 2 shifts to city/quest. The director picks category first, then event.
- **Requirements engine:** events filter on Tale, flags, items, stats, Suspicion, alignment, season, time-of-day. E.g. "Fumi-e Test" only fires for Tale 6 or Suspicion≥4 near Nagasaki-bound rumors.
- **Guaranteed spine:** each Tale has ~10–14 chain events injected at act milestones (not drawn randomly) so the personal story never drowns in filler (fixes LiA's "unconnected quests").
- **Season clock:** run spans spring 1648 → autumn 1651 in compressed "seasons" (each act ≈ 2–3 season ticks); season changes weather table (plum rains flood the Ōi ford, winter closes passes), festival events, and food prices (famine years).
- **Content volume MVP:** ≥120 generic events + ≥40 chain events (vs LiA's criticized small pool); designed for expansion packs ("Tales" model).

## 9. Economy

- **Income sources:** procession day-labor (safe, low), bodyguard contracts, bounty-hunting (capture-not-kill pays more), peddling goods between stations (buy low/sell high mini-loop with 3 goods, §9.3), gambling (§9.2), sumo exhibition bouts, temple copying work (Chi), performing (Kuchi/Waza), night soil collection (yes, a real Edo job — humbling, pays, costs Resolve the first time), escorting pilgrims.
- **Money sinks:** inns vs sleeping rough (Resolve cost), food (hunger events if skipped), blade polish/repair, bribes (checkpoints, dōshin, prison guards), medicine, gambling, gifts that build NPC relations, forging papers (expensive, enables Tale 5/6 travel).
- **Debt mechanic (Tale 3):** principal 100 ryō, interest accrues each season tick (historically real rates exceeded 100%/yr — game uses kinder 25%/tick and says so). Debt can also be *worked off* via underworld jobs → slides alignment Aku. Two bounds keep the spiral from cutting against the "no wasted runs" pillar (§2.3): an early lump-sum **"buy out the note"** payoff is available while the balance is still small (roughly the first 1–2 ticks, before compounding multiplies it past easy reach), giving a player who saves aggressively a real honest-path option instead of the debt always outrunning them; and **compounding freezes once Act 3 begins** (interest stops accruing, though whatever principal-plus-accrued balance remains still has to be paid off or worked off), so a debtor who avoided the underworld route isn't mathematically locked out of a clean ending in the final act.
- **Shops:** not random NPCs — fixed institutions that appear as events: the pawnshop, the swordsmith, the medicine seller, the fence (underworld-gated), the paper-forger (Suspicion-gated). Stock refreshes by season, not paid refreshes.

### 9.1 Wage & price reference

No income source above is meant to be simulated blind — these are rough gameplay
targets (not simulation-locked constants), seeded from the period price anchors in
`01-research.md` §B4, that the balance-sim harness (§15) tunes actual event rewards
against.

| Source | Typical payout | Notes |
|---|---|---|
| Procession day-labor | 30–50 mon/event | safe, low — the floor income |
| Temple copying work (Chi) | 40–60 mon/event | steady, gated by Chi checks |
| Performing (Kuchi/Waza) | 40–80 mon/event | variable, audience-dependent |
| Night soil collection | 60–90 mon/event | pays above floor; Resolve cost the first time |
| Peddling loop (buy low/sell high) | 20–80 mon profit/loop | can lose money if prices move against you; formula in §9.3 |
| Escorting pilgrims | 80–150 mon/event | especially available to Tale 5 |
| Sumo exhibition bout | 100–250 mon/win | non-lethal combat variant payout |
| Bodyguard contract | 150–300 mon/event | higher risk than day-labor, by design |
| Bounty-hunting (capture-not-kill) | 200–500 mon, up to ~1 ryō for named targets | "pays more," per above |
| Gambling (chō-han / dice den) | stake-based, roughly ±100–500 mon swings | honest play is −5% EV per round (a sink with variance); only the skill/cheat checks pay, see §9.2. (The *combat* bet in §7.1 is the zero-EV one.) |

For reference: a bowl of noodles runs ~16–20 mon, a cheap inn room ~100–200
mon/night, a kago (palanquin) ride ~1+ ryō/day, a decent katana 1–3 ryō, and a
meibutsu masterwork blade 10+ ryō. So a day of honest low-tier labor covers a
meal and maybe a room; a serviceable sword is a multi-event savings goal; a
masterwork blade is an endgame-scale purchase.

### 9.2 Gambling den (standalone chō-han)

The den (03 §7 sample 3, all of Tale 4) is a **different system from the combat
bet in §7.1**. The combat bet is zero-EV by design. The den is a **money sink with
variance**: honest play loses slowly on average, and only the Me/Waza checks turn
it into income. Those checks are priced so a focused build reaches parity with
honest work (§9.1), not a multiple of it. None of this is needed for the Act-1
vertical slice (§16); it lands with Tales 3/4 (V1.0).

**Stakes.**

```
B (base stake)  = 20 mon  provincial post-town den
                = 50 mon  city den (Edo, Osaka, Kyoto) and the Shinagawa great den
S (table stake) = B       shallow table ("play honest")
                = 5B      deep table    ("play deep")
max rounds per visit = 5  (the player may stop after any round)
```

The 5-round cap replaces 03 sample 3's "can stop anytime" open-endedness. Greed
is still the mechanic, but a visit is bounded, so one event can't swing a whole run.

**Honest round.** Two fair dice, call chō (even) or han (odd): exactly 18/36 = 50%.
The house takes a tenth of each winner's winnings.

```
win  (p = 0.5):  +0.9 S
lose (p = 0.5):  −S
EV per round   = 0.5 × 0.9S − 0.5 × S = −0.05 S        (−5% of stake)
SD per round   = sqrt(0.5×0.81S² + 0.5×S² − (0.05S)²) = sqrt(0.9025) S = 0.95 S
```

| Table | S | EV/round | EV/5-round visit | SD over 5 rounds (0.95 S × √5) |
|---|---|---|---|---|
| Provincial shallow | 20 | −1 | −5 | ≈ 42 |
| Provincial deep | 100 | −5 | −25 | ≈ 212 |
| City shallow | 50 | −2.5 | −12.5 | ≈ 106 |
| City deep | 250 | −12.5 | −62.5 | ≈ 531 |

That's the §9.1 "±100–500 swing" band, delivered by the deep tables, with a small
steady drain underneath. The dice use the main run RNG, so daily seeds reproduce.

**Skill and cheat options.** These are offered at the **shallow table only**
("nobody reads the deep mat": the house's best dealer and sharpest doorman work
it). Payouts are **stake-relative** (multiples of B), no longer fixed numbers, so
the same event scales from a provincial hut to an Edo den without re-authoring.
DCs use the §6 formula unchanged. Den checks add two DC terms:

```
effective DC = printed DC + den_tier_add + den_heat
  den_tier_add = 0 provincial, +2 city (better dealers)
  den_heat     = network-wide counter, see "Anti-farming" below
success%     = clamp(50 + (stat − effective DC) × 8 + mods, 5, 95)      (§6, unchanged)
```

| Option | Check | Success | Failure |
|---|---|---|---|
| **Watch the wrist** | Me DC 6 | Win 4 rounds pressing at 2B: 4 × 0.9 × 2B = **+7.2B** (144 provincial / 360 city). Den marked, heat +1, standing −1 at this den (§9.4) | Lose the pressed stake **−2B**, forfeit this visit's winnings so far, then choose: *leave*, or *accuse the dealer* |
| ↳ Accuse the dealer | Kuchi DC 7 (+ tier add) | He cuts you in for a tenth of the night: **+5B**, standing +1 here | Combat vs `den_enforcers` Power 10, with witnesses (Suspicion +1 regardless of result, standing −2) |
| **Sleeve the die** | Waza DC 7 | **+12.5B** (250 provincial / 625 city). Gi/Aku −1, flag `cheated_den`, den marked, heat +2, standing −1 here | Heat +1, standing −2 here, then choose: fingers broken (−4 Health, `stat_delta` Waza −1, thrown out) **or** buy your hand back (all money) |

*Revision to 03 sample 3:* "watch the wrist" pays 7.2B = **144 mon** at a
provincial den, not the flat 160. It's four wins at a doubled stake with the
house tenth taken, the same arithmetic as an honest round. "Sleeve the die" keeps
exactly 250 mon at B = 20 (12.5B). The 20-mon minimum, the tenth, deep = ×5, the
loan at a ≥100-mon loss, and all DCs and failure costs are kept as written.

**EV, watch the wrist** (EV = p × 7.2B − (1 − p) × 2B, taking *leave* on failure):

| Me | Provincial (DC 6, +144 / −40) | City (DC 8, +360 / −100) |
|---|---|---|
| 3 | 26% → 37.44 − 29.60 = **+7.8** | 10% → 36.00 − 90.00 = **−54.0** |
| 5 | 42% → 60.48 − 23.20 = **+37.3** | 26% → 93.60 − 74.00 = **+19.6** |
| 10 | 82% → 118.08 − 7.20 = **+110.9** | 66% → 237.60 − 34.00 = **+203.6** |
| 12 | 95% (98 clamped) → 136.80 − 2.00 = **+134.8** | 82% → 295.20 − 18.00 = **+277.2** |

**EV, sleeve the die.** Failure costs no mon directly, so for balance work price it
with a fixed convention: 1 Health ≈ 25 mon, one permanent stat point ≈ 300 mon,
so broken fingers ≈ C_f = 4 × 25 + 300 = **400 mon** (buy-back costs the whole purse,
so a player picks whichever is smaller). EV = p × 12.5B − (1 − p) × 400:

| Waza | Provincial (DC 7, +250) | City (DC 9, +625) |
|---|---|---|
| 3 | 18% → 45.0 − 328.0 = **−283** | 5% → 31.3 − 380.0 = **−349** |
| 5 | 34% → 85.0 − 264.0 = **−179** | 18% → 112.5 − 328.0 = **−216** |
| 10 | 74% → 185.0 − 104.0 = **+81** | 58% → 362.5 − 168.0 = **+195** |
| 12 | 90% → 225.0 − 40.0 = **+185** | 74% → 462.5 − 104.0 = **+359** |

For a Waza build, 300 mon undervalues a permanent Waza point: it costs −8% on
every later Waza check and −1 combat Power (−6% Win%). The real EV is lower.

Reading the tables:
- **Act 1, stat 3–5:** the skill option is roughly day-labor money (+8 to +37,
  vs 30–50 for procession labor) at far higher variance. Cheating is strongly
  negative. A fresh character gambling in Act 1 is playing for the story.
- **Late run, focused stat 10–12:** a first-time watch-the-wrist is worth ~110–135
  provincial and ~200–280 city. That's the bodyguard band (150–300). The first
  city sleeve (~+360) is the single best den play in the game, and heat halves it
  on the next try (below). **Parity with good honest work, not dominance.** A den
  visit also uses up an event slot that could have been a contract.

**Anti-farming.** Three layers, all visible to the player:
1. **One skill-or-cheat attempt per visit.** Picking watch, sleeve, or (Tale 4) call
   by ear closes the other options for that visit. Honest rounds stay open.
2. **Marked dens (`den_marked.<station>`).** Any watch or sleeve success marks the
   den. The next visit to that station is the **hostile variant**: skill/cheat
   options hidden, and the house takes a **fifth** instead of a tenth (honest EV
   = 0.5 × 0.8S − 0.5S = −0.10S, and the text says so). A *make amends* choice
   (pay 5B) clears the mark and raises standing by 1, to a maximum of 0.
3. **Network heat (`den_heat`).** +1 per watch success, +2 per sleeve success, +1 per
   caught sleeve. Each point adds +1 to the effective DC of every den skill/cheat
   check on the road, because the circuit talks. It decays by 1 per season tick
   (§8), floor 0. Worst case, no decay, Me 12 watching the wrist at successive
   city dens: DC 8 → 82% (+277), DC 9 → 74% (+240), DC 10 → 66% (+204), DC 11 → 58%
   (+167). Sleeve at Waza 12, city: 74% (+359) → DC 11, 58% (+195) → DC 13, 42%
   (+31). Heat also keeps den checks inside §15's 55–65% realized pass band
   for invested stats, instead of camping at 95%. At `den_heat` ≥ 4, Suspicion +1
   (once per act): the dens start trading your name to the okappiki (`01` §B6).

For non-Tale-4 characters the den event sits in the post-town bag (§8). Watch
and sleeve first require flag `knows_the_mat`, set by playing at least one honest
round at any den ("you have to sit at a mat before you can read it"). That's how
Tales 1–3 "discover it mid-run." The bag's no-repeat rule plus marks keep them to
~2–3 den visits per run.

**Traits.** *Gambler's Ear* (§4.2) gives +5 to den Me checks and shows the current
`den_heat` on the den screen. There are no hidden odds: honest rounds are always a
true 50%.

**Loans (the ≥100-mon hook).** When a visit's running net reaches −100 mon or
worse, the dealer offers a loan of 5B or 10B (100/200 provincial, 250/500 city).
Taking it doesn't change round EV. It just lets you keep losing at −5%.
- **Tales 1, 2, 4, 5, 6:** counter `den_loan` holds the balance, and it accrues the
  §9 rate (25% per season tick, stated in the text). A `den_collector` event is
  spawned for the next season tick: pay the balance, flee (standing −2 at the
  lending den, flag `den_debtor`), or take a beating (−3 Health, −1 Resolve per
  unpaid 100 mon, never below 1 Health: a debt beating can't end the run, per
  pillar 3). Compounding freezes at Act 3, same as §9.
- **Tale 3:** the loan goes onto **Bunzō's ledger** instead (*"Bunzō-san sends his
  regards"*): balance += loan, compounding with the ledger. It also sets
  `bunzo_den_note`, which spawns Bunzō's agent at the next post-town, one act
  earlier than otherwise, with the "work it off" underworld job offer (Gi/Aku −).
  The sum is small next to the ledger. The point is that the den is where Bunzō's
  network first catches up with you, and where the player learns how
  interest-bearing debt grows.

**Tale 4: "chō-han fully unlocked from the start."** Tale 4 starts at `cup_mastery`
1. Each *[The Cup Remembers]* flashback (one per act) raises it by 1:

| `cup_mastery` | Source | Unlocks |
|---|---|---|
| 1 | Tale 4 start | Every den option from the first visit (no `knows_the_mat` gate), the deep table, *Show your scar*, den standing (§9.4), and **Deal a night** at any den with standing ≥ +1: **+4B, no check**, once per den per act. It's the house tenth on a small mat (~4B of winnings per round × 10 rounds × 0.1), so a bakuto's honest wage (80 provincial / 200 city) |
| 2 | *The Cup Remembers I* (Act 1) | "Mother's ear": +10 to den Me checks (item-scale mod, §6). A failed watch the wrist costs −1B instead of −2B |
| 3 | *The Cup Remembers II* (Act 2) | **Call by ear**, Me DC 8 (+ tier add, **no heat term**): +5B, fail −1B. No mark, no heat, no standing change. It's reading the cup honestly, a rumored professional skill (`01` §B7), not cheating. Counts as the visit's one skill attempt |
| 4 | *The Cup Remembers III* (Act 3 lead-in) | **Break the planted die**, Waza DC 7: expose a rival outfit's loaded dice at this den for +3B and standing +1 here. Sets `iron_cup_hands` (a *The Cup Passes* prerequisite, 03 §4) |

Call by ear EV at mastery 3 (including mastery 2's +10): Me 5 provincial, 50 − 24 + 10
= 36% → 0.36 × 100 − 0.64 × 20 = **+23.2**. Me 12 provincial: 92% → 92.0 − 1.6 =
**+90.4**. Me 12 city (DC 10): 76% → 190.0 − 12.0 = **+178**. That's a repeatable,
heat-free income at bodyguard-band parity, which is what makes gambling "income"
for Tale 4 (03 §4) without out-earning the other Tales' honest work.

### 9.3 Peddling

The "3 goods" buy-low/sell-high loop. Each good carries **one** distinct risk, so
the choice of what to carry is the decision.

**Goods.** Prices are gameplay values anchored to `01` §B4: a dried-fish bundle
at about a noodle bowl, a packet of Suruga tea at a few bowls, and a lot of
second-hand blades and fittings at a fraction of a 1–3 ryō katana. Codex claims
about these trades need a `01` source line before authoring (checklist I2).

| Good | P0 (mon/unit) | Units per inventory slot | Market depth (units/visit, post-town) | Risk |
|---|---|---|---|---|
| Dried fish | 20 | 5 | 10 | **Spoilage**: in summer (incl. plum rains), lose 20% of carried units (round down, min 1) at each rest node. Can be eaten as food (1 unit = 1 meal), so it never goes to zero value |
| Suruga tea | 50 | 5 | 5 | **Theft**: light, dear, easy to fence (below). "Wet everything" outcomes (03 sample 4) also ruin half |
| Old blades & fittings | 300 | 1 | 1 | **Checkpoint scrutiny**: a commoner with an armful of blades draws questions (`01` §B2) (below) |

City markets (Nihonbashi dawn, Osaka, Kyoto) have ×2 depth. Goods use the
normal 8 inventory slots (§5). Depth, slots, and purse together cap a loop's size.

**Region multipliers** (station → region is fixed route data):

| Good | Kamigata (Kyoto–Kuwana) | Owari–Mikawa | Tōtōmi–Suruga | Hakone pass | Kantō–Edo |
|---|---|---|---|---|---|
| Dried fish | 1.20 | 0.85 | 0.90 | 1.30 | 0.85 |
| Suruga tea | 1.00 | 1.00 | 0.75 | 1.10 | 1.30 |
| Old blades | 0.80 | 1.00 | 1.00 | 1.00 | 1.25 |

**Price formula.**

```
v       = seeded noise in [−0.20, +0.20]
        = (hash32(runSeed, good, station, seasonTick) / 2^32) × 0.40 − 0.20
          (own hash-seeded sub-RNG, never advances the main rngState, so opening
           a market can't change event draws; stable on revisit within a season)
mid     = P0 × region_mult × season_mult × (1 + v)
            season_mult = 1.0, except fish takes the §8 famine-year food multiplier
H       = max(Kuchi, Chi)
spread  = clamp(0.12 − 0.01 × (H − 3), 0.03, 0.12)      H 4 → 0.11, H 8 → 0.07, H 10 → 0.05
buy     = round(mid × (1 + spread))    per unit
sell    = round(mid × (1 − spread))    per unit
```

Kuchi (haggling) or Chi (merchant math) narrows the spread: that's the margin
bonus. **Chi ≥ 6** (or *Temple-Lettered*) also shows the next region's
multiplier and the ±20% noise band before you buy (reading the price boards), so
Chi turns risk into information.

**Where loops happen.** A *market* choice appears at every post-town rest node
(every ~4–5 events, §3) and in market events (03 §6 Nihonbashi dawn). Buying and
selling is a free action at those nodes and uses no event slot. A **loop** is one
buy at a market and one sell at a later one, typically the next rest node.

**Risk resolution.**
- **Theft (tea):** on the first `night` or cheap-inn event of a leg, a seeded 25%
  rider fires. Me DC 5 to notice: failure means the thief takes half the tea,
  rounded up.
- **Spoilage (fish):** as in the goods table.
- **Checkpoint scrutiny (blades):** at each sekisho crossed while carrying blades,
  Kuchi DC 4, with +10 if you hold the bill of sale that a licensed sword shop
  issues with every purchase. Samurai-class PCs pass automatically (class is physics,
  03 §1). Failure: 75% lesser outcome (pay 25% of the lot's buy price as "fees"),
  25% confiscation plus Suspicion +1. This fixes §6's partial-success weighting
  for this check.

**Worked loops: a typical player** (H = 4, spread 0.11, Me 4, expected v = 0):

```
TEA, Tōtōmi–Suruga → Kantō–Edo, 5 packets (one slot, one market's depth)
  buy  = round(50 × 0.75 × 1.11) = round(41.625) = 42   × 5 = 210
  sell = round(50 × 1.30 × 0.89) = round(57.85)  = 58   × 5 = 290
  margin                                                    = +80
  theft: 0.25 × 0.58 (Me 4 vs DC 5 = 42% notice) × 3 packets × 58 = −25.2
  expected                                                   ≈ +55
  noise range: per unit 57.85(1±0.2) − 41.625(1±0.2) = −3.7 … +36.1 → −18 … +181 for 5

FISH, Owari–Mikawa → Hakone pass, 10 bundles (two slots, one market's depth)
  buy  = round(20 × 0.85 × 1.11) = round(18.87) = 19   × 10 = 190
  sell = round(20 × 1.30 × 0.89) = round(23.14) = 23   × 10 = 230
  margin                                                     = +40
  summer (1 season in 4): lose 2 bundles at the rest node → −46; out of season 0
  expected over the year: 40 − 0.25 × 46                     ≈ +28.5
  (in summer alone it's −6, and the text teaches you why)

BLADES, Kamigata → Kantō–Edo, 1 lot, crosses Arai and Hakone
  buy  = round(300 × 0.80 × 1.11) = round(266.4)  = 266
  sell = round(300 × 1.25 × 0.89) = round(333.75) = 334
  margin                                                     = +68
  per crossing, commoner: pass 50 + 0 + 10 = 60%; fail 40%
    expected loss = 0.40 × (0.75 × 67 fee + 0.25 × 334 confiscated) = 0.40 × 133.75 = 53.5
  2nd crossing only if not confiscated (0.90): 0.90 × 53.5 = 48.2
  expected                          68 − 53.5 − 48.2          ≈ −34  (+ Suspicion risk)
```

**Worked loops: focused** (H = 10, spread 0.05; Kuchi 8 for blades):

```
TEA   buy round(37.5 × 1.05) = 39, sell round(65 × 0.95) = 62 → +115; theft −0.145 × 186 = −27 → ≈ +88
FISH  buy round(17 × 1.05)   = 18, sell round(26 × 0.95) = 25 → +70;  spoilage −0.25 × 50 = −12.5 → ≈ +57.5
BLADES (Kuchi 8, spread 0.07) buy round(240 × 1.07) = 257, sell round(375 × 0.93) = 349 → +92
       pass 50 + 32 + 10 = 92%: loss 0.08 × (0.75 × 64 + 0.25 × 349) = 10.8, then 0.98 × 10.8 = 10.6 → ≈ +71
       (a samurai PC skips the checks: +68 at H 4)
```

| Loop (expected) | Typical (H 4) | Focused (H 10 / Kuchi 8) |
|---|---|---|
| Fish | ≈ +28 | ≈ +58 |
| Tea | ≈ +55 | ≈ +88 |
| Blades | ≈ −34 (don't) | ≈ +71 (Kuchi 8) / +68 (samurai) |

A typical loop lands in §9.1's **20–80 mon** band. Blades are a specialist's good
that loses money for everyone else. A capital-rich Kuchi/Chi build stacking tea
and fish on overlapping legs reaches ~150, about a low bodyguard contract.
Over a run (~7 rest-node markets, so ≤ ~6 loops), peddling adds roughly
+150–250 for a typical player and ~+500–600 for a focused merchant. That's a
real side income, not a replacement for work. Westbound runs (Tales 1/4
option, 03 §2) find thinner margins: fish Kantō → Hakone is +40 at H 4, tea
Suruga → Kamigata about +15. That's accepted.

**Tale 3 teaching chain.** *[The Peddler's Pole]* (Act 1 chain) gives 5 tea
packets on consignment at tea-country buy price. You repay the cost at the next
market and keep the margin, so no starting capital is needed. It shows the Chi
forecast once for free, and fires one theft rider with a telegraphed Me check,
so all three levers get taught in one loop.
*Scale flag (not fixed here):* §9's debt is 100 ryō = 100,000 mon, and one
25% tick is 25,000 mon, against §9.1 wages of ≤ 500 mon/event. Neither peddling
nor any honest income in §9.1 can dent it. The debt's scale (or its unit) needs
revisiting when Tale 3 is authored.

### 9.4 Den network (Tale 4)

**Decision: a per-den standing stored as counters, rolled up into network
totals. Not a re-skinned Reputation.** Why:
1. Dens are per post-town and 03 gives each "its own tiny state". A single global
   number can't express "welcome at Mishima, blood feud at Fujisawa," which is the
   Tale's alliance-vs-vengeance texture.
2. Reputation (Na) is **public** standing: townsfolk, employers, magistrates. Den
   standing is **underworld** standing, and the two often move in opposite
   directions (a den brawl can win face on the mat and lose it in the street). Folding
   them together would make every Tale 4 choice leak into Reputation-gated
   endings across the whole game.
3. It needs no new track type. It reuses `counters` / `counter_inc` /
   `counters_min` from `04` §3.2, with a station placeholder (`04` §3.3).

**State.** `den_standing.<station>`, an integer clamped to **−2…+2**, starting 0,
tracked for every Tale (cheap) but only gating Tale 4 content.

| Standing | Name | Effect at that den |
|---|---|---|
| −2 | Feud | Entering spawns an enforcer confrontation; no play |
| −1 | Cold | Honest play only (like a marked den) |
| 0 | Unknown | Normal den |
| +1 | Known | Tale 4: *Deal a night*; the *sakazuki* offer can fire |
| +2 | **Allied** | Sworn den: shelter in Act 3 sweeps, rumor info, counts toward `dens_allied` |

**Changes** (to this den unless stated):

| Action | Δ standing | Also |
|---|---|---|
| *Show your scar* chain success (Tale 4) | +1 | |
| Accuse the dealer, success | +1 | +5B |
| *Sakazuki* sake-cup oath (Tale 4, needs +1) | +1 | flag `oath.<station>` |
| Break the planted die (mastery 4) | +1 | +3B |
| Make amends at a marked den (pay 5B) | +1 (max 0) | clears mark |
| Deal a night | 0 | +4B |
| Watch the wrist, success | −1 | heat +1, marked |
| Sleeve the die, success | −1 | heat +2, marked, Gi/Aku −1 |
| Sleeve the die, caught | −2 | heat +1 |
| Den brawl (combat vs enforcers) | −2 | Suspicion +1 (witnesses) |
| Watch or sleeve at an **allied** den | set to −2 | flag `oath_broken` (Koharu's people hear) |
| **Finger forfeit** (once per run, 03 §4) | +1 at every den currently ≥ 0; every Feud (−2) → −1 | `stat_delta` Waza −1, flag `paid_in_flesh` |

**Roll-up** (engine-maintained counters, recomputed on every change):

```
dens_allied  = count of stations with den_standing ≥ +2
dens_feuding = count of stations with den_standing ≤ −2
```

Pacing check: allied takes two gains at one den, typically *show your scar* on
one visit and *sakazuki* on the next, so 5 allied dens is ~10 den interactions.
A Tale 4 run draws ~10–12 den events across ~35–40 events, so ***The Cup Passes***
(`counters_min: { dens_allied: 5 }`) is achievable but needs you to commit. The
finger forfeit (+1 to every friendly den at once) is the shortcut, at a
permanent Waza cost. The secret variant *"the oyabun who paid in flesh"* adds
flag `paid_in_flesh`. `dens_allied` replaces the employer-contract counter that
other Tales use.

**Interaction with Reputation.** None automatic, in either direction. Individual
events may touch both, e.g. a public den brawl is standing −2 here *and*
Reputation −1. Endings that want both say so explicitly (*Ninkyō* can gate on
Reputation and `dens_allied` together).

**Interaction with Suspicion (the Act 3 story).** The network is both a risk and
a shelter when the Keian sweeps hit the margins (03 §4, `01` §B7):
- At the start of Act 3, if `dens_allied` ≥ 3: Suspicion +1. The okappiki are
  ex-criminals and know who drinks with which oyabun.
- `den_heat` ≥ 4: Suspicion +1, once per act (§9.2).
- In sweep events, each allied den on your route offers a *go to ground* choice.
  Each one lowers the sweep capture check's DC by 1 (max −3).
- In the Shinagawa finale, each allied den sends men: +1 combat Power per allied
  den (max +3). `dens_feuding` ≥ 2 spawns Denpachi's informer as an extra
  sweep hazard.

So a big network raises your Suspicion and also gives you the means to survive
it. A lone-wolf run stays quieter but has nowhere to hide. Both are valid
Tale 4 routes, per pillar 4.

## 10. Endings

LiA-style epilogue endings, but with **visible trajectory**: the status screen always
shows current "ending candidates" as rumor lines ("people are starting to call you
'sword-for-hire'…") so hidden gates (LiA flaw #2) never blindside the player. Final
requirements are still not fully spelled out — but the *direction* is always legible.

- Each Tale: 4–6 major endings × good/neutral/dark variants ≈ 8–12 epilogues.
- Shared "death endings" family: killed in duel, executed (by crime type), starved, drowned at the ford, died in the great fire, died of wounds/illness, despair (Resolve 0).
- Keian convergence (Act 3): every run witnesses the uprising's collapse from wherever the character stands — join, inform, fight it, protect civilians, or read about it from a prison cell. See `03-story-and-content.md` for the full ending compendium (~50 endings total at full content).
- Ending screen shows: epilogue text, a "historical note" (real facts behind this ending — pillar #1), title earned, omoide payout, and a stamp in the **ending gallery** (collection meta).

## 11. Meta-progression (between runs)

- **Omoide (memories):** earned by run length + endings + first-discoveries. Spend on: new Tales, new traits, codex unlocks, starting-item vouchers, **and** quality-of-life (event log, odds display history). No pay-to-anything; no ads (open question if you ever want monetization).
- **Codex:** every event resolved adds a period-accurate lore card (sekisho, chō-han, sankin-kōtai…). Collection layer for history nerds; also functions as the game's teaching tool.
- **Ending gallery** with silhouettes for undiscovered endings.
- **Daily seed:** one fixed-seed run per day for all players, shareable results (cheap community feature, pure client-side RNG).

## 12. UI / UX

Single-column, thumb-friendly layout (LiA-style):

```
┌─────────────────────────────┐
│ 浮 THE FLOATING ROAD   ☰ ✦32 │  header: menu, omoide
├─────────────────────────────┤
│ [event illustration / ink   │  optional art slot
│  vignette / season banner]  │
├─────────────────────────────┤
│ EVENT TEXT (scrollable)     │
│                             │
│ ▸ Choice A        [Me] 72%  │  choices w/ odds
│ ▸ Choice B        [Kuchi] 45%│
│ ▸ Choice C  (requires item) │  locked = greyed + hint
├─────────────────────────────┤
│ 体12/20 ♥ 心7/10  銭 340mon │  vitals bar
│ ⚔ fine katana (88%)  suspicion ▮▮▯▯▯ │
└─────────────────────────────┘
```

- Typography-first aesthetic: vertical accent line, mincho/serif JP-friendly font stack, sumi (ink) black on washi off-white, single vermillion accent color.
- Full keyboard nav (1–4 for choices), adjustable font size, colorblind-safe odds display (number always shown, color redundant).
- Combat card: two stat blocks + the chō-han cup as an actual 2-die animation (CSS sprites, no heavy assets).
- Every screen works at 360px width and at desktop widths (max 720px column).

## 13. Art & audio direction

- **Art plan (confirmed 2026-09-20): MVP ships with ink-wash vignettes** — one per
  event category/location pool (road, village, post-town, river-ford, mountain-pass,
  checkpoint, night, city-Edo, city-Osaka, city-Kyoto, temple, den) ≈ 12–15 images,
  plus a title-screen banner. Sumi-e brush style, monochrome with the single
  vermillion accent; rendered in the event-header art slot of the UI (§12).
  No per-event illustrations (LiA's pixel-art volume is out of scope).
- Optional framing art on menus only: public-domain ukiyo-e (Hiroshige's Tōkaidō
  prints — 1830s, so flagged in the codex as later-period evocation, not accurate
  depiction). Use sparingly and only if it doesn't clash with the ink-vignette style.
- **Language (confirmed):** English only for now. All player-facing text behind
  string keys so a Japanese pass can be added later with zero engine changes;
  Japanese terms glossed once per run and always defined in the codex.
- **Audio (post-MVP, optional):** shakuhachi/koto ambient loops per location type,
  dice-clack and blade SFX; all procedurally-triggered, small files.

## 14. Difficulty & accessibility

- Two modes at creation: **Wayfarer** (standard) and **Gekokujo** (hard: DCs +1, odds not shown as numbers, Resolve drains faster) — hard mode gates a cosmetic title, nothing else.
- Save anywhere (auto-save after every choice; LiA hid this — we surface it).
- No timers on choices. Full text log. Dyslexia-friendly font toggle.

## 15. Balance targets

| Metric | Target |
|---|---|
| Run length | 30–45 events, 20–40 min |
| First-run survival to ending | ~40% (death/despair should teach, not frustrate) |
| Check pass rates | average realized ~55–65% for well-built characters, measured on checks matching the character's invested stats (off-build checks are expected to run lower — that's the cost of specialization, per pillar #4) |
| Combat win% accuracy | displayed odds within ±5% of realized |
| Endings discovered after 10 runs (avg player) | 30–40% of gallery |
| Events per run never repeated | guaranteed (bag system) |

Balance is validated by an **auto-play simulation harness** (see tech doc §5): 10k
headless runs per content drop, reporting death causes, check pass rates, money curves,
ending distribution.

## 16. Scope & content plan

**Vertical slice (pre-MVP checkpoint):** one Tale, Act 1 only (~20–25 events, no full
chain-climax requirement), no commissioned art (placeholder/none), 3–4 endings.
Purpose: validate the check formula (§6) and combat formula (§7) against the
balance-sim harness (§15) with real numbers before committing to authoring the full
MVP content below. Doesn't change the MVP target — it just inserts a cheaper
checkpoint before the expensive part.

**MVP (first playable):** Tales 1–2 (rōnin, peasant), Act 1–3 skeleton, 60 generic events + 24 chain events, combat + chō-han, 2 shops, 12 endings, omoide + traits meta, codex v1, ink-vignette art set (~12–15 category images + title banner).
**V1.0:** Tales 3–4, 120+ generic events, prison chain, gambling den mini-system, debt system, 30+ endings, daily seed.
**V1.x:** Tale 5 (pilgrim), Tale 6 (hidden cross), Osaka/Kyoto city pools, disaster set pieces, audio, illustrations.

## 17. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Historical sensitivity (execution, class oppression, eta/hinin outcast groups, persecution) | Treat with documentary restraint: never graphic, never comedic; codex notes give real historical context; outcast characters written as full humans; review pass with a sensitivity checklist before release (checklist: `03` §9.1; run once on the vertical slice, see `08-sensitivity-review.md`) |
| Text volume is the whole game (content treadmill) | Data-driven event format + tag reuse; each event authored once, appears in many runs; expansion model ("Tales") matches LiA's proven content strategy |
| Check-fatigue (every choice a dice roll) | ~40% of choices are ungated consequence choices; gating concentrated at climaxes |
| Repetition within a run (LiA's #1 complaint) | Bag system + large pool + per-Tale event subsets + season variation text |
| Scope creep toward visual novel | Hard rule: no event >300 words, no branching inside branching; chains are linear-with-variants |
| Cross-run event repetition (the no-repeat bag in §8 resets *per run*, so back-to-back restarts can plausibly draw a similar opening sequence) | Known, deliberately deferred limitation for MVP; V1.x: track cross-run recency for at least the opening event |

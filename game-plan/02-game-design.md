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

- **DC scale:** trivial 2, easy 4, moderate 6, hard 8, brutal 10+. Act 1 rarely exceeds DC 6; Act 3 climax checks run DC 8–10.
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

- **Income sources:** procession day-labor (safe, low), bodyguard contracts, bounty-hunting (capture-not-kill pays more), peddling goods between stations (buy low/sell high mini-loop with 3 goods), gambling, sumo exhibition bouts, temple copying work (Chi), performing (Kuchi/Waza), night soil collection (yes, a real Edo job — humbling, pays, costs Resolve the first time), escorting pilgrims.
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
| Peddling loop (buy low/sell high) | 20–80 mon profit/loop | can lose money if prices move against you |
| Escorting pilgrims | 80–150 mon/event | especially available to Tale 5 |
| Sumo exhibition bout | 100–250 mon/win | non-lethal combat variant payout |
| Bodyguard contract | 150–300 mon/event | higher risk than day-labor, by design |
| Bounty-hunting (capture-not-kill) | 200–500 mon, up to ~1 ryō for named targets | "pays more," per above |
| Gambling (chō-han / dice den) | stake-based, roughly ±100–500 mon swings | zero-EV by design (§7.1) |

For reference: a bowl of noodles runs ~16–20 mon, a cheap inn room ~100–200
mon/night, a kago (palanquin) ride ~1+ ryō/day, a decent katana 1–3 ryō, and a
meibutsu masterwork blade 10+ ryō. So a day of honest low-tier labor covers a
meal and maybe a room; a serviceable sword is a multi-event savings goal; a
masterwork blade is an endgame-scale purchase.

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

Balance is validated by an **auto-play simulation harness** (see tech doc §6): 10k
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
| Historical sensitivity (execution, class oppression, eta/hinin outcast groups, persecution) | Treat with documentary restraint: never graphic, never comedic; codex notes give real historical context; outcast characters written as full humans; review pass with sensitivity checklist before release |
| Text volume is the whole game (content treadmill) | Data-driven event format + tag reuse; each event authored once, appears in many runs; expansion model ("Tales") matches LiA's proven content strategy |
| Check-fatigue (every choice a dice roll) | ~40% of choices are ungated consequence choices; gating concentrated at climaxes |
| Repetition within a run (LiA's #1 complaint) | Bag system + large pool + per-Tale event subsets + season variation text |
| Scope creep toward visual novel | Hard rule: no event >300 words, no branching inside branching; chains are linear-with-variants |
| Cross-run event repetition (the no-repeat bag in §8 resets *per run*, so back-to-back restarts can plausibly draw a similar opening sequence) | Known, deliberately deferred limitation for MVP; V1.x: track cross-run recency for at least the opening event |

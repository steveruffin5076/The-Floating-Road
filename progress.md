# Progress Log — The Floating Road

Running status of the project. Design docs live in `game-plan/`; this file
tracks *what's actually been done* and what's next, so it doesn't require
re-reading the whole conversation history to pick back up.

**Handoff note (2026-09-25):** this project is being handed to a different AI
(Cursor) to continue development. Everything below is current as of commit
`076b120` on branch `claude/loving-bell-1rljfj` (PR #1, not yet merged), with
a clean working tree, 115/115 tests passing and a clean `npm run build`.

## Start here

```
npm install
npm run dev          # play it in the browser (Vite dev server)
npm test             # vitest — 115 tests, must stay green
npm run typecheck     # tsc --noEmit
npm run build         # tsc --noEmit && vite build
npm run sim           # bot-driven simulation, 10k runs x 4 policies, see below
npm run sim -- --runs 2000   # fewer runs, faster iteration
```

`npm run sim` is the main tuning tool: it plays the whole game with four bot
policies (random / first-timer / careful-fighter / careful-talker) and prints
ending distribution, check pass rates, combat accuracy, and Resolve/Health/
Suspicion drains per event and per act. Re-run it after any content change
that touches odds, costs, or ending requirements — `src/sim/harness.test.ts`
has guard-rail tests that fail if survival swings too far either way.

**Read `game-plan/` in this order** to understand the design before changing
it: `02-game-design.md` (mechanics), `03-story-and-content.md` (Tale 1's
story bible — premise, cast, beat list, sensitivity checklist), `04-technical-plan.md`
(the content schema — what a `StoryEvent`/`CombatEvent`/`EndingSpec` JSON-ish
object supports), `11-tale1-chain-spec.md` (the authoritative spec for every
chain event and ending Tale 1 actually has), `12-act1-balance-report.md`
(sim numbers and tuning history — has the most recent results and the open
tuning task, see "Known issues" below).

## Current status (2026-09-24)

**Phase:** Vertical slice — Tale 1 is fully playable end to end (all three
acts, 12 endings), design is stable, balance tuning is the open work.

- **Design:** Full GDD (`game-plan/02-game-design.md`) reviewed and revised.
  Core formulas (skill checks, combat, leveling cadence) validated against a
  standalone simulator before any content was written against them.
- **Code:** A playable TypeScript/Vite prototype exists at the repo root
  (`src/`) — one Tale (rōnin), all three acts, 12 endings plus death. Runs with
  `npm install && npm run dev`.
- **Repo:** Initialized and pushed to
  [github.com/steveruffin5076/The-Floating-Road](https://github.com/steveruffin5076/The-Floating-Road).
  Current work is on branch `claude/loving-bell-1rljfj`, open as
  [PR #1](https://github.com/steveruffin5076/The-Floating-Road/pull/1)
  against `main`, not yet merged.

## Code map

```
src/engine/       Pure game logic, no DOM. This is the source of truth for
                   rules; main.ts and the sim harness are both thin clients
                   of it.
  types.ts          All shared types: RunState, StoryEvent/CombatEvent,
                    Choice, Outcome, Requirement, EndingSpec, ActSpec,
                    InjectSpec (chain-event scheduling).
  state.ts          createInitialState, applyEffects (outcome -> state).
  requirements.ts   meetsRequirement, visibleChoices/availableChoices.
  director.ts       Act director: what event/ending comes next (chain
                    injections vs random draw vs act transition).
  eventDirector.ts  The no-repeat weighted random bag for each act's pool.
  endings.ts        forcedEnding / evaluateEnding (ending selection).
  checkResolver.ts  Skill check formula (with pity/auto-success).
  combatResolver.ts Combat formula, chō-han bet, stances.
  runner.ts         Glue: resolveChoice/resolveFight/afterOutcome/rest/
                    levelUp — the actual game loop, shared by main.ts (UI)
                    and src/sim (bots). Changing game flow goes here.
  save.ts           localStorage save/load, versioned with migrations.

src/content/      All Tale 1 game data (events, endings, stats).
  tale.ts           STARTING_STATS, TRAITS, ACTS (act lengths/transitions).
  index.ts          ALL_EVENTS — the single list every entry point imports.
  events.act{1,2,3}.ts   Random-pool story/combat events per act.
  chain.tale1.act{1,2,3}.ts   Scripted "chain" events (Tale 1's actual
                    plot beats — the watch-list, Yui's school, Katsuragi,
                    the Sagawa sweep, etc.), injected at specific slots.
  endings.ts        The 12 Tale 1 endings + the shared `death` ending.
  validate.ts       Content authoring-rule checker (word caps, DC ranges,
                    ungated-choice share, flag/counter/item ledger, act/
                    injection consistency). Run via its test file.
  validate.test.ts  Runs validate.ts over the real content — must pass.

src/sim/          Bot-driven simulation harness for balance tuning.
  harness.ts        Policies (random/first-timer/careful-fighter/
                    careful-talker), playRun, report().
  run.ts            npm run sim entry point.
  harness.test.ts   Guard-rail tests (careful play should mostly survive,
                    random play mostly shouldn't).

src/main.ts       Browser UI only — renders screens, wires DOM events to
                   the runner. Should stay thin; game logic doesn't belong
                   here.
```

## Working conventions this project has been following

- **Formulas before content.** Any new mechanic gets validated in isolation
  (or via `npm run sim`) before content is written against it.
- **`npm run sim` after every content change** that touches costs, odds, or
  ending requirements. The guard-rail tests in `harness.test.ts` will fail
  if it regresses badly, but the full report is worth reading, not just the
  pass/fail.
- **`src/content/validate.ts` is the style/consistency contract.** New
  events must pass it (word caps, DC-per-act ranges, no unreachable
  flags/counters, no all-gated choice lists, etc.) — see
  `validate.test.ts` for how it's invoked.
- **Sensitivity checklist** (`03-story-and-content.md` §9.1) gets applied to
  every new beat involving violence, class, gender, or historical atrocity —
  see `08-sensitivity-review.md` for the pass history and the existing
  fixes' rationale.
- **Historical grounding via codex comments.** Content files have `// codex:`
  comments above events citing `01-research.md` sections; anything not yet
  confirmed is flagged "verify" inline (see "Known issues" below for the
  current list).

## Completed

1. **Design docs** (`game-plan/01` through `04`) — research, full GDD, story/
   content plan, technical plan. Written before this log started.
2. **Design review** (`game-plan/05-design-review.md`) — critique of the GDD's
   mechanics/balance/progression against the *Life In Adventure* flaws it set
   out to fix. Found: missing leveling cadence, a clamp-ceiling edge case that
   partially reproduced one of the flaws it claimed to fix, a too-weak
   bad-luck-protection rule, an uncapped debt spiral, and a hidden-Suspicion
   opacity gap. All findings folded into `02-game-design.md` directly (§4.3,
   §5, §6, §7.1, §9, §16, §17).
3. **Balance-sim validation** (`sim/balance-sim.mjs`, `game-plan/06-balance-sim-report.md`)
   — standalone, dependency-free simulator that re-implements the check and
   combat formulas in isolation (no engine/content needed yet) to check the
   §15 balance targets before content gets written. Result: formulas and
   leveling cadence hit the target when measured on checks matching a
   character's build; surfaced that §15's target wording was ambiguous
   (fixed) and that naive combat-number scaling could accidentally make Act 1
   harder than Act 3 (flagged for when real item/enemy numbers are set).
4. **Vertical slice** (`src/`) — TypeScript/Vite scaffold implementing the
   validated formulas for real: seeded RNG, check resolver (with
   auto-success and scaling pity), combat resolver (chō-han bet + stances),
   a no-repeat weighted event bag, leveling, a guaranteed free rest option,
   and 4 endings (death/despair/arrested/reached-Edo). Playtested end-to-end
   in-browser, no console errors.
5. **Content expansion** — Act 1 event pool grown from 7 to 19 events (1
   intro + 18 in the bag), adding check coverage for Chi and Tan (previously
   untested stats) and a second combat encounter (night tsujigiri). Run
   length target raised from 9 to 13 events to match GDD §3's "Act 1 ≈12-15
   events" now that the pool supports it.
6. **Git** — repo initialized, `.gitignore` added, pushed as the initial
   commit to the GitHub remote above.
7. **Save/resume** (`src/engine/save.ts`) — single localStorage slot,
   checkpointed on every screen transition (including mid-combat, between
   the chō-han bet and the stance choice), closing the GDD §14 "save
   anywhere" gap. Title screen offers "Continue Your Journey" when a save
   exists; starting a fresh run after an ending clears it. A save
   referencing content that no longer exists (stale build) falls back to
   the title screen instead of crashing. Verified end-to-end in a real
   browser: reload mid-event, reload mid-combat, and reload after an
   ending all resume correctly; starting a new run clears the old save.
8. **Real combat numbers** (`src/content/events.act1.ts`, `src/engine/state.ts`)
   — replaced the sim's placeholder foe power (10/12) with values calibrated
   against this slice's actual starting loadout (weaponTier 1, armor 0) and
   stat ranges (Chikara+Waza 8-12 across builds/level-ups): Bandit rōnin
   power 8, Night tsujigiri attacker power 9. Verified against the real
   `combatResolver` formula across 200k simulated fights per case (see
   `game-plan/06-balance-sim-report.md`'s follow-up note): base win% now
   runs ~44-68% for the first fight and ~38-62% for the second depending on
   combat investment, replacing the ~32% average the balance-sim report
   flagged as backwards (Act 1 harder than Act 2/3). Starting loadout
   (serviceable katana, travel clothes) documented as an intentional choice
   rather than an unexamined placeholder, since this slice has no
   shop/equip system to change it mid-run yet.
9. **Content & technical design review** (`game-plan/07-design-review-content-and-technical.md`)
   — reviewed `03` and `04` the way `05` reviewed `02`, and applied the
   findings: per-choice requirements, `stat_delta`, counters, a
   compound-check pattern and an ending schema sketch in `04` §3; `04`'s
   roadmap resized to match what was built; Gi/Aku notation and a
   Suspicion-threshold mismatch fixed in `03`.
10. **Sensitivity checklist & pass** (`03` §9.1, `game-plan/08-sensitivity-review.md`)
    — checklist drafted and run over the slice; the must-fix
    (`kirisute_tension` misstated kirisute-gomen) and all 11 should-fixes
    applied to `src/content/`.
11. **Gambling den, peddling, den-network formulas** (`02` §9.2–9.4, `04` §3.3)
    — the three systems `03` relied on but nobody had specified. Numbers
    hand-derived in `02` and confirmed by a 1M-trial Monte Carlo.
12. **Act 1 pool to 24** — five new story events drawn from `03` §6's bank
    (`lodging_seized`, `five_households`, `widows_teahouse`,
    `polishers_bench`, `porter_in_the_current`), written against the
    checklist. Stat-check coverage went from 3/2/3/2/2/2 to 3/3/3/4/4/4
    (chikara/waza/chi/kuchi/me/tan). `widows_teahouse` is the slice's first
    woman character and first way to lower Suspicion (100 mon for −1).

13. **Decisions: Tale 1 gender and Tale 3 debt.** Proposals in
    `game-plan/10-tale1-gender-options.md` and `09-tale3-debt-options.md`.
    Chosen: Tale 1 fixed male and Tale 5 fixed female, other Tales choose
    (Option A); Tale 3 keeps 100 ryō and repays through leverage, not money
    (Option B: 1 point freezes interest, 2 tear up the note for a 1-ryō face
    payment). Applied to `02` §4.1/§9, `03` §4/§9.1, `04` §3; two shared lines
    in `src/content/` neutralized.
14. **Research gaps filled** in `01` (rōnin vs kirisute-gomen, *Go Rin no Sho*,
    barrier-breaking, Ōi porters, gonin-gumi, polishing), all verify-flagged;
    also fixed `01`/`03`'s reversed *iri-deppō ni de-onna* rule.
15. **Tale 1 chain spec** (`game-plan/11-tale1-chain-spec.md`): 14 chain events
    across three acts, a flag/counter ledger, all 12 endings wired to the
    `04` §3.2 schema with reachability notes, pacing for a ~38-event run, a
    sensitivity pre-check, and the engine gap list.

16. **Tests and content validator** — vitest suite (`npm test`) over every
    engine module, plus `src/content/validate.ts` enforcing the authoring
    rules. Mutation-checked: breaking the check formula or a content weight
    fails the suite. `npm run build` now type-checks with `--noEmit`, so tsc no
    longer writes stray `.js` into `src/`.
17. **Engine step 1: run state and requirements** — flags, counters and key
    items on `RunState`; event- and choice-level `requires` (with locked-hint
    display); effects for flags, counters, items and permanent stat changes;
    save format v2 with a v1 migration. Trait flags now apply at run start,
    and Silver Tongue's advertised downside (failed Kuchi bluffs cost +1
    Suspicion) finally works. First gated choice in content:
    `musashi_scroll`'s copyist note (needs Chi 4).

18. **Engine step 2: the act director** (`src/engine/director.ts`) — acts
    with their own length, random pool, level interval and ending or
    transition; chain events injected at a slot with window, priority,
    mandatory hold and lapse effects (`11` §1.1); `spawnEvents` for reactive
    events. Save format v3 migrates v1/v2. The slice is configured as one
    13-event act ending at `reached_edo` (`ACTS` in `tale.ts`), so play is
    unchanged; verified by three full browser runs plus a simulated run test.

19. **Engine step 3: endings, goto, combat from a choice** — endings are
    data (`forcedWhen` for death/despair/arrest, evaluated `requires` +
    `priority`, one fallback); outcomes can `goto` a node event without
    using a slot, and a combat node is how a choice starts a fight; check
    mods, `moneyMult`, `setTracks`, a combat win% mod, and the engine-kept
    `combat_wins` counter.
20. **Tale 1 Act 1 chain authored** (`src/content/chain.tale1.act1.ts`) —
    the Arai watch-list barrier, Men With No Banners, the claim at Fujieda,
    O-Ryō at Mariko, and Sahei near Sunpu (with the father's letter), plus
    their fight and follow-up nodes. Act 1 is now 14 events (11 §4.1), and
    carrying the letter to Edo gives a distinct ending (`reached_edo_letter`).
    Premise decided afterwards: Katsuragi's men killed the father (item 22).

21. **Sim harness and first Act 1 tuning** (`npm run sim`, `src/sim/`,
    `game-plan/12-act1-balance-report.md`) — the game's rules moved out of
    `main.ts` into `src/engine/runner.ts`, which the browser and the harness
    both use. Four bot policies × 10k runs report endings, check pass rates,
    combat accuracy, Suspicion and Resolve sources, and repeats. It found
    Resolve never mattered (no policy ever below 3); fixes: free rest gives
    no Resolve, two humiliation/witness choices cost −2, and Resolve starts
    at 7/10. Pass rates (55–60% on-build) and combat accuracy (±1.7) meet
    `02` §15. Guard-rail tests keep it honest.

22. **Decision: Katsuragi's men killed the father.** A licensed vendetta could
    only avenge a killing (`11` §5.1), so `03` §4's premise now says the
    father refused to sign the surrender and was cut down by Katsuragi's
    men, not the besiegers. Katsuragi still believes the trade saved 400
    households. Sahei's scenes in the Act 1 chain now say so outright.

23. **Act 2 and Act 3 random pools** (`src/content/events.act2.ts`, 10 Edo
    events; `events.act3.ts`, 6 Keian-summer events), written against the
    sensitivity checklist and the Resolve budget. Not playable until the
    Act 2–3 chains and endings exist, so `npm run sim -- --preview` plays all
    three acts to measure them, and the validator checks them in the test
    suite. Resolve lands at about −0.5 per event; the two later fights were
    recalibrated (foe power 14, 16); a duplicate bridge fight was moved. See
    the follow-up in `game-plan/12-act1-balance-report.md`.

24. **Tale 1 playable end to end.** Act 2 chain (C5–C11, the Gates of Edo
    and Shōgun-is-dead transitions), Act 3 chain (the Sagawa sweep, the three
    versions of the collapse, the Katsuragi hearing or blackmail, O-Ryō in
    autumn) and all 12 endings, wired as three acts (14 / 16 / 8). Engine: act
    watches (Suspicion 5 in Edo brings the constable, not a direct arrest),
    act-scoped requirements, run-ending "evaluate now" outcomes, epilogue
    variant lines ("where you stood" in September 1651). Act 2 and Act 3
    pools grown to 14 and 8. First full-game numbers and the next tuning
    pass are in `12`'s last follow-up: 73% first-timer survival (target ~40%)
    and a fallback ending far too common.

## Known issues (highest priority first)

1. **Balance is off — full-run survival is far above target.**
   `game-plan/12-act1-balance-report.md`'s last follow-up (run
   `npm run sim` to reproduce): a first-timer bot survives ~73% of full runs
   against `02-game-design.md` §15's ~40% target. The evaluated-ending
   fallback (`ronin_road_ends_here`, the "nothing else matched" ending) is
   taking 35–53% of runs against a design target of ~8%, meaning most named
   endings are too hard to reach. Two concrete levers proposed in `12`, not
   yet applied:
   - Loosen *A New Banner*'s Suspicion requirement from ≤1 to ≤2.
   - Add a distinct named ending for "survived by keeping your head down"
     runs, since the current fallback is absorbing that whole category.
   After changing requirements, re-run `npm run sim` and compare against the
   table in `12`'s last section.
2. **Several endings are effectively unreachable by the bot policies**
   (Informant, Lawful Vendetta, Garden Gate, First Blood, The Plow — each
   ≤1% in the last sim run). This may be a bot-realism limit rather than a
   design bug (a softmax bot won't deliberately pursue a specific ending),
   but it's worth writing a route-seeking policy per ending (a policy that
   always picks the choice matching that ending's flag/counter/stat
   requirements) to confirm each is actually reachable through legitimate
   play before assuming the numbers above are meaningful.
3. **`// verify` codex comments in Act 3 content need real citations** in
   `01-research.md` before they're load-bearing: sukedachi (seconds) in
   licensed vendettas, the Asakusa granary merchants, bathhouse specifics,
   tsukimi (moon-viewing) customs. Search `src/content/*.ts` for `verify` to
   find them all.
4. **Sensitivity follow-ups still open**: `08-sensitivity-review.md`'s notes
   N1–N7, and research gaps in `01` (rōnin vs kirisute-gomen distinction,
   *Go Rin no Sho* circulation, barrier-breaking penalty, Ōi porter-system
   date, gonin-gumi reporting duty, polishing as a specialist craft). Outcast
   groups (checklist §B) are still unexercised by any built content.
5. **Research gaps that block new authoring** (not blocking current
   content, but needed before writing more): a rōnin's vendetta-license
   mechanism in more depth, exactly where the Keian executions/display took
   place (`03` currently says Kodenmachō, which per `01` §B5 was actually
   the *prison*, not an execution ground — flagged, not yet resolved),
   recorded historical informants analogous to the Informant ending, and for
   a future Tale 3 the enforceability of illegal debts and debt bondage.
6. **Engine gap:** trajectory hints (`11-tale1-chain-spec.md` §6, item #13)
   are the one piece of the planned P1.5 engine not yet built. Everything
   else in that section is done.
7. **PR #1's title/description are stale** — they still describe the
   original save/resume feature, not the current Acts 2-3/endings work. Not
   urgent, but worth fixing before merge.

## Not started

- **Only one Tale (rōnin) exists.** The Event Director's Tale-tagging and
  requirements-engine behavior has never been tested with a second Tale's
  content coexisting with Tale 1's. `game-plan/03-story-and-content.md` has
  premises for Tales 2–6; none are authored. Tales 2–4 explicitly need a
  gender-premise audit (`03` §4 notes) before authoring starts, the way
  Tale 1's and Tale 3's decisions were made (`game-plan/09` and `10`).
- **No shop/equip system.** Starting loadout (weaponTier 1, armor 0) is
  fixed for the whole run; `progress.md` item 8 notes this was an
  intentional scope cut for the vertical slice, not an oversight.
- **No title/gallery/collection meta** beyond the single ending screen
  (`03-story-and-content.md` §8 describes an ink-stamp gallery of endings
  discovered — not built).

## Suggested next steps, in order

1. Apply the two balance levers in "Known issues" #1, re-run `npm run sim`,
   and update `12-act1-balance-report.md` with the new numbers (follow its
   existing format — before/after table, guidance for further tuning).
2. Write route-seeking sim policies (one per rarely-hit ending) to check
   reachability per "Known issues" #2, before spending more tuning effort
   chasing numbers that might already be correct.
3. Resolve the `// verify` citations in Act 3 content ("Known issues" #3),
   updating `01-research.md` and removing the flags once sourced.
4. Only after 1–3: consider starting Tale 2's authoring, using Tale 1's
   spec-then-content-then-sim workflow (`11-tale1-chain-spec.md` is the
   template to follow) and running the gender-premise audit first.

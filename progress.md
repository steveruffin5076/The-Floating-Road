# Progress Log — The Floating Road

Running status of the project. Design docs live in `game-plan/`; this file
tracks *what's actually been done* and what's next, so it doesn't require
re-reading the whole conversation history to pick back up.

## Current status (2026-09-24)

**Phase:** Vertical slice — playable prototype exists, design is stable.

- **Design:** Full GDD (`game-plan/02-game-design.md`) reviewed and revised.
  Core formulas (skill checks, combat, leveling cadence) validated against a
  standalone simulator before any content was written against them.
- **Code:** A playable TypeScript/Vite prototype exists at the repo root
  (`src/`) — one Tale (rōnin), Act 1 only, 24 events, 4 endings. Runs with
  `npm install && npm run dev`.
- **Repo:** Initialized and pushed to
  [github.com/steveruffin5076/The-Floating-Road](https://github.com/steveruffin5076/The-Floating-Road).

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

## Not done yet (known gaps)

- Only one Tale (rōnin) exists — the Event Director's Tale-tagging/
  requirements-engine behavior is untested with more than one Tale.
- No automated tests yet (unit tests for checkResolver/combatResolver, a
  content schema validator) — `04-technical-plan.md` §5 calls for these.
- Sensitivity follow-ups: `08`'s notes N1–N7 and research gaps in `01`
  (rōnin vs kirisute-gomen, *Go Rin no Sho* circulation, barrier-breaking
  penalty, Ōi porter-system date, gonin-gumi reporting duty, polishing as a
  specialist craft). Outcast groups (checklist §B) and Tale 6 are still
  unexercised by any built content.
- Engine for P1.5 (`11` §6) is complete except trajectory hints (#13).
- Acts 2–3 must be much deadlier per event than Act 1 to reach `02` §15's
  ~40% full-run survival (Act 1 alone keeps ~93% of first-timers). See
  `12-act1-balance-report.md` for the Resolve-per-event guidance.
- Act 2/3 random pools (10 and 6 events) roughly match `11` §4.1's draws once the chains are in (~9–11 and ~4–6), with little slack; grow them if the chains land short.
- Research still owed to `01` before authoring: a rōnin's vendetta-license
  mechanism, where the Keian executions/display took place (`03` says
  Kodenmachō, which was the prison), recorded informants, and for Tale 3 the
  enforceability of illegal debts and debt bondage.
- Tales 2–4 need a gender premise audit before authoring (`03` §4 notes).

## Suggested next steps (not started)

See the latest suggestions in the conversation; the engine now supports
the full Tale 1 chain, so remaining work is content (Act 2/3 pools and
chain events) plus a proper sim harness for tuning.

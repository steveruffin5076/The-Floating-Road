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
- **Tale 3's debt is out of scale** (`02` §9.3 flag): 100 ryō = 100,000 mon,
  +25,000 mon per tick, against honest income of ≤ 500 mon/event. Needs a
  decision before Tale 3 is authored.
- Tale 1 gender: `01` says a female rōnin doesn't fit the era; `02` §4.1 says
  gender is freely chosen (`08` N4). Needs a decision before a gender picker.
- The built engine doesn't implement `04`'s newer schema pieces (per-choice
  requires, counters, `stat_delta`, endings.json); they're needed for P1.5.

## Suggested next steps (not started)

Roughly in order of leverage: the schema validator + unit tests (`04` §5),
then P1.5 (Tale 1's full chain, per `04` §6). Decide the Tale 3 debt scale
and Tale 1 gender question before content for those lands.

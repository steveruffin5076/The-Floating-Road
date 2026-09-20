# Progress Log — The Floating Road

Running status of the project. Design docs live in `game-plan/`; this file
tracks *what's actually been done* and what's next, so it doesn't require
re-reading the whole conversation history to pick back up.

## Current status (2026-09-20)

**Phase:** Vertical slice — playable prototype exists, design is stable.

- **Design:** Full GDD (`game-plan/02-game-design.md`) reviewed and revised.
  Core formulas (skill checks, combat, leveling cadence) validated against a
  standalone simulator before any content was written against them.
- **Code:** A playable TypeScript/Vite prototype exists at the repo root
  (`src/`) — one Tale (rōnin), Act 1 only, 19 events, 4 endings. Runs with
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

## Not done yet (known gaps)

- No save/resume (localStorage) — GDD §14 calls for "save anywhere"; the
  slice currently loses all progress on refresh.
- Combat numbers (weapon tier / armor / foe power) are still the sim's
  placeholder values, not real balanced numbers.
- Only one Tale (rōnin) exists — the Event Director's Tale-tagging/
  requirements-engine behavior is untested with more than one Tale.
- No automated tests yet (unit tests for checkResolver/combatResolver, a
  content schema validator) — `04-technical-plan.md` §5 calls for these.
- `03-story-and-content.md` and `04-technical-plan.md` haven't had a design
  review pass (only `02-game-design.md` has).
- No historical-sensitivity review pass yet (flagged as a pre-release risk
  in GDD §17, not urgent but cheap to do early).
- Vertical slice is still short of its own ~20-25 event target from GDD §16
  (currently 19 including the intro).

## Suggested next steps (not started)

Roughly in order of leverage: add save/resume, pin real combat numbers,
add a second Tale, add basic tests, review the remaining docs, do the
sensitivity pass. See conversation history or ask for a fresh prioritized
list — priorities may shift once there's more playtesting.

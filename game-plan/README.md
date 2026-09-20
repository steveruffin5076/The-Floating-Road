# THE FLOATING ROAD (working title)
### A text-based roguelike adventure in early Edo Japan — inspired by *Life In Adventure* (Studio Wheel)

**Status:** Vertical slice in progress. Design is stable (GDD + balance-sim validated);
a playable Act-1, one-Tale prototype exists at the repo root (`src/`, run with `npm run dev`).
**Last updated:** 2026-09-20

---

## What this is

A browser-based, strictly-historical text adventure in the style of *Life In Adventure*:
you create a character, walk a randomly-generated journey through early Edo Japan
(1648–1651), survive skill-checked events and auto-resolved combat, and reach one of
many endings. When you die, you restart — wiser, with unlocked content.

**The pitch:** *Sekigahara and Osaka are over. The swords are sheathed, the roads are
policed, and tens of thousands of samurai have no master. You are one person on the
Tōkaidō in the last years before the Keian plot shakes the shogunate. Make a name —
or make a grave.*

## Documents

| File | Contents |
|---|---|
| [01-research.md](01-research.md) | Reference-game teardown (mechanics, strengths, documented flaws) + historical research brief for 1600–1651 Japan |
| [02-game-design.md](02-game-design.md) | Full Game Design Document: pillars, stats, checks, combat, event director, economy, run structure, endings, meta-progression, UI/UX, art direction |
| [03-story-and-content.md](03-story-and-content.md) | Storyline: world timeline, 5 origin questlines with branching endings, recurring NPCs, historical cameos, event content bank, fully-written sample events, ending compendium |
| [04-technical-plan.md](04-technical-plan.md) | Recommended stack, architecture, event data schema, save/RNG/balance-simulation plan, roadmap (planning only — not started) |
| [05-design-review.md](05-design-review.md) | Game-design critique of the GDD's mechanics/balance/progression, with concrete fixes (now folded into 02) |
| [06-balance-sim-report.md](06-balance-sim-report.md) | Standalone formula validation (check/combat math + leveling cadence) ahead of real content — see `sim/` |

## Code

- `sim/balance-sim.mjs` — standalone formula validator (no engine/content dependency), see 06 above.
- `src/` — the vertical-slice prototype: Act 1 only, Tale 1 ("The Masterless Blade") only, 7 events + 1 combat encounter, 4 endings. Run with `npm install && npm run dev`. Not the MVP — a cheap checkpoint to playtest the check/combat formulas before committing to full content authoring (GDD §16).

## Key decisions already made (by you)

1. **Reference structure:** *Life In Adventure* (Studio Wheel) — roguelike runs, random events, dice checks, auto-battles, die-and-restart, many endings.
2. **Era:** Early Edo period. Design doc pins runs to **1648–1651**, climaxing in the historical **Keian Uprising (1651)** for qualifying characters.
3. **Tone:** Strictly historical. No magic, no yokai. Drama comes from class, debt, honor, hunger, law, and luck.
4. **Platform:** Web (HTML/JS), playable in a browser, mobile-friendly.

## Decisions confirmed (2026-09-20)

- **Title:** **The Floating Road**
- **Language:** English only for now (string keys stay i18n-ready so Japanese can be added later without rework)
- **Illustrations:** MVP + one ink-wash vignette per event category (~12–15 images); no per-event art
- **Run length:** 20–40 min, ~30–45 events per run (as designed in the GDD)

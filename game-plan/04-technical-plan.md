# 04 — Technical Plan (planning only — development not started)

## 1. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Language | **TypeScript** (strict) | Event/state complexity is the whole game; types catch content bugs |
| Build | **Vite** | Instant dev server, trivial static deploy |
| UI | **Vanilla DOM or Preact + lit-html-style templates** | No framework weight needed; text + buttons + a few animated states. (Alternative: Svelte if you prefer components — equally valid) |
| Styling | CSS custom properties, no framework | Typography-driven aesthetic; theme = washi/sumi/vermillion tokens |
| Content data | **JSON event files** (authored in Markdown→JSON via small compiler script, or directly JSON/YAML) | Data-driven: adding events never touches engine code |
| State | Single immutable `RunState` object + reducer | Trivial undo/save/simulate |
| RNG | Seeded (mulberry32/xorshift) with per-run seed | Daily seeds, reproducible bug reports, simulation harness |
| Save | `localStorage` (autosave after every choice, single slot + "continue run" list) | No backend needed for MVP |
| Deploy | Static hosting (GitHub Pages / Cloudflare Pages / Netlify) | It's a static site |
| Backend (optional, later) | None needed; leaderboards/dailies could use a tiny KV endpoint later | Keep zero-infra as long as possible |

## 2. Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        GAME SHELL (UI)                     │
│  title / creation / event screen / combat card / epilogue  │
└──────────────▲───────────────────────────────▲─────────────┘
               │ renders RunState              │ dispatches PlayerChoice
┌──────────────┴───────────────────────────────┴─────────────┐
│                          ENGINE                            │
│  RunReducer  ── pure f(state, action) → state              │
│  ├─ CheckResolver      (odds formula, pity counter)        │
│  ├─ CombatResolver     (power calc, chō-han, stance)       │
│  ├─ EventDirector      (act pacing, weighted bags, season) │
│  ├─ QuestTracker       (Tale chain injection, flags, gates)│
│  ├─ Economy/Inventory  (shops, condition decay, debt tick) │
│  └─ MetaBank           (omoide, unlocks, gallery, codex)   │
└──────────────▲─────────────────────────────────────────────┘
               │ loads
┌──────────────┴─────────────────────────────────────────────┐
│                     CONTENT (data only)                    │
│  events/*.json   tales/*.json   items.json   enemies.json  │
│  endings.json    codex.json    strings/en.json (+ ja later)│
└────────────────────────────────────────────────────────────┘
```

Hard rule: **engine contains zero story strings**; content contains zero logic
beyond declarative requirements/effects. This is what makes the content treadmill
survivable (LiA's pool stayed small partly because events were code-coupled).

## 3. Event data schema (sketch — final shape settled in prototype)

```jsonc
{
  "id": "checkpoint_hakone_papers",
  "pool": "checkpoint",            // road | village | post-town | river-ford | mountain-pass | checkpoint | night | city-edo | city-osaka | city-kyoto | temple
  "acts": [1, 2],
  "weight": 6,                     // draw weight within pool+act
  "unique": true,                  // once per run?
  "season": ["spring","autumn"],   // optional season filter
  "requires": {                    // ALL must pass for the event to be drawable
    "tales": ["*"],                // or ["ronin","peasant"]
    "flags_not": ["arrested_once"],
    "min_suspicion": 0,
    "items_any": ["permit_weak","permit_good"],
    "stats": {}
  },
  "title": "The Barrier at Hakone",
  "body_key": "checkpoint_hakone_papers.body",   // string key → strings/en.json
  "choices": [
    {
      "text_key": "…honest",
      "check": null,                              // ungated choice
      "outcomes": [
        { "if": { "items_any": ["permit_good"] }, "result_key": "…pass", "effects": [] },
        { "else": true, "goto": "checkpoint_hakone_papers.weak_papers" }
      ]
    },
    {
      "text_key": "…talk",
      "check": { "stat": "kuchi", "dc": 5, "mods": [ {"if_flag":"river_fool","pct":-5} ] },
      "on_success": { "result_key": "…pass_bluff", "effects": [ {"set_flag":"guard_face_remembered","pct":20} ] },
      "on_failure": { "goto": "arrest_chain.intro", "effects": [ {"suspicion":2}, {"money_mult":0.5} ] }
    }
  ],
  "codex_on_resolve": ["sekisho", "tegata"]
}
```

Effects vocabulary (v1): `health/resolve/money/suspicion/reputation/gi`,
`set_flag/clear_flag`, `add_item/remove_item/condition_delta`, `xp/level`,
`goto` (sub-node or other event), `end_run(ending_id)`, `spawn_event(id, act)`.

## 4. Systems implementation notes

- **EventDirector:** per-pool bags with Fisher–Yates (seeded); draw = pick act-pacing
  category (weighted table per act) → pick pool by current location state → draw bag.
  Tale chain events are *injected* at milestone counters, overriding a draw.
- **Location state:** simplified — `route_progress` 0→100 along the Tōkaidō with
  named station waypoints; `location_type` derived from progress + events that move
  it (fords = gates: can't pass without resolved ford event).
- **Season clock:** each act consumes ticks from rest/progress; season drives weather
  table + festival events + price multipliers.
- **CheckResolver:** one formula (GDD §6), one pity counter per run, all modifiers
  logged to the run log for transparency/debugging ("why was this 62%?" answerable).
- **CombatResolver:** deterministic given seed + bet + stance; produces outcome tier
  (clean win / wounded win / pyrrhic / capture / death) used by both text and meta.
- **Save:** serialize `{RunState, seed, rngState, meta}` after every choice; version
  field + migration stubs from day one.
- **i18n:** all player-facing text behind string keys from the start. Confirmed plan:
  **English only** at launch; key structure kept so a Japanese pass can be added later
  with zero engine changes (also keeps JP-term glossing consistent).
- **Art assets:** static ink-vignette set (~12–15 WebP/PNG, one per event category +
  title banner), served with the site; no runtime image generation.

## 5. Testing & balance

- **Schema validator** (zod/ajv) runs over every content file in CI — catches broken
  `goto`s, missing string keys, unreachable requirements.
- **Simulation harness:** headless engine + scripted/bot policies (greedy-money,
  stat-optimized, random) × 10,000 seeded runs → CSV reports: death-cause histogram,
  pass rates per DC, ending distribution per Tale, money curves, event repetition
  audit. This is the primary balance instrument.
- **Unit tests** for CheckResolver math, CombatResolver tiers, bag no-repeat
  guarantee, debt interest tick, pity counter.
- **Playtest protocol:** 5 human runs per content drop against target metrics
  (GDD §15) before merge.

## 6. Roadmap (estimates, dev-hours, not calendar promises)

| Phase | Scope | Size |
|---|---|---|
| P0 Prototype | Engine core: state, reducer, 10 events, check+combat math, plain UI | ~1–2 weeks |
| P1 Vertical slice | Tale 1 full chain, Act 1 pool (30 events), director, save, epilogue+ending flow | ~3–4 weeks |
| P2 MVP | Tales 1–2, 60+24 events, meta/omoide/traits, codex v1, ink-vignette art set, mobile polish, sim harness | ~6–8 weeks |
| P3 V1.0 | Tales 3–4, prison chain, debt & gambling systems, 120+ events, gallery, daily seed | ~8–10 weeks |
| P4 V1.x | Tales 5–6, Osaka/Kyoto pools, disaster set pieces, audio, illustrations, JA i18n | ongoing |

## 7. Things deliberately NOT built

- No accounts, no cloud saves (localStorage only) — zero backend.
- No monetization in MVP. (If ever wanted: cosmetic themes only; earnable everything.)
- No pixel-art dependency — typography carries the MVP; art is additive later.
- No multiplayer/social beyond shareable daily-seed result strings (client-side only).

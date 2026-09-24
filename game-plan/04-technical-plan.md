# 04 — Technical Plan (planning doc — build status lives in `progress.md`)

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
    "max_suspicion": 5,            // ceiling; pairs with min_suspicion (same min_/max_ pattern for other tracks)
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
    },
    {
      "text_key": "…bribe",
      "requires": { "min_money": 100 },           // per-choice gate; same keys as event-level requires (see below)
      "display_when_unmet": "locked_hint",        // "hide" | "locked_hint" (greyed + hint, GDD §12)
      "check": { "stat": "me", "dc": 4 },
      "on_success": { "result_key": "…bribe_pass", "effects": [ {"money":-100} ] },
      "on_failure": { "goto": "checkpoint_hakone_papers.bribe_caught", "effects": [ {"suspicion":1} ] }
    }
  ],
  "codex_on_resolve": ["sekisho", "tegata"]
}
```

**Choice-level `requires`.** Any choice can carry its own `requires` block,
mirroring the event-level one: `tales`, `flags`, `flags_not`, `items_any`,
`stats`, `min_money` (plus the `min_`/`max_` track keys and `counters_min`/
`counters_max` from §3.2). All listed conditions must pass. Wrap conditions in
`any_of` for OR gates, e.g. 03 sample 1's "guide's tally OR Me ≥ 7". This is what
03's `[requires ≥ 100 mon]`, `(Tale 1 only)`, and `[fires if flag …]` choices
compile to. `display_when_unmet` controls what an unmet choice looks like:
`"hide"` (default; right for Tale/flag gates the player shouldn't see) or
`"locked_hint"` (greyed out with a hint, per GDD §12's UI mock; right for
item/money/stat gates the player can work toward).

Effects vocabulary (v1): `health/resolve/money/suspicion/reputation/gi`,
`set_flag/clear_flag`, `add_item/remove_item/condition_delta`, `xp/level`,
`stat_delta` (permanent stat change for the run, e.g.
`{"stat_delta": {"stat": "waza", "delta": -1}}` for 03 sample 3's broken fingers),
`counter_inc` (e.g. `{"counter_inc": "employer_contracts"}`, see §3.2),
`goto` (sub-node or other event), `end_run(ending_id)`, `spawn_event(id, act)`.

### 3.1 Compound checks ("Check A AND Check B")

There's no multi-check field. The standard pattern is a two-step `goto` chain:
the first check routes to one of two follow-up sub-nodes, and each sub-node runs
the second check. Outcomes that can be reached by either path ("one fails") share
a result key. Example, 03 sample 4's wade choice (Chikara DC 5 AND Tan DC 4):

```jsonc
{ "text_key": "…wade", "check": { "stat": "chikara", "dc": 5 },
  "on_success": { "goto": "road_oi_river_ford.wade_a_pass" },
  "on_failure": { "goto": "road_oi_river_ford.wade_a_fail" } }
// sub-node wade_a_pass: one choice [Tan DC 4] → success: …both_pass / failure: …one_fails
// sub-node wade_a_fail: one choice [Tan DC 4] → success: …one_fails  / failure: …both_fail
```

Trade-off: the second check's odds show on the follow-up node, not up front. If
03's "both shown" presentation matters for a given event, the choice text names
the second check. Use this pattern rather than inventing per-event variants.

### 3.2 Ending schema (sketch)

`endings.json` holds one entry per ending. Requirements use the same keys as
event/choice `requires`, plus track ceilings and counters. A top-level
`requires` object means all conditions must pass (AND). Use `any_of` / `all_of`
for OR and nesting. At run end, all matching endings are collected and the one
with the highest `priority` wins. Forced endings (death, despair, arrest) still
fire directly via `end_run`.

```jsonc
[
  {
    "id": "ronin_new_banner", "tale": "ronin", "tone": "bright", "priority": 50,
    "title_key": "ending.ronin_new_banner.title",
    "epilogue_key": "ending.ronin_new_banner.epilogue",
    "requires": {
      "min_reputation": 3,
      "max_suspicion": 1,                              // ceiling ("Suspicion ≤ 1")
      "counters_min": { "employer_contracts": 2 },     // count condition ("2+ contracts")
      "flags": ["refused_yui"]
    }
  },
  {
    "id": "ronin_lawful_vendetta", "tale": "ronin", "tone": "solemn", "priority": 60,
    "requires": {
      "any_of": [ { "stats": { "chi": 8 } }, { "stats": { "kuchi": 8 } } ],   // OR
      "items_any": ["fathers_letter"],
      "max_suspicion": 2,
      "min_reputation": 1
    }
  },
  { "id": "ronin_garden_gate", "tale": "ronin", "tone": "dark", "priority": 30,
    "requires": { "max_gi": -3 } }                     // slider ceiling = "Gi/Aku ≤ −3"
]
```

- **Tracks:** `min_`/`max_` for `suspicion`, `reputation`, `gi`, `resolve`, `money`
  (all inclusive). `stats` values are floors.
- **Counters:** named integers on `RunState`, starting at 0. Content bumps them with
  `counter_inc`. Some counters (e.g. `combat_wins` for "4+ combat wins") can be
  engine-maintained. Requirements compare with `counters_min` / `counters_max`.

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

> **Status (per `progress.md`):** none of the four items below is built yet. The
> vertical slice was authored without them. The only simulator that exists is the
> standalone `sim/balance-sim.mjs` (see `06-balance-sim-report.md`), which checks
> the formulas in isolation and is not the harness described here. The **schema
> validator** is the recommended next infrastructure piece: it's the cheapest of
> the four, and it would have caught the per-choice gating, compound-check, and
> stat-effect gaps fixed in §3. The harness and playtest protocol can wait for P1.5.

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

| Phase | Scope | Size | Status |
|---|---|---|---|
| P0 Prototype | Engine core: state, reducer, 10 events, check+combat math, plain UI | ~1–2 weeks | **Done** |
| P1 Vertical slice (pre-MVP checkpoint, GDD §16) | One Tale, Act 1 only (~20–25 events), no chain-climax requirement, no commissioned art, 3–4 endings | — | **Done**: rōnin, 19 events, 4 endings, save/resume included (per `progress.md`; still a few events short of 20–25) |
| P1.5 Tale 1 full | Tale 1 full chain (all acts), Act 1 pool (30 events), director (act pacing + chain injection), epilogue+ending flow (§3.2). Needs choice-level `requires` (§3) and ideally the schema validator (§5) first | ~3–4 weeks | Not started |
| P2 MVP | Tales 1–2, 60+24 events, meta/omoide/traits, codex v1, ink-vignette art set, mobile polish, sim harness | ~6–8 weeks | Not started |
| P3 V1.0 | Tales 3–4, prison chain, debt & gambling systems, 120+ events, gallery, daily seed | ~8–10 weeks | Not started |
| P4 V1.x | Tales 5–6, Osaka/Kyoto pools, disaster set pieces, audio, illustrations, JA i18n | ongoing | Not started |

## 7. Things deliberately NOT built

- No accounts, no cloud saves (localStorage only) — zero backend.
- No monetization in MVP. (If ever wanted: cosmetic themes only; earnable everything.)
- No pixel-art dependency — typography carries the MVP; art is additive later.
- No multiplayer/social beyond shareable daily-seed result strings (client-side only).

**Not on this list, and not built either:** the standalone chō-han gambling den
(stakes, house cut, cheat/tell payouts) and the peddling buy/sell loop. Neither is
cut. Both are load-bearing for 03's content (all of Tale 4, part of Tale 3), have
no formula yet (see GDD §9.2, "Open formula work"), and need a formula plus a
schema sketch before Tale 3/4 authoring starts.

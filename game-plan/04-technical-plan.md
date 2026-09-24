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
    "pc_gender": "f",              // optional; only for Tales that choose gender at creation (GDD §4.1)
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

### 3.3 Den, peddling, and den-network keys (sketch)

These are for GDD §9.2–§9.4. Wherever possible they reuse existing keys (`check`,
`requires`, `counter_inc`, `counters_min`, `stat_delta`, `items_any`). The list
of genuinely new pieces is short.

**Station placeholder.** Flag and counter names may contain `{station}`, which
resolves to the current station id from location state (§4). That's how per-den
state (`den_marked.{station}`, `den_standing.{station}`) is authored once in a
shared event and stored per town.

**Signed, clamped counters.** `counter_inc` gains an optional `by` (signed
integer, default 1). Clamps are declared once in a counter registry
(`counters.json`), not per effect, e.g. `"den_standing.*": { "min": -2, "max": 2 }`,
`"den_heat": { "min": 0, "decay_per_season_tick": 1 }`. Engine-maintained roll-ups
(`dens_allied`, `dens_feuding`) are recomputed whenever a `den_standing.*` counter changes,
the same way §3.2's `combat_wins` works.

**Den node.** A `den` block on an event turns on the chō-han mini-game. The
engine derives `B` (base stake) and the DC tier add from `tier`, and tracks
`visit_net` (this visit's running win/loss) until the player leaves the node.

```jsonc
{
  "id": "posttown_chohan_den", "pool": "post-town", "acts": [1, 2, 3],
  "den": { "tier": "provincial" },     // provincial | city → B 20 | 50, dc tier add 0 | +2 (GDD §9.2)
  "choices": [
    { "text_key": "…honest", "wager": { "table": "shallow" } },  // up to 5 rounds at S = B, win 0.9S / lose S; sets knows_the_mat
    { "text_key": "…deep",   "wager": { "table": "deep" } },     // S = 5B; engine offers loan when visit_net ≤ −100
    {
      "text_key": "…watch",
      "requires": { "flags": ["knows_the_mat"], "flags_not": ["den_marked.{station}"] },
      "skill_attempt": true,                                     // one per visit: closes the other skill_attempt choices
      "check": { "stat": "me", "dc": 6, "den_dc": true,          // den_dc: + tier add + counters.den_heat
                 "mods": [ { "if_trait": "gamblers_ear", "pct": 5 },
                           { "if_counters_min": { "cup_mastery": 2 }, "pct": 10 } ] },
      "on_success": { "result_key": "…read_him", "effects": [
          { "money_stake": 7.2 },                                // money += round(7.2 × B)
          { "set_flag": "den_marked.{station}" },
          { "counter_inc": "den_heat" },
          { "counter_inc": "den_standing.{station}", "by": -1 } ] },
      "on_failure": { "goto": "posttown_chohan_den.stare_problem",
          "effects": [ { "money_stake": -2 }, { "forfeit_visit_winnings": true } ] }
    },
    {
      "text_key": "…sleeve", "skill_attempt": true,
      "requires": { "flags": ["knows_the_mat"], "flags_not": ["den_marked.{station}"] },
      "check": { "stat": "waza", "dc": 7, "den_dc": true },
      "on_success": { "effects": [ { "money_stake": 12.5 }, { "gi": -1 }, { "set_flag": "cheated_den" },
          { "set_flag": "den_marked.{station}" }, { "counter_inc": "den_heat", "by": 2 },
          { "counter_inc": "den_standing.{station}", "by": -1 } ] },
      "on_failure": { "goto": "posttown_chohan_den.caught",      // sub-node: fingers (health −4 + stat_delta waza −1) | buy back (money_mult 0)
          "effects": [ { "counter_inc": "den_heat" }, { "counter_inc": "den_standing.{station}", "by": -2 } ] }
    }
  ]
}
```

New keys, in full:
- `den` (event block): `tier`. The hostile variant is the same event with
  `den_marked.{station}` set; the engine doubles the house cut to a fifth.
- `wager` (choice field): runs the chō-han rounds with dice from the main RNG,
  then returns to the node. This is the only new node-type behaviour.
- `skill_attempt` (choice flag): the one-per-visit rule.
- `den_dc` (check flag), and mod predicates `if_trait` and `if_counters_min` beside
  the existing `if_flag`.
- Effects: `money_stake` (a signed multiple of B), `forfeit_visit_winnings`,
  `loan` (`{"loan": {"stake_mult": 5}}`; the engine routes it to `den_loan`, or to
  the Tale 3 ledger with `bunzo_den_note`, per GDD §9.2).
- Tale 4 mastery is plain counter use: `counter_inc: "cup_mastery"` on each
  *[The Cup Remembers]* event, and mastery-gated choices use `counters_min`.
- Ending gate: `"counters_min": { "dens_allied": 5 }` for *The Cup Passes*.

**Goods and prices.** Trade goods are items (`kind: "trade_good"`) with `units`
and `cost_basis` (for the profit readout), so `items_any: ["tea"]` already works as
a requirement. Goods data lives in `goods.json`, and station → region is route data:

```jsonc
{ "id": "tea", "base_price": 50, "stack": 5, "depth": 5,
  "region_mult": { "kamigata": 1.0, "owari_mikawa": 1.0, "totomi_suruga": 0.75, "hakone": 1.1, "kanto": 1.3 },
  "risk": { "type": "theft", "rider_pct": 25, "on": ["night", "inn_cheap"],
            "check": { "stat": "me", "dc": 5 }, "loss": "half_round_up" } }
// fish: risk { "type": "spoilage", "seasons": ["summer"], "pct_per_rest": 20 }
// blades: risk { "type": "checkpoint", "check": { "stat": "kuchi", "dc": 4 },
//                "mods": [ { "if_item": "bill_of_sale", "pct": 10 } ], "auto_pass_class": "samurai",
//                "fail": { "lesser_pct": 75, "fee_pct_of_basis": 25, "else": "confiscate", "suspicion": 1 } }
```

- `market` (choice field): `{"market": {"depth_mult": 1}}` on post-town rest nodes,
  and `2` on Nihonbashi/Osaka/Kyoto market events. Opens the buy/sell screen.
- Price lookup is a pure function, `priceOf(good, station, seasonTick, runSeed, H)`,
  implementing GDD §9.3. Its noise comes from a **separate hash-seeded sub-RNG**
  (`mulberry32(hash32(runSeed, good, station, seasonTick))`) and never advances the
  main `rngState`, so viewing a market can't perturb event draws, saves stay
  stable, and daily seeds give everyone the same prices.
- `remove_item` gains optional `units` / `pct` for theft, spoilage, and confiscation.
  Risk riders are engine hooks driven by `goods.json`, not per-event content.

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

> **Status (per `progress.md`):** the **content validator** and **unit tests** are
> built (`npm test`, vitest). The validator is TypeScript, not zod/ajv: content is
> typed TS, so the type system covers shape and `src/content/validate.ts` covers
> the authoring rules (03 §9 caps, DC range, ungated share, ending references, a
> flag/counter/item ledger so no gate is unopenable, no soft-locked events). It
> runs as a test, not yet in CI (the repo has no CI). The simulation harness and
> playtest protocol are still not built; the only simulator is the standalone
> `sim/balance-sim.mjs`. Both can wait for P1.5.

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
(stakes, house cut, cheat/tell payouts), the peddling buy/sell loop, and Tale 4's
den-network standing. None is cut. All are load-bearing for 03's content (all of
Tale 4, part of Tale 3). They are now specified but not implemented: formulas in
GDD §9.2 (den), §9.3 (peddling), §9.4 (den network), schema keys in §3.3 above.
Build them in P3 (V1.0) with Tales 3/4.

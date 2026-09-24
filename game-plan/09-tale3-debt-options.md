# 09 — Tale 3 Debt Scale: Decision Options

A decision proposal for the scale flag at the end of `02` §9.3. Nothing here is
applied. `02`, `03`, and `05` are unchanged until an option is picked. Section
refs are to `02-game-design.md` unless marked. Line numbers were taken when this
was written. `01` is being edited in parallel, so its line numbers may move.

---

## 0. Shared run model (assumptions used by every table)

**Ticks.** `02` §8: each act is about 2–3 season ticks. `05` §2: 7–8 ticks per
run. This doc uses 8 ticks: Act 1 = T1–T3, Act 2 = T4–T6, Act 3 = T7–T8.
Compounding freezes at Act 3 (the §9 safety valve), so **6 compounding ticks**.

**Order within a season.** Payments are made during the season. At the tick, the
remaining balance × 1.25 (no interest at T7–T8). Mon balances are rounded half-up
after each tick.

**Income.** `02` §9.1 gives payouts per event but no event counts or upkeep. The
counts and upkeep below are placeholders for the balance sim (§15) to replace.
Peddling totals come from §9.3's run estimates (typical +150–250, focused
+500–600).

| | Act 1 (13 ev) | Act 2 (17 ev) | Act 3 (7 ev) | Run |
|---|---|---|---|---|
| **Typical** paid events | 4 × ~45 = 180 | 6 × ~150 = 900 | 2 × ~200 = 400 | 1,480 |
| Typical peddling | Peddler's Pole tea 55 + fish 28 = 83 | 2 × 55 = 110 | 1 × 40 = 40 | 233 |
| Typical gross | 263 | 1,010 | 440 | 1,713 |
| **Focused** (Kuchi/Chi merchant) paid | 5 × 60 = 300 | 8 × 250 = 2,000 | 3 × 250 = 750 | 3,050 |
| Focused peddling | 3 × 70 = 210 | 2 × 90 = 180 | 1 × 90 = 90 | 480 |
| Focused gross | 510 | 2,180 | 840 | 3,530 |
| Upkeep (food, ~3 inn nights, polish, a bribe; sleeps rough otherwise) | 150 | 400 | 150 | 700 |
| **Typical net** | 113 | 610 | 290 | **1,013** |
| **Focused net** | 360 | 1,780 | 690 | **2,830** |
| Typical net per tick | 38 / 38 / 37 | 203 / 203 / 204 | 145 / 145 | |
| Focused net per tick | 120 / 120 / 120 | 593 / 593 / 594 | 345 / 345 | |

"Focused" is an optimistic ceiling: it takes a paid slot in 16 of 37 events at
the bodyguard/escort band, and spends nothing on gear. A combat build could add
one named bounty (~1,000, §9.1). No honest source reaches a higher order of
magnitude.

---

## 1. The problem, with numbers

| Quantity | Value | Arithmetic |
|---|---|---|
| Principal | 100,000 mon | 100 ryō × 1,000 (§5 fixed rate) |
| Interest at T1 | 25,000 mon | 100,000 × 0.25 |
| Untouched at Act 3 (6 ticks, with freeze) | 381,470 mon | 100,000 × 1.25⁶ = 100,000 × 3.8147 |
| Untouched at 8 ticks (no freeze, `05` §2's figure) | 596,046 mon | 100,000 × 1.25⁸ |
| Focused honest net, whole run | 2,830 mon | §0 |
| One tick's interest ÷ focused run | 8.8 runs | 25,000 ÷ 2,830 |
| *Ledger Closed* gate (130 ryō) ÷ focused run | 45.9 runs | 130,000 ÷ 2,830 |
| *The Pawnshop* gate (40 ryō goodwill) ÷ focused run | 14.1 runs | 40,000 ÷ 2,830 |
| Every focused mon paid into the ledger | Act-3 balance 376,836 (−1.2%) | see §4 table. Savings = 120×1.25⁶ + 120×1.25⁵ + 120×1.25⁴ + 593×1.25³ + 593×1.25² + 594×1.25 + 690 = 457.8 + 366.2 + 293.0 + 1,158.2 + 926.6 + 742.5 + 690 = 4,634 |

What this breaks:
- **The buy-out valve** (§9, `05` §2) needs about 100,000 mon at T0–T2. A focused
  player has ≤ 240 by T2 (120 × 2). The valve can't be used.
- **The freeze valve** freezes the balance at about 381 ryō. That leaves 134.8
  focused runs to pay (381,470 ÷ 2,830). The valve does nothing for money.
- ***Ledger Closed*** can't be reached, so the honest bright ending of Tale 3 is
  dead content. Pillar 3 ("no wasted runs") and the intended pressure in `05` §2
  (the honest path is hard, the underworld is tempting) both fail. With no honest
  path, the underworld path isn't a temptation. It's the only route.
- The 130-ryō gate is close to the T1 balance (125 ryō + 5), which suggests it
  was written assuming payment near the first tick.

### 1.1 Changing the rate or tick frequency alone doesn't fix it

At 0% interest, the 100,000 principal is still 35.3 focused runs (100,000 ÷
2,830). Changing the rate, or ticking once per act instead of per season, changes
growth but not the ~35× gap in the principal. Rate and frequency only become
useful tuning knobs after the unit or scale is fixed. They're treated that way
below, not as a standalone option.

---

## 2. Option A — Rescale the principal to mon, keep 25% per tick

Bunzō's note becomes **1,000 mon (1 ryō)**. 25% per tick, 6 compounding ticks, and
both §9 valves stay.

**Premise change (`03` Tale 3).** The storm's loss, about 100 ryō, already cost
the family the shop, the stock, and the warehouse lease. Those creditors are paid
off-screen. What's left is the note your brother signed with Bunzō to cover the
last month's wages, with you as guarantor: 1 ryō at 25% a season. Bunzō doesn't
chase it 500 km for the coins. He wants the brother, and the leash (see `03`
cast: Kikunosuke's Yui link). The headline "100 ryō" survives as backstory.

### 2.1 Balance per tick (P = 1,000)

Typical and focused pay every net mon into the ledger each season. The
"Servitude" row is `03` Act 2's "renegotiate into servitude" fork taken at S4:
interest frozen from then on, one work-off job per season credited at 500 (about
2× a bodyguard wage), replacing one ~150 paid event. So net per season =
203 − 150 + 500 = 553 (554 at S6).

| Tick | Act | Untouched | Typical honest | Focused honest | Typical → servitude at S4 |
|---|---|---|---|---|---|
| T0 | | 1,000 | 1,000 | 1,000 | 1,000 |
| T1 | 1 | 1,250 | (1,000−38)×1.25 = 1,203 | (1,000−120)×1.25 = 1,100 | 1,203 |
| T2 | 1 | 1,563 | (1,203−38)×1.25 = 1,456 | (1,100−120)×1.25 = 1,225 | 1,456 |
| T3 | 1 | 1,954 | (1,456−37)×1.25 = 1,774 | (1,225−120)×1.25 = 1,381 | 1,774 |
| T4 | 2 | 2,443 | (1,774−203)×1.25 = 1,964 | (1,381−593)×1.25 = 985 | 1,774−553 = 1,221 (frozen) |
| T5 | 2 | 3,054 | (1,964−203)×1.25 = 2,201 | (985−593)×1.25 = 490 | 1,221−553 = 668 |
| T6 | 2 | 3,818 | (2,201−204)×1.25 = 2,496 | 490−594 → **paid**, +104 spare | 668−554 = 114 |
| T7 | 3 | 3,818 (frozen) | 2,496−145 = 2,351 | (+345) | 114−145 → **paid**, Gi/Aku −3 |
| T8 | 3 | 3,818 | 2,351−145 = **2,206 owed** | (+345; 794 spare at end) | |

Reading: the ledger outgrows everyone in Act 1. Interest at T1 is 250+, against
Act 1 income of 38–120 per season. A focused merchant overtakes it in Edo and
closes at S6 with 104 spare. Spending even 15% on gear pushes that into Act 3,
where the freeze turns the remainder into a fixed target. A typical honest player
ends 2,206 short. Servitude closes the ledger at S7 at the cost of Gi/Aku −3 plus
job Suspicion risk. That's the `05` §2 pressure, though for the typical player
the honest path is closed rather than hard. §6 addresses that.

### 2.2 Sensitivity to P

| P | Untouched at Act 3 (P × 3.8147) | Focused, pay-all | Typical, pay-all |
|---|---|---|---|
| 750 | 2,861 | paid S5, +217 spare (788 / 835 / 894 / 376, then 376−593 < 0) | owes 1,253 |
| **1,000** | 3,818 | paid S6, +104 | owes 2,206 |
| 1,250 (1 ryō 1 bu) | 4,768 | owes 135 (T6 825 → 825−345−345) | owes 3,159 |
| 1,500 | 5,722 | owes 1,088 | owes 4,115 |

The same per-tick method as §2.1 was used for each row. Intermediate focused
rows: P = 1,250 goes 1,413 / 1,616 / 1,870 / 1,596 / 1,254 / 825. P = 1,500 goes
1,725 / 2,006 / 2,358 / 2,206 / 2,016 / 1,778. The rate is the second knob: once
P is in mon, the sim can trade P against 20–30% freely.

### 2.3 Endings (`03` Tale 3)

| Ending | Current gate | Under A |
|---|---|---|
| *Ledger Closed* | wealth ≥ 130 ryō-equiv | Regate to `bunzo_ledger` = 0 through payment (flag `ledger_paid_clean`, not set by work-off credit). **Reachable** by a focused build that saves nearly everything. Not reachable by a typical build without a windfall or a lever (§6). |
| *The New Bunzō* | Gi/Aku ≤ −4 | Unchanged. The servitude route reaches ledger 0 at Gi/Aku −3, and one more job reaches −4. **Reachable**, and relatively cheaper than honest play, which is the intent. |
| *Bugyō's Witness* | Chi/Kuchi gates | Doesn't depend on money. It becomes the realistic exit for a typical honest player. **Reachable** at `03`'s stated danger. |
| *Brothers in Kodenmachō* | brother chain | Doesn't depend on money. "Take his debt-cell" works less well at 2–4k mon, but it's still a debt a ruined townsman can't pay. **Reachable.** |
| *Dōtonbori Water* | default failure | Needs an explicit trigger: ledger > 0 at the climax and no route flag. **Reachable**, and it's where a typical honest player lands (owing 2,206). Recommend a partial close at the climax (§6) so a near-miss doesn't drown. |
| *The Pawnshop* | chain + Gi/Aku ≥ +1 + ≥ 40 ryō goodwill | "40 ryō" has no defined unit. Regate to an `osumi_goodwill` counter (chain events, gifts). A pawnbroker family absorbing ≤ ~3,800 mon as bride-price is plausible. At 381 ryō it isn't. **Reachable.** |

### 2.4 §9.2 den loan and the §9 valves

- **Den loan.** 02 lines 389–395 say "the sum is small next to the ledger." Under
  A that stops being true. A provincial 5B loan (100) taken before T2 grows to
  100 × 1.25⁴ = 244 by Act 3. A city 5B loan (250) at T4 grows to
  250 × 1.25³ = 488. A 10B city loan (500) is +50% of principal. That's strong
  pressure, maybe too strong. Recommend capping Tale 3 at 5B. The
  `bunzo_den_note` agent spawn keeps its purpose and now has real stakes.
- **Buy-out valve.** At P = 1,000 it's still unreachable from wages alone (≤ 240
  by T2). It needs a starting purse and a stated price (§6).
- **Freeze.** Now meaningful. For a near-miss focused player, the Act 3 remainder
  is a fixed number the status bar can show.

### 2.5 Historical plausibility

- **Rate.** `01` §B4 line 129: underworld interest "exceeded 100%/year." If a tick
  is one real season, 1.25⁴ = 2.441, so +144%/yr compounded (100% simple). That's
  within the research claim, not "kinder" as §9 says. If a tick is a compressed
  season (14 real seasons, spring 1648 to autumn 1651, over 8 ticks = 1.75
  seasons = 5.25 months), then 12 ÷ 5.25 = 2.286 ticks/yr, and
  1.25^2.286 = e^(2.286 × 0.2231) = 1.666, so +67%/yr, which is kinder. The
  codex card should say which reading it uses. This holds for every option.
- **Size.** A 1-ryō wage note is a plausible townsman's loan. It's the price of a
  serviceable katana (§9.1). **Gap:** `01` has no data on typical loan sizes,
  pawn values, or bakuto lending terms beyond "ran loan-sharking" (§B7 line 147).
  Needs a source line before authoring (checklist I2).
- The 100-ryō brokerage collapse stays in the backstory. It's unsourced but
  unremarkable for an Osaka rice broker (`01` §B5).

### 2.6 Docs that change if chosen

- `02` line 222 (§9 debt bullet): principal, valve wording.
- `02` lines 389–395 (§9.2 Tale 3 loan): delete "small next to the ledger," cap
  at 5B.
- `02` lines 536–539 (§9.3 scale flag): resolve.
- `02` §15 table (lines 691–698): add a Tale 3 row (target, §6).
- `03` lines 192–194 (premise), 213–214 ("needs big money"), 220–227 (the
  *Ledger Closed* and *Pawnshop* gates).
- `05` lines 142–157: it's a review record, so add a forward pointer to 09
  rather than rewriting it.
- `01` line 129: a loan-size source. Line 176 (Part C) says "per act." Align it
  to per season tick.

---

## 3. Option B — Keep 100 ryō, settle through leverage

The balance stays 100 ryō at 25%, and mon still pay 1:1. The honest route stops
being payment and becomes leverage. Leverage points: evidence of Bunzō's illegal
lending (`03` Act 2 fork), `brother_found` plus pulling Kikunosuke out, and
O-Sumi's father as surety. At *The Ledger in Kanda* (S5), **≥ 2 points** make
Bunzō tear up the note for a face payment of 1 ryō. A favor (underworld job,
Gi/Aku −1) waives one tick's interest.

### 3.1 Balance per tick (ryō; mon ÷ 1,000)

| Tick | Untouched | Focused, all money paid | Favor every tick T1–T6 | 2 leverage points at S5 (focused money) |
|---|---|---|---|---|
| T1 | 125.00 | (100,000−120)×1.25 = 124.85 | ≈ 99.88 (interest waived) | 124.85 |
| T2 | 156.25 | 155.91 | ≈ 99.76 | 155.91 |
| T3 | 195.31 | 194.74 | ≈ 99.64 | 194.74 |
| T4 | 244.14 | 242.69 | ≈ 99.04 | 242.69 |
| T5 | 305.18 | 302.62 | ≈ 98.45 | **torn → 1.00 face payment** |
| T6 | 381.47 | 377.53 | ≈ 97.86 | paid from S5 purse (593 + 594 ≥ 1,000) |
| T7–T8 | 381.47 | 377.18 → 376.84 | ≈ 97.51 → 97.17; Gi/Aku −5 (clamped from −6) | — |

A typical player can also make the face payment. Unspent typical net by S8 =
113 + 610 + 290 = 1,013 ≥ 1,000, with 13 to spare, by the last season.

### 3.2 Endings

| Ending | Under B |
|---|---|
| *Ledger Closed* | "Pay in full" can't be done (money moves the balance 1.2%). It has to be reworded as "settled" through ≥ 2 leverage plus the face payment. **Reachable, but it's a flag gate. The balance number plays no part.** |
| *The New Bunzō* | Favors hold the balance at ~100. Six favors take Gi/Aku to −5. **Reachable.** This is the only route where the balance matters. |
| *Bugyō's Witness* | Uses the same evidence as the leverage route, so it overlaps *Ledger Closed*. They differ only in whether you negotiate or testify. Needs a separating requirement. |
| *Brothers in Kodenmachō* | Unchanged. A debt-cell is most plausible at this scale. |
| *Dōtonbori Water* | The default for anyone with < 2 points and no Aku route, same as now. For an unlucky honest player it's binary. |
| *The Pawnshop* | A pawnshop family absorbing 150–380 ryō isn't plausible. Rewrite so O-Sumi's father is a leverage point (surety) rather than the payer. |

### 3.3 Den loan and valves

- **Den loan.** 100–500 mon on a 100,000+ balance is invisible. Only the
  `bunzo_den_note` agent spawn does anything, which §9.2 already says.
- **Buy-out.** The balance is never small, so the valve has to be replaced by
  leverage. 02 line 222's buy-out text would be deleted.
- **Freeze.** It freezes a number nobody can pay. It only matters if leverage
  cuts are proportional.
- **Money-to-ledger.** Pillar 2 ("readable risk") takes a hit: the player watches
  a 300-ryō figure climb with no lever that moves it except a flag count. A cut
  from a single point (×0.5 → ~121 ryō) is as worthless as zero points.

### 3.4 Plausibility

- Strong on the scary number and on debt as a leash. Debt bondage existed in
  general, but **it isn't in `01`.** The same goes for the claim that an illegal
  lender's note has no standing before the machi-bugyō, which is what makes the
  evidence lever work. Both need sources.
- Later-Edo debt-relief edicts (e.g. the Kansei *kien-rei*, 1789) fall outside
  1648–51. Don't use them as a lever.
- Internal inconsistency: a favor is worth 25+ ryō of interest to the ledger but
  150–300 mon as a wage. The fiction has to carry this ("he isn't paying you, he's
  pricing the crime").

### 3.5 Docs that change if chosen

- `02` line 222 (valves rewritten as a leverage rule).
- `02` lines 536–539 (resolve as "money is not the repayment path").
- `03` lines 213–215 (Kanda fork becomes the leverage negotiation), 220–227 (all
  six gates, *Ledger Closed* renamed or reworded, *Pawnshop* rewritten).
- `05` §2: its payoff/freeze advice no longer applies. Add a pointer.
- `01`: sources for enforceability of illegal debts and for debt bondage.

---

## 4. Option C — A separate Ledger track in its own units

A new track **Ledger 帳**, 0–12 "lines," shown like Suspicion (§5) with rumor-line
tiers (§10). It starts at 4. Each tick in Acts 1–2 adds +1, or **+2 if Ledger
≥ 8** at the tick (standing in for compounding). Frozen in Act 3. At 12, Bunzō
calls the note in (confrontation event). One line costs **π = 250 mon** at any
agent. A favor clears **−2 lines** (Gi/Aku −1). Each leverage point clears −2 at
Kanda. Buy-out: while Ledger ≤ 6, clear everything for (Ledger − 2) lines of mon.
A den loan adds +1 line.

### 4.1 Lines per tick

The purse buys as many lines as it can before each tick. Purse is carried over.

| Tick | Untouched | Typical honest (purse, lines bought) | Focused honest | Typical + 1 favor per Act-2 season (replaces a 150 event: net 53/53/54) |
|---|---|---|---|---|
| T1 | 5 | 38, 0 → 5 | 120, 0 → 5 | 5 |
| T2 | 6 | 76, 0 → 6 | 240, 0 → 6 | 6 |
| T3 | 7 | 113, 0 → 7 | 360, buy 1 (110 left): 5 → 6 | 7 (purse 113) |
| T4 | 8 | 316, buy 1 (66): 6 → 7 | 703, buy 2 (203): 4 → 5 | 166, 0; favor 7→5 → 6 |
| T5 | 10 | 269, buy 1 (19): 6 → 7 | 796, buy 3 (46): 2 → 3 | 219, 0; favor 6→4 → 5 |
| T6 | 12 (call-in) | 223, 0: 7 → 8 | 640, buy 2 (140): 1 → 2 | 273, buy 1 (23); favor 5→4→2 → 3 |
| T7 | 12 | 368, buy 1 (118): **7** | 485, buy 1 (235): **1** | 168, 0: **3** |
| T8 | 12 | 263, buy 1 (13): **6 owed** | 580, buy 1 (330): **0, closed** | 313, buy 1 (63): **2**, and a 4th favor closes it at Gi/Aku −4 |

Focused buys 10 lines = 2,500 mon. Typical buys 4 = 1,000. The shape matches A
(the ledger outruns you on the road, a merchant catches it in Edo), and the
favor row lands right on the *New Bunzō* threshold.

### 4.2 Endings

| Ending | Under C |
|---|---|
| *Ledger Closed* | Ledger 0, with ≥ half the lines bought with mon. **Reachable** by focused at T8. Typical ends at 6. |
| *The New Bunzō* | Favors at −2 lines. **Reachable**, closing near Gi/Aku −4. |
| *Bugyō's Witness* | Leverage and testimony are separate from the lines. **Reachable.** |
| *Brothers in Kodenmachō* | Unchanged. |
| *Dōtonbori Water* | Triggers at call-in or Ledger > 0 at the climax. **Problem:** untouched hits 12 at T6, the end of Act 2. Call-in has to be a confrontation, not an instant death, or it pre-empts the Keian climax. |
| *The Pawnshop* | O-Sumi's father buys out ≤ N lines. Goodwill needs a counter, as in A. |

### 4.3 Den loan and valves

- **Den loan.** +1 line (a 250-mon equivalent) is fine for city 5B, overprices a
  100-mon provincial loan, and underprices 500.
- **Buy-out.** 500 mon before T1, 750 before T2, 1,000 before T3. Same
  reachability as A: wages alone can't do it, a starting purse plus a gamble can.
- **Freeze.** The most legible of the three options, because the track visibly
  stops.

### 4.4 Plausibility

The weakest. Lines are an abstraction. If "100 ryō" stays in the text, one line
is nominally 16.7 ryō but costs 250 mon, and players will notice. Either drop the
ryō figure or never show a conversion. Merchant account books are real, but **not
in `01`.** Its advantages are design ones: the sim can retune π without
re-authoring events, and the track is readable at a glance.

### 4.5 Docs that change if chosen

- `02` §5 table (lines 119–126, new track row), §10 (rumor lines), §12 status bar
  (lines 656–657), line 222, lines 389–395 and 536–539.
- `04` §3.2 (a counter with display tiers).
- `03` lines 192–194, 209 ("season interest events"), 220–227.
- `05` §2 pointer.

---

## 5. Comparison

| | A: rescale to mon | B: 100 ryō + leverage | C: Ledger track |
|---|---|---|---|
| Honest money matters | yes, it's the main path | no (1.2%) | yes, via π |
| Focused honest closes | S6 (P 1,000) | only with ≥ 2 leverage | T8 |
| Typical honest closes | no (owes 2,206) | only with ≥ 2 leverage | no (6 lines) |
| Underworld closes | S7, Gi/Aku −3 | holds at ~100, Gi/Aku −5 | T8, Gi/Aku −4 |
| Buy-out valve | needs a starting purse | deleted | needs a starting purse |
| Freeze valve | meaningful | inert | meaningful, visible |
| Den loan | real stakes (cap at 5B) | invisible | +1 line |
| New system | none | leverage counter | new track + UI |
| Plausibility | good (gap: loan sizes) | good on scale, weak on favor pricing | weak |
| Authoring cost | low | high (6 gates rewritten) | medium |

---

## 6. Recommendation: Option A, plus one lever from B and a funded buy-out

Adopt **A at P = 1,000 mon, 25% per tick, freeze at Act 3**, with four additions:

1. **Starting purse 300 mon** ("what the bailiffs missed"). The player can pay it
   in, keep it as peddling capital, or keep it for the buy-out.
2. **Buy-out price = 60% of the current balance, until T2.** That's 600 before T1
   and 750 before T2 if nothing has been paid. Wages alone can't reach it
   (typical 300 + 76 = 376, focused 300 + 240 = 540). One provincial deep-table
   visit can (S = 100, win +90, loss −100, §9.2). Typical needs +374, which means
   winning all 5 rounds: 1/32 ≈ 3%. Focused needs +210: either the first 3 wins
   (+270, then stop) or 4 wins in 5 (+260). That's 4/32 + 3/32 (LWWWW, WLWWW,
   WWLWW) = 7/32 ≈ 22%. Losing triggers the §9.2 loan onto Bunzō's ledger, capped
   at 5B. The honest valve and the underworld temptation become the same
   decision.
3. **The evidence lever** (from B, one point, not a gate). A success at *The
   Ledger in Kanda* in S5 halves the balance and ends compounding. It sets the
   same flag *Bugyō's Witness* reads, so the player picks between settling and
   testifying.
4. **Partial close at the climax.** A remainder ≤ 250 plus a Kuchi check gives a
   neutral *Ledger Closed* variant instead of *Dōtonbori Water*. This applies §6
   partial success to the debt.

Den loan capped at 5B for Tale 3. Work-off credit ~500 per job (about 2× wage).

| Tick | Typical, purse paid at S1, no lever | Typical + evidence at S5 | Focused, purse paid at S1 | Typical → servitude at S4 |
|---|---|---|---|---|
| T1 | (1,000−300−38)×1.25 = 828 | 828 | (1,000−300−120)×1.25 = 725 | 828 |
| T2 | (828−38)×1.25 = 988 | 988 | (725−120)×1.25 = 756 | 988 |
| T3 | (988−37)×1.25 = 1,189 | 1,189 | (756−120)×1.25 = 795 | 1,189 |
| T4 | (1,189−203)×1.25 = 1,233 | 1,233 | (795−593)×1.25 = 253 | 1,189−553 = 636 (frozen) |
| T5 | (1,233−203)×1.25 = 1,288 | (1,233−203)×0.5 = **515**, frozen | 253−593 → **paid**, +340 | 636−553 = 83 |
| T6 | (1,288−204)×1.25 = 1,355 | 515−204 = 311 | | 83−554 → **paid**, Gi/Aku −3 |
| T7 | 1,210 | 166 | | |
| T8 | **1,065 owed** | **21 owed**, so partial close or any windfall | | |

**Rationale.** A is the only option where the honest path is paid in the game's
own currency and responds to the player's own play (build, discipline, peddling),
so the §9.1/§9.3 economy the sim tunes against actually drives the Tale. The
additions put each type of player where `05` §2 wants them. A focused merchant
closes honestly by Act 2 by giving up gear. A typical honest player closes only
with the evidence lever and ends within a coin-flip of paying (21 owed), which is
"hard but achievable." Servitude closes a season earlier and costs only Gi/Aku
and Suspicion, which is the temptation. The buy-out routes the honest shortcut
through the den, where §9.2 already has Bunzō's network catch up with you. B
keeps a scarier number but turns the Tale into a flag gate. C gets A's shape with
a new track and a unit players will see through. The 100 ryō stays in the story
as the collapse that started it.

Suggested §15 row for the sim: *focused honest build clears the ledger by
payment in ≥ 60% of runs; typical honest build in 30–50% (with evidence and
partial close); servitude chosen in ≤ 40% of Tale 3 runs.*

---

## 7. Side findings (not part of the decision)

- `01` Part C line 176 says interest accrues "per act." `02` §9 says per season
  tick. Align them whichever option is picked.
- §9's "kinder 25%/tick" is only true if a tick is read as a compressed season
  (§2.5: +67%/yr against +144%/yr).
- *The Pawnshop*'s "40 ryō goodwill" has no defined unit or source under any
  option. It needs a counter.
- `01` has no sources for small-loan sizes, enforceability of illegal debts,
  debt bondage, or debtor imprisonment. Every option leans on at least one of
  these (checklist I2).

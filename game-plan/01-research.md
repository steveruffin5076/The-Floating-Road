# 01 — Research

Part A: teardown of the reference game (*Life In Adventure*).
Part B: historical research brief for early Edo Japan (1600–1651).
Part C: how the history maps onto game mechanics.

---

## Part A — Reference game: *Life In Adventure* (Studio Wheel, 2020)

Source: Google Play listing, lifeinadventure.wiki.gg, MiniReview & Hardcore Droid reviews, r/LifeInAdventure player discussions.

### A1. Core loop

```
Create character (background "Tale" + traits + stats)
        │
        ▼
 ┌────────────────────────────────────────────┐
 │  RANDOM EVENT presented (text + pixel art) │
 │  2–4 choices, most gated by a stat         │◄──────────┐
 │        │                                               │
 │        ▼                                               │
 │  skill check: success% from stat + items + history     │
 │   • success → XP / gold / item / flag                  │
 │   • failure → damage to Health and/or Sanity           │
 │        │                                               │
 │        ▼                                               │
 │  sometimes: COMBAT (auto-resolved)                     │
 │   • optional pre-battle d20 roll: helps or hurts       │
 │        │                                               │
 │        ▼                                               │
 │  level up → distribute 4 stat points ─────────────────►│
 └────────────────────────────────────────────────────────┘
        │
        ▼  Health or Sanity hits 0 → death
 Epilogue ending (background questline + state dependent)
        │
        ▼
 Meta rewards (gems) → unlock new Tales, traits, re-rolls → new run
```

### A2. Systems inventory

| System | How LiA does it |
|---|---|
| **Stats** | 6 base (STR, DEX, INT, CHA, CON, WIS) + derived/special (e.g. Holiness, Spellcasting, Heavy/Swift weapon traits). Stats gate choices, color dialogue, and drive combat. |
| **Character creation** | Pick a **background story ("Tale")** which brings its own quest chain and exclusive endings; pick a **trait** (+1 stat or small perk); stats seeded randomly or by class. |
| **Events** | Pool of random encounters (combat, merchants, shrines, mini-stories) + Tale-specific chain events. Events can check items, flags, alignment, and past choices to add/remove options. |
| **Skill checks** | Percentage chance shown (or inferable); success/failure branch to different text outcomes. Some checks are unavoidable — failure still moves the story, at a cost. |
| **Combat** | Fully automatic. Player compares own power vs enemy power, then may **roll a d20** to shift odds up or down before auto-resolution. Weapons/armor have tiers that dominate the math; stats back them up. |
| **Resources** | **Health** and **Sanity** (both must stay > 0), **gold**, limited **inventory**, **XP/levels**, premium **gems**. |
| **Economy** | Random shop/merchant events; weapon tiers, consumables (potions, food), key items. Gambling-style risk events for gear. |
| **Endings** | Many epilogues per Tale, gated by stats/items/NPCs met/alignment. Replay incentive = collect endings. |
| **Meta-progression** | Death grants gems → buy new Tales, starting traits, revive tokens, shop refreshes, dice re-rolls. |

### A3. Documented strengths (keep these)

1. **Readable risk.** Players see victory chance before committing to a fight; the optional d20 is a beloved risk/reward hook.
2. **Short-run dopamine.** Event → choice → outcome in under a minute; a full run is ~30 min.
3. **Build identity.** Tales + traits + stat allocation make runs feel different ("I'm a holiness build", "I'm a fast escaper").
4. **Ending collection** drives long-term replay.
5. **Compact presentation:** one screen, text + small art + buttons; perfect for mobile/web.

### A4. Documented flaws (fix these)

From reviews and player threads:

1. **Repetitive event pool** — same events recur *within a single run*; rare events too rare. → Fix with a no-repeat bag + weights + act-based filtering.
2. **Opaque ending requirements** — players accidentally locked themselves out of endings they were "preparing for" (e.g. hidden Holiness gates). → Fix with visible requirement hints at decision time ("this choice will close a path").
3. **Punishing flat RNG** — "30 STR but fail to crush an apple a quarter of the time"; high stats should approach near-guaranteed success on trivial checks. → Fix with DC-relative scaling, partial successes, and clamped odds.
4. **No counterplay to bad luck streaks** — a scuffed run cannot recover. → Fix with pity mechanics (bad-luck protection), consumable re-rolls earned in-run, and "desperate" choices that open when resources are low.
5. **Unconnected quests** — main story feels absent; side events feel like filler. → Fix with an act structure and a historical spine (the Keian Uprising) that all runs brush against.
6. **Combat passivity** — watching auto-battle feels detached. → Keep auto-resolution (it's core to the genre) but add the chō-han pre-battle bet (thematic dice) and 2–3 stance choices instead of a single roll.
7. **Aggressive monetization** — not applicable; our web game can be earn-only.

---

## Part B — Historical research brief: Japan, 1600–1651

### B1. Timeline anchors (the run takes place 1648–1651)

| Year | Event | Game relevance |
|---|---|---|
| 1600 | Battle of Sekigahara; Tokugawa victory | Created the first huge wave of masterless samurai |
| 1603 | Tokugawa Ieyasu becomes shōgun; Edo period begins | Capital of power shifts to Edo |
| 1602 | Tsujigiri (test-cutting passersby) banned | Random night-road terror event; a real historical crime |
| 1614–15 | Sieges of Osaka; Toyotomi clan destroyed | Tens of thousands more rōnin; ex-Toyotomi loyalists = perfect backstory fuel |
| 1617 | Yoshiwara licensed quarter founded in Edo | Nightlife district, information hub |
| 1629 | Women banned from kabuki stage | Theater district flavor |
| 1633–39 | Sakoku edicts; Christianity outlawed; Shimabara Rebellion crushed (1637–38) | Hidden-Christian persecution, fumi-e tests, paranoia about foreigners/smuggling |
| 1635 | Buke shohatto revised; sankin-kōtai (alternate attendance) systematized | Daimyō processions clog the Tōkaidō — traffic, jobs, spectacle, checkpoints |
| 1640–43 | Kan'ei famine | Peasant background: ruined villages, rice riots, desperate people |
| 1645 | Miyamoto Musashi dies, completes *Go Rin no Sho* | Sword-saint legend freshly dead. The book (written 1643–45) was a private transmission to his student Terao Magonojō and passed in manuscript within his school (Niten Ichi-ryū); in 1648 almost no one outside it had seen it. Its wide fame is much later. His *name* circulates; the book does not |
| 1648 | **Keian era begins — game starts** | |
| 1651, Jun | Shōgun Tokugawa Iemitsu dies; child successor Ietsuna | Power vacuum — the conspirators' trigger |
| 1651, Sep | **Keian Uprising**: Marubashi Chūya's plot to burn Edo and storm the castle; Yui Shōsetsu to seize Sunpu. Betrayed by Marubashi's fever-talk; Marubashi crucified Sep 24; Yui commits seppuku at Sunpu Sep 10. Families of conspirators executed | The Act-3 climax for rōnin-aligned runs |

Scale of the rōnin problem: estimates run into the **hundreds of thousands** of masterless or unemployed samurai after Sekigahara + Osaka; the shogunate's domain-confiscation policies kept producing them. The Keian plot was not an isolated incident — follow-up rōnin unrest occurred in 1652 and on Sado. This is *the* defining social crisis of our window and the reason the era fits a "die and restart" game about drifters.

### B2. Society: the four classes (shi-nō-kō-shō)

- **Samurai (shi)** — ~6–7% of population. Only class allowed to wear two swords (daishō). Paid in rice stipends (koku) converted to cash — low-ranking samurai are chronically broke and indebted to merchants. In peacetime many are clerks, guards, or idle.
- **Farmers (nō)** — tied to the land; forbidden to leave without permission; taxed in rice. Famine years produce runaways (chōri) — criminals by the act of walking away.
- **Artisans (kō)** — smiths, weavers, carpenters, printers.
- **Merchants (shō)** — officially lowest, practically increasingly rich. Money-lending, rice brokering (Osaka's Dōjima market is being born in this era).
- **Below the system** — eta/hinin outcast groups, beggars, gamblers, actors. The bakuto/tekiya underworld draws from here and from fallen samurai.
- **Women** — legally subordinate; travel required stricter permits and many sekisho inspected women against written descriptions. An onna-musha fantasy does not exist in this era; a *pilgrim, entertainer, merchant's daughter, or widow running a shop* does. (Design uses these.)

Notable legal color for events:
- **Kirisute gomen** — a samurai's claimed right to cut down a commoner for gross insolence. In practice it triggered investigations; unjustified use ruined the samurai. Great tension generator in samurai-vs-commoner events.
  - *Rōnin and kirisute gomen.* It was a right against commoners, so an armed rōnin (still wearing two swords, still claiming samurai status) was not its proper target; a samurai who cut down a rōnin was in a quarrel between armed men, not exercising a privilege. Whether a rōnin, having no lord to answer to, could himself *invoke* it is unclear; treat his standing as ambiguous and never as a clean right. Needs verification: rōnin legal status in 1648 (in Edo they seem to have fallen under the town magistrates' registers, verify).
  - *Timing.* The right was customary in 1648; its best-known written form is in the *Kujikata Osadamegaki* of 1742 (verify article), a century after our window. Event text should say "custom" or "claimed right", not "the law says".
  - *Quarrels between samurai* fell under **kenka ryōseibai** ("both parties to a quarrel are punished"), a principle inherited from Sengoku domain codes (established as a principle; its exact application in 1648 needs verification). A retainer who draws on a rōnin risks his own position too, which is why "no easy cut" in `kirisute_tension` holds.
- **Adauchi (vendetta)** — legal *only* with domain authorization and a paper trail. Unlicensed revenge = murder = crucifixion/exposure. This structures the ronin revenge quest honestly.
- **Dueling** — the shogunate suppressed private hatashiai duels; they persist illegally. Duels are therefore always a crime-adjacent, secrecy-flavored affair.
- **Sword carry** — a commoner owning a katana is itself suspicious; a ronin's sword is his only asset and his identity card.

### B3. The road: Tōkaidō travel system

- **Gokaidō** — five shogunate highways; the Tōkaidō (~500 km, 53 post stations) runs Edo ↔ Kyoto along the coast. Zero point: Nihonbashi bridge, Edo.
- **Post stations (shukuba)** — hatago inns for commoners/lower samurai, honjin for officials, toiyaba freight/porter offices, stables, teahouses. ~40–50 km per day on foot.
- **Sekisho checkpoints** — inspect travel permits (**tegata**), look for wanted criminals, fleeing samurai, and (especially) "women entering Edo, guns leaving" — arms and hostages were the shogunate's nightmare. **Hakone and Arai** were famously the strictest.
- **In practice the system leaks** — permits could be *bought* near lax checkpoints, guides led people around barriers at night (one barrier literally had a paid crawl-hole), peasants often waved through if they looked harmless. **This gap between law and practice is a skill-check goldmine**: bluff, bribe, sneak, or ford.
- **Sekisho-yaburi (barrier-breaking)** — on the books a capital crime. The 1742 *Kujikata Osadamegaki* sets crucifixion (haritsuke) for breaking or sneaking around a barrier, with guides/accomplices also punished severely (verify exact clauses); the code postdates 1648, so the penalty in our window is not codified in the same form (verify, but assume grave). Hakone's Otama-ga-ike is named for a woman executed for it (traditionally 1702, verify). In practice officials often avoided prosecution by recording a caught traveler as having "lost the way" and turning him back (partly verified; this is the argument of Vaporis's work on Edo travel, verify). Note: `checkpoint_hakone`'s "rough you up before letting you go" fits the in-practice leniency, but a codex card must state the capital penalty on paper.
- **Ōi river** — no bridges, no ferries allowed by policy (a deliberate military chokepoint); travelers paid porters to be carried across. Floods could strand a station for days.
  - *Dating the kawagoshi system.* The formal system (river offices, kawa-kaisho, at Shimada and Kanaya; fixed fares by water depth; paid tickets) is generally dated to 1696 (Genroku 9, verify). In 1648 porters worked the crossing, but on a looser, less regulated basis, so "guild" overstates the organization. Needs verification: whether unassisted fording was already forbidden before the formal system. After it, travelers were required to use the official porters, so self-fording became illegal, not just risky. Note: `river_ford_oi`'s "porter guild" is slightly anachronistic for 1648; its free self-ford is defensible only for the pre-formal period (verify).
- **Transport** — walking, kago palanquins (expensive), pack horses at relay stations. Daimyō sankin-kōtai processions of hundreds to thousands of people take priority at fords and inns — a traveler can be stuck, robbed of lodging, or hired by the procession.

### B4. Money & prices (researched ranges; game will fix its own table)

- Coinage: gold **ryō** (koban), silver **bu** (1 ryō = 4 bu), copper **mon** (strings of 96–100). Exchange floated; the game will fix **1 ryō = 1,000 mon** for clarity and flag it as a simplification.
- Samurai stipends: low-ranking retainers earned on the order of tens of koku/year — and were perpetually in debt because stipends were paid in rice sold through brokers at fluctuating prices.
- Rough period costs (for event writing): a bowl of noodles ~16–20 mon; a night at a cheap inn ~100–200 mon; a kago ride ~a ryō or more per day; a decent katana ~1–3 ryō; a masterwork blade 10+ ryō; loan-shark interest in the underworld exceeded 100%/year.

### B5. Cities

- **Edo** — shōgun's capital, construction boom, population climbing toward half a million in our window. Samurai districts (Yamanote) vs merchant shitamachi. Fire-prone wooden city ("flowers of Edo"), organized town fire brigades coming into being. Kodenmachō prison; execution grounds at the city edge (Suzugamori). Nihonbashi market, Yoshiwara quarter, kabuki theaters.
- **Kyoto** — imperial capital, court and temple economy, artisans, older aristocratic tone. Eastern terminus of the Tōkaidō (Sanjō bridge).
- **Osaka** — "the nation's kitchen": rice markets, warehousing, money. Where a merchant run goes to get rich or ruined. Also historically the last Toyotomi stronghold — rōnin sympathies linger.
- **Sunpu** — Tokugawa retirement castle city; the Keian conspirators' secondary target; on the Tōkaidō.

### B6. Law & order

- City administration: **machi-bugyō** (magistrates) — famous Ōoka Tadasuke comes slightly later, but the office exists. Under them **dōshin** (low-ranking police officials, samurai) and their non-samurai assistants/informants (**okappiki/komono** — often ex-criminals themselves).
- Justice is fast and brutal: crucifixion for arson/theft of arms, exposure of heads, tattooing, exile, imprisonment at Kodenmachō. Collective family punishment was normal (the Keian conspirators' families were executed).
- Neighborhood self-surveillance: the **gonin-gumi** five-household responsibility system — your neighbors are legally liable for your crimes. Excellent for "the village turns on you" events.
  - *Gonin-gumi and strangers.* The system was pushed by the shogunate in the 1630s–40s alongside the anti-Christian campaign, and mutual surveillance for Christians and criminals was part of its purpose from the start (established). Village gonin-gumi registers opened with lists of rules (maegaki); these commonly included not lodging or harboring suspicious persons and reporting strangers and rōnin (partly verified). Needs verification: how standard such clauses were by 1648, since the maegaki grew longer later in the century and rōnin controls tightened after the 1651 Keian plot. `five_households` ("any stranger they fail to report") is defensible but should read as local practice, not a uniform national rule.
- Temple registration (**uke-sei/terauke**) — every person certified through a Buddhist temple; post-Shimabara, Christians were hunted with **fumi-e** (trampling sacred images) tests.

### B7. The underworld

- **Bakuto** — itinerant illegal gamblers; roadside dens (**bakuchiba**) in bamboo-and-cloth huts at town edges, abandoned temples. Ran loan-sharking, protection, and the dice game **chō-han**: two dice in a cup, bet on even (chō) or odd (han); the dealer calls the result. House used loaded dice; professional gamblers were rumored to be able to tell the roll by sound. Bakuto culture = oyabun/kobun patronage, full-body tattoos, a code of **ninkyō** (chivalry toward commoners) — the direct ancestors of the yakuza.
- **Tekiya** — itinerant peddlers controlling festival stall allocation, protection rackets, shoddy goods.
- **Kabukimono** — flamboyant violent gangs of rōnin and town toughs, peaked ~1600–1650 and declining in our window, but perfect as enemies/employers; known for outrageous dress, street violence, tsujigiri.
- **Otokodate** — "manly helpers," town-champion figures who opposed samurai arrogance; folk heroes.

### B8. Culture & daily life (for flavor writing)

- Food: rice (status food), millet/daikon for the poor, soba and ukiyo snacks spreading in cities, sake everywhere, tea houses as info hubs. Famine food: bracken, bark flour.
- Shelter: hatago inns (tiered by price), temple lodging, sleeping rough under eaves or in straw capes.
- Sights on the road: ichirizuka distance mounds, pine-lined highway, Fuji views (the reason Fujisawa/Odawara stations were famous), pilgrim traffic to Ise, Mt. Fuji cults, beggars at bridges, sumo fundraisers at shrines (rōnin wrestlers performed street-corner sumo for money — documented ronin side-hustle), medicine peddlers, monkey trainers, biwa priests.
- Sword culture: polishing, registering blades, famous smiths' signatures inflating value; daishō etiquette indoors (wakizashi stays on); a nicked blade = ruined asset.
  - *Polishers (togishi).* Polishing was a specialist craft separate from smithing well before 1648 (established). The Hon'ami family served as hereditary polishers and appraisers to the Ashikaga and then the Tokugawa, and issued appraisal certificates (origami) (established; start date of origami, verify). Polishers worked from progressively finer stones, and removing a nick means taking steel off the whole surface around it, so a proper polish took days, not hours (modern practice is one to several weeks; period timescale needs verification). Amateur stone-work easily ruins a blade's geometry (established). Needs verification: how common polishers were in Tōkaidō post-towns, as against Kyoto, Edo and castle towns. Note: in `polishers_bench`, the paid option's "works through the afternoon" and "nick is gone" understates the time a real polish took.
- Weather/seasons as mechanics: plum rains flood the Ōi river; summer heat and cholera-like illness; typhoon season wrecks the coast; winter snow closes mountain passes.

---

## Part C — History → mechanics mapping (the design opportunities)

| Historical fact | Game mechanic it becomes |
|---|---|
| Rōnin surplus + Keian plot (1651) | The shared "spine" event chain all runs approach; multiple Acts-3 outcomes (join / betray / ignore / suppress the plot) |
| Sekisho permits, lax vs strict barriers | Recurring travel check events: bribe, bluff, sneak, ford — class-dependent difficulty (samurai flagged on ronin lists; peasant flagged as runaway; woman needs better papers) |
| Chō-han gambling | The pre-combat risk roll (replaces LiA's d20) and a full gambling mini-system |
| Class system + sumptuary laws | Choice gating: a commoner can't enter the honjin; a samurai can't legally work; a merchant can buy his way anywhere but carries no sword |
| Kirisute gomen / adauchi licensing | Revenge arc with legal vs illegal paths → wildly different endings (honored vendetta vs crucifixion) |
| Gonin-gumi collective responsibility | Crimes escalate a hidden **Suspicion** track; villages/neighborhoods become hostile; arrest event chains + prison break content |
| Kan'ei famine | Peasant origin + moral-choice events (steal rice? share rice?) that set the Gi (righteous) vs underworld alignment |
| Uke-sei / fumi-e persecution | Hidden Christian bonus Tale — highest difficulty, paranoia-driven run |
| Ōi river porter guild monopoly | Pay-vs-ford-vs-wait decision node; flood = stranded = forced events |
| Sankin-kōtai processions | Random "road is jammed" events: hired as procession labor (safe money), or rob the baggage train (infamy) |
| Loan-sharking at 100%+ interest | Debtor origin's ticking-clock quest: interest accrues per act |
| Fire-prone Edo | Set-piece disaster events with save-people-vs-save-goods choices |
| Musashi's fresh legend | Book/scroll items and a sword-school encounter; his *Go Rin no Sho* as a rare training item |

### Source list

- Life In Adventure — wiki: https://lifeinadventure.wiki.gg/
- MiniReview — Life in Adventure: https://minireview.io/adventure/life-in-adventure
- Hardcore Droid — Life In Adventure Review: https://www.hardcoredroid.com/life-in-adventure-review/
- Google Play — Life in Adventure: https://play.google.com/store/apps/details?id=com.StudioWheel.Bard
- r/LifeInAdventure — "massive fatal flaw" (RNG/ending-gating criticism): https://www.reddit.com/r/LifeInAdventure/comments/xdbv7g/
- r/LifeInAdventure — "what do the stats mean": https://www.reddit.com/r/LifeInAdventure/comments/ygc43m/
- Yui Shōsetsu — Wikipedia: https://en.wikipedia.org/wiki/Yui_Sh%C5%8Dsetsu
- Keian Uprising — overview: https://en-academic.com/dic.nsf/enwiki/549539
- Keian Uprising — Grokipedia entry (plot details, executions, aftermath): https://grokipedia.com/page/keian
- Ronin in the Edo period (numbers, Tokaido banditry): https://tokugawasamurai.weebly.com/ronin.html
- Kabukimono — Wikipedia: https://en.wikipedia.org/wiki/Kabukimono
- Kabukimono — Grokipedia (tsujigiri, suppression, chōnin response): https://grokipedia.com/page/Kabukimono
- Edo-period travel control, sekisho practice (AskHistorians): https://www.reddit.com/r/AskHistorians/comments/6hh4fm/
- Edo Five Highways (Tokyo Metro govt.): https://edolegacytravel.metro.tokyo.lg.jp/films/edo-five-highways-the-roads-that-built-japan/
- Fifty-three Stations of the Tōkaidō: https://grokipedia.com/page/The_Fifty-three_Stations_of_the_T%C5%8Dkaid%C5%8D
- Tōkaidō history overview (The Collector): https://www.thecollector.com/a-historical-overview-what-was-japans-tokaido-road/
- Bakuto (chō-han, dens, loan-sharking, ninkyō): https://grokipedia.com/page/Bakuto
- Chō-han rules/history: https://desdemonasparadise.neocities.org/games/cho-han/cho-han
- Yakuza origins — tekiya/bakuto: https://japanbwoe.wordpress.com/2023-12-29/all-about-the-yakuza/
- Ronin & sumo side-hustles: http://rubens.anu.edu.au/raid1/student_projects97/sumo/history/eedo.html
- Samurai daily life, stipends & debt: https://www.samuraiswordkeyring.com/learn/daily-life-samurai

*Note: some secondary figures (rōnin population estimates, mon/ryō exchange) vary between sources; the game will fix simplified constants and flag them as gameplay simplifications.*

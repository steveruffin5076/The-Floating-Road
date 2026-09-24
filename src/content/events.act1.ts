// Act 1 event pool for the vertical slice (Tale 1, rōnin). 24 events total
// (1 forced intro + 23 in the weighted bag): enough to cover a check on every
// stat at least once and run a full ~13-event Act 1 (GDD §3) without heavy
// same-run repetition. Content volume is still intentionally small — the MVP
// scope (GDD §16) calls for 60+24 events; this is the pre-MVP checkpoint,
// not the real pool.
import type { GameEvent, StoryEvent } from '../engine/types';

// Drawn first, always, before the weighted bag — a one-time scene-setter,
// not part of the repeatable pool.
export const INTRO_EVENT: StoryEvent = {
  id: 'wayside_shrine',
  type: 'story',
  title: 'A Wayside Shrine',
  body:
    "Kyoto is two days behind you now. Your master's house is ash and a name in a confiscation ledger; " +
    'you are a masterless blade on the Tōkaidō, same as thousands of others since Sekigahara. ' +
    'A roadside shrine offers a place to leave a coin, if you have one to spare.',
  weight: 1,
  choices: [
    {
      text: 'Leave a coin and pray for the road ahead.',
      onResolve: {
        text: 'You press your palms together. It costs little and settles something in your chest.',
        effects: { money: -10, resolve: 1 },
      },
    },
    {
      text: 'Walk on without looking back.',
      onResolve: {
        text: "There's no one left to pray to on your behalf. You keep walking.",
        effects: { resolve: -1 },
      },
    },
  ],
};

export const ACT1_EVENTS: GameEvent[] = [
  {
    id: 'checkpoint_hakone',
    type: 'story',
    title: 'The Barrier at Hakone',
    body:
      'The sekisho at Hakone is the strictest on the whole road: guards checking travel permits against ' +
      'a posted list of wanted men. Your papers are old, issued by a house that no longer exists.',
    weight: 2,
    choices: [
      {
        text: 'Talk your way past with a confident story.',
        check: { stat: 'kuchi', dc: 4 },
        onSuccess: { text: 'The guard waves you through, bored and unconvinced enough to not care.' },
        onFailure: {
          text:
            'The guard squints at your papers too long. A string of mon on his tray, "for the guardhouse ' +
            'brazier," shortens his reading.',
          effects: { money: -30, suspicion: 1 },
        },
      },
      {
        text: 'Slip around the checkpoint after dark.',
        check: { stat: 'me', dc: 6 },
        onSuccess: { text: 'You find the gap in the patrol pattern and cross unseen.' },
        onFailure: {
          text: 'A patrol catches you scrambling over the ditch. They rough you up before letting you go.',
          effects: { health: -3, suspicion: 2 },
        },
      },
      {
        text: 'Simply pay the guard to look elsewhere.',
        onResolve: {
          text: 'Money changes hands. Even a bought guard at Hakone remembers a face.',
          effects: { money: -80, suspicion: 1 },
        },
      },
    ],
  },
  {
    id: 'hungry_villager',
    type: 'story',
    title: 'A Hungry Villager',
    body:
      'A farmer sits by the road with two thin children, the year having gone badly for rice. ' +
      'He does not beg outright, but he does not look away either.',
    weight: 2,
    choices: [
      {
        text: 'Share what rice you can spare.',
        onResolve: {
          text: 'It is not much, but the children eat first. The farmer bows too low for comfort.',
          effects: { money: -20, resolve: 1, gi: 2 },
        },
      },
      {
        text: "Keep your rations; you'll need them more than he thinks.",
        onResolve: {
          text: 'You walk on. The road has taught you that pity is a debt you cannot always afford.',
          effects: { gi: -2 },
        },
      },
    ],
  },
  {
    id: 'bandit_ambush',
    type: 'combat',
    title: 'Ambush on the Road',
    body:
      'Three men step out from the tree line where the road narrows — kabukimono toughs by their dress, ' +
      'or bandit rōnin same as you might have become. They want your purse, or your blade.',
    weight: 2,
    // Power 8 vs. the starting loadout (weaponTier 1, armor 0) puts base
    // win% at ~44-68% depending on Chikara+Waza investment (see
    // progress.md's combat-numbers pass) — winnable but not free, and no
    // longer the sim-flagged "Act 1 harder than Act 3" placeholder (was 10).
    foe: { name: 'Bandit rōnin', power: 8 },
    onWin: {
      text: 'One breaks and runs; the other two follow. You take their dropped coin as a toll for the trouble.',
      effects: { money: 60 },
    },
    onLose: {
      text: 'You come out of it bleeding and lighter of pocket, grateful only that you came out of it at all.',
      effects: { health: -8 },
    },
  },
  {
    id: 'day_labor',
    type: 'story',
    title: 'Procession Day-Labor',
    body:
      "A daimyō's sankin-kōtai procession, marching to his alternate year in Edo, has stalled ahead, and " +
      'its porters are short-handed. ' +
      'Honest work, if grueling — hauling baggage for men who will never learn your name.',
    weight: 2,
    choices: [
      {
        text: 'Take the heaviest loads for the best pay.',
        check: { stat: 'chikara', dc: 4 },
        onSuccess: {
          text:
            'You set your swords in the foreman’s keeping and shoulder crates beside men who would have ' +
            'bowed to your father. You carry your share and more. The foreman pays fairly.',
          effects: { money: 70, resolve: -1 },
        },
        onFailure: {
          text: 'Your back gives out under the third crate. You finish the day sore and underpaid.',
          effects: { money: 20, health: -2, resolve: -1 },
        },
      },
      {
        text: "Move on — it isn't worth the risk today.",
        onResolve: { text: 'You leave the procession to its own porters and keep walking.' },
      },
    ],
  },
  {
    id: 'gambling_den',
    type: 'story',
    title: 'A Bakuchiba Off the Road',
    body:
      'Past the tree line, a bamboo-and-cloth hut hides a chō-han game — two dice, a cup, and men who ' +
      'watch the roll a little too closely. They say a professional ear can tell odd from even by the ' +
      'sound of the dice alone.',
    weight: 1,
    choices: [
      {
        text: 'Wager 50 mon, reading the dice by ear.',
        check: { stat: 'waza', dc: 6 },
        onSuccess: { text: 'You call it right. The house pays out, unhappily.', effects: { money: 100 } },
        onFailure: { text: 'The dice favor the house, as they usually do.', effects: { money: -50 } },
      },
      {
        text: "Walk past — it isn't worth the risk.",
        onResolve: { text: 'You keep your coin and your evening quiet.' },
      },
    ],
  },
  {
    id: 'suspicious_offer',
    type: 'story',
    title: 'A Quiet Word in an Alley',
    body:
      'A man with a fence’s eyes falls into step beside you near a post-town’s edge. He has ' +
      'work, he says, for someone not too particular about whose goods they carry.',
    weight: 1,
    choices: [
      {
        text: 'Take the job.',
        onResolve: {
          text: "You don't ask what's in the crate. The pay is good precisely because no one asks.",
          effects: { money: 90, suspicion: 2, gi: -2 },
        },
      },
      {
        text: 'Refuse and walk away.',
        onResolve: { text: 'You leave him to find someone less particular.', effects: { gi: 1 } },
      },
    ],
  },
  {
    id: 'medicine_seller',
    type: 'story',
    title: 'The Medicine Seller’s Stall',
    body:
      'A peddler at the post-town edge hawks kintan pills against every ailment. Some stalls sell the ' +
      'real thing; most sell colored flour. A little learning tells the difference.',
    weight: 1,
    choices: [
      {
        text: 'Judge the medicine by what you know of it.',
        check: { stat: 'chi', dc: 4 },
        onSuccess: {
          text: 'You spot the genuine batch and haggle him down besides.',
          effects: { money: -30, health: 3 },
        },
        onFailure: {
          text: 'You pay for what turns out to be mostly rice flour. It does nothing.',
          effects: { money: -40 },
        },
      },
      {
        text: 'Just pay the asking price and move on.',
        onResolve: { text: 'It helps a little, or you convince yourself it does.', effects: { money: -60, health: 2 } },
      },
    ],
  },
  {
    id: 'night_tsujigiri',
    type: 'combat',
    title: 'Something in the Dark',
    body:
      'You wake to a shape crossing the road ahead in the moonlight — a tsujigiri, a night-cutter who ' +
      'tests his blade on whoever walks past. The law banned this decades ago. The law is far away tonight.',
    weight: 1,
    // One step harder than the ambush (power 9, ~38-62% base win%) for the
    // "surprise night attack" flavor, without the encounter order guarantee
    // to lean on — the bag can draw either combat event first (was 12).
    foe: { name: 'Night tsujigiri attacker', power: 9 },
    onWin: {
      text:
        'He misjudged you. You leave him where he falls and take back the road. By morning someone will ' +
        'find him, and someone will remember an armed stranger walked this stretch last night.',
      effects: { money: 20, suspicion: 1 },
    },
    onLose: {
      text: 'He is faster than he looked. You crawl the last stretch to the next light you can find.',
      effects: { health: -10 },
    },
  },
  {
    id: 'kirisute_tension',
    type: 'story',
    title: 'A Drunken Retainer’s Insult',
    body:
      'A low-ranking retainer, deep in his cups outside a teahouse, decides your face offends him. You ' +
      'wear two swords, same as he does, so the law gives him no easy cut: kirisute gomen, a samurai’s ' +
      'right to strike down a commoner for gross insolence, is not meant for men like you, and even ' +
      'against a townsman it means an inquiry afterward. But he is drunk, you are masterless, and no ' +
      'lord will come asking after you.',
    weight: 1,
    choices: [
      {
        text: 'Meet his eyes without flinching.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: {
          text: 'He blinks first. The crowd noticed, and so did he.',
          effects: { reputation: 1 },
        },
        onFailure: {
          text: 'He shoves you into the mud to prove his point, and no one intervenes.',
          effects: { health: -4, suspicion: 1 },
        },
      },
      {
        text: 'Bow low and let it pass.',
        onResolve: { text: 'It costs you nothing but the taste of it.', effects: { resolve: -1 } },
      },
    ],
  },
  {
    id: 'river_ford_oi',
    type: 'story',
    title: 'The Ōi River',
    body:
      'No bridge, no ferry — shogunate policy, a deliberate chokepoint. The porters at the bank will carry you ' +
      'across for a price; the current will carry you across for free, if you can manage it.',
    weight: 1,
    choices: [
      {
        text: 'Pay the porters to carry you across.',
        onResolve: { text: 'Dry and unhurried, for a price.', effects: { money: -40 } },
      },
      {
        text: 'Ford it yourself and save the coin.',
        check: { stat: 'chikara', dc: 6 },
        onSuccess: { text: 'Cold, but you keep your footing the whole way.' },
        onFailure: {
          text: 'The current takes your feet out and half your pack with them.',
          effects: { health: -3, money: -20 },
        },
      },
    ],
  },
  {
    id: 'sumo_exhibition',
    type: 'story',
    title: 'A Shrine Sumo Bout',
    body:
      'A shrine is raising money with an open sumo bout. Masterless men have wrestled at such ' +
      'fund-raisers for as long as there have been masterless men. Win, and the crowd’s coin is yours.',
    weight: 1,
    choices: [
      {
        text: 'Step into the ring.',
        check: { stat: 'chikara', dc: 6 },
        onSuccess: { text: 'You put your man on his back to a decent cheer.', effects: { money: 80, reputation: 1 } },
        onFailure: {
          text: 'You are on your back inside a breath, to a much louder laugh.',
          effects: { health: -2, resolve: -1 },
        },
      },
      {
        text: 'Watch from the crowd instead.',
        onResolve: { text: 'You keep your dignity and your coin both.' },
      },
    ],
  },
  {
    id: 'letter_writer',
    type: 'story',
    title: 'Temple Copying Work',
    body:
      'A temple scribe, overloaded with sutra copies and petition letters for illiterate travelers, offers ' +
      'a day’s pay to whoever can write a clean hand.',
    weight: 1,
    choices: [
      {
        text: 'Take the copying work.',
        check: { stat: 'chi', dc: 4 },
        onSuccess: { text: 'Your hand is steady and your characters correct. He pays in full.', effects: { money: 60 } },
        onFailure: {
          text: 'Your characters are passable, not fine. He pays you for a half-day’s work.',
          effects: { money: 20 },
        },
      },
      {
        text: 'Decline — writing was never your trade.',
        onResolve: { text: 'You leave the scribe to find a steadier hand.' },
      },
    ],
  },
  {
    id: 'shrine_festival',
    type: 'story',
    title: 'A Festival in a Lean Year',
    body:
      'Despite a hard year, the village holds its shrine festival anyway — lanterns, cheap sake, a ' +
      'reason to forget the empty granaries for one night.',
    weight: 1,
    choices: [
      {
        text: 'Join the dancing and spend a little.',
        onResolve: { text: 'For one night, you are just another face at the festival.', effects: { money: -20, resolve: 2 } },
      },
      {
        text: 'Watch from the road, saving your coin.',
        onResolve: { text: 'You keep walking, the lanterns shrinking behind you.' },
      },
    ],
  },
  {
    id: 'informant_whisper',
    type: 'story',
    title: 'An Okappiki’s Questions',
    body:
      'A man who is not quite a dōshin, a magistrate’s constable, but works for one, falls in beside ' +
      'you at the village well — an ' +
      'informant, paid to notice travelers whose papers do not quite match their story.',
    weight: 1,
    choices: [
      {
        text: 'Answer his questions smoothly.',
        check: { stat: 'kuchi', dc: 6 },
        onSuccess: { text: 'He loses interest halfway through your story and wanders off.' },
        onFailure: {
          text: 'He writes something down before he leaves. You do not see what.',
          effects: { suspicion: 2 },
        },
      },
      {
        text: 'Offer him a small "gift" instead.',
        onResolve: { text: 'He pockets it without a word and finds someone else to bother.', effects: { money: -40 } },
      },
    ],
  },
  // source: 01 §B1, 1645 row
  {
    id: 'musashi_scroll',
    type: 'story',
    title: 'A Copied Page',
    body:
      'A stall-keeper offers what he swears is a page from Go Rin no Sho, the Book of Five Rings, which ' +
      'Musashi wrote for his students a few years before he died. The old sword-saint’s name sells ' +
      'anything. Almost no one outside his school has seen the book; that has not stopped anyone selling it.',
    weight: 1,
    choices: [
      {
        text: 'Examine it closely before buying.',
        check: { stat: 'chi', dc: 6 },
        onSuccess: {
          text:
            'The brushwork is a student’s, not a forger’s: a school copy, sold by someone who needed rice ' +
            'more than strategy.',
          effects: { money: -30, resolve: 1 },
        },
        onFailure: { text: 'You pay too much for what is almost certainly a forgery.', effects: { money: -50, resolve: -1 } },
      },
      {
        text: 'Not interested — keep walking.',
        onResolve: { text: 'Real or not, you have no coin to waste on paper.' },
      },
    ],
  },
  {
    id: 'fire_disaster',
    type: 'story',
    title: 'Fire in the Post-Town',
    body:
      'Smoke and shouting wake the whole post-town at once — a lamp caught the thatch of a hatago inn, and ' +
      'these wooden buildings burn fast. People are still inside.',
    weight: 1,
    choices: [
      {
        text: 'Go back in to help.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: { text: 'You get an old woman and a child out before the roof goes.', effects: { reputation: 2, resolve: 1 } },
        onFailure: {
          text: 'The smoke beats you back before you can do any good, and it costs you.',
          effects: { health: -4, resolve: -1 },
        },
      },
      {
        text: 'Grab your own gear and get clear.',
        onResolve: { text: 'You watch from a safe distance with your pack intact.', effects: { gi: -1 } },
      },
    ],
  },
  {
    id: 'pickpocket_crowd',
    type: 'story',
    title: 'A Crowded Market',
    body:
      'The post-town market is thick enough that a careful hand could lift a purse and no one would ' +
      'notice — or so it looks from here.',
    weight: 1,
    choices: [
      {
        text: 'Lift a purse in the crowd.',
        check: { stat: 'waza', dc: 6 },
        onSuccess: { text: 'Clean and quick. No one so much as glances your way.', effects: { money: 50, gi: -2 } },
        onFailure: {
          text: 'A shout goes up before you’ve gone three steps. You talk your way clear, barely.',
          effects: { suspicion: 3, reputation: -1 },
        },
      },
      {
        text: 'Enjoy the market honestly instead.',
        onResolve: { text: 'You keep your hands to yourself and your conscience clean.' },
      },
    ],
  },
  {
    id: 'watching_the_road',
    type: 'story',
    title: 'Something Wrong Ahead',
    body:
      'The treeline ahead is too quiet — no birds, no wind through the right branches. Years on the road ' +
      'teach you to notice what isn’t there.',
    weight: 1,
    choices: [
      {
        text: 'Trust your instincts and take the long way around.',
        check: { stat: 'me', dc: 4 },
        onSuccess: { text: 'Whatever was waiting there, you never find out. That is the point.', effects: { resolve: 1 } },
        onFailure: { text: 'You lose an hour circling for nothing you can name.', effects: { resolve: -1 } },
      },
      {
        text: 'Push straight through anyway.',
        onResolve: { text: 'Nothing happens. Maybe nothing was going to.' },
      },
    ],
  },
  // codex: a daimyō's procession took priority at inns, and ordinary travelers were turned out of
  // lodging they had paid for; the honjin was reserved for lords and officials (01 §B3).
  // Adapts 03 §6 post-town "procession lodging seizure", with a touch of "the honjin door you can't enter".
  {
    id: 'lodging_seized',
    type: 'story',
    title: 'No Room at the Station',
    body:
      'A daimyō, a domain lord, has reached the post-town ahead of you with his whole procession. His ' +
      'household fills the honjin, the inn kept for lords and officials, and his retainers fill ' +
      'everything else. The innkeeper who took your coin at noon meets you at the door with the coin ' +
      'in his hand and his eyes on the floor. Your room has gone to three foot soldiers in the lord’s ' +
      'colors. One of them leans on the rail above and calls down that the stable has room for a ' +
      'masterless dog.',
    weight: 1,
    choices: [
      {
        text: 'Hold his eye until he looks away.',
        check: { stat: 'tan', dc: 5 },
        onSuccess: {
          text:
            'He finds something else to look at. The innkeeper, ashamed in front of the street, gives you ' +
            'his own family’s back room for the same coin.',
          effects: { resolve: 1 },
        },
        onFailure: {
          text:
            'He comes down the stairs with two friends. You leave with a split lip, and the whole street ' +
            'watches you go.',
          effects: { health: -2, resolve: -1, suspicion: 1 },
        },
      },
      {
        text: 'Sleep in the stable, as offered.',
        onResolve: {
          text: 'The horses do not mind you. The foot soldiers make sure you hear them laugh about it.',
          effects: { resolve: -2 },
        },
      },
      {
        text: 'Take back your coin and find a dry stretch of eaves.',
        onResolve: {
          text: 'Your pride stays dry. Nothing else does.',
          effects: { health: -2 },
        },
      },
    ],
  },
  // codex: under the gonin-gumi system, households were legally liable for each other's crimes,
  // which made every village watch and report strangers (01 §B6).
  // Adapts 03 §6 village "gonin-gumi meeting overhears you".
  {
    id: 'five_households',
    type: 'story',
    title: 'Five Households',
    body:
      'You stop at a village well to drink. By the time you straighten, four men are standing by the ' +
      'headman’s gate, not quite looking at you. Every family here belongs to a gonin-gumi, a group of ' +
      'five households who answer to the magistrate for each other’s crimes, and for any stranger they ' +
      'fail to report. A traveler with two swords and no lord is exactly the stranger that gets a whole ' +
      'group punished. They are deciding what you are.',
    weight: 1,
    choices: [
      {
        text: 'Go to the headman and give an honest account of yourself.',
        check: { stat: 'kuchi', dc: 5 },
        onSuccess: {
          text:
            'He writes you in his book as a traveler bound east, on no business of theirs. The men by the ' +
            'gate go back to their fields.',
        },
        onFailure: {
          text:
            'Your account has gaps a village headman is expected to notice. He writes it down anyway, gaps ' +
            'and all, and sends a boy up the road with the page.',
          effects: { suspicion: 1 },
        },
      },
      {
        text: 'Fill your gourd and be gone before they settle it.',
        check: { stat: 'me', dc: 4 },
        onSuccess: {
          text: 'You take the field path no one is watching. By the time they decide, there is nothing left to report.',
        },
        onFailure: {
          text:
            'A boy trails you to the last paddy and then runs the other way. Your description will reach ' +
            'the next village before you do.',
          effects: { suspicion: 2 },
        },
      },
      {
        text: 'Wait by the well and let them question you.',
        onResolve: {
          text:
            'It takes the afternoon. Your name, your lord, your father’s lord, your business, each asked ' +
            'twice. At the end they sell you rice at a stranger’s price and watch you to the edge of the fields.',
          effects: { money: -20, resolve: -1 },
        },
      },
    ],
  },
  // codex: teahouses were the road's information exchange, and a widow keeping a shop was one of
  // the few independent livelihoods open to a woman (01 §B8 "tea houses as info hubs"; §B2 Women).
  // Adapts 03 §6 post-town "teahouse rumor market" (an unnamed-station keeper, not O-Ryō, whose
  // chain belongs to Mariko).
  {
    id: 'widows_teahouse',
    type: 'story',
    title: 'The Widow’s Teahouse',
    body:
      'The teahouse at the edge of the station is small, clean, and full. Its keeper, O-Shige, has run ' +
      'it alone since her husband died, and she runs it on news as much as tea: every traveler brings ' +
      'some from the road behind, and she sells it on to the road ahead. She sets a cup in front of ' +
      'you, takes in your swords and the dust on your sandals, and asks, pleasantly, what the road ' +
      'looks like west of here. Behind her, a porter has stopped chewing to listen.',
    weight: 1,
    choices: [
      {
        text: 'Tell her what you saw on the road from Kyoto.',
        check: { stat: 'kuchi', dc: 3 },
        onSuccess: {
          text:
            'You tell it plainly: which bridge is under repair, which inn waters its sake. She weighs it ' +
            'the way a moneychanger weighs silver, and pays in kind: rice, pickles, and the name of the ' +
            'stretch ahead where men have been waiting in the trees.',
          effects: { health: 2, resolve: 1 },
        },
        onFailure: {
          text:
            'She has heard most of it already, from better talkers. Worse, you said more than you meant ' +
            'about the house you once served, and the porter heard it too.',
          effects: { money: -10, suspicion: 1 },
        },
      },
      {
        text: 'Ask what her own news costs.',
        onResolve: {
          text:
            'A hundred mon, she says, and she means it. For that she tells you which man at the well writes ' +
            'down the faces of armed travelers, and which back lane lets you avoid the well entirely.',
          effects: { money: -100, suspicion: -1 },
        },
      },
      {
        text: 'Drink your tea and keep your own counsel.',
        onResolve: {
          text:
            'She lets you. A keeper learns as much from what travelers will not say, and the tea is ' +
            'good. You leave a little steadier than you came.',
          effects: { money: -10, resolve: 1 },
        },
      },
    ],
  },
  // codex: a samurai's sword was his one real asset and the mark of his status; polishing was a
  // specialist's craft, and a nicked blade lost much of its value (01 §B8 sword culture; §B2 sword carry).
  // Adapts 03 §6 post-town "sword polish".
  {
    id: 'polishers_bench',
    type: 'story',
    title: 'The Polisher’s Bench',
    body:
      'Your blade took a nick somewhere between Kyoto and here, small enough to hide and big enough to ' +
      'catch a thumb. On the post-town’s back street, a togishi, a sword polisher, works under an ' +
      'awning with his stones laid out by grit, coarse to fine. Your sword is the only thing of value ' +
      'you own and the thing that says what you are; a nicked one sells for half. He names a price ' +
      'without looking up. He has an old stone you may borrow, he adds, if you would rather risk the ' +
      'steel than the coin.',
    weight: 1,
    choices: [
      {
        text: 'Pay his price.',
        onResolve: {
          text:
            'A true polish would take him days you do not have, so he takes the nick out and leaves the ' +
            'rest for another season. You wait two days at the station. The edge comes back clean.',
          effects: { money: -50, resolve: 1 },
        },
      },
      {
        text: 'Borrow the old stone and dress the nick yourself.',
        check: { stat: 'waza', dc: 5 },
        onSuccess: {
          text:
            'Slow strokes, the angle held. The nick is smaller, if not gone, and the polisher grunts, ' +
            'which may be praise.',
          effects: { resolve: 1 },
        },
        onFailure: {
          text:
            'You round the edge where you meant to hone it. The polisher sighs, takes the blade from you, ' +
            'and charges for the repair as well as the stone.',
          effects: { money: -60, resolve: -1 },
        },
      },
      {
        text: 'Leave it. It will hold for now.',
        onResolve: {
          text: 'It holds. Every time you draw it, your thumb finds the nick.',
          effects: { resolve: -1 },
        },
      },
    ],
  },
  // codex: many Tōkaidō rivers had no bridge; porters carried travelers and goods across, and rain
  // upstream could make a ford deadly in hours (01 §B3 Ōi river and floods; §B8 weather).
  // Adapts 03 §6 river-ford "rainy swim-rescue".
  {
    id: 'porter_in_the_current',
    type: 'story',
    title: 'A Porter in the Current',
    body:
      'Rain upstream has turned the ford brown and fast. Halfway across, a porter with a merchant’s ' +
      'trunk on his shoulders loses the bottom. The trunk goes one way and he goes the other. The ' +
      'other porters shout from the shallows but do not go in after him; they have seen what this ' +
      'river does to people who try. He comes up once, twenty paces downstream, and goes under again.',
    weight: 1,
    choices: [
      {
        text: 'Go in after him.',
        check: { stat: 'tan', dc: 5 },
        onSuccess: {
          text:
            'The cold takes your breath, and you go on without it. You get an arm across his chest and let ' +
            'the current carry you both to the gravel bar. The porters haul you out, and they will tell ' +
            'it at every ford on the road.',
          effects: { health: -1, reputation: 2, gi: 1 },
        },
        onFailure: {
          text:
            'The river turns you over twice. When you come up, the porters have him on a rope, and you ' +
            'are the one they have to fish out next.',
          effects: { health: -3, resolve: -1 },
        },
      },
      {
        text: 'Run the bank and get ahead of him.',
        check: { stat: 'me', dc: 4 },
        onSuccess: {
          text:
            'You read where the current bends and are standing on the rocks there when he comes past. ' +
            'A carrying pole, an outstretched hand, and he is out, coughing up river.',
          effects: { reputation: 1, gi: 1 },
        },
        onFailure: {
          text:
            'You guess the wrong bend. He fetches up on a gravel bar a hundred paces on, alive, and no ' +
            'thanks to you.',
          effects: { resolve: -1 },
        },
      },
      {
        text: 'Stay on the bank. It is his trade, not yours.',
        onResolve: {
          text: 'The porters get a rope to him in the end. None of them look at you as you pass.',
          effects: { gi: -1 },
        },
      },
    ],
  },
];

// Act 2 random event pool (Edo, 1649 to spring 1651). Thirteen events drawn from
// 03 §6's city-edo bank (one from the night bank), for the ~9-11 random slots
// in 11 §4.1's Act 2 slot map. None duplicate an Act 2 chain beat (11 §1.3):
// no livelihood choice, Yui's school, Katsuragi, Marubashi, Sagawa sweep,
// O-Ryō's letter or second job, and no crucified heads (the Act 3 spine).
//
// Tuning (12 §"After tuning", guidance for Acts 2-3): about -0.4 Resolve per
// event net over uniform choices, with the festival, a bowl of noodles and a
// few coins for a stranger as the counterweights. Health risk sits in the
// building site, the fire and the timber-yard fight. Checks run DC 5-7
// (02 §6; the validator allows up to 8 in Act 2).
//
// Player text is gender-neutral for pool sharing (02 §4.1). Several events
// assume the PC wears two swords; each one says so in its codex comment.
import type { GameEvent } from '../engine/types';

export const ACT2_EVENTS: GameEvent[] = [
  // codex: Nihonbashi was the zero point of the shogunate's highways and the
  // site of Edo's market; coinage ran in gold ryō and copper mon at a floating
  // exchange (01 §B3 Gokaidō; §B5 Edo; §B4 coinage). The game fixes 1 ryō =
  // 1,000 mon (01 §B4). Soba was spreading in the cities (01 §B8 food).
  // Adapts 03 §6 city-edo "Nihonbashi market dawn". Assumes two swords (the Tan choice).
  {
    id: 'edo_nihonbashi_dawn',
    type: 'story',
    title: 'Dawn at Nihonbashi',
    body:
      'Every distance on the five great roads is counted from this bridge, and at dawn half of Edo seems ' +
      'to be standing on it. The market at its foot is already loud: porters with baskets, sellers crying ' +
      'their prices, a man selling soba, buckwheat noodles, from a steaming box on a pole. At a ' +
      'money-changer’s stall, a countryman fresh off the Tōkaidō is changing a gold ryō coin into copper. ' +
      'The rate is posted, and it moves from day to day. The boy behind the counter is counting fast, ' +
      'and short. The countryman watches the strings of mon pile up and nods at each one. He cannot count ' +
      'that fast. You can.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Step up and count the strings aloud with him.',
        check: { stat: 'chi', dc: 5 },
        onSuccess: {
          text:
            'You name the day’s rate and count every string back to it. The boy finds a missing string ' +
            'under the counter, as if it had crept there on its own. The countryman presses thirty mon ' +
            'on you and will not hear a refusal.',
          effects: { money: 30, gi: 1 },
        },
        onFailure: {
          text:
            'You get the rate wrong by a string, and the boy corrects you, politely, for the whole market ' +
            'to hear. The countryman thanks you anyway, which is worse.',
          effects: { resolve: -1 },
        },
      },
      {
        text: 'Lean on the boy for a share of what he is skimming.',
        check: { stat: 'tan', dc: 5 },
        onSuccess: {
          text:
            'He looks at your swords, then at the countryman, and slides forty mon across when no one is ' +
            'watching. It is not much money to become this for.',
          effects: { money: 40, gi: -1, resolve: -1 },
        },
        onFailure: {
          text:
            'He is braver than he looks. He calls for his master, and his master calls you a masterless ' +
            'thief in front of the whole bridge.',
          effects: { suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Buy a bowl of soba and let the city be the city.',
        onResolve: {
          text:
            'The broth is hot, and the bowl costs more than it would on the road. By the time you finish, ' +
            'the countryman has gone, lighter than he came.',
          effects: { money: -30, health: 1 },
        },
      },
    ],
  },

  // codex: domain confiscations kept producing masterless samurai by the
  // hundreds of thousands, and sankin-kōtai kept every daimyō's household in
  // Edo, in the samurai districts (01 §B1 scale note; §B3 sekisho/hostages;
  // §B5 Yamanote). The rice-giving is one house's act, not a stated custom.
  // Adapts 03 §6 city-edo "ronin dole-line at a daimyō gate" (Resolve-, job
  // chance; 11 §2.2 names it as an employer_contracts source).
  {
    id: 'edo_gate_rice',
    type: 'story',
    title: 'Rice at the Side Gate',
    body:
      'In the samurai quarter, a daimyō, a domain lord, keeps his Edo household behind a long wall. This ' +
      'morning its side gate is open, and a steward is giving out rice to masterless samurai, for reasons ' +
      'the gatekeeper does not share. The line runs the length of the wall: faded crests, mended sleeves, ' +
      'backs held straight on purpose. Some have brought sons to carry the rice home. Nobody talks. A ' +
      'retainer walks the line from the step, looking faces over the way a buyer looks over horses. Now ' +
      'and then he taps a shoulder, and that one goes in through the gate. There is work inside for a few.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Take your place in the line.',
        onResolve: {
          text:
            'It takes the morning. When your turn comes, the steward pours a measure into your cloth ' +
            'without looking up, and says the house’s name so you will know whom to thank. You eat that ' +
            'night. You do not say the name.',
          effects: { health: 3, resolve: -2 },
        },
      },
      {
        text: 'Watch whom the retainer picks, and why.',
        check: { stat: 'me', dc: 6 },
        onSuccess: {
          text:
            'He passes over the proud and the ragged alike and taps those who stand as if they have ' +
            'somewhere to be. You stand that way. His finger finds your shoulder. Inside, a clerk writes ' +
            'your name down for escort work on the house’s next errand out of the city, and pays half in ' +
            'advance.',
          effects: { money: 150 },
          counters: { employer_contracts: 1 },
        },
        onFailure: {
          text:
            'You work out what he wants a moment too late and straighten just as he passes. He does not ' +
            'look back. You are still in the line, and everyone behind you saw you try. The rice, when it ' +
            'comes, tastes of it.',
          effects: { health: 3, resolve: -2 },
        },
      },
      {
        text: 'Bow for the rice the way you once bowed on the road.',
        requires: { flags: ['swallowed_insult'] },
        onResolve: {
          text:
            'You have paid this price before, and you know its exact weight now. You bow correctly, take ' +
            'the rice, and carry it home without tasting the bow at all. Almost.',
          effects: { health: 3, resolve: -1 },
        },
      },
      {
        text: 'Walk away before anyone sees your face.',
        onResolve: {
          text: 'Your pride goes home with you. So does your stomach, empty.',
          effects: { health: -1, resolve: -1 },
        },
      },
    ],
  },

  // codex: Edo was in a construction boom, its population climbing toward half
  // a million (01 §B5). A samurai who works with their hands loses face (03 §1;
  // 08 S4), but clerking was ordinary samurai work in peacetime (01 §B2).
  // Adapts 03 §6 city-edo "construction site day-labor (Chikara)".
  // Assumes two swords (left in the shed).
  {
    id: 'edo_building_site',
    type: 'story',
    title: 'The New Mansion',
    body:
      'Edo builds as if it cannot build fast enough. On a cleared lot in the samurai quarter, a daimyō’s ' +
      'new mansion is going up in raw timber, the house of a domain lord who must keep a household in the ' +
      'city. The carpenters’ foreman needs backs: timber to haul, earth to carry, loads to count. He pays ' +
      'by the day, better than the road, because the city eats wages as fast as it pays them. He takes in ' +
      'your swords with one glance and offers you the timber gang anyway. A day with your hands is a day ' +
      'with your hands, he says. Behind him, a beam swings on its ropes over the heads of the men below.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Take the timber gang for the better pay.',
        check: { stat: 'chikara', dc: 6 },
        onSuccess: {
          text:
            'You leave your swords in the foreman’s shed and haul beside men who have never been asked ' +
            'their fathers’ names. You do your share and more. At dusk he pays you in full and does not ' +
            'remark on your hands.',
          effects: { money: 90, resolve: -1 },
        },
        onFailure: {
          text:
            'A rope slips on the third lift, and a beam comes down across your shoulder. The foreman pays ' +
            'you for half a day and tells you where to find a bonesetter.',
          effects: { health: -5, money: 30, resolve: -1 },
        },
      },
      {
        text: 'Offer to keep the tally of loads instead.',
        check: { stat: 'chi', dc: 5 },
        onSuccess: {
          text:
            'Clerk’s work, and no shame in it: plenty of samurai with lords do little else. Your count is ' +
            'clean, and the steward’s agent checks it twice and finds nothing. The pay is less. Your back ' +
            'goes home whole.',
          effects: { money: 60 },
        },
        onFailure: {
          text: 'You lose the count in the noon heat, and the agent catches it. He docks you for his trouble and gives the tally to a boy.',
          effects: { money: 20, resolve: -1 },
        },
      },
      {
        text: 'Walk on. You are not reduced to this yet.',
        onResolve: {
          text: 'You are not. You skip a meal to prove it.',
          effects: { health: -1 },
        },
      },
    ],
  },

  // codex: Edo was a fire-prone wooden city, and its town fire brigades were
  // only coming into being in these years (01 §B5). Fire technique (firebreaks,
  // hooks) is left out; 01 does not cover it.
  // Adapts 03 §6 city-edo "Edo fire (save-people vs save-goods)", as a story
  // event rather than a fire-power combat. Assumes two swords (the witness line).
  {
    id: 'edo_fire_in_the_ward',
    type: 'story',
    title: 'Fire in the Ward',
    body:
      'The alarm comes after midnight: a bell, then shouting, then the smell. Three lanes over, the back ' +
      'tenements of the merchant ward are burning, wood and paper going up roof to roof on the wind. This ' +
      'city is built to burn, and everyone in it knows it. The ward’s men are forming a line from the ' +
      'well with buckets. A woman stands in the lane calling a child’s name at a doorway full of smoke. A ' +
      'cloth merchant is dragging a strongbox out of his shop and looking for someone with shoulders, and ' +
      'he has coin in his other hand.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Go in through the smoke after the child.',
        check: { stat: 'tan', dc: 7 },
        onSuccess: {
          text:
            'You find the boy under a bedding chest, where he crawled to hide from the noise, and bring ' +
            'him out with your sleeve over his face. His mother does not let go of him to thank you. The ' +
            'lane saw it. By morning, so has the ward.',
          effects: { health: -2, reputation: 2, gi: 1, resolve: 1 },
        },
        onFailure: {
          text:
            'The heat turns you back at the second room. A neighbor gets the boy out through the back. You ' +
            'spend the night coughing, with burns across both hands.',
          effects: { health: -6, resolve: -1 },
        },
      },
      {
        text: 'Take a place on the bucket line.',
        check: { stat: 'chikara', dc: 5 },
        onSuccess: {
          text:
            'All night: full buckets forward, empty ones back. The fire stops two houses short of the ' +
            'well. Nobody asks who you are, and in the morning a townsman you never met hands you a rice ' +
            'ball.',
          effects: { health: -1, reputation: 1 },
        },
        onFailure: {
          text: 'A burning eave comes down near the well, and the line breaks. You are one of the people it breaks on.',
          effects: { health: -3, resolve: -1 },
        },
      },
      {
        text: 'Carry the merchant’s strongbox to safety for his coin.',
        onResolve: {
          text:
            'He pays you a hundred and fifty mon at the far end of the street and does not ask your name. ' +
            'Someone else will: a neighbor who watched a two-sworded stranger carry a strongbox out of a ' +
            'burning shop, and will describe you to anyone who asks. Behind you, the woman is still ' +
            'calling.',
          effects: { money: 150, gi: -1, suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Get your own things out and get clear.',
        check: { stat: 'me', dc: 5 },
        onSuccess: {
          text: 'You find the back way through the lanes with your pack on your shoulder. From two streets off, you watch it burn itself out.',
          effects: { resolve: -1 },
        },
        onFailure: {
          text: 'The smoke fills your lane before you reach it. You get out. Your pack does not.',
          effects: { health: -2, money: -60, resolve: -1 },
        },
      },
    ],
  },

  // codex: Kodenmachō was Edo's prison; tattooing was among the sentences the
  // magistrates handed down; the okappiki who served the dōshin were often
  // ex-criminals themselves (01 §B5; §B6). Where on the body the tattoo went,
  // and what this man did, are left unsaid: 01 does not specify either.
  // Adapts 03 §6 city-edo "Kodenmachō prison wall" (no inmate chain needed).
  {
    id: 'edo_kodenmacho_gate',
    type: 'story',
    title: 'Outside Kodenmachō',
    body:
      'The wall of Kodenmachō, the city’s jailhouse, runs the length of the street, and people walk on the ' +
      'far side without seeming to decide to. A small gate opens and a man comes out alone, blinking at the ' +
      'daylight. He is thin, forty or so, with the magistrates’ ink fresh on his skin: a tattoo given as ' +
      'part of a sentence, where it will show for the rest of his life. No one has come to meet him. ' +
      'Someone is waiting all the same. Against the opposite wall leans an okappiki, informant to a dōshin, ' +
      'one of the city magistrates’ constables, and like many in that trade a former convict himself. He ' +
      'falls in beside the released man with a friendly word about work. The released man looks past him, ' +
      'at you, as if you might be a second answer.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Buy him a bowl of noodles, and let him talk.',
        onResolve: {
          text:
            'He eats like someone who has been thinking about noodles for a year. He does not say what he ' +
            'did, and you do not ask. When he leaves, he walks in the opposite direction from the okappiki.',
          effects: { money: -30, resolve: 1, gi: 1 },
        },
      },
      {
        text: 'Tell him plainly what the okappiki’s work will cost him.',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'You say it without heat: the neighbors he will sell, the faces that will learn his. He hears ' +
            'you. He walks off with you, not the informant, and the informant watches you both to the ' +
            'corner, memorizing.',
          effects: { gi: 1, resolve: 1, suspicion: 1 },
        },
        onFailure: {
          text:
            'He listens, and then he does the arithmetic of an empty belly and goes with the okappiki. At ' +
            'the corner, they both look back at you.',
          effects: { suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Ask the okappiki whether he pays for names from lodging-houses.',
        onResolve: {
          text:
            'He does. The tenants in your lodging-house are masterless too, and some of them talk too much ' +
            'after dark. You give him two names. He gives you a hundred mon, and a look that says your own ' +
            'name is safe with him, for now.',
          effects: { money: 100, suspicion: -1, gi: -2, resolve: -2 },
        },
      },
    ],
  },

  // codex: the tekiya, itinerant peddlers, controlled festival stall
  // allocation and ran protection rackets (01 §B7).
  // Adapts 03 §6 city-edo "festival: Kanda matsuri crowd events", set at an
  // unnamed neighborhood shrine: 01 does not cover the Kanda festival itself.
  // The tekiya job is underworld work (gang_jobs, Gi/Aku -1; 11 §2.2).
  // Assumes two swords (the boss's reason for asking).
  {
    id: 'edo_festival_stalls',
    type: 'story',
    title: 'Stalls at the Shrine Festival',
    body:
      'The neighborhood shrine is holding its festival, and for one night the lanes around it are lanterns, ' +
      'drums and cheap sake. Every stall along the approach was placed by one man: a tekiya boss, head of ' +
      'the peddlers who decide which vendor sets up where at a festival, and at what price. He takes his ' +
      'cut in the open. An old woman selling grilled rice cakes has set up two paces past where he allowed, ' +
      'and two of his young men have kicked over her brazier and stand over her while she picks up the ' +
      'coals with her bare fingers. The boss sees your ' +
      'swords and waves you over. He could use a steady presence tonight, he says, and he pays in coin.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Spend a little and lose yourself in the crowd.',
        onResolve: {
          text:
            'You drink cheap sake, watch the drummers, and for a few hours no one in the crowd cares what ' +
            'you were. It costs more than a festival in the provinces. It is worth it.',
          effects: { money: -50, resolve: 2 },
        },
      },
      {
        text: 'Take the boss’s coin and keep order along his stalls.',
        check: { stat: 'chikara', dc: 6 },
        onSuccess: {
          text:
            'You walk the approach all night, and the stallholders pay faster when you are standing behind ' +
            'his collector. No one tests you. At dawn he counts a hundred mon into your hand and says he ' +
            'will remember you.',
          effects: { money: 100, gi: -1 },
          counters: { gang_jobs: 1 },
        },
        onFailure: {
          text:
            'A drunk carpenter tests you, and then his friends do. You come out on top in the end, bruised, ' +
            'and the boss pays you less for the noise.',
          effects: { money: 50, health: -3, gi: -1 },
          counters: { gang_jobs: 1 },
        },
      },
      {
        text: 'Step between the young men and the old woman’s stall.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: {
          text:
            'They look at your swords, then at their boss. He laughs and calls them off, as if it were his ' +
            'idea. The old woman rights her brazier, gives you a rice cake, and tells you exactly what she ' +
            'thinks of him.',
          effects: { reputation: 1, gi: 1, resolve: 1 },
        },
        onFailure: {
          text:
            'They do not back down, and there are more of them than there are of you. They throw you out of ' +
            'the festival in front of the whole lane, and her brazier stays where they kicked it.',
          effects: { health: -3, resolve: -2 },
        },
      },
    ],
  },

  // codex: stipends were paid in rice and sold through brokers, so low-ranking
  // samurai were chronically in debt to merchant moneylenders; a samurai's
  // sword was their one real asset, and the short sword stayed on indoors
  // (01 §B2 samurai, merchants, sword carry; §B4 stipends; §B8 daishō etiquette).
  // No interest rate is stated: 01's >100%/year figure is for underworld lenders.
  // Adapts 03 §6 city-edo "pawnshop row". Assumes two swords (the short sword pledge).
  {
    id: 'edo_moneylender_pledge',
    type: 'story',
    title: 'The Pledge Counter',
    body:
      'The moneylender’s shop stands on a lane of moneylenders, each with a counter at the front and a ' +
      'storehouse behind. Samurai with lords borrow here too: their stipends come in rice, sold through ' +
      'brokers at whatever rice will fetch, and many of them owe someone on this lane. You have no stipend ' +
      'to pledge. You have what you carry. The clerk has a scale for silver, a ledger, and an eye that has ' +
      'already priced your short sword. Ahead of you at the counter, a rōnin older than you is pledging a ' +
      'suit of armor. He is thirty mon short of the sum he came for, and he is not asking anyone for it.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Pledge your short sword.',
        onResolve: {
          text:
            'The clerk weighs it in both hands, names a sum, and gives you three hundred mon and a paper ' +
            'tag. Your hip feels wrong all the way home. Indoors, where a samurai keeps the short sword at ' +
            'their side, you keep your hands in your lap.',
          effects: { money: 300, resolve: -2 },
        },
      },
      {
        text: 'Pledge your spare clothes and bedding, and haggle hard.',
        check: { stat: 'kuchi', dc: 5 },
        onSuccess: {
          text: 'You talk him up from a price for rags to a price for cloth. A hundred and twenty mon, and the nights are colder for it.',
          effects: { money: 120, health: -1 },
        },
        onFailure: {
          text: 'He has heard every argument you make, and better ones. Sixty mon, and the nights are colder all the same.',
          effects: { money: 60, health: -1, resolve: -1 },
        },
      },
      {
        text: 'Put thirty mon on the counter for the old rōnin.',
        requires: { min: { money: 30 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 30 mon',
        onResolve: {
          text:
            'He looks at the coins for a long moment and then bows, exactly as deep as one bows to an ' +
            'equal. He does not ask your name. You leave with nothing pledged, and something else instead.',
          effects: { money: -30, resolve: 1, gi: 1 },
        },
      },
    ],
  },

  // codex: a famous smith's signature could multiply a blade's value, and only
  // samurai could wear two swords, so a commoner with a katana drew questions
  // (01 §B8 sword culture; §B2 samurai, sword carry). Hon'ami appraisal
  // certificates are left out: 01 flags their start date as unverified.
  // Adapts 03 §6 city-edo "sword-market appraisal". Assumes two swords (why the merchant asks).
  {
    id: 'edo_sword_appraisal',
    type: 'story',
    title: 'A Name Under the Hilt',
    body:
      'The sword dealer’s shop smells of oil. A rice merchant in good silk is turning a long sword in the ' +
      'light while the dealer tells him its smith’s name, a famous one, and the price that goes with it. ' +
      'The merchant may not wear it; two swords are for samurai alone. He means it as a gift for a patron ' +
      'who can. A famous name can multiply a blade’s price, and the name is only as honest as whoever cut ' +
      'it into the steel under the hilt. The merchant sees your swords and asks, politely, what you make of ' +
      'it. The dealer smiles at you and lets a string of mon show at the edge of the counter, where only ' +
      'you can see it.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Judge the blade by what you know of the smiths.',
        check: { stat: 'chi', dc: 6 },
        onSuccess: {
          text:
            'The steel is honest, but the style is wrong for the smith it names, and you say so. The ' +
            'merchant pays you a hundred mon for saving him a fortune. The dealer will not be selling to ' +
            'you again.',
          effects: { money: 100, reputation: 1 },
        },
        onFailure: {
          text:
            'You find nothing wrong and say so, and the merchant buys it and pays you for your trouble. A ' +
            'month later his patron’s polisher finds what you missed, and the merchant tells everyone who ' +
            'told him it was genuine.',
          effects: { money: 50, reputation: -1, resolve: -1 },
        },
      },
      {
        text: 'Ask to hold it the way a swordsman would.',
        check: { stat: 'waza', dc: 6 },
        onSuccess: {
          text:
            'It moves well, and the hilt sits a hair loose on it. Someone has had the hilt off recently, ' +
            'and the only reason to take the hilt off a blade for sale is the name underneath. The merchant ' +
            'pays you eighty mon and haggles the dealer down by half.',
          effects: { money: 80, reputation: 1 },
        },
        onFailure: {
          text: 'It feels fine in your hands, because it is a fine sword. You call it genuine and learn otherwise a month later, from the merchant, loudly.',
          effects: { reputation: -1, resolve: -1 },
        },
      },
      {
        text: 'Take the dealer’s string and call it genuine.',
        onResolve: {
          text:
            'You call it a fine blade and a famous name. The merchant pays the dealer, and the dealer, later, ' +
            'pays you: a hundred and fifty mon for your judgment, in a city where it was the last thing you ' +
            'had to sell.',
          effects: { money: 150, gi: -2, resolve: -1 },
        },
      },
      {
        text: 'Tell the merchant you are no appraiser.',
        onResolve: { text: 'It is true, and it is safe. The merchant buys the sword anyway.' },
      },
    ],
  },

  // codex: Edo's town fire brigades were coming into being in these years
  // (01 §B5), and a samurai taking a townsman's wage and work pays in face
  // (03 §1). The crew is this ward's own, not a city institution.
  // Adapts 03 §6 city-edo "firefighting-crew recruitment". Assumes two swords
  // (the elder's reason for asking, and the decline line).
  {
    id: 'edo_ward_fire_crew',
    type: 'story',
    title: 'The Ward’s Fire Crew',
    body:
      'Since the last fire, the men of your ward have begun keeping a crew of their own: two carpenters, a ' +
      'cooper, the rice seller’s sons, drilling in the lane at dusk with ladders and buckets. The city is ' +
      'still working out who puts its fires out, and this ward has decided not to wait. One of the ward’s ' +
      'elders comes to your door himself. They need someone to walk the lanes at night and raise the alarm ' +
      'at the first smoke, and a two-sworded tenant who keeps odd hours would do. The pay is a townsman’s ' +
      'pay, and so is the work. Two doors down, the carpenters are watching to see what you say.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Take the night watch.',
        check: { stat: 'me', dc: 6 },
        onSuccess: {
          text:
            'On the ninth night you smell smoke where there should be none: a brazier left burning against ' +
            'a paper screen. You beat on doors until the lane is awake, and it is out before it spreads. ' +
            'After that, the carpenters greet you by name.',
          effects: { money: 80, reputation: 1, resolve: 1 },
        },
        onFailure: {
          text:
            'The nights are long and nothing happens, and the one night something does, a neighbor’s dog ' +
            'finds it before you do. The elders pay you anyway, with the air of people paying for a lesson.',
          effects: { money: 50, resolve: -1 },
        },
      },
      {
        text: 'Drill with the crew at dusk.',
        check: { stat: 'chikara', dc: 6 },
        onSuccess: {
          text:
            'You carry ladders and haul water beside shopkeepers and carpenters, and by the third evening ' +
            'they have stopped calling you sir. It is the first time in Edo you have belonged to a lane.',
          effects: { reputation: 1, resolve: 1 },
        },
        onFailure: {
          text: 'A ladder slips and takes you down with it, in front of everyone. They are kind about it.',
          effects: { health: -2 },
        },
      },
      {
        text: 'Decline. You did not keep two swords to stand watch for shopkeepers.',
        onResolve: {
          text: 'The elder bows and goes. The lane is a little cooler toward you after that, and the carpenters find other things to watch.',
          effects: { resolve: -1 },
        },
      },
    ],
  },

  // codex: kabukimono, flamboyant street gangs of rōnin and town toughs, peaked
  // around 1600-1650 and were declining in these years (01 §B7). They flee
  // wounded, not dead, and steel drawn in the city is remembered (03 §1; 08 S5).
  // Adapted from 03 §6 night "the lantern-less bridge", moved to a lane so it
  // doesn't repeat Act 3's bridge fight (keian_lanternless_bridge). The
  // city-edo bank's only fights are the Fukagawa sumo yard, which would
  // duplicate the livelihood choice, and the fire. Assumes two swords.
  {
    id: 'edo_timber_yard_toll',
    type: 'combat',
    title: 'A Toll Behind the Timber Yards',
    body:
      'The lane behind the timber yards is your shortcut home, and tonight four young men are sitting on ' +
      'the stacked logs across it, dressed loud enough to be heard in the dark, with swords too long for ' +
      'any honest use. Kabukimono, the street gangs of rōnin and townsmen’s sons: there are fewer of them every ' +
      'year, and the ones left are angry about it. They want a toll for the lane. They want it from you ' +
      'in particular, because you wear two swords and walk alone, and that makes a better story.',
    weight: 1,
    acts: [2],
    // Calibrated with `npm run sim -- --preview` (game-plan/12 follow-up).
    foe: { name: 'Kabukimono toughs', power: 14 },
    onWin: {
      text:
        'The first to reach you goes down among the logs, and the second takes a cut across the ' +
        'forearm and drops his sword. The others haul them both out and go, cursing you into the dark. They ' +
        'will live. A shutter above the lane closes quietly: someone heard steel in the dark and will ' +
        'remember who walked home that way.',
      effects: { suspicion: 1 },
    },
    onLose: {
      text:
        'There are four of them, and they are less useless than they look. They leave you in the sawdust ' +
        'with a cut scalp and a lighter purse, and laugh about it all the way down the lane.',
      effects: { health: -8, resolve: -1 },
      moneyMult: 0.6,
    },
  },

  // codex: sake brewed around Osaka came up to Edo by sea and was sold through
  // wholesalers there (kudarizake; verify the shipping arrangements for 1649,
  // 01 does not cover them). Edo expected hired servants to have a guarantor
  // who stood surety for their conduct (verify the guarantor system's form by
  // 1649). A townsman on a journey might carry one short sword, so a rōnin with
  // only the short sword reads as a townsman (verify). An honest employer, the
  // second employer_contracts source 11 §2.2 asks for (only the bodyguard
  // livelihood fed it before). The +8 mod rewards a PC who already guards for a
  // living. Assumes two swords (the pledge).
  {
    id: 'edo_sake_storehouse',
    type: 'story',
    title: 'Ten Nights at the Storehouse',
    body:
      'Along the canal below Nihonbashi, the shipping agents keep plastered storehouses for goods that come ' +
      'up from Osaka by sea. One of them, Tahei, has a hundred casks of Osaka sake waiting on his wholesalers, ' +
      'and in a month he has lost six to someone who knows his locks. He wants a steady sword to sit up with ' +
      'the casks for ten nights, until the buyers take delivery. The pay is honest. The city likes a hired ' +
      'hand to have a guarantor, someone who stands surety for their conduct, and you have none. Tahei says so ' +
      'politely. Then he says he will take you anyway, if you can find some way to be worth the risk. Behind ' +
      'him, his head clerk looks at your swords and says nothing at all.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Sit up with the casks, and watch the storehouse the way a soldier watches a wall.',
        check: { stat: 'me', dc: 6, mods: [{ when: { flags: ['livelihood_bodyguard'] }, pct: 8 }] },
        onSuccess: {
          text:
            'On the sixth night a lighter noses in under the storehouse’s water door with no lantern. You are ' +
            'standing on the step when the boatmen come up it. They knew the locks. They did not know about you. ' +
            'They push off without a word, and the next week the head clerk leaves Tahei’s service for reasons ' +
            'nobody states. Tahei pays in full and asks you back for the spring cargo.',
          effects: { money: 120, reputation: 1 },
          counters: { employer_contracts: 1 },
        },
        onFailure: {
          text:
            'You watch the lane all ten nights. They come by water. On the last morning Tahei counts two casks ' +
            'short, pays you what he promised and not a mon more, and says nothing about it, which is his whole ' +
            'opinion.',
          effects: { money: 60, resolve: -1 },
        },
      },
      {
        text: 'Sleep by day, and sit in the dark among the casks with your sword across your knees.',
        check: { stat: 'waza', dc: 7 },
        onSuccess: {
          text:
            'When the water door slides open you are already moving. The first boatman takes your sheathed sword ' +
            'across the wrist and drops his hook, and the second goes into the canal and swims for it. At dawn you ' +
            'hand the first to the ward’s men, alive. Tahei pays you half again and asks you back. The ward’s men ' +
            'write down who caught him.',
          effects: { money: 150, reputation: 1, suspicion: 1 },
          counters: { employer_contracts: 1 },
        },
        onFailure: {
          text:
            'In the dark among the casks, a boat hook finds your forearm before you find the man holding it. ' +
            'They get away with two casks, and you spend the morning with a bonesetter. Tahei pays for the nights ' +
            'and hires someone else for spring.',
          effects: { health: -4, money: 60 },
        },
      },
      {
        text: 'Leave your long sword in his strongbox as your surety.',
        onResolve: {
          text:
            'He locks it away with his accounts and writes you into his book. For ten nights you sit up with ' +
            'only the short sword at your side, like a townsman on a journey, and whoever has been taking the ' +
            'casks stays away from a lit storehouse. On the last morning he hands the long sword back with both ' +
            'hands and pays you in full. You feel the ten nights without it all the way home.',
          effects: { money: 100, resolve: -1 },
          counters: { employer_contracts: 1 },
        },
      },
      {
        text: 'Tell him to find someone with a guarantor.',
        onResolve: {
          text: 'He bows, a little relieved, and does. You hear later that his losses stopped when his head clerk left.',
        },
      },
    ],
  },

  // codex: Edo had public bathhouses from its first decades (the first is
  // traditionally dated 1591; verify), and the early ones were steam baths
  // rather than deep tubs (verify). Massage was a trade of the blind, who had
  // their own guild (verify for 1649 Edo). Go was played by samurai and
  // townsmen alike. 01 does not cover bathhouses; all of this is to add there.
  // Adapts 03 §6 city-edo "bathhouse politics" as a recovery beat (12: Acts 2-3
  // need counterweights to the Resolve bleed). Nobody is described by body
  // (03 §9.1 C1). Assumes two swords (left at the counter).
  {
    id: 'edo_lane_bathhouse',
    type: 'story',
    title: 'The Bathhouse at the End of the Lane',
    body:
      'Winter. You have been cold since the first frost: cold in the street, cold in your room, cold in your ' +
      'sleep. At the end of your lane a bathhouse breathes steam out under its curtain from dawn to dark, and ' +
      'a bath costs a few mon. You hand your swords to the keeper at the counter, which you have never done in ' +
      'a public place, and go through into the heat with nothing on at all. The steam room is dim and full: a ' +
      'carpenter, a clerk with ink on his fingers, two fish-sellers arguing about the price of bonito, and an ' +
      'old man balancing a board for go, the game of black and white stones, on his knees. A blind masseur ' +
      'works his way along the bench, kneading shoulders for a few coppers more and talking the whole time. In ' +
      'here, nobody can see a crest.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Pay for the masseur’s hands, and sit until the cold is gone.',
        onResolve: {
          text:
            'He finds every knot the winter has tied in your back and names it, like a man reading a map. He ' +
            'talks about his daughter’s marriage, the price of lamp oil, a dog he once owned. You do not have to ' +
            'say a word. You walk home warm for the first time in a month.',
          effects: { money: -40, health: 2, resolve: 2 },
        },
      },
      {
        text: 'Take the old man’s challenge at go.',
        check: { stat: 'chi', dc: 6 },
        onSuccess: {
          text:
            'You play for an hour with the board across both your knees. He wins by two stones and is delighted, ' +
            'and tells you about his late wife’s pickles and his son’s shop, and not once does he ask about your ' +
            'lord. You go home warm to the bone.',
          effects: { money: -10, resolve: 2 },
        },
        onFailure: {
          text:
            'He takes you apart in forty moves, wins the string of mon you bet on the side, and explains how, ' +
            'twice, with pleasure. It is the best company you have had since the road.',
          effects: { money: -40, resolve: 1 },
        },
      },
      {
        text: 'Wade into the fish-sellers’ argument.',
        check: { stat: 'kuchi', dc: 5 },
        onSuccess: {
          text:
            'You take the side of the bonito, then of the price, then of whoever is losing, and by the end the ' +
            'whole steam room is laughing, the carpenter hardest. On your way out the fish-sellers tell you which ' +
            'stall to buy from and which to avoid, and they call you by name.',
          effects: { money: -10, resolve: 1, reputation: 1 },
        },
        onFailure: {
          text:
            'You speak the way your father spoke to tradesmen, without meaning to. The steam goes quiet. The ' +
            'fish-sellers find they have somewhere else to be.',
          effects: { money: -10, resolve: -1 },
        },
      },
      {
        text: 'Wash quickly, pay the few mon, and go.',
        onResolve: {
          text: 'Hot water, a scrub, and back out into the street before the cold can find you again. It is enough to sleep on.',
          effects: { money: -10, health: 1, resolve: 1 },
        },
      },
    ],
  },

  // codex: hinin, a status outside the four classes, did work the city needed
  // and shunned, including taking up the unclaimed dead (01 §B2 "below the
  // system"; their exact duties and organization in 1649 Edo are to verify).
  // The word is the headman's, not the narration's (03 §9.1 B2), and needs a
  // codex card on its history. Rōnin often let their shaven pates grow out
  // (verify). Touching the dead was polluting in period belief (verify), so the
  // lane's distance is the world's prejudice and helping costs Reputation, not
  // Gi (B3, B4); walking on is not rewarded. Chōsuke has a trade, a son and his
  // own standards. The drowning is left unexplained. City-edo rōnin-surplus
  // texture (01 §B1 scale note; 03 §6 dole line), no single 03 §6 entry.
  // Assumes two swords (why he looks at you).
  {
    id: 'edo_unclaimed_dead',
    type: 'story',
    title: 'The Man at the Pilings',
    body:
      'Overnight a body has come up against the pilings below the fish market, face down, and the lane has ' +
      'gathered on the bank to look, from a distance. A masterless samurai, by the grown-out pate and the two ' +
      'scabbards in his sash, both empty; someone got to him before the water did, or after. Nobody goes near. ' +
      'The ward’s headman says he has sent for the hinin, and says the word as if it named a job rather than a ' +
      'man; the outcast households are the only people in the city who will do this work. The man who comes is ' +
      'Chōsuke. He brings a pole, a straw mat and his son, and handles the dead the way a carpenter handles good ' +
      'timber. The crowd steps back farther from him than it did from the body. When the dead man is laid on ' +
      'the bank, Chōsuke looks around for anyone who might know his name. Unclaimed, he goes to the common pit. ' +
      'His eyes stop on your swords.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Kneel and search him for a name.',
        check: { stat: 'me', dc: 6 },
        onSuccess: {
          text:
            'Sewn inside his collar, where a careful man keeps it, is a scrap of paper: a name, and a domain that ' +
            'no longer exists. You read it aloud. Chōsuke repeats it once, to have it right, and the headman writes ' +
            'it in the ward’s book, with yours beside it as the one who read it. A man with a name can have a ' +
            'temple. You leave thirty mon for the sutras.',
          effects: { money: -30, gi: 1, suspicion: 1 },
        },
        onFailure: {
          text:
            'There is nothing on him but canal water. You stand up with wet knees in front of the whole lane, ' +
            'having handled the dead for nothing, and the headman asks your name in a tone that means he will ' +
            'remember it.',
          effects: { suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Take the other end of Chōsuke’s pole.',
        check: { stat: 'chikara', dc: 5 },
        onSuccess: {
          text:
            'You carry him up the bank between you, the son walking ahead to clear the way. Nobody in the crowd ' +
            'says anything, which is how you know what they are saying. At the cart Chōsuke bows to you exactly as ' +
            'deep as you bow to him, and not a hair deeper.',
          effects: { reputation: -1, gi: 1, resolve: 1 },
        },
        onFailure: {
          text:
            'The bank is wet clay. You go down with the dead man’s weight across you, and the lane laughs, the way ' +
            'people laugh when they are frightened. Chōsuke’s son helps you up. His father takes the pole back ' +
            'without a word and carries the load with his son.',
          effects: { health: -1, reputation: -1, gi: 1, resolve: -1 },
        },
      },
      {
        text: 'Pay Chōsuke to take him to a temple instead of the pit.',
        requires: { min: { money: 100 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 100 mon',
        onResolve: {
          text:
            'Chōsuke knows a temple outside the city that will say the sutras over a man without a name, if ' +
            'someone pays. He counts the hundred mon once and tells you the temple’s name, so you will know where ' +
            'to find him. Then he and his son lift the pole and go, and the crowd opens wide to let them through.',
          effects: { money: -100, gi: 1 },
        },
      },
      {
        text: 'Walk on. You did not know him.',
        onResolve: {
          text:
            'You did not. Neither did anyone else on the bank, and that is the whole of it. You think about the ' +
            'empty scabbards for the rest of the day.',
          effects: { resolve: -1 },
        },
      },
    ],
  },
  // codex: okappiki, the constables' hired informers, were often ex-criminals
  // and were notorious for squeezing the people they watched (01 §B6).
  // O-Sen is a widow keeping a noodle stall, a person with a trade, not a prop
  // (03 §9.1 C). Gender-neutral PC; assumes two swords.
  {
    id: 'edo_okappiki_squeeze',
    type: 'story',
    title: 'The Noodle Stall',
    body:
      'O-Sen’s noodle stall at the corner of your lane is the best supper in the ward for twelve mon. ' +
      'Tonight an okappiki, one of the constables’ informers, is leaning on her counter, eating without ' +
      'paying, and explaining how many things a widow with a charcoal brazier could be fined for in a ' +
      'city that fears fire. She keeps cooking. Her hands are steady. Her eyes go to you once, and then ' +
      'away, because she does not want to ask.',
    weight: 1,
    acts: [2],
    choices: [
      {
        text: 'Ask him, politely, which constable he works for.',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'He names a dōshin. You repeat the name slowly, as if committing it to memory for a letter. He ' +
            'finds that he has somewhere else to be, and leaves twelve mon on the counter.',
          effects: { gi: 1, reputation: 1 },
        },
        onFailure: {
          text:
            'He names a dōshin, and then asks your name, and writes it down. O-Sen gives you your noodles for ' +
            'nothing afterward. It does not feel like a win.',
          effects: { suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Sit down at the counter beside him and say nothing at all.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: {
          text:
            'You eat. You look at him between mouthfuls. After the third, he pays and goes. O-Sen puts an ' +
            'extra egg in your bowl and does not mention it.',
          effects: { gi: 1 },
        },
        onFailure: {
          text:
            'He stares back, longer than you do. When he goes, he goes to someone. Your name will be in ' +
            'somebody’s report by morning.',
          effects: { suspicion: 2 },
        },
      },
      {
        text: 'Pay his “fine” yourself, so she does not have to.',
        requires: { min: { money: 60 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 60 mon',
        onResolve: {
          text:
            'He takes it with a smile, and you know he will be back next month. So does she. She thanks you ' +
            'anyway, and means it.',
          effects: { money: -60, gi: 1, resolve: -1 },
        },
      },
      {
        text: 'Keep walking. It is not your stall.',
        onResolve: {
          text: 'You eat somewhere worse that night, and pay more for it.',
          effects: { resolve: -1 },
        },
      },
    ],
  },
];

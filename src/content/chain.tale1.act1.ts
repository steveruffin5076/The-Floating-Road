// Tale 1 (The Masterless Blade) Act 1 chain, per game-plan/11-tale1-chain-spec.md
// §1.2: C1 watch-list, S1 spine, C2 Fujieda, C3 O-Ryō, C4 old retainer. Each is
// injected at a slot (never drawn). Nodes (acts: []) are reached by `goto`.
//
// C4's letter follows 03's premise (it proves Katsuragi's secret bargain). 11
// §5.1 proposes that it also show Katsuragi's men killed the father, which a
// licensed vendetta would need; that premise change is pending a decision.
import type { GameEvent } from '../engine/types';

export const TALE1_ACT1_CHAIN: GameEvent[] = [
  // codex: Arai and Hakone were the strictest barriers; sekisho checked permits
  // against lists of wanted men (01 §B3). Breaking a barrier was a grave crime.
  {
    id: 'checkpoint_watchlist',
    type: 'story',
    title: 'The Barrier at Arai',
    body:
      'The Arai barrier sits where the road meets the lake, and the inspector here reads slowly. He ' +
      'looks at your papers, then at the crest on your sword’s hilt, then at a list pinned inside his ' +
      'booth: the houses whose unattached swordsmen the barriers are told to watch for. His finger stops ' +
      'partway down the page. The line behind you goes quiet in the way lines do when someone ahead of ' +
      'them has become interesting. It is the first time the road has told you that the state knows ' +
      'your name.',
    weight: 1,
    inject: { act: 1, slot: 4, window: 2, mandatory: true },
    requires: { flags: ['watch_list_active'] },
    choices: [
      {
        text: 'A dead house’s crest, you tell him. You bought the sword from a pawnshop.',
        check: { stat: 'kuchi', dc: 5 },
        onSuccess: {
          text: 'He looks at the sword, then at your clothes, and decides a pawnshop is believable. He waves you on.',
        },
        onFailure: {
          text:
            'He asks which pawnshop, and in which town. You hold a day in the guardhouse while a runner checks, ' +
            'and pay for your own rice.',
          effects: { suspicion: 1, money: -50, resolve: -1 },
        },
      },
      {
        text: 'Pay the clerk to misfile the page.',
        requires: { min: { money: 200 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 200 mon',
        check: { stat: 'me', dc: 5 },
        onSuccess: {
          text:
            'You pick the clerk with the worn sleeves. Two hundred mon, and a page goes into the wrong box. ' +
            'The next barrier will have no list with your crest on it.',
          effects: { money: -200 },
          clearFlags: ['watch_list_active'],
        },
        onFailure: {
          text:
            'You pick the wrong clerk. He takes the coin, and then he takes your name to the inspector as ' +
            'well.',
          effects: { money: -200, suspicion: 2 },
        },
      },
      {
        text: 'Show the crest openly and give your true name.',
        check: { stat: 'tan', dc: 5 },
        onSuccess: {
          text:
            'The old captain of the guard comes out of the back. He was at Osaka too, on the other side of ' +
            'the moat. He looks at the crest a long time, then stamps your papers himself.',
          effects: { reputation: 1 },
          setFlags: ['crest_honored'],
        },
        onFailure: {
          text: 'They question you until dark, write down every answer, and let you through with the list unchanged.',
          effects: { suspicion: 1 },
        },
      },
      {
        text: 'Break for the hills.',
        onResolve: { text: 'You step back out of the line, and then you run.', goto: 'checkpoint_watchlist_run' },
      },
    ],
  },
  {
    id: 'checkpoint_watchlist_run',
    type: 'combat',
    title: 'Running the Barrier',
    body:
      'Two guards with staves reach the gap in the fence before you do. Beyond them is the hillside and ' +
      'the cedars, and nothing else between you and the road east.',
    weight: 1,
    acts: [],
    foe: { name: 'Barrier guards', power: 9 },
    onWin: {
      text:
        'You shoulder past the staves and are into the cedars before the drum sounds. On the books, ' +
        'breaking a barrier is among the gravest crimes on the road. Tonight it is only a description, ' +
        'moving east.',
      effects: { suspicion: 2 },
      setFlags: ['barrier_broken'],
    },
    onLose: {
      text:
        'A stave takes your legs. They beat you, fine you half your purse, and throw you back onto the ' +
        'road on the side you came from, with your name written down twice.',
      effects: { health: -6, suspicion: 2 },
      moneyMult: 0.5,
    },
  },

  // codex: confiscations threw hundreds of thousands of samurai onto the roads
  // with their households (01 §B1 scale note; 03 §3 spine event 1).
  {
    id: 'spine1_men_with_no_banners',
    type: 'story',
    title: 'Men With No Banners',
    body:
      'A column comes west to east along the road: samurai of a confiscated domain, walking with their ' +
      'households, bedding tied on their backs, old men and children among them. No banners. At the ' +
      'evening fire, one of the old men sees the crest on your hilt and makes room beside him. His lord ' +
      'lost his domain for a paperwork fault, he says, and four hundred men lost everything with him. ' +
      '“The world is upside down,” he says, “and someone will have to right it.” There is a teacher in ' +
      'Kanda, he has heard, who takes in men of our kind.',
    weight: 1,
    inject: { act: 1, slot: 6, window: 2, mandatory: true },
    choices: [
      {
        text: 'Share your rice and the fire.',
        onResolve: {
          text: 'You eat together and say little. In the morning he tells you the teacher’s name: Yui Shōsetsu.',
          effects: { money: -20, resolve: 1, gi: 1 },
          setFlags: ['heard_the_phrase', 'yui_name_heard'],
        },
      },
      {
        text: 'Ask whether he knew a retainer named Katsuragi Hyōgo.',
        check: { stat: 'kuchi', dc: 4 },
        onSuccess: {
          text:
            'He did. Katsuragi holds a small office in Edo now, he says, and is not asked about the old days ' +
            'at dinner.',
          setFlags: ['heard_the_phrase', 'katsuragi_rumor'],
        },
        onFailure: {
          text: 'He shakes his head. Too many names, too many houses. The fire burns down.',
          setFlags: ['heard_the_phrase'],
        },
      },
      {
        text: 'Walk on. You are not one of them yet.',
        onResolve: {
          text: 'You pass the column before dark. The old man’s words walk with you anyway.',
          effects: { resolve: -1 },
          setFlags: ['heard_the_phrase'],
        },
      },
    ],
  },

  // codex: kabukimono, flamboyant gangs of rōnin and town toughs, peaked
  // around 1600-1650 (01 §B7). Kirisute gomen was a claimed right against
  // commoners for gross insolence, and its use triggered an inquiry (01 §B2).
  {
    id: 't1_fujieda_duel',
    type: 'story',
    title: 'A Claim at Fujieda',
    body:
      'In the main street at Fujieda, a young man in outrageous dress, sleeves dyed like a courtesan’s ' +
      'and a sword long enough to be a joke, has a porter on his knees. The porter jostled him. The young ' +
      'man is loudly claiming kirisute gomen, the right to cut down a commoner for insolence. The crowd ' +
      'knows what that claim is worth: an inquiry afterward, which will not bring the porter back. His ' +
      'friends lounge in a doorway, grinning. You wear two swords, so you are the one person here he ' +
      'cannot simply wave away.',
    weight: 1,
    inject: { act: 1, slot: 8, window: 2, mandatory: true },
    choices: [
      {
        text: 'Step between them and talk him down.',
        check: { stat: 'tan', dc: 5 },
        onSuccess: {
          text:
            'You tell him the magistrate’s men will want to hear how a porter insulted a gentleman, in ' +
            'detail, under oath. He laughs, as if it was his idea to stop, and goes. The porter is already ' +
            'gone. Half the street saw your face.',
          effects: { reputation: 1, suspicion: 1, gi: 1 },
          setFlags: ['fujieda_intervened'],
        },
        onFailure: {
          text: 'He hears your voice shake, and his sword comes out of its scabbard.',
          goto: 't1_fujieda_fight',
        },
      },
      {
        text: 'Put your hand on your hilt before you say anything.',
        onResolve: { text: 'He sees your hand move, and grins, and draws.', goto: 't1_fujieda_draw' },
      },
      {
        text: 'Walk on.',
        onResolve: {
          text: 'You do not look back. You hear the crowd’s silence break behind you, and you do not look back.',
          effects: { resolve: -2 },
          setFlags: ['fujieda_walked'],
        },
      },
      {
        text: 'Laugh along with him and accept the sake his friends offer.',
        onResolve: {
          text:
            'The porter crawls away while they pour for you. They are good company, in their way, and they ' +
            'remember your face kindly.',
          effects: { gi: -2, resolve: -1 },
          setFlags: ['kabukimono_contact'],
        },
      },
    ],
  },
  {
    id: 't1_fujieda_fight',
    type: 'combat',
    title: 'Steel in the Street',
    body: 'His friends spill out of the doorway to watch. He fights the way he dresses: loudly, and better than you hoped.',
    weight: 1,
    acts: [],
    foe: { name: 'Kabukimono', power: 9 },
    onWin: {
      text:
        'You open his sleeve and the arm under it. He runs, and his friends run after him. The porter is ' +
        'long gone. Everyone in the street saw steel drawn, and saw yours.',
      effects: { reputation: 1, suspicion: 1, gi: 1 },
      setFlags: ['fujieda_intervened'],
    },
    onLose: {
      text: 'He cuts you and struts off to his friends. In the confusion, at least, the porter got away.',
      effects: { health: -6 },
      setFlags: ['fujieda_intervened'],
    },
  },
  {
    id: 't1_fujieda_draw',
    type: 'combat',
    title: 'Steel in the Street',
    body: 'There is no more talking. The crowd pulls back to the walls, and the porter scrambles clear.',
    weight: 1,
    acts: [],
    foe: { name: 'Kabukimono', power: 9 },
    onWin: {
      text:
        'He takes a cut across the forearm and drops his sword in the mud. He runs. A drawn blade in a ' +
        'post-town street will be remembered, and so will you.',
      effects: { reputation: 1, suspicion: 2 },
      setFlags: ['fujieda_intervened'],
    },
    onLose: {
      text: 'He cuts you and struts off to his friends. In the confusion, at least, the porter got away.',
      effects: { health: -6 },
      setFlags: ['fujieda_intervened'],
    },
  },

  // codex: teahouses were the road's information exchange, and a widow keeping
  // a shop was one of the few independent livelihoods open to a woman (01 §B8;
  // §B2 Women). O-Ryō is a recurring character (03 §4 Tale 1 cast).
  {
    id: 't1_oryo_mariko',
    type: 'story',
    title: 'The Teahouse at Mariko',
    body:
      'The teahouse at Mariko belongs to O-Ryō, a widow with a quick eye and a slow smile. In the Osaka ' +
      'years she cooked for the camps; now she feeds drifting samurai and trades in what they tell her. ' +
      'What she wants, as far as you can tell, is to keep the place her own. She sets down your bowl and ' +
      'says, without looking at you, that a dying man at a temple near Sunpu has been asking every ' +
      'traveler about a crest. She glances at your sword. A drunk at the next table is being loud at her ' +
      'other customers.',
    weight: 1,
    inject: { act: 1, slot: 9, window: 2, mandatory: true },
    choices: [
      {
        text: 'Pay for what she knows.',
        requires: { min: { money: 100 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 100 mon',
        onResolve: {
          text: 'A hundred mon buys the name of the temple and the name of the man: Sahei. She counts it twice.',
          effects: { money: -100 },
          setFlags: ['met_oryo', 'oryo_lead'],
          counters: { oryo_bond: 1 },
        },
      },
      {
        text: 'Settle the drunk who is troubling her tables.',
        check: { stat: 'kuchi', dc: 4 },
        onSuccess: {
          text:
            'A few quiet words and he finds his sandals. O-Ryō refills your bowl and tells you the temple and ' +
            'the name, Sahei, as payment.',
          effects: { reputation: 1 },
          setFlags: ['met_oryo', 'oryo_lead'],
          counters: { oryo_bond: 1 },
        },
        onFailure: {
          text:
            'He takes a swing at you before his friends drag him out. O-Ryō tells you what she knows anyway, ' +
            'shortly, and does not say the temple’s name.',
          effects: { health: -2 },
          setFlags: ['met_oryo'],
        },
      },
      {
        text: 'Tell her why you walk east.',
        onResolve: {
          text:
            'You tell her about the castle, and your father, and Katsuragi. She listens the way people rarely ' +
            'do. She does not answer the question you did not ask.',
          effects: { resolve: 1 },
          setFlags: ['met_oryo', 'oryo_knows_katsuragi'],
          counters: { oryo_bond: 1 },
        },
      },
      {
        text: 'Drink up and go.',
        onResolve: { text: 'You pay and leave. She is already talking to the next traveler.', effects: { money: -10 }, setFlags: ['met_oryo'] },
      },
    ],
  },

  // codex: the Osaka campaigns ended in 1615, and the road in 1648 was full of
  // men who remembered the houses that fell there (01 §B1).
  {
    id: 't1_old_retainer',
    type: 'story',
    title: 'A Dying Man Near Sunpu',
    body:
      'Near Sunpu, the road passes a string of small temples. Somewhere among them, if the talk is true, ' +
      'an old man who served your house is dying, and asking every traveler about your crest. He would ' +
      'have been young at Osaka, thirty-three years ago. You were a child.',
    weight: 1,
    inject: { act: 1, slot: 12, window: 2, mandatory: true },
    choices: [
      {
        text: 'Go straight to the temple O-Ryō named.',
        requires: { flags: ['oryo_lead'] },
        onResolve: { text: 'You find it by midday. He is alive.', goto: 't1_old_retainer_alive' },
      },
      {
        text: 'Ask at every temple on the Sunpu road.',
        requires: { flagsNot: ['oryo_lead'] },
        check: { stat: 'me', dc: 5 },
        onSuccess: { text: 'At the fourth temple, the priest knows the crest. He is alive.', goto: 't1_old_retainer_alive' },
        onFailure: { text: 'You find the right temple on the third day.', goto: 't1_old_retainer_too_late' },
      },
      {
        text: 'Keep walking. Whatever he knows, the road ahead is enough.',
        onResolve: { text: 'You pass the temples without stopping. You will wonder, later.', effects: { resolve: -1 } },
      },
    ],
  },
  {
    id: 't1_old_retainer_alive',
    type: 'story',
    title: 'Sahei',
    body:
      'His name is Sahei. He carried water in your father’s house, and he has kept one thing for ' +
      'thirty-three years: a letter in your father’s hand, written the night before the surrender. It ' +
      'names Katsuragi Hyōgo as the man who negotiated the castle’s surrender in secret, and it says your ' +
      'father will refuse to sign. Sahei tells you the rest of that night, as much as he saw. His voice ' +
      'comes and goes. The priest waits by the door.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Sit with him through the night.',
        onResolve: {
          text:
            'He talks about the house, the kitchen, your mother. Near dawn he stops. You leave with the letter ' +
            'inside your jacket and the priest’s promise to see to him.',
          effects: { resolve: -1, gi: 1 },
          addItems: ['fathers_letter'],
          setFlags: ['retainer_testimony'],
        },
      },
      {
        text: 'Ask the priest to take down his words as a witnessed statement.',
        check: { stat: 'chi', dc: 5 },
        onSuccess: {
          text:
            'You know the proper form. The priest writes, Sahei marks it, and the priest seals it as witness. ' +
            'A magistrate would have to read it.',
          addItems: ['fathers_letter'],
          setFlags: ['retainer_testimony', 'sworn_testimony'],
        },
        onFailure: {
          text:
            'You do not know the proper form, and the priest does not either. What you get down is a dying ' +
            'man’s memory. It is something.',
          addItems: ['fathers_letter'],
          setFlags: ['retainer_testimony'],
        },
      },
      {
        text: 'Take the letter and go before he wakes.',
        onResolve: {
          text: 'He sleeps with his hand still on it. You lift it gently, and go.',
          effects: { gi: -1 },
          addItems: ['fathers_letter'],
        },
      },
      {
        text: 'Burn it. Let the dead keep it.',
        onResolve: {
          text:
            'You hold it to the lamp while he watches. He does not argue. Perhaps he is relieved to set it down.',
          effects: { resolve: 1 },
          setFlags: ['letter_burned'],
        },
      },
    ],
  },
  {
    id: 't1_old_retainer_too_late',
    type: 'story',
    title: 'Two Days Late',
    body:
      'Sahei died two days ago, the priest says. He was a servant of your house, and he kept something ' +
      'for thirty-three years: a letter in your father’s hand, written the night before the surrender. The ' +
      'priest holds it out. It names Katsuragi Hyōgo as the man who negotiated the surrender in secret.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Take it.',
        onResolve: {
          text: 'You fold it into your jacket and leave a coin for the old man’s grave.',
          effects: { money: -10 },
          addItems: ['fathers_letter'],
        },
      },
      {
        text: 'Burn it. Let the dead keep it.',
        onResolve: {
          text: 'The priest watches you hold it to the lamp, and says nothing.',
          effects: { resolve: 1 },
          setFlags: ['letter_burned'],
        },
      },
    ],
  },
];

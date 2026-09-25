// Tale 1 (The Masterless Blade) Act 2 chain, per game-plan/11-tale1-chain-spec.md
// §1.3: C5 livelihood, C6 Yui's school (spine 2), C7 O-Ryō's letter, C8 the
// second cup, C9 the second job, C10 Katsuragi's garden, C11 the fever friend,
// plus the two transition nodes (Act 1→2 `t1_gates_of_edo`, Act 2→3
// `t1_shogun_is_dead`). Each chain event is injected at a slot (never drawn).
// Nodes (acts: []) are reached by `goto`.
//
// Deviations from 11 §1.3, all forced by the engine or the validator:
// - C9 is four injected events, one per livelihood (`t1_second_job_*`), each
//   gated on its flag. As one event it would need 7+ choices, all gated; the
//   validator allows 4 and needs one ungated.
// - C6 refuse with Chi ≥ 7 sets `yui_roster_seen` instead of `refused_yui`, so
//   C8 can fire and offer the metsuke. With both flags set, C8's own gate
//   (`flagsNot: refused_yui`) would shut the roster route that 11 §2.3 and §3.2
//   count on. C8 (stay away, metsuke fail, or lapse) still settles Yui status.
// - C10's petition is one choice that opens a node with the parallel Chi and
//   Kuchi arguments, to keep the garden at 4 choices. C10 blackmail failures
//   also carry Gi/Aku −1, so Garden Gate's "−1 here, −2 in C13" holds on every
//   blackmail path. The duel-terms node adds "think better of it" as its
//   ungated choice (sets `vendetta_set_aside`).
// - C11 can't reorder choices by flag, so `yui_trusted` shows as a body line
//   (Yui asks you first) rather than moving the Sunpu choice up.
//
// Hatashiai is a crime whatever the seconds (01 §B2, 11 §5.1): the duel always
// raises Suspicion. Adauchi needs a license and a killing (C4 supplies the
// killing); who issues the license with the domain gone is still a research
// follow-up for 01, so the text names only "the magistrates' clerks".
import type { GameEvent } from '../engine/types';

// C7: every branch passes on O-Ryō's Banchō line if she knows about Katsuragi.
const ORYO_ADDRESS = { when: { flags: ['oryo_knows_katsuragi'] }, then: { setFlags: ['oryo_katsuragi_address'] } };
// t1_shogun_is_dead: the city tightens around the conspirators.
const CITY_TIGHTENS = { when: { flags: ['keian_conspirator'] }, then: { effects: { suspicion: 1 } } };
// C9 bodyguard: a hatamoto house asks your name once your standing is high enough.
const HONEST_PATRON = { when: { min: { reputation: 2 } }, then: { setFlags: ['honest_patron'] } };

export const TALE1_ACT2_CHAIN: GameEvent[] = [
  // codex (nihonbashi): Nihonbashi was the official starting point of all five
  // shogunate highways and Edo's commercial heart (01 §B3 Gokaidō, §B5 Edo).
  // Reuses the slice's reached_edo / reached_edo_letter text (11 §1.2, §4.2).
  {
    id: 't1_gates_of_edo',
    type: 'story',
    title: 'The Gates of Edo',
    body:
      'Nihonbashi bridge rises ahead of you at last: the zero marker of every road in the realm, and the ' +
      'edge of a city that swallows men like you by the thousand. The shogunate’s offices are here, where a ' +
      'grievance can be heard, or a man can disappear. Whatever you become next, it starts here.',
    weight: 1,
    acts: [],
    bodyVariants: [
      {
        when: { itemsAny: ['fathers_letter'] },
        text:
          'Inside your jacket, against your ribs, is a letter in your father’s hand with Katsuragi Hyōgo’s name ' +
          'in it. Somewhere in this city is the man it names.',
      },
    ],
    choices: [
      {
        text: 'Cross the bridge.',
        onResolve: {
          text:
            'You cross with the morning crowd, porters and fish-sellers and a monk with a begging bowl, and nobody ' +
            'looks at you twice. You find a room in a back-lane lodging-house and sleep through the afternoon.',
          effects: { health: 1 },
        },
      },
      {
        text: 'Stand a moment at the zero marker.',
        onResolve: {
          text:
            'You stand at the foot of the bridge while Edo goes past on both sides. Fifty-three stations of the ' +
            'Tōkaidō are behind you, and every one of them was counted from here. Then you cross, and find a room, ' +
            'and sleep.',
          effects: { health: 1 },
        },
      },
    ],
  },

  // codex: confiscations kept producing masterless samurai; rōnin performed
  // street sumo for money (01 §B1 scale note; §B8 sumo). A samurai who works
  // with his hands pays in face (03 §1), so sumo costs Resolve. Bakuto houses
  // ran dens, loan-sharking and protection under oyabun patronage (01 §B7).
  {
    id: 't1_livelihood',
    type: 'story',
    title: 'Four Doors',
    body:
      'Edo has more swords than work for them. Your purse will not see out the season, and everything in this ' +
      'city costs more than it did on the road. By the end of your first month you have found four doors open ' +
      'to a man with two swords and no lord. A money-changer at Nihonbashi wants a guard who looks the part. A ' +
      'sword school in Kanda needs an assistant to take the beginners. At Fukagawa, rōnin wrestle in exhibition ' +
      'sumo for the crowd’s coin, and nobody asks their fathers’ names. And there is a bakuto house, a gambling ' +
      'house that also lends money, which always needs someone to stand behind the man who collects. Each door ' +
      'is a different answer to what a masterless samurai may do with his hands.',
    weight: 1,
    inject: { act: 2, slot: 1, mandatory: true },
    choices: [
      {
        text: 'Guard the Nihonbashi money-changer.',
        check: {
          stat: 'kuchi',
          dc: 5,
          mods: [{ when: { anyOf: [{ flags: ['crest_honored'] }, { flags: ['fujieda_intervened'] }] }, pct: 10 }],
        },
        onSuccess: {
          text:
            'The money-changer asks three questions and listens to how you answer more than to what you say. He ' +
            'hires you for the season at full pay, to stand beside his strongbox and look like trouble.',
          effects: { money: 200 },
          counters: { employer_contracts: 1 },
          setFlags: ['livelihood_bodyguard'],
        },
        onFailure: {
          text:
            'He hires you, but he has heard of rōnin who guard the strongbox by day and empty it by night. He pays ' +
            'you half until you prove otherwise.',
          effects: { money: 100 },
          counters: { employer_contracts: 1 },
          setFlags: ['livelihood_bodyguard'],
        },
      },
      {
        text: 'Assist at the Kanda sword school.',
        check: { stat: 'waza', dc: 6 },
        onSuccess: {
          text:
            'The master watches you take a beginner through the first form and says nothing, which is how he hires ' +
            'people. You teach in the mornings and eat at the school’s table.',
          effects: { money: 100, reputation: 1 },
          setFlags: ['livelihood_dojo'],
        },
        onFailure: {
          text:
            'Your form is sound, and your age shows. The master takes you on anyway, to sweep the floor and line up ' +
            'the students’ sandals until he decides what you are for.',
          effects: { resolve: -1 },
          setFlags: ['livelihood_dojo'],
        },
      },
      {
        text: 'Wrestle in the Fukagawa sumo yard.',
        onResolve: {
          text:
            'You leave your swords with the yard’s boss and step into the ring in a borrowed wrestler’s belt, in ' +
            'front of a crowd that has paid to watch a samurai go down.',
          effects: { resolve: -1 },
          setFlags: ['livelihood_sumo'],
          goto: 't1_livelihood_sumo',
        },
      },
      {
        text: 'Stand behind the bakuto house’s collector.',
        requires: { anyOf: [{ max: { gi: 0 } }, { flags: ['kabukimono_contact'] }] },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Gi/Aku 0 or below, or friends among the kabukimono',
        onResolve: {
          text:
            'The oyabun, the house’s boss, pours for you himself and explains the work: his dice, his loans, his ' +
            'interest, and your face at a debtor’s door when the interest is late. Most pay when they see you. The ' +
            'ones who cannot are the part he does not explain. He counts out two hundred and fifty mon in advance.',
          effects: { money: 250, gi: -1, suspicion: 1 },
          counters: { gang_jobs: 1 },
          setFlags: ['livelihood_underworld'],
        },
      },
    ],
  },
  {
    id: 't1_livelihood_sumo',
    type: 'combat',
    title: 'The Fukagawa Yard',
    body:
      'The ring is a circle marked out in the sand of a yard behind the timber stacks. Your man is a carpenter’s ' +
      'son half your age and twice your weight, and the crowd has bet on him. Nobody dies in this ring. People ' +
      'only lose.',
    weight: 1,
    acts: [],
    foe: { name: 'Sumo wrestler', power: 13 },
    onWin: {
      text:
        'You get inside his reach, take his belt, and turn him out over the line. The crowd pays, some of it ' +
        'grudgingly. The yard’s boss books you for the season.',
      effects: { money: 150 },
    },
    onLose: {
      text:
        'He puts you on your back in the sand in one breath, to the loudest laugh of the afternoon. The boss books ' +
        'you anyway: the crowd liked watching a samurai fall.',
      effects: { health: -3 },
    },
  },

  // codex: Yui Shōsetsu, historical, taught military strategy to rōnin in Edo
  // and was the Keian plot's leader (01 §B1, 1651 Sep row; 03 §5 cameo policy).
  // 03 sample 6 verbatim, with the Tale 1 body lines from 11 §1.3. He never
  // names the plot outright (11 §5 row C6).
  {
    id: 'spine2_scholars_school',
    type: 'story',
    title: 'The Scholar’s School',
    body:
      'Kanda, Renjaku-chō: a strategy school above an armorer’s shop, the sign modest, the entryway full of good ' +
      'sandals belonging to poor men. Yui Shōsetsu is smaller than his reputation and pours tea himself. He asks ' +
      'what you think of the age. Whatever you answer, he agrees, and then agrees one step further, into country ' +
      'you did not mean to walk: the confiscations, the stipends cut, the tens of thousands of swords with ' +
      'nothing to cut. “A government that makes an ocean of masterless men should not be surprised,” he says, ' +
      'pleasantly, “when the tide comes in.” He refills your cup. He does not ask you to join anything. Men like ' +
      'him never do; by the third visit you have joined.',
    weight: 1,
    inject: { act: 2, slot: 3, window: 1, mandatory: true },
    bodyVariants: [
      {
        when: { flags: ['yui_name_heard'] },
        text: 'The old man at the road fire was right about this place. You could have found it by the sandals alone.',
      },
      {
        when: { flags: ['fujieda_intervened'] },
        text:
          'Over the second cup he mentions, as if in passing, a rōnin who stepped between a kabukimono and a porter ' +
          'at Fujieda. He does not ask whether it was you.',
      },
    ],
    choices: [
      {
        text: '“The tide drowns farmers too.” Refuse, politely, and go.',
        onResolve: {
          text:
            'He bows exactly as deep as you did and sees you to the stair himself, as if you had given him an answer ' +
            'he respected. A ledger lies open on the desk by the door. It is only a list of names, unless you know ' +
            'how a roster is kept.',
          riders: [
            { when: { stats: { chi: 7 } }, then: { setFlags: ['yui_roster_seen'] } },
            { when: { flagsNot: ['yui_roster_seen'] }, then: { setFlags: ['refused_yui'] } },
          ],
        },
      },
      {
        text: 'Ask what he would do.',
        check: { stat: 'chi', dc: 5 },
        onSuccess: {
          text:
            'He answers in the negative: what Sunpu’s defenses could not stop, how many men a fire in the merchant ' +
            'wards would pull from the castle guard. It is a lecture. It is also, unmistakably, a plan.',
          setFlags: ['knows_the_plan'],
        },
        onFailure: {
          text:
            'He answers with a poem about plum blossoms and changes the subject. You come back three more times ' +
            'before you understand that you were the one being examined.',
          setFlags: ['yui_measuring_you'],
        },
      },
      {
        text: 'Say yes before he asks.',
        onResolve: {
          text:
            'He does not look surprised. He writes nothing down, and he refills your cup. Down the lane, a neighbor ' +
            'has counted the sandals in the entryway again and reported the number. The five-household system, ' +
            'which makes neighbors answer for one another, does not sleep.',
          effects: { suspicion: 1 },
          setFlags: ['keian_conspirator'],
        },
      },
    ],
  },

  // codex: a widow keeping a teahouse was one of the few independent
  // livelihoods open to a woman, and teahouses were the road's information
  // exchange (01 §B2 Women; §B8). O-Ryō wants her lease and her independence,
  // not rescue (11 §5 row C3/C7/C14; checklist C4).
  {
    id: 't1_oryo_letter',
    type: 'story',
    title: 'A Letter From Mariko',
    body:
      'A letter comes up the Tōkaidō from Mariko, in O-Ryō’s square, careful hand. A merchant from Sunpu is buying ' +
      'the lease on the ground under her teahouse, and when the ground is his, the teahouse will be too. She does ' +
      'not ask to be rescued. She asks for one of two things: money toward the lease, so she can match his offer, ' +
      'or a petition to the station officials, written in a better hand than hers and in the forms they will ' +
      'read. The particulars are on a second sheet: the dates, the sums, the merchant’s name. At the end she ' +
      'writes that the soup is the same, and the customers are worse.',
    weight: 1,
    inject: { act: 2, slot: 6, window: 2 },
    requires: { flags: ['met_oryo'] },
    bodyVariants: [
      {
        when: { flags: ['oryo_knows_katsuragi'] },
        text:
          'Below that, smaller, as if she thought twice before adding it: a traveler at her tables saw Katsuragi ' +
          'Hyōgo’s palanquin go in at a gate in Banchō, in the samurai quarter of Edo.',
      },
    ],
    choices: [
      {
        text: 'Send three hundred mon toward the lease.',
        requires: { min: { money: 300 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 300 mon',
        onResolve: {
          text:
            'You send it west with a carrier and a note that says only what it is for. Her answer comes a month ' +
            'later: she matched him, and she has written your share into her accounts as a loan, whether you like ' +
            'it or not.',
          effects: { money: -300 },
          counters: { oryo_bond: 1 },
          riders: [ORYO_ADDRESS],
        },
      },
      {
        text: 'Draft the petition for her.',
        check: { stat: 'chi', dc: 6 },
        onSuccess: {
          text:
            'You write it in the proper forms, with the lease’s terms and her years at the station set out in order, ' +
            'and send it back with a clean copy. She writes that the officials read it twice, which they have never ' +
            'done for her before.',
          effects: { resolve: 1 },
          counters: { oryo_bond: 1 },
          riders: [ORYO_ADDRESS],
        },
        onFailure: {
          text:
            'Your forms are a samurai’s, not a station clerk’s. She thanks you kindly and has a scrivener in Mariko ' +
            'redo it. You can tell from her letter that she is being polite.',
          riders: [ORYO_ADDRESS],
        },
      },
      {
        text: 'Write that you cannot help.',
        onResolve: {
          text:
            'You write it plainly, without excuses. She writes back plainly too: she understands, and she will ' +
            'manage. You have no doubt she will. It does not make the letter easier to fold.',
          effects: { resolve: -1 },
          riders: [ORYO_ADDRESS],
        },
      },
    ],
  },

  // codex: the Keian plot was exposed by Marubashi's fever-talk (01 §B1); an
  // informer is one voice among what the officials already heard, and it
  // changes nothing in history (11 §5.4). Metsuke were the shogunate's
  // inspectors of its own officials (11 §5.4 G5, still to confirm in 01).
  // Informing is never framed as a win: the money is real, so is the cost.
  {
    id: 't1_yui_second_cup',
    type: 'story',
    title: 'The Third Invitation',
    body:
      'A student from the school in Kanda comes to your lodging with an invitation in Yui Shōsetsu’s own hand: ' +
      'tea, tomorrow, if you have the time. It is the third invitation. Nobody at the school has ever asked you ' +
      'for anything, and the tea is always good. The student waits at the door with the patience of someone who ' +
      'has been told not to hurry you. Down the lane, your neighbors are finding reasons to stand in their doorways.',
    weight: 1,
    inject: {
      act: 2,
      slot: 7,
      window: 3,
      onLapse: {
        riders: [
          {
            when: { flagsNot: ['keian_conspirator', 'refused_yui', 'informed_on_yui'] },
            then: { setFlags: ['refused_yui'] },
          },
        ],
      },
    },
    requires: {
      flagsNot: ['keian_conspirator', 'refused_yui', 'informed_on_yui'],
      anyOf: [{ flags: ['yui_measuring_you'] }, { flags: ['knows_the_plan'] }, { flags: ['yui_roster_seen'] }],
    },
    bodyVariants: [
      {
        when: { flags: ['yui_measuring_you'] },
        text:
          'This time the letter says more. There is a party going ahead to Sunpu, and there is a place in it for ' +
          'you. He has finished measuring you, it seems.',
      },
      {
        when: { flags: ['knows_the_plan'] },
        text:
          'You know what the tea is for now: the fire in the merchant wards, the castle guard, Sunpu. He knows that ' +
          'you know. That is why he is still asking.',
      },
      {
        when: { flags: ['yui_roster_seen'] },
        text:
          'You refused him once, at the top of his stair. He invites you anyway. Perhaps he saw where your eyes went ' +
          'on the way out.',
      },
    ],
    choices: [
      {
        text: 'Accept.',
        onResolve: {
          text:
            'You go. The tea is good, and nothing is said that could be written down. When you leave, you are one of ' +
            'them, and two men you have never met know where you lodge.',
          effects: { suspicion: 1 },
          setFlags: ['keian_conspirator'],
          riders: [{ when: { flags: ['yui_measuring_you'] }, then: { setFlags: ['yui_trusted'] } }],
        },
      },
      {
        text: 'Go to the metsuke instead.',
        visibleIf: { anyOf: [{ flags: ['knows_the_plan'] }, { flags: ['yui_roster_seen'] }] },
        requires: { stats: { kuchi: 7, chi: 6 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Kuchi 7 and Chi 6',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'The metsuke, the shogunate’s inspectors, keep you waiting a day and then listen for an hour, with the ' +
            'look of men who have heard parts of this before. A clerk writes down every name you give. A second ' +
            'clerk counts out five hundred mon. Nobody thanks you. On the way out, a guard spits, carefully, just ' +
            'beside your sandal. You walk home through a city that does not yet know what you are.',
          effects: { money: 500, gi: -3, resolve: -1 },
          setFlags: ['informed_on_yui'],
        },
        onFailure: {
          text:
            'They listen, and then ask who you are. A masterless man with a grudge and a story about a teacher of ' +
            'strategy: they have a drawer full of those. They send you away, and someone follows you home.',
          effects: { suspicion: 2 },
          setFlags: ['metsuke_doubts_you', 'refused_yui'],
        },
      },
      {
        text: 'Stay away from Kanda.',
        onResolve: {
          text:
            'You send the student back with a courteous refusal and find other streets to walk. The invitations ' +
            'stop. Once, at Nihonbashi, you see Yui across the market, and he nods to you as if nothing had happened ' +
            'between you, which is true.',
          setFlags: ['refused_yui'],
        },
      },
    ],
  },

  // codex: merchants lent to indebted samurai houses, and money-changing was
  // Nihonbashi's trade (01 §B2 merchants; §B4; §B5). A guard who ends a street
  // quarrel without killing leaves nothing for the magistrate (03 §1).
  // C9, bodyguard variant.
  {
    id: 't1_second_job_bodyguard',
    type: 'story',
    title: 'Men at the Gate',
    body:
      'Two money-changers on your employer’s street have been quarreling over a samurai house’s debts, and only ' +
      'one of them is going to be paid. Tonight the other sends men to your employer’s gate: four townsmen with ' +
      'clubs and a rōnin with a sword, to stand in the lane and make a point about whose customers are whose. ' +
      'Your employer watches from an upstairs shutter. The street watches from every other.',
    weight: 1,
    inject: { act: 2, slot: 9, window: 2, mandatory: true },
    requires: { flags: ['livelihood_bodyguard'] },
    choices: [
      {
        text: 'Hold the gate.',
        onResolve: { text: 'You step out into the lane and pull the gate shut behind you.', goto: 't1_second_job_gate_fight' },
      },
      {
        text: 'Talk them off the step.',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'You point out, loudly enough for the street, that a quarrel with witnesses is a matter for the ' +
            'magistrates, and that the rōnin is being paid far too little to explain himself to one. The rōnin ' +
            'laughs first. They go. In the morning your employer extends your contract and tells the story at his ' +
            'counter all week.',
          effects: { reputation: 1 },
          counters: { employer_contracts: 1 },
          riders: [HONEST_PATRON],
        },
        onFailure: {
          text: 'They hear you out. Then the rōnin shrugs, and the townsmen come on anyway.',
          goto: 't1_second_job_gate_fight',
        },
      },
    ],
  },
  {
    id: 't1_second_job_gate_fight',
    type: 'combat',
    title: 'Holding the Gate',
    body:
      'Five against one in a narrow lane is better than five against one in an open street. The townsmen come ' +
      'first, to find out what you are. The rōnin waits to see.',
    weight: 1,
    acts: [],
    foe: { name: 'The rival house’s men', power: 14 },
    onWin: {
      text:
        'Two townsmen go down with broken arms, and the rōnin decides he was paid to frighten, not to die. They ' +
        'carry each other off, all of them alive, and the whole street saw that too. Your employer extends your ' +
        'contract before breakfast.',
      effects: { reputation: 1 },
      counters: { employer_contracts: 1 },
      riders: [HONEST_PATRON],
    },
    onLose: {
      text:
        'They beat you to your knees and break a shutter to make their point, but the gate held until the ward’s ' +
        'men came running, and that is what you were paid for. Your employer counts the contract as kept.',
      effects: { health: -8 },
      counters: { employer_contracts: 1 },
    },
  },

  // codex: wandering swordsmen tested themselves against established schools,
  // and wooden-sword bouts could still maim (01 §B8 sword culture; Musashi's
  // legend, §B1 1645 row). 01 does not cover dōjō challenges as an institution,
  // so the text keeps to one man and one bout. C9, sword school variant.
  {
    id: 't1_second_job_dojo',
    type: 'story',
    title: 'A Challenger at the School',
    body:
      'A wandering swordsman comes to the Kanda school at midmorning. He goes from school to school, he says ' +
      'politely, asking each for a bout, and he tells every town he passes through which schools obliged him and ' +
      'which lost. He is thirty, lean, and plainly good. The master is at a patron’s house until evening. The ' +
      'students look at you, because you are the assistant, and because someone has to answer him.',
    weight: 1,
    inject: { act: 2, slot: 9, window: 2, mandatory: true },
    requires: { flags: ['livelihood_dojo'] },
    choices: [
      {
        text: 'Take down a wooden sword and meet him.',
        onResolve: {
          text: 'You choose a wooden sword from the rack. He bows exactly as deep as you do.',
          goto: 't1_second_job_dojo_bout',
        },
      },
      {
        text: 'Decline on the master’s behalf, without losing face.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: {
          text:
            'You tell him the master will receive him this evening, with pleasure, and invite him to wait. He ' +
            'considers you for a long moment, then smiles and says he will come back. He does not. The students ' +
            'stop looking at you as if you had failed them.',
          effects: { resolve: 1 },
        },
        onFailure: {
          text:
            'Your voice is not quite steady, and he hears it. He leaves telling the lane that the Kanda school hides ' +
            'behind its assistant. The master hears it by evening.',
          effects: { reputation: -1 },
        },
      },
    ],
  },
  {
    id: 't1_second_job_dojo_bout',
    type: 'combat',
    title: 'Wooden Swords',
    body:
      'Wooden swords, a bare floor, the students against the walls. Nobody is meant to die in a bout like this, ' +
      'and now and then somebody does anyway. He comes forward without a sound.',
    weight: 1,
    acts: [],
    foe: { name: 'Wandering swordsman', power: 14 },
    onWin: {
      text:
        'You take his wrist on the third exchange, and his sword clatters across the floor. He bows, thanks the ' +
        'school for the lesson, and goes. By the end of the month, people in Kanda know your name.',
      effects: { reputation: 2 },
      setFlags: ['dojo_name'],
    },
    onLose: {
      text:
        'He touches your ribs, your wrist, your temple, lightly, one after another, so that everyone can count. ' +
        'Then he bows and goes. The students are kind about it, which is worse.',
      effects: { reputation: -1, resolve: -1 },
    },
  },

  // codex: shrines raised money with sumo bouts, and rōnin wrestled for coin
  // (01 §B8). C9, sumo variant.
  {
    id: 't1_second_job_sumo',
    type: 'story',
    title: 'The Shrine Bout',
    body:
      'A big shrine across the river is raising money for a new hall, and its priests have hired the Fukagawa ' +
      'yard for a day of sumo in the shrine grounds. The yard’s boss wants you in the last bout, the one the crowd ' +
      'pays most to see, against a wrestler from Osaka who has not lost this year. The purse is real money. So is ' +
      'the Osaka man: a head taller than you, heavier by a sack of rice, and known for hurting people who last ' +
      'too long.',
    weight: 1,
    inject: { act: 2, slot: 9, window: 2, mandatory: true },
    requires: { flags: ['livelihood_sumo'] },
    choices: [
      {
        text: 'Take the last bout.',
        onResolve: { text: 'You tie on the belt and walk out into the shrine yard.', goto: 't1_second_job_shrine_bout' },
      },
      {
        text: 'Let the boss find someone younger.',
        onResolve: {
          text:
            'The boss shrugs and finds a porter’s son who needs the money more. You watch from the crowd as the ' +
            'Osaka man throws him in a breath. Your ribs are whole. Your standing in the yard is not what it was.',
          effects: { resolve: -1 },
        },
      },
    ],
  },
  {
    id: 't1_second_job_shrine_bout',
    type: 'combat',
    title: 'The Last Bout',
    body:
      'The crowd fills the shrine yard to the gate. The Osaka man stamps, crouches, and waits for you with the ' +
      'patience of someone who has never needed to hurry.',
    weight: 1,
    acts: [],
    foe: { name: 'Osaka wrestler', power: 15 },
    onWin: {
      text:
        'He comes in low and you let him, then turn at the edge, and he goes out past you into the crowd. The ' +
        'priests pay the purse in full, and the shrine’s patrons send sake to the yard for a week.',
      effects: { money: 250, reputation: 1 },
    },
    onLose: {
      text:
        'He lifts you by the belt and sets you down outside the ring, not gently. Something in your side cracks. ' +
        'The purse goes to Osaka.',
      effects: { health: -4 },
    },
  },

  // codex: underworld lenders charged interest past 100% a year, and bakuto
  // houses ran loan-sharking under oyabun patronage (01 §B4 prices; §B7). The
  // debtor is a person with a trade and a reason (checklist A4), and refusing
  // is not framed as naive. C9, underworld variant.
  {
    id: 't1_second_job_underworld',
    type: 'story',
    title: 'The Lacquerer’s Debt',
    body:
      'The oyabun sends you out with his collector to a lacquerer’s shop in a back lane. The lacquerer, Tokubei, ' +
      'borrowed three ryō in the winter, when his wife was sick. At a gambling house’s rates, which run past ' +
      'double in a year, three has become six. His shelves are half empty, and his good tools are already pledged ' +
      'elsewhere. He kneels in his doorway and says he will pay at the new year. Behind him, his two grown sons ' +
      'have come in from the workshop, and they are not kneeling. The collector looks at you. That is what you ' +
      'are here for.',
    weight: 1,
    inject: { act: 2, slot: 9, window: 2, mandatory: true },
    requires: { flags: ['livelihood_underworld'] },
    choices: [
      {
        text: 'Collect.',
        check: { stat: 'tan', dc: 6 },
        onSuccess: {
          text:
            'You do not have to touch him. You stand in the doorway until his sons look at the floor, and Tokubei ' +
            'brings out a box with a little silver and his wife’s good comb in it. The collector takes both. You ' +
            'take your share, a hundred and fifty mon, and walk back past the neighbors’ closed shutters.',
          effects: { money: 150, gi: -1, suspicion: 1 },
          counters: { gang_jobs: 1 },
        },
        onFailure: {
          text: 'The elder son steps between you and his father, and the younger picks up a mallet.',
          goto: 't1_second_job_debtor_sons',
        },
      },
      {
        text: 'Refuse to lay hands on him.',
        onResolve: {
          text:
            'You tell the collector you will not do it, and you walk out. The oyabun hears by evening. He sends a man ' +
            'to say you owe the house for its advance, and you pay fifty mon of it at your door while the lane ' +
            'watches. The work is over. Tokubei’s debt is not.',
          effects: { money: -50, gi: 1 },
          setFlags: ['gang_quit'],
        },
      },
    ],
  },
  {
    id: 't1_second_job_debtor_sons',
    type: 'combat',
    title: 'In the Lacquerer’s Doorway',
    body:
      'Two young men with a mallet and a lacquer paddle, fighting for their father in their own doorway. They ' +
      'have never fought a man with two swords. They do not seem to care.',
    weight: 1,
    acts: [],
    foe: { name: 'The debtor’s sons', power: 12 },
    onWin: {
      text:
        'You put them both on the floor without drawing, and the collector steps over them to the strongbox. The ' +
        'house pays you a hundred and fifty mon. The lane saw all of it, and will not forget whose man you were.',
      effects: { money: 150, gi: -1, suspicion: 1 },
      counters: { gang_jobs: 1 },
    },
    onLose: {
      text:
        'The mallet takes your knee and the paddle your head. The collector runs. The oyabun pays nothing for a ' +
        'job that ended with his man on a lacquerer’s floor, and the lane tells the story for a week.',
      effects: { health: -6, suspicion: 1 },
    },
  },

  // codex: adauchi was legal only with authorization and a paper trail, and
  // unlicensed revenge was murder; private hatashiai duels were suppressed and
  // persisted illegally (01 §B2; 11 §5.1). Katsuragi is a person carrying out a
  // choice, and the text lets him be right about the households (03 §4 cast;
  // 11 §5 row C10). The locate step is a cost, not a lockout (11 §1.3).
  {
    id: 't1_katsuragi_garden',
    type: 'story',
    title: 'Katsuragi’s Street',
    body:
      'Katsuragi Hyōgo is somewhere in this city. Thirty-three years, a stipend and a small office have made him a ' +
      'man with a gate, a household, and a street where the neighbors know his name. Somewhere behind the long ' +
      'walls of the samurai quarter, an old man is going about his day with no idea that you have walked the ' +
      'whole Tōkaidō to see his face. Or with every idea. You have your father’s name, and his. You need only his ' +
      'street.',
    weight: 1,
    inject: { act: 2, slot: 11, window: 2, mandatory: true },
    choices: [
      {
        text: 'Go straight to Banchō. You already know where to look.',
        visibleIf: { anyOf: [{ flags: ['oryo_katsuragi_address'] }, { flags: ['katsuragi_rumor'] }] },
        onResolve: {
          text: 'What you heard is enough. By noon you are standing at his gate.',
          goto: 't1_katsuragi_garden_found',
        },
      },
      {
        text: 'Ask at the gatehouses and teahouses of the samurai quarter.',
        check: { stat: 'me', dc: 6 },
        onSuccess: {
          text:
            'A gatekeeper who likes to talk, a tea-seller who likes coin, a clerk who remembers the name. By evening ' +
            'you know the house.',
          goto: 't1_katsuragi_garden_found',
        },
        onFailure: {
          text:
            'Two days of asking, and a hundred mon in tea and small gifts, before a porter who carries rice into the ' +
            'quarter says the name back to you and points.',
          effects: { money: -100 },
          goto: 't1_katsuragi_garden_found',
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_garden_found',
    type: 'story',
    title: 'Katsuragi’s Garden',
    body:
      'The house is modest, as the houses of small offices are, and the gate stands open. In a walled garden no ' +
      'bigger than a room, a man is pruning a black pine, one tuft of needles at a time. Katsuragi Hyōgo is old ' +
      'now, and his hands are steady. He knows you before you speak; he says your father’s name, not yours. He ' +
      'denies nothing. Four hundred households walked out of that castle alive because he signed, and their ' +
      'grandchildren are alive today. Your father would have held the gate until the besiegers burned it with ' +
      'every one of them inside. “So I had him stopped,” he says. “I would do it again.” He is not wrong about the ' +
      'households. You have seen what confiscation looks like, walking the Tōkaidō with its bedding on its back. ' +
      'He sets down the shears and waits.',
    weight: 1,
    acts: [],
    bodyVariants: [
      {
        when: { flags: ['swallowed_insult'] },
        text:
          'He studies the way you stand, and something in his face eases. “You have bowed to men who were wrong,” ' +
          'he says. “You know what things cost now.”',
      },
    ],
    choices: [
      {
        text: 'Petition for a licensed vendetta.',
        visibleIf: { itemsAny: ['fathers_letter'], flagsNot: ['letter_burned'] },
        onResolve: {
          text:
            'You tell him you will do it by law. He nods, as if it were the answer he expected from your father’s ' +
            'son, and goes back to his pine.',
          goto: 't1_katsuragi_petition',
        },
      },
      {
        text: 'Challenge him to a duel at dawn.',
        requires: { stats: { waza: 9 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Waza 9',
        onResolve: {
          text: '“At my age,” he says, “I would be grateful for the courtesy.” He names a second. You will need one too.',
          goto: 't1_katsuragi_duel_terms',
        },
      },
      {
        text: 'Say nothing today. Find a go-between, and sell him the letter’s silence.',
        visibleIf: { itemsAny: ['fathers_letter'], flagsNot: ['letter_burned'] },
        check: { stat: 'me', dc: 6 },
        onSuccess: {
          text:
            'It takes a week, but you find the right man: a broker of quiet arrangements who has carried messages ' +
            'into Banchō before.',
          goto: 't1_katsuragi_blackmail_terms',
        },
        onFailure: {
          text:
            'The go-between you choose carries your message, and then carries your name, your lodging and your face ' +
            'to Katsuragi’s steward, for a second fee. The answer comes back all the same: he will pay, in time. ' +
            'Now he knows exactly who is asking.',
          effects: { suspicion: 1, gi: -1 },
          setFlags: ['blackmail_katsuragi', 'blackmail_exposed'],
        },
      },
      {
        text: 'Leave him to his pine.',
        onResolve: {
          text:
            'You bow, the depth one gives an old man in his own garden, and go out through the open gate. He does ' +
            'not watch you leave. Thirty-three years of walking toward this street end on its far side, and the ' +
            'street goes on.',
          effects: { gi: 1, resolve: -1 },
          setFlags: ['vendetta_set_aside'],
          riders: [{ when: { flags: ['swallowed_insult'] }, then: { effects: { resolve: 2 } } }],
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_petition',
    type: 'story',
    title: 'The Petition',
    body:
      'A licensed vendetta, adauchi, is the one way the law lets a son kill his father’s killer. Without the ' +
      'license and its papers, it is murder, and murderers are crucified. With them, it is a duty the state ' +
      'records. The trouble is the door. Your domain, which would have granted the license, no longer exists. A ' +
      'scrivener near the magistrates’ offices drafts petitions for masterless men, for a fee, and tells you the ' +
      'clerks will weigh two things: the documents, and the man. You can argue from either. It will be slow.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Argue from the documents, starting with the letter in your father’s hand.',
        check: { stat: 'chi', dc: 7, mods: [{ when: { flags: ['sworn_testimony'] }, pct: 8 }] },
        onSuccess: {
          text:
            'You set the letter beside the dates of the siege and the names of men who were there, each in its ' +
            'proper form. The clerk reads it twice and files it without comment, which the scrivener says is the ' +
            'best sign there is. It will be heard. Not soon.',
          effects: { reputation: 1 },
          setFlags: ['adauchi_petition_filed'],
        },
        onFailure: {
          text:
            'The clerk finds a gap: a date that does not match, a witness who cannot be called. He files the ' +
            'petition anyway, with a note in the margin. It will be heard, weakly.',
          setFlags: ['adauchi_petition_filed', 'petition_weak'],
        },
      },
      {
        text: 'Argue from the testimony: what was seen in the inner court that night.',
        check: { stat: 'kuchi', dc: 7, mods: [{ when: { flags: ['sworn_testimony'] }, pct: 8 }] },
        onSuccess: {
          text:
            'You tell it the way it was told to you, plainly, in order, without heat. The clerk stops writing ' +
            'halfway through and listens. When you finish, he files it himself. It will be heard. Not soon.',
          effects: { reputation: 1 },
          setFlags: ['adauchi_petition_filed'],
        },
        onFailure: {
          text:
            'You tell it too hotly, and the clerk writes down your anger along with your account. He files it all ' +
            'the same. It will be heard, with a note in the margin about the petitioner.',
          setFlags: ['adauchi_petition_filed', 'petition_weak'],
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_duel_terms',
    type: 'story',
    title: 'Terms',
    body:
      'A private duel between two men of the sword, hatashiai, is a crime whatever the seconds say. The shogunate ' +
      'forbids it, and it goes on anyway, at dawn, in places where no one is looking. The terms are all that is ' +
      'left to argue: the ground, the hour, the seconds, and who may stand near. Katsuragi’s second is a quiet man ' +
      'in his forties who has done this before. Yours is a rōnin from your lodging-house who owes you money. ' +
      'Whoever sets the terms decides half the fight.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Set fair terms, point by point, the way a swordsman knows them.',
        check: { stat: 'waza', dc: 7 },
        onSuccess: {
          text:
            'You name the ground, a stretch of river bank you have walked, and the hour, first light, and one second ' +
            'each. His second tries twice to move the ground and fails twice. At dawn there is one man across from ' +
            'you, and the sun is behind neither of you.',
          goto: 't1_katsuragi_duel_fair',
        },
        onFailure: {
          text:
            'His second agrees to everything you ask and changes it in the telling. At dawn the ground is his ' +
            'choosing, and there are three men with Katsuragi, not one.',
          goto: 't1_katsuragi_duel_unfair',
        },
      },
      {
        text: 'Think better of it before dawn.',
        onResolve: {
          text:
            'You send word that the challenge is withdrawn. His second sends back a single pine needle, wrapped in ' +
            'paper. By noon you understand that you have let it go, and that you will have to live with having let ' +
            'it go.',
          effects: { resolve: -2 },
          setFlags: ['vendetta_set_aside'],
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_duel_fair',
    type: 'combat',
    title: 'First Light',
    body:
      'First light on the river bank, mist on the water, one second each, standing apart. Katsuragi comes down the ' +
      'bank in plain clothes with his sleeves tied back. He is old. He is also the best swordsman you have ever ' +
      'faced, and he does not waste a step.',
    weight: 1,
    acts: [],
    foe: { name: 'Katsuragi Hyōgo', power: 15 },
    winPctMod: 10,
    onWin: {
      text:
        'His guard opens for half a breath, the way an old man’s will, and your blade goes through it and across ' +
        'his forearm. He goes to one knee, sword down, blood on the grass. His second does not move. A private duel ' +
        'with seconds is still a crime, and three people on this bank know your face.',
      effects: { suspicion: 2 },
      setFlags: ['hatashiai_won'],
      goto: 't1_katsuragi_duel_after',
    },
    onLose: {
      text:
        'He takes your sword arm on the second pass and your legs on the third, and then his blade is at your ' +
        'throat. He holds it there a long moment. Then he wipes it and walks up the bank without a word. He has ' +
        'spared you. You will spend a long time understanding why that is worse.',
      effects: { health: -10, resolve: -3 },
      setFlags: ['duel_lost', 'vendetta_set_aside'],
    },
  },
  {
    id: 't1_katsuragi_duel_unfair',
    type: 'combat',
    title: 'First Light',
    body:
      'First light, on ground he chose, with the low sun behind him. Katsuragi comes down the bank with his sleeves ' +
      'tied back, and behind him three men who are not seconds stand close enough to matter. He is old. He is also ' +
      'the best swordsman you have ever faced.',
    weight: 1,
    acts: [],
    foe: { name: 'Katsuragi Hyōgo', power: 15 },
    winPctMod: -10,
    onWin: {
      text:
        'Sun in your eyes or not, his guard opens for half a breath, and your blade goes through it and across his ' +
        'forearm. He goes to one knee, sword down. His men look to him, and he lifts one hand to hold them. A ' +
        'private duel is still a crime, and five people on this bank know your face.',
      effects: { suspicion: 2 },
      setFlags: ['hatashiai_won'],
      goto: 't1_katsuragi_duel_after',
    },
    onLose: {
      text:
        'He takes your sword arm on the second pass and your legs on the third, and then his blade is at your ' +
        'throat. He holds it there a long moment. Then he wipes it and walks up the bank without a word. He has ' +
        'spared you. You will spend a long time understanding why that is worse.',
      effects: { health: -10, resolve: -3 },
      setFlags: ['duel_lost', 'vendetta_set_aside'],
    },
  },
  {
    id: 't1_katsuragi_duel_after',
    type: 'story',
    title: 'First Blood',
    body:
      'Katsuragi kneels in the wet grass with his sword arm useless and his eyes on yours. Around you are the ' +
      'river, the mist, and men waiting to see what you do. No one here matters to the law, and no law will call ' +
      'this anything but a crime. First blood is drawn. What comes next is yours.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Finish it.',
        onResolve: {
          text:
            'You do it cleanly. He does not flinch. His second covers the body with his own jacket, and you walk up ' +
            'the bank with thirty-three years behind you and nothing in front. Katsuragi Hyōgo is dead.',
          effects: { gi: -1 },
          setFlags: ['katsuragi_dead'],
        },
      },
      {
        text: 'First blood is enough.',
        onResolve: {
          text:
            'You step back and sheathe. He looks at you a long time, then lets his second help him up. He will live, ' +
            'and carry the arm the rest of his life. Neither of you says your father’s name.',
          effects: { gi: 1 },
          setFlags: ['katsuragi_spared_duel'],
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_blackmail_terms',
    type: 'story',
    title: 'Quiet Arrangements',
    body:
      'The go-between keeps an office behind a pawnshop, and he has carried messages into Banchō before. He will ' +
      'carry yours: that you hold a letter in your father’s hand, that it names Katsuragi Hyōgo, and that an ' +
      'office like his does not survive such a letter reaching his superiors. What comes back depends on the ' +
      'terms you set, and on how you set them.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Set the terms yourself, and make them stick.',
        check: { stat: 'kuchi', dc: 6 },
        onSuccess: {
          text:
            'Three hundred mon, carried by the go-between, no meetings, no names. The payment comes wrapped in plain ' +
            'paper with no note. It is the most money you have held in Edo, and it feels like nothing at all.',
          effects: { money: 300, gi: -1 },
          setFlags: ['blackmail_katsuragi'],
        },
        onFailure: {
          text:
            'You push too hard. The broker hears it, and so, it turns out, does Katsuragi’s steward, who pays the ' +
            'broker more. No money comes. What comes instead is a man who stands across from your lodging for an ' +
            'afternoon, learning your face.',
          effects: { suspicion: 1, gi: -1 },
          setFlags: ['blackmail_katsuragi', 'blackmail_exposed'],
        },
      },
      {
        text: 'Take whatever he sends, and ask nothing more.',
        onResolve: {
          text:
            'A hundred mon comes back, wrapped in plain paper, with a second message: this will be the last, unless ' +
            'it is not. You take it. The letter stays where it is.',
          effects: { money: 100, gi: -1 },
          setFlags: ['blackmail_katsuragi'],
        },
      },
    ],
  },

  // codex: Marubashi Chūya, historical, planned to burn Edo and storm the
  // castle while Yui seized Sunpu; the plot was exposed by his fever-talk
  // (01 §B1, 1651 Sep row). The fever here is hedged to "this week" and he
  // confesses nothing 01 doesn't record (11 §5 row C11). Selling them is not a
  // win (11 §5.4).
  {
    id: 't1_fever_friend',
    type: 'story',
    title: 'The Fever Friend',
    body:
      'Marubashi Chūya, the spearman, is Yui’s man in Edo, and he is running a fever this week and talking ' +
      'through it. He drinks with you in the back room of his house, flushed and expansive, and tells you what ' +
      'the fire in the merchant wards will look like from the castle walls, how the guards will run toward it, ' +
      'and who will be waiting when they do. He talks as if the thing were already done. Twice he says names he ' +
      'should not. Then Yui comes in out of the rain and asks, pleasantly, which of you will go ahead with him to ' +
      'Sunpu.',
    weight: 1,
    inject: { act: 2, slot: 13, window: 2, mandatory: true, onLapse: { setFlags: ['in_edo_act3'] } },
    requires: { flags: ['keian_conspirator'] },
    bodyVariants: [
      {
        when: { flags: ['yui_trusted'] },
        text: 'He looks at you first when he asks it, and waits for your answer before anyone else’s.',
      },
    ],
    choices: [
      {
        text: 'Sit with Marubashi through the fever.',
        onResolve: {
          text:
            'You send the others home and stay. He talks until the small hours, about spears and debts and the ' +
            'fire, and then he sleeps. In the morning he remembers that you stayed. That is how friendships start, ' +
            'in this business as in others.',
          effects: { resolve: 1 },
          setFlags: ['marubashi_friend', 'in_edo_act3'],
        },
      },
      {
        text: 'Tell him to stop talking before he gets you all killed.',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'You say it quietly, when the others have gone. He stares at you, and then he laughs, and then he takes ' +
            'your hand. “You are the only one who says it to my face.” He will not stop talking. But he will ' +
            'remember who told him to.',
          setFlags: ['marubashi_friend', 'in_edo_act3', 'warned_marubashi_early'],
        },
        onFailure: {
          text:
            'You say it in front of the others, and it comes out as a rebuke. He goes red and cold at once. He does ' +
            'not throw you out. He does not look at you again all night, either.',
          effects: { resolve: -1 },
          setFlags: ['in_edo_act3'],
        },
      },
      {
        text: 'Go ahead to Sunpu with Yui’s party.',
        onResolve: {
          text:
            'Yui nods, as if he had known. When he leaves for Sunpu, you will be walking beside him, on papers ' +
            'someone else has arranged. You have been through Sunpu before, going the other way.',
          setFlags: ['in_sunpu_act3'],
        },
      },
      {
        text: 'Sell them.',
        requires: { stats: { kuchi: 7, chi: 6 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Kuchi 7 and Chi 6',
        check: { stat: 'kuchi', dc: 6 },
        onSuccess: {
          text:
            'You go to the metsuke with names, a house, a date. They have heard some of it already; Marubashi talks ' +
            'in wineshops. You are one voice among what they know, and paid like one: five hundred mon, and your ' +
            'own name struck from a list. You walk back past Marubashi’s house. The shutters are open. He is still ' +
            'talking.',
          effects: { money: 500, gi: -3, resolve: -2 },
          clearFlags: ['keian_conspirator'],
          setFlags: ['informed_on_yui', 'in_edo_act3'],
        },
        onFailure: {
          text:
            'They listen, and then they ask how you come to know so much. A man inside a plot who sells it is still ' +
            'a man inside a plot. They let you go, and they write your name down. You go back to Marubashi’s house, ' +
            'because there is nowhere else to go.',
          effects: { suspicion: 2 },
          setFlags: ['in_edo_act3'],
        },
      },
    ],
  },

  // codex: Shōgun Tokugawa Iemitsu died in 1651 and was succeeded by his child
  // heir Ietsuna; the power vacuum was the conspirators' trigger (01 §B1, 1651
  // Jun row). Nothing else about the mourning is stated: 01 does not cover it.
  {
    id: 't1_shogun_is_dead',
    type: 'story',
    title: 'The Shōgun Is Dead',
    body:
      'Summer, 1651. The news goes through Edo in a morning: the shōgun, Tokugawa Iemitsu, is dead. His heir, ' +
      'Ietsuna, is a child. People still have to eat, so the markets open, but everyone in them is listening. In ' +
      'the teahouses, men who wear two swords and draw no stipend say nothing aloud and count on their fingers ' +
      'under the table. The city is waiting to see who will move first, and nobody wants to be seen waiting.',
    weight: 1,
    acts: [],
    bodyVariants: [
      {
        when: { flags: ['keian_conspirator'] },
        text: 'At the school in Kanda, nobody mentions it at all, which is how you know they have been waiting for it.',
      },
    ],
    choices: [
      {
        text: 'Go out and listen to the city.',
        onResolve: {
          text:
            'You walk from Nihonbashi to Kanda and back. Nobody says anything that could be written down, and ' +
            'everybody says it. You sleep well that night, for no reason you can name.',
          effects: { health: 1 },
          riders: [CITY_TIGHTENS],
        },
      },
      {
        text: 'Stay in your lodging and keep your head down.',
        onResolve: {
          text: 'You sleep, mend a sandal, and listen to the lane through the wall. The city holds its breath without you.',
          effects: { health: 1 },
          riders: [CITY_TIGHTENS],
        },
      },
    ],
  },
];

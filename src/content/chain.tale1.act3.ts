// Tale 1 (The Masterless Blade) Act 3 chain, per game-plan/11-tale1-chain-spec.md
// §1.4: C12 the Sagawa sweep, S3 the collapse (three versions, by where the PC
// stands), C13 the Katsuragi reckoning (two versions, by C10's approach), and
// C14 O-Ryō in autumn. Nodes (acts: []) are reached by `goto`, or spawned.
//
// Sensitivity (11 §5.2-5.4): executions are referenced, never depicted; the
// conspirators' families are always kept in (E4); seppuku gets no ritual or
// "beautiful death" language; the Sunpu gate is mechanical, not moral. "The
// execution ground" stays unnamed until 01 confirms where the Keian
// executions took place (11 §5.3).
//
// Deviation from 11 C12: "pay the okappiki" is dropped to keep C12 at four
// choices (03 §9); the Kuchi, Me, fight and O-Ryō exits remain.
import type { Choice, GameEvent, Outcome, Requirement } from '../engine/types';

// Arrest ends the run through the forced `ronin_kodenmacho` ending.
const ARREST = (text: string, extra: Partial<Outcome> = {}): Outcome => ({
  text,
  setFlags: ['taken_into_custody'],
  ...extra,
});

// 11 §1.4: every check in the sweep and at the Sunpu cordon is a DC harder
// while the watch-list still carries your house (DC +1 = 8 points).
const WATCHED = [{ when: { flags: ['watch_list_active'] } as Requirement, pct: -8 }];

const SWEEP_BODY =
  'Sagawa Jin’emon is a dōshin, one of the city magistrate’s constables, and he is not a cruel man. ' +
  'He is a thorough one. He has a list of masterless samurai who have been seen in the wrong company ' +
  'this summer, and your name is on it, in a clerk’s tidy hand. His okappiki, the informers who do the ' +
  'lane-work, stand at both ends of your street. Sagawa himself waits at your door with a short ' +
  'truncheon through his sash and a look of mild regret. He would like to ask you some questions, he ' +
  'says, and he would like to ask them here rather than at Kodenmachō.';

const SWEEP_CHOICES: Choice[] = [
  {
    text: 'Answer every question, slowly and in order.',
    check: { stat: 'kuchi', dc: 8, mods: WATCHED },
    onSuccess: {
      text:
        'You give him the dull truth of your summer: rents, meals, a debt. He checks two details against ' +
        'his list, finds them true, and crosses something out. He tells you to keep away from teachers.',
      setFlags: ['escaped_sagawa'],
      effects: { suspicion: -1 },
    },
    onFailure: ARREST(
      'Your second answer does not match your first. Sagawa sighs, as if you have disappointed him ' +
        'personally, and his men bind your wrists with cord.'
    ),
  },
  {
    text: 'Out the back, over the privy roof, and away.',
    check: { stat: 'me', dc: 8, mods: WATCHED },
    onSuccess: {
      text:
        'The okappiki at the back is watching the lane, not the roofs. You are three streets away before ' +
        'the shouting starts, and you sleep that night under a boat.',
      setFlags: ['escaped_sagawa'],
      effects: { resolve: -1 },
    },
    onFailure: ARREST(
      'A roof tile goes under your foot. You land in the lane at the feet of the man posted there, and ' +
        'he has a hooked staff for exactly this.'
    ),
  },
  {
    text: 'Cut through his men.',
    onResolve: { text: 'You draw. Sagawa steps back and lets his men come on.', goto: 't1_sagawa_fight' },
  },
  {
    text: 'Send word to O-Ryō’s people and go to ground.',
    visibleIf: { countersMin: { oryo_bond: 2 } },
    onResolve: {
      text:
        'A porter O-Ryō feeds takes you out in an empty rice tub. For a week you sleep in a cook-shop loft. ' +
        'She does not complain. You know what it would cost her if they looked.',
      setFlags: ['escaped_sagawa'],
      counters: { oryo_bond: -1 },
    },
  },
];

const HEARING_STEP2: Choice[] = [
  {
    text: 'Set out the law and the letter, point by point.',
    requires: { stats: { chi: 8 } },
    displayWhenUnmet: 'locked_hint',
    lockedHint: 'needs Chi 8',
    check: { stat: 'chi', dc: 8, mods: [{ when: { flags: ['scrivener_needed'] }, pct: -8 }] },
    onSuccess: {
      text:
        'The magistrate hears you out without a word, then asks one question about the date of the ' +
        'surrender. You have the answer. The license is written that afternoon.',
      setFlags: ['adauchi_granted'],
      effects: { reputation: 1 },
      goto: 't1_katsuragi_before_duel',
    },
    onFailure: {
      text: 'You lose the thread on the date of the surrender. The magistrate defers the matter. It is not a refusal.',
      setFlags: ['adauchi_deferred'],
      effects: { resolve: -1 },
    },
  },
  {
    text: 'Tell him plainly what was done to your father.',
    requires: { stats: { kuchi: 8 } },
    displayWhenUnmet: 'locked_hint',
    lockedHint: 'needs Kuchi 8',
    check: { stat: 'kuchi', dc: 8, mods: [{ when: { flags: ['scrivener_needed'] }, pct: -8 }] },
    onSuccess: {
      text:
        'You do not raise your voice. When you finish, the room is quiet, and the magistrate signs. A ' +
        'license names the day, the place and the witnesses.',
      setFlags: ['adauchi_granted'],
      effects: { reputation: 1 },
      goto: 't1_katsuragi_before_duel',
    },
    onFailure: {
      text: 'Your voice catches where it should not. The magistrate defers the matter. It is not a refusal.',
      setFlags: ['adauchi_deferred'],
      effects: { resolve: -1 },
    },
  },
  {
    text: 'Let the clerk read the petition for you.',
    onResolve: {
      text:
        'The clerk reads well and fast. The magistrate listens, then defers the matter to a later session ' +
        'that, this autumn, will not come.',
      setFlags: ['adauchi_deferred'],
      effects: { resolve: -1 },
    },
  },
];

export const TALE1_ACT3_CHAIN: GameEvent[] = [
  // ---------- C12: the Sagawa sweep (11 §1.4) ----------
  // codex: dōshin were the city magistrates' constables; okappiki, their hired
  // informers. Controls on rōnin tightened sharply after the 1651 plot (01 §B6).
  // Trigger 1: a recruited PC under suspicion, before the collapse.
  {
    id: 't1_sagawa_sweep',
    type: 'story',
    title: 'The Constable at the Door',
    body: SWEEP_BODY,
    weight: 1,
    inject: { act: 3, slot: 3, window: 1, priority: 5 },
    requires: { flags: ['keian_conspirator'], flagsNot: ['escaped_sagawa'], min: { suspicion: 3 } },
    choices: SWEEP_CHOICES,
  },
  // Trigger 2: not recruited, after the collapse, if anything drew the eye.
  // The metsuke protect their informants, so an informer is never swept.
  {
    id: 't1_sagawa_sweep_after',
    type: 'story',
    title: 'The Constable at the Door',
    body: SWEEP_BODY,
    weight: 1,
    inject: { act: 3, afterEvent: 'spine3_fever_talk', slot: 1, window: 1, priority: 10 },
    requires: {
      flagsNot: ['keian_conspirator', 'informed_on_yui', 'escaped_sagawa'],
      anyOf: [{ min: { suspicion: 3 } }, { flags: ['hatashiai_won'] }, { flags: ['blackmail_exposed'] }],
    },
    choices: SWEEP_CHOICES,
  },
  // Trigger 3: Suspicion reaching 5 in Acts 2-3 spawns this (tale.ts watches).
  // In Act 1 Suspicion 5 is still the direct arrest: dōshin had no
  // jurisdiction on the road (03 §9.1 G5).
  {
    id: 't1_sagawa_raid',
    type: 'story',
    title: 'The Constable at the Door',
    body: SWEEP_BODY,
    weight: 1,
    acts: [],
    choices: SWEEP_CHOICES,
  },
  {
    id: 't1_sagawa_fight',
    type: 'combat',
    title: 'Steel in the Lane',
    body:
      'Four men with truncheons and a hooked staff, trained to take a swordsman alive. They come at you ' +
      'together and low, to tangle the blade.',
    weight: 1,
    acts: [],
    foe: { name: 'Sagawa’s men', power: 15 },
    onWin: {
      text:
        'Two are down and the others give ground. You are over a wall and gone. Sagawa knows your face now, ' +
        'and he is a thorough man. From tonight you are hunted.',
      setFlags: ['escaped_sagawa', 'sagawa_hunted'],
      setTracks: { suspicion: 5 },
    },
    onLose: ARREST('The staff hooks your ankle. They are on you before you can rise, and they are not gentle.', {
      effects: { health: -6 },
    }),
  },

  // ---------- S3: the collapse (shared spine 3, Tale 1 versions) ----------
  // S3-c: not recruited. News as rumor, then notice. 01 §B1: Yui's seppuku at
  // Sunpu, Sep 10; Marubashi taken in Edo, crucified Sep 24; families executed.
  {
    id: 'spine3_fever_talk',
    type: 'story',
    title: 'Fever Talk',
    body:
      'It reaches you the way everything reaches the lanes: first as a rumor in a cook-shop, then as a ' +
      'silence when a constable walks past, then as a notice on the board by the bridge. A man named ' +
      'Marubashi talked in a fever, and the men he talked about were taken before dawn. The teacher Yui ' +
      'Shōsetsu is dead at Sunpu, by his own hand, with the magistrate’s men at the door. The notice lists ' +
      'the others, and under each name, the households that will die with them: wives, sons, fathers, old ' +
      'women. The crowd at the board reads it and says nothing at all.',
    bodyVariants: [
      {
        when: { flags: ['refused_yui'] },
        text: 'You sat in that school. You said no. You look for the names of the men who said yes.',
      },
    ],
    weight: 1,
    inject: { act: 3, slot: 3, window: 1, mandatory: true },
    requires: { flagsNot: ['keian_conspirator'] },
    choices: [
      {
        text: 'Go to the execution ground and see it for yourself.',
        onResolve: {
          text:
            'You stand at the back of a crowd that has not come to jeer. You look for as long as you can. ' +
            'Afterward you cannot remember the walk home.',
          setFlags: ['saw_the_heads'],
          effects: { resolve: -2 },
        },
      },
      {
        text: 'Stay away. Keep your head down and your door shut.',
        onResolve: {
          text: 'You stay in. The lane is very quiet for a week, and everyone in it is listening.',
          effects: { resolve: -1 },
        },
      },
      {
        text: 'Go to the office and collect the rest of what you were promised.',
        visibleIf: { flags: ['informed_on_yui'] },
        onResolve: {
          text:
            'The clerk counts it out without looking at you. On the way out a man you do not know spits near ' +
            'your feet. Word gets around a lane.',
          effects: { money: 300, reputation: -1, resolve: -2 },
        },
      },
      {
        text: 'Burn the notes you kept on the school.',
        visibleIf: { flags: ['knows_the_plan'], flagsNot: ['informed_on_yui'] },
        onResolve: {
          text:
            'Names, a date, a sketch of a gate. They burn fast in the brazier. You watch until there is ' +
            'nothing left to read.',
          effects: { suspicion: -1, resolve: -1 },
        },
      },
    ],
  },

  // S3-a: recruited, sent to Sunpu. 11 §5.2: state the fact and the date,
  // keep the families, no ritual choreography, no bushidō framing.
  {
    id: 'spine3_sunpu',
    type: 'story',
    title: 'Sunpu, the Tenth Day',
    body:
      'The inn at Sunpu is surrounded before first light. You hear it before you see it: sandals in the ' +
      'street, a door slid shut two houses down, a dog that will not stop. Someone in Edo has talked. Yui ' +
      'Shōsetsu hears the news in his room and is calm, in the way of a man who has done his arithmetic ' +
      'long ago. He tells the few of you still with him that he will not be taken to Edo to be displayed. ' +
      'What you do is your own affair, he says, and he thanks you. Outside, the magistrate’s men are ' +
      'lighting torches they do not need.',
    weight: 1,
    inject: { act: 3, slot: 6, window: 1, mandatory: true },
    requires: { flags: ['keian_conspirator', 'in_sunpu_act3'] },
    choices: [
      {
        text: 'Stay beside him to the end.',
        requires: { min: { resolve: 6 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Resolve 6',
        onResolve: {
          text:
            'You stay. You choose it clearly, and it spares no one. Your name goes on the same list as his, ' +
            'with a household under it.',
          setFlags: ['chose_seppuku'],
        },
      },
      {
        text: 'Stand at the door with your sword.',
        onResolve: {
          text:
            'You hold the doorway longer than they expect. There are too many of them, and they have all ' +
            'morning.',
          endingId: 'death',
        },
      },
      {
        text: 'Cut a way out through the garden wall.',
        onResolve: { text: 'You go out the back, sword first, toward the thinnest part of the cordon.', goto: 't1_sunpu_wall' },
      },
      {
        text: 'Slip out with the kitchen staff before the cordon closes.',
        check: { stat: 'me', dc: 8, mods: WATCHED },
        onSuccess: {
          text:
            'An apron, a basket of turnips, your swords wrapped in straw. The guard at the kitchen gate ' +
            'counts heads and lets the cooks through. You walk west and do not stop.',
          setFlags: ['fled_the_plot'],
          evaluateEndings: true,
        },
        onFailure: ARREST(
          'The guard at the kitchen gate counts heads and gets one too many. He does not need to ask ' +
            'which one.'
        ),
      },
    ],
  },
  {
    id: 't1_sunpu_wall',
    type: 'combat',
    title: 'The Garden Wall',
    body: 'Three men at the back gate and a fourth with a lantern. Beyond them, an alley and the dark.',
    weight: 1,
    acts: [],
    foe: { name: 'the Sunpu cordon', power: 16 },
    onWin: {
      text:
        'You are through, bleeding, and running. Behind you the torches reach the inn. You never learn how ' +
        'the morning ended. You do not need to.',
      setFlags: ['broke_the_cordon', 'fled_the_plot', 'sagawa_hunted'],
      setTracks: { suspicion: 5 },
      effects: { health: -3 },
      evaluateEndings: true,
    },
    onLose: { text: 'The lantern-man was not the one to watch. The spear behind him was.', endingId: 'death' },
  },

  // S3-b: recruited, kept in Edo. Marubashi's fever-talk as 01 §B1 records it;
  // no invented confession (11 §5.2, C11 notes).
  {
    id: 'spine3_edo_arrests',
    type: 'story',
    title: 'Before Dawn',
    body:
      'A boy you paid to watch the corner shakes you awake. Marubashi has been talking in his fever, the ' +
      'boy says, talking to anyone at his bedside, and the constables were at his gate an hour ago. They ' +
      'have lists. They are working down them street by street, and your street is on the way. Somewhere ' +
      'in the city, men you drank with are being bound with cord in front of their wives. You have ' +
      'perhaps the time it takes to tie your sandals.',
    weight: 1,
    inject: { act: 3, slot: 6, window: 1, mandatory: true },
    requires: { flags: ['keian_conspirator', 'in_edo_act3'] },
    choices: [
      {
        text: 'Run to warn him.',
        visibleIf: { flags: ['marubashi_friend'] },
        onResolve: {
          text:
            'You go the long way round and get there in time to see them bring him out. The constables see ' +
            'you too.',
          setFlags: ['warned_marubashi_act3'],
        },
      },
      {
        text: 'Go to ground in the river quarters and wait it out.',
        check: { stat: 'tan', dc: 8, mods: WATCHED },
        onSuccess: {
          text:
            'Six days in a boatman’s shed, eating what he brings. On the seventh the searches move north. You ' +
            'walk out of Edo with a pack on your back and no name.',
          setFlags: ['fled_the_plot'],
          evaluateEndings: true,
        },
        onFailure: ARREST('On the third day the boatman’s nerve goes. He is crying when he brings them.'),
      },
      {
        text: 'Slip through the back lanes before the net closes.',
        check: { stat: 'me', dc: 8, mods: WATCHED },
        onSuccess: {
          text:
            'You see the lantern-lines forming and go where they are not. By noon you are past Shinagawa, a ' +
            'traveler like any other.',
          setFlags: ['fled_the_plot'],
          evaluateEndings: true,
        },
        onFailure: ARREST('The back lane ends in a wall you did not know was there. So do the constables.'),
      },
      {
        text: 'Sit down in your room and wait for them.',
        onResolve: ARREST(
          'You sit with your swords laid in front of you, hilts away. When they come, you are ready, and ' +
            'you do not make them hurry.'
        ),
      },
    ],
  },

  // ---------- C13: the Katsuragi reckoning (11 §1.4, §5.1) ----------
  // Variant A: the adauchi hearing. A compound check (04 §3.1): the clerk's
  // examination, then the magistrate's hearing, then the sanctioned duel.
  // codex: a licensed vendetta avenged the killing of a parent or senior kin,
  // and needed registration and a paper trail (01 §B2).
  {
    id: 't1_katsuragi_hearing',
    type: 'story',
    title: 'The Clerk Examines the Letter',
    body:
      'Your petition comes up in the worst season for it. Every masterless samurai in Edo is a suspect ' +
      'this autumn, and the clerk who takes your father’s letter looks at you as if you might be one. He ' +
      'reads it twice. He asks who witnessed the killing, where the body lay, who carried word, and why ' +
      'you waited thirty-six years. Katsuragi Hyōgo holds a shogunal office now, the clerk reminds you, as if ' +
      'you might have forgotten, and a charge against such a man had better be exact.',
    bodyVariants: [
      {
        when: { flags: ['retainer_testimony'] },
        text: 'You have Sahei’s account, in his own words, of the night your father was cut down.',
      },
    ],
    weight: 1,
    inject: { act: 3, afterEvent: 'spine3_fever_talk', slot: 2, window: 2, priority: 5 },
    requires: {
      flags: ['adauchi_petition_filed'],
      flagsNot: ['keian_conspirator', 'katsuragi_dead', 'vendetta_set_aside'],
    },
    choices: [
      {
        text: 'Answer from the law: dates, witnesses, the registers.',
        check: {
          stat: 'chi',
          dc: 7,
          mods: [
            { when: { flags: ['petition_weak'] }, pct: -8 },
            { when: { flags: ['sworn_testimony'] }, pct: 8 },
          ],
        },
        onSuccess: {
          text: 'The clerk finds nothing to send back. He stamps the petition for the magistrate’s hearing.',
          goto: 't1_hearing_magistrate',
        },
        onFailure: {
          text:
            'He finds three faults in the form. A scrivener mends them for 300 mon, and the petition goes up ' +
            'with the clerk’s doubts attached.',
          effects: { money: -300 },
          setFlags: ['scrivener_needed'],
          goto: 't1_hearing_magistrate',
        },
      },
      {
        text: 'Answer from the heart of it: what was done, and to whom.',
        check: {
          stat: 'kuchi',
          dc: 7,
          mods: [
            { when: { flags: ['petition_weak'] }, pct: -8 },
            { when: { flags: ['sworn_testimony'] }, pct: 8 },
          ],
        },
        onSuccess: {
          text: 'The clerk stops writing halfway through and simply listens. Then he stamps it.',
          goto: 't1_hearing_magistrate',
        },
        onFailure: {
          text:
            'He writes down what you say and not how you say it. A scrivener mends the form for 300 mon, and ' +
            'it goes up with his doubts attached.',
          effects: { money: -300 },
          setFlags: ['scrivener_needed'],
          goto: 't1_hearing_magistrate',
        },
      },
      {
        text: 'Withdraw the petition and let him grow old in his office.',
        onResolve: {
          text:
            'You take the letter back. The clerk looks relieved. Outside, you find that you are relieved too, ' +
            'and cannot decide what that makes you.',
          setFlags: ['vendetta_set_aside'],
          effects: { gi: 1, resolve: -1 },
        },
      },
    ],
  },
  {
    id: 't1_hearing_magistrate',
    type: 'story',
    title: 'The Magistrate’s Hearing',
    body:
      'The hearing room is cold and very clean. The magistrate is younger than you expected and has read ' +
      'everything. Katsuragi is not present. His answer is: an old man’s written statement that your ' +
      'father died in the confusion of the surrender, and that the matter is thirty-six years closed. The ' +
      'magistrate asks you to show him why it is not.',
    weight: 1,
    acts: [],
    choices: HEARING_STEP2,
  },
  // codex: a licensed avenger could bring helpers (sukedachi); the best-known
  // case is the Iga-goe vendetta of 1634 (verify for 01 §B2). It keeps the
  // Lawful Vendetta open to a PC who won it with words, not the sword.
  {
    id: 't1_katsuragi_before_duel',
    type: 'story',
    title: 'The License',
    body:
      'The license names the day, the place and the witnesses. It also allows what the law has always ' +
      'allowed an avenger: helpers, men to stand at your side on the sand. Katsuragi has already named ' +
      'his. You have four days.',
    weight: 1,
    acts: [],
    choices: [
      {
        text: 'Face him alone. It is your father, not theirs.',
        onResolve: { text: 'You spend the four days practicing cuts in a borrowed yard until your hands stop shaking.', goto: 't1_katsuragi_sanctioned' },
      },
      {
        text: 'Hire a second from a fencing hall, as the license allows.',
        requires: { min: { money: 100 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 100 mon for a second’s fee',
        onResolve: {
          text:
            'The fencing master sends his best senior student, a quiet man who asks only the time and the ' +
            'place. You pay him in advance.',
          effects: { money: -100 },
          goto: 't1_katsuragi_sanctioned_second',
        },
      },
      {
        text: 'Let the license lapse. He is seventy, and the record is corrected.',
        onResolve: {
          text:
            'You do not go to the sand on the fourth day. The license expires unused. Your father’s name ' +
            'stands corrected in the register, and that will have to be enough.',
          setFlags: ['vendetta_set_aside'],
          effects: { gi: 1, resolve: -1 },
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_sanctioned',
    type: 'combat',
    title: 'Before Witnesses',
    body:
      'A roped square of raked sand, a magistrate’s officer, two witnesses for each side. Katsuragi is old ' +
      'and moves like it until his sword is out. He bows to you first. You were not expecting that.',
    weight: 1,
    acts: [],
    foe: { name: 'Katsuragi Hyōgo', power: 13 },
    onWin: {
      text:
        'It is over quickly. He dies on the sand, and the officer records the time. There is no charge ' +
        'against you: it was lawful and witnessed, and you wait for the review as the license requires.',
      setFlags: ['katsuragi_killed_lawful', 'katsuragi_dead', 'submitted_to_review'],
      effects: { reputation: 2, resolve: 1 },
    },
    onLose: {
      text: 'He was a better swordsman at seventy than you are now. The officer records the time.',
      endingId: 'death',
    },
  },
  {
    id: 't1_katsuragi_sanctioned_second',
    type: 'combat',
    title: 'Before Witnesses',
    body:
      'A roped square of raked sand, a magistrate’s officer, two witnesses for each side. Katsuragi is old ' +
      'and moves like it until his sword is out. He bows to you first. Your second takes his place at your ' +
      'left, where Katsuragi’s man can’t reach you without going through him.',
    winPctMod: 30,
    weight: 1,
    acts: [],
    foe: { name: 'Katsuragi Hyōgo', power: 13 },
    onWin: {
      text:
        'It is over quickly. He dies on the sand, and the officer records the time. There is no charge ' +
        'against you: it was lawful and witnessed, and you wait for the review as the license requires.',
      setFlags: ['katsuragi_killed_lawful', 'katsuragi_dead', 'submitted_to_review'],
      effects: { reputation: 2, resolve: 1 },
    },
    onLose: {
      text: 'Your second holds his man. It does not help you with Katsuragi. The officer records the time.',
      endingId: 'death',
    },
  },

  // Variant B: the blackmail comes due. 11 §1.4: from a neutral start, C10's
  // -1 plus this -2 reaches Gi -3 by construction (Garden Gate).
  {
    id: 't1_katsuragi_letter_due',
    type: 'story',
    title: 'The Letter Comes Due',
    body:
      'Katsuragi has paid what you asked, twice. This autumn he has stopped. The city is full of ' +
      'constables looking for masterless men, and he has worked out that a rōnin carrying a grievance ' +
      'makes a poorer witness than a man with an office. His last message was one line: do what you like ' +
      'with it. You still have the copy of your father’s letter, and the names of the men above him who ' +
      'would read it with interest.',
    weight: 1,
    inject: { act: 3, afterEvent: 'spine3_fever_talk', slot: 2, window: 2, priority: 5 },
    requires: {
      flags: ['blackmail_katsuragi'],
      flagsNot: ['keian_conspirator', 'katsuragi_dead', 'vendetta_set_aside'],
    },
    choices: [
      {
        text: 'Send the letter to his superiors.',
        onResolve: {
          text:
            'You leave it with a clerk at the right gate. In ten days Katsuragi is out of office and out of ' +
            'the city. In eleven, his men come looking for you.',
          setFlags: ['katsuragi_ruined'],
          effects: { gi: -2 },
          goto: 't1_katsuragi_hirelings',
        },
      },
      {
        text: 'Burn your copy and let it end.',
        onResolve: {
          text:
            'It takes a long time to burn, for one sheet. Your father’s hand goes last. You do not feel ' +
            'better, only finished.',
          setFlags: ['vendetta_set_aside'],
          effects: { gi: 1, resolve: -1 },
        },
      },
    ],
  },
  {
    id: 't1_katsuragi_hirelings',
    type: 'combat',
    title: 'His Men Find You',
    body:
      'Three of them, in a lane by the fish market at dusk: hired swords, paid in advance, and not the ' +
      'kind who ask questions first.',
    weight: 1,
    acts: [],
    foe: { name: 'Katsuragi’s hired swords', power: 14 },
    onWin: {
      text:
        'You leave two of them in the lane. The third runs to tell someone. Word of steel by the fish ' +
        'market travels faster than you do.',
      effects: { suspicion: 2, health: -2 },
    },
    onLose: { text: 'They were paid in advance, and they earn it.', endingId: 'death' },
  },

  // ---------- C14: O-Ryō in autumn (11 §1.4) ----------
  // 11 §5 (C3/C7/C14): her offer is work and partnership, not rescue. The mirror
  // gate is the Plow's own floor minus this beat's +2 Resolve.
  {
    id: 't1_oryo_autumn',
    type: 'story',
    title: 'O-Ryō in Autumn',
    body:
      'O-Ryō’s teahouse smells of chestnuts and lamp oil. She has kept it through a bad year by being ' +
      'harder than the year was. She pours for you, sits down across the table, which she never does ' +
      'during the day, and tells you what she wants. There is a room at the back. There is a cousin’s ' +
      'plot upriver that nobody is working. There is more work than one woman can do, and she is tired of ' +
      'doing it alone. She is not offering to save you, she says. She is offering you a job, and she ' +
      'would like an answer before the rice is in.',
    weight: 1,
    inject: { act: 3, slot: 8, window: 0, priority: 10 },
    requires: {
      countersMin: { oryo_bond: 2 },
      flagsNot: ['keian_conspirator', 'fled_the_plot', 'hatashiai_won'],
    },
    choices: [
      {
        text: 'Put the sword in the ground behind the teahouse.',
        requires: { min: { gi: 2, resolve: 6 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Gi 2 and Resolve 6',
        onResolve: {
          text:
            'You wrap the blade in oiled cloth and dig until your back hurts. O-Ryō watches from the door ' +
            'and then goes in to see about supper.',
          setFlags: ['oryo_chain_complete', 'sword_buried'],
          effects: { resolve: 2 },
        },
      },
      {
        text: 'Take the farm plot her cousin cannot work.',
        requires: { min: { gi: 2, resolve: 6 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs Gi 2 and Resolve 6',
        onResolve: {
          text:
            'The swords go into a chest, and the chest goes under the floor. You learn that you know nothing ' +
            'about rice, and that the neighbors enjoy telling you so.',
          setFlags: ['oryo_chain_complete', 'sword_buried', 'plow_farm'],
          effects: { resolve: 2 },
        },
      },
      {
        text: 'Not yet.',
        onResolve: {
          text: 'She nods as if she expected it. The offer stands, she says, until it does not.',
          effects: { resolve: 1 },
        },
      },
    ],
  },
];

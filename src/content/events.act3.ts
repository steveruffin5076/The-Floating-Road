// Act 3 random event pool (Tale 1, rōnin): summer to autumn 1651, the city
// tightening around the Keian plot. These are the texture around the chain
// beats in 11 §1.4 (the Sagawa sweep, spine3_fever_talk, the Katsuragi
// reckoning, O-Ryō in autumn, Sunpu), not a second telling of them: informers,
// rumor, fear, neighbors, ordinary people caught in it. No real historical
// figure appears, and neither shōgun is named.
//
// Timeline: random draws land both before spine3_fever_talk (Act 3 slots 1-2)
// and after it (slots 5, 7, 8), so every event here reads true on either side
// of the collapse. None of them announces the news itself; that belongs to S3.
// Act 3 is the harshest act (12 §"Survival"): these average about -0.5 Resolve
// per event, carry real Health risk, and use Suspicion as the arrest clock.
import type { GameEvent } from '../engine/types';

export const ACT3_EVENTS: GameEvent[] = [
  // codex: okappiki, the city constables' hired informers, were often ex-criminals
  // themselves; under the gonin-gumi, neighbors were legally liable for each other's
  // crimes, and rōnin controls tightened after the 1651 plot (01 §B6, partly verified,
  // so it reads as the lane's practice, not a national rule). Kihei is a debtor under
  // pressure, not a villain. Adapts 03 §6 village "gonin-gumi meeting overhears you"
  // and night "the inn room with a listening wall" into an Edo lane. PC reads as a
  // masterless samurai; the text is gender-neutral.
  {
    id: 'keian_thin_wall',
    type: 'story',
    title: 'The Man Next Door',
    body:
      'The wall between your room and the next is one board thick, and for a month the man beyond it has ' +
      'been a quiet neighbor: Kihei, a sandal-maker with a cough and a daughter in service across the ' +
      'river. Tonight you come back early and find him in your room, turning over your bedding. He does ' +
      'not run. He sits down on the mat and tells you. An okappiki, one of the informers the magistrate’s ' +
      'constables keep, often an old thief himself, holds a debt of Kihei’s and will forget it for news of ' +
      'the masterless samurai in the lane: who visits, where you go, what you keep. And under the ' +
      'five-household rule, which makes neighbors answer for each other’s crimes, if you turn out to be ' +
      'something, his household answers for it with you. He has two days to bring the man something.',
    weight: 1,
    acts: [3],
    choices: [
      {
        text: 'Give him a harmless story to carry back.',
        check: { stat: 'kuchi', dc: 7 },
        onSuccess: {
          text:
            'You spend an hour building him a dull life: the sword school where you sweep floors, the ' +
            'noodle stall where you eat, the temple where you sleep off bad nights. He repeats it until he ' +
            'has it. A week later the okappiki stops loitering at the mouth of the lane.',
          effects: { suspicion: -1 },
        },
        onFailure: {
          text:
            'Your story has a hole in it, and the okappiki is paid to find holes. He comes to the lane ' +
            'himself the next evening and asks the landlord which nights you are out, and the landlord ' +
            'tells him.',
          effects: { suspicion: 2, resolve: -1 },
        },
      },
      {
        text: 'Pay off Kihei’s debt yourself.',
        requires: { min: { money: 200 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 200 mon',
        onResolve: {
          text:
            'Two hundred mon clears his debt. It does not clear the lane: the okappiki will find another ' +
            'neighbor with a debt, and you both know it. Kihei weeps anyway, which embarrasses you both, ' +
            'and brings you sandals he will not let you pay for.',
          effects: { money: -200, resolve: 1, gi: 1 },
        },
      },
      {
        text: 'Tell him what your sword will do if he says a word.',
        check: { stat: 'tan', dc: 7 },
        onSuccess: {
          text:
            'He believes you. For the rest of the season he coughs quietly and looks at the floor when you ' +
            'pass. The okappiki gets nothing from him. Kihei keeps his debt and his fear, and you keep the ' +
            'memory of his face.',
          effects: { resolve: -1, gi: -2 },
        },
        onFailure: {
          text:
            'He believes you, and he fears the magistrate more. By morning his room is empty and his ' +
            'daughter’s letters are gone from the shelf. By evening the okappiki knows why he ran, and ' +
            'from whom.',
          effects: { suspicion: 2, resolve: -1, gi: -2 },
        },
      },
      {
        text: 'Let him tell them the truth. He has a daughter.',
        onResolve: {
          text:
            'You tell him where you go and whom you see, slowly, so he can remember it. It is not much, and ' +
            'it is all true. Through the wall that night you hear him saying it over to himself. Somewhere ' +
            'an office will write it down.',
          effects: { suspicion: 1, resolve: -1, gi: 1 },
        },
      },
    ],
  },
  // codex: collective punishment was normal in the period's justice, and the Keian
  // conspirators' families were executed with them (01 §B6; §B1, 1651 Sep row). Kept
  // in and stated plainly (03 §9.1 E4); nothing is depicted (E1). It reads as fear
  // before the collapse and as fact after it. The son's circle is left unnamed: 01
  // does not place a strategy school in Kanda, so the text doesn't either. Informing
  // pays, and costs Gi and Resolve with no victory framing. Anchored to 03 §1 and the
  // spine-3 "arrest-sweep danger" texture; gender-neutral ("an armed traveler").
  {
    id: 'keian_grandmothers_errand',
    type: 'story',
    title: 'A Grandmother’s Errand',
    body:
      'O-Fusa sells boiled beans from a tray at the mouth of your lane. Her son, masterless like you, fell ' +
      'in this past year with a circle of men who talk late into the night about the state of the realm, ' +
      'and he has not slept at home for a month. She comes to your door with her grandson, a boy of eight ' +
      'with his sandals already tied, and a bundle of rice cakes. Everyone in the lane knows how it goes: ' +
      'when a man is condemned for treason, his family is executed with him. She does not say her son has ' +
      'done anything. She says her sister has a farm two days out of the city, and that a boy walking ' +
      'beside an armed traveler looks like a household on the road, where a boy walking beside his ' +
      'grandmother looks like exactly what he is. She has nothing to pay you with, and says so.',
    weight: 1,
    acts: [3],
    choices: [
      {
        text: 'Walk the boy to her sister’s farm yourself.',
        check: { stat: 'me', dc: 8 },
        onSuccess: {
          text:
            'You keep to the paddy dikes and the backs of temple grounds, and you talk about dogs and ' +
            'sandals the whole way. On the second evening her sister takes the boy in without asking a ' +
            'single question. You walk back alone and sleep better than you have in weeks.',
          effects: { resolve: 1, gi: 2 },
        },
        onFailure: {
          text:
            'A patrol stops you at the edge of the city. The boy gives his name before you can stop him, ' +
            'and the patrol’s captain writes it down beneath yours. They let you both go. You deliver him ' +
            'to the farm, and you will never know whether the page followed him there.',
          effects: { suspicion: 2, resolve: -2, gi: 1 },
        },
      },
      {
        text: 'Pay a packhorse driver to carry him.',
        requires: { min: { money: 150 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 150 mon',
        onResolve: {
          text:
            'The driver asks no questions, which is what the hundred and fifty mon is for. The boy looks ' +
            'back once from the saddle and then faces forward, as he has been told to. Nobody writes to ' +
            'tell you he arrived. Nobody writes to tell you he did not.',
          effects: { money: -150, gi: 1 },
        },
      },
      {
        text: 'Tell her the truth: two days is not far enough.',
        onResolve: {
          text:
            'She hears you out and nods, as if you had told her the price of rice. She takes the boy home. ' +
            'In the morning her tray is at the mouth of the lane as always, and she does not look toward ' +
            'your door.',
          effects: { resolve: -2 },
        },
      },
      {
        text: 'Sell her son’s name to the okappiki, the constables’ informer, before someone sells him yours.',
        check: { stat: 'kuchi', dc: 6 },
        onSuccess: {
          text:
            'The okappiki writes down the name and the lane, pays you a hundred mon, and does not thank ' +
            'you. What happens to O-Fusa, her son and the boy is decided in rooms you will never see, under ' +
            'the rule everyone in the lane already knew. Your own name stays off his page, for now. You ' +
            'stop using the mouth of the lane.',
          effects: { money: 100, suspicion: -1, resolve: -2, gi: -3 },
        },
        onFailure: {
          text:
            'He writes down the name and the lane. Then he asks how you come to know so much about a ' +
            'traitor’s household, and writes your name beside theirs. He pays you nothing. By the end of ' +
            'the week, O-Fusa’s tray is gone from the mouth of the lane.',
          effects: { suspicion: 2, resolve: -2, gi: -3 },
        },
      },
    ],
  },
  // codex: the shōgun died in 1651 and a child succeeded him, the power vacuum the
  // conspirators counted on (01 §B1, 1651 Jun row); sake everywhere (01 §B8); okappiki
  // as the constables' informers (01 §B6). Neither shōgun is named. Adapts 03 §6
  // city-edo "teahouse where the plot is discussed in metaphor", moved to a sake stall
  // so it doesn't overlap spine3's teahouse rumor. The man by the door may be an
  // informer or a carpenter; the text never settles it. Two swords (noted).
  // swallowed_insult (Act 1, kirisute_tension) eases the Kuchi check: you have
  // practiced swallowing words.
  {
    id: 'keian_loose_talk',
    type: 'story',
    title: 'Loose Talk',
    body:
      'The sake stall under the bridge serves porters by day and masterless men by night, and tonight one ' +
      'of the night trade has drunk enough to say what the city is thinking. The old shōgun is dead, he ' +
      'announces, and a child sits in his place, and a child’s government is a paper wall in the wind. ' +
      'Nobody laughs. The stall-keeper wipes the same cup twice. By the door, a man in a plain jacket nurses ' +
      'one drink and looks at nothing in particular. He may be an okappiki, one of the informers the ' +
      'constables keep. He may be a tired carpenter. The talker has seen your two swords. He swings around ' +
      'on his bench and asks you, loudly, to tell them all he is right.',
    weight: 1,
    acts: [3],
    choices: [
      {
        text: 'Laugh, fill his cup, and walk him home.',
        check: { stat: 'kuchi', dc: 7, mods: [{ when: { flags: ['swallowed_insult'] }, pct: 10 }] },
        onSuccess: {
          text:
            'You turn it into a joke about paper walls and leaking roofs, and keep his cup full until he ' +
            'forgets what he was saying. You walk him to his lane with his arm across your shoulders. When ' +
            'you come back past the stall, the man by the door has gone home too.',
          effects: { resolve: 1, gi: 1 },
        },
        onFailure: {
          text:
            'He will not be turned. He tells the whole stall you agree with him, and names your lane to ' +
            'prove how well he knows you. The man by the door pays for his drink and leaves without ' +
            'finishing it.',
          effects: { suspicion: 2, resolve: -1 },
        },
      },
      {
        text: 'Tell him he is right.',
        onResolve: {
          text:
            'It feels good to say it out loud, after so long. The stall goes very quiet. The man by the ' +
            'door finishes his drink with no hurry at all, and goes out into the dark the way a man goes ' +
            'when he has somewhere to report.',
          effects: { suspicion: 2, resolve: 1 },
        },
      },
      {
        text: 'Watch the man by the door, not the talker.',
        check: { stat: 'me', dc: 7 },
        onSuccess: {
          text:
            'He is no carpenter. His eyes go to faces, never to cups. When he slips out, you catch the ' +
            'talker at the back of the stall and tell him to sleep somewhere else tonight, and the next ' +
            'night too. He is sober enough, suddenly, to listen.',
          effects: { gi: 1 },
        },
        onFailure: {
          text:
            'He catches you watching and gives you a small nod, as if the two of you had been introduced. ' +
            'He takes his time over his drink after that, and so do you, and neither of you enjoys it.',
          effects: { suspicion: 1, resolve: -1 },
        },
      },
      {
        text: 'Leave your cup half full and go.',
        onResolve: {
          text:
            'You are three streets away before you let yourself walk slowly. Two days later the ' +
            'stall-keeper tells you, without being asked, that the talker has not been back, and that ' +
            'nobody has come asking after him either.',
          effects: { resolve: -1 },
        },
      },
    ],
  },
  // codex: Edo was a fire-prone wooden city with town fire brigades only coming into
  // being, and arson was punished by crucifixion (01 §B5, §B6). The Keian plan was to
  // burn Edo (01 §B1, 1651 Sep row); that link is for the codex card only, and the body
  // asserts no timing. The paid lantern watch is 03 §6 post-town "fire-watch night duty
  // (paid, Tan)" moved into an Edo lane; 01 doesn't describe watch arrangements, so the
  // text names no institution. Two swords implied ("an armed stranger").
  // fujieda_intervened (Act 1 chain) eases the Tan check: you have stood between a
  // crowd and a commoner before.
  {
    id: 'keian_fire_watch',
    type: 'story',
    title: 'The Fire Watch',
    body:
      'Edo is built of wood and paper, and a single lamp can burn down a quarter of it; on windy nights, ' +
      'every household thinks of that. Your lane pays a few coppers a night for someone to walk it with a ' +
      'lantern and call out if anything catches, and this month the someone is you. It is honest work. It ' +
      'also puts an armed stranger in the lanes after dark, in a season when patrols stop armed strangers. ' +
      'Arson is punished by crucifixion, and a frightened lane does not wait for proof. Near midnight, ' +
      'behind the rice dealer’s storehouse, you see a small glow low against the wall and a figure ' +
      'crouched over it.',
    weight: 1,
    acts: [3],
    choices: [
      {
        text: 'Shout the alarm and rouse the lane.',
        onResolve: {
          text:
            'The lane pours out with buckets and poles. The glow is a charcoal pot; the figure is a boy of ' +
            'twelve filling a sack from the rice dealer’s stock. It is enough. A boy at a storehouse wall ' +
            'at night with fire beside him is an arsonist until an office says otherwise, and six men take ' +
            'him to find one. The lane pays you double.',
          effects: { money: 60, resolve: -1 },
        },
      },
      {
        text: 'Go close and see what it is first.',
        check: { stat: 'me', dc: 7 },
        onSuccess: {
          text:
            'A boy of twelve at most, warming his hands over a charcoal pot while he fills a sack from the ' +
            'dealer’s stock. You put your foot on the embers and your hand on his collar, and then you let ' +
            'go of the collar. He is gone before you can change your mind. The lane pays you for a quiet ' +
            'night.',
          effects: { money: 30, resolve: 1, gi: 1 },
        },
        onFailure: {
          text:
            'He hears you and bolts, and his heel catches the pot. Embers skitter into the dry reed fence. ' +
            'You beat the flames out with your jacket and your bare hands before the lane wakes. In the ' +
            'morning the dealer finds the scorch marks, and asks why his watchman was so close to his wall.',
          effects: { health: -3, suspicion: 1 },
        },
      },
      {
        text: 'Rouse the lane, then stand over the boy until they hear him out.',
        check: { stat: 'tan', dc: 7, mods: [{ when: { flags: ['fujieda_intervened'] }, pct: 10 }] },
        onSuccess: {
          text:
            'The lane arrives with poles and finds a weeping boy with a sack of charcoal, and you standing ' +
            'over him saying so, loudly and more than once. The rice dealer takes his charcoal back and a ' +
            'promise from the boy’s father. Nobody sends for the office. The lane pays you, and a few of ' +
            'them bow.',
          effects: { money: 60, resolve: 1, reputation: 1, gi: 1 },
        },
        onFailure: {
          text:
            'They arrive angrier than you hoped, and a pole meant for the boy finds your head instead. By ' +
            'the time you can stand, six men have carried him off to the ward office, every one of them ' +
            'sure of what he saw: fire at a storehouse wall.',
          effects: { health: -4, resolve: -2 },
        },
      },
      {
        text: 'Walk the other way. It is not your storehouse.',
        onResolve: {
          text:
            'Nothing burns. In the morning the rice dealer is short a sack of charcoal, and you are paid for ' +
            'a quiet night. Whoever it was is warm somewhere.',
          effects: { money: 30, gi: -1 },
        },
      },
    ],
  },
  // codex: permits could be bought where the barriers were lax, and the system leaked
  // (01 §B3); every person was certified through a temple register (01 §B6); a sword
  // was a samurai's identity card and a commoner with one drew suspicion (01 §B2), so
  // a townsman's name means a townsman's life. New identity papers lower Suspicion
  // (02 §5). Adapts 03 §6 post-town "forged-paper broker (Suspicion-gated,
  // expensive)", gated at Suspicion 1+. 01 gives no 1651 penalty for forged permits,
  // so the text states none. Two swords implied; gender-neutral.
  {
    id: 'keian_paper_broker',
    type: 'story',
    title: 'A New Name at Shinagawa',
    body:
      'Shinagawa is the first station on the road west, near enough to Edo to share its patrols and far ' +
      'enough to keep its own back rooms. In one of them, behind a pawnshop, a thin man with ink under his ' +
      'nails sells tegata, travel permits, with the names already written in. A new name, he says, is the ' +
      'one thing a masterless samurai can buy this season that is worth its price: a townsman’s permit, and ' +
      'a temple certificate to match, since every soul in the realm is registered at some temple. A ' +
      'townsman’s name means a townsman’s life, of course. No swords. Four hundred mon. He lays one on the ' +
      'mat for you to look at, and keeps his hand near it.',
    weight: 1,
    acts: [3],
    requires: { min: { suspicion: 1 } },
    choices: [
      {
        text: 'Examine the seal, then pay.',
        requires: { min: { money: 400 } },
        displayWhenUnmet: 'locked_hint',
        lockedHint: 'needs 400 mon',
        check: { stat: 'chi', dc: 8 },
        onSuccess: {
          text:
            'The seal is cut, not drawn, and the temple is a real one in a province you can pronounce. You ' +
            'pay. On paper you are now a cooper’s cousin from somewhere quiet, and on paper no one is ' +
            'looking for you. You fold the permit inside your jacket, next to the name you were born with, ' +
            'and try not to think about which one you will need.',
          effects: { money: -400, suspicion: -2, resolve: -1 },
        },
        onFailure: {
          text:
            'The seal is good. The broker is better: he sells a copy of every name he writes to the ' +
            'constables’ informers in Edo. You learn this when a man in a plain jacket reads your new name ' +
            'back to you in the street and asks, pleasantly, what the old one was.',
          effects: { money: -400, suspicion: 2, resolve: -1 },
        },
      },
      {
        text: 'Palm a finished permit while he counts out his samples.',
        check: { stat: 'waza', dc: 8 },
        onSuccess: {
          text:
            'Your hand is quicker than his eyes, for once. The permit is thinner than the one he showed you ' +
            'and the seal less sure, but it has a name on it that is not yours, and it cost you nothing but ' +
            'a little more of yourself.',
          effects: { suspicion: -1, gi: -2 },
        },
        onFailure: {
          text:
            'He catches your wrist without looking up. The two men who come out of the pawnshop are not ' +
            'pawnbrokers. They leave you in the lane behind it with your purse lighter, and tell the ' +
            'station’s night watch that a masterless samurai tried to rob an honest shop.',
          effects: { health: -5, suspicion: 1, gi: -2 },
          moneyMult: 0.75,
        },
      },
      {
        text: 'Keep your own name.',
        onResolve: {
          text:
            'You leave the permit on the mat. Whatever comes for your name this season, it will find the ' +
            'one your father gave you, and you will be wearing it.',
          effects: { resolve: 1 },
        },
      },
    ],
  },
  // codex: the rōnin surplus ran to hundreds of thousands (01 §B1 scale note), and
  // rōnin controls tightened after the 1651 plot (01 §B6). He could be a conspirator or
  // only a masterless man with the wrong face; the text doesn't say. Adapts 03 §6 night
  // "the lantern-less bridge". Power 14, the floor of 11's Act 3 band (14-16), pending
  // sim calibration. He goes into the canal alive (03 §9.1 A3), and the win still
  // raises Suspicion: blood on a sleeve, a patrol drawn by the noise. Two swords
  // implied; gender-neutral.
  {
    id: 'keian_lanternless_bridge',
    type: 'combat',
    title: 'The Bridge With No Lantern',
    body:
      'The bridge over the canal has no lantern tonight. Someone has taken it, or someone wanted the bridge ' +
      'dark. Halfway across, a man gets up from where he was sitting against the rail: a rōnin, masterless ' +
      'as you are, in a jacket slept in for a week, with the look of someone who has been hunted through ' +
      'more lanes than he can count. He takes you for one of the hunters. You open your mouth to tell him ' +
      'otherwise, and he is already drawing. A man who has run this long does not wait to hear.',
    weight: 1,
    acts: [3],
    foe: { name: 'Hunted rōnin', power: 14 },
    onWin: {
      text:
        'You turn his cut and drive him back against the rail. He goes over it into the black water, and ' +
        'you hear him come up and swim, badly, for the far bank. He was running from the same thing you ' +
        'are. Lanterns are coming from the other end of the bridge, drawn by the noise. You are gone before ' +
        'they arrive, with his blood on your sleeve in a season when patrols look at sleeves.',
      effects: { suspicion: 1, resolve: -1 },
    },
    onLose: {
      text:
        'He cuts you twice and takes your purse, not out of greed but for a boat. You lie on the planks ' +
        'until the pain lets you stand. Somewhere downriver he is buying his way out of the city with your ' +
        'coin, and you cannot find it in you to wish him caught.',
      effects: { health: -9, resolve: -1 },
      moneyMult: 0.5,
    },
  },
];

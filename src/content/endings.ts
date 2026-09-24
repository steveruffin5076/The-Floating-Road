// Tale 1 endings as data (engine/endings.ts), wired per 11 §3. Forced endings
// fire the moment their condition holds, highest priority first. The rest are
// evaluated when the run ends (Act 3's last slot, or an escape that ends the
// run): the highest-priority match wins, `ronin_road_ends_here` is the
// fallback. `death` is the shared death ending, outside the Tale's 12 (02 §10).
//
// 03 §8: epilogues are past tense, "years later" framing; every epilogue
// remembers where you stood when the plot fell (03 §3), through the shared
// variant lines below. Executions are referenced, never depicted (03 §9).
import type { EndingSpec, Requirement } from '../engine/types';

// Where you stood in September 1651 (03 §3, spine 3), appended when it applies.
const WHERE_YOU_STOOD: { when: Requirement; text: string }[] = [
  {
    when: { flags: ['saw_the_heads'] },
    text:
      'You went to the execution ground that September and looked. You never spoke of it, and in ' +
      'later years, when people spoke of the plot as a story, you left the room.',
  },
  {
    when: { flags: ['refused_yui'], flagsNot: ['saw_the_heads'] },
    text: 'Once you sat in a scholar’s school in Kanda and said no. You were never sure it was wisdom, only that you lived.',
  },
];

export const ENDINGS: Record<string, EndingSpec> = {
  // ---------- forced ----------
  death: {
    forcedWhen: { max: { health: 0 } },
    priority: 100,
    title: 'You Fall',
    epilogue:
      'They leave you where you fall. No family comes; no domain claims the body. By evening someone ' +
      'with a cart and a temple’s permission takes you away, and the ground is swept, and the day goes on.',
    historicalNote:
      'No domain was obligated to claim a rōnin’s body. A masterless man who died with no one to send ' +
      'for was buried where he fell, or by whichever temple or village would take the trouble.',
  },
  ronin_sunpu_sept10: {
    forcedWhen: { flags: ['chose_seppuku'] },
    priority: 95,
    title: 'Sunpu, September 10th',
    epilogue:
      'You died at Sunpu on the tenth of September, in the same house as the teacher, before ' +
      'the magistrate’s men came through the door. It saved no one. Your name went onto the notice board ' +
      'in Edo with the others, and under it, as under every name there, the people who would die for ' +
      'being related to you. In the teahouses the plot became a story within a year, then a play within a ' +
      'century, and in the play there is no one who looks like you.',
    historicalNote:
      'Yui Shōsetsu, the strategist at the heart of the Keian plot, took his own life at Sunpu on the ' +
      '10th of September 1651 (Western calendar) as officials closed in. The families of the conspirators ' +
      'were executed. Afterward the shogunate relaxed its ban on deathbed adoption, a rule that had ' +
      'ended many houses and filled the country with masterless samurai.',
  },
  ronin_fever_betrayal: {
    forcedWhen: { flags: ['warned_marubashi_act3'] },
    priority: 95,
    title: 'The Fever Betrayal',
    epilogue:
      'You reached Marubashi’s gate as they brought him out, and they took you with him. No one ' +
      'betrayed you, in the end. A sick man talked in a fever, and you ran toward him instead of away. In ' +
      'Kodenmachō there was time to think about that. Marubashi went to the execution ground on the ' +
      'twenty-fourth of September, and you went with the others, and your household with you.',
    historicalNote:
      'The Keian plot was exposed in Edo when Marubashi Chūya, its military organizer, talked while ' +
      'feverish. He was crucified on the 24th of September 1651 (Western calendar). The families of the ' +
      'conspirators were executed with them.',
  },
  despair: {
    forcedWhen: { max: { resolve: 0 } },
    priority: 90,
    title: 'The Road Ends Here',
    epilogue:
      'You stopped walking, not from any wound, but because there was nothing left pulling you forward. ' +
      'You took work in the first village that would have you and never mentioned your father again.',
    historicalNote:
      'Not every rōnin sought a dramatic end. Many simply drifted into anonymous commoner life, farming, ' +
      'labor or temple work, abandoning samurai status entirely rather than starve maintaining it.',
  },
  // On the road (Act 1), Suspicion 5 is the arrest itself; in Edo it brings the
  // constable first (C12), and failing him sets taken_into_custody.
  ronin_kodenmacho: {
    forcedWhen: { anyOf: [{ flags: ['taken_into_custody'] }, { min: { suspicion: 5 }, acts: [1] }] },
    priority: 85,
    title: 'Kodenmachō',
    epilogue:
      'They took you before dawn, as they took everyone, and bound you with cord. Kodenmachō is a ' +
      'jailhouse where men wait in the dark to learn what the magistrate has decided. You waited a long ' +
      'time. What he decided is written in a register nobody reads.',
    epilogueVariants: [
      {
        when: { flags: ['keian_conspirator'] },
        text: 'You were not the only one taken that month. Your name was on the list with the others, and your household under it.',
      },
    ],
    historicalNote:
      'Edo’s city magistrates (machi-bugyō) and their dōshin constables worked through informants ' +
      '(okappiki), often ex-criminals themselves, and masterless samurai were among the people they ' +
      'watched most closely. Kodenmachō was the city’s main jailhouse. After the Keian plot, controls on ' +
      'rōnin in Edo tightened sharply.',
  },

  // ---------- evaluated ----------
  ronin_plow: {
    requires: { flags: ['oryo_chain_complete', 'sword_buried'], min: { resolve: 8, gi: 2 } },
    priority: 70,
    title: 'The Plow',
    epilogue:
      'The sword stayed in the ground. Years later you could not have said exactly where. You learned to ' +
      'carry trays without spilling, then to keep O-Ryō’s accounts, then to argue with her about them. ' +
      'Men with two swords still came through, hungry and proud, and you fed them and did not ask their ' +
      'houses. When your father’s name came to mind, it came more gently each year, until one spring you ' +
      'realized you had not thought of Katsuragi in a month.',
    epilogueVariants: [
      {
        when: { flags: ['plow_farm'] },
        text: 'The plot upriver was poor land. You made it less poor. The neighbors stopped laughing by the third harvest.',
      },
      ...WHERE_YOU_STOOD,
    ],
    historicalNote:
      'Many samurai left their status behind in the seventeenth century. Rōnin married into merchant and ' +
      'farming families, took up trades or teaching, and within a generation their descendants were ' +
      'simply townspeople or villagers.',
  },
  ronin_informant: {
    requires: { flags: ['informed_on_yui'], stats: { kuchi: 7, chi: 6 }, max: { gi: -1 } },
    priority: 65,
    title: 'Informant',
    epilogue:
      'You were paid, and the money was real. You bought a house with a tiled roof and a servant who did ' +
      'not like you. The men you named would have been taken anyway, and you told yourself so often, ' +
      'because it was true, and because it did not help. People in your ward were polite to you and did ' +
      'not come to your door. When you died, the temple entered your name in its register, and nothing ' +
      'else anywhere remembers it.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'The Keian plot was exposed chiefly through Marubashi Chūya’s own fevered talk. The shogunate’s ' +
      'officials also relied on informants of every kind, and a report like yours would have been one ' +
      'voice among many they were already hearing.',
  },
  ronin_lawful_vendetta: {
    requires: {
      anyOf: [{ stats: { chi: 8 } }, { stats: { kuchi: 8 } }],
      itemsAny: ['fathers_letter'],
      flags: ['adauchi_granted', 'katsuragi_killed_lawful'],
      max: { suspicion: 2 },
      min: { reputation: 1 },
    },
    priority: 60,
    title: 'The Lawful Vendetta',
    epilogue:
      'The review took a season. You waited in a rented room as the license required, and in spring the ' +
      'magistrate’s office closed the matter: lawful, witnessed and complete. Your father’s name was ' +
      'entered correctly at last, as a man killed for refusing a surrender, not a man who fell on the ' +
      'walls. It changed nothing you could touch. You kept the letter. Years later a young man came to ' +
      'ask how you had done it, and you told him how long it took, and he went away discouraged, which ' +
      'you thought was probably for the best.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'Adauchi, the licensed vendetta, was legal in Tokugawa Japan only with official authorization and ' +
      'registration, and only to avenge the killing of a parent or senior kin. The avenger had to report ' +
      'afterward and submit to review. Unlicensed killings were treated as murder.',
  },
  ronin_new_banner: {
    requires: {
      min: { reputation: 3 },
      max: { suspicion: 1 },
      countersMin: { employer_contracts: 2 },
      flags: ['refused_yui', 'vendetta_set_aside'],
    },
    priority: 50,
    title: 'A New Banner',
    epilogue:
      'The merchant you guarded spoke to a man, who spoke to a steward, who needed someone steady for a ' +
      'small house in the hills that had never had a rebel in it. You were taken on at a low stipend, and ' +
      'you wore someone else’s crest on your sleeve, and it fit better than you had feared. You never ' +
      'went back for Katsuragi. Your sons were born into service, and they were bored by your stories of ' +
      'the road, which you considered a success.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'Re-employment was the goal of most rōnin and was achieved by few. Domains hired sparingly, and ' +
      'recommendation by a trusted patron mattered more than skill. After 1651 the shogunate eased the ' +
      'rules that had dissolved so many houses and created so many masterless men.',
  },
  ronin_first_blood: {
    requires: { stats: { waza: 9 }, flags: ['hatashiai_won', 'escaped_sagawa'] },
    priority: 45,
    title: 'First Blood at Dawn',
    epilogue:
      'You beat Katsuragi in a field at dawn with seconds watching, and then you ran, because a private ' +
      'duel is a crime whatever the seconds say. You were good enough with the sword to live by it, and ' +
      'you did, on the roads north, under three different names. Sometimes a young man in a post-town ' +
      'would ask if you were the one from the field. You always said no, and you always paid for your own ' +
      'room and left before light.',
    epilogueVariants: [
      {
        when: { flags: ['katsuragi_spared_duel'] },
        text: 'You had stopped at first blood. You heard years later that he died in bed, and you were glad, and did not know why.',
      },
      ...WHERE_YOU_STOOD,
    ],
    historicalNote:
      'Private duels (hatashiai) persisted in Tokugawa Japan, but they were illegal. Only a licensed ' +
      'vendetta was lawful. A duelist who survived could expect to be hunted as a criminal.',
  },
  ronin_garden_gate: {
    requires: { flags: ['blackmail_katsuragi', 'katsuragi_ruined'], max: { gi: -3 } },
    priority: 42,
    title: 'The Garden Gate',
    epilogue:
      'Katsuragi lost his office and died poor in a rented room across the river. You heard of it in a ' +
      'wine shop and felt less than you had planned to. The money was gone by then, and the men he had ' +
      'hired were still looking for you, and the constables had your description from the fish market. ' +
      'You kept moving. It is possible to ruin a man and ruin yourself with the same letter, and you were ' +
      'the proof of it.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'Tokugawa officials held office at the shogunate’s pleasure. Evidence of past disloyalty, even from ' +
      'decades before, could end a career. So could the scandal of being blackmailed.',
  },
  ronin_kabukimono: {
    requires: { max: { gi: -4 }, countersMin: { gang_jobs: 2 }, flagsNot: ['gang_quit'] },
    priority: 40,
    title: 'Kabukimono',
    epilogue:
      'You went to the gangs, and the gangs kept you. For a few years you had a lane of your own, and ' +
      'men who wore their hair and their swords the way you did, and people crossed the street when you ' +
      'came. Then the city came down hard on the street gangs, as it always eventually did. You died in a ' +
      'fight over something none of you could remember afterward, those of you who were left.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'Kabukimono, flamboyant street gangs of masterless samurai and townsmen, troubled Edo through the ' +
      'early seventeenth century. The shogunate suppressed them repeatedly, with mass arrests and ' +
      'executions, until by the late 1600s they had largely disappeared.',
  },
  ronin_sword_for_sale: {
    requires: {
      countersMin: { combat_wins: 4 },
      min: { reputation: 2 },
      flags: ['refused_yui', 'vendetta_set_aside'],
      flagsNot: ['keian_conspirator', 'informed_on_yui'],
    },
    priority: 20,
    title: 'Sword for Sale',
    epilogue:
      'You refused the teacher and you let Katsuragi be, and you sold the only thing you had. It sold ' +
      'well. By your fifties you ran a fencing hall with forty students and a waiting list, and merchants’ ' +
      'sons paid to learn to hold a sword they would never draw. You were comfortable. You were ' +
      'respected. On some nights you sat in the empty hall after the lamps were out and could not have ' +
      'said what any of it was for.',
    epilogueVariants: WHERE_YOU_STOOD,
    historicalNote:
      'Swordsmanship schools multiplied in the long Tokugawa peace. Many were founded by rōnin, and ' +
      'fencing became a paid instruction for townsmen as well as samurai.',
  },
  ronin_road_ends_here: {
    fallback: true,
    title: 'The Road Ends Here',
    epilogue:
      'You outlived the summer of 1651, which was more than many did. What came after was not a story. ' +
      'You took work where it was offered, moved on when it was not, and let the name you were born with ' +
      'wear thin from lack of use.',
    epilogueVariants: [
      {
        when: { flags: ['fled_the_plot'] },
        text: 'You walked away from the plot and from your name, and the country roads kept you. No one ever came looking.',
      },
      ...WHERE_YOU_STOOD,
    ],
    historicalNote:
      'Not every rōnin sought a dramatic end. Many simply drifted into anonymous commoner life, farming, ' +
      'labor or temple work, abandoning samurai status entirely rather than starve maintaining it.',
  },
};

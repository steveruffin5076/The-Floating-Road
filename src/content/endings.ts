// GDD §10 endings as data (engine/endings.ts). The forced family fires the
// moment its condition holds, in priority order (death > despair > arrest).
// At the end of Act 1 the evaluated endings are checked: highest-priority
// match wins, `reached_edo` is the fallback. When Act 2 exists, the
// reached_edo family becomes the transition `t1_gates_of_edo` (11 §4.2).
import type { EndingSpec } from '../engine/types';

export const ENDINGS: Record<string, EndingSpec> = {
  death: {
    forcedWhen: { max: { health: 0 } },
    priority: 30,
    title: 'You Fall Beside the Road',
    epilogue:
      'They leave you where you fall, as the road always has for people with no one to send for them. No family comes; ' +
      'no domain claims the body. A woodcutter buries you off the verge by autumn, unnamed.',
    historicalNote:
      'No domain was obligated to claim a rōnin’s body. A traveler who died on the road with no one to ' +
      'claim him was buried where he fell, or by whichever temple or village would take the trouble.',
  },
  despair: {
    forcedWhen: { max: { resolve: 0 } },
    priority: 20,
    title: 'The Road Ends Here',
    epilogue:
      "You stop walking, not from any wound, but because there's nothing left pulling you forward. " +
      'You take work in the first village that will have you and never mention Kyoto again.',
    historicalNote:
      'Not every rōnin sought a dramatic end. Many simply drifted into anonymous commoner life — farming, ' +
      'labor, or temple work — abandoning samurai status entirely rather than starve maintaining it.',
  },
  arrested: {
    forcedWhen: { min: { suspicion: 5 } },
    priority: 10,
    title: 'Taken on the Road',
    epilogue:
      'Your face reaches the right office at last. They take you at an inn before dawn, bind you with ' +
      'cord, and send you east under escort, your case bound for Kodenmachō, Edo’s jailhouse, and ' +
      'whatever the magistrate decides.',
    historicalNote:
      'Edo’s city magistrates (machi-bugyō) and their dōshin constables worked through informants ' +
      '(okappiki), often ex-criminals themselves, and masterless samurai were among the people they ' +
      'watched most closely. Suspicion, in the game, stands in for exactly this kind of accumulating ' +
      'official attention.',
  },
  reached_edo: {
    fallback: true,
    title: 'The Gates of Edo',
    epilogue:
      'Nihonbashi bridge rises ahead of you at last — the zero marker of every road in the realm, and the ' +
      "edge of a city that swallows men like you by the thousand. Whatever you become next, it starts here.",
    historicalNote:
      "Nihonbashi ('Bridge of Japan') was the official starting point of all five shogunate highways and " +
      "Edo's commercial heart — a fitting line between a rōnin's road and whatever city life awaits him.",
  },
};

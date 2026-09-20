// GDD §10: epilogue text + historical note per ending. Four endings for the
// vertical slice (death/despair/arrested/completion) — the full Tale will
// have 4-6 major endings x variants; this covers the slice's death-family
// plus one "made it" ending standing in for the Act 2 transition.
export interface EndingContent {
  title: string;
  epilogue: string;
  historicalNote: string;
}

export const ENDINGS: Record<string, EndingContent> = {
  death: {
    title: 'You Fall Beside the Road',
    epilogue:
      'They leave you where you fall, as the road always has for men like you. No family comes; ' +
      'no domain claims the body. A woodcutter buries you off the verge by autumn, unnamed.',
    historicalNote:
      'Unclaimed dead along the Tōkaidō were common enough that way-stations kept modest burial grounds ' +
      'for travelers who died anonymously — rōnin especially, since no domain was obligated to claim them.',
  },
  despair: {
    title: 'The Road Ends Here',
    epilogue:
      "You stop walking, not from any wound, but because there's nothing left pulling you forward. " +
      'You take work in the first village that will have you and never mention Kyoto again.',
    historicalNote:
      'Not every rōnin sought a dramatic end. Many simply drifted into anonymous commoner life — farming, ' +
      'labor, or temple work — abandoning samurai status entirely rather than starve maintaining it.',
  },
  arrested: {
    title: 'Taken at the Barrier',
    epilogue:
      'A dōshin patrol finally has enough cause, and a name to put to your face. You are marched back ' +
      'toward Edo in restraints, your case bound for Kodenmachō and whatever the magistrate decides.',
    historicalNote:
      'The machi-bugyō and their dōshin kept watch-lists and informant networks (okappiki) specifically ' +
      'for masterless samurai suspected of banditry or unlicensed vendettas — Suspicion, in the game, ' +
      'stands in for exactly this kind of accumulating official attention.',
  },
  reached_edo: {
    title: 'The Gates of Edo',
    epilogue:
      'Nihonbashi bridge rises ahead of you at last — the zero marker of every road in the realm, and the ' +
      "edge of a city that swallows men like you by the thousand. Whatever you become next, it starts here.",
    historicalNote:
      "Nihonbashi ('Bridge of Japan') was the official starting point of all five shogunate highways and " +
      "Edo's commercial heart — a fitting line between a rōnin's road and whatever city life awaits him.",
  },
};

import { describe, expect, it } from 'vitest';
import { afterOutcome, makeContent } from './runner';
import { endingEpilogue } from './endings';
import { meetsRequirement } from './requirements';
import { mulberry32 } from './rng';
import { applyOutcomeEffects, createInitialState } from './state';
import type { ActSpec, EndingSpec, GameEvent, Outcome } from './types';
import { STARTING_STATS } from '../content/tale';

const story = (id: string, acts: number[] = [1]): GameEvent => ({
  id,
  type: 'story',
  title: id,
  body: id,
  weight: 1,
  acts,
  choices: [{ text: 'go', onResolve: { text: 'ok' } }],
});
const e = (extra: Partial<EndingSpec>): EndingSpec => ({ title: 't', epilogue: 'e', historicalNote: 'n', ...extra });

const events = [...Array.from({ length: 10 }, (_, i) => story(`r${i}`)), story('raid', [])];
const acts: ActSpec[] = [
  { act: 1, length: 10, levelInterval: 99, evaluateEndings: true, watches: [{ when: { min: { suspicion: 5 } }, spawn: 'raid' }] },
];
const endings = {
  good: e({ requires: { min: { reputation: 2 } }, priority: 5 }),
  fallback: e({ fallback: true }),
};

function setup() {
  const rng = mulberry32(3);
  const content = makeContent(events, acts, endings);
  const state = createInitialState({ ...STARTING_STATS }, events, rng);
  const step = (o: Outcome) => {
    applyOutcomeEffects(state, o);
    return afterOutcome(state, content, 'r0', o, rng);
  };
  return { state, step };
}

describe('Requirement.acts', () => {
  it('passes only in the listed acts', () => {
    const s = createInitialState({ ...STARTING_STATS }, [], mulberry32(1));
    expect(meetsRequirement(s, { acts: [1] })).toBe(true);
    s.act = 2;
    expect(meetsRequirement(s, { acts: [1] })).toBe(false);
    expect(meetsRequirement(s, { acts: [2, 3] })).toBe(true);
  });
});

describe('outcome evaluateEndings', () => {
  it('ends the run now with the best evaluated ending', () => {
    const { state, step } = setup();
    state.reputation = 2;
    expect(step({ text: 'x', evaluateEndings: true })).toEqual({ kind: 'ending', endingId: 'good' });
    expect(state.ended).toBe(true);
  });
});

describe('act watches', () => {
  it('spawn when the condition becomes true, not while it stays true', () => {
    const { step } = setup();
    const nextId = (o: Outcome) => {
      const n = step(o);
      return n.kind === 'event' ? n.event.id : n.kind;
    };
    expect(nextId({ text: 'x', effects: { suspicion: 4 } })).not.toBe('raid');
    expect(nextId({ text: 'x', effects: { suspicion: 1 } })).toBe('raid');
    expect(nextId({ text: 'x', effects: { suspicion: 1 } })).not.toBe('raid'); // clamped at 5, still held
    expect(nextId({ text: 'x', effects: { suspicion: -1 } })).not.toBe('raid');
    expect(nextId({ text: 'x', effects: { suspicion: 1 } })).toBe('raid'); // lapsed, then true again
  });
});

describe('endingEpilogue', () => {
  it('appends the variant lines whose condition holds', () => {
    const s = createInitialState({ ...STARTING_STATS }, [], mulberry32(1));
    const ending = e({ epilogue: 'Base.', epilogueVariants: [{ when: { flags: ['a'] }, text: 'A.' }, { when: { flags: ['b'] }, text: 'B.' }] });
    expect(endingEpilogue(s, ending)).toBe('Base.');
    s.flags.add('b');
    expect(endingEpilogue(s, ending)).toBe('Base. B.');
  });
});

import { describe, expect, it } from 'vitest';
import type { GameEvent, StoryEvent } from '../engine/types';
import { ACT1_EVENTS, INTRO_EVENT } from './events.act1';
import { ENDINGS } from './endings';
import { validateContent } from './validate';
import { TRAITS } from './tale';

const TRAIT_FLAGS = TRAITS.flatMap((t) => (t.flag ? [t.flag] : []));

const ALL_EVENTS: GameEvent[] = [INTRO_EVENT, ...ACT1_EVENTS];

const story = (overrides: Partial<StoryEvent> = {}): StoryEvent => ({
  id: 'test_event',
  type: 'story',
  title: 'A Test',
  body: 'Rain on the road.',
  weight: 1,
  choices: [
    { text: 'Walk on.', onResolve: { text: 'You walk on.' } },
    {
      text: 'Look closer.',
      check: { stat: 'me', dc: 4 },
      onSuccess: { text: 'You see it.' },
      onFailure: { text: 'You miss it.' },
    },
  ],
  ...overrides,
});

describe('built content', () => {
  it('passes every authoring rule', () => {
    expect(validateContent(ALL_EVENTS, ENDINGS, TRAIT_FLAGS)).toEqual([]);
  });

  it('keeps the pool at the vertical-slice size (02 §16: ~20-25 events)', () => {
    expect(ALL_EVENTS.length).toBeGreaterThanOrEqual(20);
    expect(ALL_EVENTS.length).toBeLessThanOrEqual(25);
  });
});

describe('validator catches', () => {
  const messages = (events: GameEvent[]) =>
    validateContent(events, ENDINGS).map((i) => i.message).join(' | ');

  it('duplicate ids', () => {
    expect(messages([story(), story()])).toContain('duplicate id');
  });

  it('unknown ending references', () => {
    const e = story({
      choices: [
        { text: 'Die.', onResolve: { text: 'You die.', endingId: 'no_such_ending' } },
        { text: 'Live.', onResolve: { text: 'You live.' } },
      ],
    });
    expect(messages([e])).toContain('unknown endingId');
  });

  it('bodies over the word cap', () => {
    expect(messages([story({ body: 'word '.repeat(181).trim() })])).toContain('over the 180-word cap');
  });

  it('exclamation points', () => {
    expect(messages([story({ body: 'Look out!' })])).toContain('exclamation point');
  });

  it('missing spaces where string literals were joined', () => {
    expect(messages([story({ body: 'The road ends.Then it rains.' })])).toContain('missing space');
  });

  it('DCs above the Act 1 range', () => {
    const e = story();
    e.choices[1].check = { stat: 'me', dc: 9 };
    expect(messages([e])).toContain('outside Act 1 range');
  });

  it('a checked choice with no failure outcome', () => {
    const e = story();
    delete e.choices[1].onFailure;
    expect(messages([e])).toContain('missing outcome');
  });

  it('a flag that is required but never set', () => {
    const e = story();
    e.choices[1].requires = { flags: ['knows_the_plan'] };
    expect(messages([e])).toContain('flag "knows_the_plan" is required but nothing sets it');
    e.choices[0].onResolve!.setFlags = ['knows_the_plan'];
    expect(messages([e])).not.toContain('knows_the_plan');
  });

  it('counters and items that nothing produces', () => {
    const e = story();
    e.choices[1].requires = { countersMin: { employer_contracts: 2 }, itemsAny: ['fathers_letter'] };
    expect(messages([e])).toContain('counter "employer_contracts"');
    expect(messages([e])).toContain('item "fathers_letter"');
  });

  it('an event whose every choice is gated (soft-lock)', () => {
    const e = story();
    e.choices.forEach((c) => (c.requires = { stats: { chi: 3 } }));
    expect(messages([e])).toContain('player could be stuck');
  });

  it('a locked_hint choice with no hint text', () => {
    const e = story();
    e.choices[1].requires = { stats: { chi: 4 } };
    e.choices[1].displayWhenUnmet = 'locked_hint';
    expect(messages([e])).toContain('no lockedHint');
  });

  it('a pool with too few ungated choices', () => {
    const gatedOnly = story({
      choices: [0, 1].map(() => ({
        text: 'Try.',
        check: { stat: 'tan' as const, dc: 4 },
        onSuccess: { text: 'It works.' },
        onFailure: { text: 'It fails.' },
      })),
    });
    expect(messages([gatedOnly])).toContain('ungated share');
  });
});

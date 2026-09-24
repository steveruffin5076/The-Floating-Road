import { describe, expect, it } from 'vitest';
import { enterNode, nextStep, recordResolved, runCompleteEnding } from './director';
import { ENDINGS } from '../content/endings';
import { mulberry32 } from './rng';
import { createInitialState } from './state';
import type { ActSpec, GameEvent, InjectSpec, Requirement } from './types';
import { STARTING_STATS, ACTS } from '../content/tale';
import { ACT1_EVENTS, INTRO_EVENT } from '../content/events.act1';

const story = (id: string, extra: { acts?: number[]; inject?: InjectSpec; requires?: Requirement } = {}): GameEvent => ({
  id,
  type: 'story',
  title: id,
  body: id,
  weight: 1,
  choices: [{ text: 'go', onResolve: { text: 'ok' } }],
  ...extra,
});

const randoms = (n: number, act = 1) => Array.from({ length: n }, (_, i) => story(`r${act}_${i}`, { acts: [act] }));

// Plays `n` steps: ask for the next step, then resolve it. Returns the ids
// (or `ending:<id>`) in order.
function play(events: GameEvent[], acts: ActSpec[], n: number, setup?: (s: ReturnType<typeof createInitialState>) => void) {
  const rng = mulberry32(99);
  const state = createInitialState({ ...STARTING_STATS }, events, rng);
  setup?.(state);
  const seen: string[] = [];
  for (let i = 0; i < n; i++) {
    const step = nextStep(state, events, acts, ENDINGS, rng);
    if (step.kind === 'ending') {
      seen.push(`ending:${step.endingId}`);
      break;
    }
    seen.push(step.id);
    recordResolved(state, step.id, events, rng);
  }
  return { seen, state };
}

const ONE_ACT: ActSpec[] = [{ act: 1, length: 6, levelInterval: 3, endingId: 'reached_edo' }];

describe('nextStep: random draws and act length', () => {
  it('draws from the act bag until the act length, then ends', () => {
    const { seen } = play(randoms(10), ONE_ACT, 20);
    expect(seen).toHaveLength(7);
    expect(seen.at(-1)).toBe('ending:reached_edo');
    expect(new Set(seen.slice(0, 6)).size).toBe(6); // no repeats
  });

  it('reports run completion once the act is over', () => {
    const { state } = play(randoms(10), ONE_ACT, 6);
    expect(runCompleteEnding(state, randoms(10), ONE_ACT, ENDINGS)).toBe('reached_edo');
  });
});

describe('nextStep: injections (11 §1.1)', () => {
  it('fires a chain event at its slot, never from the bag', () => {
    const events = [...randoms(10), story('chain', { inject: { act: 1, slot: 3 } })];
    const { seen } = play(events, ONE_ACT, 20);
    expect(seen[2]).toBe('chain');
    expect(seen.filter((x) => x === 'chain')).toHaveLength(1);
  });

  it('slides within its window while the gate is shut, then fires', () => {
    const events = [...randoms(10), story('gated', { inject: { act: 1, slot: 2, window: 2 }, requires: { flags: ['open'] } })];
    const rng = mulberry32(1);
    const state = createInitialState({ ...STARTING_STATS }, events, rng);
    const first = nextStep(state, events, ONE_ACT, ENDINGS, rng); // slot 1
    recordResolved(state, (first as { id: string }).id, events, rng);
    const second = nextStep(state, events, ONE_ACT, ENDINGS, rng); // slot 2, gate shut
    expect((second as { id: string }).id).not.toBe('gated');
    recordResolved(state, (second as { id: string }).id, events, rng);
    state.flags.add('open');
    expect(nextStep(state, events, ONE_ACT, ENDINGS, rng)).toEqual({ kind: 'event', id: 'gated' }); // slot 3, inside window
  });

  it('lapses when its window closes unfired, applying onLapse', () => {
    const events = [
      ...randoms(10),
      story('never', { inject: { act: 1, slot: 2, window: 1, onLapse: { setFlags: ['refused_yui'] } }, requires: { flags: ['open'] } }),
    ];
    const { seen, state } = play(events, ONE_ACT, 20);
    expect(seen).not.toContain('never');
    expect(state.flags.has('refused_yui')).toBe(true);
    expect(state.firedInjections.has('never')).toBe(true);
  });

  it('breaks slot collisions by priority; the loser slides inside its window', () => {
    const events = [
      ...randoms(10),
      story('low', { inject: { act: 1, slot: 2, window: 1, priority: 1 } }),
      story('high', { inject: { act: 1, slot: 2, window: 1, priority: 5 } }),
    ];
    const { seen } = play(events, ONE_ACT, 20);
    expect(seen[1]).toBe('high');
    expect(seen[2]).toBe('low');
  });

  it('holds the act open for a mandatory injection that missed its window', () => {
    const events = [
      ...randoms(10),
      story('late', { inject: { act: 1, slot: 2, mandatory: true }, requires: { flags: ['open'] } }),
    ];
    const rng = mulberry32(3);
    const state = createInitialState({ ...STARTING_STATS }, events, rng);
    for (let i = 0; i < 6; i++) {
      const step = nextStep(state, events, ONE_ACT, ENDINGS, rng) as { id: string };
      recordResolved(state, step.id, events, rng);
    }
    expect(runCompleteEnding(state, events, ONE_ACT, ENDINGS)).toBe('reached_edo'); // gate still shut: it will lapse
    state.flags.add('open');
    expect(runCompleteEnding(state, events, ONE_ACT, ENDINGS)).toBeNull();
    expect(nextStep(state, events, ONE_ACT, ENDINGS, rng)).toEqual({ kind: 'event', id: 'late' });
  });

  it('counts afterEvent slots from where that event resolved', () => {
    const events = [
      ...randoms(10),
      story('anchor', { inject: { act: 1, slot: 2 } }),
      story('follow', { inject: { act: 1, slot: 2, afterEvent: 'anchor' } }),
    ];
    const { seen } = play(events, ONE_ACT, 20);
    expect(seen.indexOf('follow') - seen.indexOf('anchor')).toBe(2);
  });

  it('fires spawned events first; a displaced injection slides within its window', () => {
    const events = [...randoms(10), story('chain', { inject: { act: 1, slot: 1, window: 1 } }), story('sweep', { acts: [] })];
    const { seen } = play(events, ONE_ACT, 3, (s) => s.pendingSpawns.push('sweep'));
    expect(seen.slice(0, 2)).toEqual(['sweep', 'chain']);
  });
});

describe('nextStep: act transitions', () => {
  const TWO_ACTS: ActSpec[] = [
    { act: 1, length: 3, levelInterval: 3, transitionEventId: 'gates' },
    { act: 2, length: 3, levelInterval: 4, endingId: 'reached_edo' },
  ];

  it('shows the transition event, then draws from the next act', () => {
    const events = [...randoms(5, 1), ...randoms(5, 2), story('gates', { acts: [] })];
    const { seen, state } = play(events, TWO_ACTS, 20);
    expect(seen[3]).toBe('gates');
    expect(seen.slice(0, 3).every((id) => id.startsWith('r1_'))).toBe(true);
    expect(seen.slice(4, 7).every((id) => id.startsWith('r2_'))).toBe(true);
    expect(seen.at(-1)).toBe('ending:reached_edo');
    expect(state.act).toBe(2);
  });
});

describe('the built slice through the director', () => {
  it('plays the intro plus 12 draws with no repeats, then reaches Edo', () => {
    const all = [INTRO_EVENT, ...ACT1_EVENTS];
    for (const seed of [1, 2, 3, 4, 5]) {
      const rng = mulberry32(seed);
      const state = createInitialState({ ...STARTING_STATS }, ACT1_EVENTS, rng);
      recordResolved(state, INTRO_EVENT.id, all, rng);
      const drawn: string[] = [];
      let step = nextStep(state, all, ACTS, ENDINGS, rng);
      while (step.kind === 'event') {
        drawn.push(step.id);
        recordResolved(state, step.id, all, rng);
        step = nextStep(state, all, ACTS, ENDINGS, rng);
      }
      expect(step).toEqual({ kind: 'ending', endingId: 'reached_edo' });
      expect(drawn).toHaveLength(12);
      expect(new Set(drawn).size).toBe(12);
      expect(drawn).not.toContain(INTRO_EVENT.id);
    }
  });
});

describe('enterNode (goto)', () => {
  it('continues the beat without using a slot, recording the parent at the node slot', () => {
    const events = [...randoms(10), story('parent', { acts: [] }), story('node', { acts: [] })];
    const rng = mulberry32(4);
    const state = createInitialState({ ...STARTING_STATS }, events, rng);
    state.actEvent = 3;
    enterNode(state, 'parent', 'node');
    expect(state.actEvent).toBe(3);
    recordResolved(state, 'node', events, rng);
    expect(state.actEvent).toBe(4);
    expect(state.actSlotOf).toMatchObject({ parent: 4, node: 4 });
  });
});

describe('evaluated act endings', () => {
  it('picks the highest-priority matching ending when the act ends, else the fallback', () => {
    const acts: ActSpec[] = [{ act: 1, length: 2, levelInterval: 3, evaluateEndings: true }];
    const endings = {
      plain: { title: 'a', epilogue: 'a', historicalNote: 'a', fallback: true },
      letter: { title: 'b', epilogue: 'b', historicalNote: 'b', requires: { itemsAny: ['fathers_letter'] }, priority: 10 },
    };
    const events = randoms(5);
    const run = (withLetter: boolean) => {
      const rng = mulberry32(6);
      const state = createInitialState({ ...STARTING_STATS }, events, rng);
      if (withLetter) state.items.add('fathers_letter');
      for (let i = 0; i < 2; i++) recordResolved(state, (nextStep(state, events, acts, endings, rng) as { id: string }).id, events, rng);
      return [runCompleteEnding(state, events, acts, endings), nextStep(state, events, acts, endings, rng)];
    };
    expect(run(false)).toEqual(['plain', { kind: 'ending', endingId: 'plain' }]);
    expect(run(true)).toEqual(['letter', { kind: 'ending', endingId: 'letter' }]);
  });
});

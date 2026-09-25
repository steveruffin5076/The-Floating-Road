import { describe, expect, it } from 'vitest';
import { buildWeightedBag, drawNext } from './eventDirector';
import { mulberry32 } from './rng';
import type { GameEvent } from './types';
import { ACT1_EVENTS } from '../content/events.act1';

const ev = (id: string, weight: number): GameEvent => ({
  id,
  type: 'story',
  title: id,
  body: id,
  weight,
  choices: [],
});

describe('buildWeightedBag (02 §8)', () => {
  it('holds each event once per point of weight', () => {
    const bag = buildWeightedBag([ev('a', 1), ev('b', 3)], mulberry32(5));
    expect(bag.filter((x) => x === 'a')).toHaveLength(1);
    expect(bag.filter((x) => x === 'b')).toHaveLength(3);
  });

  it('is deterministic for a seed', () => {
    expect(buildWeightedBag(ACT1_EVENTS, mulberry32(9))).toEqual(buildWeightedBag(ACT1_EVENTS, mulberry32(9)));
  });
});

describe('drawNext', () => {
  it('never repeats an event until every event has been drawn once', () => {
    const rng = mulberry32(11);
    const bagAll = buildWeightedBag(ACT1_EVENTS, rng);
    const drawn = new Set<string>();
    let bag = bagAll;
    for (let i = 0; i < ACT1_EVENTS.length; i++) {
      const next = drawNext(bag, bagAll, drawn, rng);
      expect(drawn.has(next.id)).toBe(false);
      drawn.add(next.id);
      bag = next.bagRemaining;
    }
    expect(drawn.size).toBe(ACT1_EVENTS.length);
  });

  it('prefers a fresh event over a repeat inside the same bag pass', () => {
    const next = drawNext(['a', 'b'], ['a', 'b'], new Set(['a']), mulberry32(1));
    expect(next.id).toBe('b');
    expect(next.bagRemaining).toEqual(['a']);
  });

  it('skips ineligible events (unmet requires), preferring fresh ones', () => {
    const next = drawNext(['a', 'b', 'c'], ['a', 'b', 'c'], new Set(), mulberry32(1), (id) => id === 'c');
    expect(next.id).toBe('c');
    expect(next.bagRemaining).toEqual(['a', 'b']);
  });

  it('allows an eligible repeat before an ineligible fresh event', () => {
    const next = drawNext(['a', 'b'], ['a', 'b'], new Set(['a']), mulberry32(1), (id) => id === 'a');
    expect(next.id).toBe('a');
  });

  it('never stalls: with nothing eligible it still returns an event', () => {
    expect(drawNext(['a'], ['a'], new Set(), mulberry32(1), () => false).id).toBe('a');
  });

  it('reshuffles the full bag once it runs out', () => {
    const next = drawNext(['a'], ['a', 'b', 'c'], new Set(), mulberry32(1));
    expect(next.id).toBe('a');
    expect([...next.bagRemaining].sort()).toEqual(['a', 'b', 'c']);
  });
});

import { describe, expect, it } from 'vitest';
import { playRun, policies, survived } from './harness';
import * as runner from '../engine/runner';
import { ALL_EVENTS, INTRO_EVENT } from '../content';
import { ENDINGS } from '../content/endings';
import { ACTS, STARTING_STATS, TALE_START_FLAGS } from '../content/tale';

const content = runner.makeContent(ALL_EVENTS, ACTS, ENDINGS);
const play = (policy: ReturnType<typeof policies>[number], seed: number) =>
  playRun(content, INTRO_EVENT, STARTING_STATS, TALE_START_FLAGS, policy, seed);

describe('sim harness over the real content', () => {
  for (const policy of policies(content)) {
    it(`${policy.name}: every run ends, with no repeated events`, () => {
      for (let seed = 1; seed <= 300; seed++) {
        const r = play(policy, seed);
        expect(Object.keys(ENDINGS)).toContain(r.ending);
        expect(r.repeats).toBe(0);
      }
    });
  }

  it('is deterministic per seed', () => {
    const [random] = policies(content);
    expect(play(random, 42)).toEqual(play(random, 42));
  });

  // Guard rails from game-plan/12-act1-balance-report.md, loose enough to
  // survive small content edits; a tuning change that breaks them should be
  // deliberate and re-measured with `npm run sim`.
  it('keeps a full run survivable for a careful player and hard for a random one', () => {
    const [random, , careful] = policies(content);
    const survive = (p: typeof random) => {
      let ok = 0;
      for (let seed = 1; seed <= 400; seed++) if (survived(play(p, seed), ENDINGS)) ok++;
      return ok / 400;
    };
    expect(survive(careful)).toBeGreaterThan(0.9);
    expect(survive(random)).toBeLessThan(0.9);
  });
});

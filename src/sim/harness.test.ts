import { describe, expect, it } from 'vitest';
import { playRun, policies } from './harness';
import * as runner from '../engine/runner';
import { ACT1_EVENTS, INTRO_EVENT } from '../content/events.act1';
import { TALE1_ACT1_CHAIN } from '../content/chain.tale1.act1';
import { ENDINGS } from '../content/endings';
import { ACTS, STARTING_STATS, TALE_START_FLAGS } from '../content/tale';

const content = runner.makeContent([INTRO_EVENT, ...ACT1_EVENTS, ...TALE1_ACT1_CHAIN], ACTS, ENDINGS);
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
  it('keeps Act 1 survivable for a careful player and not trivial for a random one', () => {
    const [random, , careful] = policies(content);
    const survive = (p: typeof random) => {
      let ok = 0;
      for (let seed = 1; seed <= 400; seed++) if (play(p, seed).ending.startsWith('reached_edo')) ok++;
      return ok / 400;
    };
    expect(survive(careful)).toBeGreaterThan(0.9);
    expect(survive(random)).toBeLessThan(0.9);
  });
});

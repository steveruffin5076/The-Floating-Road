// GDD §6: skill check formula, auto-success rule, scaling bad-luck protection.
// Same math as sim/balance-sim.mjs (validated in game-plan/06-balance-sim-report.md) —
// kept in sync deliberately; if this formula changes, re-run the sim.
import type { Rng } from './rng';

export interface CheckOutcome {
  passed: boolean;
  autoSuccess: boolean;
  successPct: number; // 0-100, what would be shown to the player (or N/A if autoSuccess)
  pityBonus: number;
}

export function previewCheck(
  stat: number,
  dc: number,
  consecutiveFails: number
): { autoSuccess: boolean; successPct: number } {
  const margin = stat - dc;
  if (dc <= 4 && margin >= 6) {
    return { autoSuccess: true, successPct: 100 };
  }
  const pityBonus = Math.min(25, Math.max(0, (consecutiveFails - 1) * 5));
  const successPct = Math.min(95, Math.max(5, 50 + margin * 8 + pityBonus));
  return { autoSuccess: false, successPct };
}

export function resolveCheck(
  rng: Rng,
  stat: number,
  dc: number,
  consecutiveFails: number
): CheckOutcome {
  const preview = previewCheck(stat, dc, consecutiveFails);
  if (preview.autoSuccess) {
    return { passed: true, autoSuccess: true, successPct: 100, pityBonus: 0 };
  }
  const pityBonus = Math.min(25, Math.max(0, (consecutiveFails - 1) * 5));
  const passed = rng() * 100 < preview.successPct;
  return { passed, autoSuccess: false, successPct: preview.successPct, pityBonus };
}

// §6 partial-success floor: at net margin <= -6 (near the 5% floor), a failed
// non-combat check may only roll "lesser outcome" or full failure - callers
// that define a harsher third tier should gate it behind this check.
export function isNearFloor(stat: number, dc: number): boolean {
  return stat - dc <= -6;
}

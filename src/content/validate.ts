// Content validator (04 §5). TypeScript already enforces shape; this checks the
// authoring rules the type system can't: 03 §9 style caps, 02 §6 DC range,
// 02 §17 ungated share, and cross-references between events and endings.
import type { GameEvent, Outcome, Requirement, StoryEvent } from '../engine/types';
import type { EndingContent } from './endings';

export interface ContentIssue {
  where: string;
  message: string;
}

export const RULES = {
  bodyMaxWords: 180, // 03 §9
  outcomeMaxWords: 120, // 03 §9
  epilogueMaxWords: 250, // 03 §9
  act1MaxDc: 6, // 02 §6: "Act 1 rarely exceeds DC 6"
  minDc: 2,
  minChoices: 2,
  maxChoices: 4,
  minUngatedShare: 0.3, // 02 §17 targets ~40% ungated; 30% is the floor
};

const ID_RE = /^[a-z][a-z0-9_]*$/;
// A letter, sentence punctuation, then a letter: the usual trace of a missing
// space where two concatenated string literals meet.
const JOIN_RE = /[a-z][.,;:?][A-Za-z]/;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function checkProse(where: string, text: string, maxWords: number, issues: ContentIssue[]): void {
  if (!text.trim()) issues.push({ where, message: 'empty text' });
  const n = words(text);
  if (n > maxWords) issues.push({ where, message: `${n} words, over the ${maxWords}-word cap` });
  if (text.includes('!')) issues.push({ where, message: 'exclamation point in narration (03 §9)' });
  if (/ {2}/.test(text)) issues.push({ where, message: 'double space' });
  if (text !== text.trim()) issues.push({ where, message: 'leading or trailing whitespace' });
  const join = text.match(JOIN_RE);
  if (join) issues.push({ where, message: `missing space after punctuation near "${join[0]}"` });
}

function checkOutcome(
  where: string,
  outcome: Outcome | undefined,
  endings: Record<string, EndingContent>,
  issues: ContentIssue[]
): void {
  if (!outcome) {
    issues.push({ where, message: 'missing outcome' });
    return;
  }
  checkProse(where, outcome.text, RULES.outcomeMaxWords, issues);
  if (outcome.endingId && !endings[outcome.endingId]) {
    issues.push({ where, message: `unknown endingId "${outcome.endingId}"` });
  }
}

// What content reads and writes, so the validator can flag a gate nothing opens.
interface Ledger {
  flagsRead: Map<string, string>;
  flagsSet: Set<string>;
  countersRead: Map<string, string>;
  countersSet: Set<string>;
  itemsRead: Map<string, string>;
  itemsSet: Set<string>;
}

function readRequirement(where: string, req: Requirement | undefined, ledger: Ledger): void {
  if (!req) return;
  for (const f of [...(req.flags ?? []), ...(req.flagsNot ?? [])]) ledger.flagsRead.set(f, where);
  for (const c of [...Object.keys(req.countersMin ?? {}), ...Object.keys(req.countersMax ?? {})]) {
    ledger.countersRead.set(c, where);
  }
  for (const i of req.itemsAny ?? []) ledger.itemsRead.set(i, where);
  for (const sub of req.anyOf ?? []) readRequirement(where, sub, ledger);
}

function recordOutcome(outcome: Outcome | undefined, ledger: Ledger): void {
  if (!outcome) return;
  for (const f of outcome.setFlags ?? []) ledger.flagsSet.add(f);
  for (const c of Object.keys(outcome.counters ?? {})) ledger.countersSet.add(c);
  for (const i of outcome.addItems ?? []) ledger.itemsSet.add(i);
}

function checkStory(e: StoryEvent, endings: Record<string, EndingContent>, issues: ContentIssue[]): void {
  const n = e.choices.length;
  if (e.choices.every((c) => c.requires)) {
    issues.push({ where: e.id, message: 'every choice has a requirement; the player could be stuck' });
  }
  if (n < RULES.minChoices || n > RULES.maxChoices) {
    issues.push({ where: e.id, message: `${n} choices; expected ${RULES.minChoices}-${RULES.maxChoices}` });
  }
  e.choices.forEach((c, i) => {
    const where = `${e.id}.choice[${i}]`;
    if (!c.text.trim()) issues.push({ where, message: 'empty choice text' });
    if (c.displayWhenUnmet === 'locked_hint' && !c.lockedHint?.trim()) {
      issues.push({ where, message: 'locked_hint choice has no lockedHint text' });
    }
    if (c.displayWhenUnmet && !c.requires) issues.push({ where, message: 'displayWhenUnmet without requires' });
    if (c.check) {
      if (c.onResolve) issues.push({ where, message: 'has both a check and onResolve' });
      if (c.check.dc < RULES.minDc || c.check.dc > RULES.act1MaxDc) {
        issues.push({ where, message: `DC ${c.check.dc} outside Act 1 range ${RULES.minDc}-${RULES.act1MaxDc}` });
      }
      checkOutcome(`${where}.onSuccess`, c.onSuccess, endings, issues);
      checkOutcome(`${where}.onFailure`, c.onFailure, endings, issues);
    } else {
      if (c.onSuccess || c.onFailure) issues.push({ where, message: 'onSuccess/onFailure without a check' });
      checkOutcome(`${where}.onResolve`, c.onResolve, endings, issues);
    }
  });
}

// `startingFlags` are flags set outside content, e.g. by traits at run start.
export function validateContent(
  events: GameEvent[],
  endings: Record<string, EndingContent>,
  startingFlags: string[] = []
): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const ledger: Ledger = {
    flagsRead: new Map(),
    flagsSet: new Set(startingFlags),
    countersRead: new Map(),
    countersSet: new Set(),
    itemsRead: new Map(),
    itemsSet: new Set(),
  };
  const seen = new Set<string>();
  let gated = 0;
  let ungated = 0;

  for (const e of events) {
    if (!ID_RE.test(e.id)) issues.push({ where: e.id, message: 'id is not snake_case' });
    if (seen.has(e.id)) issues.push({ where: e.id, message: 'duplicate id' });
    seen.add(e.id);
    if (!Number.isInteger(e.weight) || e.weight < 1) {
      issues.push({ where: e.id, message: `weight ${e.weight} must be a positive integer` });
    }
    if (!e.title.trim()) issues.push({ where: e.id, message: 'empty title' });
    checkProse(`${e.id}.body`, e.body, RULES.bodyMaxWords, issues);

    readRequirement(e.id, e.requires, ledger);
    if (e.type === 'story') {
      checkStory(e, endings, issues);
      for (const c of e.choices) {
        c.check ? gated++ : ungated++;
        readRequirement(`${e.id}.choice`, c.requires, ledger);
        for (const o of [c.onSuccess, c.onFailure, c.onResolve]) recordOutcome(o, ledger);
      }
    } else {
      recordOutcome(e.onWin, ledger);
      recordOutcome(e.onLose, ledger);
      if (!(e.foe.power > 0)) issues.push({ where: e.id, message: 'foe power must be positive' });
      if (!e.foe.name.trim()) issues.push({ where: e.id, message: 'empty foe name' });
      checkOutcome(`${e.id}.onWin`, e.onWin, endings, issues);
      checkOutcome(`${e.id}.onLose`, e.onLose, endings, issues);
    }
  }

  const unset = (read: Map<string, string>, set: Set<string>, kind: string) => {
    for (const [name, where] of read) {
      if (!set.has(name)) issues.push({ where, message: `${kind} "${name}" is required but nothing sets it` });
    }
  };
  unset(ledger.flagsRead, ledger.flagsSet, 'flag');
  unset(ledger.countersRead, ledger.countersSet, 'counter');
  unset(ledger.itemsRead, ledger.itemsSet, 'item');

  const total = gated + ungated;
  if (total > 0 && ungated / total < RULES.minUngatedShare) {
    issues.push({
      where: 'pool',
      message: `ungated share ${(100 * ungated / total).toFixed(0)}% is below ${RULES.minUngatedShare * 100}% (02 §17)`,
    });
  }

  for (const [id, ending] of Object.entries(endings)) {
    if (!ID_RE.test(id)) issues.push({ where: `ending ${id}`, message: 'id is not snake_case' });
    if (!ending.title.trim()) issues.push({ where: `ending ${id}`, message: 'empty title' });
    checkProse(`ending ${id}.epilogue`, ending.epilogue, RULES.epilogueMaxWords, issues);
    checkProse(`ending ${id}.historicalNote`, ending.historicalNote, RULES.epilogueMaxWords, issues);
  }

  return issues;
}

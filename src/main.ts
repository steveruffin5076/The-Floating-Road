import { mulberry32, makeSeed, type Rng } from './engine/rng';
import type { RunState, StatKey, GameEvent, StoryEvent, CombatEvent, Choice, Outcome } from './engine/types';
import { STAT_LABELS } from './engine/types';
import { previewCheck, resolveCheck } from './engine/checkResolver';
import { setupCombat, applyChoHan, resolveCombat, type ChoHanCall, type Stance, type CombatSetup } from './engine/combatResolver';
import { checkModPct, meetsRequirement } from './engine/requirements';
import { createInitialState, applyOutcomeEffects, grantLevelUp, noteCombatWin, withTraitRiders, REST_INTERVAL } from './engine/state';
import { actSpec, enterNode, nextStep, recordResolved, runCompleteEnding } from './engine/director';
import { forcedEnding } from './engine/endings';
import { ACTS, STARTING_STATS, TALE_START_FLAGS, TRAITS, TALE_NAME } from './content/tale';
import { INTRO_EVENT, ACT1_EVENTS } from './content/events.act1';
import { ENDINGS } from './content/endings';
import { saveGame, loadGame, hasSavedGame, clearSavedGame, type SavedScreen } from './engine/save';

const ALL_EVENTS: GameEvent[] = [INTRO_EVENT, ...ACT1_EVENTS];
const EVENTS_BY_ID = new Map(ALL_EVENTS.map((e) => [e.id, e]));

type CombatResult = 'won' | 'lost' | 'escaped';

type Screen =
  | { kind: 'title' }
  | { kind: 'creation'; selectedTrait: string | null }
  | { kind: 'event'; event: StoryEvent }
  | { kind: 'combat'; event: CombatEvent; step: 'chohan' | 'stance' | 'resolved'; setup: CombatSetup; winPct: number; betResult: { correct: boolean | null; d1: number | null; d2: number | null } | null; outcomeText?: string; result?: CombatResult }
  | { kind: 'levelup' }
  | { kind: 'rest' }
  | { kind: 'ending'; endingId: string };

let rng: Rng = mulberry32(makeSeed());
let state: RunState | null = null;
let screen: Screen = { kind: 'title' };

const app = document.getElementById('app')!;

function render(): void {
  if (state) {
    const saved = toSavedScreen(screen);
    if (saved) saveGame(state, rng, saved);
  }
  app.innerHTML = '';
  switch (screen.kind) {
    case 'title': return renderTitle();
    case 'creation': return renderCreation();
    case 'event': return renderEvent(screen.event);
    case 'combat': return renderCombat();
    case 'levelup': return renderLevelUp();
    case 'rest': return renderRest();
    case 'ending': return renderEnding(screen.endingId);
  }
}

// ---------- save/resume ----------
function toSavedScreen(s: Screen): SavedScreen | null {
  switch (s.kind) {
    case 'event':
      return { kind: 'event', eventId: s.event.id };
    case 'combat':
      return {
        kind: 'combat',
        eventId: s.event.id,
        step: s.step,
        setup: s.setup,
        winPct: s.winPct,
        betResult: s.betResult,
        outcomeText: s.outcomeText,
        result: s.result,
      };
    case 'levelup':
      return { kind: 'levelup' };
    case 'rest':
      return { kind: 'rest' };
    case 'ending':
      return { kind: 'ending', endingId: s.endingId };
    default:
      return null;
  }
}

// Throws if the save references content that no longer exists (e.g. an
// event id from a build before a content change), so the caller can fall
// back to a fresh title screen instead of crashing on a stale save.
function fromSavedScreen(s: SavedScreen): Screen {
  switch (s.kind) {
    case 'event': {
      const event = EVENTS_BY_ID.get(s.eventId);
      if (!event || event.type !== 'story') throw new Error('missing event');
      return { kind: 'event', event };
    }
    case 'combat': {
      const event = EVENTS_BY_ID.get(s.eventId);
      if (!event || event.type !== 'combat') throw new Error('missing event');
      return { kind: 'combat', event, step: s.step, setup: s.setup, winPct: s.winPct, betResult: s.betResult, outcomeText: s.outcomeText, result: s.result };
    }
    case 'levelup':
      return { kind: 'levelup' };
    case 'rest':
      return { kind: 'rest' };
    case 'ending':
      return { kind: 'ending', endingId: s.endingId };
  }
}

// ---------- title ----------
function renderTitle(): void {
  const div = document.createElement('div');
  div.className = 'title-screen';
  div.innerHTML = `
    <h1>浮 THE FLOATING ROAD</h1>
    <p>A vertical slice — Act 1, "${TALE_NAME}"</p>
  `;
  if (hasSavedGame()) {
    const continueBtn = mkPrimaryButton('Continue Your Journey', () => {
      const loaded = loadGame();
      if (!loaded) return render();
      try {
        screen = fromSavedScreen(loaded.screen);
        state = loaded.state;
        rng = loaded.rng;
      } catch {
        clearSavedGame();
      }
      render();
    });
    div.appendChild(continueBtn);
  }
  const btn = mkPrimaryButton('Begin Your Journey', () => {
    screen = { kind: 'creation', selectedTrait: null };
    render();
  });
  div.appendChild(btn);
  app.appendChild(div);
}

// ---------- character creation ----------
function renderCreation(): void {
  if (screen.kind !== 'creation') return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>Choose a Trait</h2><p class="body-text">One small permanent mark on who you were before the road. (GDD §4.2)</p>`;
  const list = document.createElement('div');
  for (const trait of TRAITS) {
    const el = document.createElement('div');
    el.className = 'trait-option' + (screen.selectedTrait === trait.id ? ' selected' : '');
    el.innerHTML = `<strong>${trait.name}</strong><span class="desc">${trait.description}</span>`;
    el.addEventListener('click', () => {
      screen = { kind: 'creation', selectedTrait: trait.id };
      render();
    });
    list.appendChild(el);
  }
  card.appendChild(list);
  const btn = mkPrimaryButton('Set Out', () => {
    if (screen.kind !== 'creation' || !screen.selectedTrait) return;
    startRun(screen.selectedTrait);
  });
  btn.style.marginTop = '12px';
  if (!screen.selectedTrait) btn.disabled = true;
  card.appendChild(btn);
  app.appendChild(card);
}

function startRun(traitId: string | null): void {
  rng = mulberry32(makeSeed());
  const stats = { ...STARTING_STATS };
  const trait = TRAITS.find((t) => t.id === traitId);
  if (trait?.statBonus) {
    stats[trait.statBonus.stat] = Math.min(15, stats[trait.statBonus.stat] + trait.statBonus.amount);
  }
  state = createInitialState(stats, ACT1_EVENTS, rng);
  if (trait?.flag) state.flags.add(trait.flag);
  for (const f of TALE_START_FLAGS) state.flags.add(f);
  state.drawnOnce.add(INTRO_EVENT.id);
  screen = { kind: 'event', event: INTRO_EVENT };
  render();
}

// ---------- shared vitals bar ----------
function renderVitals(container: HTMLElement): void {
  if (!state) return;
  const s = state;
  const bar = document.createElement('div');
  bar.className = 'vitals';
  bar.innerHTML = `
    <span>体 Health: <strong>${s.health}/${s.healthMax}</strong></span>
    <span>心 Resolve: <strong>${s.resolve}/${s.resolveMax}</strong></span>
    <span>銭 Money: <strong>${s.money} mon</strong></span>
    <span>怪 Suspicion: <strong>${'▮'.repeat(s.suspicion)}${'▯'.repeat(5 - s.suspicion)}</strong></span>
    <span>義/悪 Gi-Aku: <strong>${s.gi >= 0 ? '+' : ''}${s.gi}</strong></span>
  `;
  container.appendChild(bar);
}

// ---------- event screen ----------
function renderEvent(event: StoryEvent): void {
  if (!state) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>${event.title}</h2>`;
  renderVitals(card);
  const body = document.createElement('p');
  body.className = 'body-text';
  body.textContent = event.body;
  card.appendChild(body);

  const lastLog = state.log[state.log.length - 1];
  if (lastLog) {
    const log = document.createElement('p');
    log.className = 'log-line';
    log.textContent = lastLog;
    card.appendChild(log);
  }

  const choicesEl = document.createElement('div');
  choicesEl.className = 'choices';
  for (const choice of event.choices) {
    const unlocked = meetsRequirement(state, choice.requires);
    if (!unlocked && choice.displayWhenUnmet !== 'locked_hint') continue;
    const btn = document.createElement('button');
    btn.className = 'choice';
    if (!unlocked) {
      btn.disabled = true;
      btn.classList.add('locked');
      btn.innerHTML = `${choice.text} <span class="odds">[${choice.lockedHint ?? 'locked'}]</span>`;
      choicesEl.appendChild(btn);
      continue;
    }
    let label = choice.text;
    if (choice.check) {
      const statVal = state.stats[choice.check.stat];
      const preview = previewCheck(statVal, choice.check.dc, state.consecutiveFails, checkModPct(state, choice.check));
      const oddsLabel = preview.autoSuccess ? 'certain' : `${Math.round(preview.successPct)}%`;
      label = `${choice.text} <span class="odds">[${STAT_LABELS[choice.check.stat].split(' ')[0]}] ${oddsLabel}</span>`;
    }
    btn.innerHTML = label;
    btn.addEventListener('click', () => resolveChoice(choice));
    choicesEl.appendChild(btn);
  }
  card.appendChild(choicesEl);
  app.appendChild(card);
}

function resolveChoice(choice: Choice): void {
  if (!state) return;
  if (choice.check) {
    const statVal = state.stats[choice.check.stat];
    const outcome = resolveCheck(rng, statVal, choice.check.dc, state.consecutiveFails, checkModPct(state, choice.check));
    state.consecutiveFails = outcome.passed ? 0 : state.consecutiveFails + 1;
    const raw = outcome.passed ? choice.onSuccess : choice.onFailure;
    const result = raw && withTraitRiders(state, choice.check, outcome.passed, raw);
    if (result) applyOutcomeEffects(state, result);
    afterOutcome(result);
  } else if (choice.onResolve) {
    applyOutcomeEffects(state, choice.onResolve);
    afterOutcome(choice.onResolve);
  }
}

// Effects have already been applied; this decides what the player sees next.
function afterOutcome(outcome?: Outcome): void {
  if (!state) return;
  const current = screen.kind === 'event' || screen.kind === 'combat' ? screen.event.id : null;
  const forced = outcome?.endingId ?? forcedEnding(state, ENDINGS);
  if (forced) return showEnding(forced);

  if (outcome?.goto && current) {
    enterNode(state, current, outcome.goto);
    return showEvent(EVENTS_BY_ID.get(outcome.goto)!);
  }

  if (current) recordResolved(state, current, ALL_EVENTS, rng);
  state.eventsSinceLevel += 1;
  state.eventsSinceRest += 1;

  const endingId = runCompleteEnding(state, ALL_EVENTS, ACTS, ENDINGS);
  if (endingId) return showEnding(endingId);

  if (state.eventsSinceLevel >= actSpec(ACTS, state.act).levelInterval) {
    state.eventsSinceLevel = 0;
    screen = { kind: 'levelup' };
    return render();
  }

  if (state.eventsSinceRest >= REST_INTERVAL) {
    state.eventsSinceRest = 0;
    screen = { kind: 'rest' };
    return render();
  }

  drawAndShowNext();
}

function showEnding(endingId: string): void {
  if (!state) return;
  state.ended = true;
  state.endingId = endingId;
  screen = { kind: 'ending', endingId };
  render();
}

function drawAndShowNext(): void {
  if (!state) return;
  const step = nextStep(state, ALL_EVENTS, ACTS, ENDINGS, rng);
  if (step.kind === 'ending') return showEnding(step.endingId);
  showEvent(EVENTS_BY_ID.get(step.id)!);
}

function showEvent(event: GameEvent): void {
  if (event.type === 'combat') {
    beginCombat(event as CombatEvent);
  } else {
    screen = { kind: 'event', event: event as StoryEvent };
    render();
  }
}

// ---------- level up ----------
function renderLevelUp(): void {
  if (!state) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>A Season on the Road Changes You</h2><p class="body-text">Choose where your training goes. (+2, GDD §4.3)</p>`;
  renderVitals(card);
  const grid = document.createElement('div');
  grid.className = 'stat-grid';
  (Object.keys(STAT_LABELS) as StatKey[]).forEach((stat) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = `${STAT_LABELS[stat]} — currently ${state!.stats[stat]}`;
    btn.addEventListener('click', () => {
      grantLevelUp(state!, stat);
      if (state!.eventsSinceRest >= REST_INTERVAL) {
        state!.eventsSinceRest = 0;
        screen = { kind: 'rest' };
        return render();
      }
      drawAndShowNext();
    });
    grid.appendChild(btn);
  });
  card.appendChild(grid);
  app.appendChild(card);
}

// ---------- rest node ----------
function renderRest(): void {
  if (!state) return;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>A Place to Stop</h2><p class="body-text">Every rest node guarantees a free option, per the design review — a broke or stranded traveler is never trapped bleeding Resolve.</p>`;
  renderVitals(card);
  const choicesEl = document.createElement('div');
  choicesEl.className = 'choices';

  const freeBtn = document.createElement('button');
  freeBtn.className = 'choice';
  freeBtn.textContent = 'Shelter for the night, free (sleep rough under the eaves)';
  freeBtn.addEventListener('click', () => {
    applyOutcomeEffects(state!, { text: 'You sleep poorly but wake alive and dry enough.', effects: { health: 1, resolve: 1 } });
    drawAndShowNext();
  });
  choicesEl.appendChild(freeBtn);

  const innBtn = document.createElement('button');
  innBtn.className = 'choice';
  const canAfford = state.money >= 150;
  innBtn.textContent = `Pay for a room at the hatago (a post-town inn) — 150 mon${canAfford ? '' : ' (not enough money)'}`;
  if (!canAfford) innBtn.setAttribute('disabled', 'true');
  innBtn.addEventListener('click', () => {
    if (state!.money < 150) return;
    applyOutcomeEffects(state!, { text: 'A hot meal, a real futon, and a locked door. You sleep well.', effects: { money: -150, health: 4, resolve: 3 } });
    drawAndShowNext();
  });
  choicesEl.appendChild(innBtn);

  card.appendChild(choicesEl);
  app.appendChild(card);
}

// ---------- combat ----------
function beginCombat(event: CombatEvent): void {
  if (!state) return;
  const setup = setupCombat(state, event.foe.power, rng, event.winPctMod ?? 0);
  screen = { kind: 'combat', event, step: 'chohan', setup, winPct: setup.baseWinPct, betResult: null };
  render();
}

function renderCombat(): void {
  if (screen.kind !== 'combat' || !state) return;
  const { event, step, setup, winPct, betResult, outcomeText } = screen;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `<h2>${event.title}</h2>`;
  renderVitals(card);
  const body = document.createElement('p');
  body.className = 'body-text';
  body.textContent = event.body;
  card.appendChild(body);

  const powerLine = document.createElement('p');
  powerLine.innerHTML = `<strong>You:</strong> Power ${setup.youPower} &nbsp; <strong>${event.foe.name}:</strong> Power ${setup.foePower} &nbsp; <strong>Win chance:</strong> ${Math.round(winPct)}%`;
  card.appendChild(powerLine);

  if (betResult) {
    const betLine = document.createElement('p');
    betLine.className = 'log-line';
    if (betResult.d1 === null || betResult.d2 === null) {
      betLine.textContent = 'You skipped the chō-han bet.';
    } else {
      const sum = betResult.d1 + betResult.d2;
      betLine.textContent = `Chō-han: ${betResult.d1} + ${betResult.d2} = ${sum} (${sum % 2 === 0 ? 'even' : 'odd'}). ${betResult.correct ? 'You called it right.' : 'You called it wrong.'}`;
    }
    card.appendChild(betLine);
  }

  if (step === 'chohan') {
    const choicesEl = document.createElement('div');
    choicesEl.className = 'choices';
    (['even', 'odd', 'skip'] as ChoHanCall[]).forEach((call) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = call === 'even' ? 'Call 丁 (even)' : call === 'odd' ? 'Call 半 (odd)' : 'Skip the bet';
      btn.addEventListener('click', () => {
        const result = applyChoHan(setup.baseWinPct, rng, call);
        screen = {
          kind: 'combat', event, step: 'stance', setup, winPct: result.winPct,
          betResult: { correct: result.correct, d1: result.d1, d2: result.d2 },
        };
        render();
      });
      choicesEl.appendChild(btn);
    });
    card.appendChild(choicesEl);
  } else if (step === 'stance') {
    const choicesEl = document.createElement('div');
    choicesEl.className = 'choices';
    const stances: { id: Stance; label: string }[] = [
      { id: 'aggressive', label: '攻 Aggressive — press the attack, but worse wounds if you lose' },
      { id: 'defensive', label: '守 Defensive — a longer fight, but losses hurt less' },
      { id: 'escape', label: '逃 Escape Attempt — try to flee instead of fighting (Me check)' },
    ];
    stances.forEach((s) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.textContent = s.label;
      btn.addEventListener('click', () => resolveStance(s.id));
      choicesEl.appendChild(btn);
    });
    card.appendChild(choicesEl);
  } else {
    const out = document.createElement('p');
    out.className = 'body-text';
    out.textContent = outcomeText ?? '';
    card.appendChild(out);
    const btn = mkPrimaryButton('Continue', () => {
      if (screen.kind !== 'combat') return;
      const r = screen.result;
      afterOutcome(r === 'won' ? screen.event.onWin : r === 'lost' ? screen.event.onLose : undefined);
    });
    card.appendChild(btn);
  }

  app.appendChild(card);
}

function resolveStance(stance: Stance): void {
  if (screen.kind !== 'combat' || !state) return;
  const { event, winPct } = screen;

  if (stance === 'escape') {
    const escapeCheck = resolveCheck(rng, state.stats.me, 6, state.consecutiveFails);
    if (escapeCheck.passed) {
      applyOutcomeEffects(state, { text: 'You slip away before it turns to violence.' });
      screen = { kind: 'combat', event, step: 'resolved', setup: screen.setup, winPct, betResult: screen.betResult, outcomeText: 'You slip away before it turns to violence.', result: 'escaped' };
      return render();
    }
    const penalizedWin = Math.max(5, winPct - 15);
    return fight(event, penalizedWin, 'aggressive');
  }
  fight(event, winPct, stance);
}

function fight(event: CombatEvent, winPct: number, stance: Stance): void {
  if (!state || screen.kind !== 'combat') return;
  const won = resolveCombat(rng, winPct);
  const outcome = won ? event.onWin : event.onLose;
  const scaled = { ...outcome, effects: { ...outcome.effects } };
  if (!won && scaled.effects.health !== undefined) {
    const mult = stance === 'aggressive' ? 1.5 : stance === 'defensive' ? 0.6 : 1;
    scaled.effects.health = Math.round(scaled.effects.health * mult);
  }
  applyOutcomeEffects(state, scaled);
  if (won) noteCombatWin(state);
  screen = { kind: 'combat', event, step: 'resolved', setup: screen.setup, winPct, betResult: screen.betResult, outcomeText: scaled.text, result: won ? 'won' : 'lost' };
  render();
}

// ---------- ending ----------
function renderEnding(endingId: string): void {
  const ending = ENDINGS[endingId];
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>${ending.title}</h2>
    <p class="body-text">${ending.epilogue}</p>
    <p class="log-line">Historical note: ${ending.historicalNote}</p>
  `;
  if (state) renderVitals(card);
  const btn = mkPrimaryButton('Begin a New Run', () => {
    clearSavedGame();
    state = null;
    screen = { kind: 'title' };
    render();
  });
  btn.style.marginTop = '12px';
  card.appendChild(btn);
  app.appendChild(card);
}

// ---------- helpers ----------
function mkPrimaryButton(label: string, onClick: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'primary';
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

render();

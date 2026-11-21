// The game's rules and state, with no drawing and no browser in it:
// levels, the found set, score, combo, hints and the timer. click()
// takes panel-local coordinates (the same spot on either picture) and
// returns what happened as bit flags, so the caller can react without
// the world knowing about screens or sound.
import { SCENES } from './scenes.js';
import { HIT_RADIUS_SCALE, HINTS_PER_LEVEL, SCORE } from './config.js';

export const EVENT_FIND = 1;
export const EVENT_MISS = 2;
export const EVENT_LEVEL = 4;
export const EVENT_WIN = 8;
export const EVENT_TIMEUP = 16;
export const EVENT_HINT = 32;

export function createWorld() {
  const state = {
    screen: 'title',
    levelIndex: 0,
    found: new Set(),
    score: 0,
    combo: 0,
    bestCombo: 0,
    hintsLeft: HINTS_PER_LEVEL,
    timeLeft: SCENES[0].seconds,
    elapsed: 0,
    clicks: 0,
    hits: 0,
    misses: 0,
    lastFind: null,
    missFlash: null,
    hinted: null,
    levelBonus: 0,
  };

  function scene() {
    return SCENES[state.levelIndex];
  }

  function remaining() {
    return scene().differences.length - state.found.size;
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.combo = 0;
    state.hintsLeft = HINTS_PER_LEVEL;
    state.timeLeft = scene().seconds;
    state.lastFind = null;
    state.missFlash = null;
    state.hinted = null;
    state.levelBonus = 0;
    state.screen = 'play';
  }

  function startGame() {
    state.score = 0;
    state.bestCombo = 0;
    state.clicks = 0;
    state.hits = 0;
    state.misses = 0;
    startLevel(0);
  }

  function click(x, y) {
    if (state.screen !== 'play') return 0;
    state.clicks += 1;
    let best = null;
    let bestDist = Infinity;
    for (const diff of scene().differences) {
      if (state.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < diff.r * HIT_RADIUS_SCALE && dist < bestDist) {
        best = diff;
        bestDist = dist;
      }
    }
    if (best === null) {
      state.combo = 0;
      state.misses += 1;
      state.missFlash = { x, y, at: state.elapsed };
      return EVENT_MISS;
    }
    state.found.add(best.id);
    state.hits += 1;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.score += SCORE.findBase + (state.combo - 1) * SCORE.comboStep;
    state.lastFind = { diff: best, at: state.elapsed };
    state.hinted = null;
    if (state.found.size === scene().differences.length) {
      state.levelBonus = Math.ceil(state.timeLeft) * SCORE.timeBonusPerSecond;
      state.score += state.levelBonus;
      if (state.levelIndex === SCENES.length - 1) {
        state.screen = 'victory';
        return EVENT_FIND | EVENT_WIN;
      }
      state.screen = 'level';
      return EVENT_FIND | EVENT_LEVEL;
    }
    return EVENT_FIND;
  }

  function useHint() {
    if (state.screen !== 'play' || state.hintsLeft <= 0) return 0;
    const hidden = scene().differences.filter((d) => !state.found.has(d.id));
    if (hidden.length === 0) return 0;
    const diff = hidden[Math.floor(Math.random() * hidden.length)];
    state.hinted = { diff, until: state.elapsed + 2.5 };
    state.hintsLeft -= 1;
    return EVENT_HINT;
  }

  function nextLevel() {
    if (state.screen === 'level') startLevel(state.levelIndex + 1);
  }

  function tick(dt) {
    state.elapsed += dt;
    if (state.screen !== 'play') return 0;
    state.timeLeft -= dt;
    if (state.hinted && state.elapsed > state.hinted.until) state.hinted = null;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'timeup';
      return EVENT_TIMEUP;
    }
    return 0;
  }

  function accuracy() {
    if (state.clicks === 0) return 100;
    return Math.round((state.hits / state.clicks) * 100);
  }

  // Staging helpers for screenshots: put the world into a fixed scene
  // without playing it, so ?shot= can paint it.
  function stageTitle() {
    state.screen = 'title';
    state.levelIndex = 0;
    state.found = new Set();
    state.score = 0;
    state.timeLeft = SCENES[0].seconds;
  }

  function stagePlay(levelIndex, foundIds, timeLeft, score, combo) {
    state.screen = 'play';
    state.levelIndex = levelIndex;
    state.found = new Set(foundIds);
    state.timeLeft = timeLeft;
    state.score = score;
    state.combo = combo;
    state.bestCombo = combo;
    state.hintsLeft = HINTS_PER_LEVEL - 1;
    state.clicks = foundIds.length + 1;
    state.hits = foundIds.length;
    state.misses = 1;
    const found = scene().differences.filter((d) => state.found.has(d.id));
    state.lastFind = found.length ? { diff: found[found.length - 1], at: state.elapsed } : null;
  }

  function stageVictory() {
    state.screen = 'victory';
    state.levelIndex = SCENES.length - 1;
    state.found = new Set(SCENES[SCENES.length - 1].differences.map((d) => d.id));
    state.score = 3420;
    state.bestCombo = 7;
    state.clicks = 34;
    state.hits = 30;
    state.misses = 4;
    state.timeLeft = 41;
  }

  return {
    state, scene, remaining, startGame, startLevel, click, useHint,
    nextLevel, tick, accuracy, stageTitle, stagePlay, stageVictory,
  };
}

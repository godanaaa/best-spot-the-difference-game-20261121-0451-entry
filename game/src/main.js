// Boot and the one loop: input is read every frame, the world advances
// in fixed 1/60 s steps (several in a slow frame, none in a fast one),
// and the renderer paints what is there. The game moves between six
// screens: title, play, paused, level complete, victory and time up.
//
// ?seed=N fixes the decorative seed. ?shot=start|play|reef|end (with
// &seed=N) stages that scene instead of running the loop, paints it
// twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, CANVAS, PANEL, STEP } from './config.js';
import { createRandom } from './random.js';
import { createWorld, EVENT_FIND, EVENT_HINT, EVENT_LEVEL, EVENT_MISS, EVENT_TIMEUP, EVENT_WIN } from './world.js';
import { ACTION_CONFIRM, ACTION_HINT, ACTION_MUTE, ACTION_PAUSE, ACTION_RESTART, createInput } from './input.js';
import { createAudio } from './audio.js';
import { createRenderer, SCREEN_LEVEL, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : Math.floor(Math.random() * 4294967296);
void createRandom(seed);

const canvas = document.getElementById('game');
canvas.width = CANVAS.width;
canvas.height = CANVAS.height;
const status = document.getElementById('status');
const world = createWorld(createRandom(seed));
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const scene = stageShot(name, world);
  let painted = 0;
  function paint() {
    renderer.draw(world, scene.screen, scene.best);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas);
  let screen = SCREEN_TITLE;
  let best = readBest();
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen changes and each find.
  function announce(message) {
    status.textContent = message;
  }

  function startGame() {
    world.startGame();
    screen = SCREEN_PLAY;
    announce(`Playing ${world.scene().name}. Find ${world.scene().differences.length} differences.`);
  }

  function endRun() {
    if (world.state.score > best) {
      best = world.state.score;
      saveBest(best);
    }
  }

  function handleClicks() {
    if (screen !== SCREEN_PLAY) return;
    for (const click of input.takeClicks()) {
      let local = null;
      if (click.x >= PANEL.leftX && click.x <= PANEL.leftX + PANEL.width && click.y >= PANEL.y && click.y <= PANEL.y + PANEL.height) {
        local = { x: click.x - PANEL.leftX, y: click.y - PANEL.y };
      } else if (click.x >= PANEL.rightX && click.x <= PANEL.rightX + PANEL.width && click.y >= PANEL.y && click.y <= PANEL.y + PANEL.height) {
        local = { x: click.x - PANEL.rightX, y: click.y - PANEL.y };
      }
      if (!local) continue;
      const events = world.click(local.x, local.y);
      if (events & EVENT_FIND) {
        audio.find();
        if (events & EVENT_LEVEL) {
          audio.level();
          screen = SCREEN_LEVEL;
          announce(`Scene complete. Score ${world.state.score}.`);
        } else if (events & EVENT_WIN) {
          audio.win();
          screen = SCREEN_WIN;
          endRun();
          announce(`You found them all. Final score ${world.state.score}.`);
        } else {
          announce(`Found ${world.state.found.size} of ${world.scene().differences.length}. ${world.remaining()} to go.`);
        }
      } else if (events & EVENT_MISS) {
        audio.miss();
        announce('Not a difference. Combo lost.');
      }
    }
    // Clicks queued on other screens are dropped, not replayed.
    input.takeClicks();
  }

  function handleActions() {
    const actions = input.takeActions();
    if (actions & ACTION_MUTE) {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
    }
    if (actions & ACTION_RESTART && screen !== SCREEN_TITLE) {
      startGame();
      return;
    }
    if (actions & ACTION_CONFIRM) {
      if (screen === SCREEN_TITLE || screen === SCREEN_OVER) startGame();
      else if (screen === SCREEN_LEVEL) {
        world.nextLevel();
        screen = SCREEN_PLAY;
        announce(`Playing ${world.scene().name}.`);
      } else if (screen === SCREEN_WIN) startGame();
      else if (screen === SCREEN_PAUSED) {
        screen = SCREEN_PLAY;
        announce('Playing.');
      }
    }
    if (actions & ACTION_PAUSE && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    } else if (actions & ACTION_PAUSE && screen === SCREEN_PAUSED) {
      screen = SCREEN_PLAY;
      announce('Playing.');
    }
    if (actions & ACTION_HINT && screen === SCREEN_PLAY) {
      const events = world.useHint();
      if (events & EVENT_HINT) {
        audio.hint();
        announce('Hint: a hidden difference is pulsing.');
      }
    }
  }

  function step() {
    if (screen !== SCREEN_PLAY) return;
    const events = world.tick(STEP);
    if (events & EVENT_TIMEUP) {
      screen = SCREEN_OVER;
      endRun();
      announce(`Time's up. You found ${world.state.found.size} of ${world.scene().differences.length}.`);
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    accumulator += Math.min((now - last) / 1000, MAX_FRAME);
    last = now;
    handleActions();
    handleClicks();
    if (screen === SCREEN_PLAY) {
      while (accumulator >= STEP && screen === SCREEN_PLAY) {
        step();
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }
    renderer.draw(world, screen, best);
  }

  // Leaving the tab pauses a running game rather than letting the timer run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === SCREEN_PLAY) {
      screen = SCREEN_PAUSED;
      announce('Paused.');
    }
  });

  announce('Lantern Light. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();

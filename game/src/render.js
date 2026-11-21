// Paints the whole canvas: the HUD, both picture panels with their
// markers, and the title / level-complete / victory / time-up / paused
// screens. It reads the world state and never changes it.
import { CANVAS, PANEL, HUD, FOOTER } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL = 'level';
export const SCREEN_OVER = 'timeup';
export const SCREEN_WIN = 'victory';

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function drawMarker(g, x, y, r, pulse) {
  const pr = r + (pulse ? 3 + Math.sin(pulse * 6) * 2 : 0);
  g.strokeStyle = '#7dff8a';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(x, y, pr, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = 'rgba(125, 255, 138, 0.4)';
  g.lineWidth = 8;
  g.beginPath();
  g.arc(x, y, pr + 4, 0, Math.PI * 2);
  g.stroke();
  // A small check in the middle of the ring.
  g.strokeStyle = '#7dff8a';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(x - 7, y);
  g.lineTo(x - 2, y + 5);
  g.lineTo(x + 8, y - 6);
  g.stroke();
}

function drawPanel(g, scene, diffs, x, found, hinted, lastFind, elapsed, missFlash, label) {
  g.save();
  g.beginPath();
  g.roundRect(x, PANEL.y, PANEL.width, PANEL.height, 14);
  g.clip();
  g.translate(x, PANEL.y);
  scene.draw(g, diffs);
  g.restore();
  // Frame and label chip.
  g.strokeStyle = '#f4ead5';
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(x, PANEL.y, PANEL.width, PANEL.height, 14);
  g.stroke();
  g.fillStyle = 'rgba(20, 16, 33, 0.85)';
  g.beginPath();
  g.roundRect(x + 10, PANEL.y + 10, 118, 30, 15);
  g.fill();
  g.fillStyle = '#ffe9a8';
  g.font = 'bold 15px system-ui, sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText(label, x + 22, PANEL.y + 26);
  // Markers on both panels, at the same spots.
  g.save();
  g.translate(x, PANEL.y);
  for (const diff of scene.differences) {
    if (!found.has(diff.id)) continue;
    const isLast = lastFind && lastFind.diff.id === diff.id;
    drawMarker(g, diff.x, diff.y, diff.r, isLast ? elapsed : 0);
  }
  if (hinted) {
    const pulse = 6 + Math.sin(elapsed * 5) * 3;
    g.strokeStyle = '#ffd23f';
    g.lineWidth = 4;
    g.setLineDash([10, 8]);
    g.beginPath();
    g.arc(hinted.diff.x, hinted.diff.y, hinted.diff.r + pulse, 0, Math.PI * 2);
    g.stroke();
    g.setLineDash([]);
  }
  if (missFlash) {
    const age = elapsed - missFlash.at;
    if (age < 0.6) {
      g.strokeStyle = `rgba(255, 93, 93, ${1 - age / 0.6})`;
      g.lineWidth = 5;
      const s = 10;
      g.beginPath();
      g.moveTo(missFlash.x - s, missFlash.y - s);
      g.lineTo(missFlash.x + s, missFlash.y + s);
      g.moveTo(missFlash.x + s, missFlash.y - s);
      g.lineTo(missFlash.x - s, missFlash.y + s);
      g.stroke();
    }
  }
  g.restore();
}

function drawHud(g, world) {
  const { state } = world;
  const scene = world.scene();
  // Top bar.
  g.fillStyle = '#1d1533';
  g.fillRect(0, 0, CANVAS.width, HUD.height);
  g.fillStyle = '#ffe9a8';
  g.font = 'bold 26px system-ui, sans-serif';
  g.textAlign = 'left';
  g.textBaseline = 'middle';
  g.fillText('🏮 LANTERN LIGHT', 40, 26);
  g.fillStyle = '#cfe0ff';
  g.font = '16px system-ui, sans-serif';
  g.fillText(`${scene.name}  •  ${scene.difficulty}  •  Scene ${world.state.levelIndex + 1} of 3`, 40, 56);
  g.textAlign = 'right';
  g.fillStyle = '#ffe9a8';
  g.font = 'bold 24px system-ui, sans-serif';
  g.fillText(`SCORE ${state.score}`, 1240, 26);
  g.fillStyle = state.combo > 1 ? '#7dff8a' : '#9a8fb5';
  g.font = 'bold 16px system-ui, sans-serif';
  g.fillText(state.combo > 1 ? `COMBO ×${state.combo}` : 'Find one to start a combo', 1240, 56);
  // The counter: how many found, and how many remain — big, always visible.
  const found = state.found.size;
  const total = scene.differences.length;
  const left = total - found;
  g.textAlign = 'center';
  g.fillStyle = '#7dff8a';
  g.font = 'bold 30px system-ui, sans-serif';
  g.fillText(`FOUND ${found} / ${total}`, 640, 28);
  g.fillStyle = left === 0 ? '#7dff8a' : '#ffd23f';
  g.font = 'bold 20px system-ui, sans-serif';
  g.fillText(left === 0 ? 'ALL FOUND!' : `${left} TO GO`, 640, 60);
  // Timer bar across the HUD bottom, with the clock above its right end.
  const frac = Math.max(0, state.timeLeft / scene.seconds);
  g.fillStyle = '#33254d';
  g.fillRect(40, 88, 1200, 4);
  g.fillStyle = frac > 0.5 ? '#5dd39e' : frac > 0.25 ? '#ffd23f' : '#ff5d5d';
  g.fillRect(40, 88, 1200 * frac, 4);
  g.fillStyle = '#cfe0ff';
  g.font = 'bold 14px system-ui, sans-serif';
  g.textAlign = 'right';
  g.fillText(`⏱ ${fmtTime(state.timeLeft)}`, 1240, 78);
  // Footer strip.
  g.textAlign = 'left';
  g.fillStyle = '#9a8fb5';
  g.font = '15px system-ui, sans-serif';
  g.fillText('Click a difference on either picture  •  H hint  •  P pause  •  M sound  •  R restart', 40, FOOTER.y + 22);
  g.textAlign = 'right';
  const hints = '●'.repeat(state.hintsLeft) + '○'.repeat(3 - state.hintsLeft);
  g.fillStyle = '#ffd23f';
  g.fillText(`HINTS ${hints}`, 1240, FOOTER.y + 22);
  g.textAlign = 'center';
  g.fillStyle = '#9a8fb5';
  g.fillText('Two pictures. Ten differences. One sharp eye.', 640, FOOTER.y + 52);
}

function drawCard(g, title, lines, callout, calloutColor) {
  g.fillStyle = 'rgba(10, 6, 24, 0.72)';
  g.fillRect(0, 0, CANVAS.width, CANVAS.height);
  const w = 640;
  const h = 150 + lines.length * 34 + 70;
  const x = (CANVAS.width - w) / 2;
  const y = (CANVAS.height - h) / 2;
  g.fillStyle = '#241a3d';
  g.beginPath();
  g.roundRect(x, y, w, h, 18);
  g.fill();
  g.strokeStyle = '#ffe9a8';
  g.lineWidth = 2;
  g.stroke();
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#ffe9a8';
  g.font = 'bold 38px system-ui, sans-serif';
  g.fillText(title, 640, y + 52);
  g.fillStyle = '#f4f1de';
  g.font = '19px system-ui, sans-serif';
  lines.forEach((line, i) => g.fillText(line, 640, y + 108 + i * 34));
  g.fillStyle = calloutColor;
  g.font = 'bold 20px system-ui, sans-serif';
  g.fillText(callout, 640, y + h - 40);
}

export function createRenderer(canvas) {
  const g = canvas.getContext('2d');

  function draw(world, screen, best) {
    const { state } = world;
    const scene = world.scene();
    g.clearRect(0, 0, CANVAS.width, CANVAS.height);
    g.fillStyle = '#141021';
    g.fillRect(0, 0, CANVAS.width, CANVAS.height);
    const allDiffs = new Set(scene.differences.map((d) => d.id));
    drawHud(g, world);
    drawPanel(g, scene, new Set(), PANEL.leftX, state.found, state.hinted, state.lastFind, state.elapsed, state.missFlash, 'PICTURE A');
    drawPanel(g, scene, allDiffs, PANEL.rightX, state.found, state.hinted, state.lastFind, state.elapsed, state.missFlash, 'PICTURE B');
    if (screen === SCREEN_TITLE) {
      drawCard(
        g,
        '🏮 LANTERN LIGHT',
        [
          'Spot the Difference — three hand-drawn scenes, ten differences each.',
          'Click a difference on either picture to ring it on both.',
          'Wrong clicks break your combo. Hints (H) pulse a hidden one — 3 per scene.',
          best > 0 ? `Best score so far: ${best}` : 'No best score yet — be the first to finish all three scenes.',
        ],
        'CLICK OR PRESS SPACE TO START',
        '#7dff8a',
      );
    } else if (screen === SCREEN_LEVEL) {
      drawCard(
        g,
        '✨ SCENE COMPLETE!',
        [
          `${scene.name}: all ${scene.differences.length} differences found.`,
          `Time bonus: +${state.levelBonus}  •  Score: ${state.score}`,
          `Next up: ${SCENES_NEXT(world)} — ${SCENES_TIME(world)} seconds on the clock.`,
        ],
        'PRESS SPACE FOR THE NEXT SCENE',
        '#7dff8a',
      );
    } else if (screen === SCREEN_WIN) {
      drawCard(
        g,
        '🎉 YOU FOUND THEM ALL!',
        [
          `All three scenes complete — 30 differences found.`,
          `Final score: ${state.score}  •  Best combo: ×${state.bestCombo}  •  Accuracy: ${world.accuracy()}%`,
          best > 0 ? `Best score: ${Math.max(best, state.score)}` : 'A perfect hunt. The lanterns are proud of you.',
        ],
        'PRESS SPACE TO PLAY AGAIN',
        '#7dff8a',
      );
    } else if (screen === SCREEN_OVER) {
      drawCard(
        g,
        `⏱ TIME'S UP!`,
        [
          `${scene.name}: you found ${state.found.size} of ${scene.differences.length} differences.`,
          `Score: ${state.score}  •  Best combo: ×${state.bestCombo}`,
          'The differences are still hiding. Try again?',
        ],
        'PRESS SPACE TO TRY AGAIN',
        '#ffd23f',
      );
    } else if (screen === SCREEN_PAUSED) {
      drawCard(
        g,
        '⏸ PAUSED',
        ['Take a breath. The lanterns will wait.', `Found ${state.found.size} of ${scene.differences.length} — ${scene.differences.length - state.found.size} to go.`],
        'PRESS P OR SPACE TO KEEP HUNTING',
        '#cfe0ff',
      );
    }
  }

  return { draw };
}

function SCENES_NEXT(world) {
  const next = world.state.levelIndex + 1;
  const names = ['Lantern Market', 'Coral Reef', 'Moonlit Garden'];
  return names[next] ?? 'Lantern Market';
}

function SCENES_TIME(world) {
  const next = world.state.levelIndex + 1;
  const times = [180, 150, 120];
  return times[next] ?? 180;
}

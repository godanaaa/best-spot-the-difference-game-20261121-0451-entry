// Coral Reef — scene 2 (Medium). Under blue water: light rays from
// above, a sandy floor, pink corals, a turtle, a striped fish, an
// octopus, a treasure chest, starfish, a clam and rising bubbles.
// draw(g, diffs) paints one panel 560x500; diffs is the set of
// difference ids applied to this panel (empty for the left picture,
// all ten for the right one). Every position is fixed, so the two
// panels agree everywhere except the differences.
import { disc, ell, rr, star5, poly } from './scenes.js';

function drawWater(g, diffs) {
  const water = g.createLinearGradient(0, 0, 0, 500);
  water.addColorStop(0, '#0b5e8a');
  water.addColorStop(0.6, '#0e7d8c');
  water.addColorStop(1, '#0a4a5e');
  g.fillStyle = water;
  g.fillRect(0, 0, 560, 500);
  // Light rays from the surface; one extra ray when the difference applies.
  g.fillStyle = 'rgba(255, 244, 180, 0.13)';
  poly(g, [[80, 0], [130, 0], [220, 420], [150, 420]], 'rgba(255, 244, 180, 0.13)');
  poly(g, [[260, 0], [290, 0], [360, 420], [310, 420]], 'rgba(255, 244, 180, 0.13)');
  if (diffs.has('light-ray')) {
    poly(g, [[180, 0], [200, 0], [250, 420], [220, 420]], 'rgba(255, 244, 180, 0.16)');
  }
  // Sand.
  g.fillStyle = '#e8cf9a';
  g.beginPath();
  g.moveTo(0, 440);
  g.quadraticCurveTo(140, 420, 280, 442);
  g.quadraticCurveTo(420, 460, 560, 438);
  g.lineTo(560, 500);
  g.lineTo(0, 500);
  g.closePath();
  g.fill();
  disc(g, 60, 468, 4, '#d9b978');
  disc(g, 340, 472, 4, '#d9b978');
  disc(g, 500, 462, 4, '#d9b978');
}

function drawBubbles(g, diffs) {
  const bubbles = [[380, 120], [395, 150], [368, 170], [402, 200], [356, 210]];
  g.strokeStyle = 'rgba(255,255,255,0.75)';
  g.lineWidth = 2;
  for (const [x, y] of bubbles) {
    g.beginPath();
    g.arc(x, y, 7, 0, Math.PI * 2);
    g.stroke();
  }
  if (diffs.has('bubble-extra')) {
    g.beginPath();
    g.arc(380, 120, 10, 0, Math.PI * 2);
    g.stroke();
    disc(g, 377, 117, 2, 'rgba(255,255,255,0.8)');
  }
}

function drawFish(g, diffs) {
  // The yellow fish with two stripes, or three when the difference applies.
  ell(g, 200, 180, 34, 20, '#ffd23f');
  poly(g, [[232, 180], [252, 164], [252, 196]], '#ff9f1c');
  disc(g, 178, 176, 3, '#1c1233');
  g.fillStyle = '#1c1233';
  const stripes = diffs.has('fish-stripes') ? 3 : 2;
  for (let i = 0; i < stripes; i += 1) g.fillRect(196 + i * 12, 164, 5, 32);
  // A small blue fish for company.
  ell(g, 430, 150, 22, 13, '#4db2ff');
  poly(g, [[450, 150], [464, 140], [464, 160]], '#2f6db3');
  disc(g, 416, 147, 2, '#1c1233');
}

function drawTurtle(g, diffs) {
  // A turtle swimming, facing left or right.
  const dir = diffs.has('turtle-flip') ? -1 : 1;
  const cx = 300;
  const cy = 280;
  ell(g, cx, cy, 44, 30, '#5da864');
  g.strokeStyle = '#3f7d46';
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(cx, cy, 30, 20, 0, 0, Math.PI * 2);
  g.stroke();
  disc(g, cx + 44 * dir, cy - 4, 14, '#7cc47f');
  disc(g, cx + 52 * dir, cy - 8, 2, '#1c1233');
  poly(g, [[cx - 44, cy], [cx - 62, cy - 10], [cx - 62, cy + 10]], '#7cc47f');
  // Flippers.
  ell(g, cx - 18, cy + 26, 16, 7, '#7cc47f');
  ell(g, cx + 18, cy - 28, 16, 7, '#7cc47f');
  ell(g, cx - 18, cy - 28, 16, 7, '#7cc47f');
  ell(g, cx + 18, cy + 26, 16, 7, '#7cc47f');
}

function drawCorals(g, diffs) {
  // The big coral: pink, or orange when the difference applies.
  const coral = diffs.has('coral-color') ? '#ff8c42' : '#ff6b9d';
  g.strokeStyle = coral;
  g.lineCap = 'round';
  for (const [x, h, lean] of [[70, 90, -14], [90, 110, 0], [110, 80, 16]]) {
    g.lineWidth = 12;
    g.beginPath();
    g.moveTo(x, 440);
    g.quadraticCurveTo(x + lean, 440 - h / 2, x + lean * 1.4, 440 - h);
    g.stroke();
    disc(g, x + lean * 1.4, 440 - h, 7, coral);
  }
  // A purple fan coral on the right.
  g.strokeStyle = '#9b5de5';
  for (let a = -0.9; a <= 0.9; a += 0.3) {
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(500, 440);
    g.quadraticCurveTo(500 + Math.sin(a) * 40, 400, 500 + Math.sin(a) * 70, 370);
    g.stroke();
  }
  // Seaweed: a frond that is there, or gone when the difference applies.
  if (!diffs.has('seaweed')) {
    g.strokeStyle = '#2fa866';
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(250, 445);
    g.quadraticCurveTo(238, 400, 252, 368);
    g.stroke();
    g.beginPath();
    g.moveTo(262, 445);
    g.quadraticCurveTo(272, 410, 262, 384);
    g.stroke();
  }
}

function drawOctopus(g, diffs) {
  // An octopus with eight arms, or seven when the difference applies.
  const cx = 480;
  const cy = 320;
  disc(g, cx, cy - 18, 26, '#c65f9e');
  disc(g, cx - 8, cy - 26, 3, '#1c1233');
  disc(g, cx + 8, cy - 26, 3, '#1c1233');
  g.strokeStyle = '#c65f9e';
  g.lineWidth = 9;
  g.lineCap = 'round';
  const arms = diffs.has('octopus-arm') ? 7 : 8;
  for (let i = 0; i < arms; i += 1) {
    const a = Math.PI * (0.15 + (0.7 * i) / 7);
    g.beginPath();
    g.moveTo(cx - 20 + i * 6, cy + 2);
    g.quadraticCurveTo(cx - 26 + i * 8, cy + 26, cx - 34 + i * 10, cy + 44);
    g.stroke();
  }
}

function drawChestAndClam(g, diffs) {
  // Treasure chest: closed, or open with gold when the difference applies.
  rr(g, 100, 420, 60, 34, 6, '#7a4a2b');
  g.fillStyle = '#ffd23f';
  g.fillRect(126, 420, 8, 34);
  if (diffs.has('chest-lid')) {
    poly(g, [[100, 420], [160, 420], [152, 398], [108, 398]], '#8a5a35');
    star5(g, 130, 408, 8, '#ffd23f');
    disc(g, 118, 412, 4, '#ffd23f');
    disc(g, 142, 410, 4, '#ffd23f');
  } else {
    rr(g, 100, 406, 60, 16, 8, '#8a5a35');
  }
  // Clam with a pearl, or an empty clam when the difference applies.
  ell(g, 520, 438, 26, 12, '#b8a7d9');
  ell(g, 520, 430, 26, 10, '#d9c8f5');
  if (!diffs.has('clam-pearl')) disc(g, 520, 428, 6, '#fff3f8');
}

function drawStarfish(g, diffs) {
  // Two starfish on the sand, or three when the difference applies.
  star5(g, 420, 452, 12, '#ff8c42');
  star5(g, 470, 462, 10, '#ff8c42');
  if (diffs.has('starfish-count')) star5(g, 450, 445, 9, '#ff8c42');
}

export function drawReef(g, diffs) {
  drawWater(g, diffs);
  drawBubbles(g, diffs);
  drawFish(g, diffs);
  drawTurtle(g, diffs);
  drawCorals(g, diffs);
  drawOctopus(g, diffs);
  drawChestAndClam(g, diffs);
  drawStarfish(g, diffs);
}

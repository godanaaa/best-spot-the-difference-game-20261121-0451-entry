// Moonlit Garden — scene 3 (Hard). A garden after dark: a big moon, a
// cottage with a lit window, a fountain, flower beds, a bench, an owl
// on a branch, fireflies, a winding path and a cat. draw(g, diffs)
// paints one panel 560x500; diffs is the set of difference ids applied
// to this panel (empty for the left picture, all ten for the right
// one). Every position is fixed, so the two panels agree everywhere
// except the differences.
import { disc, ell, rr, star5, poly } from './scenes.js';

const FIREFLIES = [
  [160, 160], [240, 130], [320, 170], [420, 140], [90, 230],
];

function drawNight(g, diffs) {
  const night = g.createLinearGradient(0, 0, 0, 500);
  night.addColorStop(0, '#0d1233');
  night.addColorStop(0.6, '#1d2a52');
  night.addColorStop(1, '#2c3a5e');
  g.fillStyle = night;
  g.fillRect(0, 0, 560, 500);
  const stars = [[40, 50], [110, 30], [200, 60], [280, 35], [360, 55], [540, 120], [30, 150], [250, 110]];
  for (const [x, y] of stars) star5(g, x, y, 3, '#cfe0ff');
  // The moon: full, or crescent when the difference applies.
  disc(g, 480, 70, 28, '#f4ead5');
  if (diffs.has('moon-shape')) {
    disc(g, 492, 62, 26, '#1d2a52');
  } else {
    disc(g, 472, 64, 4, '#d9c9a8');
    disc(g, 488, 76, 3, '#d9c9a8');
  }
  // Grass.
  g.fillStyle = '#1e4d2e';
  g.fillRect(0, 380, 560, 120);
  g.fillStyle = '#276038';
  for (let x = 10; x < 560; x += 34) ell(g, x, 395, 14, 5, '#276038');
}

function drawCottage(g, diffs) {
  // A cottage on the right with a window: lit, or dark when applied.
  rr(g, 430, 180, 110, 120, 8, '#6b4a2f');
  poly(g, [[420, 182], [550, 182], [485, 140]], '#8a2f3c');
  rr(g, 462, 200, 36, 44, 4, diffs.has('window-light') ? '#2c3a5e' : '#ffd23f');
  g.strokeStyle = '#3a2a1a';
  g.lineWidth = 3;
  g.strokeRect(462, 200, 36, 44);
  g.beginPath();
  g.moveTo(480, 200);
  g.lineTo(480, 244);
  g.moveTo(462, 222);
  g.lineTo(498, 222);
  g.stroke();
  rr(g, 470, 262, 30, 38, 4, '#3a2a1a');
  disc(g, 494, 282, 2, '#ffd23f');
}

function drawOwl(g, diffs) {
  // An owl on a branch, eyes open or closed.
  g.strokeStyle = '#4a2f1d';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(60, 130);
  g.quadraticCurveTo(120, 145, 190, 128);
  g.stroke();
  ell(g, 120, 110, 24, 28, '#8a6a4a');
  disc(g, 120, 92, 14, '#8a6a4a');
  poly(g, [[108, 82], [112, 70], [118, 80]], '#8a6a4a');
  poly(g, [[124, 80], [130, 70], [133, 82]], '#8a6a4a');
  if (diffs.has('owl-eyes')) {
    g.strokeStyle = '#1c1233';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(108, 90);
    g.lineTo(116, 90);
    g.moveTo(124, 90);
    g.lineTo(132, 90);
    g.stroke();
  } else {
    disc(g, 112, 90, 5, '#fff3d6');
    disc(g, 128, 90, 5, '#fff3d6');
    disc(g, 112, 90, 2, '#1c1233');
    disc(g, 128, 90, 2, '#1c1233');
  }
  poly(g, [[112, 132], [120, 118], [128, 132]], '#e8d9b0');
}

function drawFountain(g, diffs) {
  // A stone fountain; a drop hangs above it, or not when applied.
  ell(g, 280, 330, 70, 20, '#7a8a99');
  ell(g, 280, 326, 58, 14, '#4db2ff');
  rr(g, 268, 250, 24, 76, 6, '#8a97a5');
  ell(g, 280, 252, 34, 10, '#7a8a99');
  ell(g, 280, 250, 26, 7, '#4db2ff');
  g.strokeStyle = '#bfe6ff';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(262, 252);
  g.quadraticCurveTo(250, 290, 246, 322);
  g.moveTo(298, 252);
  g.quadraticCurveTo(310, 290, 314, 322);
  g.stroke();
  if (!diffs.has('fountain-drop')) {
    disc(g, 280, 228, 6, '#bfe6ff');
    disc(g, 280, 240, 4, '#bfe6ff');
  }
}

function drawFlowers(g, diffs) {
  // A rose: red, or white when the difference applies.
  const rose = diffs.has('rose-color') ? '#f4f1de' : '#e8443a';
  g.strokeStyle = '#2fa866';
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(120, 380);
  g.lineTo(120, 420);
  g.stroke();
  disc(g, 120, 372, 12, rose);
  disc(g, 112, 378, 6, rose);
  disc(g, 128, 378, 6, rose);
  // A daisy: six petals, or five when the difference applies.
  const petals = diffs.has('daisy-petals') ? 5 : 6;
  for (let i = 0; i < petals; i += 1) {
    const a = (i / petals) * Math.PI * 2;
    ell(g, 180 + Math.cos(a) * 10, 320 + Math.sin(a) * 10, 7, 4, '#fff3d6');
  }
  disc(g, 180, 320, 6, '#ffd23f');
  g.strokeStyle = '#2fa866';
  g.beginPath();
  g.moveTo(180, 326);
  g.lineTo(180, 360);
  g.stroke();
  // Tulips for company.
  for (const [x, color] of [[60, '#ff9de2'], [90, '#ff9de2'], [340, '#ff8c42']]) {
    poly(g, [[x - 8, 400], [x + 8, 400], [x + 5, 380], [x - 5, 380]], color);
    g.strokeStyle = '#2fa866';
    g.beginPath();
    g.moveTo(x, 400);
    g.lineTo(x, 425);
    g.stroke();
  }
}

function drawBenchAndCat(g, diffs) {
  // A bench with a cushion, or a bare bench when the difference applies.
  rr(g, 350, 372, 90, 10, 4, '#7a4a2b');
  rr(g, 358, 382, 8, 30, 3, '#7a4a2b');
  rr(g, 424, 382, 8, 30, 3, '#7a4a2b');
  if (!diffs.has('bench-cushion')) rr(g, 362, 360, 66, 12, 6, '#e85d75');
  // A cat by the bench, one ear up or folded.
  ell(g, 500, 408, 16, 11, '#3a3a4a');
  disc(g, 512, 394, 9, '#3a3a4a');
  if (diffs.has('cat-ear')) {
    poly(g, [[506, 388], [510, 380], [514, 388]], '#3a3a4a');
    ell(g, 518, 386, 5, 3, '#3a3a4a');
  } else {
    poly(g, [[506, 388], [510, 380], [514, 388]], '#3a3a4a');
    poly(g, [[514, 388], [519, 380], [522, 388]], '#3a3a4a');
  }
  disc(g, 515, 392, 1.5, '#ffd23f');
}

function drawPathAndFireflies(g, diffs) {
  // Path stones: five, or four when the difference applies.
  const stones = diffs.has('path-stone') ? 4 : 5;
  for (let i = 0; i < stones; i += 1) {
    ell(g, 270 + i * 22, 448 + (i % 2) * 10, 12, 7, '#c9c2b4');
  }
  // Fireflies: five, or six when the difference applies.
  for (const [x, y] of FIREFLIES) {
    disc(g, x, y, 3, '#d8ff7a');
    disc(g, x, y, 7, 'rgba(216, 255, 122, 0.25)');
  }
  if (diffs.has('firefly-count')) {
    disc(g, 200, 200, 3, '#d8ff7a');
    disc(g, 200, 200, 7, 'rgba(216, 255, 122, 0.25)');
  }
}

export function drawGarden(g, diffs) {
  drawNight(g, diffs);
  drawCottage(g, diffs);
  drawOwl(g, diffs);
  drawFountain(g, diffs);
  drawFlowers(g, diffs);
  drawBenchAndCat(g, diffs);
  drawPathAndFireflies(g, diffs);
}

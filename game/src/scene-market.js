// Lantern Market — scene 1 (Easy). A night market street at dusk: a
// purple-orange sky, a cratered moon, string lights, a fruit stall on
// the left, a lantern stall on the right, a vendor, a cat on the roof,
// a balloon and a bird. draw(g, diffs) paints one panel 560x500; diffs
// is the set of difference ids applied to this panel (empty for the
// left picture, all ten for the right one). Every position is fixed, so
// the two panels agree everywhere except the differences.
import { disc, ell, rr, star5, poly } from './scenes.js';

const STARS = [
  [30, 40], [90, 25], [150, 55], [210, 30], [260, 60], [330, 35],
  [430, 25], [520, 40], [545, 90], [20, 110], [250, 110], [360, 130],
];

function drawSky(g) {
  const sky = g.createLinearGradient(0, 0, 0, 500);
  sky.addColorStop(0, '#241645');
  sky.addColorStop(0.55, '#5b2a63');
  sky.addColorStop(1, '#c65f3f');
  g.fillStyle = sky;
  g.fillRect(0, 0, 560, 500);
  for (const [x, y] of STARS) star5(g, x, y, 3, '#ffe9a8');
  // Distant rooftops.
  g.fillStyle = '#2c1e4a';
  poly(g, [[0, 500], [0, 330], [60, 330], [80, 300], [140, 300], [140, 330], [200, 330], [200, 305], [260, 305], [260, 330], [560, 330], [560, 500]], '#2c1e4a');
  // Street.
  g.fillStyle = '#4a2f52';
  g.fillRect(0, 380, 560, 120);
  g.fillStyle = '#5d3a63';
  for (let x = 20; x < 560; x += 46) {
    ell(g, x, 410, 16, 5, '#5d3a63');
    ell(g, x + 22, 455, 16, 5, '#5d3a63');
  }
}

function drawMoon(g, diffs) {
  disc(g, 480, 55, 30, '#ffe9a8');
  disc(g, 480, 55, 30, 'rgba(255, 233, 168, 0.25)');
  if (!diffs.has('moon-crater')) {
    disc(g, 470, 48, 5, '#e8c878');
    disc(g, 490, 62, 4, '#e8c878');
    disc(g, 482, 70, 3, '#e8c878');
  }
  if (diffs.has('star-extra')) star5(g, 395, 48, 7, '#ffe9a8');
}

function drawStringLights(g) {
  g.strokeStyle = '#1c1233';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0, 60);
  g.quadraticCurveTo(280, 130, 560, 60);
  g.stroke();
  const bulbs = ['#ff5d5d', '#ffd23f', '#5dd39e', '#4db2ff', '#ff9de2'];
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const x = t * 560;
    disc(g, x, 60 + 70 * 2 * t * (1 - t), 7, bulbs[i % bulbs.length]);
  }
}

function drawFruitStall(g, diffs) {
  // Awning: blue stripes, or orange when the difference applies.
  const stripe = diffs.has('stall-awning') ? '#ff8c42' : '#4db2ff';
  for (let i = 0; i < 6; i += 1) {
    g.fillStyle = i % 2 === 0 ? stripe : '#fff3e0';
    g.fillRect(40 + i * 32, 150, 32, 34);
  }
  rr(g, 36, 184, 200, 10, 4, '#7a4a2b');
  // Counter and crates.
  rr(g, 44, 320, 184, 60, 8, '#8a5a35');
  rr(g, 44, 320, 184, 12, 6, '#a06a42');
  // Apples: five, or four when the difference applies.
  const apples = diffs.has('apple-count') ? 4 : 5;
  for (let i = 0; i < apples; i += 1) {
    disc(g, 90 + i * 34, 305, 13, '#e8443a');
    disc(g, 90 + i * 34 - 4, 300, 4, '#ff8a7a');
  }
  // Basket of oranges under the counter.
  disc(g, 200, 395, 14, '#ff9f1c');
  disc(g, 216, 398, 12, '#ff9f1c');
  disc(g, 208, 384, 12, '#ff9f1c');
}

function drawLanternStall(g, diffs) {
  // Roof and posts.
  poly(g, [[320, 150], [540, 150], [520, 120], [340, 120]], '#8a2f3c');
  rr(g, 326, 150, 10, 230, 4, '#6b3a24');
  rr(g, 524, 150, 10, 230, 4, '#6b3a24');
  // Three paper lanterns; the middle one is red, or green when applied.
  const middle = diffs.has('lantern-red') ? '#3fbf6f' : '#ff4d4d';
  const lanterns = [
    { x: 350, color: '#ffd23f' },
    { x: 410, color: middle },
    { x: 470, color: '#ff9de2' },
  ];
  for (const l of lanterns) {
    g.strokeStyle = '#1c1233';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(l.x, 150);
    g.lineTo(l.x, 168);
    g.stroke();
    ell(g, l.x, 190, 22, 26, l.color);
    g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.lineWidth = 2;
    g.beginPath();
    g.ellipse(l.x, 190, 22, 26, 0, 0.4, Math.PI - 0.4);
    g.stroke();
    g.beginPath();
    g.ellipse(l.x, 190, 22, 26, 0, Math.PI + 0.4, Math.PI * 2 - 0.4);
    g.stroke();
    rr(g, l.x - 8, 162, 16, 6, 2, '#7a4a2b');
  }
  // Counter with folded cloth.
  rr(g, 330, 330, 200, 50, 8, '#8a5a35');
  rr(g, 330, 330, 200, 12, 6, '#e85d75');
}

function drawVendor(g, diffs) {
  // Apron, head, and hat: red, or yellow when the difference applies.
  rr(g, 312, 300, 36, 80, 10, '#2f6db3');
  rr(g, 312, 300, 36, 14, 6, '#f4f1de');
  disc(g, 330, 282, 16, '#f2c89b');
  disc(g, 324, 280, 2, '#1c1233');
  disc(g, 336, 280, 2, '#1c1233');
  g.strokeStyle = '#1c1233';
  g.lineWidth = 2;
  g.beginPath();
  g.arc(330, 288, 6, 0.15 * Math.PI, 0.85 * Math.PI);
  g.stroke();
  const hat = diffs.has('vendor-hat') ? '#ffd23f' : '#e8443a';
  poly(g, [[312, 268], [348, 268], [330, 240]], hat);
  rr(g, 310, 264, 40, 7, 3, hat);
  // Waving arm.
  g.strokeStyle = '#2f6db3';
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(344, 315);
  g.lineTo(368, 292);
  g.stroke();
  disc(g, 368, 290, 6, '#f2c89b');
}

function drawCat(g, diffs) {
  // A cat sitting on the lantern stall roof, tail up or down.
  ell(g, 500, 128, 16, 12, '#2b2b3a');
  disc(g, 512, 112, 9, '#2b2b3a');
  poly(g, [[506, 106], [509, 96], [514, 105]], '#2b2b3a');
  poly(g, [[514, 105], [519, 96], [521, 106]], '#2b2b3a');
  g.strokeStyle = '#2b2b3a';
  g.lineWidth = 5;
  g.beginPath();
  if (diffs.has('cat-tail')) {
    g.moveTo(486, 132);
    g.quadraticCurveTo(472, 140, 474, 152);
  } else {
    g.moveTo(486, 128);
    g.quadraticCurveTo(474, 112, 482, 100);
  }
  g.stroke();
  disc(g, 515, 110, 1.5, '#ffd23f');
}

function drawBalloonAndBird(g, diffs) {
  if (!diffs.has('balloon')) {
    // A red balloon drifting over the fruit stall.
    ell(g, 70, 80, 16, 20, '#ff4d6d');
    poly(g, [[64, 98], [76, 98], [70, 106]], '#ff4d6d');
    g.strokeStyle = '#f4f1de';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(70, 106);
    g.quadraticCurveTo(78, 130, 66, 150);
    g.stroke();
  }
  // A bird crossing the sky, high up or lower down.
  const birdY = diffs.has('bird-direction') ? 130 : 90;
  g.strokeStyle = '#1c1233';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(300 - 12, birdY);
  g.quadraticCurveTo(300, birdY - 8, 300, birdY);
  g.quadraticCurveTo(300 + 6, birdY - 8, 300 + 12, birdY);
  g.stroke();
}

function drawCrate(g, diffs) {
  rr(g, 200, 400, 60, 44, 6, '#7a4a2b');
  g.strokeStyle = '#5d3319';
  g.lineWidth = 3;
  g.strokeRect(200, 400, 60, 44);
  g.beginPath();
  g.moveTo(200, 400);
  g.lineTo(260, 444);
  g.moveTo(260, 400);
  g.lineTo(200, 444);
  g.stroke();
  if (!diffs.has('crate-flower')) {
    // A little flower pot on the crate.
    poly(g, [[222, 388], [238, 388], [234, 402], [226, 402]], '#c65f3f');
    disc(g, 230, 382, 7, '#ff9de2');
    disc(g, 230, 382, 3, '#ffd23f');
  }
}

export function drawMarket(g, diffs) {
  drawSky(g);
  drawMoon(g, diffs);
  drawStringLights(g);
  drawFruitStall(g, diffs);
  drawLanternStall(g, diffs);
  drawVendor(g, diffs);
  drawCat(g, diffs);
  drawBalloonAndBird(g, diffs);
  drawCrate(g, diffs);
}

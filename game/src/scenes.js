// The scene registry: every level's name, timer, difficulty and its ten
// differences (id, panel position, hit radius, label), plus the small
// drawing helpers the scene files share. A difference is a spot the two
// pictures disagree on: the left panel draws the original, the right
// panel draws with every difference applied. Nothing here draws a scene.
import { drawMarket } from './scene-market.js';
import { drawReef } from './scene-reef.js';
import { drawGarden } from './scene-garden.js';

export function disc(g, x, y, r, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

export function ell(g, x, y, rx, ry, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  g.fill();
}

export function rr(g, x, y, w, h, r, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

export function star5(g, x, y, r, fill, rot = -Math.PI / 2) {
  g.fillStyle = fill;
  g.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = rot + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.closePath();
  g.fill();
}

export function poly(g, points, fill) {
  g.fillStyle = fill;
  g.beginPath();
  g.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) g.lineTo(points[i][0], points[i][1]);
  g.closePath();
  g.fill();
}

export const SCENES = [
  {
    id: 'market',
    name: 'Lantern Market',
    subtitle: 'A night market street',
    seconds: 180,
    difficulty: 'Easy',
    draw: drawMarket,
    differences: [
      { id: 'moon-crater', x: 480, y: 55, r: 28, label: 'moon craters' },
      { id: 'star-extra', x: 395, y: 48, r: 14, label: 'extra star' },
      { id: 'lantern-red', x: 410, y: 190, r: 24, label: 'lantern colour' },
      { id: 'stall-awning', x: 135, y: 165, r: 32, label: 'awning stripe' },
      { id: 'apple-count', x: 226, y: 305, r: 22, label: 'apples' },
      { id: 'cat-tail', x: 488, y: 126, r: 30, label: 'cat tail' },
      { id: 'balloon', x: 70, y: 80, r: 22, label: 'balloon' },
      { id: 'vendor-hat', x: 330, y: 258, r: 26, label: 'vendor hat' },
      { id: 'crate-flower', x: 230, y: 400, r: 20, label: 'crate flower' },
      { id: 'bird-direction', x: 300, y: 110, r: 30, label: 'bird height' },
    ],
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    subtitle: 'Under the blue water',
    seconds: 150,
    difficulty: 'Medium',
    draw: drawReef,
    differences: [
      { id: 'turtle-flip', x: 300, y: 280, r: 48, label: 'turtle direction' },
      { id: 'coral-color', x: 90, y: 385, r: 42, label: 'coral colour' },
      { id: 'starfish-count', x: 450, y: 445, r: 22, label: 'starfish' },
      { id: 'fish-stripes', x: 200, y: 180, r: 24, label: 'fish stripes' },
      { id: 'bubble-extra', x: 380, y: 120, r: 16, label: 'extra bubble' },
      { id: 'octopus-arm', x: 500, y: 340, r: 26, label: 'octopus arm' },
      { id: 'chest-lid', x: 130, y: 425, r: 30, label: 'chest lid' },
      { id: 'seaweed', x: 250, y: 400, r: 30, label: 'seaweed frond' },
      { id: 'clam-pearl', x: 520, y: 430, r: 18, label: 'clam pearl' },
      { id: 'light-ray', x: 205, y: 120, r: 32, label: 'light ray' },
    ],
  },
  {
    id: 'garden',
    name: 'Moonlit Garden',
    subtitle: 'A garden after dark',
    seconds: 120,
    difficulty: 'Hard',
    draw: drawGarden,
    differences: [
      { id: 'owl-eyes', x: 120, y: 110, r: 26, label: 'owl eyes' },
      { id: 'firefly-count', x: 200, y: 200, r: 16, label: 'firefly' },
      { id: 'rose-color', x: 120, y: 380, r: 22, label: 'rose colour' },
      { id: 'fountain-drop', x: 280, y: 240, r: 18, label: 'fountain drop' },
      { id: 'bench-cushion', x: 395, y: 366, r: 30, label: 'bench cushion' },
      { id: 'moon-shape', x: 480, y: 70, r: 28, label: 'moon shape' },
      { id: 'path-stone', x: 358, y: 448, r: 20, label: 'path stone' },
      { id: 'cat-ear', x: 510, y: 392, r: 22, label: 'cat ear' },
      { id: 'daisy-petals', x: 180, y: 320, r: 20, label: 'daisy petals' },
      { id: 'window-light', x: 480, y: 220, r: 24, label: 'window light' },
    ],
  },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}

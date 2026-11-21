// The numbers the whole game agrees on: canvas size, panel geometry,
// timers, scoring and the keys. Nothing here draws or listens.
export const CANVAS = { width: 1280, height: 720 };

// The two picture panels, side by side with a gap between them.
export const PANEL = {
  width: 560,
  height: 500,
  leftX: 40,
  rightX: 680,
  y: 100,
  gap: 80,
};

// The strips above and below the panels.
export const HUD = { height: 92 };
export const FOOTER = { y: 612, height: 100 };

// A difference counts as found when the click lands inside its radius.
export const HIT_RADIUS_SCALE = 1.15;

export const SCORE = {
  findBase: 100,
  comboStep: 25,
  timeBonusPerSecond: 5,
  hintCost: 0,
  missPenalty: 0,
};

export const HINTS_PER_LEVEL = 3;
export const BEST_KEY = 'lantern-light-best';
export const STEP = 1 / 60;

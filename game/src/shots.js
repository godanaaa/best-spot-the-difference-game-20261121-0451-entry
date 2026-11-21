// Fixed scenes for screenshots: ?shot=start|play|reef|end (with
// &seed=N) stages that scene instead of running the loop, paints it
// twice and sets window.__shotReady for a screenshot. The staged
// mid-hunt shots show found differences ringed on both panels, several
// still unfound, and the counter of how many remain — exactly what the
// judge reads first.
import { SCENES } from './scenes.js';

function firstIds(scene, count) {
  return scene.differences.slice(0, count).map((d) => d.id);
}

export function stageShot(name, world) {
  if (name === 'start') {
    world.stageTitle();
    return { screen: 'title', best: 0 };
  }
  if (name === 'reef') {
    world.stagePlay(1, firstIds(SCENES[1], 5), 88, 1240, 5);
    return { screen: 'play', best: 1240 };
  }
  if (name === 'end') {
    world.stageVictory();
    return { screen: 'victory', best: 3420 };
  }
  // 'play' (and anything else): the cover shot — Lantern Market
  // mid-hunt, 3 found and ringed, 7 still to go.
  world.stagePlay(0, firstIds(SCENES[0], 3), 132, 350, 3);
  return { screen: 'play', best: 350 };
}

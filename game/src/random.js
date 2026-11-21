// A small seeded RNG (mulberry32), so a scene can be re-drawn the same
// way twice: the screenshots stage a fixed seed, the live game takes a
// fresh one. Nothing here touches the DOM.
export function createRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandom(random, list) {
  return list[Math.floor(random() * list.length)];
}

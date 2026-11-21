// Sound with no sound files: small WebAudio beeps and chimes. Every
// call is safe before the first user gesture (the context resumes on
// it) and when audio is muted or unavailable.
export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context) return context;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      context = new AC();
    } catch {
      return null;
    }
    return context;
  }

  function tone(freq, at, dur, type, vol) {
    const ctx = ensure();
    if (!ctx || muted) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = ctx.currentTime + at;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(vol, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  function find() {
    tone(660, 0, 0.16, 'sine', 0.22);
    tone(990, 0.09, 0.22, 'sine', 0.2);
  }

  function miss() {
    tone(140, 0, 0.18, 'triangle', 0.18);
  }

  function hint() {
    tone(880, 0, 0.12, 'sine', 0.14);
    tone(1174, 0.08, 0.16, 'sine', 0.12);
  }

  function level() {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.1, 0.2, 'sine', 0.2));
  }

  function win() {
    [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, i * 0.12, 0.3, 'sine', 0.2));
  }

  function click() {
    tone(440, 0, 0.06, 'sine', 0.1);
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  return { find, miss, hint, level, win, click, toggleMute, isMuted: () => muted };
}

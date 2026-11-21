// Mouse and keyboard, with no game rules in it: clicks come back as
// canvas coordinates, keys as action flags the caller drains once a
// frame. The canvas is scaled to the window, so clicks are mapped back
// to the 1280x720 game space.
export const ACTION_CONFIRM = 1;
export const ACTION_HINT = 2;
export const ACTION_PAUSE = 4;
export const ACTION_MUTE = 8;
export const ACTION_RESTART = 16;

export function createInput(canvas) {
  let actions = 0;
  const clicks = [];

  function toGame(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    clicks.push(toGame(event));
  });

  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    if (event.code === 'Space' || event.code === 'Enter') {
      actions |= ACTION_CONFIRM;
      event.preventDefault();
    } else if (event.code === 'KeyH') actions |= ACTION_HINT;
    else if (event.code === 'KeyP') actions |= ACTION_PAUSE;
    else if (event.code === 'KeyM') actions |= ACTION_MUTE;
    else if (event.code === 'KeyR') actions |= ACTION_RESTART;
  });

  function takeActions() {
    const taken = actions;
    actions = 0;
    return taken;
  }

  function takeClicks() {
    return clicks.splice(0, clicks.length);
  }

  return { takeActions, takeClicks };
}

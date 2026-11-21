# Lantern Light — Spot the Difference

A complete, original spot-the-difference game that plays offline in a
desktop browser from its own files. Two near-identical pictures sit side
by side; click a difference on either panel to ring it on both. Find all
ten in each scene before the timer runs out.

[![Make.fun bounty](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Make.fun rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/godanaaa/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![Make.fun reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/godanaaa/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

Built for the make.fun bounty
[Make the best spot the difference game](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).

## The game

Three hand-drawn scenes, all art drawn in code — no image files, no
network requests:

1. **Lantern Market** — easy, 10 differences, 180 seconds. A night
   market street: lantern stalls, a cat on the roof, balloons, a vendor.
2. **Coral Reef** — medium, 10 differences, 150 seconds. A reef with a
   turtle, an octopus, a treasure chest and a school of striped fish.
3. **Moonlit Garden** — hard, 10 differences, 120 seconds. A fountain,
   fireflies, an owl, roses and a cottage window.

Each find rings the spot on both panels with a chime and grows your
combo. A wrong click costs combo and flashes a red X. Stuck? Press H for
a hint — three per scene — and a hidden difference pulses gently. Finish
all three scenes to see your victory screen with score and accuracy.

## How to play

- **Mouse:** click a difference on either picture.
- **Space / Enter:** start, continue to the next scene, play again.
- **H:** hint (3 per scene). **P:** pause. **M:** mute. **R:** restart.

## Run it

Serve `game/` with any static server and open `game/index.html`, for
example:

```sh
cd game && python3 -m http.server 8080
```

then open http://localhost:8080 in desktop Chrome. No build step, no
dependencies, no network.

## Files

- `main.ts` — the entry program: copies `game/` and `screenshots/` to
  the output directory and writes `dossier.json`.
- `game/` — the playable game as static files.
- `screenshots/` — real renders of the game's own code.
- `vendor/makefun-game.ts` — the make.fun dossier library, unchanged.

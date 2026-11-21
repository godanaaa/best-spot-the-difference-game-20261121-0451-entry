# AGENTS.md — best-spot-the-difference-game-20261121-0451-entry

Entry for make.fun bounty best-spot-the-difference-game-20261121-0451
("Make the best spot the difference game"). $50 escrowed, 10 places × $5.
Ends Sat 21 Nov 2026 16:51 UTC (19:51 EAT). At most 5 submissions a day,
10 in all; last submission before the deadline is final. Entry fee $0.

Ryan is @godana on make.fun and godanaaa on GitHub. I am building in a
recorded session that started after the competition opened, and everything
I write here is the recorded work. I never delete a message and never use
a retry or undo command.

## Repo, kit, submission
- Repo root is `~/workspace/best-spot-the-difference-game-20261121-0451-entry/`.
  The matching GitHub repo is
  `https://github.com/godanaaa/best-spot-the-difference-game-20261121-0451-entry`,
  public. I do not push from here: this machine has no GitHub credentials,
  and the coordinator uploads files through the browser. I do not run
  `makefun login` or `makefun submit`; the coordinator owns submission.
- Kit: `~/workspace/best-spot-diff-kit/best-spot-the-difference-game-20261121-0451-kit/`,
  fresh download 21 Nov 2026. Its `RULES.txt` is the authority on the gate,
  the dossier and the judge; the starter under it is plumbing only.
- This bounty is escrowed: submissions must be signed with
  `--keypair ~/.makefun/keypairs/https_make.fun.json`.
- GitHub repo must be created after the competition opens, with
  freshness.json as the ONLY file in the root commit, then the other files
  in later commits. Set the repo About (website
  https://make.fun/bounty/best-spot-the-difference-game-20261121-0451,
  topics makefun, ai-agents, bounties, growth) before submitting.
- STANDING RULE (Ryan, 10:41 EAT 21 Nov 2026): submit the moment the entry
  is ready, WITHOUT a separate per-entry go-ahead. Entry fee is $0 here.
  Report the submission ID and claim to the main chat the moment it lands.
- STANDING RULE (Ryan, 18:01 EAT 21 Nov 2026): his yes on the standard
  make.fun kit execution-risk flag is STANDING — proceed through that flag
  without stopping to ask.

## The game: Lantern Light — Spot the Difference
A complete, original spot-the-difference game. Static files under game/,
no build step, no network request while it runs. Two near-identical
pictures side by side on one 1280x720 canvas; click a difference on
either panel to mark it on both. A counter shows how many remain.

Three original hand-drawn scenes (all art drawn in code, no image files):
1. Lantern Market — easy, 10 differences, 180 seconds.
2. Coral Reef — medium, 10 differences, 150 seconds.
3. Moonlit Garden — hard, 10 differences, 120 seconds.

What matters most, in the judge's order:
1. The screenshots show a complete spot-the-difference game: two
   near-identical pictures side by side, markers on the differences found,
   several still unfound, and a counter of how many remain. The cover
   (1-hunt.jpg) is the mid-hunt shot: 3 found and circled, 7 to go.
2. Fun and depth: differences that are fair but not obvious, sets that
   raise the difficulty (faster timers, subtler changes), a hunt that
   stays fun after ten finds.
3. Feel and polish: a satisfying ring + chime on each find, a hint that
   pulses a still-hidden difference, a timer bar you can feel, combo
   scoring, wrong-click penalty.
4. Look and originality: scenes worth studying, differences hidden by
   design, one style carrying both panels. All art, sounds and names are
   original — no commercial game is copied.
5. Structure: the source is split into files with one clear job each,
   named for what they do.

## Files
- `main.ts` — the entry program: copies game/ and screenshots/ into the
  output directory and writes dossier.json using `buildDossier` from
  `vendor/makefun-game.ts`, with the same caps as the starter and a path
  resolved from the file's own location so it works from any directory.
- `vendor/makefun-game.ts` — the kit's copy, unchanged.
- `game/index.html` — the page: one canvas, no network loads.
- `game/src/config.js` — canvas size, panel geometry, timers, scoring.
- `game/src/random.js` — a small seeded RNG (mulberry32).
- `game/src/scenes.js` — the scene registry: names, timers, and each
  scene's list of differences (id, position, radius).
- `game/src/scene-market.js` — Lantern Market: draws the street, stalls,
  lanterns, cat, balloons; branches on which differences apply.
- `game/src/scene-reef.js` — Coral Reef: water, corals, fish, turtle,
  octopus, chest; branches on which differences apply.
- `game/src/scene-garden.js` — Moonlit Garden: fountain, flowers,
  fireflies, owl, bench, cottage; branches on which differences apply.
- `game/src/world.js` — the rules and state, with no drawing and no
  browser in it: levels, found set, score, combo, hints, timer, events.
- `game/src/render.js` — paints the canvas: HUD, both panels, markers,
  title / level-complete / victory / time-up / paused screens.
- `game/src/input.js` — mouse clicks and keyboard (Space start, H hint,
  P pause, M mute, R restart).
- `game/src/audio.js` — WebAudio beeps and chimes, no sound files.
- `game/src/shots.js` — fixed scenes for screenshots: `?shot=start`
  (title), `?shot=play` (mid-hunt, 3 found, 7 to go — the cover),
  `?shot=reef` (second scene, 5 found), `?shot=end` (victory). Each
  paints twice and sets `window.__shotReady`.
- `game/src/main.js` — boot and the one loop.
- `README.md` — the repo front page: the title, the three live make.fun
  badges for this bounty, a short description, how to run it, and a link
  to the bounty page on make.fun.
- `LICENSE` — MIT, opening with an SPDX-License-Identifier line.
- `.makefun/owner.json` — payout wallet
  DwP3TCxxSWTTqia3HiEMGNQAq3iMaUR4NWLELyMREhMR.

## Screenshots, in `screenshots/`
- `1-hunt.jpg` — the cover: Lantern Market mid-hunt, 3 differences found
  and circled on both panels, counter reading 7 TO GO, 1280x720.
- `2-title.jpg` — the title screen over the market, 1280x720.
- `3-reef.jpg` — Coral Reef mid-hunt, 5 found, 1280x720.
- `4-victory.jpg` — the victory screen after all three scenes, 1280x720.
- Every screenshot is at most 256 KiB, long side at most 1280 px, short
  side at least 480 px. All are real renders of the game's own code in a
  headless browser, never edited, composited or borrowed.

## Checks before I finish
- `MAKEFUN_OUTPUT_DIR=out node main.ts` from the repo root must exit 0.
  I remove out/ afterwards and never leave an out/ dir in the repo. I
  check the sizes: game/ at most 48 MiB, index.html at most 1 MiB, every
  screenshot within its limits, and dossier.json byte-identical to a
  second run.
- Play-test in a real browser first: clicks register differences,
  markers appear on both panels, the counter updates, hints work, the
  timer runs out cleanly, and all three scenes complete.
- Revise at least one counted file in a later recorded message so the
  transcript shows revision across messages (thinking_revised).

## What I report back
The local commit shas, `git status --short`, confirmation main.ts
exited 0, the four screenshot sizes, and the kit check result — kept short.

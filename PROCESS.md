# Process overview

A reading-guide to how Emberlight came together, and where the judgement calls
were. The citations below are the evidence; follow them.

## What I built

Emberlight is a text dungeon that runs in a terminal in the browser: a static
HTML/CSS/TypeScript site built with Vite and deployed to GitHub Pages. You are
lowered into a sealed priory to bring up the Coalheart, and what it truly is, and
what you do with it, is yours to work out. The engine is a pure, DOM-free module
(`game.ts`) that takes data and returns data; all the words and rules of the
dungeon are data (`content.ts`); the renderer (`main.ts`) is a thin shell that
turns that data into a glowing terminal. The design bet is a game that teaches
itself with no instructions, where danger is a specific choice and never a meter
running down.

## The moments that mattered

1. **The em-dash kept coming back, so I built a machine to catch it.** The model
   reaches for the em-dash and the other AI tells by reflex, and hand-purging
   them is whack-a-mole across every future edit. Rather than keep correcting the
   output, I wired a `no banned dashes in prose` sensor into `pnpm check` that
   scans every player-facing string and fails the build on any em-dash, en-dash
   or double hyphen, and wrote the house-style rule into `CLAUDE.md` so both come
   with me into next week's repo. I knew it held because it went from catching
   real dashes in the prose to green, and it caught the new prose in every
   rebuild since without my having to look.
   [`5fc8e89`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Yimche/commit/5fc8e89)

2. **A game that has to teach itself must not smuggle in a tutorial.** The spec
   asks for a game a first-timer learns by playing, with no "press any key". My
   own narration had slipped instructional wording in without my noticing. Rather
   than trust myself to catch it by eye, I wrote a no-tutorial sensor that scans
   for control-instruction phrasings, and an affordance lock-step sensor that
   asserts every glowing noun has a closer look and every look glows. The
   no-tutorial sensor went red on my own prose on its first run, which is exactly
   the catch I wanted a machine to make; both guard every room now.
   [`6cda764`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Yimche/commit/6cda764)

3. **The opening screen invited nothing, and only watching it run showed me.**
   Read as code, the renderer looked fine. Mounting the real renderer and timing
   the load told a different story: the choices appeared only after two seconds
   of typewriter, so the first frame offered the player nothing to do. The fix
   was to paint the affordance before the intro types, and I made "the affordance
   ships in the first frame" a standing convention in `CLAUDE.md`. I verified it
   the same way I found it, by reloading and watching the pulsing first move sit
   on screen from frame one rather than reasoning about the code.
   [`f2631be`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Yimche/commit/f2631be)

4. **Death was the answer to every mistake; I made it earned.** The game had one
   thin corridor and killed the player at almost every fork, often in a single
   curt line. The obvious move was to soften the wording. Instead I reworked the
   contract: exactly three choices stay fatal so the spec's "it can be lost" still
   holds, all three now live in the deep half of the dungeon rather than a room
   from the start, each is told across several lines before the run ends, and the
   former death forks became survivable consequences (a fever carried out, a
   scramble across a rotten span, a robbery at the top). The map grew to four
   entrances that reconverge. I knew the balance held because the contract test
   "more than one wrong choice kills" stays green on the two deep deaths while new
   tests assert the early forks leave the run playing; the full suite is 37 green.
   The rework answered this prompt:

   > make the game bigger. more branches, have different entry points, different
   > routes, more options per decision [...] dont do a "the guardian woke up" and
   > then kill them immediately. elaborate. multiple lines of story.

   [`aa9b399...5d559a4`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit5-Yimche/compare/aa9b399...5d559a4)

## Before you ship

`pnpm check` runs the typecheck, the build, and the full suite (contract tests
plus the three sensors). `pnpm check:evidence` verifies the citations above
resolve before a marker opens the file.

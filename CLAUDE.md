# COMP4020 prototype

Your starter repo for a COMP4020 prototype: a static site in HTML/CSS/TypeScript
that builds to plain HTML/CSS/JS and deploys to GitHub Pages. The deployed site
is what gets marked, not this repo.

The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec, and this repo's name tells you
which deliverable applies. Read both before you plan or build.

## The link-preview card

`public/card.png` (1200x630) is the image a shared link shows; `index.html`'s
head points at it. Replace it and the `description` meta, and copy the head
block into any new page. The card URL resolves against the page that names it,
like any link, `./card.png` is wrong one directory down, and nothing in CI
checks it, so the deployed head is the only place a broken one shows up.

## The checks

`pnpm check` runs them, and `pnpm check:evidence` is the extra gate before you
ship. CI runs the same plus links, secrets and the deploy.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` are in this repo and
say what they are for.

## House style (no AI tells)

- **No em-dashes, en-dashes, or `--`. Anywhere.** Prose, code comments, commit
  messages, docs, this file. Use a comma, a semicolon, or a restructured
  sentence. This is Julian's standing preference; the `no banned dashes in
  prose` sensor enforces it for player-facing game text, and it applies by hand
  everywhere a sensor cannot reach.
- **Drop the other AI tells too.** No "not just X, but Y" scaffolding, no
  reflexive "it's worth noting", no hollow superlatives, no throat-clearing
  preambles. Write plainly and let the work carry itself.

## Working agreement

- **Commit when a series of instructions is done.** After completing a request
  (or a batch of them), commit the work before handing back, never leaving
  finished work sitting uncommitted. Prefer small, logical commits with messages
  that say what changed and why; reconstruct the honest build order when several
  landed together. This is standing authorization to commit.
- **Push is still yours.** Committing is automatic; pushing and flipping the repo
  public are deliberate acts left to Julian (they belong to `ship`). The repo
  stays private until the cutoff.

## This file is yours

A starting point, not a rulebook: what you add to it is the harness, and the
harness is assessed. This file and the sensors you wire into `check` carry
across the course; both come with you into next week's repo. The prototype
doesn't: source, and the tests answering this week's published spec, stay
behind. `spec/README.md` draws the line.

## Sensors accumulated (carry these forward)

Standards held whatever the brief is. They live in `spec/*.test.ts` and run with
`pnpm check`; when a week's source is left behind, lift the sensor blocks into
next week's repo.

- **no-tutorial prose** (crit-5): scans all player-facing game text for
  control-instruction phrasings ("press any key", "type the name", "how to
  play"). A game that has to teach itself must not smuggle a tutorial into its
  narration. It caught instructional wording in my own prose on the first run.
- **affordance lock-step** (crit-5): asserts every interactive marker in the
  content has a matching handler and vice versa (for Emberlight: every `{noun}`
  in room text is examinable, and every examinable noun glows). Guards against a
  hint that points at nothing, or a secret with no way in.
- **no banned dashes in prose** (crit-5): scans all player-facing text for
  em-dashes, en-dashes and double hyphens, and fails the build on any. A model
  reaches for the em-dash by reflex, so a machine catches it by reflex; the
  house style below is enforced automatically for game text this way.

## Conventions for an interactive prototype

- **Keep the rules pure.** Game/interaction logic goes in a DOM-free module
  (`game.ts`) that takes data and returns data; the DOM renderer (`main.ts`) is
  a thin shell over it. This is what makes "one rule under a focused test"
  a plain unit test with no browser.
- **Watch the finished thing run, don't just read it.** The opening-affordance
  fix this week came from mounting the real renderer and timing it, not from
  reading the code; the spec's "a change from playing" is a standing habit,
  not a one-off.
- **The affordance ships in the first frame.** Controls render before any
  typewriter or intro animation, never after it.

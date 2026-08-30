// The renderer: the only part of the game that touches the page. It turns the
// engine's plain data into a glowing terminal, and turns clicks, taps and
// typed words back into engine calls. No game rules live here.

import { EMBERLIGHT } from "./content.ts";
import { choose, examine, newGame, outcome, room, visibleChoices } from "./game.ts";
import type { GameState } from "./game.ts";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const scroll = must<HTMLDivElement>("#scroll");
const choicesEl = must<HTMLUListElement>("#choices");
const form = must<HTMLFormElement>("#prompt");
const input = must<HTMLInputElement>("#cmd");

let state: GameState = newGame(EMBERLIGHT);
let typing = false;
let skip = false;
let hasActed = false; // the opening move pulses until the player acts once

function must<T extends Element>(sel: string): T {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el;
}

/** Turn {noun} markers into glowing, clickable spans; escape everything else. */
function format(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{([^}]+)\}/g, (_m, word: string) => {
      const noun = word.toLowerCase();
      return `<button type="button" class="noun" data-noun="${noun}">${word}</button>`;
    });
}

/** Strip the {} markers to leave the plain text the typewriter types out. */
function plain(text: string): string {
  return text.replace(/\{([^}]+)\}/g, "$1");
}

function atBottom(): void {
  scroll.scrollTop = scroll.scrollHeight;
}

/** Type text into an element one character at a time; any input skips to full. */
async function typeInto(el: HTMLElement, text: string): Promise<void> {
  if (reduceMotion) {
    el.textContent = text;
    atBottom();
    return;
  }
  typing = true;
  skip = false;
  for (let i = 0; i < text.length; i++) {
    if (skip) {
      el.textContent = text;
      break;
    }
    el.textContent = text.slice(0, i + 1);
    atBottom();
    await sleep(8);
  }
  el.textContent = text;
  typing = false;
  atBottom();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function echo(line: string): void {
  const p = document.createElement("p");
  p.className = "echo";
  p.textContent = `> ${line}`;
  scroll.append(p);
  atBottom();
}

/** Append a narration line with the typewriter, then reveal any glowing nouns. */
async function say(text: string, cls = "say"): Promise<void> {
  const p = document.createElement("p");
  p.className = cls;
  scroll.append(p);
  await typeInto(p, plain(text));
  p.innerHTML = format(text);
}

/** Append a whole room: its title and its description. */
async function enterRoom(): Promise<void> {
  const r = room(EMBERLIGHT, state);
  const block = document.createElement("div");
  block.className = "room";
  const h = document.createElement("h2");
  h.textContent = r.title;
  const p = document.createElement("p");
  block.append(h, p);
  scroll.append(block);
  await typeInto(p, plain(r.text));
  p.innerHTML = format(r.text);
}

function renderChoices(): void {
  choicesEl.replaceChildren();

  if (state.status !== "playing") {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice again";
    btn.textContent = "▷  go down again";
    btn.addEventListener("click", restart);
    li.append(btn);
    choicesEl.append(li);
    btn.focus();
    return;
  }

  const choices = visibleChoices(EMBERLIGHT, state);
  choices.forEach((c, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.innerHTML = `<span class="key">${i + 1}</span> ${escapeHtml(c.label)}`;
    btn.dataset.id = c.id;
    btn.addEventListener("click", () => act(() => choose(EMBERLIGHT, state, c.id), c.label));
    li.append(btn);
    choicesEl.append(li);
  });

  // The opening screen's first move gets a pulse until the player acts once.
  if (!hasActed && choicesEl.firstElementChild) {
    choicesEl.firstElementChild.querySelector("button")?.classList.add("pulse");
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Run one engine step, print its output, and redraw. Guards against acting
 *  mid-typewriter (a keypress there just fast-forwards the text instead). */
async function act(step: () => { state: GameState; out: string[] }, label: string): Promise<void> {
  if (typing) {
    skip = true;
    return;
  }
  const prevRoom = state.roomId;
  const wasEnded = state.status !== "playing";
  if (wasEnded) return;

  hasActed = true; // the opening move has been made; stop pulsing it
  echo(label);
  const result = step();
  state = result.state;

  setControlsEnabled(false);
  for (const line of result.out) await say(line);
  if (state.status === "playing" && state.roomId !== prevRoom) await enterRoom();
  if (state.status !== "playing") await say(outcome(EMBERLIGHT, state), "ending");

  renderChoices();
  setControlsEnabled(true);
  if (finePointer && state.status === "playing") input.focus();
}

function setControlsEnabled(on: boolean): void {
  input.disabled = !on;
  for (const b of choicesEl.querySelectorAll("button")) b.disabled = !on;
}

function restart(): void {
  state = newGame(EMBERLIGHT);
  hasActed = false;
  scroll.replaceChildren();
  void start();
}

async function start(): Promise<void> {
  // Paint the affordance first: the pulsing first move is on screen from the
  // opening frame, while the room text types in above it.
  // (Found by watching the finished game load: the choices used to appear only
  // after two seconds of typing, so the opening screen invited nothing.)
  renderChoices();
  if (finePointer) input.focus();
  await enterRoom();
}

// Typed input: a bare number picks that choice, anything else looks closer.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value.trim();
  input.value = "";
  if (!value || typing || state.status !== "playing") {
    if (typing) skip = true;
    return;
  }
  const asNumber = /^\d+$/.test(value) ? Number.parseInt(value, 10) : NaN;
  const choices = visibleChoices(EMBERLIGHT, state);
  if (asNumber >= 1 && asNumber <= choices.length) {
    const c = choices[asNumber - 1];
    void act(() => choose(EMBERLIGHT, state, c.id), c.label);
  } else {
    void act(() => examine(EMBERLIGHT, state, value), value);
  }
});

// Clicking a glowing noun looks closer at it.
scroll.addEventListener("click", (e) => {
  const target = (e.target as HTMLElement).closest<HTMLElement>(".noun");
  if (!target) return;
  const noun = target.dataset.noun ?? "";
  void act(() => examine(EMBERLIGHT, state, noun), noun);
});

// Number keys work anywhere, so keyboard players never have to aim a mouse.
window.addEventListener("keydown", (e) => {
  if (e.target === input) return;
  if (typing) {
    skip = true;
    return;
  }
  if (/^[1-9]$/.test(e.key) && state.status === "playing") {
    const choices = visibleChoices(EMBERLIGHT, state);
    const idx = Number.parseInt(e.key, 10) - 1;
    if (idx < choices.length) {
      e.preventDefault();
      const c = choices[idx];
      void act(() => choose(EMBERLIGHT, state, c.id), c.label);
    }
  }
});

void start();

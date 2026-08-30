// The engine. Pure data-in, data-out: no DOM, no globals, no I/O. Everything
// the screen needs comes back as plain values, so the whole of the game's
// rules can be exercised from a test without a browser. The renderer in
// main.ts is the only part that touches the page.

export type Status = "playing" | "won" | "lost";

/** A single consequence of a choice or an examine, applied in order. */
export interface Effect {
  give?: string; // add an item to the pack
  take?: string; // remove an item from the pack
  flag?: string; // remember that something happened
  goto?: string; // move to another room
  end?: "won" | "lost"; // finish the game
  say?: string; // a line of narration to show
}

export interface Choice {
  id: string;
  label: string; // the menu line the player reads
  needsItem?: string; // hidden until this item is in the pack
  needsFlag?: string; // hidden until this flag is set
  hideFlag?: string; // hidden once this flag is set (spent, one-shot doors)
  effects: Effect[];
}

/** Something in the room the player can type the name of to look closer. */
export interface Lookable {
  noun: string; // the word the player types; also auto-highlighted in the text
  text: string; // what a closer look reveals
  effects?: Effect[]; // applied once, the first time it is examined
}

export interface Room {
  id: string;
  title: string;
  text: string; // room description; nouns matching looks[].noun are highlighted
  choices: Choice[];
  looks?: Lookable[];
  onEnter?: Effect[]; // effects applied the moment the player steps in
}

/** One graded ending. outcome() returns the first whose conditions all hold, so
 *  the story's many endings fall out of the flags and items you carry. Order
 *  matters: list the most specific (and the best) first. */
export interface Ending {
  id: string;
  status: "won" | "lost";
  needFlags?: string[]; // every one must be set
  blockFlags?: string[]; // none may be set
  needItems?: string[]; // every one must be in the pack
  text: string;
}

export interface Dungeon {
  start: string;
  rooms: Record<string, Room>;
  endings: Ending[];
}

export interface GameState {
  roomId: string;
  inventory: string[];
  flags: string[];
  status: Status;
  ending: string; // the closing line set at the moment the game ends
}

/** What a step hands back to the renderer: the new state and the lines to show. */
export interface StepResult {
  state: GameState;
  out: string[];
}

export function newGame(d: Dungeon): GameState {
  return {
    roomId: d.start,
    inventory: [],
    flags: [],
    status: "playing",
    ending: "",
  };
}

export function room(d: Dungeon, s: GameState): Room {
  const r = d.rooms[s.roomId];
  if (!r) throw new Error(`no room "${s.roomId}"`);
  return r;
}

/** The choices the player may actually see right now, gates resolved. */
export function visibleChoices(d: Dungeon, s: GameState): Choice[] {
  if (s.status !== "playing") return [];
  return room(d, s).choices.filter((c) => {
    if (c.needsItem && !s.inventory.includes(c.needsItem)) return false;
    if (c.needsFlag && !s.flags.includes(c.needsFlag)) return false;
    if (c.hideFlag && s.flags.includes(c.hideFlag)) return false;
    return true;
  });
}

function clone(s: GameState): GameState {
  return {
    ...s,
    inventory: [...s.inventory],
    flags: [...s.flags],
  };
}

function apply(d: Dungeon, s: GameState, effects: Effect[], out: string[]): void {
  for (const e of effects) {
    if (e.say) out.push(e.say);
    if (e.give && !s.inventory.includes(e.give)) s.inventory.push(e.give);
    if (e.take) s.inventory = s.inventory.filter((i) => i !== e.take);
    if (e.flag && !s.flags.includes(e.flag)) s.flags.push(e.flag);
    if (e.goto) {
      s.roomId = e.goto;
      const entered = d.rooms[e.goto];
      if (entered?.onEnter) apply(d, s, entered.onEnter, out);
    }
    if (e.end) {
      s.status = e.end;
      if (e.say) s.ending = e.say;
    }
  }
}

/** The player picks a menu choice. Returns the next state and lines to show. */
export function choose(d: Dungeon, s: GameState, choiceId: string): StepResult {
  const out: string[] = [];
  if (s.status !== "playing") return { state: s, out };

  const choice = visibleChoices(d, s).find((c) => c.id === choiceId);
  if (!choice) return { state: s, out: ["That way is closed to you."] };

  const next = clone(s);
  apply(d, next, choice.effects, out);
  return { state: next, out };
}

/** The player types the name of something to look closer. */
export function examine(d: Dungeon, s: GameState, noun: string): StepResult {
  const out: string[] = [];
  if (s.status !== "playing") return { state: s, out };

  const want = noun.trim().toLowerCase();
  const look = room(d, s).looks?.find((l) => l.noun.toLowerCase() === want);
  if (!look) {
    return { state: s, out: [`There is no ${want || "..."} here worth your gaze.`] };
  }

  const next = clone(s);
  out.push(look.text);
  const seen = `looked:${s.roomId}:${look.noun}`;
  if (look.effects && !next.flags.includes(seen)) {
    next.flags.push(seen);
    apply(d, next, look.effects, out);
  }
  return { state: next, out };
}

/** Grade the ending. Returns the first ending whose conditions all hold against
 *  the final state, falling back to the closing line the step itself set. */
export function outcome(d: Dungeon, s: GameState): string {
  if (s.status === "playing") return "";
  for (const e of d.endings) {
    if (e.status !== s.status) continue;
    if (e.needFlags && !e.needFlags.every((f) => s.flags.includes(f))) continue;
    if (e.blockFlags && e.blockFlags.some((f) => s.flags.includes(f))) continue;
    if (e.needItems && !e.needItems.every((i) => s.inventory.includes(i))) continue;
    return e.text;
  }
  return s.ending;
}

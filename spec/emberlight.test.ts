import { describe, expect, it } from "vitest";
import { EMBERLIGHT } from "../content.ts";
import { choose, examine, newGame, outcome, visibleChoices } from "../game.ts";
import type { GameState } from "../game.ts";

// Drive the game the way the screen does: pick a menu choice by its id, or look
// closer at a noun. These let a test play the game end to end.
function pick(s: GameState, id: string): GameState {
  const choice = visibleChoices(EMBERLIGHT, s).find((c) => c.id === id);
  if (!choice) throw new Error(`choice "${id}" is not available in ${s.roomId}`);
  return choose(EMBERLIGHT, s, id).state;
}

function look(s: GameState, noun: string): GameState {
  return examine(EMBERLIGHT, s, noun).state;
}

// ---------------------------------------------------------------------------
// The one rule under a focused test (spec: "one rule of the game has a focused
// automated test"). The rule: moving spends light, and when the light reaches
// zero the dark takes you, and the game is lost.
// ---------------------------------------------------------------------------
describe("the light is your life", () => {
  it("spends light when you move", () => {
    let s = newGame(EMBERLIGHT);
    const before = s.light;
    s = pick(s, "take_torch"); // +6
    s = pick(s, "push_door"); // costs 1
    expect(s.light).toBe(before + 6 - 1);
  });

  it("ends the game the moment the last ember dies", () => {
    // Walk out without taking the torch: 3 embers, and the descent to the
    // catacombs alone costs enough to spend them.
    let s = newGame(EMBERLIGHT); // light 3
    s = pick(s, "push_door"); // -1 -> 2, corridor
    s = pick(s, "descend"); // -2 -> 0, the dark
    expect(s.status).toBe("lost");
    expect(s.light).toBe(0);
    expect(s.ending).toBe(EMBERLIGHT.darkDeath);
  });

  it("never lets a refill push the torch past its cap", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "take_torch"); // 9
    s = look(s, "straw"); // +1 -> 10 (order here is just to accumulate)
    // Repeatedly pouring oil can't exceed maxLight.
    for (let i = 0; i < 10; i++) s = { ...s, light: Math.min(s.maxLight, s.light + 3) };
    expect(s.light).toBeLessThanOrEqual(EMBERLIGHT.maxLight);
  });
});

// ---------------------------------------------------------------------------
// Contract tests for this week's spec. They retire with the brief.
// ---------------------------------------------------------------------------
describe("spec: it can be lost", () => {
  it("a wrong move ends in death", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "take_torch");
    s = pick(s, "push_door");
    s = pick(s, "to_chamber");
    s = pick(s, "drink_pool"); // the pool was never water
    expect(s.status).toBe("lost");
  });
});

describe("spec: a stranger can reach an ending", () => {
  it("wins pressing numbers only, no examining required", () => {
    // The only inputs here are menu choices: no look() calls at all. This is
    // the path a first-timer finds by pressing keys, and it must reach an end.
    let s = newGame(EMBERLIGHT);
    s = pick(s, "take_torch");
    s = pick(s, "push_door");
    s = pick(s, "descend");
    // No key (never examined the guard), so the gate is not even offered.
    expect(visibleChoices(EMBERLIGHT, s).some((c) => c.id === "open_gate")).toBe(false);
    s = pick(s, "crawl_tunnel");
    s = pick(s, "climb_out");
    expect(s.status).toBe("won");
    expect(s.light).toBeGreaterThan(0);
  });

  it("the opening screen always offers a first move", () => {
    const s = newGame(EMBERLIGHT);
    expect(visibleChoices(EMBERLIGHT, s).length).toBeGreaterThan(0);
  });
});

describe("depth: mastering the examine layer earns the best ending", () => {
  it("the key, the amulet and every cache lead to the richest escape", () => {
    let s = newGame(EMBERLIGHT);
    s = look(s, "straw"); // +1 cache
    s = pick(s, "take_torch");
    s = pick(s, "push_door");
    s = pick(s, "to_guardroom");
    s = look(s, "guard"); // the iron key
    s = pick(s, "take_oil"); // +3
    s = pick(s, "guard_back");
    s = pick(s, "to_chamber");
    s = look(s, "well"); // reveals the climb
    s = pick(s, "climb_well");
    s = pick(s, "take_amulet");
    s = pick(s, "vault_up");
    s = pick(s, "chamber_back");
    s = pick(s, "descend");
    s = look(s, "bones"); // +2 cache
    s = pick(s, "open_gate"); // the honest way, opened with the key
    s = pick(s, "climb_out");
    expect(s.status).toBe("won");
    expect(s.inventory).toContain("amulet");
    expect(s.light).toBeGreaterThanOrEqual(4);
    expect(outcome(s)).toMatch(/mastered/i);
  });
});

// ---------------------------------------------------------------------------
// Sensors: standards the game must hold whatever the story is. These are
// harness; they come forward to next week's repo like a rule in CLAUDE.md.
// ---------------------------------------------------------------------------
function allProse(): string[] {
  const out: string[] = [EMBERLIGHT.darkDeath];
  for (const r of Object.values(EMBERLIGHT.rooms)) {
    out.push(r.title, r.text);
    for (const c of r.choices) {
      out.push(c.label);
      for (const e of c.effects) if (e.say) out.push(e.say);
    }
    for (const l of r.looks ?? []) {
      out.push(l.text);
      for (const e of l.effects ?? []) if (e.say) out.push(e.say);
    }
  }
  return out;
}

describe("sensor: the game teaches itself, with no instructions", () => {
  // The no-tutorial rule can't be fully tested, but the failure mode it guards
  // against, control instructions leaking into the prose, can be.
  // Target the canonical control-tutorial phrasings, not the verbs in general:
  // "press any key" leaks, "you press it to the torch" does not.
  const banned = new RegExp(
    [
      /\b(press|tap|hit|click)\b[^.]{0,20}\b(key|keys|button|space|enter|return|start|arrow|arrows|number|any)\b/,
      /\btype\b[^.]{0,12}\b(name|number|word|command|the|a)\b/,
      /\bhow to play\b|\btutorial\b|\binstructions?\b/,
      /\buse the\b[^.]{0,12}\b(mouse|keyboard|arrow|arrows|buttons?)\b/,
    ]
      .map((r) => r.source)
      .join("|"),
    "i",
  );
  it("no control instructions appear in any game text", () => {
    for (const text of allProse()) {
      expect(banned.test(text), `instructional text leaked: "${text}"`).toBe(false);
    }
  });
});

describe("sensor: every glowing noun is examinable, and every examinable glows", () => {
  it("keeps room markup and lookables in lock-step", () => {
    for (const r of Object.values(EMBERLIGHT.rooms)) {
      const marked = [...r.text.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].toLowerCase());
      const looks = (r.looks ?? []).map((l) => l.noun.toLowerCase());
      for (const noun of marked) {
        expect(looks, `${r.id}: {${noun}} has no lookable`).toContain(noun);
      }
      for (const noun of looks) {
        expect(marked, `${r.id}: "${noun}" is examinable but never glows`).toContain(noun);
      }
    }
  });
});

describe("sensor: the prose keeps its own voice, free of AI tells", () => {
  // The house style forbids the em-dash and its typewritten stand-ins. A model
  // reaches for them by reflex, so a machine should catch them by reflex too:
  // any em-dash, en-dash, or double hyphen in player-facing text fails here.
  // Rewrite with a comma, a semicolon, or a full stop instead.
  const dashes = /[—–]|--/;
  it("no em-dashes, en-dashes or double hyphens in any game text", () => {
    for (const text of allProse()) {
      expect(dashes.test(text), `a banned dash leaked: "${text}"`).toBe(false);
    }
  });
});

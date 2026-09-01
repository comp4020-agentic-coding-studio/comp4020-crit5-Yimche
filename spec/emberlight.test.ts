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

// The spine of the descent, choices only, from the seal down to the reliquary.
// Several tests start here and then diverge on what to do with the Heart.
function descendToReliquary(): GameState {
  let s = newGame(EMBERLIGHT);
  s = pick(s, "enter_seal"); // approach -> narthex (the guild rope)
  s = pick(s, "press_on"); // narthex -> refectory
  s = pick(s, "to_dormitory"); // refectory -> dormitory
  s = pick(s, "to_bridge"); // dormitory -> bridge
  s = pick(s, "edge_across"); // bridge -> warren_hub (the safe crossing)
  s = pick(s, "go_down"); // warren_hub -> deep_cistern
  s = pick(s, "to_oratory"); // deep_cistern -> oratory
  s = pick(s, "work_mechanism"); // oratory -> antechamber (the patient way)
  s = pick(s, "slip_past"); // antechamber -> reliquary (past the guardian)
  return s;
}

// ---------------------------------------------------------------------------
// The one rule under a focused test (spec: "one rule of the game has a focused
// automated test"). The rule: a fatal choice ends the run, then and there, as
// lost. Death is never a meter running out; it is a specific choice, made, and
// it lives deep in the dungeon, never a room or two from the start.
// ---------------------------------------------------------------------------
describe("a fatal choice ends the run", () => {
  it("drinking the deep wellspring is death", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "press_on");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "go_down"); // down to the deep cistern
    expect(s.status).toBe("playing");
    s = pick(s, "drink_deep"); // the wellspring was never water
    expect(s.status).toBe("lost");
  });

  it("a lost run offers no further moves", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "press_on");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "go_down");
    s = pick(s, "drink_deep");
    expect(visibleChoices(EMBERLIGHT, s)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Contract tests for this week's spec. They retire with the brief.
// ---------------------------------------------------------------------------
describe("spec: it can be lost", () => {
  it("more than one wrong choice kills", () => {
    // Death is scattered through the deep of the game, not gated behind one trap.
    const fatal: Array<() => GameState> = [
      () => {
        let s = descendToReliquary();
        s = pick(s, "back_antechamber");
        return pick(s, "wake_guardian"); // rouse the sleeping guardian
      },
      () => {
        let s = newGame(EMBERLIGHT);
        s = pick(s, "enter_seal");
        s = pick(s, "press_on");
        s = pick(s, "to_dormitory");
        s = pick(s, "to_bridge");
        s = pick(s, "edge_across");
        s = pick(s, "go_down");
        return pick(s, "pull_chain"); // ring for the thing below
      },
    ];
    for (const run of fatal) expect(run().status).toBe("lost");
  });
});

describe("spec: a stranger can reach an ending", () => {
  it("reaches an ending pressing numbers only, no examining required", () => {
    // Not one look() call: this is the path a first-timer finds by pressing
    // keys, and it must carry them all the way to an ending.
    let s = descendToReliquary();
    s = pick(s, "take_heart");
    s = pick(s, "to_threshold");
    s = pick(s, "ascend");
    s = pick(s, "climb_out");
    expect(s.status).toBe("won");
    expect(outcome(EMBERLIGHT, s)).not.toBe("");
  });

  it("the opening screen always offers a first move", () => {
    const s = newGame(EMBERLIGHT);
    expect(visibleChoices(EMBERLIGHT, s).length).toBeGreaterThan(0);
  });
});

describe("spec: four ways lead into the priory", () => {
  it("every entrance reaches the flooded warren", () => {
    // The seal, the drain, the well and the belfry each open a different route,
    // and all four routes reconverge on the warren hub.
    const routes: Array<[string, (s: GameState) => GameState]> = [
      ["seal", (s) => {
        s = pick(s, "enter_seal");
        s = pick(s, "press_on");
        s = pick(s, "to_dormitory");
        s = pick(s, "to_bridge");
        return pick(s, "edge_across");
      }],
      ["drain", (s) => {
        s = pick(s, "enter_drain"); // -> sluice
        return pick(s, "sluice_hub");
      }],
      ["well", (s) => {
        s = pick(s, "enter_well"); // -> crypt
        return pick(s, "crypt_hub");
      }],
      ["belfry", (s) => {
        s = pick(s, "enter_belfry"); // -> belfry
        s = pick(s, "ride_rope"); // -> flooded_nave
        return pick(s, "back_hub_nave");
      }],
    ];
    for (const [name, walk] of routes) {
      const s = walk(newGame(EMBERLIGHT));
      expect(s.roomId, `the ${name} entrance`).toBe("warren_hub");
    }
  });
});

describe("spec: a wrong turn need not be a grave", () => {
  it("the survivable forks leave you still playing", () => {
    // The rotten span: a board goes, you scramble, you live and reach the warren.
    let span = newGame(EMBERLIGHT);
    span = pick(span, "enter_seal");
    span = pick(span, "press_on");
    span = pick(span, "to_dormitory");
    span = pick(span, "to_bridge");
    span = pick(span, "stride_across");
    expect(span.status).toBe("playing");
    expect(span.roomId).toBe("warren_hub");

    // The shrouded sister: you breathe old air and carry a fever, but you live.
    let fever = newGame(EMBERLIGHT);
    fever = pick(fever, "enter_seal");
    fever = pick(fever, "press_on");
    fever = pick(fever, "to_dormitory");
    fever = pick(fever, "open_cell");
    fever = pick(fever, "touch_shape");
    expect(fever.status).toBe("playing");
    expect(fever.flags).toContain("feverish");

    // Harrow's grip: he closes hard, you tear free into the pews; he leaves,
    // and comes to collect higher up.
    let harrow = newGame(EMBERLIGHT);
    harrow = pick(harrow, "enter_seal");
    harrow = pick(harrow, "press_on");
    harrow = pick(harrow, "to_dormitory");
    harrow = pick(harrow, "to_bridge");
    harrow = pick(harrow, "edge_across");
    harrow = pick(harrow, "to_nave");
    harrow = pick(harrow, "clasp_hand");
    expect(harrow.status).toBe("playing");
    expect(harrow.flags).toContain("harrow_hostile");
  });

  it("forcing the oratory gate is a near miss, not a death", () => {
    let s = descendToReliquary();
    s = pick(s, "back_antechamber"); // reliquary -> antechamber
    s = pick(s, "back_oratory"); // antechamber -> oratory
    s = pick(s, "force_mechanism");
    expect(s.status).toBe("playing");
    expect(s.roomId).toBe("oratory");
    // The gate has not moved: the patient way is still there to be worked.
    expect(visibleChoices(EMBERLIGHT, s).map((c) => c.id)).toContain("work_mechanism");
  });
});

describe("spec: several ways lead down to the deep", () => {
  it("the crypt bone stair is an alternate descent", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_well"); // straight into the crypt
    s = pick(s, "crypt_descend"); // the ossuary bone stair
    expect(s.roomId).toBe("deep_cistern");
  });

  it("freeing Sister Aume opens her service passage to the oratory", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_drain"); // -> sluice
    s = pick(s, "sluice_hub"); // -> warren_hub
    s = pick(s, "to_scriptorium");
    s = pick(s, "answer_voice"); // learn who she is
    s = pick(s, "free_aume"); // break the wall
    s = pick(s, "aume_passage"); // her passage down
    expect(s.roomId).toBe("oratory");
    expect(s.flags).toContain("aume_freed");
  });
});

describe("spec: exploration pays off with items", () => {
  it("the sacrist's keys open the oratory gate without risk", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "to_chapter");
    s = pick(s, "force_aumbry"); // take the keys
    expect(s.inventory).toContain("keys");
    s = pick(s, "chapter_to_refectory");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "go_down");
    s = pick(s, "to_oratory");
    // The keyed unlock is only offered because the keys are in the pack.
    expect(visibleChoices(EMBERLIGHT, s).map((c) => c.id)).toContain("unlock_gate");
    s = pick(s, "unlock_gate");
    expect(s.roomId).toBe("antechamber");
  });

  it("the kitchen knife lets you face down Harrow without a struggle", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "press_on");
    s = pick(s, "to_kitchen");
    s = pick(s, "take_blade"); // the boning knife
    expect(s.inventory).toContain("knife");
    s = pick(s, "kitchen_back");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "to_nave");
    // Showing the blade is only offered because the knife is in the pack.
    expect(visibleChoices(EMBERLIGHT, s).map((c) => c.id)).toContain("show_blade");
    s = pick(s, "show_blade");
    expect(s.status).toBe("playing");
    expect(s.flags).toContain("harrow_gone");
    expect(s.flags).not.toContain("harrow_hostile");
  });
});

describe("spec: what you do with the Heart changes the ending", () => {
  it("delivering it and destroying it reach different endings", () => {
    // Deliver: carry the Heart up untouched.
    let delivered = descendToReliquary();
    delivered = pick(delivered, "take_heart");
    delivered = pick(delivered, "to_threshold");
    delivered = pick(delivered, "ascend");
    delivered = pick(delivered, "climb_out");

    // Destroy: cast it into the furnace on the way up.
    let destroyed = descendToReliquary();
    destroyed = pick(destroyed, "take_heart");
    destroyed = pick(destroyed, "to_threshold");
    destroyed = pick(destroyed, "cast_heart");
    destroyed = pick(destroyed, "ascend");
    destroyed = pick(destroyed, "climb_out");

    expect(delivered.status).toBe("won");
    expect(destroyed.status).toBe("won");
    expect(outcome(EMBERLIGHT, delivered)).not.toBe(outcome(EMBERLIGHT, destroyed));
  });

  it("carrying the Heart out past a hostile Harrow gets you waylaid", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "press_on");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "to_nave");
    s = pick(s, "clasp_hand"); // makes Harrow hostile
    s = pick(s, "back_hub_nave");
    s = pick(s, "go_down");
    s = pick(s, "to_oratory");
    s = pick(s, "work_mechanism");
    s = pick(s, "slip_past");
    s = pick(s, "take_heart");
    s = pick(s, "to_threshold");
    s = pick(s, "ascend");
    s = pick(s, "climb_out");
    expect(s.status).toBe("won");
    expect(outcome(EMBERLIGHT, s)).toBe(
      EMBERLIGHT.endings.find((e) => e.id === "waylaid")?.text,
    );
  });

  it("a fever carried out of the priory colours the ending", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    s = pick(s, "press_on");
    s = pick(s, "to_dormitory");
    s = pick(s, "open_cell");
    s = pick(s, "touch_shape"); // catch the fever
    s = pick(s, "leave_ward");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    s = pick(s, "go_down");
    s = pick(s, "to_oratory");
    s = pick(s, "work_mechanism");
    s = pick(s, "slip_past");
    s = pick(s, "take_heart");
    s = pick(s, "to_threshold");
    s = pick(s, "ascend");
    s = pick(s, "climb_out");
    expect(s.status).toBe("won");
    expect(s.flags).toContain("feverish");
    expect(outcome(EMBERLIGHT, s)).toBe(
      EMBERLIGHT.endings.find((e) => e.id === "fever_carried")?.text,
    );
  });
});

describe("depth: mastering the examine layer earns the best ending", () => {
  it("the truth, the freed sister and the saved child reach the richest end", () => {
    let s = newGame(EMBERLIGHT);
    s = pick(s, "enter_seal");
    // Find and keep the child (the alcove hides them; looking reveals them).
    s = look(s, "alcove");
    s = pick(s, "take_child");
    s = pick(s, "press_on");
    s = pick(s, "to_dormitory");
    s = pick(s, "to_bridge");
    s = pick(s, "edge_across");
    // Free Sister Aume and learn what the Heart really is.
    s = pick(s, "to_scriptorium");
    s = look(s, "slot");
    s = pick(s, "free_aume");
    s = pick(s, "listen_aume");
    s = pick(s, "back_hub_scriptorium");
    // Down to the reliquary and take the Heart.
    s = pick(s, "go_down");
    s = pick(s, "to_oratory");
    s = pick(s, "work_mechanism");
    s = pick(s, "slip_past");
    s = pick(s, "take_heart");
    // Destroy it, and climb out with the child.
    s = pick(s, "to_threshold");
    s = pick(s, "cast_heart");
    s = pick(s, "ascend");
    s = pick(s, "climb_out");

    expect(s.status).toBe("won");
    expect(s.flags).toContain("knows_truth");
    expect(s.flags).toContain("wick_with");
    expect(s.flags).toContain("heart_destroyed");
    expect(s.flags).not.toContain("feverish");
    expect(outcome(EMBERLIGHT, s)).toBe(
      EMBERLIGHT.endings.find((e) => e.id === "ash_scattered")?.text,
    );
  });
});

// ---------------------------------------------------------------------------
// Sensors: standards the game must hold whatever the story is. These are
// harness; they come forward to next week's repo like a rule in CLAUDE.md.
// ---------------------------------------------------------------------------
function allProse(): string[] {
  const out: string[] = [];
  for (const e of EMBERLIGHT.endings) out.push(e.text);
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
    for (const e of r.onEnter ?? []) if (e.say) out.push(e.say);
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

describe("sensor: every goto points at a real room", () => {
  // A redesign this size is easy to wire wrong. Any goto, and the dungeon's
  // start, must name a room that actually exists.
  it("no choice, look or entry leads to a room that isn't there", () => {
    const ids = new Set(Object.keys(EMBERLIGHT.rooms));
    expect(ids.has(EMBERLIGHT.start), `start "${EMBERLIGHT.start}" is missing`).toBe(true);
    const gotos: Array<[string, string]> = [];
    for (const r of Object.values(EMBERLIGHT.rooms)) {
      const effects = [
        ...r.choices.flatMap((c) => c.effects),
        ...(r.looks ?? []).flatMap((l) => l.effects ?? []),
        ...(r.onEnter ?? []),
      ];
      for (const e of effects) if (e.goto) gotos.push([r.id, e.goto]);
    }
    for (const [from, to] of gotos) {
      expect(ids.has(to), `${from} leads to missing room "${to}"`).toBe(true);
    }
  });
});

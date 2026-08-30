// The dungeon. All the game's words and rules live here as data; game.ts knows
// nothing about torches or amulets. Balance note, kept honest against the
// engine: a player who only ever presses numbers escapes with ~2 embers to
// spare (the grim ending). The good endings are locked behind examining the
// highlighted nouns — that is the "difficult to master" half. The best ending
// needs every hidden cache (straw, oil, bones), so it rewards a player who has
// learned to look at everything.

import type { Dungeon } from "./game.ts";

export const EMBERLIGHT: Dungeon = {
  start: "cell",
  startLight: 3,
  maxLight: 12,
  darkDeath:
    "Your torch shivers, shrinks to a single bead of orange, and dies. The dark that was always waiting closes over you without a sound.",

  rooms: {
    cell: {
      id: "cell",
      title: "A cold cell",
      text: "You wake on cold stone with the taste of iron in your mouth. A single {torch} still burns in a wall bracket, throwing long shadows. The only way out is a heavy iron {door}, hanging a hand's width ajar. Damp {straw} rots in the corner.",
      looks: [
        {
          noun: "torch",
          text: "Pitch-soaked and fierce — the one warm thing in this place. It will not burn on the wall forever.",
        },
        {
          noun: "door",
          text: "Solid iron, but the bolt is snapped. It gives when you lean on it.",
        },
        {
          noun: "straw",
          text: "Filthy bedding. Tucked beneath it, a forgotten stub of tallow candle. You tuck it against the torch and the flame drinks it gladly.",
          effects: [{ light: 1 }],
        },
      ],
      choices: [
        {
          id: "take_torch",
          label: "take the torch from the bracket",
          hideFlag: "has_torch",
          effects: [
            { give: "torch" },
            { light: 6 },
            { flag: "has_torch" },
            { say: "You lift the torch free of the bracket. The dark leans back from you." },
          ],
        },
        {
          id: "push_door",
          label: "push through the iron door",
          cost: 1,
          effects: [{ goto: "corridor" }],
        },
      ],
    },

    corridor: {
      id: "corridor",
      title: "A ribbed corridor",
      text: "A low corridor runs beneath old stone {arches}. To one side a {guardroom} stands with its door kicked in; to the other, a round {chamber} breathes cold, wet air. Ahead, worn {stairs} spiral down into a deeper dark.",
      looks: [
        {
          noun: "arches",
          text: "Faded paint across the stone: rows of figures walking down, and down, and never once a figure walking back up.",
        },
        {
          noun: "guardroom",
          text: "Through the broken door: a fallen shape in rusted armour, and a rack of ruined weapons.",
        },
        {
          noun: "chamber",
          text: "A round room, and the smell of old standing water rolling out of it.",
        },
        {
          noun: "stairs",
          text: "They fall away steeply. Whatever light you carry down there, you will carry less of it back.",
        },
      ],
      choices: [
        {
          id: "to_guardroom",
          label: "search the guardroom",
          cost: 1,
          effects: [{ goto: "guardroom" }],
        },
        {
          id: "to_chamber",
          label: "step into the round chamber",
          cost: 1,
          effects: [{ goto: "well_room" }],
        },
        {
          id: "descend",
          label: "descend the spiral stairs",
          cost: 2,
          effects: [{ goto: "catacombs" }],
        },
      ],
    },

    guardroom: {
      id: "guardroom",
      title: "The guardroom",
      text: "A dead {guard} slumps against the wall, his armour rusted to his bones. A {rack} of rotted weapons leans beside him, and a low {sconce} still cradles a flask of lamp oil.",
      looks: [
        {
          noun: "guard",
          text: "His hand is locked around a heavy iron key, as though he died refusing to let it go. You work it free.",
          effects: [{ give: "key" }],
        },
        {
          noun: "rack",
          text: "Rust and rot. The best blade here would snap on its first honest swing. Leave it.",
        },
        {
          noun: "sconce",
          text: "The oil flask is still half full, and still good.",
        },
      ],
      choices: [
        {
          id: "take_oil",
          label: "pour the oil flask onto your torch",
          hideFlag: "oil_taken",
          effects: [
            { light: 3 },
            { flag: "oil_taken" },
            { say: "The flame swells up bright and greedy, and holds." },
          ],
        },
        {
          id: "guard_back",
          label: "back to the corridor",
          cost: 1,
          effects: [{ goto: "corridor" }],
        },
      ],
    },

    well_room: {
      id: "well_room",
      title: "The round chamber",
      text: "A black {well} yawns at the heart of the room, a frayed {rope} still knotted to its rim. A still {pool} of dark water has spread across the floor — and though your torch burns right above it, it throws back no reflection at all.",
      looks: [
        {
          noun: "well",
          text: "The shaft drops away beyond the reach of your light. You test the rope against your weight; the old knots hold. You could climb down, if you dared.",
          effects: [{ flag: "rope_ready" }],
        },
        {
          noun: "rope",
          text: "Frayed but sound. Knotted for climbing, by someone who meant to come back up.",
          effects: [{ flag: "rope_ready" }],
        },
        {
          noun: "pool",
          text: "Not water. Something thicker, that swallows the light and gives nothing back. Whatever it is, it was never meant for drinking.",
        },
      ],
      choices: [
        {
          id: "drink_pool",
          label: "kneel and drink from the pool",
          effects: [
            {
              say: "The dark water is cold, then colder, then everywhere at once. It was never water.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "climb_well",
          label: "climb down the rope into the shaft",
          cost: 1,
          needsFlag: "rope_ready",
          effects: [{ goto: "vault" }],
        },
        {
          id: "chamber_back",
          label: "back to the corridor",
          cost: 1,
          effects: [{ goto: "corridor" }],
        },
      ],
    },

    vault: {
      id: "vault",
      title: "A dry vault",
      text: "The rope ends in a dry, close vault. On a stone pedestal a single {amulet} burns with its own cold light. Against the far wall something vast and scaled — a {beast} — sleeps, its slow breath stirring the dust.",
      looks: [
        {
          noun: "amulet",
          text: "Older than the dungeon, older maybe than the dark. It hums faintly as your hand nears it.",
        },
        {
          noun: "beast",
          text: "Coiled and immense, one lantern eye a slit. It has not woken. Whatever you do here, do it quietly.",
        },
      ],
      choices: [
        {
          id: "take_amulet",
          label: "lift the amulet from the pedestal",
          hideFlag: "has_amulet",
          effects: [
            { give: "amulet" },
            { flag: "has_amulet" },
            {
              say: "You lift it. The beast's breath catches — the vault holds still — then it sighs and settles. It is yours.",
            },
          ],
        },
        {
          id: "strike_beast",
          label: "drive your torch into the sleeping beast",
          effects: [
            {
              say: "It wakes all at once. The last thing you see is its eye drowning your little light, and then not even that.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "vault_up",
          label: "climb back up the rope",
          cost: 1,
          effects: [{ goto: "well_room" }],
        },
      ],
    },

    catacombs: {
      id: "catacombs",
      title: "The catacombs",
      text: "The stairs let out into a bone-cramped catacomb. A locked iron {gate} bars the only way up and out; beside it, a black {tunnel} bores away through the rock. {Bones} are stacked to the ceiling, and every skull is turned to face the gate.",
      looks: [
        {
          noun: "gate",
          text: "Barred and locked from the far side. It will not move without an iron key.",
        },
        {
          noun: "tunnel",
          text: "A crawlspace, long and utterly lightless. It goes up, eventually — but it will eat a great deal of your torch to cross it.",
        },
        {
          noun: "bones",
          text: "Hundreds of them, all facing the gate — they died waiting for the honest way to open. One climber's hand still grips an unspilled flask of oil. You take it; they have no more use for light.",
          effects: [{ light: 2 }],
        },
      ],
      choices: [
        {
          id: "open_gate",
          label: "unlock the iron gate",
          cost: 1,
          needsItem: "key",
          effects: [{ goto: "exit" }],
        },
        {
          id: "crawl_tunnel",
          label: "crawl into the black tunnel",
          cost: 3,
          effects: [
            { goto: "exit" },
            { say: "You crawl for a long, blind time. It costs you dearly — but it ends." },
          ],
        },
        {
          id: "catacombs_back",
          label: "climb back up the stairs",
          cost: 2,
          effects: [{ goto: "corridor" }],
        },
      ],
    },

    exit: {
      id: "exit",
      title: "The way out",
      text: "The passage rises. Far above, a ragged grey {light} bleeds down the steps — not torchlight, not fire. Dawn. The way out.",
      looks: [
        {
          noun: "light",
          text: "Real daylight, cold and enormous and free. You had almost forgotten it existed.",
        },
      ],
      choices: [
        {
          id: "climb_out",
          label: "climb up toward the daylight",
          effects: [{ end: "won" }],
        },
      ],
    },
  },
};

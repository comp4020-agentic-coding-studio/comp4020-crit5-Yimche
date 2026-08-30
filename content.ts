// The dungeon. All the game's words and rules live here as data; game.ts knows
// nothing about the Coalheart or Sister Aume. The danger is never a meter: it
// is the choices themselves, a black cistern that was never water, a plank that
// was never sound, a hand that was never a friend's. The story's many endings
// fall out of what you carry up and who you bring with you, graded by the
// endings table below. A player who only ever presses numbers still reaches an
// ending; the deeper story, the truth of the Heart and the people down here,
// waits behind the highlighted nouns for a player who has learned to look.

import type { Dungeon } from "./game.ts";

export const EMBERLIGHT: Dungeon = {
  start: "seal",

  endings: [
    {
      id: "ash_scattered",
      status: "won",
      needFlags: ["heart_destroyed", "knows_truth", "wick_with"],
      text: "You cast the last of the Coalheart into the cold and it goes out for good, and the fever it would have carried up into the city dies here with it. Wick's small hand stays in yours the whole long climb. You come up into a grey, ordinary dawn together, poorer than you went down and cleaner than you have ever been.",
    },
    {
      id: "quiet_mercy",
      status: "won",
      needFlags: ["heart_destroyed"],
      text: "You give the Coalheart back to the dark that made it, and feel the priory let go of a breath it had held for a hundred years. No relic, no reward, no one to tell. You climb into the morning alone, and let that be enough.",
    },
    {
      id: "false_saviour",
      status: "won",
      needFlags: ["heart_taken", "knows_truth"],
      blockFlags: ["heart_destroyed"],
      text: "You carry the Coalheart up knowing exactly what it is. The guild pays you in full, the hearths of the city catch and flare, and you are careful never to be anywhere near them on the night they begin to burn from the inside.",
    },
    {
      id: "bargain_kept",
      status: "won",
      needFlags: ["heart_taken"],
      blockFlags: ["heart_destroyed"],
      text: "You deliver the Coalheart as you were sent to, and take your pay, and sleep well for a while. The hearths relight across the city that same week. It is some months before anyone thinks to connect the new fever to the old fire, and by then you are a long way off.",
    },
    {
      id: "child_saved",
      status: "won",
      needFlags: ["wick_with"],
      blockFlags: ["heart_taken"],
      text: "You leave the Coalheart where it lies; some things are not yours to carry out. But you do not leave Wick. The two of you climb into a thin, cold morning with nothing to show for it and one small life saved, which turns out to be a great deal.",
    },
    {
      id: "hollow_return",
      status: "won",
      text: "You climb out empty-handed into the grey light, having held the heart of the place in your hand and left it beating. The city will have to save itself. Perhaps, given the chance, it can.",
    },
  ],

  rooms: {
    // ---- Act I: the upper cloister ----------------------------------------
    seal: {
      id: "seal",
      title: "The broken seal",
      text: "You crouch at the shattered {seal} of the Cindergate Priory, where the guild's men pried it wide and then would go no further. A knotted {rope} drops through the gap into the dark, and someone long dead has scratched a {warning} into the lintel.",
      looks: [
        {
          noun: "seal",
          text: "Lead and old prayers, broken from the outside in a great hurry. Whoever opened this wanted very much to be somewhere else by nightfall.",
        },
        {
          noun: "rope",
          text: "Guild rope, new and good, made fast to an iron ring. It is the one honest thing you have brought down here.",
        },
        {
          noun: "warning",
          text: "Three words gouged deep into the stone: LEAVE THE HEART. The last hand to write here bore down hard enough to split the lintel.",
        },
      ],
      choices: [
        {
          id: "descend",
          label: "climb down the rope into the priory",
          effects: [
            { goto: "narthex" },
            { say: "You take the rope in both hands and lower yourself into the cold." },
          ],
        },
      ],
    },

    narthex: {
      id: "narthex",
      title: "The narthex",
      text: "The rope ends on the flagstones of the entry hall. A dry stone {font} stands by the inner door, its holy water long since gone to dust. A {mural} spreads across one wall, and in a shadowed {alcove} to your left, something small and living holds very still.",
      looks: [
        {
          noun: "font",
          text: "Carved with the priory's mark: a hearth with a heart burning in it. The basin holds nothing now but a rime of white dust.",
        },
        {
          noun: "mural",
          text: "The founding of the order: the sisters carrying a burning heart down into the earth and sealing the door behind it. Every painted face is turned back toward the surface, wanting out.",
        },
        {
          noun: "alcove",
          text: "A child, thin and filthy and wide-eyed, wedged into the gap where two walls fail to meet. A lamplighter's tin badge is pinned to the rags. The child watches you and does not run.",
          effects: [{ flag: "wick_met" }],
        },
      ],
      choices: [
        {
          id: "call_alcove",
          label: "call softly into the alcove",
          hideFlag: "wick_met",
          effects: [
            { flag: "wick_met" },
            {
              say: '"I won\'t hurt you," you say, and you mean it. A child creeps out: thin, filthy, a lamplighter\'s tin badge pinned to the rags. "Wick," they whisper, as though it were the only thing they still owned.',
            },
          ],
        },
        {
          id: "take_child",
          label: "let Wick come with you",
          needsFlag: "wick_met",
          hideFlag: "wick_with",
          effects: [
            { flag: "wick_with" },
            {
              say: "A small cold hand fits itself into yours. You do not let go.",
            },
          ],
        },
        {
          id: "press_on",
          label: "go on through the inner door",
          effects: [{ goto: "refectory" }],
        },
      ],
    },

    refectory: {
      id: "refectory",
      title: "The refectory",
      text: "A long refectory {table} runs the length of the hall, still set for a meal the sisters rose from and never finished. A cold {hearth} yawns black at the far end. Sunk into the floor between them lies a still {cistern} of water so dark it looks like a hole cut clean through the world.",
      looks: [
        {
          noun: "table",
          text: "Bowls of dust, cups of dust, a hundred places laid. Whatever called the sisters up from this table, they went all at once, and none came back to clear it.",
        },
        {
          noun: "hearth",
          text: "Cold a century, and yet not one cinder in the grate. They carried every last coal of their fires down with them, as if the dark were a thing that had to be fed.",
        },
        {
          noun: "cistern",
          text: "The surface neither moves nor shines. Your own face is not in it. This was never water, and it was never meant for drinking.",
        },
      ],
      choices: [
        {
          id: "drink_cistern",
          label: "kneel and drink from the cistern",
          effects: [
            {
              say: "The black water is colder than water has any right to be, and it does not stop being cold, and then there is nothing left of you to feel it.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "to_dormitory",
          label: "leave through the dormitory arch",
          effects: [{ goto: "dormitory" }],
        },
      ],
    },

    dormitory: {
      id: "dormitory",
      title: "The dormitory",
      text: "Rows of narrow {beds} line the sisters' sleeping cells, their blankets still turned back. One cell at the end has been {sealed}, its door bricked over, the mortar scrawled with the same white prayers as the font. A low {passage} leads on into the dark.",
      looks: [
        {
          noun: "beds",
          text: "Made for waking, every one. They meant to come back to these beds. They did not.",
        },
        {
          noun: "sealed",
          text: "A cell walled up from the outside, in haste, in fear. Something was shut in here and prayed over and left. The mortar is cracked through now, and a thin cold draught breathes out of the gap.",
        },
        {
          noun: "passage",
          text: "The floor tilts down beyond it, toward the sound of water and the smell of deep, old stone.",
        },
      ],
      choices: [
        {
          id: "open_cell",
          label: "break open the sealed cell",
          hideFlag: "cell_open",
          effects: [
            { flag: "cell_open" },
            {
              say: "The old mortar crumbles and the door gives with a long sigh of foul, patient air.",
            },
            { goto: "plague_ward" },
          ],
        },
        {
          id: "to_bridge",
          label: "follow the passage down",
          effects: [{ goto: "bridge" }],
        },
      ],
    },

    plague_ward: {
      id: "plague_ward",
      title: "The sealed cell",
      text: "Inside the bricked cell the air hangs thick and sweet with rot. A {shape} lies on the cot beneath a shroud gone black. On the wall, a last {message} has been scratched by a failing hand.",
      looks: [
        {
          noun: "shape",
          text: "A sister, or what a hundred years have left of one. She was walled in alive; the marks of her nails run down the inside of the door. She did not turn on the order for it. She only waited.",
        },
        {
          noun: "message",
          text: "\"THE HEART IS NOT A CURE. IT IS THE FIRST FEVER, THE ONE THAT MADE ALL THE OTHERS. WE FED IT OURS SO THE CITY WOULD NOT HAVE TO. DO NOT TAKE IT UP.\"",
          effects: [{ flag: "knows_truth" }],
        },
      ],
      choices: [
        {
          id: "touch_shape",
          label: "draw back the shroud",
          effects: [
            {
              say: "You lift the black cloth, and the air you breathe doing it is a hundred years old and glad of you. It settles into your chest like a hand closing, and does not let go.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "leave_ward",
          label: "back out of the cell",
          effects: [{ goto: "dormitory" }],
        },
      ],
    },

    bridge: {
      id: "bridge",
      title: "The broken span",
      text: "The passage ends at a {span} of old planking thrown across a shaft that drops beyond the reach of any light. The far side, and the deeper priory, waits across it. The {planks} do not look equal to the crossing, and the {dark} below gives back no sound at all when a loosed pebble falls.",
      looks: [
        {
          noun: "span",
          text: "A footbridge the sisters kept up, now a century past trusting. It will bear a careful weight, if the weight knows where to set itself.",
        },
        {
          noun: "planks",
          text: "Perhaps one board in three is still sound. The sound ones sit darker, swollen tight against their neighbours; the rotten ones ride up proud and pale. Cross on the dark ones.",
        },
        {
          noun: "dark",
          text: "The shaft falls away past hearing. Whatever waits at the bottom of it, the priory has been dropping things down to it for a very long time.",
        },
      ],
      choices: [
        {
          id: "edge_across",
          label: "edge across slowly, testing every plank",
          effects: [
            {
              say: "You go a hand's breadth at a time, and the span complains, and holds. The far side takes your weight like solid ground.",
            },
            { goto: "warren_hub" },
          ],
        },
        {
          id: "stride_across",
          label: "cross quickly, before your nerve fails",
          effects: [
            {
              say: "A board you trusted lets go all at once, and the shaft takes you down into a dark that never finds a floor.",
            },
            { end: "lost" },
          ],
        },
      ],
    },

    // ---- Act II: the flooded warrens -------------------------------------
    warren_hub: {
      id: "warren_hub",
      title: "The flooded warren",
      text: "Below the bridge the priory loses its straight lines. Black water stands ankle deep across a {junction} of low tunnels. A narrow {doorway} still holds a scrap of painted wood; a broad arch opens on a drowned {nave}; a side passage runs toward the sisters' {crypt}; and a worn {stair} winds down into the deepest dark of all.",
      looks: [
        {
          noun: "junction",
          text: "The water is still and black and comes from nowhere you can find. It has been rising, a finger's width a year, for longer than you have been alive.",
        },
        {
          noun: "doorway",
          text: "Beyond it, shelves of ruined books, and a voice. Someone in there is still breathing, and has been waiting a very long time to be heard.",
        },
        {
          noun: "nave",
          text: "A great flooded hall, its pews standing in black water, and a lantern moving at the far end of it that is not yours. You are not the only one who came down for the prize.",
        },
        {
          noun: "crypt",
          text: "A low door, and colder air, and the particular ordered silence of a great many dead laid out in their proper places.",
        },
        {
          noun: "stair",
          text: "It spirals down toward the reliquary the whole priory was raised to bury. Whatever you decide to do about the Heart, it is waiting down there.",
        },
      ],
      choices: [
        { id: "to_scriptorium", label: "enter the narrow doorway", effects: [{ goto: "scriptorium" }] },
        { id: "to_nave", label: "wade into the drowned nave", effects: [{ goto: "flooded_nave" }] },
        { id: "to_crypt", label: "follow the passage to the crypt", effects: [{ goto: "crypt" }] },
        {
          id: "go_down",
          label: "take the stair down toward the reliquary",
          effects: [{ goto: "deep_cistern" }],
        },
      ],
    },

    scriptorium: {
      id: "scriptorium",
      title: "The scriptorium",
      text: "Shelves of swollen {books} slump along the walls of the copying room. At the back, a section of {wall} has been bricked across an old doorway, and set into it at head height is a narrow iron {slot}, from which a dry voice is speaking your name.",
      looks: [
        {
          noun: "books",
          text: "Psalters and account books alike, all of them ruined, all of them agreeing on the one point: the priory fed the Coalheart to keep it quiet, and the feeding never once stopped.",
        },
        {
          noun: "wall",
          text: "Newer than the room around it by a century, and shoddy, thrown up in a single night. Someone sealed a living sister behind this, and left the slot so she could be spoken to, or so that she could speak.",
        },
        {
          noun: "slot",
          text: 'An eye finds yours through the gap. "You came for the Heart," says the voice, without hope and without reproach. "Everyone does. Let me tell you what it costs, before you carry it up to them."',
          effects: [{ flag: "aume_met" }],
        },
      ],
      choices: [
        {
          id: "answer_voice",
          label: "answer the voice at the slot",
          hideFlag: "aume_met",
          effects: [
            { flag: "aume_met" },
            {
              say: '"You came for the Heart," the voice says through the iron slot, without hope and without reproach. "Sister Aume, once. Walled in here to keep the last of the vigil. Let me tell you what it costs, before you carry it up to them."',
            },
          ],
        },
        {
          id: "free_aume",
          label: "pry the brickwork loose and free her",
          needsFlag: "aume_met",
          hideFlag: "aume_freed",
          effects: [
            { flag: "aume_freed" },
            {
              say: "The wall comes apart under your hands, course by course, and Sister Aume steps out of a hundred years of dark on legs that still, somehow, remember the way of it. \"Thank you,\" she says. \"Now listen.\"",
            },
          ],
        },
        {
          id: "listen_aume",
          label: "ask her what the Heart truly is",
          needsFlag: "aume_freed",
          hideFlag: "knows_truth",
          effects: [
            { flag: "knows_truth" },
            {
              say: '"It is no cure," she says. "It is the first fever, the one that bore all the others. The founder gave it her own living heart to hold it still, and we gave it ours in our turn. Carry it up into the city and you carry the fire that eats from the inside out. Do not deliver it. End it."',
            },
          ],
        },
        {
          id: "back_hub_scriptorium",
          label: "back to the junction",
          effects: [{ goto: "warren_hub" }],
        },
      ],
    },

    flooded_nave: {
      id: "flooded_nave",
      title: "The drowned nave",
      text: "Black water fills the priory's great {nave} to the knee, cold as a held breath. Rows of rotted {pews} stand facing nothing. At the altar end, a {stranger} in a good coat waits with a raised {lantern} and an easy smile, one hand already out toward you as though you had been expected all along.",
      looks: [
        {
          noun: "nave",
          text: "The roof has half come down and the water has taken the rest. Faith drowned in here slowly, and left the building standing over it, which is somehow the worse for being seen.",
        },
        {
          noun: "pews",
          text: "Facing an altar that is gone. A drowned prayer book floats open between two of them, its pages washed entirely blank.",
        },
        {
          noun: "lantern",
          text: "Good oil, steady flame. He has been down here longer than you and lost nothing at all, and that is the most frightening thing about him.",
        },
        {
          noun: "stranger",
          text: 'He gives his name as Harrow, a collector, sent by other men with other purses for the same small burning thing you were. "We could carry it up together," he offers. "Safer, surely, than alone." His smile never once reaches his eyes.',
          effects: [{ flag: "harrow_met" }],
        },
      ],
      choices: [
        {
          id: "clasp_hand",
          label: "clasp his offered hand",
          effects: [
            {
              say: "His grip closes hard the instant yours does. You understand, far too late, that a man sent down here for the very same prize was never going to climb back out beside you.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "keep_distance",
          label: "keep the pews between the two of you",
          hideFlag: "harrow_gone",
          effects: [
            { flag: "harrow_gone" },
            {
              say: "You do not take his hand. Something in your face decides him; he shrugs, steps back into the dark at the altar end, and is gone. You doubt you have seen the last of Harrow, but you have seen the last of him down here.",
            },
          ],
        },
        {
          id: "back_hub_nave",
          label: "back to the junction",
          effects: [{ goto: "warren_hub" }],
        },
      ],
    },

    crypt: {
      id: "crypt",
      title: "The crypt of sisters",
      text: "The order's dead lie in ranks of stone {tombs}, hands folded, faces calm. At the head of them all a founder's {effigy} lies with a hollow cut into its breast where a heart should be. A long {inscription} runs the length of the near wall.",
      looks: [
        {
          noun: "tombs",
          text: "Every sister who ever served, and every one of them died old and in her bed, tended to the last. Whatever they guarded did not take them. They chose, year on year, to stay down here with it.",
        },
        {
          noun: "effigy",
          text: "The founder, carved at peace, with an empty socket cut into her stone chest. The Coalheart is her heart, given up while it still beat so the thing within it would sleep. The hollow is cut to exactly its size.",
        },
        {
          noun: "inscription",
          text: "\"We could not kill it, so we kept it. We could not keep it for nothing, so we fed it. Reader, if the seal is broken and you have come this far, then we have failed. Do not finish our failure by carrying it out.\"",
          effects: [{ flag: "knows_truth" }],
        },
      ],
      choices: [
        {
          id: "back_hub_crypt",
          label: "back to the junction",
          effects: [{ goto: "warren_hub" }],
        },
      ],
    },

    deep_cistern: {
      id: "deep_cistern",
      title: "The deep cistern",
      text: "The stair bottoms out in a vast round {cistern}, its water black and slowly breathing. A single iron {chain} hangs from the dark overhead down into the pool, and across the water a low {arch} leads on toward a faint, unnatural warmth.",
      looks: [
        {
          noun: "cistern",
          text: "The same dead water as above, but deeper, older, the wellspring of it. Something is dissolved in it that ought not to be, and the whole of it is very slightly warm.",
        },
        {
          noun: "chain",
          text: "It runs up past sight and down past the floor of the pool both. Do not pull it. Whatever it rings for has waited a long time to be rung for.",
        },
        {
          noun: "arch",
          text: "Beyond it the stone is warm to the hand, and the dark has a red edge to it, like a banked fire seen through shut eyes.",
        },
      ],
      choices: [
        {
          id: "pull_chain",
          label: "pull the iron chain",
          effects: [
            {
              say: "The chain gives one deep toll that you feel in your teeth, and far below the floor of the pool, in no hurry at all, something enormous begins to answer it.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "to_oratory",
          label: "wade through the arch toward the warmth",
          effects: [{ goto: "oratory" }],
        },
        {
          id: "back_up",
          label: "climb back up the stair",
          effects: [{ goto: "warren_hub" }],
        },
      ],
    },

    oratory: {
      id: "oratory",
      title: "The oratory",
      text: "A small round oratory, dry and warm, its walls black with a century of {soot}. A locked iron {gate} bars the last few steps down to the reliquary. Beside it, a rusted {mechanism} of counterweights waits for a hand.",
      looks: [
        {
          noun: "soot",
          text: "Not from any candle. The warmth and the smoke both leak up from below, from the thing the whole priory was raised to smother.",
        },
        {
          noun: "gate",
          text: "Iron, and locked from this side, which is a mercy: someone wanted very much for what lies below to stay below. The lock answers to the mechanism, not to any key.",
        },
        {
          noun: "mechanism",
          text: "Counterweights and a crank, still sound beneath the rust. Worked slowly and in its proper order, it draws the gate up. Worked in a hurry, it brings the ceiling down instead.",
        },
      ],
      choices: [
        {
          id: "work_mechanism",
          label: "work the mechanism slowly and raise the gate",
          effects: [
            {
              say: "You take it tooth by tooth, in no hurry at all, and the gate grinds up into the roof and holds. The last way down stands open.",
            },
            { goto: "antechamber" },
          ],
        },
        {
          id: "force_mechanism",
          label: "force the mechanism and be done with it",
          effects: [
            {
              say: "You throw your weight on the crank and it turns too fast and too far, and the counterweights come down, and then the roof comes down after them.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "back_cistern",
          label: "back to the cistern",
          effects: [{ goto: "deep_cistern" }],
        },
      ],
    },

    // ---- Act III: the reliquary ------------------------------------------
    antechamber: {
      id: "antechamber",
      title: "The antechamber",
      text: "The warmth is a living thing now. A last stone {door} stands ajar on the reliquary beyond, its glow spilling across the floor. Against the near wall, vast and pale and coiled, a {guardian} sleeps, and its slow breath stirs the {ash} banked deep across the ground.",
      looks: [
        {
          noun: "door",
          text: "Ajar, and warm, and bright. Whatever the sisters buried is awake enough to burn. Go quietly.",
        },
        {
          noun: "guardian",
          text: "Older than the order itself, blind and white from a life spent in the dark, curled around the reliquary door like a hound at a hearth. It has not woken. Whatever you do here, do it without a single sound.",
        },
        {
          noun: "ash",
          text: "Soft and grey and deep, the burnt-down remains of every offering the priory ever made. It will muffle a careful step. It would not muffle a fall.",
        },
      ],
      choices: [
        {
          id: "slip_past",
          label: "slip past the guardian to the door",
          effects: [
            {
              say: "You cross the ash a breath at a time, past the great pale flank, and through the warm door. The guardian sleeps on.",
            },
            { goto: "reliquary" },
          ],
        },
        {
          id: "wake_guardian",
          label: "drive it off before it can wake on its own",
          effects: [
            {
              say: "You set a hand where you never should have, and the great pale shape opens one milky eye, and then it is all over very quickly indeed.",
            },
            { end: "lost" },
          ],
        },
        {
          id: "back_oratory",
          label: "back to the oratory",
          effects: [{ goto: "oratory" }],
        },
      ],
    },

    reliquary: {
      id: "reliquary",
      title: "The reliquary",
      text: "A round, hot vault, and at the heart of it, on a bare stone {pedestal}, the {coalheart}: a fist of coal that beats, and glows, and will not go out. A narrow {flue} in the floor breathes fire-warmth up from somewhere deeper still.",
      looks: [
        {
          noun: "pedestal",
          text: "Worn smooth by a hundred years of sisters who came, and looked, and did not take it, and climbed back up to die of old age rather than carry it out into the light.",
        },
        {
          noun: "coalheart",
          text: "It beats. Held, it would be warm as a living thing and light as a lie. Looking at it, you understand exactly how a whole city could be talked into wanting it.",
        },
        {
          noun: "flue",
          text: "The warmth and the faint red light climb from a shaft in the floor, a straight drop into fire: the old furnace the priory keeps banked beneath the Heart. Whatever went down there would not be coming back up.",
        },
      ],
      choices: [
        {
          id: "take_heart",
          label: "lift the Coalheart from the pedestal",
          hideFlag: "heart_taken",
          effects: [
            { give: "coalheart" },
            { flag: "heart_taken" },
            {
              say: "You lift it, and it settles into your hand and beats there, warm and awful, and the guardian in the next room does not so much as stir. It is yours to carry now, whatever that turns out to mean.",
            },
          ],
        },
        {
          id: "to_threshold",
          label: "climb toward the surface",
          effects: [{ goto: "choice_room" }],
        },
        {
          id: "back_antechamber",
          label: "back past the guardian",
          effects: [{ goto: "antechamber" }],
        },
      ],
    },

    choice_room: {
      id: "choice_room",
      title: "The threshold",
      text: "The way up narrows to a last warm {threshold}, where the buried heat of the priory meets the first cold breath of the world above. A black {furnace} mouth gapes in the wall here, the same fire that banks beneath the Heart, close enough to reach. Far overhead, a grey thread of {daylight} shows the way out.",
      looks: [
        {
          noun: "threshold",
          text: "The exact line where the buried fire ends and the ordinary world begins. What you carry across it, the city gets. What you leave behind, it does not.",
        },
        {
          noun: "furnace",
          text: "The priory's own furnace, roaring soft behind its iron mouth. Hot enough to unmake anything at all, even a thing that will not go out. Even the Heart.",
        },
        {
          noun: "daylight",
          text: "Thin, grey, ordinary morning, a long climb up. It has been up there waiting the whole time, the same as everything else you had half forgotten.",
        },
      ],
      choices: [
        {
          id: "cast_heart",
          label: "cast the Coalheart into the furnace",
          needsItem: "coalheart",
          hideFlag: "heart_destroyed",
          effects: [
            { flag: "heart_destroyed" },
            { take: "coalheart" },
            {
              say: "You put it into the fire. It fights, beating harder, blazing white, and then all at once it is only a coal like any other, and then it is ash, and then it is nothing at all. The warmth goes out of the walls behind you.",
            },
          ],
        },
        {
          id: "ascend",
          label: "climb the last steps into the daylight",
          effects: [{ goto: "ascent" }],
        },
      ],
    },

    ascent: {
      id: "ascent",
      title: "The long ascent",
      text: "The climb back is longer than the way down ever was. The warmth falls away behind you and the cold {daylight} grows ahead, and at the top the broken {seal} shows a ragged circle of ordinary grey sky. The {rope} still hangs where you left it, waiting to take your weight one last time.",
      looks: [
        {
          noun: "daylight",
          text: "Closer now, and vast, and free. You had half forgotten the sky could be so large a thing.",
        },
        {
          noun: "seal",
          text: "The gap you came in by, and the way out. Beyond it the plague-struck city goes about its slow dying, not yet knowing what you chose down here on its behalf.",
        },
        {
          noun: "rope",
          text: "Guild rope, still good, still fast to its iron ring. Whatever else this place took from you, it did not take your way out.",
        },
      ],
      choices: [
        {
          id: "climb_out",
          label: "climb the rope out into the morning",
          effects: [
            { say: "You climb, and the dark lets you go, and the cold grey morning takes you back." },
            { end: "won" },
          ],
        },
      ],
    },
  },
};

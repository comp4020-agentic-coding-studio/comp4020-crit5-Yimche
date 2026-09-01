// The dungeon. All the game's words and rules live here as data; game.ts knows
// nothing about the Coalheart or Sister Aume. There are four ways down into the
// priory and many ways through it, and the danger is never a meter: it is the
// choices themselves. Only a few of them are truly final, and those lie deep, a
// wellspring that was never water, a bell that should never be rung, a sleeper
// that must not wake; each is told out in full when you choose it, not snapped
// off in a line. Most wrong turns only mark you and send you on, a bad fall, a
// breath of old fever, a hand you should not have taken. The story's many
// endings fall out of what you carry up and who you bring with you, graded by
// the endings table below. A player who only ever presses numbers still reaches
// an ending; the deeper story, the truth of the Heart and the people down here,
// waits behind the highlighted nouns for a player who has learned to look.

import type { Dungeon } from "./game.ts";

export const EMBERLIGHT: Dungeon = {
  start: "approach",

  endings: [
    {
      id: "ash_and_ashes",
      status: "won",
      needFlags: ["heart_destroyed", "knows_truth", "wick_with", "feverish"],
      text: "You cast the last of the Coalheart into the cold and it goes out for good, and the fever it would have carried up into the city dies here with it. Wick's small hand stays in yours the whole long climb. You come up into a grey, ordinary dawn together, having done every last thing right; and still there is a heat behind your ribs that the morning air will not touch, the priory's one kept-back offering, and you climb north knowing the child, at least, you got out clean.",
    },
    {
      id: "ash_scattered",
      status: "won",
      needFlags: ["heart_destroyed", "knows_truth", "wick_with"],
      text: "You cast the last of the Coalheart into the cold and it goes out for good, and the fever it would have carried up into the city dies here with it. Wick's small hand stays in yours the whole long climb. You come up into a grey, ordinary dawn together, poorer than you went down and cleaner than you have ever been.",
    },
    {
      id: "fever_carried",
      status: "won",
      needFlags: ["feverish"],
      text: "You climb out into the grey morning, and the cold air does nothing for the heat that has settled behind your ribs. Whatever you did or did not carry up in your hands, you carried something up in your chest, and by the time the first cough takes you on the road north you understand that the priory kept one last offering back, and that it was you.",
    },
    {
      id: "waylaid",
      status: "won",
      needFlags: ["heart_taken", "harrow_hostile"],
      blockFlags: ["heart_destroyed"],
      text: "Harrow is waiting at the top of the rope, of course, in the good coat, with two other men and no smile at all. They take the Coalheart from you as easily as taking a coin from a child, and leave you your life, which is more than you would have wagered on. Wherever it burns now, it will not be for you, and it will not be for long.",
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
    // ---- The four ways in --------------------------------------------------
    approach: {
      id: "approach",
      title: "The approach",
      text: "Dusk over the Cindergate Priory, and four ways down into it. The guild's broken {seal} hangs above a knotted {rope}. Off in the long grass a collapsed storm {drain} breathes cold air. A dry {well} stands open among the graves. And the {belfry} door, though barred, has rotted soft at the hinge.",
      looks: [
        {
          noun: "seal",
          text: "Lead and old prayers, broken from the outside in a great hurry. Three words are gouged into the lintel above it: LEAVE THE HEART. The last hand to write here bore down hard enough to split the stone.",
        },
        {
          noun: "rope",
          text: "Guild rope, new and good, made fast to an iron ring, dropping straight through the broken seal into the dark. The plainest way in, and the one the guild's own men would not follow past the top.",
        },
        {
          noun: "drain",
          text: "A storm culvert, fallen in on itself, that once carried the priory's water away. It goes down steep and wet and comes out somewhere low, among the flooded warrens, well below the cloister.",
        },
        {
          noun: "well",
          text: "A dry well in the graveyard, its bucket long gone. The shaft drops clean and cold into the crypt of the sisters, if the old iron rungs still hold.",
        },
        {
          noun: "belfry",
          text: "The bell tower, its door barred from within but soft with rot at the hinge. One shoulder would have it open, and a stair inside climbs to the belfry over the whole priory.",
        },
      ],
      choices: [
        {
          id: "enter_seal",
          label: "climb down the guild rope through the broken seal",
          effects: [
            { say: "You take the rope in both hands and lower yourself through the seal into the cold." },
            { goto: "narthex" },
          ],
        },
        {
          id: "enter_drain",
          label: "crawl down into the collapsed storm drain",
          effects: [
            { say: "You go in on hands and knees, and the drain takes you down its long wet throat, and lets you out gasping and soaked far below the cloister." },
            { goto: "sluice" },
          ],
        },
        {
          id: "enter_well",
          label: "climb down the dry graveyard well",
          effects: [
            { say: "The old rungs hold, barely, and hand under hand you go down into a colder, stiller dark that smells of stone and the long dead." },
            { goto: "crypt" },
          ],
        },
        {
          id: "enter_belfry",
          label: "force the belfry door and climb the tower stair",
          effects: [
            { say: "Your shoulder takes the rotten door off its hinge, and the tower stair winds up ahead of you into the last of the light." },
            { goto: "belfry" },
          ],
        },
      ],
    },

    belfry: {
      id: "belfry",
      title: "The belfry",
      text: "The bell tower stands open to the wind, the whole ruined priory spread below through the {arches}. A great bronze {bell} hangs silent in its frame, and a frayed bell {rope} falls away through a hole in the floor toward the nave far below. A narrow {stair} winds down into the cloister.",
      looks: [
        {
          noun: "arches",
          text: "Through them the priory lies open like a cut: the cloister roofs, the drowned nave with its black water, and somewhere under all of it the red seam of warmth the sisters buried. From up here you can see how far down you have to go.",
        },
        {
          noun: "bell",
          text: "Bronze, green with age, still hung true. A hundred years of silence sits on it. Ringing it now would carry into every stone room below, and to anyone else who has come down here for the prize.",
        },
        {
          noun: "rope",
          text: "The bell rope, frayed but whole, dropping through the floor toward the nave. A steady hand could ride it down and skip the whole cloister, straight into the flooded heart of the place.",
        },
        {
          noun: "stair",
          text: "Stone steps winding down into the cloister proper, toward the narthex and the sisters' hall. The ordinary way down from here.",
        },
      ],
      choices: [
        {
          id: "belfry_down",
          label: "take the stair down into the cloister",
          effects: [
            { say: "You leave the wind behind and go down the winding stair into the close, stone quiet of the cloister." },
            { goto: "narthex" },
          ],
        },
        {
          id: "ride_rope",
          label: "ride the bell rope down into the nave",
          effects: [
            { say: "You swing out over the hole and let the rope run through your hands, and it lowers you down and down through the dark into cold black water to the knee." },
            { goto: "flooded_nave" },
          ],
        },
        {
          id: "ring_bell",
          label: "ring the great bell",
          hideFlag: "harrow_alerted",
          effects: [
            { flag: "harrow_alerted" },
            { say: "You set both hands to the rope and haul. The bell swings, and swings back, and lets out one vast bronze note that goes down through the priory like a hand passing over water." },
            { say: "The sound comes back to you off a hundred stone rooms, changed, as though the place had answered in its own voice. Far below, a lantern that is not yours goes still, and then begins, unhurried, to move toward the sound. You have told the whole dark that you are here." },
          ],
        },
      ],
    },

    // ---- Act I: the upper cloister ----------------------------------------
    narthex: {
      id: "narthex",
      title: "The narthex",
      text: "The entry hall of the priory. A dry stone {font} stands by the inner door, its holy water long gone to dust. A {mural} spreads across one wall. In a shadowed {alcove}, something small and living holds very still. A side passage runs off toward the chapter house, and stone steps climb back up toward the belfry.",
      looks: [
        {
          noun: "font",
          text: "Carved with the priory's mark: a hearth with a heart burning in it. The basin holds nothing now but a rime of white dust.",
        },
        {
          noun: "mural",
          text: "The founding of the order: the sisters carrying a burning heart down into the earth and sealing the door behind them. Every painted face is turned back toward the surface, wanting out.",
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
              say: "\"I won't hurt you,\" you say, and you mean it. A child creeps out: thin, filthy, a lamplighter's tin badge pinned to the rags. \"Wick,\" they whisper, as though it were the only thing they still owned.",
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
            { say: "A small cold hand fits itself into yours. You do not let go." },
          ],
        },
        {
          id: "press_on",
          label: "go on through the inner door",
          effects: [{ goto: "refectory" }],
        },
        {
          id: "to_chapter",
          label: "take the side passage to the chapter house",
          effects: [{ goto: "chapter_house" }],
        },
        {
          id: "narthex_up",
          label: "climb the steps up to the belfry",
          effects: [{ goto: "belfry" }],
        },
      ],
    },

    chapter_house: {
      id: "chapter_house",
      title: "The chapter house",
      text: "The room where the sisters met and ruled themselves, its {seats} set in a ring around a cold floor. A great {ledger} lies open on a lectern. Against the far wall a locked {aumbry} of black oak holds whatever the order thought worth a lock.",
      looks: [
        {
          noun: "seats",
          text: "A ring of worn stone seats, one raised a little above the rest. They sat here and argued and voted and, in the end, decided to bury a thing rather than destroy it. The weight of that decision is still in the room.",
        },
        {
          noun: "ledger",
          text: "The order's own record, in a hundred hands across a hundred years. It says plainly what the founders did: they took a burning sickness they could not kill, and they fed it their own, year on year, to keep it from waking and taking the city instead. It was never a cure. It was the first fever.",
          effects: [{ flag: "knows_truth" }],
        },
        {
          noun: "aumbry",
          text: "A locked cabinet, the wood black and hard as iron. Something inside shifts with a small iron sound when you touch it. The lock is old and the hinges older; a firm hand would have it.",
        },
      ],
      choices: [
        {
          id: "read_ledger",
          label: "read the chapter ledger",
          hideFlag: "knows_truth",
          effects: [
            { flag: "knows_truth" },
            { say: "You turn the great pages, and the sisters tell you themselves, in their own careful hands, what the Heart is. Not a cure. The first fever, the one that bore all the others. They could not kill it, so they kept it, and fed it their own lives to keep it asleep. Carry it up into the city, the last entry warns, and you carry the fire that eats from the inside." },
          ],
        },
        {
          id: "force_aumbry",
          label: "force the black aumbry open",
          hideFlag: "aumbry_open",
          effects: [
            { flag: "aumbry_open" },
            { give: "keys" },
            { say: "The lock gives with a crack that goes round the ring of empty seats. Inside, on a hook, hangs a ring of iron keys, the sacrist's keys, that once opened every door in the priory. You take them. Somewhere down there, they will save you a worse way in." },
          ],
        },
        {
          id: "chapter_to_refectory",
          label: "go through to the refectory",
          effects: [{ goto: "refectory" }],
        },
        {
          id: "chapter_back",
          label: "back to the narthex",
          effects: [{ goto: "narthex" }],
        },
      ],
    },

    refectory: {
      id: "refectory",
      title: "The refectory",
      text: "A long refectory {table} runs the length of the hall, still set for a meal the sisters rose from and never finished. A cold {hearth} yawns black at the far end. Sunk into the floor lies a still {cistern} of water so dark it looks like a hole cut clean through the world. A low arch leads on to the dormitory, and a narrow door stands open on the kitchens.",
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
          text: "The surface neither moves nor shines. Your own face is not in it. This was never water, and it was never meant for drinking. Whatever it is, it wells up from somewhere far below, and it is only a little colder down there, and only a little worse.",
        },
      ],
      choices: [
        {
          id: "sip_cistern",
          label: "kneel and taste the black cistern",
          hideFlag: "tasted_dark",
          effects: [
            { flag: "tasted_dark" },
            { say: "You wet a finger and touch it to your tongue, and the cold of it goes straight to the back of your skull like a needle. You spit, and spit again, and still the taste of it will not leave: old iron, old smoke, and something underneath that was never meant to be tasted at all." },
            { say: "You are not harmed, not here, not from so little. But you understand now that this water is the same wherever it stands in this place, and that there is a great deal more of it, deeper down, and that a mouthful of that would be the last thing you ever did." },
          ],
        },
        {
          id: "to_dormitory",
          label: "leave through the dormitory arch",
          effects: [{ goto: "dormitory" }],
        },
        {
          id: "to_kitchen",
          label: "slip into the kitchens",
          effects: [{ goto: "kitchen" }],
        },
        {
          id: "refectory_back",
          label: "back to the narthex",
          effects: [{ goto: "narthex" }],
        },
      ],
    },

    kitchen: {
      id: "kitchen",
      title: "The kitchens",
      text: "The priory's kitchens, cold as everything else. Empty {stores} line the walls, and a heavy wooden {trapdoor} is set into the floor by the dead range. On the butcher's block, kept from rust by the dry cold, a good {blade} still lies where a sister set it down.",
      looks: [
        {
          noun: "stores",
          text: "Jars and sacks gone to dust and rot, a century of meals that were never cooked. Nothing here will feed you, and nothing here will save you.",
        },
        {
          noun: "trapdoor",
          text: "A heavy hatch in the floor, and cold wet air coming up around its edge. It drops, by the smell of it, straight down into the flooded cellars and the warrens below, well past the cloister.",
        },
        {
          noun: "blade",
          text: "A boning knife, thin and still keen under a skin of grime. Not much against the dark. Something, though, against a man.",
        },
      ],
      choices: [
        {
          id: "take_blade",
          label: "take the knife from the block",
          hideFlag: "has_knife",
          effects: [
            { flag: "has_knife" },
            { give: "knife" },
            { say: "You wipe it on your sleeve and weigh it in your hand. Thin, and mean, and better than the nothing you came down with." },
          ],
        },
        {
          id: "kitchen_down",
          label: "lift the trapdoor and climb down",
          effects: [
            { say: "You haul the hatch up on its stiff hinge and climb down into the cold and the wet, into the priory's flooded underneath." },
            { goto: "cellars" },
          ],
        },
        {
          id: "kitchen_back",
          label: "back to the refectory",
          effects: [{ goto: "refectory" }],
        },
      ],
    },

    dormitory: {
      id: "dormitory",
      title: "The dormitory",
      text: "Rows of narrow {beds} line the sisters' sleeping cells, their blankets still turned back. One cell at the end has been {sealed}, bricked over, the mortar scrawled with white prayers. A low {passage} leads on and down into the dark.",
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
          text: "The floor tilts down beyond it, toward the sound of water and the smell of deep, old stone. This is the way to the broken span, and the warrens under it.",
        },
      ],
      choices: [
        {
          id: "open_cell",
          label: "break open the sealed cell",
          hideFlag: "cell_open",
          effects: [
            { flag: "cell_open" },
            { say: "The old mortar crumbles and the door gives with a long sigh of foul, patient air." },
            { goto: "plague_ward" },
          ],
        },
        {
          id: "to_bridge",
          label: "follow the passage down",
          effects: [{ goto: "bridge" }],
        },
        {
          id: "dormitory_back",
          label: "back to the refectory",
          effects: [{ goto: "refectory" }],
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
          hideFlag: "feverish",
          effects: [
            { flag: "feverish" },
            { say: "You lift the black cloth to see her face, and the air that comes off her is a hundred years old and glad of you." },
            { say: "It goes into your chest like a slow hand closing, before you can turn your head away. You drop the cloth and back off, breathing hard, but the thing you breathed is already yours, and settling in, and warm." },
            { say: "You are still standing. You can still climb. But something has changed hands in this cell, and you both know it." },
          ],
        },
        {
          id: "mourn_shape",
          label: "say a word over her before you go",
          hideFlag: "mourned",
          effects: [
            { flag: "mourned" },
            { say: "You do not know the order's prayers, so you give her a plain one, the kind said over anyone at all. It is a hundred years late and she cannot hear it. You say it anyway, and mean it, and the saying of it steadies your own hand." },
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
            { say: "You go a hand's breadth at a time, and the span complains, and holds. The far side takes your weight like solid ground." },
            { goto: "warren_hub" },
          ],
        },
        {
          id: "stride_across",
          label: "cross quickly, before your nerve fails",
          effects: [
            { say: "You go fast, before your nerve can fail you, and halfway across a board you trusted lets go all at once and your stomach with it." },
            { say: "You drop, and catch, both hands clamped on the next plank while your legs swing out over nothing and the cold breathes up at you. For a long moment that is all there is in the world. Then, slowly, you haul yourself up and go the rest of the way on all fours." },
            { say: "You reach the far side whole, and shaking, and a great deal more careful than you were a moment ago." },
            { goto: "warren_hub" },
          ],
        },
        {
          id: "bridge_back",
          label: "turn back to the dormitory",
          effects: [{ goto: "dormitory" }],
        },
      ],
    },

    // ---- Act II: the flooded warrens -------------------------------------
    sluice: {
      id: "sluice",
      title: "The sluice",
      text: "The drain lets you out into a low {sluice} where the priory's water was once carried off. It stands flooded now, black and still to the shin. A rusted iron {grate} bars a way through toward a great flooded hall, and the slow {current} pulls off the other way, toward the sound of a wider dark.",
      looks: [
        {
          noun: "sluice",
          text: "A brick throat built to move water, and long since given up on the job. The flood stands dead in it now, and does not drain, and does not freshen. The same black water as everywhere in this place.",
        },
        {
          noun: "grate",
          text: "Iron bars, rusted most of the way through, barring a low way into what sounds like a great flooded hall beyond. A firm pull would have it out of the wall.",
        },
        {
          noun: "current",
          text: "The one moving thing down here: a slow draw in the water, off toward the wider dark, where the tunnels open out into the warrens proper and their central junction.",
        },
      ],
      choices: [
        {
          id: "sluice_hub",
          label: "wade with the current toward the junction",
          effects: [
            { say: "You let the slow pull of the water be your guide, and wade with it out of the sluice and into the wider dark of the warrens." },
            { goto: "warren_hub" },
          ],
        },
        {
          id: "sluice_nave",
          label: "pull the grate loose into the flooded hall",
          effects: [
            { say: "The old grate comes away from the brick with a groan, and you duck through into a great drowned hall, black water to the knee." },
            { goto: "flooded_nave" },
          ],
        },
        {
          id: "sluice_up",
          label: "climb back up the drain to the surface",
          effects: [{ goto: "approach" }],
        },
      ],
    },

    warren_hub: {
      id: "warren_hub",
      title: "The flooded warren",
      text: "Below the cloister the priory loses its straight lines. Black water stands ankle deep across a {junction} of low tunnels. A narrow {doorway} still holds a scrap of painted wood; a broad arch opens on a drowned {nave}; a side passage runs toward the sisters' {crypt}; and a worn {stair} winds down into the deepest dark of all. A lower gallery runs off toward the flooded cellars.",
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
        { id: "to_cellars", label: "duck into the flooded cellars", effects: [{ goto: "cellars" }] },
      ],
    },

    cellars: {
      id: "cellars",
      title: "The cellars",
      text: "The flooded cellars, where the priory kept what it wanted cold. Rows of ruined {casks} stand in the black water. A low {arch} leads off toward colder, stiller air and the smell of the dead, and overhead a heavy {hatch} shows a seam of the cloister you came down from.",
      looks: [
        {
          noun: "casks",
          text: "Wine and oil and salt fish, all of it a century spoiled, the barrels burst and furred with a hundred years of the dark. Nothing here is worth carrying up.",
        },
        {
          noun: "arch",
          text: "A low brick arch, and beyond it the cold ordered silence of the crypt. The cellars and the sisters' dead share a wall down here, as the living and the dead shared everything else.",
        },
        {
          noun: "hatch",
          text: "The underside of the kitchen trapdoor, up a short slick stair. The way back to the cloister, if you have had enough of the deep.",
        },
      ],
      choices: [
        { id: "cellars_crypt", label: "through the low arch to the crypt", effects: [{ goto: "crypt" }] },
        { id: "cellars_hub", label: "back to the junction", effects: [{ goto: "warren_hub" }] },
        { id: "cellars_up", label: "climb the hatch up to the kitchens", effects: [{ goto: "kitchen" }] },
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
          text: "An eye finds yours through the gap. \"You came for the Heart,\" says the voice, without hope and without reproach. \"Everyone does. Let me tell you what it costs, before you carry it up to them.\"",
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
            { say: "\"You came for the Heart,\" the voice says through the iron slot, without hope and without reproach. \"Sister Aume, once. Walled in here to keep the last of the vigil. Let me tell you what it costs, before you carry it up to them.\"" },
          ],
        },
        {
          id: "free_aume",
          label: "pry the brickwork loose and free her",
          needsFlag: "aume_met",
          hideFlag: "aume_freed",
          effects: [
            { flag: "aume_freed" },
            { say: "The wall comes apart under your hands, course by course, and Sister Aume steps out of a hundred years of dark on legs that still, somehow, remember the way of it. \"Thank you,\" she says. \"Now listen.\"" },
          ],
        },
        {
          id: "listen_aume",
          label: "ask her what the Heart truly is",
          needsFlag: "aume_freed",
          hideFlag: "knows_truth",
          effects: [
            { flag: "knows_truth" },
            { say: "\"It is no cure,\" she says. \"It is the first fever, the one that bore all the others. The founder gave it her own living heart to hold it still, and we gave it ours in our turn. Carry it up into the city and you carry the fire that eats from the inside out. Do not deliver it. End it.\"" },
          ],
        },
        {
          id: "aume_passage",
          label: "follow the opened doorway down",
          needsFlag: "aume_freed",
          effects: [
            { say: "Behind the broken wall a dry service passage the sisters used slopes away into the warm dark. Sister Aume points you down it. It comes out lower than you climbed in, she says, hard by the last gate." },
            { goto: "oratory" },
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
      text: "Black water fills the priory's great {nave} to the knee, cold as a held breath. Rows of rotted {pews} stand facing nothing. At the altar end, a {stranger} in a good coat waits with a raised {lantern} and an easy smile, one hand already out toward you as though you had been expected all along. A frayed bell rope hangs from the dark overhead.",
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
          text: "He gives his name as Harrow, a collector, sent by other men with other purses for the same small burning thing you were. \"We could carry it up together,\" he offers. \"Safer, surely, than alone.\" His smile never once reaches his eyes.",
          effects: [{ flag: "harrow_met" }],
        },
      ],
      choices: [
        {
          id: "clasp_hand",
          label: "clasp his offered hand",
          hideFlag: "harrow_resolved",
          effects: [
            { flag: "harrow_hostile" },
            { flag: "harrow_resolved" },
            { say: "You put your hand in his. His grip closes hard the instant yours does, harder than any handshake, and for one cold second you feel exactly how this was always going to go." },
            { say: "You wrench back with everything you have and go over into the pews, into the black water, and come up spitting and scrambling for footing. He does not chase you. He does not need to." },
            { say: "\"Higher up, then,\" Harrow says, unhurried, and steps back into the dark at the altar end with his lantern, certain as sunrise that he will be waiting when you climb out. You have not seen the last of him." },
          ],
        },
        {
          id: "keep_distance",
          label: "keep the pews between the two of you",
          hideFlag: "harrow_resolved",
          effects: [
            { flag: "harrow_gone" },
            { flag: "harrow_resolved" },
            { say: "You do not take his hand. You keep the rotted pews between you and let the silence do the talking." },
            { say: "Something in your face decides him. He shrugs, as if it were no matter either way, steps back into the dark at the altar end, and is gone. You doubt you have seen the last of Harrow, but you have seen the last of him down here." },
          ],
        },
        {
          id: "show_blade",
          label: "show him the knife",
          needsItem: "knife",
          hideFlag: "harrow_resolved",
          effects: [
            { flag: "harrow_gone" },
            { flag: "harrow_resolved" },
            { say: "You do not take his hand. You let him see the thin bright knife in your other one instead, held low and easy, the way you hold a thing you have used before." },
            { say: "Harrow looks at it, and looks at you, and recalculates the whole encounter behind his eyes in the space of a breath. \"A misunderstanding,\" he says pleasantly, and withdraws his hand, and himself, back into the dark. He will not try you again down here." },
          ],
        },
        {
          id: "nave_descent",
          label: "wade past the drowned altar into the deeper water",
          needsFlag: "harrow_resolved",
          effects: [
            { say: "Past the altar the floor falls away in a flooded stair, and the black water takes you to the waist, and then, mercifully, no further, and lets you down into the deep of the priory." },
            { goto: "deep_cistern" },
          ],
        },
        {
          id: "nave_up",
          label: "climb the hanging bell rope up to the belfry",
          effects: [
            { say: "You take hold of the frayed bell rope and climb it hand over hand, back up into the wind and the last of the light." },
            { goto: "belfry" },
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
      text: "The order's dead lie in ranks of stone {tombs}, hands folded, faces calm. At the head of them all a founder's {effigy} lies with a hollow cut into its breast where a heart should be. A long {inscription} runs the near wall, and in the far corner a narrow {stair} of stacked bone winds down toward water. Iron rungs climb a {shaft} back toward the graveyard above.",
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
        {
          noun: "stair",
          text: "Not stone: the treads are long bones, laid and set with a care that is somehow worse than carelessness would have been. They go down toward the sound of the deep water, a second way into the dark below.",
        },
        {
          noun: "shaft",
          text: "The dry well you may have come down, or might yet climb: iron rungs up the throat of it to the graveyard and the grey world above. A way out, if you want one, that costs you nothing.",
        },
      ],
      choices: [
        {
          id: "crypt_descend",
          label: "go down the ossuary bone stair",
          effects: [
            { say: "You set your feet on the bones and go down, and they take your weight without a sound, worn smooth by the sisters who came this way before you. The water grows loud below." },
            { goto: "deep_cistern" },
          ],
        },
        { id: "crypt_cellars", label: "take the low arch to the cellars", effects: [{ goto: "cellars" }] },
        { id: "crypt_hub", label: "back to the junction", effects: [{ goto: "warren_hub" }] },
        { id: "crypt_up", label: "climb the well shaft back to the surface", effects: [{ goto: "approach" }] },
      ],
    },

    deep_cistern: {
      id: "deep_cistern",
      title: "The deep cistern",
      text: "The stair bottoms out in a vast round {cistern}, its black water breathing slowly, so wide the far wall is only a guess. A single iron {chain} hangs from the dark overhead down into the pool. Across the water a low {arch} leads on toward a faint, unnatural warmth.",
      looks: [
        {
          noun: "cistern",
          text: "The same dead water as far above, but here at its wellspring: deeper, older, faintly warm, the source that feeds every black pool in the priory. Something is dissolved in it that ought not to be. A mouthful of the shallow stuff only chilled you. A mouthful of this would be your last.",
        },
        {
          noun: "chain",
          text: "It runs up past sight and down past the floor of the pool both. Do not pull it. Whatever it rings for has waited a long time to be rung for, and would come without hurry, and would not stop.",
        },
        {
          noun: "arch",
          text: "Beyond it the stone is warm to the hand, and the dark has a red edge to it, like a banked fire seen through shut eyes. The last of the way down.",
        },
      ],
      choices: [
        {
          id: "drink_deep",
          label: "kneel and drink from the deep cistern",
          effects: [
            { say: "You are thirsty, and it is only water, and you have come so far. You kneel at the black edge and cup it up and drink, before the better part of you can say no." },
            { say: "The cold of it does not stop at your teeth. It goes down, and keeps going, spreading, and where it spreads you stop being able to feel yourself, a little at a time, from the inside out." },
            { say: "You understand, far too late, that this is the thing the whole priory was built to keep the city from drinking. It is very cold. And then it is not anything at all." },
            { end: "lost" },
          ],
        },
        {
          id: "pull_chain",
          label: "pull the iron chain",
          effects: [
            { say: "You should not. You know that you should not. You close your hand on the cold iron anyway, and pull." },
            { say: "The chain gives one deep toll that you feel in your teeth and your breastbone and the soles of your feet. It rolls out across the black water and does not come back." },
            { say: "Far below the floor of the pool, in no hurry at all, something enormous shifts, and settles, and begins to rise toward the sound you made. There is nowhere in this round stone room to go, and a very long time to wait for it to arrive." },
            { end: "lost" },
          ],
        },
        {
          id: "to_oratory",
          label: "wade through the arch toward the warmth",
          effects: [
            { say: "You wade the black water breast-deep, holding your breath against the cold and the wrongness of it, and come up dripping on the warm stone under the arch." },
            { goto: "oratory" },
          ],
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
          text: "Iron, and locked from this side, which is a mercy: someone wanted very much for what lies below to stay below. It answers to the mechanism beside it, or to the right key, and to nothing else.",
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
            { say: "You take it tooth by tooth, in no hurry at all, and the gate grinds up into the roof and holds. The last way down stands open." },
            { goto: "antechamber" },
          ],
        },
        {
          id: "unlock_gate",
          label: "unlock the gate with the sacrist's keys",
          needsItem: "keys",
          effects: [
            { say: "The sacrist's iron keys are stiff with rust, but the third one you try turns, and the great lock lets go with a sound like a held breath released. The gate swings up easily, no counterweights, no risk. The exploring paid for itself." },
            { goto: "antechamber" },
          ],
        },
        {
          id: "force_mechanism",
          label: "force the mechanism and be done with it",
          effects: [
            { say: "You throw your weight on the crank, and it turns too fast, and too far, and something lets go above you." },
            { say: "A counterweight drops like a hanged man, and a slab of the old ceiling comes down after it, close enough that the wind of it staggers you and the dust of it fills your mouth." },
            { say: "When it settles you are still standing, barely, and the gate has not moved at all. The mechanism waits, unbothered, to be worked properly this time. Slower." },
          ],
        },
        {
          id: "oratory_cistern",
          label: "back to the cistern",
          effects: [{ goto: "deep_cistern" }],
        },
        {
          id: "oratory_scriptorium",
          label: "back up the passage to the scriptorium",
          needsFlag: "aume_freed",
          effects: [{ goto: "scriptorium" }],
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
            { say: "You cross the ash a breath at a time, past the great pale flank, near enough to feel the furnace heat of it, and through the warm door. The guardian sleeps on." },
            { goto: "reliquary" },
          ],
        },
        {
          id: "wake_guardian",
          label: "rouse it now, and face it awake rather than at your back",
          effects: [
            { say: "You decide you would rather face it awake and ready than creep past it and feel it wake behind you. You take up a loose stone and throw it hard against the far wall to bring it round clean." },
            { say: "The great pale shape does not startle. It simply stops sleeping. One milky eye rolls open, and finds you, blind and certain, and holds." },
            { say: "It uncoils off the ash without hurry, length after length after length of it, more than the room ever seemed able to hold, and the heat of it rolls ahead of it like an opened oven. You have made a mistake with no bottom to it." },
            { say: "There is nowhere to go in this round warm room that it cannot reach first. It takes its time about you. So, in the end, does the dark." },
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
            { say: "You lift it, and it settles into your hand and beats there, warm and awful, and the guardian in the next room does not so much as stir. It is yours to carry now, whatever that turns out to mean." },
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
            { say: "You put it into the fire. It fights, beating harder, blazing white, and then all at once it is only a coal like any other, and then it is ash, and then it is nothing at all. The warmth goes out of the walls behind you." },
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
      text: "The climb back is longer than the way down ever was. The warmth falls away behind you and the cold {daylight} grows ahead, and at the top a ragged circle of ordinary grey {sky} widens over you. A {way} out stands open at the head of the climb, waiting to take your weight one last time.",
      looks: [
        {
          noun: "daylight",
          text: "Closer now, and vast, and free. You had half forgotten the sky could be so large a thing.",
        },
        {
          noun: "sky",
          text: "Grey, and low, and ordinary, and the most beautiful thing you have seen in a long time. Beyond the lip of the climb the plague-struck city goes about its slow dying, not yet knowing what you chose down here on its behalf.",
        },
        {
          noun: "way",
          text: "The last of the climb: a rope, or iron rungs, or a stair, whichever of the four ways down you took to get here. Whatever else this place took from you, it did not take your way out.",
        },
      ],
      choices: [
        {
          id: "climb_out",
          label: "climb out into the morning",
          effects: [
            { say: "You climb, and the dark lets you go, and the cold grey morning takes you back." },
            { end: "won" },
          ],
        },
      ],
    },
  },
};

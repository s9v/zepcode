import "zep-script";

namespace utils {
  export function log(s) {
    ScriptApp.sayToAll(s);
  }
}

class PlayerState {
  id;
  picked_object;

  constructor(id) {
    this.id = id;
    this.picked_object = null;
  }
}

class PlayerStateCollection {
  player_states;

  constructor() {
    this.player_states = {};
  }

  get(id) {
    if (!this.player_states.hasOwnProperty(id)) {
      this.player_states[id] = new PlayerState(id);
    }
    
    return this.player_states[id];
  }

  has(id) {
    return this.player_states.hasOwnProperty(id);
  }
}

class HouseItemsCollection {
  coords;

  constructor() {
    this.coords = {};
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  has(x, y) {
    return this.coords.hasOwnProperty(this._key(x, y));
  }

  put(x, y, sprite) {
    utils.log(`put house item ${x} ${y} ${sprite}`);
    ScriptMap.putObject(x, y, sprite, { overlap: true });
    this.coords[this._key(x, y)] = sprite;
  }

  remove(x, y) {
    let old_obj = this.coords[this._key(x, y)] || null;

    utils.log(`remove house item ${x} ${y} ${old_obj}`);

    ScriptMap.putObject(x, y, null);
    this.coords[this._key(x, y)] = null;

    return old_obj;
  }
}

let house_items = new HouseItemsCollection();
let zeplogo = ScriptApp.loadSpritesheet("zep_logo.png");
let blueman = ScriptApp.loadSpritesheet("blueman.png");
let player_states = new PlayerStateCollection();

// App
ScriptApp.onStart.Add(onStart);
ScriptApp.onDestroy.Add(onDestroy);
// Player
ScriptApp.onJoinPlayer.Add(onJoinPlayer);
// OnKeyDown
ScriptApp.addOnKeyDown(70, key_F);
ScriptApp.addOnKeyDown(81, key_Q);
ScriptApp.addOnKeyDown(69, key_E);
ScriptApp.addOnKeyDown(84, key_T);
ScriptApp.addOnKeyDown(82, key_R);



// === App lifecycle ===

function onStart() {
  for (const x of [...Array(200).keys()]) {
    for (const y of [...Array(200).keys()]) {
      ScriptApp.addOnTileTouched(x, y, function (player) {
        onTileTouched(x, y, player);
      });
   }
  }

  // debug
  ScriptMap.putObject(30, 57, blueman, { overlap: true });
  ScriptMap.moveObject(30, 57, 40, 67, 0);
}

function onDestroy() {
  ScriptMap.clearAllObjects();
}

// === Player lifecycle ===

function onJoinPlayer(player) {
  player.showCenterLabel(`player ${player.name} joined. Gazzzaaa!`);
}

function onTileTouched(x, y, player) {
}

// === Keys ===

function key_F(player) {
  let [x, y] = [player.tileX, player.tileY];
  
  let pstate = player_states.get(player.id);

  if (pstate.picked_object == null) {
    if (!house_items.has(x, y)) {
      utils.log(`nothing to pick up ${x} ${y}`);
      return;
    }

    let sprite = house_items.remove(x, y);

    utils.log(`picking up ${x} ${y} Sprite: ` + JSON.stringify(Object.keys(sprite)));

    pstate.picked_object = [x, y, sprite];
  } else {
    let [_x, _y, sprite] = pstate.picked_object;
    utils.log(`putting down ${x} ${y} Sprite: ` + JSON.stringify(Object.keys(sprite)));
    house_items.put(x, y, sprite);
    pstate.picked_object = null;
  }
}

function key_T(player) {
  house_items.put(player.tileX, player.tileY, blueman);
  utils.log(`put object (blueman) ${player.tileX}, ${player.tileY}`);
}

function key_R(player) {
  house_items.put(player.tileX, player.tileY, zeplogo);
  utils.log(`put object (zeplogo) ${player.tileX}, ${player.tileY}`);
}

function key_Q(player) {}
function key_E(player) {}

ScriptApp.onJoinPlayer.Add(function(player){
  // ScriptMap.moveObject(40, 67, 40, 67, 0);

})

// ScriptApp.onUpdate.Add(function (dt) {
//   for (let id in ScriptApp.players) {
//     if (!(id in picked_object_coord))
//       return;

//     let player = ScriptApp.players[id];
//     let [object_x, object_y] = picked_object_coord[id];
//     ScriptMap.moveObject(object_x, object_y, player.tileX, player.tileY, 1);
//     utils.log(`${object_x}, ${object_y}, ${player.tileX}, ${player.tileY}`);
//   }
// });
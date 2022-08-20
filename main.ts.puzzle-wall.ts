// Multiplayer wall puzzle

import "zep-script";
import { ScriptPlayer, TileEffectType } from "zep-script";

namespace utils {
  export function log(s) {
    ScriptApp.sayToAll(s);
  }
}

enum WallOrientation {
  NS,
  WE,
}

class PuzzleMap {
  x;
  y;
  w;
  h;
  walls;
  remotes;

  constructor(x, y, w, h) {
    utils.log("Calling PuzzleMap constructor()");
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.walls = [];
  }

  init() {
    utils.log("Calling PuzzleMap init()");
    this.render();

    this.addWalls();

  }

  addRemotes() {
    let remote1 = new WallRemote(4, 0, this.x, this.y);
    let remote2 = new WallRemote(0, 4, this.x, this.y);
    this.remotes.push(remote1, remote2)

    for (const remote of this.remotes) {
      remote.render();
      
    }
  }

  addWalls() {
    let wall1 = new PuzzleWall(4, 0, WallOrientation.NS, this.x, this.y);
    let wall2 = new PuzzleWall(0, 4, WallOrientation.WE, this.x, this.y);
    this.walls.push(wall1, wall2)

    for (const wall of this.walls) {
      wall.show();
    }
  }

  show() {
      this.walls[0].show();
  }

  hide() {
    this.walls[1].hide();
  }

  render() {
    // for (let i = this.x; i < this.x + this.w; i++) {
    //   for (let i = this.x; i < this.x + this.w; i++) {
    //     // ...
    //   }
    // }
  }
}

class PuzzleWall {
  x;
  y;
  dx;
  dy;
  orient;
  cells: Array<Array<number>>;

  constructor(x, y, orient, dx = 0, dy = 0) {
    x += dx;
    y += dy;
    this.x = x;
    this.y = y;
    this.orient = orient;

    let deltas = [];
    if (orient == WallOrientation.NS) {
      deltas = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    } else if (orient == WallOrientation.WE) {
      deltas = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
    }
    
    this.cells = [];
    for (const delta of deltas) {
      let [dx, dy] = delta;
      this.cells.push([x + dx, y + dy]);
    }

    utils.log(`wall: ${x} ${y} ${orient} ${dx} ${dy}`);
    for (const cell of this.cells) {
      let [xx, yy] = cell;
      utils.log(`--> cells: ${xx} ${yy}`);
    }
  }

  show() {
    for (const cell of this.cells) {
      let [x, y] = cell;

      ScriptMap.putObject(x, y, wallcell);
      ScriptMap.putTileEffect(x, y, TileEffectType.IMPASSABLE);
    }
  }

  hide() {
    for (const cell of this.cells) {
      let [x, y] = cell;

      ScriptMap.putObject(x, y, null);
      ScriptMap.putTileEffect(x, y, TileEffectType.NONE);
    }
  }
}

class WallRemote {
  x;
  y;

  constructor(x, y, dx = 0, dy = 0) {
    x += dx;
    y += dy;
    this.x = x;
    this.y = y;
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

// load sprite
let redman = ScriptApp.loadSpritesheet('redman.png', 48, 64, {
  left: [5, 6, 7, 8, 9],       // defined base anim 
  up: [15, 16, 17, 18, 19],    // defined base anim 
  down: [0, 1, 2, 3, 4],       // defined base anim 
  right: [10, 11, 12, 13, 14], // defined base anim 
}, 16);

// load sprite
let blueman = ScriptApp.loadSpritesheet('blueman.png', 48, 64, {
  left: [5, 6, 7, 8, 9],
  up: [15, 16, 17, 18, 19],
  down: [0, 1, 2, 3, 4],
  right: [10, 11, 12, 13, 14],
}, 16);

//left: [34, 2, 27, 28, 27, 28],
let blueman_pickup02 = ScriptApp.loadSpritesheet('blueman/tile002.png');
let blueman_pickup34 = ScriptApp.loadSpritesheet('blueman/tile034.png');
let oldman_pickup04 = ScriptApp.loadSpritesheet('oldman_pickup/tile004.png');
let oldman_pickup05 = ScriptApp.loadSpritesheet('oldman_pickup/tile005.png');
//
let wallcell = ScriptApp.loadSpritesheet("wallcell.png");

let house_items = new HouseItemsCollection();
let blueman_static = ScriptApp.loadSpritesheet("blueman_static.png");
let player_states = new PlayerStateCollection();
//
let puzzlemap = new PuzzleMap(10, 10, 47, 22);

// App
ScriptApp.onStart.Add(onStart);
ScriptApp.onUpdate.Add(onUpdate);
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
  for (const x of [...Array(64).keys()]) {
    for (const y of [...Array(64).keys()]) {
      ScriptApp.addOnTileTouched(x, y, function (player) {
        onTileTouched(x, y, player);
      });
   }
  }
}

let after_start_called = false;
function onUpdate() {
  if (!after_start_called) {
    utils.log("Calling afterStart...");
    afterStart();
    after_start_called = true;
  }
  
  for (let id in ScriptApp.players) {
    let player = ScriptApp.players[id];

    let anim = player.tag.pickup_anim || null;

    if (anim != null) {
      utils.log(`player [${player.name}] - anim ${anim}`);

      if (anim == 1) {
        player.sprite = redman;
        player.sendUpdated();
      }

      if (anim > 0) {
        player.tag.pickup_anim--;
        player.save();
      }
    }
  }
}

function afterStart() {
  puzzlemap.init();
}

function onDestroy() {
  ScriptMap.clearAllObjects();
}

// === Player lifecycle ===

function onJoinPlayer(player) {
  puzzlemap.init();

  player.tag = {}
  player.save();
  player.showCenterLabel(`player ${player.name} joined. Gazzzaaa!`);
}

function onTileTouched(x, y, player) {
}

// === Keys ===

function key_F(player) {
  let [x, y] = [player.tileX, player.tileY];
  
  // player.tag.pickup_anim = 100;
  player.sprite = oldman_pickup04;
  player.sendUpdated();
  player.save();

  // ScriptApp.runLater(
  //   ScriptApp.runLater(function() {
  //     player.sprite = redman;
  //     player.sendUpdated();
  //   }, 0.2);
  // }, 0.2);
  
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
  // house_items.put(player.tileX, player.tileY, blueman_static);
  // utils.log(`put object (blueman_static) ${player.tileX}, ${player.tileY}`);
  utils.log(`location ${player.tileX}, ${player.tileY}`);
}

function key_R(player) {
}

function key_Q(player) {
  puzzlemap.show();
}
function key_E(player) {
  puzzlemap.hide();
}

ScriptApp.onJoinPlayer.Add(function(player){
  // ScriptMap.moveObject(40, 67, 40, 67, 0);
  player.sprite = redman;
  utils.log('redman set!');
  player.sendUpdated();
});

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
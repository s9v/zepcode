"use strict";
exports.__esModule = true;
require("zep-script");
ScriptApp.onJoinPlayer.Add(function (player) {
    ScriptApp.sayToAll("afsdkjfajlksbdfjl");
});
// namespace utils {
//     export function log(s) {
//         ScriptApp.sayToAll(s);
//     }
//     export function warn(s) {
//         log('WARNING: ' + s);
//     }
// }
// namespace sprites {
//     export namespace common {
//         // load sprite
//         export let redman = ScriptApp.loadSpritesheet('redman.png', 48, 64, {
//             left: [5, 6, 7, 8, 9],       // defined base anim 
//             up: [15, 16, 17, 18, 19],    // defined base anim 
//             down: [0, 1, 2, 3, 4],       // defined base anim 
//             right: [10, 11, 12, 13, 14], // defined base anim 
//         }, 16);
//         // load sprite
//         export let blueman = ScriptApp.loadSpritesheet('blueman.png', 48, 64, {
//             left: [5, 6, 7, 8, 9],
//             up: [15, 16, 17, 18, 19],
//             down: [0, 1, 2, 3, 4],
//             right: [10, 11, 12, 13, 14],
//         }, 16);
//         export let blueman_pickup02 = ScriptApp.loadSpritesheet('blueman/tile002.png');
//         export let blueman_pickup34 = ScriptApp.loadSpritesheet('blueman/tile034.png');
//         export let oldman_pickup04 = ScriptApp.loadSpritesheet('oldman_pickup/tile004.png');
//         export let oldman_pickup05 = ScriptApp.loadSpritesheet('oldman_pickup/tile005.png');
//     }
//     export namespace puzzle {
//         export let wallcell = ScriptApp.loadSpritesheet("wallcell.png");
//     }
// }
// namespace entry {
//     // === App lifecycle ===
//     function onStart() {
//         for (const x of [...Array(64).keys()]) {
//             for (const y of [...Array(64).keys()]) {
//                 ScriptApp.addOnTileTouched(x, y, function (player) {
//                     onTileTouched(x, y, player);
//                 });
//             }
//         }
//     }
//     let after_start_called = false;
//     function onUpdate() {
//         if (!after_start_called) {
//             afterStart();
//             after_start_called = true;
//         }
//     }
//     function afterStart() {
//         // puzzle.afterStart()
//     }
//     function onDestroy() {
//         ScriptMap.clearAllObjects();
//     }
//     // === Player lifecycle ===
//     function onJoinPlayer(player) {
//         // puzzle.onJoinPlayer();
//         player.showCenterLabel(`player ${player.name} joined. Energia buubm!`);
//     }
//     function onTileTouched(x, y, player) {
//         // puzzle.onTileTouched(x, y, player);
//     }
//     // === Keys ===
//     function key_F(player) {
//     }
//     function key_T(player) {
//     }
//     function key_R(player) {
//     }
//     function key_Q(player) {
//         // puzzle.key_Q(player);
//     }
//     function key_E(player) {
//         // puzzle.key_E(player);
//     }
//     ScriptApp.onJoinPlayer.Add(function (player) {
//         utils.log("aaaaaaa");
//         utils.log("aaaaaaa");
//         utils.log("aaaaaaa");
//         utils.log("aaaaaaa");
//         utils.log("aaaaaaa");
//         utils.log("aaaaaaa");
//         // pickup_game.onJoinPlayer(player);
//         // puzzle.onJoinPlayer();
//     });
// }
// namespace puzzle {
//     enum WallOrientation {
//         NS,
//         WE,
//     }
//     class PuzzleWorld {
//         x;
//         y;
//         w;
//         h;
//         walls;
//         remotes;
//         cells;
//         constructor(x, y, w, h) {
//             utils.log("Calling PuzzleMap constructor()");
//             this.x = x;
//             this.y = y;
//             this.w = w;
//             this.h = h;
//             this.walls = [];
//             this.cells = {}
//         }
//         init() {
//             utils.log("Calling PuzzleMap init()");
//             this.render();
//             this.addWalls();
//         }
//         addRemotes() {
//             let remote1 = new WallRemote(4, 0, this.x, this.y);
//             let remote2 = new WallRemote(0, 4, this.x, this.y);
//             this.remotes.push(remote1, remote2)
//             for (const remote of this.remotes) {
//                 remote.render();
//             }
//         }
//         addWalls() {
//             let wall1 = new TogglableWall(this, 4, 0, WallOrientation.NS, this.x, this.y);
//             let wall2 = new TogglableWall(this, 0, 4, WallOrientation.WE, this.x, this.y);
//             this.walls.push(wall1, wall2)
//             for (const wall of this.walls) {
//                 wall.show();
//             }
//         }
//         show() {
//             this.walls[0].show();
//         }
//         hide() {
//             this.walls[1].hide();
//         }
//         render() {
//             // for (let i = this.x; i < this.x + this.w; i++) {
//             //   for (let i = this.x; i < this.x + this.w; i++) {
//             //     // ...
//             //   }
//             // }
//         }
//         overlaps(mc: Multicell) {
//             // TODO mc
//             mc.cells
//             return false;
//         }
//         key(x, y) {
//             return `${x} ${y}`;
//         }
//         // (x, y) has object?
//         has(x, y) {
//             return this.cells.hasOwnProperty(this.key(x, y))
//         }
//         get(x, y) {
//             return this.cells[this.key(x, y)];
//         }
//         add(x, y) {
//         }
//     }
//     class World {
//     }
//     class Multicell {
//         x;
//         y;
//         world;
//         delta_cells; // relative
//         cells; // current
//         constructor(world: PuzzleWorld, x, y, delta_cells) {
//             this.world = world;
//             this.x = x;
//             this.y = y;
//             this.delta_cells = delta_cells;
//             this.cells = [];
//             for (const dcell in delta_cells) {
//                 let [dx, dy] = dcell;
//                 let x = this.x + dx;
//                 let y = this.y + dy;
//                 this.cells.push([x, y]);
//             }
//         }
//         overlaps(other: Multicell) {
//             for (const cell in this.delta_cells) {
//             }
//         }
//     }
//     class TogglableWall extends Multicell {
//         x;
//         y;
//         dx;
//         dy;
//         orient;
//         cells: Array<Array<number>>;
//         constructor(world: PuzzleWorld, x, y, orient, dx = 0, dy = 0) {
//             let deltas = [];
//             if (orient == WallOrientation.NS) {
//                 deltas = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
//             } else if (orient == WallOrientation.WE) {
//                 deltas = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
//             }
//             super(world, x, y, deltas);
//             this.orient = orient;
//         }
//         show() {
//             if (this.world.overlaps(this)) {
//                 utils.warn(`wall about to show() overlaps with world`)
//             }
//             for (const cell of this.cells) {
//                 let [x, y] = cell;
//                 ScriptMap.putObject(x, y, sprites.puzzle.wallcell);
//                 ScriptMap.putTileEffect(x, y, TileEffectType.IMPASSABLE);
//             }
//         }
//         hide() {
//             for (const cell of this.cells) {
//                 let [x, y] = cell;
//                 ScriptMap.putObject(x, y, null);
//                 ScriptMap.putTileEffect(x, y, TileEffectType.NONE);
//             }
//         }
//     }
//     class WallRemote {
//         x;
//         y;
//         constructor(x, y, dx = 0, dy = 0) {
//             x += dx;
//             y += dy;
//             this.x = x;
//             this.y = y;
//         }
//     }
//     export function afterStart() {
//         // puzzlemap.init();
//     }
//     export function onJoinPlayer() {
//         world.init();
//     }
//     let world = new PuzzleWorld(10, 10, 47, 22);
// }

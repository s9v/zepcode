import "zep-script";
import { ScriptPlayer, TileEffectType } from "zep-script";


namespace utils {
    export function log(s) {
        ScriptApp.sayToAll(s);
    }

    export function warn(s) {
        log('WARNING: ' + s);
    }
}

namespace sprites {
    export namespace common {
        // load sprite
        export const redman = ScriptApp.loadSpritesheet('redman.png', 48, 64, {
            left: [5, 6, 7, 8, 9],       // defined base anim 
            up: [15, 16, 17, 18, 19],    // defined base anim 
            down: [0, 1, 2, 3, 4],       // defined base anim 
            right: [10, 11, 12, 13, 14], // defined base anim 
        }, 16);

        // load sprite
        export const blueman = ScriptApp.loadSpritesheet('blueman.png', 48, 64, {
            left: [5, 6, 7, 8, 9],
            up: [15, 16, 17, 18, 19],
            down: [0, 1, 2, 3, 4],
            right: [10, 11, 12, 13, 14],
        }, 16);

        export const blueman_pickup02 = ScriptApp.loadSpritesheet('blueman/tile002.png');
        export const blueman_pickup34 = ScriptApp.loadSpritesheet('blueman/tile034.png');
        export const oldman_pickup04 = ScriptApp.loadSpritesheet('oldman_pickup/tile004.png');
        export const oldman_pickup05 = ScriptApp.loadSpritesheet('oldman_pickup/tile005.png');
    }

    export namespace puzzle {
        export const wallcell = ScriptApp.loadSpritesheet("wallcell.png");
        export const computer = ScriptApp.loadSpritesheet("computer.png");
    }
}

namespace entry {
    namespace events {
        // *** APP LIFECYCLE ***

        export function onStart() {
            for (const x of [...Array(64).keys()]) {
                for (const y of [...Array(64).keys()]) {
                    ScriptApp.addOnTileTouched(x, y, function (player) {
                        onTileTouched(x, y, player);
                    });
                }
            }
        }

        let after_start_called = false;
        export function onUpdate() {
            if (!after_start_called) {
                afterStart();
                after_start_called = true;
            }
        }

        export function afterStart() {
            // puzzle.afterStart()
        }

        export function onDestroy() {
            ScriptMap.clearAllObjects();
        }

        // *** PLAYER LIFECYCLE ***

        export function onTileTouched(x, y, player) {
            puzzle.onTileTouched(x, y, player);
        }

        // *** KEYS ***

        export function key_F(player) {
        }

        export function key_T(player) {
            puzzle.key_T(player);
        }

        export function key_R(player) {
        }

        export function key_Q(player) {
            puzzle.key_Q(player);
        }

        export function key_E(player) {
            puzzle.key_E(player);
        }

        export function onJoinPlayer(player) {
            puzzle.onJoinPlayer();
            player.showCenterLabel(`player ${player.name} joined.`);
        }
    }

    // App
    ScriptApp.onStart.Add(events.onStart);
    ScriptApp.onUpdate.Add(events.onUpdate);
    ScriptApp.onDestroy.Add(events.onDestroy);

    // Player
    ScriptApp.onJoinPlayer.Add(events.onJoinPlayer);

    // OnKeyDown
    ScriptApp.addOnKeyDown(70, events.key_F);
    ScriptApp.addOnKeyDown(81, events.key_Q);
    ScriptApp.addOnKeyDown(69, events.key_E);
    ScriptApp.addOnKeyDown(84, events.key_T);
    ScriptApp.addOnKeyDown(82, events.key_R);
}

namespace puzzle {
    enum WallOrientation {
        NS,
        WE,
    }

    class PuzzleWorld {
        x;
        y;
        w;
        h;
        walls: Array<TogglableWall>;
        remotes: Array<WallRemote>;
        cells;
        tile_dispatcher: TileTouchDispatcher;

        constructor(x, y, w, h) {
            utils.log("Calling PuzzleMap constructor()");
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.walls = [];
            this.remotes = [];
            this.cells = {}
            this.tile_dispatcher = new TileTouchDispatcher(this.x, this.y);
        }

        init() {
            utils.log("Calling PuzzleMap init()");
            this.render();

            this.addStuff();
            // this.addWalls();
            // this.addRemotes();
        }

        addRemotes() {
            let remote1 = new WallRemote(this, 4, 0, this.walls[0]);
            let remote2 = new WallRemote(this, 0, 4, this.walls[1]);
            this.remotes.push(remote1, remote2)

            for (const remote of this.remotes) {
                remote.render();
            }
        }

        addWalls() {
            let wall1 = new TogglableWall(this, 5, 0, WallOrientation.NS);
            let wall2 = new TogglableWall(this, 0, 5, WallOrientation.WE);
            this.walls.push(wall1, wall2)

            for (const wall of this.walls) {
                // wall.show();
            }
        }

        addStuff() {
            let w1 = new TogglableWall(this, 5, 0, WallOrientation.NS);
            let w2 = new TogglableWall(this, 11, 0, WallOrientation.NS);
            let w3 = new TogglableWall(this, 17, 0, WallOrientation.NS);
            let w4 = new TogglableWall(this, 23, 0, WallOrientation.NS);
            let w7 = new TogglableWall(this, 11, 12, WallOrientation.NS);

            let w5 = new TogglableWall(this, 30, 12, WallOrientation.WE);
            let w6 = new TogglableWall(this, 12, 5, WallOrientation.WE);
            let w8 = new TogglableWall(this, 0, 26, WallOrientation.WE);
            // let w9 = new TogglableWall(this, 19, 31, WallOrientation.WE);

            this.walls.push(w1, w2, w3, w4, w7);
            this.walls.push(w5, w6, w8);

            for (const wall of this.walls) {
                wall.show();
            }

            let r1a = new WallRemote(this, 2, 2, w1);
            let r1b = new WallRemote(this, 10, 3, w1);

            let r2a = new WallRemote(this, 10, 5, w2);
            let r2b = new WallRemote(this, 15, 5, w2);

            let r4a = new WallRemote(this, 24, 5, w4);
            let r4b = new WallRemote(this, 26, 3, w4);

            let r3 = new WallRemote(this, 13, 9, w3);

            let r7a = new WallRemote(this, 14, 15, w7);
            let r7b = new WallRemote(this, 12, 17, w7);

            let r5 = new WallRemote(this, 4, 26, w5);
            let r6 = new WallRemote(this, 17, 5, w6);
            let r8 = new WallRemote(this, 34, 24, w8);

            // let r9 = new WallRemote(this, 34, 24, w9);
        }

        // show() {
        //     this.walls[0].show();
        // }

        // hide() {
        //     this.walls[0].hide();
        // }

        render() {
            // for (let i = this.x; i < this.x + this.w; i++) {
            //   for (let i = this.x; i < this.x + this.w; i++) {
            //     // ...
            //   }
            // }
        }

        overlaps(mc: Multicell) {
            // TODO mc
            for (const cell of mc.cells) {
                let [x, y] = cell;
                if (this.has(x, y) && this.get(x, y) != mc)
                    return true;
            }
            return false;
        }

        key(x, y) {
            return `${x} ${y}`;
        }

        // (x, y) has object?
        has(x, y) {
            return this.cells.hasOwnProperty(this.key(x, y)) && this.get(x, y) != null;
        }

        get(x, y) {
            return this.cells[this.key(x, y)] || null;
        }

        set(x, y, obj) {
            if (this.get(x, y) != null && this.get(x, y) != obj) {
                // throw new Error(`set error  already set! obj:${obj}  orig:${this.get(x, y)}`);
            }
            this.cells[this.key(x, y)] = obj;
        }

        setMulti(mc: Multicell) {
            for (const cell of mc.cells) {
                let [x, y] = cell;
                this.set(x, y, mc);
            }
        }

        unset(x, y, should_be_obj = null) {
            if (should_be_obj != null && this.get(x, y) != null && this.get(x, y) != should_be_obj) {
                // throw new Error(`unset error  should_be_obj:${should_be_obj}  orig:${this.get(x, y)}`);
            }
            this.cells[this.key(x, y)] = null;
        }

        unsetMulti(mc: Multicell) {
            for (const cell of mc.cells) {
                let [x, y] = cell;
                this.unset(x, y, mc);
            }
        }

        putObject(x, y, sprite, obj) {
            this.set(x, y, obj);
            ScriptMap.putObject(this.x + x, this.y + y, sprite);
            //~utils.log(`world.putObject ${this.x + x} ${this.y + y}`);
        }

        unputObject(x, y, should_be_obj) {
            this.unset(x, y, should_be_obj);
            ScriptMap.putObject(this.x + x, this.y + y, null);
        }

        putObjectImpassable(x, y, sprite, obj) {
            this.putObject(x, y, sprite, obj);
            ScriptMap.putTileEffect(this.x + x, this.y + y, TileEffectType.IMPASSABLE);
            //~utils.log(`world.putObjectImpassable ${this.x + x} ${this.y + y}`);
        }

        unputObjectImpassable(x, y, should_be_obj) {
            this.unputObject(x, y, should_be_obj);
            ScriptMap.putTileEffect(this.x + x, this.y + y, TileEffectType.NONE);
        }
    }

    class Multicell {
        x;
        y;
        world: PuzzleWorld;
        delta_cells; // relative
        cells; // current

        constructor(world: PuzzleWorld, x, y, delta_cells) {
            this.world = world;
            this.x = x;
            this.y = y;
            this.delta_cells = delta_cells;
            this.cells = [];

            for (const dcell of delta_cells) {
                let [dx, dy] = dcell;
                let x = this.x + dx;
                let y = this.y + dy;

                this.cells.push([x, y]);
            }
        }
    }

    class TogglableWall extends Multicell {
        x;
        y;
        dx;
        dy;
        orient;
        shows;

        constructor(world: PuzzleWorld, x, y, orient) {
            let deltas = [];
            if (orient == WallOrientation.NS) {
                deltas = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
            } else if (orient == WallOrientation.WE) {
                deltas = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
            } else {
                throw new Error(`Bad orient: ${orient}`);
            }

            super(world, x, y, deltas);
            this.orient = orient;
            this.shows = 0;
        }

        show() {
            this.shows++;
            //~ throw new Error('*** FOR DEBUG ***');

            if (this.world.overlaps(this)) {
                utils.warn(`wall about to show() overlaps with world`)
            }

            for (const cell of this.cells) {
                let [x, y] = cell;

                this.world.putObjectImpassable(x, y, sprites.puzzle.wallcell, this);
            }
        }

        hide() {
            this.shows--;

            if (this.shows > 0)
                return;

            this.world.unsetMulti(this);

            for (const cell of this.cells) {
                let [x, y] = cell;

                this.world.unputObjectImpassable(x, y, this);
            }
        }
    }

    class WallRemote extends Multicell {
        x;
        y;
        wall: TogglableWall;

        constructor(world, x, y, wall) {
            super(world, x, y, [[0, 0]]);

            this.world.tile_dispatcher.registerTouch(x, y, this.onTouch.bind(this));
            this.world.tile_dispatcher.registerUntouch(x, y, this.onUntouch.bind(this));

            this.x = x;
            this.y = y;
            this.wall = wall;
        }

        render() {
            this.world.putObject(this.x, this.y, sprites.puzzle.computer, this);
        }

        onTouch() {
            this.wall.hide();
        }

        onUntouch() {
            this.wall.show();
        }
    }

    class TileTouchDispatcher {
        world_x;
        world_y;
        last_x;
        last_y;
        touch_cbs;
        untouch_cbs;

        constructor(world_x, world_y) {
            this.world_x = world_x;
            this.world_y = world_y;
            this.last_x = null;
            this.last_y = null;
            this.touch_cbs = {};
            this.untouch_cbs = {};
        }

        key(x, y) {
            return `${x} ${y}`;
        }

        registerTouch(x, y, cb) {
            let e = this.touch_cbs[this.key(x, y)] || [];
            e.push(cb);
            this.touch_cbs[this.key(x, y)] = e;
        }

        registerUntouch(x, y, cb) {
            let e = this.untouch_cbs[this.key(x, y)] || [];
            e.push(cb);
            this.untouch_cbs[this.key(x, y)] = e;
        }

        onTouch(x, y, player) {
            x -= this.world_x;
            y -= this.world_y;

            // utils.log(`onTouch xy ${x} ${y} lastxy ${this.last_x} ${this.last_y}`);

            if (this.last_x != null && this.last_y != null
                && (this.last_x != x || this.last_y != y)) {

                // utils.log(`untouch xy ${x} ${y} lastxy ${this.last_x} ${this.last_y}`);
                let untouch_cbs = this.untouch_cbs[this.key(this.last_x, this.last_y)] || null;

                if (untouch_cbs != null)
                    for (const cb of untouch_cbs) {
                        // utils.log(`onTouch cb for ${x}`)
                        cb();
                    }
            }

            let touch_cbs = this.touch_cbs[this.key(x, y)] || null;

            if (touch_cbs != null)
                for (const cb of touch_cbs)
                    cb();

            this.last_x = x;
            this.last_y = y;
        }
    }

    export function afterStart() {
        // puzzlemap.init();
    }

    export function onJoinPlayer() {
        world.init();
    }

    export function onTileTouched(x: any, y: any, player: any) {
        world.tile_dispatcher.onTouch(x, y, player);
    }

    export function key_T(player) {
        // utils.log(`player @ ${player.tileX} ${player.tileY}`);
    }

    export function key_Q(player) {
        // world.hide();
    }

    export function key_E(player) {
        // world.show();
    }

    let world = new PuzzleWorld(4, 4, 64, 64);
}
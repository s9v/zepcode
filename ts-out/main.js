"use strict";
// Multiplayer wall puzzle
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
require("zep-script");
var zep_script_1 = require("zep-script");
// import * as ayooo from "./utils";
// ayooo.log();
var utils;
(function (utils) {
    function log(s) {
        ScriptApp.sayToAll(s);
    }
    utils.log = log;
})(utils || (utils = {}));
var WallOrientation;
(function (WallOrientation) {
    WallOrientation[WallOrientation["NS"] = 0] = "NS";
    WallOrientation[WallOrientation["WE"] = 1] = "WE";
})(WallOrientation || (WallOrientation = {}));
var PuzzleMap = /** @class */ (function () {
    function PuzzleMap(x, y, w, h) {
        utils.log("Calling PuzzleMap constructor()");
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.walls = [];
    }
    PuzzleMap.prototype.init = function () {
        utils.log("Calling PuzzleMap init()");
        this.render();
        this.addWalls();
    };
    PuzzleMap.prototype.addRemotes = function () {
        var e_1, _a;
        var remote1 = new WallRemote(4, 0, this.x, this.y);
        var remote2 = new WallRemote(0, 4, this.x, this.y);
        this.remotes.push(remote1, remote2);
        try {
            for (var _b = __values(this.remotes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var remote = _c.value;
                remote.render();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    PuzzleMap.prototype.addWalls = function () {
        var e_2, _a;
        var wall1 = new PuzzleWall(4, 0, WallOrientation.NS, this.x, this.y);
        var wall2 = new PuzzleWall(0, 4, WallOrientation.WE, this.x, this.y);
        this.walls.push(wall1, wall2);
        try {
            for (var _b = __values(this.walls), _c = _b.next(); !_c.done; _c = _b.next()) {
                var wall = _c.value;
                wall.show();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    PuzzleMap.prototype.show = function () {
        this.walls[0].show();
    };
    PuzzleMap.prototype.hide = function () {
        this.walls[1].hide();
    };
    PuzzleMap.prototype.render = function () {
        // for (let i = this.x; i < this.x + this.w; i++) {
        //   for (let i = this.x; i < this.x + this.w; i++) {
        //     // ...
        //   }
        // }
    };
    return PuzzleMap;
}());
var PuzzleWall = /** @class */ (function () {
    function PuzzleWall(x, y, orient, dx, dy) {
        var e_3, _a, e_4, _b;
        if (dx === void 0) { dx = 0; }
        if (dy === void 0) { dy = 0; }
        x += dx;
        y += dy;
        this.x = x;
        this.y = y;
        this.orient = orient;
        var deltas = [];
        if (orient == WallOrientation.NS) {
            deltas = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
        }
        else if (orient == WallOrientation.WE) {
            deltas = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
        }
        this.cells = [];
        try {
            for (var deltas_1 = __values(deltas), deltas_1_1 = deltas_1.next(); !deltas_1_1.done; deltas_1_1 = deltas_1.next()) {
                var delta = deltas_1_1.value;
                var _c = __read(delta, 2), dx_1 = _c[0], dy_1 = _c[1];
                this.cells.push([x + dx_1, y + dy_1]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (deltas_1_1 && !deltas_1_1.done && (_a = deltas_1["return"])) _a.call(deltas_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        utils.log("wall: " + x + " " + y + " " + orient + " " + dx + " " + dy);
        try {
            for (var _d = __values(this.cells), _e = _d.next(); !_e.done; _e = _d.next()) {
                var cell = _e.value;
                var _f = __read(cell, 2), xx = _f[0], yy = _f[1];
                utils.log("--> cells: " + xx + " " + yy);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d["return"])) _b.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    PuzzleWall.prototype.show = function () {
        var e_5, _a;
        try {
            for (var _b = __values(this.cells), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cell = _c.value;
                var _d = __read(cell, 2), x = _d[0], y = _d[1];
                ScriptMap.putObject(x, y, wallcell);
                ScriptMap.putTileEffect(x, y, zep_script_1.TileEffectType.IMPASSABLE);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    PuzzleWall.prototype.hide = function () {
        var e_6, _a;
        try {
            for (var _b = __values(this.cells), _c = _b.next(); !_c.done; _c = _b.next()) {
                var cell = _c.value;
                var _d = __read(cell, 2), x = _d[0], y = _d[1];
                ScriptMap.putObject(x, y, null);
                ScriptMap.putTileEffect(x, y, zep_script_1.TileEffectType.NONE);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    return PuzzleWall;
}());
var WallRemote = /** @class */ (function () {
    function WallRemote(x, y, dx, dy) {
        if (dx === void 0) { dx = 0; }
        if (dy === void 0) { dy = 0; }
        x += dx;
        y += dy;
        this.x = x;
        this.y = y;
    }
    return WallRemote;
}());
var PlayerState = /** @class */ (function () {
    function PlayerState(id) {
        this.id = id;
        this.picked_object = null;
    }
    return PlayerState;
}());
var PlayerStateCollection = /** @class */ (function () {
    function PlayerStateCollection() {
        this.player_states = {};
    }
    PlayerStateCollection.prototype.get = function (id) {
        if (!this.player_states.hasOwnProperty(id)) {
            this.player_states[id] = new PlayerState(id);
        }
        return this.player_states[id];
    };
    PlayerStateCollection.prototype.has = function (id) {
        return this.player_states.hasOwnProperty(id);
    };
    return PlayerStateCollection;
}());
var HouseItemsCollection = /** @class */ (function () {
    function HouseItemsCollection() {
        this.coords = {};
    }
    HouseItemsCollection.prototype._key = function (x, y) {
        return x + "," + y;
    };
    HouseItemsCollection.prototype.has = function (x, y) {
        return this.coords.hasOwnProperty(this._key(x, y));
    };
    HouseItemsCollection.prototype.put = function (x, y, sprite) {
        utils.log("put house item " + x + " " + y + " " + sprite);
        ScriptMap.putObject(x, y, sprite, { overlap: true });
        this.coords[this._key(x, y)] = sprite;
    };
    HouseItemsCollection.prototype.remove = function (x, y) {
        var old_obj = this.coords[this._key(x, y)] || null;
        utils.log("remove house item " + x + " " + y + " " + old_obj);
        ScriptMap.putObject(x, y, null);
        this.coords[this._key(x, y)] = null;
        return old_obj;
    };
    return HouseItemsCollection;
}());
// load sprite
var redman = ScriptApp.loadSpritesheet('redman.png', 48, 64, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14]
}, 16);
// load sprite
var blueman = ScriptApp.loadSpritesheet('blueman.png', 48, 64, {
    left: [5, 6, 7, 8, 9],
    up: [15, 16, 17, 18, 19],
    down: [0, 1, 2, 3, 4],
    right: [10, 11, 12, 13, 14]
}, 16);
//left: [34, 2, 27, 28, 27, 28],
var blueman_pickup02 = ScriptApp.loadSpritesheet('blueman/tile002.png');
var blueman_pickup34 = ScriptApp.loadSpritesheet('blueman/tile034.png');
var oldman_pickup04 = ScriptApp.loadSpritesheet('oldman_pickup/tile004.png');
var oldman_pickup05 = ScriptApp.loadSpritesheet('oldman_pickup/tile005.png');
//
var wallcell = ScriptApp.loadSpritesheet("wallcell.png");
var house_items = new HouseItemsCollection();
var blueman_static = ScriptApp.loadSpritesheet("blueman_static.png");
var player_states = new PlayerStateCollection();
//
var puzzlemap = new PuzzleMap(10, 10, 47, 22);
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
    var e_7, _a;
    var _loop_1 = function (x) {
        var e_8, _d;
        var _loop_2 = function (y) {
            ScriptApp.addOnTileTouched(x, y, function (player) {
                onTileTouched(x, y, player);
            });
        };
        try {
            for (var _e = (e_8 = void 0, __values(__spreadArray([], __read(Array(64).keys()), false))), _f = _e.next(); !_f.done; _f = _e.next()) {
                var y = _f.value;
                _loop_2(y);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_d = _e["return"])) _d.call(_e);
            }
            finally { if (e_8) throw e_8.error; }
        }
    };
    try {
        for (var _b = __values(__spreadArray([], __read(Array(64).keys()), false)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var x = _c.value;
            _loop_1(x);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
        }
        finally { if (e_7) throw e_7.error; }
    }
}
var after_start_called = false;
function onUpdate() {
    if (!after_start_called) {
        utils.log("Calling afterStart...");
        afterStart();
        after_start_called = true;
    }
    for (var id in ScriptApp.players) {
        var player = ScriptApp.players[id];
        var anim = player.tag.pickup_anim || null;
        if (anim != null) {
            utils.log("player [" + player.name + "] - anim " + anim);
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
    player.tag = {};
    player.save();
    player.showCenterLabel("player " + player.name + " joined. Energia!");
}
function onTileTouched(x, y, player) {
}
// === Keys ===
function key_F(player) {
    var _a = __read([player.tileX, player.tileY], 2), x = _a[0], y = _a[1];
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
    var pstate = player_states.get(player.id);
    if (pstate.picked_object == null) {
        if (!house_items.has(x, y)) {
            utils.log("nothing to pick up " + x + " " + y);
            return;
        }
        var sprite = house_items.remove(x, y);
        utils.log("picking up " + x + " " + y + " Sprite: " + JSON.stringify(Object.keys(sprite)));
        pstate.picked_object = [x, y, sprite];
    }
    else {
        var _b = __read(pstate.picked_object, 3), _x = _b[0], _y = _b[1], sprite = _b[2];
        utils.log("putting down " + x + " " + y + " Sprite: " + JSON.stringify(Object.keys(sprite)));
        house_items.put(x, y, sprite);
        pstate.picked_object = null;
    }
}
function key_T(player) {
    // house_items.put(player.tileX, player.tileY, blueman_static);
    // utils.log(`put object (blueman_static) ${player.tileX}, ${player.tileY}`);
    utils.log("location " + player.tileX + ", " + player.tileY);
}
function key_R(player) {
}
function key_Q(player) {
    puzzlemap.show();
}
function key_E(player) {
    puzzlemap.hide();
}
ScriptApp.onJoinPlayer.Add(function (player) {
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

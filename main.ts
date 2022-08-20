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

//model to receive response from api
type Crop = {
    id: string;
    startTime: number;
    lastWater: number;
    userId: number;
    growth: number;
    xCoordinate: number;
    yCoordinate: number;
}[]

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

// class NoticeBoard {
//     coords;

//     constructor() {
//         this.coords = {};
//     }

//     _key(x, y) {
//         return `${x},${y}`;
//     }

//     has(x, y) {
//         return this.coords.hasOwnProperty(this._key(x, y));
//     }
// }

class CropData {
    coords;
    id: string;
    userId: number;
    growth: number;

    constructor(coords, id, userId, growth) {
        this.coords = coords;
        this.id = id;
        this.userId = userId;
        this.growth = growth;
    }
}

class CropsCollection {
    listOfCrops: CropData[];

    constructor() {
        this.listOfCrops = [];
    }

    //init the local data of crops aftr fetching from api and spawn objs
    _init(response) {
        response.forEach(element => {
            // if (element == null) continue;
            let x = element.xCoordinate;
            let y = element.yCoordinate;
            this.add(x, y, element.id, element.userId, element.growth);
        });
    }

    _key(x, y) {
        return `${x},${y}`;
    }

    //to check if thrs a crop on that tile
    has(x, y) {
        return this.listOfCrops.hasOwnProperty(this._key(x, y));
    }

    add(x, y, id, userId, growth) {
        this.listOfCrops.push(new CropData(this._key(x, y), id, userId, growth));
        this.put(x, y, cropImgs[growth]);
    }

    put(x, y, sprite) {
        utils.log(`put crop ${x} ${y} ${sprite}`);
        ScriptMap.putObject(x, y, sprite, { overlap: true });
        this.listOfCrops[this._key(x, y)] = sprite;
    }

    update(x, y, growth) {
        utils.log(`crop grew at ${x} ${y} to ${growth}`);
        this.put(x, y, cropImgs[this.listOfCrops[this._key(x, y)].growth]);
        this.listOfCrops[this._key(x, y)] = cropImgs[this.listOfCrops[this._key(x, y)]];
    }

    remove(x, y) {
        let old_obj = this.listOfCrops[this._key(x, y)] || null;

        utils.log(`remove crop ${x} ${y} ${old_obj}`);

        ScriptMap.putObject(x, y, null);
        this.listOfCrops[this._key(x, y)] = null;

        return old_obj;
    }
}

let house_items = new HouseItemsCollection();
let crops = new CropsCollection();
let zeplogo = ScriptApp.loadSpritesheet("zep_logo.png");
let blueman = ScriptApp.loadSpritesheet("blueman.png");
let player_states = new PlayerStateCollection();

//load crop assets
let crop0 = ScriptApp.loadSpritesheet("crop0.png");
let crop1 = ScriptApp.loadSpritesheet("crop1.png");
let crop2 = ScriptApp.loadSpritesheet("crop2.png");
let crop3 = ScriptApp.loadSpritesheet("crop3.png");
//store into cropImgs
let cropImgs: any[] = [crop0, crop1, crop2, crop3];

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
ScriptApp.addOnKeyDown(80, key_P);



// === App lifecycle ===

function onStart() {
    for (const x of [...Array(200).keys()]) {
        for (const y of [...Array(200).keys()]) {
            ScriptApp.addOnTileTouched(x, y, function (player) {
                onTileTouched(x, y, player);
            });
        }
    }

    //call api to get all saved data on crops and init them
    ScriptApp.httpGet("https://busanhackathonapideploy.azurewebsites.net/", null, function (res) {
        //change the response to a json obj
        utils.log("init crops");
        let response = JSON.parse(res) as Crop;
        crops._init(response);
    })

    // Activates function when q is pressed 
    // App.addOnKeyDown Description (Link)
    ScriptApp.addOnKeyDown(81, function (player) {
        player.tag = {
            widget: null,
        }
        //if player is at the tile to interact wif noticeboard then can continue
        if (player.tileX == 30 && player.tileY == 14) {
          if (player.tag.widget == null){
            player.tag.widget = player.showWidget("sample.html", "top", 1000, 600);
            player.tag.widget.onMessage.Add(function (player, msg) {	// Closes the widget when the 'type: close' message is sent from the widget to the App 
              if (msg.type == "close") {
                player.showCenterLabel("Tour has ended");
                player.tag.widget.destroy();
                player.tag.widget = null;
              }
            })
          }
        }
    });

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

    if (!crops.has(x, y)) { //if tat tile not crop
        utils.log(`nothing to water/harvest/clean up ${x} ${y}`);
    }
    else { //if tile is crop
        //check if curr player id == crop.userId
        if (player.id == crops.listOfCrops[crops._key(x, y)].userId) {
            //can call api to do action
            //< 0 means withered, can clean up > 2 means can harvest
            if (crops.listOfCrops[crops._key(x, y)].growth < 0 || crops.listOfCrops[crops._key(x, y)].growth > 2) {
                //call api to harvest/clean
                ScriptApp.httpPost("https://busanhackathon.azure-api.net/v1/clean", null, { "id": crops.listOfCrops[crops._key(x, y)].id }, function (res) {
                    //if success, delete obj at x,y
                    crops.remove(x, y);
                    //if growth > 2, put harvest crop on ground
                    crops.put(x, y, zeplogo);
                    //pass in crop id to backend to up the growth
                    //then update the crop status
                })
            }
            else { //water the crop
                //call api to water crop
                ScriptApp.httpPost("https://busanhackathon.azure-api.net/v1/water-plant", null, { "id": crops.listOfCrops[crops._key(x, y)].id }, function (res) {
                    utils.log(res);
                    let response = JSON.parse(res) as Crop;
                    crops.update(response[0].xCoordinate, response[0].yCoordinate, response[0].growth);
                    //pass in crop id to backend to up the growth
                    //then update the crop status
                    utils.log("You just watered the crop");
                })
            }
        }
        else {
            utils.log(`You can't interact with crops that are not your's`);
        }
    }
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

function key_P(player) {
    //call api to plant
    utils.log("key press to plant");
    ScriptApp.httpPost("https://busanhackathon.azure-api.net/v1/plant-crops", null, { "userId": player.id, "xCoordinate": player.tileX, "yCoordinate": player.tileY }, function (res) {
        utils.log("posted");
        let response = JSON.parse(res) as Crop;
        crops.add(response[0].xCoordinate, response[0].yCoordinate, response[0].id, response[0].userId, response[0].growth);
        utils.log("You just planted a crop");
    })
}

function key_Q(player) { }
function key_E(player) { }

ScriptApp.onJoinPlayer.Add(function (player) {
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
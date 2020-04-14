const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
const { v4: uuidv4 } = require('uuid');


const PORT = 3000;
const SECOND = 1000;
const HBPS = 30;
const MOVE_TIME = .1;


var moveAmount = {
    x:0,
    y:0
};

var destPos = {
    x: 200,
    y: 200,
};

var position = {
    x: 200,
    y: 200,
};
var players = {}


Socketio.on("connection", socket => {
    var id = uuidv4()
    console.log("new player with id: " + id);
    players[id] = {position: {x:0, y:0}, destPos: {x:0, y:0}, color:[255,255,255], id: id, moveAmount: {x: 0, y: 0 }, isMoving: false};
    //TODO emit uuid for current player
    socket.emit("player_id", id);
    //TODO emit full maze
    //TODO emit all positions
    
    socket.emit("update", players);
    socket.on("move", direction => {
        if (!players[id].isMoving){
            switch(direction){
                case "left":
                    players[id].destPos.x -= 50;
                    break;
                case "right":
                    players[id].destPos.x += 50;
                    break;
                case "up":
                    players[id].destPos.y -=50;
                    break;
                case "down":
                    players[id].destPos.y +=50;
                    break;
            }
        }
    });

    socket.on("disconnect", () => {
        console.log(`player ${id} disconnected`);
        delete players[id];
        Socketio.emit("update", players);
    });
});


Http.listen(PORT, () => {
    console.log("Listening at :3000...");
});

setInterval(()=>{
    var anyChanged = false;
    var str = ""
    for(var key_id in players) {
        hasChanged = MoveToDestOverTime(players, key_id, MOVE_TIME * SECOND);
        anyChanged = anyChanged || hasChanged;
        if (hasChanged){
            str+= "    " +key_id + ': { x:' + players[key_id].position.x + ', y:' + players[key_id].position.y + '}\n';
        }
    }
    if (anyChanged){
        Socketio.emit("update", players);
        console.log("sent updated positions: \n" + str);
    }
},
SECOND/HBPS)


function MoveToDestOverTime(players, key_id, time) {

    if (players[key_id].isMoving == false && (players[key_id].position.x != players[key_id].destPos.x || players[key_id].position.y != players[key_id].destPos.y)){
        players[key_id].isMoving = true;
        players[key_id].moveAmount.x = (players[key_id].destPos.x - players[key_id].position.x) / (time/HBPS);
        players[key_id].moveAmount.y = (players[key_id].destPos.y - players[key_id].position.y) / (time/HBPS);
    }
    else if (players[key_id].isMoving == true && players[key_id].position.x == players[key_id].destPos.x && players[key_id].position.y == players[key_id].destPos.y){
        players[key_id].isMoving = false;
        //console.log("not moving anymore");
    }
    if (players[key_id].position.x == players[key_id].destPos.x && players[key_id].position.y == players[key_id].destPos.y)
        return false;
    players[key_id].position.x +=  absMin(players[key_id].moveAmount.x, (players[key_id].destPos.x-players[key_id].position.x));
    players[key_id].position.y +=  absMin(players[key_id].moveAmount.y, (players[key_id].destPos.y-players[key_id].position.y));
    return true;
    //console.log(pos)
}

function absMin(a,b){
    var num = Math.min(Math.abs(a), Math.abs(b));
    if (num == Math.abs(a))
        return a;
    else 
        return b;
}
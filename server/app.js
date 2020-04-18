const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);
const {
    v4: uuidv4
} = require('uuid');

const Player = require("../models/player.js");
const Maze = require("../models/maze.js");

const PORT = process.env.PORT || 3000;
const SECOND = 1000;
const HBPS = 30;
const MOVE_TIME = .15;
const MOVE_AMOUNT = 50;

/**
 * Dictionary of Player objects by their IDs
 * 
 */
var players = {}

var maze = new Maze(100,100,500,300,50,30);


Socketio.on("connection", socket => {
    //make a new player with an new id and send that data to client
    var id = uuidv4()
    console.log("new player with id: " + id);
    players[id] = new Player(id)
    socket.emit("player_id", id);
    //send the client all the player data
    socket.emit("update", players);

    socket.emit("maze", maze);
    
    //setup event listener for when this client moves, move their player position
    socket.on("move", direction => {
        move(id, direction);
    });

    //setup event listenr for disconnection. Delete the player from the list and send out updated list
    socket.on("disconnect", () => {
        console.log(`player ${id} disconnected`);
        delete players[id];
        Socketio.emit("update", players);
    });

});

//Begin listening at the given port
Http.listen(PORT, function () { //Updated
    var addr = Http.address();
    console.log('   app listening on http://' + addr.address + ':' + addr.port);
});



//Update and send out player locations every heartbeat
setInterval(() => {
        updatePositions()
    },
    //This is the amount of time to wait in milliseconds
    SECOND / HBPS);



//ALL THE LOCAL HELPER FUNCTIONS

/**
 * Moves player a given direction by an amount if they aren't already moving
 * @param {string} id player id
 * @param {string} direction "up", "left", etc
 */
function move(id, direction){
    if (!players[id].isMoving) {
        switch (direction) {
            case "left":
                players[id].destPos.x -= MOVE_AMOUNT;
                break;
            case "right":
                players[id].destPos.x += MOVE_AMOUNT;
                break;
            case "up":
                players[id].destPos.y -= MOVE_AMOUNT;
                break;
            case "down":
                players[id].destPos.y += MOVE_AMOUNT;
                break;
        }
    }
}


/**
 * Move each of the player positions closer to their destinations, and if any have changed, 
 * send updates to all clients for the new player positions
 */
function updatePositions(){
    var anyChanged = false;
        var str = ""
        for (var key_id in players) {
            hasChanged =  players[key_id].MoveToDestOverTime(MOVE_TIME, HBPS);
            anyChanged = anyChanged || hasChanged;
            if (hasChanged) {
                str += "    " + key_id + ': { x:' + players[key_id].position.x + ', y:' + players[key_id].position.y + '}\n';
            }
        }
        if (anyChanged) {
            Socketio.emit("update", players);
            console.log("sent updated positions: \n" + str);
        }
}
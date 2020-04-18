
<template>
    <vue-p5 v-on="{setup, draw, keypressed}" width="100vw" height="100vh"></vue-p5>
</template>

<script>
  //const Player = require('../../../models/player.js')
  const Maze = require('../../../models/maze.js');
  import VueP5 from 'vue-p5';
  import io from "socket.io-client";
  //var width = window.innerWidth;
  //var height = window.innerHeight;
  export default {
    name: 'MazeGame',
    data() {
      return {
        player_id: {},
        socket: {},
        context: {},
        maze: {},
        players: {},
        position: {},
        framecount: 0,
        fps: 0,
        secondsElapsed: 0,
        mazeAssigned: false
      }
    },
    components: {
      VueP5,
    },
    methods: {
      setup(sk){
        sk.createCanvas(window.innerWidth-10, window.innerHeight-10);
        sk.noStroke();
      },
      draw(sk) {
        sk.background(100,100,100);
        if (this.mazeAssigned){
          this.maze.display(sk);
        }
        this.framecount++;
        // draw a line between the previous
        // and the current mouse position
        sk.fill(255,255,255); 
        sk.text("FPS: "+(Math.round(this.fps * 100) / 100).toFixed(2),10,10);

        if (this.players != null){
          for (var key_id in this.players) {
            var player = this.players[key_id];
            sk.ellipse(player.position.x, player.position.y, 30, 30);
          }

          sk.fill(255,0,0);
          var current_player = this.players[this.player_id];
          sk.ellipse(current_player.position.x, current_player.position.y, 30, 30);
        }
      },
      keypressed(sk) {
        // convert the key code to it's string
        // representation and print it
        //const key = String.fromCharCode(sk.keyCode);
        //console.log(key + ": " + sk.keyCode.toString());
        var direction = "";
        switch (sk.keyCode){
          case 37:
            direction = "left";
            break;
          case 39:
            direction = "right";
            break;
          case 38:
            direction = "up";
            break;
          case 40:
            direction = "down";
            break;
        }
        //console.log(direction);
        if (direction != "")
          this.socket.emit("move", direction);
      },
      getFPS(){
        this.secondsElapsed++;
        this.fps = this.framecount/ this.secondsElapsed;
      }
    },
    created(){
      this.socket = io("http://localhost:3000");
      setInterval(this.getFPS, 1000);
    },
    mounted() {
      this.socket.on("update", data => {
        console.log("recieved updated positions");
        this.players = data;
      });
      this.socket.on("player_id", data => {
        console.log("recieved current player id");
        this.player_id = data;
      });
      this.socket.on("maze", data => {
        console.log(data);
        this.maze = new Maze();
        this.maze.convertFromObj(data);
        this.mazeAssigned = true;
      })
    },
  }
</script>

<style scoped>

</style>

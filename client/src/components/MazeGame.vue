
<template>
    <vue-p5 v-on="{setup, draw, keypressed}" width="100vw" height="100vh"></vue-p5>
</template>

<script>
  import VueP5 from 'vue-p5';
  import io from "socket.io-client";
  //var width = window.innerWidth;
  //var height = window.innerHeight;
  export default {
    name: 'MazeGame',
    data() {
      return {
        socket: {},
        context: {},
        maze: {},
        players: {},
        position: {},
        framecount: 0,
        fps: 0,
        secondsElapsed: 0,
      }
    },
    components: {
      VueP5,
    },
    methods: {
      setup(sk){
        sk.createCanvas(window.innerWidth-10, window.innerHeight-10);
      },
      draw(sk) {
        sk.background(100,100,100);
        this.framecount++;
        // draw a line between the previous
        // and the current mouse position
        sk.fill(255,255,255); 
        sk.ellipse(this.position.x,this.position.y, 100, 100);
        sk.text("FPS: "+(Math.round(this.fps * 100) / 100).toFixed(2),10,10);
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
      this.socket.on("position", data => {
        console.log("recieved new position");
        this.position = data;
      });
    },
  }
</script>

<style scoped>

</style>


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
        position: {}
      }
    },
    components: {
      VueP5,
    },
    methods: {
      setup(sk){
        sk.createCanvas(window.innerWidth, window.innerHeight);
        sk.background(100,100,100);
      },
      draw(sk) {

        // draw a line between the previous
        // and the current mouse position
        sk.line(sk.pmouseX, sk.pmouseY, sk.mouseX, sk.mouseY);
        sk.fill(255,255,255); 
        sk.ellipse(this.position.x,this.position.y, 100, 100);
      },
      keypressed(sk) {
        // convert the key code to it's string
        // representation and print it
        const key = String.fromCharCode(sk.keyCode);
        console.log(key + ": " + sk.keyCode.toString());
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
      //These are the key input handling methods. They send data to the server
    },
    created(){
      this.socket = io("http://localhost:3000");
    },
    mounted() {
      this.socket.on("position", data => {
        console.log("recieved new position");
        this.position = data;
      });
    }
  }
</script>

<style scoped>

</style>

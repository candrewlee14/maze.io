<template>
  <div id="app">
    <maze-game/>
  </div>
</template>

<script>
  import MazeGame from './components/MazeGame.vue'
  export default {
    name: 'App',
    components: {
      MazeGame
    }
  }
</script>

<style>
html {
  margin: 0;
  padding: 0;
}
body {
  margin: 0;
  padding: 0;
}
</style>

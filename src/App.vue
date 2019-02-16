<template>
  <div id="app">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: "app",
  components: {
    'app-header': Header
  },
  computed: {
    isRemoveWordEnabled: (context) =>
      context.$store.state.isRemoveModeEnabled,
  },
};
</script>

<style>
  @font-face {
    font-family: "ps";
    font-style: "normal";
    font-weight: 300;
    src: url("./assets/fonts/ps_regular.ttf");
  }

  @font-face {
    font-family: "ps-bold";
    font-style: "bold";
    font-weight: 700;
    src: url("./assets/fonts/ps_bold.ttf");
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    user-select: none;
  }

  #app {
    font-family: "ps", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 1em;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .none {
    display: none !important;
  }

  button {
    margin: 0.3em;
    padding: 0.5em 1em;
    background-color: navy;
    color: white;
    border-radius: 0.3em;
    border: none;
    font-family: "ps", "Avenir", Helvetica, Arial, sans-serif;
    font-size: 1em;
    cursor: pointer;
  }
</style>


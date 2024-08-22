<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  <!-- 路由主入口 -->
  <router-view></router-view>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
// import HelloWorld from './components/HelloWorld.vue';

@Options({
  components: {
    // HelloWorld,
  },
})
export default class App extends Vue {}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #e2e2e2;
}
div {
  margin: 0;
  padding: 0;
}
h1 {
  margin: 0;
  padding: 0;
}
</style>

<template>
  <div id="app"
       class="hello">

    <router-link to="/Hello">Hello | </router-link>
    <router-link to="/time">time | </router-link>
    <router-link to="/date">date</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

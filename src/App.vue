<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
import Storage from './util/storage'
export default {
  name: "app"
}
</script>

<style lang="scss">
@import "@/assets/scss/index.scss";
html,
body {
  width: 100%;
  height: 100%;
  #app {
    width: 100%;
    height: 100%;
  }
}
</style>

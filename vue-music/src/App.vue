<template>
  <div id="app">
    <m-header></m-header>
    <tabs></tabs>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script type="text/ecmascript-6">
  import MHeader from './components/m-header/m-header.vue'
  import Tabs from './components/tabs/tabs.vue'
  import Player from './components/player/player.vue'
  export default{
    components: {
      MHeader,
      Tabs,
      Player
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/variable.styl"
  #app{
    color $color-theme
  }
</style>

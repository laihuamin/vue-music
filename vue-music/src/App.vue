<template>
  <div id="app">
    <m-header></m-header>
    <tabs></tabs>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script type="text/ecmascript-6">
  import MHeader from './components/m-header/m-header.vue'
  import Tabs from './components/tabs/tabs.vue'
  export default{
    components: {
      MHeader,
      Tabs
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/variable.styl"
  #app{
    color $color-theme
  }
</style>

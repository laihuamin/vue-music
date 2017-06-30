<template>
  <div class="tabs">
    <router-link class="tabs-item" tag="div" to="/recommend">
      <span class="item-text">推荐</span>
    </router-link>
    <router-link class="tabs-item" tag="div" to="/singer">
      <span class="item-text">歌手</span>
    </router-link>
    <router-link class="tabs-item" tag="div" to="/rank">
      <span class="item-text">排行</span>
    </router-link>
    <router-link class="tabs-item" tag="div" to="/search">
      <span class="item-text">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default{}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
  .tabs{
    display flex;
    height 44px;
    line-height 44px
    font-size $font-size-medium
    .tabs-item{
      flex 1;
      text-align center;
      .item-text{
        padding-bottom 5px;
        color $color-text-l
      }
      &.router-link-active{
        .item-text{
          color $color-theme;
          border-bottom 2px solid $color-theme
        }
      }
    }
  }
</style>

<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="title">Min Love Nan</h1>
  </div>
</template>

<script type="text/ecmascript-6">
export default{}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
.m-header{
  height 44px;
  display flex;
  color $color-theme;
  padding 0 40px
  .icon{
    bg-image('logo');
    flex-basis 30px;
    height 32px;
    margin-top 6px
    background-size 30px 32px;
  }
  .title{
    flex 1;
    line-height 44px;
  }
}
</style>

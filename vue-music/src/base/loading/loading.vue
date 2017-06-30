<template>
  <div class="loading">
    <img width="24px" height="24px" src="./loading.gif" />
    <div class="desc">{{title}}</div>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .loading {
    width: 100%
    text-align: center
    .desc {
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
    }
  }
</style>

<template>
  <div class="progress-bar">
    <div class="bar-inner">
      <div class="progress"></div>
      <div class="progress-btn-wrapper">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar {
    height: 30px
    .bar-inner {
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress {
        position: absolute
        height: 100%
        background: $color-theme
        .progress-btn-wrapper {
          position: absolute
          left: -8px
          top: -13px
          width: 30px
          height: 30px
          .progress-btn {
            position: relative
            top: 7px
            left: 7px
            box-sizing: border-box
            width: 16px
            height: 16px
            border: 3px solid $color-text
            border-radius: 50%
            background: $color-theme
          }
        }
      }
    }
  }
</style>

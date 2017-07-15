<template>
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner" ref="banInner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"  ref="progressBtn"
           @touchstart.prevent="startTouch"
           @touchmove.prevent="moveTouch"
           @touchend="endTouch">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from '../../common/js/dom'
const PROGRESSBAR = 16
export default {
  props: {
    rate: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    startTouch (e) {
      this.touch.flag = true
      this.touch.startPoint = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    moveTouch (e) {
      if (!this.touch.flag) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startPoint
      let offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs.banInner.offsetWidth)
      this._offset(offsetWidth)
    },
    endTouch () {
      this.touch.flag = false
      this._sendMessage()
    },
    _sendMessage () {
      let width = this.$refs.banInner.clientWidth - PROGRESSBAR
      let rate = this.$refs.progress.clientWidth / width
      this.$emit('sendRate', rate)
    },
    progressClick (e) {
      this._offset(e.pageX)
      this._sendMessage()
    },
    _offset (num) {
      this.$refs.progress.style.width = `${num}px`
      this.$refs.progressBtn.style[prefixStyle('transform')] = `translate3d(${num}px, 0, 0)`
    }
  },
  watch: {
    rate (newRate) {
      if (newRate > 0 && !this.touch.flag) {
        let width = this.$refs.banInner.clientWidth - PROGRESSBAR
        let offsetWidth = width * newRate
        this._offset(offsetWidth)
      }
    }
  }
}
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
      }
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
</style>

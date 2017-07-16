<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner" >
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"  ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from '../../common/js/dom'
const PROGRESSBAR = 16
const transform = prefixStyle('transform')
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
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - PROGRESSBAR, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd () {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
      // this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent () {
      const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBAR
      const rate = this.$refs.progress.clientWidth / barWidth
      this.$emit('sendRate', rate)
    },
    _offset (offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    rate (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBAR
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
//  methods: {
//    startTouch (e) {
//      this.touch.flag = true
//      this.touch.startPoint = e.touches[0].pageX
//      this.touch.left = this.$refs.progress.clientWidth
//    },
//    moveTouch (e) {
//      if (!this.touch.flag) {
//        return
//      }
//      const deltaX = e.touches[0].pageX - this.touch.startPoint
//      this.touch.offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs.banInner.offsetWidth - PROGRESSBAR)
//      this._offset(this.touch.offsetWidth)
//    },
//    endTouch () {
//      this.touch.flag = false
//      this._sendMessage()
//    },
//    _sendMessage () {
//      let width = this.$refs.banInner.clientWidth - PROGRESSBAR
//      let rate = Math.min(this.touch.offsetWidth / width, 1)
//      this.$emit('sendRate', rate)
//    },
//    progressClick (e) {
//      const width = e.pageX
//      const rect = this.$refs.barInner.getBoundingClientRect()
//      this._offset(width - rect)
//      this._sendMessage()
//    },
//    _offset (num) {
//      this.$refs.progress.style.width = `${num}px`
//      this.$refs.progressBtn.style[prefixStyle('transform')] = `translate3d(${num}px, 0, 0)`
//    }
//  },
//  watch: {
//    rate (newRate) {
//      if (newRate > 0 && !this.touch.flag) {
//        const width = this.$refs.banInner.clientWidth - PROGRESSBAR
//        const offsetWidth = width * newRate
//        this._offset(offsetWidth)
//      }
//    }
//  }
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

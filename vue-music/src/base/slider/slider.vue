<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from '../../common/js/dom'
  export default{
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    // 组件被激活时调用
    activated () {
      if (this.autoPlay) {
        this._play()
      }
    },
    // 组件停用是调用
    deactivated () {
      clearTimeout(this.timer)
    },
    // 实例销毁前调用
    beforeDestroy () {
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth (isResize) {
        // 获取slider-group的子元素
        this.children = this.$refs.sliderGroup.children
        // 获取单个宽度
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        // 遍历每一个子元素，添加一个slider-item样式
        for (let i = 0; i < this.children.length; i++) {
          addClass(this.children[i], 'slider-item')
          this.children[i].style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // 循环滚动时，宽度要加上两倍的图片宽
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        // group的宽度
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,  // x方向滚动
          scrollY: false, // y方向不滚动
          momentum: false, // 当快速滑动时不开启滑动惯性
          snap: true, // slider组件可滑动
          snapLoop: this.loop, // 滚动时开启无缝滚动
          snapThreshold: 0.3,  // 滑动时切换阈值
          snapSpeed: 400  // 切换滚动动画的速度
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            this._play()
          }
        })
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _play () {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
          this.currentPageIndex = pageIndex - 1
        }, this.interval)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
  .slider{
    min-height 1px;
    .slider-group{
      position relative;
      overflow hidden;
      white-space nowrap
      .slider-item{
        float left;
        box-sizing border-box
        overflow hidden;
        text-align center;
        a{
          display block;
          width 100%;
          text-decoration none;
          overflow hidden
        }
        img{
          display block;
          width 100%;
        }
      }
    }
    .dots{
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot{
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active{
          width: 20px
          border-radius: 5px
          background: $color-text-ll
        }
      }
    }
  }
</style>

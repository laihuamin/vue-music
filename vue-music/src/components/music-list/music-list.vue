<template>
  <div class="music-list">
    <div class="back">
      <div class="icon-back" @click="back"></div>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!--<div class="play-wrapper">-->
        <!--<div ref="playBtn" class="play">-->
          <!--<i class="icon-play"></i>-->
          <!--<span class="text">随机播放全部</span>-->
        <!--</div>-->
      <!--</div>-->
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll class="list"
            :data="songs"
            :listen-scroll="listenScroll"
            @scroll="scroll"
            :probe-type="probeType"            
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import Loading from '../../base/loading/loading'
  import SongList from '../../base/song-list/song-list.vue'
  const TITLEHEIGHT = 42
  export default{
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        scrollY: 0
      }
    },
    created () {
      this.probeType = 3
      this.listenScroll = true
    },
    components: {
      Scroll,
      Loading,
      SongList
    },
    mounted () {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minHeight = -this.imageHeight + TITLEHEIGHT
      this.imageWidth = this.$refs.bgImage.clientWidth
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
      // this.$refs.layer.style.height = `${this.$refs.list.clientHeight}px`
      // console.log(this.$refs.list.clientHeight)
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      },
      enlargeImage () {
        let customHeight = this.imageHeight * 0.7
        let nowHeight = customHeight + this.scrollY
        let percent = nowHeight / customHeight
        return (this.imageWidth * percent)
      }
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minHeight, newY)
        let zIndex = 0
        this.$refs.layer.style.transform = `translate3d(0, ${translateY}px, 0)`
        if (newY < this.minHeight) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLEHEIGHT}px`
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
        if (newY > 0) {
          let nowWidth = this.enlargeImage
          this.$refs.bgImage.style.backgroundSize = `${nowWidth}px`
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .music-list {
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back {
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back {
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
      }
    }
    .title {
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    }
    .bg-image {
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper {
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play {
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play {
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          }
          .text {
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
          }
        }
      }
      .filter {
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
      }
    }
    .bg-layer {
      position: relative
      height: 100%
      background: $color-background
    }
    .list {
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper {
        padding: 20px 30px
      }
      .loading-container {
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
      }
    }
  }
</style>

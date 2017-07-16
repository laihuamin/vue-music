<template>
  <div class="music-list">
    <div class="back">
      <div class="icon-back" @click="back"></div>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length && this.playerShow" @click="randomPlaying">
        <div ref="playBtn" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
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
        <song-list @select="selectItem" :songs="songs"></song-list>
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
  import {prefixStyle} from '../../common/js/dom'
  import {mapActions} from 'vuex'
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
        scrollY: 0,
        playerShow: true
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
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    methods: {
      scroll (pos) {
        this.scrollY = pos.y
      },
      back () {
        this.$router.back()
      },
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs,
          index: index
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      randomPlaying () {
        this.randomPlay({
          list: this.songs
        })
      }
    },
    computed: {
      bgStyle () {
        return `background-image:url(${this.bgImage})`
      }
    },
    watch: {
      scrollY (newY) {
        let translateY = Math.max(this.minHeight, newY)
        let zIndex = 0
        let scale = 1
        this.$refs.layer.style[prefixStyle('transform')] = `translate3d(0, ${translateY}px, 0)`
        if (newY < this.minHeight) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${TITLEHEIGHT}px`
          this.playerShow = false
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.playerShow = true
        }
        this.$refs.bgImage.style.zIndex = zIndex
        if (newY > 0) {
          let percent = newY / this.imageHeight
          scale = scale + percent
        } else {
          scale = 1
        }
        this.$refs.bgImage.style[prefixStyle('transform')] = `scale(${scale})`
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

<template>
    <div class="player" v-show="playList.length">
      <transition name="normal"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave"
                  @after-leave="afterLeave"
      >
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img width="100%" height="100%" :src="currentMusic.image" />
            </div>
            <div class="top">
              <div class="back" @click="close">
                <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentMusic.name"></h1>
              <h2 class="subtitle" v-html="currentMusic.singer"></h2>
            </div>
            <div class="middle"
                 @touchstart.prevent="middleTouchStart"
                 @touchmove.prevent="middleTouchMove"
                 @touchend="middleTouchEnd">
              <div class="middle-l" ref="cd">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="rotate">
                    <img class="image" :src="currentMusic.image">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">{{currentLineTxt}}</div>
                </div>
              </div>
              <scroll class="middle-r" :data="currentLyric && currentLyric.lines" ref="lyricList">
                <div class="lyric-wrapper">
                  <div v-if="this.currentLyric">
                    <p ref="lyricLine"
                       class="text"
                       :class="{'current': currentLineNum === index}" v-for="(line, index) in this.currentLyric.lines">{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
            </div>
          <div class="bottom">
            <div class="dot-wrapper">
              <span class="dot" :class="{active: currentShow === 'cd'}"></span>
              <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{format(currentTime)}}</span>
              <div class="progress-bar-wrapper">
                <progress-bar :rate="rate" @sendRate="getRate"></progress-bar>
              </div>
              <span class="time time-r">{{format(currentMusic.duration)}}</span>
            </div>
            <div class="operators">
              <div class="icon i-left" @click="changeTurn">
                <i :class="turnIcon"></i>
              </div>
              <div @click="prev" class="icon i-left" :class="disableCls">
                <i class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i @click="changePlay" :class="playIcon"></i>
              </div>
              <div @click="next" class="icon i-right" :class="disableCls">
                <i class="icon-next" ></i>
              </div>
              <div class="icon i-right" @click="favorite" >
                <i class="icon" :class="favoriteIcon"></i>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
            <img :class="rotate" width="40" height="40" :src="currentMusic.image" />
          </div>
          <div class="text">
            <div class="name" v-html="currentMusic.name"></div>
            <div class="desc"></div>
          </div>
          <div class="control">
            <progress-circle :radius="radius" :rate="rate">
              <i @click.stop="changePlay" class="icon-mini" :class="miniIcon"></i>
            </progress-circle>
          </div>
          <div class="control">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <audio ref="audio" :src="currentMusic.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import progressBar from '../../base/progress-bar/progress-bar.vue'
  import progressCircle from '../../base/progress-circle/progress-circle.vue'
  import {shuffle} from '../../common/js/util'
  import Lyric from 'lyric-parser'
  import Scroll from '../../base/scroll/scroll.vue'
  import {prefixStyle} from '../../common/js/dom'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data () {
      return {
        songReady: false,
        like: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentShow: 'cd',
        currentLineNum: 0,
        currentLineTxt: ''
      }
    },
    created () {
      this.touch = {}
    },
    components: {
      progressBar,
      progressCircle,
      Scroll
    },
    computed: {
      playIcon () {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon () {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      rotate () {
        return this.playing ? 'play' : 'play pause'
      },
      disableCls () {
        return this.songReady ? '' : 'disable'
      },
      favoriteIcon () {
        return this.like ? 'icon-favorite' : 'icon-not-favorite'
      },
      turnIcon () {
        if (this.mode === 0) {
          return 'icon-sequence'
        } else if (this.mode === 1) {
          return 'icon-loop'
        } else {
          return 'icon-random'
        }
      },
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentMusic',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ]),
      rate () {
        return Math.min(this.currentTime / this.currentMusic.duration, 1)
      }
    },
    methods: {
      close () {
        this.setFullScreen(false)
      },
      open () {
        this.setFullScreen(true)
      },
      enter (el, done) {
        const {x, y, scale} = this._getAnimationData
        animations.registerAnimation({
          name: 'move',
          animation: {
            0: {
              transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
            },
            60: {
              transform: `translate3d(0px, 0, 0) scale(1.1)`
            },
            100: {
              transform: `translate3d(0px, 0, 0) scale(1)`
            }
          },
          present: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter () {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.transform = ''
      },
      leave (el, done) {
        const {x, y, scale} = this._getAnimationData
        animations.registerAnimation({
          name: 'small',
          animation: {
            0: {
              transform: `translate3d(0, 0, 0) scale(1)`
            },
            40: {
              transform: `translate3d(0, 0, 0) scale(1.1)`
            },
            100: {
              transform: `translate3d(-${x}px, -${y}px, 0) scale(${scale})`
            }
          },
          present: {
            duration: 400,
            easing: 'linear'
          }
        })
        animations.runAnimation(this.$refs.cdWrapper, 'small', done)
      },
      afterLeave () {
        animations.unregisterAnimation('small')
        this.$refs.cdWrapper.style.transform = ''
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlaying: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      _getAnimationData () {
        const paddingLeft = 40
        const x = window.innerWidth / 2 - paddingLeft
        const paddingTop = 80 + window.innerWidth / 2
        const paddingBottom = 30
        const y = -(window.innerHeight - paddingTop - paddingBottom)
        const miniWidth = 40
        const width = 300
        const scale = miniWidth / width
        return {x, y, scale}
      },
      changePlay () {
        if (!this.songReady) {
          return
        }
        this.setPlaying(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev () {
        if (!this.songReady) {
          return
        }
        let current = this.currentIndex - 1
        if (current < 0) {
          current = this.playList.length - 1
        }
        this.setCurrentIndex(current)
        if (!this.playing) {
          this.setPlaying(!this.playing)
        }
        this.songReady = false
      },
      next () {
        if (!this.songReady) {
          return
        }
        let current = this.currentIndex + 1
        if (current > this.playList.length - 1) {
          current = 0
        }
        this.setCurrentIndex(current)
        if (!this.playing) {
          this.setPlaying(!this.playing)
        }
        this.songReady = false
        this.$refs.audio.currentTime = 0
      },
      ready () {
        this.songReady = true
      },
      error () {
        this.songReady = true
      },
      favorite () {
        this.like = !this.like
      },
      changeTurn () {
        let mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = []
        if (mode === 2) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetIndex(list)
        this.setPlayList(list)
      },
      resetIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentMusic.id
        })
        this.setCurrentIndex(index)
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      format (interval) {
        interval = interval | 0
        let minute = interval / 60 | 0
        let second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      getLyric () {
        this.currentMusic.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLineTxt = ''
          this.currentLineNum = 0
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.currentLineTxt = txt
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      getRate (rate) {
        let currentTime = this.currentMusic.duration * rate
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.setPlaying(true)
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      end () {
        if (this.mode === 1) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek()
        }
      },
      middleTouchStart (e) {
        this.touch.flag = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        if (!this.touch.flag) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.precent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.cd.style.opacity = 1 - this.touch.precent
        this.$refs.cd.style[transitionDuration] = 0
      },
      middleTouchEnd () {
        let offsetWidth = 0
        let time = 300
        let opacity = 1
        if (this.currentShow === 'cd') {
          if (this.touch.precent > 0.1) {
            offsetWidth = -window.innerWidth
            this.currentShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.precent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.cd.style.opacity = opacity
        this.$refs.cd.style[transitionDuration] = `${time}ms`
      }
    },
    watch: {
      currentMusic (newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      playing (newPlay) {
        let audio = this.$refs.audio
        this.$nextTick(() => {
          newPlay ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .player {
    .normal-player {
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background {
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      }
      .top {
        position: relative
        margin-bottom: 25px
        .back {
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back {
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
          }
        }
        .title {
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        }
        .subtitle {
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
        }
      }
      .middle {
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l {
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper {
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd {
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play {
                animation: rotate 20s linear infinite
              }
              &.pause {
                animation-play-state: paused
              }
              .image {
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric {
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
            }
          }
        }
        .middle-r {
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper {
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text {
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current {
                color: $color-text
              }
            }
          }
        }
      }
      .bottom {
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper {
          text-align: center
          font-size: 0
          .dot {
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active {
              width: 20px
              border-radius: 5px
              background: $color-text-ll
            }
          }
        }
        .progress-wrapper {
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time {
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l {
              text-align: left
            }
            &.time-r {
              text-align: right
            }
          }
          .progress-bar-wrapper {
            flex: 1
          }
        }
        .operators {
          display: flex
          align-items: center
          .icon {
            flex: 1
            color: $color-theme
            &.disable {
              color: $color-theme-d
            }
            i {
              font-size: 30px
            }
          }
          .i-left {
            text-align: right
          }
          .i-center {
            padding: 0 20px
            text-align: center
            i {
              font-size: 40px
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all 0.4s
        .top, .bottom {
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
      }
      &.normal-enter, &.normal-leave-to {
        opacity: 0
        .top {
          transform: translate3d(0, -100px, 0)
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
    .mini-player {
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active {
        transition: all 0.4s
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0
      }
      .icon {
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img {
          border-radius: 50%
          &.play {
            animation: rotate 10s linear infinite
          }
          &.pause {
            animation-play-state: paused
          }
        }
      }
      .text {
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name {
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        }
        .desc {
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
        }
      }
      .control {
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px
          color: $color-theme-d
        }
        .icon-mini {
          font-size: 32px
          position: absolute
          left: 0
          top: 0
        }
      }
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }
</style>

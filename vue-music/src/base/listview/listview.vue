<template>
  <scroll class="listview" :data="data" ref="listView" :listenScroll = listenScroll @scroll="scroll" :probeType="probeType">
    <ul>
      <li v-for="(group, index) in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
      <ul>
        <li v-for="(item, index) in shortcutList" :class="{current: currentPage === index}" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import {getData} from '../../common/js/dom'
  import Loading from '../../base/loading/loading.vue'
  const ANOTHER_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default{
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    created () {
      this.touch = {}
      this.listenScroll = true
    },
    data () {
      return {
        currentPage: 0,
        scrollY: -1,
        probeType: 3,
        diff: -1
      }
    },
    methods: {
      onShortcutTouchStart (e) {
        let anotherIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anotherIndex = anotherIndex
        this._scrollTo(anotherIndex)
      },
      onShortcutTouchMove (e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANOTHER_HEIGHT | 0
        let anotherIndex = delta + parseInt(this.touch.anotherIndex)
        this._scrollTo(anotherIndex)
      },
      scroll (pos) {
        this.scrollY = pos.y
      },
      _calculateHeight () {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        const list = this.$refs.listGroup
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo (index) {
        // 对于touchstart事件空白处的点击来说
        if (!index && index !== 0) {
          return
        }
        // 对于touchmove空白处的点击来说
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    computed: {
      shortcutList () {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle () {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentPage] ? this.data[this.currentPage].title : ''
      }
    },
    watch: {
      data () {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY (newY) {
        let listHeight = this.listHeight
        // 当开始时newY>0
        if (newY > 0) {
          this.currentPage = 0
          return
        }
        // 在中间滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let Height1 = listHeight[i]
          let Height2 = listHeight[i + 1]
          if (-newY >= Height1 && -newY < Height2) {
            this.currentPage = i
            this.diff = Height2 + newY
            return
          }
        }
        // 滚动到底部，且newY大于最后一个元素的上限
        this.currentPage = listHeight.length - 2
      },
      diff (newVal) {
        let fixTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0
        if (this.fixTop === fixTop) {
          return
        }
        this.fixTop = fixTop
        this.$refs.fixTitle.style.transform = `translate3d(0,${fixTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .listview {
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group {
      padding-bottom: 30px
      .list-group-title {
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      }
      .list-group-item {
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar {
          width: 50px
          height: 50px
          border-radius: 50%
        }
        .name {
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
        }
      }
    }
    .list-shortcut {
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item {
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current {
          color: $color-theme
        }
      }
    }
    .list-fixed {
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title {
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      }
    }
    .loading-container {
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }
</style>

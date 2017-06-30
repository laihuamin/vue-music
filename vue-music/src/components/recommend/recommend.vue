<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrap">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门推荐歌单</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60px" height="60px" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from '../../base/slider/slider.vue'
  import {getRecommend, getDiscList} from '../../api/recommend'
  import {ERR_OK} from '../../api/config'
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  export default{
    data () {
      return {
        recommends: [],
        discList: []
      }
    },
    created () {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList () {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage () {
        if (!this.checkImage) {
          this.checkImage = true
          this.$refs.scroll.refresh()
        }
      }
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .recommend{
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content {
      height: 100%
      overflow: hidden
      .slider-wrap {
        position: relative
        width: 100%
        overflow: hidden
      }
      .recommend-list{
        .list-title {
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        }
        .item {
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon {
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          }
          .text {
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name {
              margin-bottom: 10px
              color: $color-text
            }
            .desc {
              color: $color-text-d
            }
          }
        }
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

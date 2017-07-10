<template>
  <transition name="slide">
    <music-list :songs="songs" :bg-image="this.bgImage" :title="this.title"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  import {createSong} from '../../common/js/song'
  import musicList from '../music-list/music-list'
  export default {
    computed: {
      ...mapGetters([
        'singer'
      ]),
      title () {
        return this.singer.name
      },
      bgImage () {
        return this.singer.avatar
      }
    },
    data () {
      return {
        songs: []
      }
    },
    created () {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail () {
        if (!this.singer.id) {
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalSongList(res.data.list)
          }
        })
      },
      _normalSongList (list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    components: {
      musicList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

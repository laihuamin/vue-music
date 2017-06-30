<template>
  <div class="singer">
    <listview :data="singerList"></listview>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from '../../api/singer'
  import {ERR_OK} from '../../api/config'
  const HOT_NAME = '热门'
  const HOT_NAME_LEN = 10
  import Singer from '../../common/js/singer'
  import Listview from '../../base/listview/listview.vue'
  export default{
    data () {
      return {
        singerList: []
      }
    },
    created () {
      this._getSingerList()
    },
    components: {
      Listview
    },
    methods: {
      _getSingerList () {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalList(res.data.list)
          }
        })
      },
      _normalList (list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_NAME_LEN) {
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        })
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .singer {
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
  }
</style>

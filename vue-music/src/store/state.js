/**
 * Created by Administrator on 2017/7/1.
 */
import {playMode} from '../common/js/config.js'
const state = {
  singer: {},
  playing: false,  // 是否播放
  fullScreen: false, // 是否展开
  playList: [], // 播放列表
  sequenceList: [], // 循环列表
  mode: playMode.sequence, // 三种模式
  currentIndex: -1  // 播放歌曲索引
}
export default state

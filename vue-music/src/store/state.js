/**
 * Created by Administrator on 2017/7/1.
 */
import {playMode} from '../common/js/config.js'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1
}
export default state

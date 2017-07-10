/**
 * Created by Administrator on 2017/7/1.
 */
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}
export default mutations

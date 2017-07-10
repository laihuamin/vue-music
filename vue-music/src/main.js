
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fastclick from 'fastclick'
import vueLazyLoad from 'vue-lazyload'
import store from './store'

fastclick.attach(document.body)
Vue.use(vueLazyLoad, {
  loading: require('./common/image/default.png')
})
import './common/stylus/index.styl'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

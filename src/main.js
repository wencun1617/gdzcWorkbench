import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

let EventBus = new Vue();
Object.defineProperties(Vue.prototype,{
  $bus: {
    get() { // 返回值作为属性的值
      return EventBus
    }
  }
})

import "./common/flexible" // flexible.js + rem 实现自适应布局

const echarts = require('echarts')
Vue.prototype.$echarts = echarts

// 组件库
import Antd from 'ant-design-vue';
// 样式
import 'ant-design-vue/dist/antd.css';
Vue.use(Antd);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

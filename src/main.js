// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import App from './App.vue'
import router from './router'
import store from './store'
import themePluginConfig from '../config/themePluginConfig'
import VCharts from 'v-charts'
import VueFriendlyIframe from './views/toolBox/IframeIndex'

import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel.js'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './global.less'

Vue.config.productionTip = false

Vue.use(VCharts)
Vue.use(VueFriendlyIframe)
// mount axios to `Vue.$http` and `this.$http`
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('vue-friendly-iframe', VueFriendlyIframe)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  created: bootstrap,
  render: (h) => h(App),
}).$mount('#app')

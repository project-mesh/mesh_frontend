import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
  },
  state: {},
  mutations: {},
  actions: {},
})

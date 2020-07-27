import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
import permission from './modules/permission'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
})

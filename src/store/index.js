import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import notification from './modules/notification'
import user from './modules/user'
// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
import permission from './modules/permission'
import teamInfo from './modules/teamInfo'
import projectTasks from './modules/projectTasks'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    notification,
    user,
    permission,
    teamInfo,
    projectTasks,
  },
  state: {},
  mutations: {},
  actions: {},
  getters,
})

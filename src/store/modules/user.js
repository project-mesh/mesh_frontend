import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    username: '',
    id: '',
    role: '',
    showMode: '',
    profile: '',
    teams: [],
    preference: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_SHOWMODE: (state, showMode) => {
      state.showMode = showMode
    },
    SET_PROFILE: (state, profile) => {
      state.profile = profile
    },
    // 深拷贝问题，残留
    SET_TEAMS: (state, teams) => {
      state.teams = teams
    },
    SET_PREFERENCE: (state, preference) => {
      state.preference = preference
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            console.log('resolve func begin')
            console.log(response.data)
            // console.log(response.data.token)
            const token = response.data.token
            console.log('token: ', token)
            storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', token)
            console.log('will resolve')
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    //
  },
}

export default user

import storage from 'store'
import sendRequest from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from '@/store'
const user = {
  state: {
    token: '',
    username: 'test',
    role: '',
    avatar: '',
    preference: {},
    teams: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PREFERENCE: (state, preference) => {
      state.preference = preference
    },
    SET_TEAMS: (state, teams) => {
      state.teams = teams
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        sendRequest('login', userInfo)
          .then((response) => {
            // console.log(response.data.token)
            const token = response.data.token
            console.log('token: ', token)
            storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', token)
            commit('SET_USERNAME', response.data.username)
            commit('SET_ROLE', response.data.role)
            commit('SET_AVATAR', response.data.profile)
            commit('SET_TEAMS', response.data.teams)
            commit('SET_PREFERENCE', response.data.preference)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    Logout({ commit, state }) {
      commit('SET_TOKEN', '')
      storage.remove(ACCESS_TOKEN)
    },
  },
}

export default user

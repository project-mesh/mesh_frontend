import storage from 'store'
import sendRequest from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from '@/store'
const user = {
  state: {
    token: '',
    username: '',
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
            commit('SET_AVATAR', response.data.avatar)
            commit('SET_TEAMS', response.data.teams)
            commit('SET_PREFERENCE', response.data.preference)
            // commit('SET_TEAMID', response.data.preference.preferenceTeam)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    Logout({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', '')
      storage.remove(ACCESS_TOKEN)
    },
    updatePreferenceColor({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceColor', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', res.data.preference)
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceTeam({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceTeam', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', res.data.preference)
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceShowMode({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceShowMode', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', res.data.preference)
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceLayout({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceLayout', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', res.data.preference)
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
  },
}

export default user

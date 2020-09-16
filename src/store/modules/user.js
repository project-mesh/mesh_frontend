import storage from 'store'
import sendRequest from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    username: '',
    role: '',
    avatar: '',
    preference: {},
    teams: [],
    address: '',
    nickname: '',
    birthday: '',
    age: null,
    gender: '',
    description: '',
    status: '1',
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
    SET_ADDRESS: (state, address) => {
      state.address = address
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname
    },
    SET_BIRTHDAY: (state, birthday) => {
      if (birthday[4] !== '1') {
        console.log('error format', birthday)
        birthday = '2020-01-01'
      }
      state.birthday = birthday
      if (birthday) {
        const birthdate = new Date(birthday)
        const nowdate = new Date()
        let age = nowdate.getFullYear() - birthdate.getFullYear() - 1
        if (nowdate.getMonth() >= birthdate.getMonth() && nowdate.getDate() >= birthdate.getDate())
          ++age
        state.age = age
      }
    },
    SET_GENDER: (state, gender) => {
      state.gender = gender
    },
    SET_DESCRIPTION: (state, description) => {
      state.description = description
    },
    SET_STATUS: (state, status) => {
      if (status === 0) {
        state.status = ''
      } else {
        state.status = status.toString()
      }
    },
    ADD_NEW_TEAM: (state, newTeam) => {
      state.teams.push(newTeam)
    },
  },

  actions: {
    // 登录
    Login({ commit, state }, userInfo) {
      return new Promise((resolve, reject) => {
        sendRequest('login', userInfo)
          .then((res) => {
            if (!res.data.isSuccess) {
              reject(res.data.msg)
            } else {
              const token = res.data.token
              console.log('jojo!!!!', res.data.preference)
              console.log('token: ', token)
              storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
              if (res.data.role === 'admin') {
                commit('SET_USERNAME', res.data.username)
                commit('SET_NICKNAME', res.data.nickname)
                commit('SET_TOKEN', token)
              } else {
                commit('SET_TOKEN', token)
                commit('SET_USERNAME', res.data.username)
                commit('SET_ROLE', res.data.role)
                commit('SET_AVATAR', res.data.avatar)
                commit('SET_TEAMS', res.data.teams)
                commit('SET_PREFERENCE', res.data.preference)
                commit('SET_ADDRESS', res.data.address)
                commit('SET_NICKNAME', res.data.nickname)
                commit('SET_BIRTHDAY', res.data.birthday)
                commit('SET_GENDER', res.data.gender)
                commit('SET_DESCRIPTION', res.data.description)
                commit('SET_STATUS', res.data.status)
              }
              // commit('SET_TEAMID', res.data.preference.preferenceTeam)
              resolve(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    Logout({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', '')
      commit('SET_ROUTERS', [], { root: true })
      storage.remove(ACCESS_TOKEN)
    },
    updatePreferenceColor({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceColor', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', {
              ...state.preference,
              preferenceColor: requestData.preferenceColor,
            })
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceTeam({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceTeam', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', {
              ...state.preference,
              preferenceTeam: requestData.preferenceTeam,
            })
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceShowMode({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceShowMode', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', {
              ...state.preference,
              preferenceShowMode: requestData.preferenceShowMode,
            })
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updatePreferenceLayout({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('preferenceLayout', requestData)
          .then((res) => {
            commit('SET_PREFERENCE', {
              ...state.preference,
              preferenceLayout: requestData.preferenceLayout,
            })
            resolve()
          })
          .catch((err) => reject(err))
      })
    },
    updateUserInfo({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateUserInfo', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess && data.username === state.username) {
              commit('SET_USERNAME', data.username)
              commit('SET_ROLE', data.role)
              commit('SET_AVATAR', data.avatar)
              commit('SET_TEAMS', data.teams)
              commit('SET_PREFERENCE', data.preference)
              commit('SET_ADDRESS', data.address)
              commit('SET_NICKNAME', data.nickname)
              commit('SET_BIRTHDAY', data.birthday)
              commit('SET_GENDER', data.gender)
              commit('SET_DESCRIPTION', data.description)
              commit('SET_STATUS', data.status)
            }
            resolve(res)
          })
          .catch((err) => {
            console.log('error in updateUserInfo, error: ', err)
            reject(err)
          })
      })
    },
    updateUserPassword({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateUserPassword', requestData)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    updateUserPasswordAdmin(_, requestData) {
      return sendRequest('updateUserPasswordAdmin', requestData)
    },
    queryUser(_, requestData) {
      return sendRequest('queryUser', requestData)
    },
  },
}

export default user

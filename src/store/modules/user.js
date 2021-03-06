import storage from 'store'
import sendRequest from '@/api'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getMyAvatar } from '../../utils/oss'

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
    avatarUrl: '',
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
        state.status = status
      }
    },
    ADD_NEW_TEAM: (state, newTeam) => {
      state.teams.push(newTeam)
    },
    UPDATE_TEAM: (state, updatedTeam) => {
      const currTeam = state.teams.find((team) => team.teamId === updatedTeam.teamId)

      if (currTeam) {
        Object.keys(updatedTeam).forEach((key) => {
          if (key in currTeam) currTeam[key] = updatedTeam[key]
        })
      }
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
              if (res.data.role === 'admin') {
                commit('SET_USERNAME', res.data.username)
                commit('SET_NICKNAME', res.data.nickname)
                commit('SET_ROLE', res.data.role)
              } else {
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
                getMyAvatar()
              }
              resolve(res)
            }
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    Logout({ commit }, requestData) {
      return new Promise((resolve) => {
        sendRequest('logout', requestData).finally(() => {
          commit('SET_USERNAME', '')
          commit('SET_ROLE', '')
          commit('SET_ROUTERS', [], { root: true })
          commit('SET_TEAMID', '', { root: true })
          commit('SET_PROJECT_ID', '', { root: true })
          commit('SET_NOTIFICATIONS', [], { root: true })
          commit('SET_PROJECT_TASKS', [], { root: true })
          commit('SET_TEAM_TASKS', [], { root: true })
          resolve()
        })
      })
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
              commit('UPDATE_TEAM_MEMBER', data, { root: true })
              commit('UPDATE_PROJECT_MEMBER', data, { root: true })
              resolve(res)
            }
            reject(new Error(data.msg))
          })
          .catch((err) => {
            console.log('error in updateUserInfo, error: ', err)
            reject(err)
          })
      })
    },
    updateUserInfoAdmin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateUserInfoAdmin', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              if (data.username === state.username) {
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
            }

            reject(new Error(data.msg))
          })
          .catch((err) => {
            console.log('error in updateUserInfoAdmin, error: ', err)
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

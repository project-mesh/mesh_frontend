import sendRequest from '@/api'

const statistics = {
  state: {
    users: [],
    maleUser: 0,
    femaleUser: 0,
    unknownUser: 0,
    userAge: [],
    userLocation: [],
    currentOnlineUser: 0,
    avgTeamUser: 0,
    avgTeamProject: 0,
    currentTotalUser: 0,
    historyTotalUser: [],
    timeInterval: 0,
  },
  mutations: {
    SET_USERS: (state, users) => {
      state.users = users
    },
    SET_MALE_USER: (state, maleUser) => {
      state.maleUser = maleUser
    },
    SET_FEMALE_USER: (state, femaleUser) => {
      state.femaleUser = femaleUser
    },
    SET_UNKNOWN_USER: (state, unknownUser) => {
      state.unknownUser = unknownUser
    },
    SET_USER_AGE: (state, userAge) => {
      state.userAge = userAge
    },
    SET_USER_LOCATION: (state, userLocation) => {
      state.userLocation = userLocation
    },
    SET_CURRENT_ONLINE_USER: (state, currentOnlineUser) => {
      state.currentOnlineUser = currentOnlineUser
    },
    SET_AVG_TEAM_USER: (state, avgTeamUser) => {
      state.avgTeamUser = avgTeamUser
    },
    SET_AVG_TEAM_PROJECT: (state, avgTeamProject) => {
      state.avgTeamProject = avgTeamProject
    },
    SET_CURRENT_TOTAL_USER: (state, currentTotalUser) => {
      state.currentTotalUser = currentTotalUser
    },
    SET_HISTORY_TOTAL_USER: (state, historyTotalUser) => {
      state.historyTotalUser = historyTotalUser
    },
    SET_TIME_INTERVAL: (state, timeInterval) => {
      state.timeInterval = timeInterval
    },
  },
  actions: {
    queryUserInfo({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryUserInfo', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('SET_USERS', data.users)
            }
            console.log('response in queryUserInfo, response: ', res)
            resolve(res)
          })
          .catch((err) => {
            console.log('error in queryUserInfo, err: ', err)
            reject(err)
          })
      })
    },
    queryGeneralStatistics({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryGeneralStatistics', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('SET_CURRENT_ONLINE_USER', data.currentOnlineUser)
              commit('SET_AVG_TEAM_PROJECT', data.avgTeamProject)
              commit('SET_AVG_TEAM_USER', data.avgTeamUser)
            }
            console.log('response in queryGeneralStatistics: ', res)
            resolve(res)
          })
          .catch((err) => {
            console.log('error in queryGeneralStatistics, error: ', err)
            reject(err)
          })
      })
    },
    queryTotalUser({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTotalUser', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('SET_TIME_INTERVAL', requestData.timeInterval)
              commit('SET_CURRENT_TOTAL_USER', data.currentTotalUser)
              commit('SET_HISTORY_TOTAL_USER', data.historyTotalUser)
            }
            console.log('response in queryTotalUser: ', res)

            resolve(res)
          })
          .catch((err) => {
            console.log('error in queryTotalUser, error: ', err)
            reject(err)
          })
      })
    },
    queryUserStatistics({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryUserStatistics', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('SET_MALE_USER', data.maleUser)
              commit('SET_FEMALE_USER', data.femaleUser)
              commit('SET_UNKNOWN_USER', data.unknownUser)
              commit('SET_USER_AGE', data.userAge)
              commit('SET_USER_LOCATION', data.userLocation)
            }
            console.log('response in queryUserStatistics: ', res)

            resolve(res)
          })
          .catch((err) => {
            console.log('error in queryUserStatistics, error: ', err)
            reject(err)
          })
      })
    },
  },
}

export default statistics

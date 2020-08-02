// teamName存储team-selector选择的具体团队
// 该模块存储当前团队下的数据

import sendRequest from '../../api'
import store from '@/store'

const teamInfo = {
  state: {
    teamId: '',
    createTime: 0,
    teamName: '',
    adminName: '',
    members: [], // 包括 username, profile
    teamProjects: [], // 包括 projectName projectId projectLogo adminName
    knowledgeBase: [], //
  },
  mutations: {
    SET_TEAMID: (state, teamId) => {
      state.teamId = teamId
    },
    SET_CREATETIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_TEAMNAME: (state, teamName) => {
      state.teamName = teamName
    },
    SET_ADMINNAME: (state, adminName) => {
      state.adminName = adminName
    },
    SET_MEMBERS: (state, members) => {
      state.members = members
    },
    SET_TEAMPROJECTS: (state, teamProjects) => {
      state.teamProjects = teamProjects
    },
    SET_TEAMKB: (state, teamKB) => {
      state.knowledgeBase = teamKB
    },
    SET_ALL: (state, data) => {
      state.teamId = data.teamId
      state.createTime = data.createTime
      state.teamName = data.teamName
      state.adminName = data.adminName
      state.members = data.members
      state.teamProjects = data.teamProjects
    },
    ADD_PROJECTS: (state, project) => {
      state.teamProjects.push(project)
    },
    REMOVE_PROJECTS: (state, projectId) => {
      state.teamProjects.filter((item) => {
        return item.projectId !== projectId
      })
    },
  },
  actions: {
    queryTeam({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeam', requestData)
          .then((response) => {
            console.log('response in GetTeamInfo is : ', response)
            commit('SET_ALL', response.data)
          })
          .catch((error) => {
            console.log('error in GetTeamInfo is : ', error)
          })
        resolve()
      })
    },
    inviteMember({ commit }, requestData) {
      if (store.getters.teamId) {
        sendRequest('inviteNewTeamMember', requestData)
          .then((response) => {
            console.log('response from inviteMember action is:', response)
          })
          .catch((error) => {
            console.log('error from inviteMember action is:', error)
          })
      }
    },
    createTeam({ commit }, requestData) {
      sendRequest('createTeam', requestData)
        .then((response) => {
          console.log('response from createTeam action is:', response)
          commit('SET_ALL', response.data)
        })
        .catch((error) => {
          console.log('error from createTeam action is:', error)
        })
    },
    joinTeam({ commit }, requestData) {
      sendRequest('joinTeam', requestData)
        .then((response) => {
          console.log('response from joinTeam action is:', response)
          commit('SET_ALL', response.data)
        })
        .catch((error) => {
          console.log('error from joinTeam action is:', error)
        })
    },
    queryTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeamKB', requestData)
          .then((response) => {
            commit('SET_TEAMKB', response.data.knowledgeBase)
          })
          .catch((error) => {
            console.log('error in queryTeamKB is : ', error)
          })
      })
    },
    createTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createTeamKB', requestData)
          .then((response) => {
            let newRequestData = {}
            newRequestData.username = requestData.username
            newRequestData.teamId = requestData.teamId
            newRequestData.knowledgeName = requestData.knowledgeName
            newRequestData.hyperlink = requestData.hyperlink
            store.dispatch('queryTeamKB', newRequestData)
          })
          .catch((error) => {
            console.log('error in createTeamKB is : ', error)
          })
      })
    },
    updateTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateTeamKB', requestData)
          .then((response) => {
            let newRequestData = {}
            newRequestData.username = requestData.username
            newRequestData.teamId = requestData.teamId
            newRequestData.knowledgeName = requestData.knowledgeName
            newRequestData.hyperlink = requestData.hyperlink
            store.dispatch('queryTeamKB', newRequestData)
          })
          .catch((error) => {
            console.log('error in updateTeamKB is : ', error)
          })
      })
    },
    deleteTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteTeamKB', requestData)
          .then((response) => {
            let newRequestData = {}
            newRequestData.username = requestData.username
            newRequestData.teamId = requestData.teamId
            newRequestData.knowledgeName = requestData.knowledgeName
            newRequestData.hyperlink = requestData.hyperlink
            store.dispatch('queryTeamKB', newRequestData)
          })
          .catch((error) => {
            console.log('error in deleteTeamKB is : ', error)
          })
      })
    },
  },
}

export default teamInfo

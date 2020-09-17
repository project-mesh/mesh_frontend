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
    ADD_PROJECT: (state, project) => {
      state.teamProjects.unshift(project)
    },
    REMOVE_PROJECT: (state, projectId) => {
      const prjIndex = state.teamProjects.findIndex((prj) => prj.projectId === projectId)
      if (prjIndex !== -1) return state.teamProjects.splice(prjIndex, 1)
      throw new Error('In teamInfo>REMOVE_PROJECT: Invalid projectId')
    },
    UPDATE_PROJECT: (state, updatedPrj) => {
      const prjIndex = state.teamProjects.findIndex((prj) => prj.projectId === updatedPrj.projectId)
      if (prjIndex !== -1) return state.teamProjects.splice(prjIndex, 1, updatedPrj)
      throw new Error('In teamInfo>UPDATE_PROJECT: Invalid project')
    },
    ADD_TEAMKB: (state, newKB) => {
      state.knowledgeBase.unshift(newKB)
    },
    REMOVE_TEAMKB: (state, knowledgeId) => {
      const knowledgeIndex = state.knowledgeBase.findIndex((KB) => KB.knowledgeId === knowledgeId)
      if (knowledgeIndex !== -1) return state.knowledgeBase.splice(knowledgeIndex, 1)
      throw new Error('In teamInfo>REMOVE_TEAMKB: Invalid knowledgeId')
    },
    UPDATE_TEAMKB: (state, updatedKB) => {
      const knowledgeIndex = state.knowledgeBase.findIndex(
        (KB) => KB.knowledgeId === updatedKB.knowledgeId
      )
      if (knowledgeIndex !== -1) return state.knowledgeBase.splice(knowledgeIndex, 1, updatedKB)
      throw new Error('In teamInfo>UPDATE_TEAMKB: Invalid knowledgeId')
    },
    ADD_NEW_MEMBER: (state, new_member) => {
      state.members.push(new_member)
    },
  },
  actions: {
    queryTeam({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeam', requestData)
          .then((res) => {
            console.log('res in GetTeamInfo is : ', res)
            commit('SET_ALL', res.data.team)
            resolve(res)
          })
          .catch((err) => {
            console.log('err in GetTeamInfo is : ', err)
            reject(err)
          })
      })
    },
    inviteMember({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('inviteNewTeamMember', requestData)
          .then((res) => {
            console.log('res from inviteMember action is:', res)
            commit('ADD_NEW_MEMBER', requestData.inviteName)
            resolve(res)
          })
          .catch((err) => {
            console.log('err from inviteMember action is:', err)
            reject(err)
          })
      })
    },
    createTeam({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createTeam', requestData)
          .then((res) => {
            console.log('response from createTeam action is:', res)
            //新建团队没有返回任务列表，增加一个空列表避免undefined
            res.data.team.teamProjects = []
            commit('SET_ALL', res.data.team)
            resolve(res)
          })
          .catch((err) => {
            console.log('err from createTeam action is:', err)
            reject(err)
          })
      })
    },
    joinTeam({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('joinTeam', requestData)
          .then((res) => {
            console.log('res from joinTeam action is:', res)
            commit('SET_ALL', res.data.team)
            resolve(res)
          })
          .catch((err) => {
            console.log('err from joinTeam action is:', err)
            reject(err)
          })
      })
    },
    queryTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeamKB', requestData)
          .then((res) => {
            console.log('queryTeamKB success')
            commit('SET_TEAMKB', res.data.knowledgeBase)
            resolve(res)
          })
          .catch((err) => {
            console.log('err in queryTeamKB is : ', err)
            reject(err)
          })
      })
    },
    createTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createTeamKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('ADD_TEAMKB', data.knowledge)
            }
            console.log('createTeamKB success')
            resolve(res)
          })
          .catch((err) => {
            console.log('err in createTeamKB is : ', err)
            reject(err)
          })
      })
    },
    updateTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateTeamKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('UPDATE_TEAMKB', data.knowledge)
            }
            console.log('updateTeamKB success')
            resolve(res)
          })
          .catch((err) => {
            console.log('err in updateTeamKB is : ', err)
            reject(err)
          })
      })
    },
    deleteTeamKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteTeamKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('REMOVE_TEAMKB', requestData.knowledgeId)
            }
            console.log('deleteTeamKB success')
            resolve(res)
          })
          .catch((err) => {
            console.log('err in deleteTeamKB is : ', err)
            reject(err)
          })
      })
    },
  },
}

export default teamInfo

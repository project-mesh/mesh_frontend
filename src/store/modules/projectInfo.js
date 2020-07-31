import sendRequest from '@/api/index'

const projectInfo = {
  state: {
    projectId: '',
    projectName: '',
    createTime: -1,
    projectLogo: '',
    adminName: '',
    isPublic: null,
    members: [],
  },
  mutations: {
    SET_PROJECT_ID: (state, projectId) => {
      state.projectId = projectId
    },
    SET_PROJECT_NAME: (state, projectName) => {
      state.projectName = projectName
    },
    SET_CREATE_TIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_PROJECT_LOGO: (state, projectLogo) => {
      state.projectLogo = projectLogo
    },
    SET_ADMIN_NAME: (state, adminName) => {
      state.adminName = adminName
    },
    SET_MEMBERS: (state, members) => {
      state.members = members
    },
    SET_VISIBILITY: (state, isPublic) => {
      state.isPublic = isPublic
    },
    ADD_NEW_MEMBER: (state, newMember) => {
      state.members.push(newMember)
    },
  },
  actions: {
    getProject({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryProject', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              const { project } = data
              commit('SET_PROJECT_ID', project.projectId)
              commit('SET_PROJECT_NAME', project.projectName)
              commit('SET_CREATE_TIME', project.createTime)
              commit('SET_PROJECT_LOGO', project.projectLogo)
              commit('SET_ADMIN_NAME', project.adminName)
              commit('SET_MEMBERS', project.members)
              commit('SET_VISIBILITY', project.isPublic)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    updateProject({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateProject', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              const { project } = data
              if (project.projectId === requestData.projectId) {
                commit('SET_PROJECT_ID', project.projectId)
                commit('SET_PROJECT_NAME', project.projectName)
                commit('SET_CREATE_TIME', project.createTime)
                commit('SET_PROJECT_LOGO', project.projectLogo)
                commit('SET_ADMIN_NAME', project.adminName)
                commit('SET_MEMBERS', project.members)
                commit('SET_VISIBILITY', project.isPublic)
              }
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deleteProject({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteProject', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              if (requestData.projectId === state.projectId) {
                commit('SET_PROJECT_ID', '')
                commit('SET_PROJECT_NAME', '')
                commit('SET_CREATE_TIME', -1)
                commit('SET_PROJECT_LOGO', '')
                commit('SET_ADMIN_NAME', '')
                commit('SET_MEMBERS', [])
                commit('SET_VISIBILITY', null)
              }

              commit('REMOVE_PROJECT', requestData.projectId, { root: true })
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    createProject({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createProject', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              const { project } = data

              commit('ADD_PROJECT', project, { root: true })
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    inviteNewProjectMember({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('inviteNewProjectMember', requestData)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
    joinProject({ commit, rootGetters }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('joinProject', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              const { project } = data

              if (requestData.teamId === rootGetters.teamId)
                commit('ADD_PROJECT', project, { root: true })
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default projectInfo

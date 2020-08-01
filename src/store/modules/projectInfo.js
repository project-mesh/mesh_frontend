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
    knowledgeBase: [],
    bulletins: [],
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
    SET_KNOWLEDGEBASE: (state, knowledgeBase) => {
      state.knowledgeBase = knowledgeBase
    },
    ADD_KNOWLEDGE: (state, newKnowledge) => {
      state.knowledge.push(newKnowledge)
    },
    REMOVE_KNOWLEDGE: (state, knowledgeId) => {
      const knowledgeIndex = state.knowledgeBase.findIndex(
        (knowledge) => knowledge.knowledgeId === knowledgeId
      )

      if (knowledgeIndex !== -1) state.knowledgeBase.splice(knowledgeIndex, 1)
    },
    UPDATE_KNOWLEDGE: (state, updatedKnowledge) => {
      const knowledgeIndex = state.knowledgeBase.findIndex(
        (knowledge) => knowledge.knowledgeId === updatedKnowledge.knowledgeId
      )

      if (knowledgeIndex !== -1) state.knowledgeBase.splice(knowledgeIndex, 1, updatedKnowledge)
    },
    SET_BULLETINS: (state, bulletins) => {
      state.bulletins = bulletins
    },
    ADD_BULLETIN: (state, newBulletin) => {
      state.bulletins.push(newBulletin)
    },
    REMOVE_BULLETIN: (state, bulletinId) => {
      const bulletinIndex = state.bulletins.findIndex(
        (bulletin) => bulletin.bulletinId === bulletinId
      )

      if (bulletinIndex !== -1) state.bulletins.splice(bulletinIndex, 1)
    },
    UPDATE_BULLETIN: (state, updatedBulletin) => {
      const bulletinIndex = state.bulletins.findIndex(
        (bulletin) => bulletin.bulletinId === updatedBulletin.bulletinId
      )

      if (bulletinIndex !== -1) state.bulletins.splice(bulletinIndex, 1, updatedBulletin)
    },
    ADD_NEW_MEMBER: (state, newMember) => {
      state.members.push(newMember)
    },
  },
  actions: {
    queryProject({ commit }, requestData) {
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
    queryBulletin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryBulletin', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('SET_BULLETINS', data.bulletins)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    createBulletin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createBulletin', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('ADD_BULLETIN', data.bulletin)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deleteBulletin({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteBulletin', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              commit('REMOVE_BULLETIN', requestData.bulletinId)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    updatedBulletin({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updatedBulletin', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              commit('REMOVE_BULLETIN', data.bulletin)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    queryProjectKB({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryProjectKB', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('SET_KNOWLEDGEBASE', data.knowledgeBase)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    createProjectKB({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createProjectKB', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('ADD_KNOWLEDGE', data.knowledge)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
    deleteProjectKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteProjectKB', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              commit('REMOVE_KNOWLEDGE', requestData.knowledgeId)
            }
            resolve(resolve)
          })
          .catch((error) => reject(error))
      })
    },
    updateProjectKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateProjectKB', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) {
              commit('UPDATE_KNOWLEDGE', data.knowledge)
            }
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default projectInfo

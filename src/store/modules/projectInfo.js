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
      state.knowledgeBase.push(newKnowledge)
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
          .then((res) => {
            const { data } = res
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
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    updateProject({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateProject', requestData)
          .then((res) => {
            const { data } = res
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
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    deleteProject({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteProject', requestData)
          .then((res) => {
            const { data } = res
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
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    createProject({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createProject', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              const { project } = data
              commit('ADD_PROJECT', project, { root: true })
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    inviteNewProjectMember({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('inviteNewProjectMember', requestData)
          .then((res) => resolve(res))
          .catch((err) => reject(err))
      })
    },
    joinProject({ commit, rootGetters }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('joinProject', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              const { project } = data

              if (requestData.teamId === rootGetters.teamId)
                commit('ADD_PROJECT', project, { root: true })
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    queryBulletin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryBulletin', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('SET_BULLETINS', data.bulletins)
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    createBulletin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createBulletin', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('ADD_BULLETIN', data.bulletin)
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    deleteBulletin({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteBulletin', requestData)
          .then((res) => {
            console.log('response in deleteBulletin: ', res)
            const { data } = res
            if (data.isSuccess) {
              commit('REMOVE_BULLETIN', requestData.bulletinId)
            }
            resolve(res)
          })
          .catch((err) => {
            console.error('error in deleteBulletin: ', err)
            reject(err)
          })
      })
    },
    updateBulletin({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateBulletin', requestData)
          .then((res) => {
            console.log('response in updateBulletin: ', res)
            const { data } = res
            if (data.isSuccess) {
              commit('UPDATE_BULLETIN', data.bulletin)
              console.log('updated bulletins: ', state.bulletins)
            }
            resolve(res)
          })
          .catch((err) => {
            console.error('error in updateBulletin: ', err)
            reject(err)
          })
      })
    },
    queryProjectKB({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryProjectKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('SET_KNOWLEDGEBASE', data.knowledgeBase)
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    createProjectKB({ commit, state }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('createProjectKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess && requestData.projectId === state.projectId) {
              commit('ADD_KNOWLEDGE', data.knowledge)
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
    deleteProjectKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('deleteProjectKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('REMOVE_KNOWLEDGE', requestData.knowledgeId)
            }
            resolve(resolve)
          })
          .catch((err) => reject(err))
      })
    },
    updateProjectKB({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('updateProjectKB', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('UPDATE_KNOWLEDGE', data.knowledge)
            }
            resolve(res)
          })
          .catch((err) => reject(err))
      })
    },
  },
}

export default projectInfo

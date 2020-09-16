import sendRequest from '../../api'
import store from '@/store'
import cloneDeep from 'lodash.clonedeep'

const projectTasks = {
  state: {
    tasks: [],
  },

  mutations: {
    SET_PROJECT_TASKS: (state, tasks) => {
      state.tasks = tasks
    },
    ADD_PROJECT_TASK: (state, newTask) => {
      state.tasks.unshift(newTask)
    },
  },

  actions: {
    queryTasks: ({ commit }, { username, teamId, projectId }) => {
      return Promise.all([
        store.dispatch('queryProjectTasks', { username, projectId }),
        store.dispatch('queryTeamTasks', { username, teamId }),
      ])
    },
    queryProjectTasks: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('queryProjectTasks', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('SET_PROJECT_TASKS', data.tasks)
              resolve(res)
            } else {
              reject(new Error(data.msg))
            }
          })
          .catch((err) => {
            console.log('err in queryProjectTasks is : ', err)
            reject(err)
          })
      })
    },
    createTask: ({ commit, rootGetters }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('createTask', requestData)
          .then((res) => {
            const { data } = res
            if (data.isSuccess) {
              commit('ADD_PROJECT_TASK', data.task)
              commit('ADD_TEAM_TASK', cloneDeep(data.task), { root: true })
              resolve(res)
            }

            reject(new Error(data.msg))
          })
          .catch((err) => {
            console.log('err from createProjectTasks is:', err)
            reject(err)
          })
      })
    },
    createSubTask: ({ commit, rootGetters }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('createSubTask', requestData)
          .then((res) => {
            if (res.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              newRequestData.teamId = rootGetters.teamId
              store.dispatch('queryTasks', newRequestData)
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.log('err from createSubProjectTasks is:', err)
            reject(err)
          })
      })
    },
    updateTask: ({ commit, rootGetters, state }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('updateTask', requestData)
          .then((res) => {
            if (res.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              newRequestData.teamId = rootGetters.teamId
              return store.dispatch('queryTasks', newRequestData)
            }
            reject(new Error(res.data.msg))
          })
          .then(() => {
            console.log(state.tasks)
            resolve()
          })
          .catch((err) => {
            console.log('err from updateProjectTasks is:', err)
            reject(err)
          })
      })
    },
    updateSubTask: ({ commit, rootGetters }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('updateSubTask', requestData)
          .then((res) => {
            if (res.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              newRequestData.teamId = rootGetters.teamId
              store.dispatch('queryTasks', newRequestData)
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.log('err from updateProjectSubTasks is:', err)
            reject(err)
          })
      })
    },
    deleteTask: ({ commit, rootGetters }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('deleteTask', requestData)
          .then((res) => {
            if (res.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              newRequestData.teamId = rootGetters.teamId
              store.dispatch('queryTasks', newRequestData)
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.log('err from deleteProjectTasks is:', err)
            reject(err)
          })
      })
    },
    deleteSubTask: ({ commit, rootGetters }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('deleteSubTask', requestData)
          .then((res) => {
            if (res.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              newRequestData.teamId = rootGetters.teamId
              store.dispatch('queryTasks', newRequestData)
            }
          })
          .then(() => resolve())
          .catch((err) => {
            console.log('err from deleteProjectSubTasks is:', err)
            reject(err)
          })
      })
    },
  },
}

export default projectTasks

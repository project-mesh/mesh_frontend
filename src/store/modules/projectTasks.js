import sendRequest from '../../api'
import store from '@/store'

const projectTasks = {
  state: {
    tasks: [],
    subTasks: [],
  },

  mutations: {
    SET_PROJECTTASKS: (state, tasks) => {
      state.tasks = tasks
    },
    SET_PROJECTSUBTASKS: (state, subTasks) => {
      state.subTasks = subTasks
    },
  },

  actions: {
    queryProjectTasks: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('queryProjectTasks', requestData)
          .then((response) => {
            console.log('In queryProjectTasks, response', response)
            let subTasks = response.data.tasks.map((obj) => {
              let newObj = obj.subTasks.map((subObj) => {
                subObj.parentTaskId = obj.taskId
                return subObj
              })
              return newObj
            })
            let onlyTasks = response.data.tasks.map((obj) => {
              delete obj.subTasks
              return obj
            })
            commit('SET_PROJECTTASKS', onlyTasks)
            commit('SET_PROJECTSUBTASKS', subTasks)
            resolve(response)
          })
          .catch((error) => {
            console.log('error in queryProjectTasks is : ', error)
            reject(error)
          })
      })
    },
    createProjectTasks: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('createTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from createProjectTasks is:', error)
          })
      })
    },
    createProjectSubTasks: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('createSubTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from createSubProjectTasks is:', error)
          })
        resolve()
      })
    },
    updateProjectTask: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('updateTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from updateProjectTasks is:', error)
          })
        resolve()
      })
    },
    updateProjectSubTask: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('updateSubTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from updateProjectSubTasks is:', error)
          })
        resolve()
      })
    },
    deleteProjectTask: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('deleteTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from deleteProjectTasks is:', error)
          })
        resolve()
      })
    },
    deleteProjectSubTask: ({ commit }, requestData) => {
      return new Promise((resolve, reject) => {
        sendRequest('deleteSubTask', requestData)
          .then((response) => {
            if (response.data.isSuccess) {
              let newRequestData = {}
              newRequestData.username = requestData.username
              newRequestData.projectId = requestData.projectId
              store.dispatch('queryProjectTasks', newRequestData)
            }
          })
          .catch((error) => {
            console.log('error from deleteProjectSubTasks is:', error)
          })
        resolve()
      })
    },
  },
}

export default projectTasks

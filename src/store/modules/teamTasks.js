import sendRequest from '@/api/index'

export const teamTasks = {
  state: {
    tasks: [],
  },
  mutations: {
    SET_TASKS: (state, tasks) => {
      state.tasks = tasks
    },
  },
  actions: {
    queryTeamTasks({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeamTasks', requestData)
          .then((response) => {
            const { data } = response
            if (data.isSuccess) commit('SET_TASKS', data.tasks)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default teamTasks

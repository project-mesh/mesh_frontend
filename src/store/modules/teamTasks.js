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
            let ct_timeStamp = Date.now()
            let others = ' 00:00:00'
            let newTeamTasks = data.tasks.map((item) => {
              let ddl_timeStamp = new Date(item.deadline + others).getTime()
              let value = (ct_timeStamp - item.createTime) / (ddl_timeStamp - item.createTime)
              value = value.toFixed(2)
              if (value > 100) {
                item.progress = {
                  value: 100.0,
                  status: 'exception',
                }
              } else {
                if (value <= 0) {
                  value = 0.0
                }
                item.progress = {
                  value: value,
                }
              }
              item.short = item.description.substring(0, 41)
              return item
            })
            console.log('newTeamTasks', newTeamTasks)
            if (data.isSuccess) commit('SET_TASKS', newTeamTasks)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default teamTasks

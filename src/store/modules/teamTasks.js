import sendRequest from '@/api/index'
import { setTaskStatus } from '@/utils/util'

const addProgressToTask = (item) => {
  console.log('test item.createTime', item.createTime)
  let ct_timeStamp = Date.now()
  let others = ' 00:00:00'
  let ddl_timeStamp = new Date(item.deadline + others).getTime()
  let value = (ct_timeStamp - item.createTime) / (ddl_timeStamp - item.createTime)
  value = value.toFixed(2)
  if (value > 1) {
    item.progress = {
      value: 100,
      status: 'exception',
    }
  } else {
    if (value <= 0) {
      value = 0
    }
    item.progress = {
      value: value * 100,
    }
  }
  item.short = (item.description && item.description.substring(0, 41)) || ''
  return item
}

export const teamTasks = {
  state: {
    tasks: [],
  },
  mutations: {
    SET_TEAM_TASKS: (state, tasks) => {
      tasks.forEach((task) => setTaskStatus(task))
      state.tasks = tasks
    },
    ADD_TEAM_TASK: (state, newTask) => {
      if ('subTasks' in newTask) delete newTask.subTasks
      setTaskStatus(newTask)
      state.tasks.unshift(addProgressToTask(newTask))
    },
  },
  actions: {
    queryTeamTasks({ commit }, requestData) {
      return new Promise((resolve, reject) => {
        sendRequest('queryTeamTasks', requestData)
          .then((response) => {
            const { data } = response

            let newTeamTasks = data.tasks.map(addProgressToTask)
            console.log('newTeamTasks', newTeamTasks)
            if (data.isSuccess) commit('SET_TEAM_TASKS', newTeamTasks)
            resolve(response)
          })
          .catch((error) => reject(error))
      })
    },
  },
}

export default teamTasks

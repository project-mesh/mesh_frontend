import { tasks, subTasks } from './data'
import Mock from 'mockjs2'
import * as utils from '../utils'

const getTasks = (isSubTask) => (queryParams) => {
  const resTasks = (isSubTask ? subTasks : tasks).filter(
    (task) =>
      task.principal === queryParams.username &&
      (isSubTask
        ? task.parentTaskId === queryParams.parentTaskId
        : task.projectId === queryParams.projectId)
  )
  return utils.builder({ tasks: resTasks })
}

Mock.mock(/\/subtask/, 'get', utils.functionFactory(getTasks(true)))
Mock.mock(/\/task/, 'get', utils.functionFactory(getTasks(false)))

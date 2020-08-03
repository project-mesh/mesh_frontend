import { tasks, subTasks, projects } from './data'
import Mock from 'mockjs2'
import * as utils from '../utils'

const getProjectTasks = (queryParams) => {
  const tasksCopy = utils.deepCopy(tasks)
  const subTasksCopy = utils.deepCopy(subTasks)
  const resTasks = tasksCopy.filter((task) => task.projectId === queryParams.projectId)

  resTasks.forEach((task) => {
    task.subTasks = subTasksCopy.filter((subTask) => subTask.parentTaskId === task.taskId)
  })

  return utils.builder({ tasks: resTasks })
}

const getTeamTasks = (queryParams) => {
  const tasksCopy = utils.deepCopy(tasks)

  const resTasks = tasksCopy.filter(
    (task) =>
      projects.find((project) => project.projectId === task.projectId).teamId === queryParams.teamId
  )

  return utils.builder({ tasks: resTasks })
}

Mock.mock(/\/subtask/, 'get', utils.functionFactory(getTeamTasks))
Mock.mock(/\/task/, 'get', utils.functionFactory(getProjectTasks))

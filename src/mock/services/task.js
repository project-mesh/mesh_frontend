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

  resTasks.forEach((task) => {
    task.projectName = projects.find((project) => task.projectId === project.projectId).projectName
  })

  return utils.builder({ tasks: resTasks })
}

Mock.mock(/\/task\/team/, 'get', utils.functionFactory(getTeamTasks))
Mock.mock(/\/task\/project/, 'get', utils.functionFactory(getProjectTasks))

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

//这个函数只更新了data.isFinished（给日历页面用的），正经写法我不清楚咋写，待修改 by xzc
const updateProjectTasks = (data) => {
  const currentTask = tasks.find(
    (currentTask) => currentTask.taskId === data.taskId && currentTask.projectId === data.projectId
  )
  currentTask.isFinished = data.isFinished

  if (currentTask.isFinished) currentTask.status = '已完成'
  else if (new Date(currentTask.deadline + ' 24:00:00').getTime() < Date.now())
    currentTask.status = '已逾期'
  else currentTask.status = '开发中'

  return utils.builder({ task: currentTask })
}

Mock.mock(/\/task\/team/, 'get', utils.functionFactory(getTeamTasks))
Mock.mock(/\/task\/project/, 'get', utils.functionFactory(getProjectTasks))
Mock.mock(/\/task/, 'patch', utils.functionFactory(updateProjectTasks))

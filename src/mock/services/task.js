import { tasks, subTasks, projects } from './data'
import Mock from 'mockjs2'
import * as utils from '../utils'

const setTaskStatus = (task) => {
  if (task.isFinished) task.status = '已完成'
  else if (new Date(task.deadline + ' 24:00:00').getTime() < Date.now()) task.status = '已逾期'
  else task.status = '开发中'
}

const getProjectTasks = (queryParams) => {
  const tasksCopy = utils.deepCopy(tasks)
  const subTasksCopy = utils.deepCopy(subTasks)
  const resTasks = tasksCopy.filter((task) => task.projectId === queryParams.projectId)

  resTasks.forEach((task) => {
    setTaskStatus(task)
    task.subTasks = subTasksCopy.filter((subTask) => subTask.parentTaskId === task.taskId)
    task.subTasks.forEach((subTask) => setTaskStatus(subTask))
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

  setTaskStatus(resTasks)

  return utils.builder({ tasks: resTasks })
}

//这个函数只更新了data.isFinished（给日历页面用的），正经写法我不清楚咋写，待修改 by xzc
const updateProjectTasks = (data) => {
  console.log('In mock updateProjectTasks, data: ', data)
  const currentTask = utils.deepCopy(
    tasks.find(
      (currentTask) =>
        currentTask.taskId === data.taskId && currentTask.projectId === data.projectId
    )
  )
  currentTask.isFinished = data.isFinished

  setTaskStatus(currentTask)

  return utils.builder({ task: currentTask })
}

Mock.mock(/\/task\/team/, 'get', utils.functionFactory(getTeamTasks))
Mock.mock(/\/task\/project/, 'get', utils.functionFactory(getProjectTasks))
Mock.mock(/\/task/, 'patch', utils.functionFactory(updateProjectTasks))

import { tasks, subTasks, projects } from './data'
import Mock from 'mockjs2'
import * as utils from '../utils'

const random = Mock.Random

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
  const currentTask = tasks.find(
    (task) => task.taskId === data.taskId && task.projectId === data.projectId
  )

  Object.keys(data).forEach((key) => {
    if (key in currentTask) currentTask[key] = data[key]
  })

  setTaskStatus(currentTask)

  return utils.builder({ task: currentTask })
}

const deleteTask = (data) => {
  const taskIndex = tasks.findIndex((task) => task.taskId === data.taskId)

  if (taskIndex === -1) return utils.builder({}, 0, false, 'No such task')

  tasks.splice(taskIndex, 1)

  return utils.builder({})
}

const createTask = (data) => {
  const newTask = Mock.mock({
    projectId: '',
    taskId: '@id',
    taskName: '@ctitle',
    isFinished: false,
    priority: random.natural(0, 3),
    createTime: Date.now(),
    deadline: '2020' + random.date('yyyy-MM-dd').slice(4),
    description: '@cparagraph',
    founder: '@cname',
    principal: '',
  })

  Object.keys(data).forEach((key) => {
    if (key in newTask) newTask[key] = data[key]
  })

  setTaskStatus(newTask)

  tasks.push(newTask)

  return utils.builder({ task: { ...newTask, subTasks: [] } })
}

Mock.mock(/\/task\/team/, 'get', utils.functionFactory(getTeamTasks))
Mock.mock(/\/task\/project/, 'get', utils.functionFactory(getProjectTasks))
Mock.mock(/\/task/, 'patch', utils.functionFactory(updateProjectTasks))
Mock.mock(/\/task/, 'delete', utils.functionFactory(deleteTask))
Mock.mock(/\/task/, 'post', utils.functionFactory(createTask))

import * as utils from '../utils'
import { projects, projectMembers, users } from './data'
import Mock from 'mockjs2'

const getProjects = (queryParams) => {
  let projectsCopy = utils.deepCopy(projects)
  const project = projectsCopy.find((project) => project.projectId === queryParams.projectId)

  if (!project) return utils.builder({}, 0, false, '无此项目')

  project.members = []

  projectMembers
    .filter((proMem) => proMem.projectId === queryParams.projectId)
    .forEach((proMem) => {
      project.members.push({
        ...proMem,
        avatar: users.find((user) => user.username === proMem.username).avatar,
      })
    })

  return utils.builder({ project })
}

const createProject = (data) => {
  const newProject = Mock.mock({
    teamId: '',
    projectId: '@id',
    projectName: '@name',
    projectLogo: '@image',
    description: '@paragraph',
    adminName: '',
    isPublic: 'true',
    createTime: Date.now(),
  })

  Object.keys(data).forEach((key) => {
    if (key in newProject) newProject[key] = data[key]
  })

  projectMembers.push({
    projectId: newProject.projectId,
    username: data.adminName,
  })

  projects.push(newProject)

  return utils.builder({ project: newProject })
}

const deleteProject = (data) => {
  const prjIndex = projects.findIndex((prj) => prj.projectId === data.projectId)

  if (prjIndex !== -1) {
    projects.splice(prjIndex, 1)
    return utils.builder({})
  }

  return utils.builder({}, 0, false, 'No Such Project`')
}

const updateProject = (data) => {
  const updatePrj = projects.find((prj) => prj.projectId === data.projectId)

  if (updatePrj) {
    Object.keys(data).forEach((key) => {
      if (key in updatePrj) updatePrj[key] = data[key]
    })

    return utils.builder({ project: updatePrj })
  }

  return utils.builder({}, 0, false, 'No Such Project`')
}

const joinProject = (data) => {
  const currUser = users.find((user) => user.username === data.username)

  if (!currUser) return utils.builder({}, 0, false, 'no such user')

  projectMembers.push({
    projectId: data.projectId,
    username: data.username,
  })

  return getProjects(data)
}

Mock.mock(/\/project\/join/, 'post', utils.functionFactory(joinProject))
Mock.mock(/\/project/, 'get', utils.functionFactory(getProjects))
Mock.mock(/\/project/, 'post', utils.functionFactory(createProject))
Mock.mock(/\/project/, 'delete', utils.functionFactory(deleteProject))
Mock.mock(/\/project/, 'patch', utils.functionFactory(updateProject))

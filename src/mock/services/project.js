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

Mock.mock(/\/project/, 'get', utils.functionFactory(getProjects))

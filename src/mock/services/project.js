import * as utils from '../utils'
import { projects, projectMembers, users } from './data'
import Mock from 'mockjs2'

const getProjects = (queryParams) => {
  let resProjects = utils.deepCopy(projects)
  resProjects = resProjects.filter((project) => project.teamId === queryParams.teamId)

  resProjects.forEach((project) => {
    project.members = []
    projectMembers
      .filter((member) => member.projectId === project.projectId)
      .forEach((member) =>
        project.members.push({
          username: member.username,
          profile: users.find((user) => user.username === member.username).profile,
        })
      )
  })

  return utils.builder({ teamProjects: resProjects })
}

Mock.mock(/\/project/, 'get', utils.functionFactory(getProjects))

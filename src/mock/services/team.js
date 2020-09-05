import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, users, projects } from './data'

const getTeams = (queryParams) => {
  const teamsCopy = utils.deepCopy(teams)

  const team = teamsCopy.find((team) => team.teamId === queryParams.teamId)

  if (!team) return utils.builder({}, 0, false, '无此团队')

  team.members = []

  teamMembers
    .filter((teamMem) => teamMem.teamId === queryParams.teamId)
    .forEach((teamMem) => {
      team.members.push({
        ...teamMem,
        avatar: users.find((user) => user.username === teamMem.username).avatar,
      })
    })

  team.teamProjects = []

  projects
    .filter((project) => project.teamId === queryParams.teamId)
    .forEach((project) => team.teamProjects.push(project))

  return utils.builder({ team })
}

Mock.mock(/\/team/, 'get', utils.functionFactory(getTeams))

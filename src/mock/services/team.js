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

const joinTeam = (data) => {
  const currUser = users.find((user) => user.username === data.username)

  if (!currUser) return utils.builder({}, 0, false, 'no such user')

  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

  teamMembers.push({
    teamId: data.teamId,
    username: data.username,
  })

  return getTeams(data)
}

const updateTeam = (data) => {
  const currTeam = teams.find((team) => team.teamId === data.teamId)

  if (!currTeam) return utils.builder({}, 0, false, 'no such team')

  Object.keys(data).forEach((key) => {
    if (key in currTeam) currTeam[key] = data[key]
  })

  return getTeams(data)
}

Mock.mock(/\/team/, 'get', utils.functionFactory(getTeams))
Mock.mock(/\/team\/join/, 'post', utils.functionFactory(joinTeam))
Mock.mock(/\/team/, 'patch', utils.functionFactory(updateTeam))

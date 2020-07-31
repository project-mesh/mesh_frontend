import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, users } from './data'

const getTeams = (queryParams) => {
  let resTeams = utils.deepCopy(teams)
  resTeams = resTeams.filter(
    (team) =>
      teamMembers.findIndex(
        (member) => member.username === 'test' && member.teamId === team.teamId
      ) !== -1
  )

  resTeams.forEach((team) => {
    team.members = []
    teamMembers
      .filter((member) => member.teamId === team.teamId)
      .forEach((member) =>
        team.members.push({
          username: member.username,
          profile: users.find((user) => user.username === member.username).profile,
        })
      )
  })

  console.log('resTeams: ', resTeams)

  return utils.builder({ teams: resTeams })
}

Mock.mock(/\/team/, 'get', utils.functionFactory(getTeams))

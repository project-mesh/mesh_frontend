import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, users } from './data'
import md5 from 'md5'

const login = (data) => {
  const usersCopy = utils.deepCopy(users)

  data.password && (data.password = md5(data.password))
  data.token && (data = JSON.parse(data.token))

  const currUser = usersCopy.find(
    (user) => user.username === data.username && user.password === data.password
  )

  currUser.teams = []
  teamMembers
    .filter((teamMember) => teamMember.username === currUser.username)
    .forEach((teamMember) =>
      currUser.teams.push(teams.find((team) => team.teamId === teamMember.teamId))
    )

  return utils.builder({
    ...currUser,
    token: JSON.stringify({ username: currUser.username, password: currUser.password }),
  })
}

Mock.mock(/\/login/, 'post', utils.functionFactory(login))

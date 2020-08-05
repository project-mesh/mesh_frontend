import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, projects, projectMembers, users } from './data'
import md5 from 'md5'

function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true
    }
  } catch (e) {
    console.log(e)
  }
  return false
}

const login = (data) => {
  const usersCopy = utils.deepCopy(users)
  console.log('mock: login')
  console.log('login data: ', data)
  if (isJsonString(data.token)) {
    console.log('是json格式')
  } else {
    console.log('不是jsong格式')
  }
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

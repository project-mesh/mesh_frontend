import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, users } from './data'
import md5 from 'md5'

const login = (data) => {
  console.log('login!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
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

const updatePreference = (data) => {
  const { preference } = users.find((user) => user.username === data.username)

  Object.keys(data).forEach((key) => {
    if (key in preference) preference[key] = data[key]
  })

  console.log('preference Updated, ', preference)

  return utils.builder({
    preference,
  })
}

const updateUserInfo = (data) => {
  const currUser = users.find((user) => user.username === data.username)

  Object.keys(data).forEach((key) => {
    if (key !== 'password' && key in currUser) {
      currUser[key] = data[key]
    }
  })

  const userCopy = utils.deepCopy(currUser)

  userCopy.teams = []
  teamMembers
    .filter((teamMember) => teamMember.username === userCopy.username)
    .forEach((teamMember) =>
      userCopy.teams.push(teams.find((team) => team.teamId === teamMember.teamId))
    )

  return utils.builder({
    ...userCopy,
  })
}

const updateUserPasswordAdmin = (data) => {
  const currUser = users.find((user) => user.username === data.username)

  currUser.password = md5(data.password)

  return utils.builder({})
}

const getAllUsers = (queryParams) => {
  let usersCopy = utils.deepCopy(users)

  usersCopy = usersCopy.filter(
    (user) =>
      user.role === 'user' &&
      (user.username.match(queryParams.keyword) ||
        user.nickname.match(queryParams.keyword) ||
        user.description.match(queryParams.keyword))
  )

  return utils.builder({ users: usersCopy })
}

Mock.mock(/\/login/, 'post', utils.functionFactory(login))
Mock.mock(/\/preference/, 'post', utils.functionFactory(updatePreference))
Mock.mock(/\/user/, 'patch', utils.functionFactory(updateUserInfo))
Mock.mock(/\/admin\/password/, 'patch', utils.functionFactory(updateUserPasswordAdmin))
Mock.mock(/\/user/, 'get', utils.functionFactory(getAllUsers))

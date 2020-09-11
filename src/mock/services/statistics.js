import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, users, projects } from './data'

const getUserInfo = (data) => {
  let usersCopy = utils.deepCopy(users)

  usersCopy = usersCopy.filter(
    (user) =>
      user.role === 'user' &&
      (user.username.match(data.keyword) ||
        user.nickname.match(data.keyword) ||
        user.description.match(data.keyword))
  )

  usersCopy.forEach((user) => {
    user.teams = []
    teamMembers
      .filter((member) => member.username === user.username)
      .forEach((member) => {
        user.teams.push(teams.find((team) => team.teamId === member.teamId))
      })
  })

  return utils.builder({ users: usersCopy })
}

const getGeneralStatistics = () => {
  return utils.builder({
    currentOnlineUser: Mock.Random.natural(0, users.length),
    avgTeamUser: teamMembers.length / teams.length,
    avgTeamProject: projects.length / teams.length,
  })
}

const getTotUser = (queryParams) => {
  const historyTotalUser = []

  for (let i = 0; i < queryParams.itemCount; ++i) {
    historyTotalUser.push({ totalUser: Mock.Random.natural(0, users.length) })
  }

  return utils.builder({
    currentTotalUser: users.length,
    historyTotalUser,
  })
}

const getAge = (birthday) => {
  const nowDate = new Date()
  const birthDate = new Date(birthday)

  let age = nowDate.getFullYear() - birthDate.getFullYear() - 1

  if (nowDate.getMonth() >= birthDate.getMonth() && nowDate.getDate() >= birthDate.getDate()) ++age

  return age
}

const getUserStatistics = () => {
  let maleUser = 0
  let femaleUser = 0
  let unknownUser = 0
  const userAge = []
  const userLocation = []

  users.forEach((user) => {
    user.gender === -1 && ++unknownUser
    user.gender === 0 && ++femaleUser
    user.gender === 1 && ++maleUser

    if (user.birthday) {
      const age = getAge(user.birthday)

      let ageObj
      if ((ageObj = userAge.find((ageObj) => ageObj.age === age))) {
        ++ageObj.userCount
      } else
        userAge.push({
          age,
          userCount: 1,
        })
    }

    if (user.address) {
      let locObj
      if (
        (locObj = userLocation.find((locObj) => locObj.location === user.address.split(' ')[0]))
      ) {
        ++locObj.userCount
      } else
        userLocation.push({
          location: user.address.split(' ')[0],
          userCount: 1,
        })
    }
  })

  return utils.builder({
    maleUser,
    femaleUser,
    unknownUser,
    userAge,
    userLocation,
  })
}

Mock.mock(/\/stastistics\/search-user/, 'get', utils.functionFactory(getUserInfo))
Mock.mock(/\/stastistics\/general/, 'get', utils.functionFactory(getGeneralStatistics))
Mock.mock(/\/stastistics\/totaluser/, 'get', utils.functionFactory(getTotUser))
Mock.mock(/\/stastistics\/user/, 'get', utils.functionFactory(getUserStatistics))

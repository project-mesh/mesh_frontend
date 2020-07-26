import Mock from 'mockjs2'
import * as utils from '../utils'
import { teams, teamMembers, projects, projectMembers, users } from './data'
import md5 from 'md5'

const login = (data) => {
  let currUser = utils.deepCopy(users)
  currUser = currUser.find(
    (user) => user.username === data.username && user.password === md5(data.password)
  )

  currUser.teams = []
  teamMembers
    .filter((teamMember) => teamMember.username === currUser.username)
    .forEach((teamMember) =>
      currUser.teams.push({
        ...teams.find((team) => team.teamId === teamMember.teamId),
        teamProjects: projects.filter(
          (project) =>
            project.teamId === teamMember.teamId &&
            projectMembers.findIndex(
              (projectMember) =>
                projectMember.projectId === project.projectId &&
                projectMember.username === teamMember.username
            ) !== -1
        ),
        preferenceProject: teamMember.preferenceProject,
      })
    )

  return utils.builder(currUser)
}

Mock.mock(/\/login/, 'post', utils.functionFactory(login))

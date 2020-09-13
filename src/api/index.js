import request from '@/utils/axios'

const apiMap = {
  createBulletin: {
    url: '/bulletin',
    method: 'post',
  },
  deleteBulletin: {
    url: '/bulletin',
    method: 'delete',
  },
  queryBulletin: {
    url: '/bulletin',
    method: 'get',
  },
  updateBulletin: {
    url: '/bulletin',
    method: 'patch',
  },
  createProjectKB: {
    url: '/knowledgebase/project',
    method: 'post',
  },
  deleteProjectKB: {
    url: '/knowledgebase/project',
    method: 'delete',
  },
  queryProjectKB: {
    url: '/knowledgebase/project',
    method: 'get',
  },
  updateProjectKB: {
    url: '/knowledgebase/project',
    method: 'patch',
  },
  createTeamKB: {
    url: '/knowledgebase/team',
    method: 'post',
  },
  deleteTeamKB: {
    url: '/knowledgebase/team',
    method: 'delete',
  },
  queryTeamKB: {
    url: '/knowledgebase/team',
    method: 'get',
  },
  updateTeamKB: {
    url: '/knowledgebase/team',
    method: 'patch',
  },
  deleteNotification: {
    url: '/notification',
    method: 'delete',
  },
  finishNotification: {
    url: '/notification',
    method: 'patch',
  },
  queryNotification: {
    url: '/notification',
    method: 'get',
  },
  preferenceShowMode: {
    url: '/preference/show-mode',
    method: 'post',
  },
  preferenceTeam: {
    url: '/preference/team',
    method: 'post',
  },
  preferenceColor: {
    url: '/preference/color',
    method: 'post',
  },
  preferenceLayout: {
    url: '/preference/layout',
    method: 'post',
  },
  createProject: {
    url: '/project',
    method: 'post',
  },
  deleteProject: {
    url: '/project',
    method: 'delete',
  },
  queryProject: {
    url: '/project',
    method: 'get',
  },
  updateProject: {
    url: '/project',
    method: 'patch',
  },
  inviteNewProjectMember: {
    url: '/project/invite',
    method: 'post',
  },
  joinProject: {
    url: '/project/join',
    method: 'post',
  },
  createTask: {
    url: '/task',
    method: 'post',
  },
  deleteTask: {
    url: '/task',
    method: 'delete',
  },
  queryProjectTasks: {
    url: '/task/project',
    method: 'get',
  },
  queryTeamTasks: {
    url: '/task/team',
    method: 'get',
  },
  updateTask: {
    url: '/task',
    method: 'patch',
  },
  createSubTask: {
    url: '/subtask',
    method: 'post',
  },
  deleteSubTask: {
    url: '/subtask',
    method: 'delete',
  },
  querySubTask: {
    url: '/subtask',
    method: 'get',
  },
  updateSubTask: {
    url: '/subtask',
    method: 'patch',
  },
  createTeam: {
    url: '/team',
    method: 'post',
  },
  deleteTeam: {
    url: '/team',
    method: 'delete',
  },
  queryTeam: {
    url: '/team',
    method: 'get',
  },
  updateTeam: {
    url: '/team',
    method: 'patch',
  },
  inviteNewTeamMember: {
    url: '/team/invite',
    method: 'post',
  },
  joinTeam: {
    url: '/team/join',
    method: 'post',
  },
  login: {
    url: '/login',
    method: 'post',
  },
  register: {
    url: '/register',
    method: 'post',
  },
  updateUserInfo: {
    url: '/user',
    method: 'patch',
  },
  queryUser: {
    url: '/user',
    method: 'get',
  },
  updateUserPassword: {
    url: '/user/password',
    method: 'patch',
  },
  queryUserInfo: {
    url: '/stastistics/search-user',
    method: 'get',
  },
  queryGeneralStatistics: {
    url: '/stastistics/general',
    method: 'get',
  },
  queryTotalUser: {
    url: '/stastistics/totaluser',
    method: 'get',
  },
  queryUserStatistics: {
    url: '/stastistics/user',
    methodL: 'get',
  },
  updateUserPasswordAdmin: {
    url: '/admin/password',
    method: 'patch',
  },
}

const sendRequest = (apiName, data) => {
  if (!apiMap[apiName]) throw new Error('api未定义！')
  // if (apiName === 'login' && typeof data === 'string') return loginByToken(data)
  const config = { ...apiMap[apiName] }
  if (config.method === 'get') config.params = data
  else config.data = data
  console.log('apiName is: ', apiName, 'config:', config)
  return request(config)
}

export default sendRequest

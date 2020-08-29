import Mock from 'mockjs2'
import md5 from 'md5'
import themePluginConfig from '../../../config/themePluginConfig'

const random = Mock.Random

const bulletins = [
  {
    projectId: 'asdfhgdsfxbsd',
    bulletinId: 'asgdsdfshjaewligkfnalsofkansd',
    bulletinName: '第一次讨论时间已经发布到日程了注意查看',
    description: '请大家提前注册并浏览一下tower网站,会议使用Zoom软件',
    createTime: Date.now(),
  },
]

const teamKB = [
  {
    teamId: '数据库',
    knowledgeId: 'asgsdfvgdxzvzsd',
    knowledgeName: '项目地址',
    hyperlink: 'xxxx',
    uploaderName: 'test',
    createTime: Date.now(),
  },
]

const projectKB = [
  {
    projectId: 'asdfhgdsfxbsd',
    knowledgeId: 'asgsdfvgdxzvzsd',
    knowledgeName: '百度',
    hyperlink: 'xxxxxxxxx',
    uploaderName: 'zengze',
    createTime: Date.now(),
  },
]

const notifications = [
  {
    teamId: '数据库',
    projectId: 'asdfhgdsfxbsd',
    founder: 'zengze',
    principal: 'test',
    notificationId: 'sadgsdgfsdsafsd',
    title: 'zengze将任务UI/UX设计分配给你',
    description: '',
    createTime: '1595215568570',
    isFinished: false,
  },
]

const tasks = [
  {
    projectId: 'asdfhgdsfxbsd',
    taskId: 'aklgnlkjsald',
    taskName: 'UI/UX设计',
    isFinished: false,
    status: '开发中',
    priority: 1,
    createTime: Date.now(),
    deadline: '2020-06-18',
    description: '任务内容详细描述xxxxxxxx',
    founder: 'zengze',
    principal: 'test',
  },
]

const subTasks = [
  {
    parentTaskId: 'aklgnlkjsald',
    taskId: 'aklgnlknbcberui',
    taskName: 'UI设计',
    isFinished: false,
    status: '开发中',
    priority: 1,
    createTime: Date.now(),
    deadline: '2020-06-18',
    description: '任务内容详细描述xxxxxxxx',
    founder: 'zengze',
    principal: 'test',
  },
]

const projects = [
  {
    teamId: '数据库',
    projectId: 'sadnklklkjasdew',
    projectName: '后端开发',
    projectLogo: Mock.mock('@image'),
    description: 'description',
    adminName: 'test',
    isPublic: true,
    createTime: Date.now(),
  },
  {
    teamId: '数据库',
    projectId: 'asdfhgdsfxbsd',
    createTime: Date.now(),
    projectName: '前端开发',
    projectLogo: Mock.mock('@image'),
    adminName: 'zengze',
    isPublic: true,
    description: '?????????????????????',
  },
]

const teams = [
  {
    teamId: '数据库',
    teamName: '数据库',
    adminName: 'test',
    createTime: Date.now(),
    description: 'nothing',
  },
]

const projectMembers = [
  {
    projectId: 'sadnklklkjasdew',
    username: 'test',
  },
  {
    projectId: 'sadnklklkjasdew',
    username: 'zengze',
  },
  {
    projectId: 'asdfhgdsfxbsd',
    username: 'test',
  },
  {
    projectId: 'asdfhgdsfxbsd',
    username: 'zengze',
  },
]

const teamMembers = [
  {
    teamId: '数据库',
    username: 'test',
  },
  {
    teamId: '数据库',
    username: 'zengze',
  },
]

const users = [
  {
    username: 'test',
    email: Mock.mock('@email'),
    avatar: Mock.mock('@image'),
    password: md5('test'),
    preference: {
      preferenceShowMode: 'card',
      preferenceTeam: '数据库',
      preferenceColor: '#1890ff',
      preferenceLayout: 'topmenu',
    },
    role: 'user',
  },
  {
    username: 'zengze',
    email: Mock.mock('@email'),
    avatar: Mock.mock('@image'),
    password: md5('test'),
    preference: {
      preferenceShowMode: 'card',
      preferenceTeam: '数据库',
      preferenceColor: '#1890ff',
      preferenceLayout: 'topmenu',
    },
    role: 'admin',
  },
]

for (let i = 0; i < 9; ++i) {
  const teamId = Mock.mock('@id')

  teams.push(
    Mock.mock({
      teamId: teamId,
      teamName: '@name',
      adminName: 'test',
      createTime: Date.now(),
      description: '@paragraph',
    })
  )

  teamMembers.push({
    teamId: teamId,
    username: 'test',
  })
}

for (let i = 0; i < 28; ++i) {
  const showModes = ['card', 'list']

  const colors = themePluginConfig.theme
    .slice(1)
    .map((theme) => theme.modifyVars['@primary-color'])
    .push('#1890ff')

  const layouts = ['sidemenu', 'topmenu']

  users.push(
    Mock.mock({
      username: '@name',
      email: '@email',
      avatar: '@image',
      password: md5('test'),
      preference: {
        'preferenceShowMode|1': showModes,
        'preferenceColor|1': colors,
        'preferenceLayout|1': layouts,
        preferenceTeam: '数据库',
      },
      role: 'user',
    })
  )
}

for (let i = 0; i < 10; ++i) {
  const curTeamId = teams[i].teamId
  const totUsers = users.length
  const curTeamMembers = ['test']
  for (let j = 0; j < 10; ++j) {
    const randomUsername = users[random.natural(0, totUsers - 1)].username
    if (
      teamMembers.findIndex(
        (member) => member.teamId === curTeamId && member.username === randomUsername
      ) === -1
    ) {
      teamMembers.push({
        teamId: curTeamId,
        username: randomUsername,
      })

      curTeamMembers.push(randomUsername)
    }
  }

  const teamUsers = curTeamMembers.length

  for (let j = 0; j < 3; ++j) {
    projects.push(
      Mock.mock({
        teamId: curTeamId,
        projectId: '@id',
        projectName: '@name',
        projectLogo: '@image',
        description: '@paragraph',
        adminName: curTeamMembers[random.natural(0, teamUsers - 1)],
        isPublic: 'true',
        createTime: Date.now(),
      })
    )
  }
}

// console.log('In data, pro: ', projects)
// console.log('In data, teamMem: ', teamMembers)

for (let i = 0; i < projects.length; ++i) {
  const curProjectId = projects[i].projectId
  const curTeamId = projects[i].teamId

  const curTeamMembers = teamMembers
    .filter((member) => member.teamId === curTeamId)
    .map((member) => member.username)

  const teamUsers = curTeamMembers.length
  for (let j = 0; j < 6; ++j) {
    const randomUsername = curTeamMembers[random.natural(0, teamUsers - 1)]

    if (
      projectMembers.findIndex(
        (member) => member.projectId === curProjectId && member.username === randomUsername
      ) === -1
    ) {
      projectMembers.push({
        projectId: curProjectId,
        username: randomUsername,
      })
    }
  }
}

// console.log('In data, proMem', projectMembers)

for (let i = 0; i < 100; ++i) {
  const len = projectMembers.length
  const member = projectMembers[random.natural(0, len - 1)]
  const teamId = projects.find((prj) => prj.projectId === member.projectId).teamId
  notifications.push(
    Mock.mock({
      teamId,
      projectId: member.projectId,
      founder: '@name',
      principal: member.username,
      notificationId: '@id',
      title: '@title',
      description: '@paragraph',
      createTime: Date.now(),
      isFinished: false,
    })
  )

  tasks.push(
    Mock.mock({
      projectId: member.projectId,
      taskId: '@id',
      taskName: '@name',
      isFinished: false,
      status: '开发中',
      priority: random.natural(1, 3),
      createTime: Date.now(),
      deadline: '2020' + random.date('yyyy-MM-dd').slice(4),
      description: '@paragraph',
      founder: '@name',
      principal: member.username,
    })
  )
}

for (let i = 0; i < 200; ++i) {
  let len = teamMembers.length
  let member = teamMembers[random.natural(0, len - 1)]

  teamKB.push(
    Mock.mock({
      teamId: member.teamId,
      knowledgeId: '@id',
      knowledgeName: '@name',
      hyperlink: '@url',
      uploaderName: member.username,
      createTime: Date.now(),
    })
  )
}

for (let i = 0; i < 500; ++i) {
  let len = projectMembers.length
  let member = projectMembers[random.natural(0, len - 1)]

  projectKB.push(
    Mock.mock({
      projectId: member.projectId,
      knowledgeId: '@id',
      knowledgeName: '@name',
      hyperlink: '@url',
      uploaderName: member.username,
      createTime: Date.now(),
    })
  )
}

for (let i = 0; i < projects.length; ++i) {
  for (let j = 0; j < 10; ++j) {
    bulletins.push(
      Mock.mock({
        projectId: projects[i].projectId,
        bulletinId: '@id',
        bulletinName: '@name',
        description: '@sentence',
        createTime: Date.now(),
      })
    )
  }
}

// console.log('In data, users: ', users)

export {
  bulletins,
  teamKB,
  projectKB,
  notifications,
  tasks,
  subTasks,
  projects,
  teams,
  projectMembers,
  teamMembers,
  users,
}

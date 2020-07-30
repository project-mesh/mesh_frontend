import Mock from 'mockjs2'
import md5 from 'md5'

export const bulletins = [
  {
    projectId: 'asdfhgdsfxbsd',
    bulletinId: 'asgdsdfshjaewligkfnalsofkansd',
    bulletinName: '第一次讨论时间已经发布到日程了注意查看',
    description: '请大家提前注册并浏览一下tower网站,会议使用Zoom软件',
    createTime: Date.now(),
  },
]

export const teamKB = [
  {
    teamId: '数据库',
    knowledgeId: 'asgsdfvgdxzvzsd',
    knowledgeName: '项目地址',
    hyperlink: 'xxxx',
    uploaderName: 'test',
    createTime: Date.now(),
  },
]

export const projectKB = [
  {
    projectId: 'asdfhgdsfxbsd',
    knowledgeId: 'asgsdfvgdxzvzsd',
    knowledgeName: '百度',
    hyperlink: 'xxxxxxxxx',
    uploaderName: 'zengze',
    createTime: Date.now(),
  },
]

export const notifications = [
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

export const tasks = [
  {
    projectId: 'asdfhgdsfxbsd',
    taskId: 'aklgnlkjsald',
    taskName: 'UI/UX设计',
    isFinished: false,
    status: '开发中',
    priority: 1,
    deadline: '2020-06-18',
    description: '任务内容详细描述xxxxxxxx',
    founder: 'zengze',
    principal: 'test',
  },
]

export const subTasks = [
  {
    parentTaskId: 'aklgnlkjsald',
    taskId: 'aklgnlknbcberui',
    taskName: 'UI设计',
    isFinished: false,
    status: '开发中',
    priority: 1,
    deadline: '2020-06-18',
    description: '任务内容详细描述xxxxxxxx',
    founder: 'zengze',
    principal: 'test',
  },
]

export const projects = [
  {
    teamId: '数据库',
    projectId: 'sadnklklkjasdew',
    projectName: '后端开发',
    projectLogo: 'xxxxxxxxxxx',
    description: 'description',
    adminName: 'test',
    createTime: Date.now(),
  },
  {
    teamId: '数据库',
    projectId: 'asdfhgdsfxbsd',
    createTime: Date.now(),
    projectName: '前端开发',
    projectLogo: 'xxxxxxx',
    adminName: 'zengze',
    description: '?????????????????????',
  },
]

export const teams = [
  {
    teamId: '数据库',
    teamName: '数据库',
    adminName: 'test',
    createTime: Date.now(),
    description: 'nothing',
  },
]

export const projectMembers = [
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

export const teamMembers = [
  {
    teamId: '数据库',
    username: 'test',
    preferenceProject: 'sadnklklkjasdew',
  },
  {
    teamId: '数据库',
    username: 'zengze',
    preferenceProject: 'sadnklklkjasdew',
  },
]

export const users = [
  {
    username: 'test',
    email: Mock.mock('@email'),
    profile: 'xxxxx',
    password: md5('test'),
    showMode: 'card',
    preference: {
      preferenceTeam: '数据库团队',
      preferenceColor: 'blue',
      preferenceLayout: 'Default',
    },
    role: 'user',
  },
  {
    username: 'zengze',
    email: Mock.mock('@email'),
    profile: 'xxxxx',
    password: md5('test'),
    showMode: 'card',
    preference: {
      preferenceTeam: '数据库团队',
      preferenceColor: 'blue',
      preferenceLayout: 'Default',
    },
    role: 'admin',
  },
]

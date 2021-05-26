// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
import store from '../store'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

const guard = (to, from, next) => {
  if (!store.getters.teams || store.getters.teams.length === 0) return next()

  if (to.query && to.query.teamId) return next()

  const teamId = store.getters.teamId || store.getters.preference.preferenceTeam

  next({ ...to, query: { teamId } })
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'home', keepAlive: true, permission: ['user'] },
    redirect: '/project/list',
    children: [
      // 项目
      {
        path: '/project',
        name: 'project',
        redirect: '/project/list',
        component: RouteView,
        beforeEnter: guard,
        hideChildrenInMenu: true,
        meta: {
          title: '项目',
          keepAlive: true,
          icon: 'project',
          permission: ['user'],
        },
        children: [
          // 团队项目列表页，选择某个项目后跳转到对应项目详情页
          {
            path: '/project/list',
            name: 'projectList',
            // TODO: 修改成对应页面
            // component: () => import('@/views/project/Project'),
            component: () => import('@/views/project/ProjectList'),
            meta: {
              keepAlive: true,
              title: '项目列表',
              permission: ['user'],
            },
          },
          // 项目详情页
          {
            path: '/project/detail',
            name: 'projectDetail',
            hideChildrenInMenu: true,
            // redirect: '/project/detail/statistics',
            // TODO: 修改成对应页面
            component: () => import('@/views/project/ProjectDetail'),
            meta: {
              keepAlive: true,
              title: '项目详情',
              permission: ['user'],
            },
            children: [
              // 任务列表
              {
                path: '/project/detail/task-list',
                name: 'taskList',
                // TODO: 修改成对应页面
                component: () => import('@/views/project/projectDetails/TaskList'),
                meta: {
                  title: '任务列表',
                  permission: ['user'],
                  keepAlive: true,
                },
              },
              {
                path: '/project/detail/task-board',
                name: 'taskBoard',
                // TODO: 修改成对应页面
                component: () => import('@/views/project/projectDetails/taskBoard/TaskBoard'),
                meta: {
                  title: '任务看板',
                  permission: ['user'],
                  keepAlive: true,
                },
              },
              // 统计
              {
                path: 'statistics',
                name: 'statistics',
                // TODO: 修改成对应页面
                component: () => import('@/views/project/projectDetails/Statistics'),
                meta: {
                  title: '统计',
                  keepAlive: true,
                  permission: ['user'],
                },
              },
              // 项目知识库
              {
                path: '/project/detail/repositories',
                name: 'projectRepo',
                // TODO: 修改成对应页面
                component: () =>
                  import('@/views/project/projectDetails/projectRepositories/ProjectRepo'),
                meta: {
                  title: '项目知识库',
                  keepAlive: true,
                  permission: ['user'],
                },
              },
              // 公告
              {
                path: '/project/detail/members',
                name: 'projectMember',
                // TODO: 修改成对应页面
                component: () => import('@/views/project/projectDetails/members/Members'),
                meta: {
                  title: '成员',
                  keepAlive: true,
                  permission: ['user'],
                },
              },
              {
                path: '/project/detail/bulletins',
                name: 'bulletins',
                // TODO: 修改成对应页面
                component: () => import('@/views/project/projectDetails/bulletins/Bulletins'),
                meta: {
                  title: '公告',
                  keepAlive: true,
                  permission: ['user'],
                },
              },
            ],
          },
        ],
      },

      // 团队知识库
      {
        path: '/repositories',
        name: 'teamRepo',
        beforeEnter: guard,
        // TODO: 修改成对应页面
        component: () => import('@/views/repositories/TeamRepo'),
        meta: {
          title: '知识库',
          icon: 'form',
          permission: ['user'],
        },
      },
      // 日历页面
      {
        path: '/calendar',
        name: 'calendar',
        beforeEnter: guard,
        component: () => import('@/views/calendar/BasicCalendar'),
        meta: {
          title: '日历',
          icon: 'calendar',
          keepAlive: true,
          permission: ['user'],
        },
      },
      // 甘特图页面
      {
        path: '/gantt',
        name: 'gantt',
        beforeEnter: guard,
        component: () => import('@/views/gantt/BasicGantt'),
        meta: {
          title: '甘特图',
          icon: 'calendar',
          keepAlive: true,
          permission: ['user'],
        },
      },
      // 团队页面
      {
        path: '/members',
        name: 'members',
        // TODO: 修改成对应页面
        component: RouteView,
        redirect: 'members/list',
        hideChildrenInMenu: true,
        meta: {
          title: '团队',
          icon: 'team',
          permission: ['user'],
        },
        children: [
          {
            path: '/members/list',
            name: 'membersList',
            component: () => import('@/views/team/Team'),
            beforeEnter: guard,
            meta: {
              permission: ['user'],
            },
          },
          {
            path: '/members/noTeam',
            name: 'noTeam',
            component: () => import('@/views/exception/NoTeam'),
            meta: {
              permission: ['user'],
            },
          },
        ],
      },

      //工具
      //
      {
        path: '/toolbox',
        name: 'toolBox',
        component: RouteView,
        redirect: '/toolbox/tool1',
        meta: {
          title: '工具箱',
          icon: 'inbox',
          keepAlive: true,
          permission: ['user'],
        },
        children: [
          {
            path: '/toolbox/tool1',
            name: 'calculate',
            component: () => import('@/views/toolBox/CalculateCard'),
            meta: { title: '计算器', keepAlive: true, permission: ['user'], icon: 'calculator' },
          },
          {
            path: '/toolbox/tool2',
            name: 'codeSandbox',
            component: () => import('@//views/toolBox/CodeSandbox'),
            meta: { title: '图标设计', hideHeader: true, permission: ['user'], icon: 'scissor' },
          },
          {
            path: '/toolbox/tool3',
            name: 'markdown',
            component: () => import('@/views/toolBox/MarkDown'),
            meta: { title: 'MarkDown', keepAlive: true, permission: ['user'], icon: 'medium' },
          },
          {
            path: '/toolbox/tool4',
            name: 'drawio',
            component: () => import('@/views/toolBox/DrawIO'),
            meta: { title: '流程图', keepAlive: true, permission: ['user'], icon: 'apartment' },
          },
          {
            path: '/toolbox/tool5',
            name: 'latex',
            component: () => import('@/views/toolBox/Latex'),
            meta: { title: 'LaTeX', keepAlive: true, permission: ['user'], icon: 'edit' },
          },
        ],
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: {
          title: '个人页',
          icon: 'user',
          keepAlive: true,
          permission: ['user'],
        },
        children: [
          // 个人中心
          {
            path: '/account/center',
            name: 'center',
            beforeEnter: guard,
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: ['user'], icon: 'info-circle' },
          },
          // 设置
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: ['user'], icon: 'setting' },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              // 基本设置
              {
                path: '/account/settings/base',
                name: 'baseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: ['user'] },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    name: 'management',
    component: BasicLayout,
    meta: { title: '管理', keepAlive: true, permission: ['admin'] },
    redirect: '/userManagement',
    children: [
      {
        path: '/userManagement',
        name: 'userManagement',
        component: () => import('@/views/management/UserManagement'),
        meta: { title: '用户管理', keepAlive: true, permission: ['admin'], icon: 'user' },
      },
      {
        path: '/statistics',
        name: 'adminStatistics',
        component: () => import('@/views/management/AdminStatistics'),
        meta: { title: '实时数据', keepAlive: true, permission: ['admin'], icon: 'bar-chart' },
      },
      {
        path: '/dashboard',
        name: 'adminDashboard',
        component: () => import('@/views/management/Dashboard'),
        meta: { title: '服务器监测', keepAlive: true, permission: ['admin'], icon: 'rocket' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404_pageview'),
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404_pageview'),
  },
]

// /**
//  * 账户信息路由
//  * @type { *[] }
//  */
// export const accountRouterMap = [
//   // 我的页面
//   {
//     path: '/me',
//     name: 'me',
//     // TODO: 修改成对应页面
//     component: () => import('@/views/account/settings/index'),
//     meta: {
//       title: '我的',
//       icon: 'user',
//     },
//   },
// ]

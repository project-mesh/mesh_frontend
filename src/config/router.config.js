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
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
                  title: '任务列表',
                  permission: ['user'],
                },
              },
              // 任务看板
              {
                path: '/project/detail/task-board',
                name: 'taskBoard',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  title: '任务看板',
                  keepAlive: true,
                  permission: ['user'],
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
                  icon: 'bar-chart',
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
          {
            path: '/account/center',
            name: 'center',
            beforeEnter: guard,
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: ['user'] },
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: ['user'] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
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
    name: 'index',
    component: BasicLayout,
    meta: { title: 'home', keepAlive: true, permission: ['admin'] },
    redirect: '/management',
    children: [
      {
        path: '/management',
        name: 'management',
        component: RouteView,
        redirect: '/management/userManagement',
        // TODO: 修改成对应页面
        meta: {
          title: '管理',
          icon: 'tool',
          keepAlive: true,
          permission: ['admin'],
        },
        children: [
          {
            path: '/management/userManagement',
            name: 'userManagement',
            beforeEnter: guard,
            component: () => import('@/views/management/UserManagement'),
            meta: { title: '用户管理', keepAlive: true, permission: ['admin'] },
          },
          {
            path: '/management/statistics',
            name: 'adminStatistics',
            beforeEnter: guard,
            component: () => import('@/views/management/AdminStatistics'),
            meta: { title: '实时数据', keepAlive: true, permission: ['admin'] },
          },
        ],
      },
      {
        path: '/account',
        component: () => import('@/views/account/settings/Index'),
        redirect: '/account/base',
        hideChildrenInMenu: true,
        name: 'account',
        meta: {
          title: '个人页',
          icon: 'user',
          keepAlive: true,
          permission: ['admin'],
        },
        children: [
          {
            path: '/account/base',
            name: 'baseSettings',
            component: () => import('@/views/account/settings/BaseSetting'),
            meta: { title: '基本设置', hidden: true, permission: ['admin'] },
          },
        ],
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

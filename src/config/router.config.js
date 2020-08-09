// eslint-disable-next-line
import { UserLayout, BasicLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/project',
    children: [
      // project
      {
        path: '/project',
        name: 'project',
        redirect: '/project/list',
        component: () => import('@/views/project/Project'),
        hideChildrenInMenu: true,
        meta: {
          title: '项目',
          keepAlive: true,
          icon: 'project',
        },
        children: [
          // 团队项目列表页，选择某个项目后跳转到对应项目详情页
          {
            path: '/project/list',
            name: 'projectList',
            // TODO: 修改成对应页面
            component: () => import('@/views/exception/404'),
            meta: {
              keepAlive: true,
            },
          },
          // 项目详情页
          {
            path: '/project/detail',
            name: 'projectDetail',
            redirect: '/project/detail/task-list',
            // TODO: 修改成对应页面
            component: () => import('@/views/exception/404'),
            meta: {},
            children: [
              // 任务列表
              {
                path: '/project/detail/task-list',
                name: 'taskList',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
                },
              },
              // 任务看板
              {
                path: '/project/detail/task-board',
                name: 'taskBoard',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
                },
              },
              // 统计
              {
                path: '/project/detail/statistics',
                name: 'statistics',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
                },
              },
              // 项目知识库
              {
                path: '/project/detail/repositories',
                name: 'projectRepo',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
                },
              },
              // 公告
              {
                path: '/project/detail/bulletin',
                name: 'bulletin',
                // TODO: 修改成对应页面
                component: () => import('@/views/exception/404'),
                meta: {
                  keepAlive: true,
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
        // TODO: 修改成对应页面
        component: () => import('@/views/exception/404'),
        meta: {
          title: '知识库',
          icon: 'form',
        },
      },

      // 日历页面
      {
        path: '/calendar',
        name: 'calendar',
        component: () => import('@/views/exception/404'),
        meta: {
          title: '日历',
          icon: 'calendar',
          keepAlive: true,
        },
      },

      // 团队页面
      {
        path: '/members',
        name: 'members',
        // TODO: 修改成对应页面
        component: () => import('@/views/team/Team'),
        meta: {
          title: '团队',
          icon: 'team',
        },
      },

      // 我的页面
      {
        path: '/me',
        name: 'me',
        // TODO: 修改成对应页面
        component: () => import('@/views/exception/404'),
        meta: {
          title: '我的',
          icon: 'user',
        },
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
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]

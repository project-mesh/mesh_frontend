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
        hideChildrenInMenu: false,
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
            // TODO: 修改成对应页面
            component: () => import('@/views/exception/404'),
            meta: {
              keepAlive: true,
            },
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
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        // TODO: 修改成对应页面
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
      ]
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

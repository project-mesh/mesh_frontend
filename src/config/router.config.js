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
        // redirect: '/dashboard/workplace',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: {
          title: '项目',
          keepAlive: true,
          icon: 'project',
        },
      },
      //暂时用作statics统计页面路由
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import('@/views/statistics/Statistics'),
        hideChildrenInMenu: true,
        meta: {
          title: '统计',
          keepAlive: true,
          icon: 'statistics',
        },
      },

      // forms
      {
        path: '/repositories',
        // redirect: '/form/base-form',
        component: RouteView,
        meta: { title: '知识库', icon: 'form', permission: ['form'] },
      },

      // list
      {
        path: '/calendar',
        name: 'calendar',
        component: RouteView,
        // redirect: '/list/table-list',
        meta: { title: '日历', icon: 'calendar', permission: ['table'] },
        hideChildrenInMenu: true,
        // children: [
        //   {
        //     path: '/list/table-list/:pageNo([1-9]\\d*)?',
        //     name: 'TableListWrapper',
        //     hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        //     component: () => import('@/views/list/TableList'),
        //     meta: { title: '查询表格', keepAlive: true, permission: ['table'] },
        //   },
        //   {
        //     path: '/list/basic-list',
        //     name: 'BasicList',
        //     component: () => import('@/views/list/BasicList'),
        //     meta: { title: '标准列表', keepAlive: true, permission: ['table'] },
        //   },
        //   {
        //     path: '/list/card',
        //     name: 'CardList',
        //     component: () => import('@/views/list/CardList'),
        //     meta: { title: '卡片列表', keepAlive: true, permission: ['table'] },
        //   },
        //   {
        //     path: '/list/search',
        //     name: 'SearchList',
        //     component: () => import('@/views/list/search/SearchLayout'),
        //     redirect: '/list/search/article',
        //     meta: { title: '搜索列表', keepAlive: true, permission: ['table'] },
        //     children: [
        //       {
        //         path: '/list/search/article',
        //         name: 'SearchArticles',
        //         component: () => import('../views/list/search/Article'),
        //         meta: { title: '搜索列表（文章）', permission: ['table'] },
        //       },
        //       {
        //         path: '/list/search/project',
        //         name: 'SearchProjects',
        //         component: () => import('../views/list/search/Projects'),
        //         meta: { title: '搜索列表（项目）', permission: ['table'] },
        //       },
        //       {
        //         path: '/list/search/application',
        //         name: 'SearchApplications',
        //         component: () => import('../views/list/search/Applications'),
        //         meta: { title: '搜索列表（应用）', permission: ['table'] },
        //       },
        //     ],
        //   },
        // ],
      },

      // profile
      {
        path: '/members',
        name: 'members',
        component: RouteView,
        // redirect: '/members/basic',
        meta: { title: '团队', icon: 'team', permission: ['profile'] },
        hideChildrenInMenu: true,
        // children: [
        //   {
        //     path: '/profile/basic',
        //     name: 'ProfileBasic',
        //     component: () => import('@/views/profile/basic'),
        //     meta: { title: '基础详情页', permission: ['profile'] },
        //   },
        //   {
        //     path: '/profile/advanced',
        //     name: 'ProfileAdvanced',
        //     component: () => import('@/views/profile/advanced/Advanced'),
        //     meta: { title: '高级详情页', permission: ['profile'] },
        //   },
        // ],
      },

      // result
      {
        path: '/me',
        name: 'me',
        component: RouteView,
        // redirect: '/result/success',
        hideChildrenInMenu: true,
        meta: {
          title: '我的',
          icon: 'user',
          permission: ['result'],
        },
        // children: [
        //   {
        //     path: '/result/success',
        //     name: 'ResultSuccess',
        //     component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
        //     meta: {
        //       title: '成功',
        //       keepAlive: false,
        //       hiddenHeaderContent: true,
        //       permission: ['result'],
        //     },
        //   },
        //   {
        //     path: '/result/fail',
        //     name: 'ResultFail',
        //     component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
        //     meta: {
        //       title: '失败',
        //       keepAlive: false,
        //       hiddenHeaderContent: true,
        //       permission: ['result'],
        //     },
        //   },
        // ],
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

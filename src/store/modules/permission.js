import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import store from '../index'

function filterAsyncRouter(routerMap, role) {
  //TODO : role filter, now you can access all of them
  // console.log('your role is:', role)
  const accessedRouters = routerMap.filter((route) => {
    if (route.meta && route.meta.permission && route.meta.permission.includes(role)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, role)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
  },
  actions: {
    GenerateRoutes({ commit }, role) {
      const accessedRouters = filterAsyncRouter(asyncRouterMap, role)
      commit('SET_ROUTERS', accessedRouters)
    },
  },
}

export default permission

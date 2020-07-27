import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

function filterAsyncRouter(routerMap, role) {
  //TODO : role filter, now you can access all of them
  console.log('your role is:', role)
  const accessedRouters = routerMap.filter((route) => {
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, role)
    }
    return true
  })
  console.log('accessedRouters is: ', accessedRouters)
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
      return new Promise((resolve) => {
        const accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
  },
}

export default permission

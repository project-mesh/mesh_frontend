import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from './store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/dashboard/workplace'

var menuQueryMap = {
  list: () => ({
    teamId: store.getters.teamId,
  }),
  me: () => ({
    teamId: store.getters.teamId,
    username: store.getters.username,
  }),
  repositories: () => ({
    teamId: store.getters.teamId,
    username: store.getters.username,
  }),
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (storage.get(ACCESS_TOKEN)) {
    if (!store.getters.username) {
      store
        .dispatch('Login', { token: storage.get(ACCESS_TOKEN) })
        .then((response) => {
          console.log('in begin login response is :', response)
          if (to.path === loginRoutePath) {
            console.log('will lead you to your home page')
            next({ path: defaultRoutePath })
            NProgress.done()
          } else {
            if (store.getters.addRouters.length === 0) {
              // TODO : role filter
              const role = store.getters.role
              // alert('hello')
              store.dispatch('GenerateRoutes', { role }).then(() => {
                router.addRoutes(store.getters.addRouters)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                // next({ path: redirect })
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            } else {
              let menuItem = to.path.split('/').pop()
              console.log('打印：menuItem: ')
              console.log('看这里！！！！！', to)
              if (menuItem in menuQueryMap && Object.keys(to.query).length === 0) {
                let query = menuQueryMap[menuItem]()
                next({ ...to, query: query, replace: true })
              } else {
                next()
              }
            }
          }
        })
        .catch((error) => {
          console.log('in begin login error is:', error)
          store.dispatch('Logout')
        })
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

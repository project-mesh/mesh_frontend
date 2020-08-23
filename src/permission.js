import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import notification from 'ant-design-vue/es/notification'
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
  }),
  repositories: () => ({
    teamId: store.getters.teamId,
  }),
  calendar: () => ({
    teamId: store.getters.teamId,
  }),
  members: () => ({
    teamId: store.getters.teamId,
  }),
}

function handle(to, from, next) {
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
          tryJumpToHomepage(next, { ...to, replace: true })
        } else {
          // 跳转到目的路由
          tryJumpToHomepage(next, { path: redirect })
        }
      })
    } else {
      let menuItem = to.path.split('/').pop()
      console.log('打印：menuItem: ')
      console.log('看这里！！！！！', to)
      if (menuItem in menuQueryMap && Object.keys(to.query).length === 0) {
        let query = menuQueryMap[menuItem]()
        tryJumpToHomepage(next, { ...to, query: query, replace: true })
      } else {
        tryJumpToHomepage(next)
      }
    }
  }
}

function tryJumpToHomepage(next, route) {
  const promises = [store.dispatch('queryNotification', { username: store.getters.username })]
  if (store.getters.preference.preferenceTeam) {
    const requestData = {
      username: store.getters.username,
      teamId: store.getters.preference.preferenceTeam,
    }
    promises.push(
      store.dispatch('queryTeam', requestData),
      store.dispatch('queryTeamKB', requestData)
    )
  }

  Promise.all(promises)
    .then(() => {
      route ? next(route) : next()
    })
    .catch((error) => {
      notification.error({
        message: '请求用户信息失败，请重试',
        description: `${error.name}: ${error.message}`,
      })
      next(false)
    })
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (storage.get(ACCESS_TOKEN)) {
    if (!store.getters.username) {
      store
        .dispatch('Login', { token: storage.get(ACCESS_TOKEN) })
        .then((response) => {
          handle(to, from, next)
        })
        .catch((error) => {
          console.log('in begin login error is:', error)
          store.dispatch('Logout')
        })
    } else {
      handle(to, from, next)
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

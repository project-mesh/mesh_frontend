import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import notification from 'ant-design-vue/es/notification'
import store from './store'
import Cookies from 'js-cookie'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/project/list'

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
      store.dispatch('GenerateRoutes', role)
      router.addRoutes(store.getters.addRouters)

      if (
        store.getters.role === 'user' &&
        (!store.getters.teams || store.getters.teams.length === 0)
      )
        return next({ name: 'noTeam' })
      next({ ...to })
    } else {
      console.log(to)
      next()
    }
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start() // strt progress bar
  console.log(Cookies.get())
  console.log('state.teams is', store.getters.teams)
  if (Cookies.get(store.getters.sessionKey)) {
    if (!store.getters.username) {
      store
        .dispatch('Login')
        .then((res) => {
          if (res.isSuccess) {
            handle(to, from, next)
          } else {
            store.dispatch('Logout')
          }
        })
        .catch((err) => {
          console.log('in begin login err is:', err)
          store.dispatch('Logout')
          Cookies.remove(store.getters.sessionKey)
          next({ path: loginRoutePath })
        })
    } else {
      handle(to, from, next)
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      alert('2')
      next({ path: loginRoutePath })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import notification from 'ant-design-vue/es/notification'
import store from './store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const loginRoutePath = '/user/login'
const defaultRoutePath = '/project/list'

// var menuQueryMap = {
//   list: () => ({
//     teamId: store.getters.teamId,
//   }),
//   me: () => ({
//     teamId: store.getters.teamId,
//   }),
//   repositories: () => ({
//     teamId: store.getters.teamId,
//   }),
//   calendar: () => ({
//     teamId: store.getters.teamId,
//   }),
//   members: () => ({
//     teamId: store.getters.teamId,
//   }),
// }

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
      next({ ...to })
    } else {
      // let menuItem = to.path.split('/').pop()
      // // console.log('打印：menuItem: ')
      // console.log('看这里！！！！！', to)
      // if (menuItem in menuQueryMap && Object.keys(to.query).length === 0) {
      //   let query = menuQueryMap[menuItem]()
      //   // tryJump(to, next, { ...to, query })
      //   next({ ...to, query })
      // } else {
      //   next()
      // }
      next()
    }
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (storage.get(ACCESS_TOKEN)) {
    if (!store.getters.username) {
      store
        .dispatch('Login', { token: storage.get(ACCESS_TOKEN) })
        .then((res) => {
          handle(to, from, next)
        })
        .catch((err) => {
          console.log('in begin login err is:', err)
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

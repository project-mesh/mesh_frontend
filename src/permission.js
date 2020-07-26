import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
const loginRoutePath = '/user/login'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  console.log('in router.beforeEach')
  console.log(storage.get(ACCESS_TOKEN))
  if (storage.get(ACCESS_TOKEN)) {
    console.log('have token')
    if (to.path === loginRoutePath) {
      console.log('will lead you to your home page')
      // next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // 这里进行检查，未完成
      console.log('todo: xxx')
      next()
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

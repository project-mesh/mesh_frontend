import NProgress from 'nprogress' // progress bar
import router from './router'
import '@/components/NProgress/nprogress.less' // progress bar custom style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (to.fullPath === '/user/login') {
    return next()
  }
  next('/user')
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

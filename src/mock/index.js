import { isIE } from '@/utils/util'

// 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
// 在前后端对接前暂时允许在生产环境下使用 Mock.js
//if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true')
// eslint-disable-next-line no-constant-condition
if (true) {
  if (isIE()) {
    console.error('[mesh] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
  }
  // 使用同步加载依赖
  // 防止请求早于 mock 运行，导致无法 mock 请求返回结果
  console.log('[mesh] mock mounting')
  const Mock = require('mockjs2')
  require('./services/bulletin')
  require('./services/knowledgeBase')
  require('./services/notification')
  require('./services/task')
  require('./services/project')
  require('./services/team')
  require('./services/user')

  Mock.setup({
    timeout: 800, // setter delay time
  })
  console.log('[mesh] mock mounted')
}

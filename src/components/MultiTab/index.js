import events from './events'
import MultiTab from './MultiTab'
import './index.less'

const api = {
  /**
   * open new tab on route fullPath
   * @param config
   */
  open(config) {
    events.$emit('open', config)
  },
  rename(key, name) {
    events.$emit('rename', { key, name })
  },
  /**
   * close current page
   */
  closeCurrentPage() {
    this.close()
  },
  /**
   * close route fullPath tab
   * @param config
   */
  close(config) {
    events.$emit('close', config)
  },
}

MultiTab.install = function (Vue) {
  if (Vue.prototype.$multiTab) {
    return
  }
  api.instance = events
  Vue.prototype.$multiTab = api
  Vue.component('multi-tab', MultiTab)
}

export default MultiTab

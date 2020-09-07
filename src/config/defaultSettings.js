import {
  TOGGLE_NAV_THEME,
  TOGGLE_LAYOUT,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_COLOR,
  TOGGLE_WEAK,
} from '@/store/mutation-types'
import storage from 'store'
/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  navTheme: storage.get(TOGGLE_NAV_THEME, 'dark'), // theme for nav menu
  primaryColor: storage.get(TOGGLE_COLOR, '#52C41A'), // primary color of ant design
  layout: storage.get(TOGGLE_LAYOUT, 'sidemenu'), // nav menu position: `sidemenu` or `topmenu`
  contentWidth: storage.get(TOGGLE_CONTENT_WIDTH, 'Fluid'), // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: storage.get(TOGGLE_FIXED_HEADER, false), // sticky header
  fixSiderbar: storage.get(TOGGLE_FIXED_SIDEBAR, false), // sticky siderbar
  colorWeak: storage.get(TOGGLE_WEAK, false),
  menu: {
    locale: false,
  },
  title: 'Mesh',
  pwa: false,
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true',
}

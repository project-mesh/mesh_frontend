<template>
  <pro-layout
    :title="title"
    :menus="menus"
    :collapsed="collapsed"
    :media-query="query"
    :is-mobile="isMobile"
    :handle-media-query="handleMediaQuery"
    :handle-collapse="handleCollapse"
    :logo="logoRender"
    :content-width="settings.contentWidth ? 'Fluid' : 'Fixed'"
    v-bind="settings"
  >
    <setting-drawer :settings="settings" @change="handleSettingChange" />
    <template v-slot:rightContentRender>
      <right-content
        :top-menu="settings.layout === 'topmenu'"
        :is-mobile="isMobile"
        :theme="settings.theme"
      />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { updateTheme } from '@ant-design-vue/pro-layout'
import SettingDrawer from '@/components/SettingDrawer'
import { i18nRender } from '@/locales'
import { mapState, mapGetters, mapActions } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import storage from 'store'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../assets/logo.svg?inline'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter,
  },
  data() {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite:
        process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: storage.get(SIDEBAR_TYPE, false),
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // 定宽: true / 流式: false
        contentWidth:
          defaultSettings.layout === 'sidemenu' ? true : defaultSettings.contentWidth === 'Fixed',
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: storage.get(TOGGLE_MOBILE_TYPE, false),
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
    ...mapGetters(['preference', 'username']),
  },
  created() {
    const routes = this.mainMenu.find((item) => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted() {
    const { userAgent } = navigator
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    if (this.preference.preferenceColor)
      this.settings.primaryColor = this.preference.preferenceColor
    if (this.preference.preferenceLayout) this.settings.layout = this.preference.preferenceLayout

    updateTheme(this.settings.primaryColor)
  },
  methods: {
    ...mapActions(['updatePreferenceColor', 'updatePreferenceLayout']),
    i18nRender,
    handleMediaQuery(val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = false
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse(val) {
      this.collapsed = val
    },
    handleSettingChange({ type, value }) {
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value === 'Fixed'
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = false
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = true
          }
          this.updatePreferenceLayout({ username: this.username, preferenceLayout: value }).then(
            () => {
              console.log('update preferenceLayout success')
            }
          )
          break
        case 'primaryColor':
          this.updatePreferenceColor({ username: this.username, preferenceColor: value }).then(
            () => {
              console.log('update preferenceColor success')
            }
          )
      }
    },
    logoRender() {
      return <LogoSvg />
    },
  },
}
</script>

<style lang="less">
@import './BasicLayout.less';
</style>

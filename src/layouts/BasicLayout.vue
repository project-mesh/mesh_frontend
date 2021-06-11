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
    <a-modal v-model="localCreatingTeam" title="创建新团队" centered @ok="handleSubmit">
      <!-- 项目创建表单 -->
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleSubmit"
      >
        <a-form-item label="团队名称">
          <a-input
            v-decorator="[
              'teamName',
              { rules: [{ required: true, message: '请输入新团队的名称!' }] },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <router-view />
  </pro-layout>
</template>

<script>
import store from '../store'
import { updateTheme } from '@ant-design-vue/pro-layout'
import SettingDrawer from '@/components/SettingDrawer'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import storage from 'store'
import { timeFix } from '@/utils/util'

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
      isMobile: false,

      //创建新团队
      form: this.$form.createForm(this),
      localCreatingTeam: false,
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
    }),
    ...mapGetters(['preference', 'username', 'isCreatingTeam', 'notifications', 'teamId']),
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
  watch: {
    localCreatingTeam: function (newValue) {
      store.commit('TOGGLE_CREATING_TEAM', newValue)
    },
    isCreatingTeam: function (newValue) {
      this.localCreatingTeam = newValue
    },
  },
  methods: {
    ...mapActions([
      'updatePreferenceColor',
      'updatePreferenceLayout',
      'createTeam',
      'queryTeam',
      'queryTeamKB',
      'queryNotification',
    ]),
    ...mapMutations(['ADD_NEW_TEAM', 'TOGGLE_CREATING_TEAM']),
    handleSubmit(e) {
      console.log('创建新团队')
      e.preventDefault()
      this.TOGGLE_CREATING_TEAM(false)
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const promises = []
          this.createTeam({ username: store.getters.username, teamName: values.teamName })
            .then((response) => {
              console.log('success,boy', response)
              // 增加新建的团队到团队列表
              this.ADD_NEW_TEAM(response.data.team)
              console.log('after add new team', store.getters.teams)
              const requestData = { username: this.username, teamId: response.data.team.teamId }
              promises.push(this.queryTeam(requestData), this.queryTeamKB(requestData))
              // 异步显示成功信息
              setTimeout(() => {
                this.$notification.success({
                  message: '创建成功',
                  description: `${timeFix()}，已成功创建新团队`,
                })
              }, 0)
              // 跳转到团队路由界面
              this.$router.push({ name: 'membersList' })
            })
            .catch((err) => {
              console.log('error, boy: ', err)
              this.$notification.error({
                message: '创建失败',
                description: err,
              })
            })
          if (promises.length) {
            Promise.all(promises)
              .then(() => {
                this.$notification.success({ message: '团队信息加载成功！' })
              })
              .catch((err) => {
                this.$notification.error({
                  message: '请求团队信息失败，请重试',
                  description: `${err.name}: ${err.message}`,
                })
                this.$router.push('/404')
              })
          }
        }
      })
    },
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

<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar size="small" :src="avatar" class="antd-pro-global-header-index-avatar" />
      <span>{{ username }}</span>
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu && role === 'user'" key="center" @click="handleToCenter">
          <a-icon type="user" />
          个人中心
        </a-menu-item>
        <a-menu-item v-if="menu && role === 'user'" key="settings" @click="handleToSettings">
          <a-icon type="setting" />
          个人设置
        </a-menu-item>
        <a-menu-divider v-if="menu && role === 'user'" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null,
    },
    menu: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'avatar', 'role']),
  },
  methods: {
    ...mapActions(['Logout']),
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      if (this.role === 'user') {
        this.$router.push({ path: '/account/settings' })
      } else {
        this.$router.push({ path: '/account/base' })
      }
    },
    handleLogout() {
      const vm = this
      Modal.confirm({
        title: '您确定要退出吗？',
        onOk: () => {
          console.log(vm.Logout)
          vm.Logout({ username: vm.username }).then(() => {
            vm.$router.push({ name: 'login' })
          })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>

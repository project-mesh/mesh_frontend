<template>
  <div :class="wrpCls">
    <team-selector v-if="role === 'user'" :class="prefixCls" />
    <router-link tag="span" :to="{ name: 'center' }" v-if="role === 'user'" :class="prefixCls">
      <a-badge :count="notifications.length" dot>
        <a-icon type="notification" />
      </a-badge>
    </router-link>
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import SelectLang from '@/components/SelectLang'
import AvatarDropdown from './AvatarDropdown'
import TeamSelector from './TeamSelector'
import { mapGetters } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    TeamSelector,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action',
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
    }
  },
  computed: {
    ...mapGetters(['notifications', 'role']),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${
          this.isMobile || !this.topMenu ? 'light' : this.theme
        }`]: true,
      }
    },
  },
  mounted() {
    setTimeout(() => {
      this.currentUser = {
        name: 'Serati Ma',
      }
    }, 1500)
  },
}
</script>

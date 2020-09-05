<template>
  <a-dropdown placement="bottomRight">
    <span>
      <a-badge :count="notifications.length" dot>
        <a-icon type="notification" />
      </a-badge>
    </span>
    <template v-if="notifications.length" v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu">
        <a-menu-item
          v-for="notification in notificationsDisplay"
          :key="notification.notificationId"
        >
          <span class="title">{{ notification.title }}</span>
          <a><a-icon type="close" /></a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { formatDateByPattern } from '@/utils/dateUtil'

export default {
  data() {
    return {
      customStyle: {
        background: '#fff',
        // width: '700px',
      },
    }
  },
  computed: {
    ...mapGetters(['notifications', 'username']),
    notificationsDisplay() {
      const formatedData = JSON.parse(JSON.stringify(this.notifications))
      formatedData.forEach((notification) => {
        notification.createTime = formatDateByPattern(
          new Date(Number(notification.createTime)),
          'yyyy-MM-dd hh:mm'
        )
      })

      return formatedData
    },
  },
  methods: {
    ...mapActions(['queryNotification']),
  },
  mounted() {
    // this.queryNotification({ username: this.username })
    //   .then(() => {
    //     this.$notification.success({
    //       message: '成功获取通知',
    //     })
    //     console.log(this.notifications.length)
    //   })
    //   .catch((error) => {
    //     this.$notification.error({
    //       message: '获取通知失败',
    //       description: `${error.name}: ${error.message}`,
    //     })
    //   })
  },
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.title {
  flex: 1;
}
</style>

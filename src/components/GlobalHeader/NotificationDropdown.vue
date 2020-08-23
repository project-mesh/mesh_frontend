<template>
  <a-dropdown :placement="bottomRight">
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
          <a-popover trigger="hover" placement="leftTop" overlay-style="padding: 0;">
            <template slot="content">
              <a-card :title="notification.title" :bordered="false">
                <p>描述：{{ notification.description }}</p>
                <p>创建时间：{{ notification.createTime }}</p>
                <template slot="actions" class="ant-card-actions">
                  <a-icon key="setting" type="setting" />
                  <a-icon key="edit" type="edit" />
                  <a-icon key="ellipsis" type="ellipsis" />
                </template>
              </a-card>
            </template>
            <div>{{ notification.title }}</div>
          </a-popover>
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
  }
}
</style>

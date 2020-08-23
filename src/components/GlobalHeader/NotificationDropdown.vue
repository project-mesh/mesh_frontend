<template>
  <a-dropdown :placement="bottomRight">
    <a-badge :count="notifications.length" dot>
      <a-icon type="notification" />
    </a-badge>
    <template v-if="notifications.length" v-slot:overlay>
      <a-collapse :bordered="false">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel
          v-for="notification in notificationsDisplay"
          :key="notification.notificationId"
          :header="notification.title"
          :style="customStyle"
        >
          <p>{{ notification.description }}</p>
        </a-collapse-panel>
      </a-collapse>
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
      },
    }
  },
  computed: {
    ...mapGetters(['notifications', 'username']),
    notificationsDisplay() {
      const formatedData = JSON.parse(JSON.stringify(this.notifications))
      formatedData.forEach((notification) => {
        notification.createTimeDisplay = formatDateByPattern(
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
    //       description: '成功获取团队知识库',
    //     })
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

<style></style>

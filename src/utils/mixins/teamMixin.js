import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['notifications', 'teamId', 'username', 'preference']),
  },
  methods: {
    ...mapActions(['queryTeam', 'queryTeamKB', 'queryNotification', 'queryTeamTasks']),
    // 判断是否需要重新加载团队信息
    needToLoadTeamInfo() {
      const currentRoute = this.$route
      // 如果团队改变，返回true
      if (
        currentRoute.query &&
        currentRoute.query.teamId &&
        currentRoute.query.teamId !== this.teamId
      ) {
        return true
      } else if (!this.teamId) {
        // 如果当前沒有团队信息且存在偏好团队，返回true
        return true
      }
      return false
    },
    loadTeamInfo() {
      const promises = []
      const currentRoute = this.$route

      if (this.needToLoadTeamInfo()) {
        const requestData = {
          username: this.username,
          teamId: this.preference.preferenceTeam,
        }
        if (currentRoute.query && currentRoute.query.teamId)
          requestData.teamId = currentRoute.query.teamId

        promises.push(
          this.queryTeam(requestData),
          this.queryTeamKB(requestData),
          this.queryTeamTasks(requestData)
        )
      }
      if (promises.length) {
        Promise.all(promises)
          .then(() => {
            // this.$notification.success({
            //   message: '团队信息加载成功！',
            // })
            console.log('团队信息加载成功')
          })
          .catch((err) => {
            this.$notification.error({
              message: '请求团队信息失败，请重试',
              description: `${err.name}: ${err.message}`,
            })
            this.$router.push('/404')
          })
      }
    },
  },
  mounted() {
    if (this.preference.preferenceTeam !== -1) {
      this.loadTeamInfo()
    }
  },
  activated() {
    if (this.preference.preferenceTeam !== -1) {
      this.loadTeamInfo()
    }
  },
}

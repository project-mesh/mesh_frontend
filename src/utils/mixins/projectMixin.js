import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['projectId', 'username']),
  },
  methods: {
    ...mapActions(['queryProject', 'queryProjectKB', 'queryBulletin', 'queryProjectTasks']),
    // 判断是否需要重新加载团队信息
    loadProjectInfo() {
      const promises = []
      const currentRoute = this.$route

      // console.log('currentRoute: ', currentRoute)

      if (
        currentRoute.query &&
        currentRoute.query.projectId &&
        currentRoute.query.projectId !== this.projectId
      ) {
        const requestData = {
          username: this.username,
          projectId: currentRoute.query.projectId,
        }

        promises.push(
          this.queryProject(requestData),
          this.queryProjectKB(requestData),
          this.queryProjectTasks(requestData),
          this.queryBulletin(requestData)
        )
      }
      if (promises.length) {
        Promise.all(promises)
          .then(() => {
            this.$notification.success({
              message: '项目信息加载成功！',
            })
          })
          .catch((err) => {
            this.$notification.error({
              message: '请求项目信息失败，请重试',
              description: `${err.name}: ${err.message}`,
            })
            this.$router.push('/404')
          })
      }
    },
  },
  mounted() {
    this.loadProjectInfo()
  },
  activated() {
    this.loadProjectInfo()
  },
}

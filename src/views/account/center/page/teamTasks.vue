<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false">
      <a-list
        size="large"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 5,
          total: this.teamTasks.length,
        }"
      >
        <a-list-item :key="index" v-for="(item, index) in teamTasks" @click="handleClick">
          <a-list-item-meta :description="item.short">
            <a slot="title">{{ item.taskName }}</a>
          </a-list-item-meta>
          <div class="list-content">
            <div class="list-content-item">
              <span>负责人</span>
              <p>{{ item.principal }}</p>
            </div>
            <div class="list-content-item">
              <span>截止时间</span>
              <p>{{ item.deadline }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TeamTasksPage',
  components: {},
  data() {
    return {}
  },
  methods: {
    ...mapActions(['queryTeamTasks']),
    handleClick() {
      this.$router.push({ name: 'taskBoard' })
    },
  },
  computed: mapGetters(['teamTasks', 'username', 'teamId']),
  mounted() {
    if (this.$route.query.teamId && this.$route.query.teamId !== -1) {
      this.queryTeamTasks({ username: this.username, teamId: this.teamId }).catch((error) => {
        this.$notification.error({
          message: '获取任务失败',
          description: `${error.name}: ${error.message}`,
        })
      })
    }
  },
}
</script>

<style lang="less" scoped>
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>

<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false" title="任务">
      <a-list
        size="large"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 5,
          total: 50,
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
            <div class="list-content-item">
              <a-progress
                :percent="item.progress.value"
                :status="!item.progress.status ? null : item.progress.status"
                style="width: 180px"
              />
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import teamTasks from '../../../../store/modules/teamTasks'

export default {
  name: 'TeamTasksPage',
  components: {},
  data() {
    return {}
  },
  methods: {
    ...mapActions(['queryTeamTasks']),
    handleClick() {
      alert('//TODO:跳转到任务面板详情界面')
    },
  },
  computed: mapGetters(['teamTasks', 'username', 'teamId']),
  mounted() {
    this.queryTeamTasks({ username: this.username, teamId: this.teamId }).catch((error) => {
      this.$notification.error({
        message: '获取任务失败',
        description: `${error.name}: ${error.message}`,
      })
    })
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

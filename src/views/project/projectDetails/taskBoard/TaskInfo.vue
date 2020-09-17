<!-- 展示任务基本信息的小框-->
<template>
  <a-descriptions size="small" :column="4">
    <div slot="title">
      {{ task.taskName }}
      <a-icon
        class="icon-checkbox"
        key="check-square"
        :type="task.isFinished ? 'check-square' : 'border'"
        @click.stop="changeTaskFinishingStatus"
      />
    </div>
    <a-descriptions-item label="创建时间" span="4">
      {{ task.createTime | dateFilter }}
    </a-descriptions-item>
    <a-descriptions-item label="截止日期" span="4">{{ task.deadline }}</a-descriptions-item>
    <a-descriptions-item label="创建者" span="4">
      <avatar-featured-user :username="task.founder" />
    </a-descriptions-item>
    <a-descriptions-item label="负责人" span="4">
      <avatar-featured-user :username="task.principal" />
    </a-descriptions-item>
  </a-descriptions>
</template>
<script>
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
export default {
  components: {
    AvatarFeaturedUser,
  },
  computed: {
    ...mapGetters(['username', 'projectAdminName']),
  },
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          taskId: '',
          taskName: '',
          isFinished: false,
          priority: 0,
          createTime: '0',
          deadline: '1970-01-01',
          description: '',
          founder: '',
          principal: '',
          subTasks: [],
          status: '',
        }
      },
    },
  },
  methods: {
    changeTaskFinishingStatus: function () {
      if ([this.task.principal, this.projectAdminName].includes(this.username))
        this.$emit('update-task', this.task, { isFinished: !this.task.isFinished })
    },
  },
}
</script>
<style scoped>
.icon-checkbox {
  float: right;
}
</style>

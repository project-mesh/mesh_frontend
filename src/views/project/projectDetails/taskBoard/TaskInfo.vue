<!-- 展示任务基本信息的小框-->
<template>
  <div class="card">
    <a-descriptions size="small" :column="4" @click="console.log(task)">
      <div slot="title">
        {{ task.taskName }}
        <a-icon
          class="icon-checkbox"
          key="check-square"
          :type="task.isFinished ? 'check-square' : 'border'"
          @click.stop="changeTaskFinishingStatus"
        />
      </div>
      <a-descriptions-item label="创建时间" :span="4">
        {{ task.createTime | dateFilter }}
      </a-descriptions-item>
      <a-descriptions-item label="截止日期" :span="4">{{ task.deadline }}</a-descriptions-item>
      <a-descriptions-item label="负责人" :span="4">
        <avatar-featured-user :username="task.principal" />
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
import eventBus from '../eventBus'

export default {
  components: {
    AvatarFeaturedUser,
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId']),
  },
  methods: {
    changeTaskFinishingStatus: function () {
      this.$emit('task-update', {
        task: this.task,
        requestData: {
          username: this.username,
          projectId: this.projectId,
          taskId: this.task.taskId,
          isFinished: !this.task.isFinished,
          principal: this.task.principal,
          deadline: this.task.deadline,
        },
      })
    },
  },
}
</script>
<style scoped>
.icon-checkbox {
  float: right;
}

.card {
  border-radius: 15px;
  padding: 10px;
  border: 2px;
  border-style: dashed;
  border-color: #d0d0d0;
}
</style>

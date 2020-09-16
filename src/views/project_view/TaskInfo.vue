<!-- 展示任务基本信息的小框-->
<template>
  <a-descriptions size="small" :column="3" @click="console.log(task)">
    <div slot="title">
      {{ task.taskName }}
      <a-icon
        class="icon-checkbox"
        key="check-square"
        :type="task.isFinished ? 'check-square' : 'border'"
        @click="changeTaskFinishingStatus"
      />
    </div>
    <a-descriptions-item label="创建时间" span="3">
      {{ task.createTime | dateFilter }}
    </a-descriptions-item>
    <a-descriptions-item label="截止日期" span="3">{{ task.deadline }}</a-descriptions-item>
    <a-descriptions-item label="创建者" span="1">{{ task.founder }}</a-descriptions-item>
    <a-descriptions-item label="负责人" span="1">{{ task.principal }}</a-descriptions-item>
  </a-descriptions>
</template>
<script>
export default {
  methods: {
    changeTaskFinishingStatus: function () {
      this.$emit('update-task', this.task, 'isFinished', !this.task.isFinished)
    },
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
}
</script>
<style scoped>
.icon-checkbox {
  float: right;
}
</style>
>

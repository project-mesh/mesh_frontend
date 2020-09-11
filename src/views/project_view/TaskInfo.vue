<!-- 展示任务基本信息的小框，宽度、高度均为固定 -->
<template>
  <a-card :title="task.taskName" class="task-info" @click="showTaskInfo">
    <a-descriptions size="small" layout="vertical" column="1">
      <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
      <a-descriptions-item label="创建者">{{ task.founder }}</a-descriptions-item>
      <a-descriptions-item label="截止日期">{{ task.deadline }}</a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>
<script>
export default {
  props: {
    task: {
      type: Object,
      default: function () {
        return {
          tag: '',
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
        }
      },
    },
    showTaskList: {
      type: null,
      default: function () {
        return null
      },
    },
  },
  methods: {
    showTaskInfo: function () {
      if (this.showTaskList) {
        this.showTaskList()
      }
    },
  },
}
</script>

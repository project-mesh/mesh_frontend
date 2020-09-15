<!-- 展示任务基本信息的小框，宽度、高度均为固定 -->
<template>
  <a-descriptions size="small" layout="vertical">
    <a-descriptions-item label="任务">{{ task.taskName }}</a-descriptions-item>
    <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
    <a-descriptions-item label="创建时间">
      {{ new Date(+task.createTime).toLocaleString() }}
    </a-descriptions-item>
    <a-descriptions-item label="截止日期">{{ task.deadline }}</a-descriptions-item>
  </a-descriptions>
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
  },
  methods: {},
}
</script>

<!-- 展示任务基本信息的小框-->
<template>
  <div class="dsf">
    <a-descriptions size="small" :title="task.taskName" column="3">
      <a-descriptions-item label="创建时间" span="3">
        {{ task.createTime | formatTimeStamp }}
      </a-descriptions-item>
      <a-descriptions-item label="截止日期" span="3">{{ task.deadline }}</a-descriptions-item>
    </a-descriptions>
    <!-- <a-avatar
      slot="avatar"
      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
    /> -->
    <a-descriptions size="small" column="3">
      <a-descriptions-item label="创建者" span="1">{{ task.founder }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions size="small" column="3">
      <a-descriptions-item label="负责人" span="1">{{ task.principal }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import moment from 'moment'
export default {
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
  filters: {
    formatTimeStamp: (timeStamp) => moment(new Number(timeStamp)).format('YYYY-MM-DD'),
  },
  method: {},
}
</script>

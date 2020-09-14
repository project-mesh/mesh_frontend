<!-- 展示任务基本信息的小框-->
<template>
  <a-descriptions size="small" :title="task.taskName" column="3">
    <a-descriptions-item label="创建时间" span="3">{{ formattedCreateTime }}</a-descriptions-item>

    <a-descriptions-item label="截止日期" span="3">{{ task.deadline }}</a-descriptions-item>

    <a-descriptions-item label="创建者" span="1">{{ task.founder }}</a-descriptions-item>
    <a-descriptions-item label="负责人" span="1">{{ task.principal }}</a-descriptions-item>
  </a-descriptions>
</template>
<script>
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
  computed: {
    formattedCreateTime: function () {
      const date = new Date(new Number(this.task.createTime))
      let fmt = 'yyyy-MM-dd'
      const o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        S: date.getMilliseconds(), //毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    },
  },
  method: {
    formatDate: function (date, fmt) {
      return fmt
    },
  },
}
</script>

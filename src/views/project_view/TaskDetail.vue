<template>
  <a-drawer :title="task.taskName" width="540" :closable="true" :visible="visible">
    <a-descriptions class="drawer-content" size="large" column="3">
      <a-descriptions-item label="创建者">
        {{ task.founder }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间" span="2">{{ formattedCreateTime }}</a-descriptions-item>

      <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
      <a-descriptions-item label="截止日期" span="2" contenteditable="true">
        {{ task.deadline }}
      </a-descriptions-item>
      <a-descriptions-item label="优先级" span="1">{{ task.priority }}</a-descriptions-item>
      <a-descriptions-item label="状态" span="1">{{ task.status }}</a-descriptions-item>

      <a-descriptions-item label="已完成" span="1">
        {{ task.isFinished ? '是' : '否' }}
      </a-descriptions-item>

      <a-descriptions-item label="描述" span="3">{{ task.description }}</a-descriptions-item>
      <a-descriptions-item label="子任务" span="3"></a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>
<script>
export default {
  data() {
    return {
      exampleTask: {
        taskName: 'example',
      },
    }
  },

  props: {
    visible: {
      type: Boolean,
      default: function () {
        return true
      },
    },

    task: {
      type: Object,
      default: function () {
        return {
          taskId: 'id',
          taskName: '任务名',
          isFinished: false,
          priority: 0,
          createTime: '0',
          deadline: '1970-01-01',
          description: '描述内容',
          founder: '创建者',
          principal: '负责人',
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
  methods: {
    closeTaskDetail: function () {
      console.log('close')
      this.$emit('closeTaskDetail')
    },
  },
}
</script>

<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="8" v-for="(taskListWithTag, taskListIndex) in tasks" :key="taskListIndex">
      <task-list :task-list-with-tag="taskListWithTag" ghost-class="task-list"></task-list>
    </a-col>
  </a-row>
</template>
<script>
import TaskList from './TaskList'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'

export default {
  components: {
    //调用组件
    TaskList,
  },
  mixins: [teamMixin, projectMixin],
  data() {
    return {
      visible: false,
      drag: false,
      taskListGroup: {
        name: 'taskList',
      },
      form: this.$form.createForm(this),
      tasks: [
        {
          tag: '开发中',
          tasks: [
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: 'UI/UX设计',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘雪迪',
              principal: '蒋金峰',
              subTasks: [],
            },
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: '444',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '迪',
              principal: '峰',
              subTasks: [],
            },
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: '1111',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘',
              principal: '峰',
              subTasks: [],
            },
          ],
        },
        {
          tag: '开发完毕',
          tasks: [
            {
              tag: '开发完毕',
              taskId: 'aklgnlkjsald',
              taskName: '222',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '雪',
              principal: '蒋',
              subTasks: [],
            },
          ],
        },
        {
          tag: '已逾期',
          tasks: [],
        },
      ],
    }
  },
  methods: {
    setDrag(value) {
      this.drag = value
    },
  },
}
</script>

/* eslint-disable */
<template>
  <div style="background-color: #ececec; padding: 20px">
    <div class="tasks-view-wrapper">
      <draggable group="taskListGroup" :list="tasks">
        <task-list slot="footer" :task-list-with-tag="[]"></task-list>
        <task-list
          v-for="(taskListWithTag, taskListIndex) in tasks"
          :key="taskListIndex"
          :task-list-with-tag="taskListWithTag"
          ghost-class="task-list"
        ></task-list>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import TaskList from './TaskList'
export default {
  components: {
    //调用组件
    draggable,
    TaskList,
  },
  //    <-- <a-card v-for="(index, item) in list" :key="item"></a-card>--->
  data() {
    return {
      visible: false,

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
      ],
    }
  },
  methods: {},
}
</script>

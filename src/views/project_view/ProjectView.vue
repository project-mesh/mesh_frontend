<template>
  <a-card :bordered="false" :body-style="{ padding: 0 }" :loading="boardLoading">
    <a-row :gutter="[8, 8]">
      <a-col :span="8" v-for="(taskListWithStatus, taskListIndex) in tasks" :key="taskListIndex">
        <task-list
          :tasks="taskListWithStatus.tasks"
          :status="taskListWithStatus.status"
          :set-task="setSelectedTask"
          @end="onDragEnd"
          ghost-class="task-list"
        ></task-list>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import TaskList from './TaskList'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

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
      boardLoading: false,
      selectedTask: null,
      tasks: [
        {
          status: '开发中',
          tasks: [],
        },
        {
          status: '已逾期',
          tasks: [],
        },
        {
          status: '已完成',
          tasks: [],
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['username', 'projectId']),
  },
  methods: {
    ...mapActions(['queryProjectTasks', 'updateTask']),
    setSelectedTask(task) {
      this.selectedTask = task
    },
    onDragEnd($event) {
      const toStatus = $event.to.dataset.status
      const fromStatus = $event.from.dataset.status
      if (toStatus !== fromStatus && this.selectedTask) {
        let isFinished = toStatus === '已完成'
        this.selectedTask.isFinished = isFinished
        this.selectedTask.status = toStatus
        const requestData = {
          username: this.username,
          projectId: this.projectId,
          taskId: this.selectedTask.taskId,
          isFinished,
        }

        this.updateTask(requestData)
          .then(() => {
            console.log('updateTask success')
          })
          .catch((err) => {
            this.$notification.error({
              message: '更新任务信息失败',
              description: err.message,
            })
          })
      }
    },
  },
  mounted() {
    this.boardLoading = true
    this.queryProjectTasks({
      username: this.username,
      projectId: this.$route.query.projectId,
    })
      .then((res) => {
        const { tasks: resTasks } = res.data

        resTasks.forEach((task) => {
          this.tasks.find((taskList) => taskList.status === task.status).tasks.push(task)
        })
      })
      .catch((err) => {
        this.$notification.error({
          message: '查询项目任务失败',
          description: err.message,
        })
      })
      .finally(() => (this.boardLoading = false))
  },
}
</script>

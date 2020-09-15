<template>
  <a-card :bordered="false" :body-style="bodyStyle" :loading="boardLoading">
    <a-row :gutter="[8, 8]">
      <a-col :span="8" v-for="(taskListWithStatus, taskListIndex) in tasks" :key="taskListIndex">
        <task-column
          :tasks="taskListWithStatus.tasks"
          :status="taskListWithStatus.status"
          :set-task="setSelectedTask"
          @end="onDragEnd"
          ghost-class="task-column"
        ></task-column>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import TaskColumn from './TaskColumn'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskColumn,
  },
  mixins: [teamMixin, projectMixin],
  data() {
    return {
      visible: false,
      drag: false,
      taskListGroup: {
        name: 'taskList',
      },
      bodyStyle: {
        padding: 0,
        minHeight: '1000px',
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
    ...mapGetters(['username', 'projectId', 'projectTasks']),
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
    if (!this.projectTasks || this.projectTasks.length === 0) {
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
    } else {
      this.projectTasks.forEach((task) => {
        this.tasks.find((taskList) => taskList.status === task.status).tasks.push(task)
      })
    }

    this.$emit('load', 'taskBoard')
  },
}
</script>

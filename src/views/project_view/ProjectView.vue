<template>
  <div>
    <task-detail
      :visible="drawerVisible"
      :task="selectedTask"
      @closeTaskDetail="closeTaskDetail"
      @close="closeTaskDetail"
    ></task-detail>
    <a-card :bordered="false" :body-style="{ padding: 0 }" :loading="boardLoading">
      <a-row :gutter="[8, 8]">
        <a-col :span="8" v-for="(taskListWithStatus, taskListIndex) in tasks" :key="taskListIndex">
          <task-list
            :tasks="taskListWithStatus.tasks"
            :status="taskListWithStatus.status"
            :set-task="setSelectedTask"
            @end="onDragEnd"
            @showTaskDetail="showTaskDetail"
            ghost-class="task-list"
          ></task-list>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import TaskList from './TaskList'
import TaskDetail from './TaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskList,
    TaskDetail,
  },
  mixins: [teamMixin, projectMixin],

  data() {
    return {
      drawerVisible: false,
      drag: false,
      taskListGroup: {
        name: 'taskList',
      },
      form: this.$form.createForm(this),
      boardLoading: false,
      selectedTask: null,
      task: {
        taskId: '',
        taskName: 'ddd',
        isFinished: false,
        priority: 0,
        createTime: '0',
        deadline: '1970-01-01',
        description: '',
        founder: '',
        principal: '',
        subTasks: [],
        status: '',
      },
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
    showTaskDetail(task) {
      console.log('[ProjectView:showTaskDetail]')
      console.log(task)
      this.setSelectedTask(task)
      if (this.selectedTask) {
        this.drawerVisible = true
      }
    },
    closeTaskDetail() {
      close.log('parent close')
      this.drawerVisible = false
      this.selectedTask = null
    },
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

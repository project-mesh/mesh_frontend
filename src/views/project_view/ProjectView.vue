<template>
  <div>
    <task-detail
      :visible="detailDrawerVisible"
      :task="selectedTask"
      @edit="enterEdittingMode"
    ></task-detail>
    <editting-task-detail
      :visible="edittingDrawerVisible"
      @edit="enterEdittingMode"
    ></editting-task-detail>
    <a-card :bordered="false" :body-style="{ padding: 0 }" :loading="boardLoading">
      <a-row :gutter="[8, 8]">
        <a-col
          :span="6"
          v-for="(taskListWithPriority, taskListIndex) in tasks"
          :key="taskListIndex"
        >
          <task-list
            :tasks="taskListWithPriority.tasks"
            :priority="taskListWithPriority.priority"
            :priority-name="taskListWithPriority.priorityName"
            :set-task="setSelectedTask"
            @end="onDragEnd"
            @showTaskDetail="showTaskDetail"
            @edit-new-task-name="closeIndifferentTextarea"
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
import EdittingTaskDetail from './EdittingTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskList,
    TaskDetail,
    EdittingTaskDetail,
  },
  mixins: [teamMixin, projectMixin],

  data() {
    return {
      detailDrawerVisible: false,
      edittingDrawerVisible: false,
      drag: false,
      taskListGroup: {
        name: 'taskList',
      },
      form: this.$form.createForm(this),
      boardLoading: false,
      selectedTask: null,
      tasks: [
        {
          priority: 0,
          priorityName: '较低',
          tasks: [],
        },
        {
          priority: 1,
          priorityName: '普通',
          tasks: [],
        },
        {
          priority: 2,
          priorityName: '较高',
          tasks: [],
        },
        {
          priority: 3,
          priorityName: '极高',
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
    closeIndifferentTextarea(priority) {
      // todo : 新建时关闭其他列表，需要兄弟间传值
    },
    showTaskDetail(task) {
      this.setSelectedTask(task)
      if (this.selectedTask) {
        this.detailDrawerVisible = true
      }
    },

    setSelectedTask(task) {
      this.selectedTask = task
    },
    enterEdittingMode(isEdittingMode) {
      console.log(isEdittingMode)
      this.detailDrawerVisible = false
      if (isEdittingMode) {
        this.edittingDrawerVisible = true
      } else {
        this.edittingDrawerVisible = false
      }
    },
    onDragEnd($event) {
      const toPriority = $event.to.dataset.priority
      const fromPriority = $event.from.dataset.priority
      // todo: 发送请求
      /*
      if (toPriority !== fromPriority && this.selectedTask) {
        let isFinished = (toPriority === this.selectedTask.isFinished = isFinished)
        this.selectedTask.priority = toPriority
        // todo:
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
      */
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
          this.tasks.find((taskList) => taskList.priority === task.priority).tasks.push(task)
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

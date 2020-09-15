<template>
  <div>
    <task-detail
      :visible="detailDrawerVisible"
      :task="selectedTask"
      @edit="enterEdittingMode"
      @close="setDetailDrawerVisible(false)"
      @taskUpdate="updateTask"
      @taskDelete="deleteTask"
    ></task-detail>
    <editting-task-detail
      :visible="edittingDrawerVisible"
      :task="selectedTask"
      @edit="enterEdittingMode"
      @close="setEditingDrawerVisible(false)"
      @taskUpdate="updateTask"
      @taskCreate="reloadTasks"
    ></editting-task-detail>
    <span
      style="
         {
          display: block;
          text-align: right;
          padding: 8px 16px;
          border-bottom: 1px solid #e3e3e3;
        }
      "
    >
      <a-checkbox @change="onOnlyNotFinishedChange">仅显示未完成</a-checkbox>
      <a-checkbox @change="onOnlyViewMineChange">只看我负责的</a-checkbox>
    </span>
    <a-card :bordered="false" :body-style="{ padding: 0 }" :loading="boardLoading">
      <a-row :gutter="[8, 8]">
        <a-col
          :span="6"
          v-for="(taskListWithPriority, taskListIndex) in tasks"
          :key="taskListIndex"
        >
          <task-column
            :tasks="taskListWithPriority.tasks"
            :priority="taskListWithPriority.priority"
            :priority-name="taskListWithPriority.priorityName"
            :set-task="setSelectedTask"
            :only-view-mine="onlyViewMine"
            :only-not-finished="onlyNotFinished"
            :try-create-task="tryCreateTask"
            @end="onDragEnd"
            @showTaskDetail="showTaskDetail"
            ghost-class="task-column"
          ></task-column>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import TaskColumn from './TaskColumn'
import TaskDetail from './TaskDetail'
import EdittingTaskDetail from './EdittingTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskColumn,
    TaskDetail,
    EdittingTaskDetail,
  },
  mixins: [teamMixin, projectMixin],

  data() {
    return {
      onlyNotFinished: false,
      onlyViewMine: false,
      detailDrawerVisible: false,
      edittingDrawerVisible: false,
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
      selectedTask: {},
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
    ...mapGetters(['username', 'projectId', 'projectTasks']),
  },
  methods: {
    ...mapActions(['queryProjectTasks', 'updateTask']),
    // 筛选器
    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },
    //
    closeIndifferentTextarea(priority) {
      // todo : 新建时关闭其他列表，需要兄弟间传值
    },
    // 抽屉相关
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
      if (isEdittingMode) {
        this.setDetailDrawerVisible(false)
        this.setEditingDrawerVisible(true)
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
    setDetailDrawerVisible(value) {
      this.detailDrawerVisible = value
    },
    setEditingDrawerVisible(value) {
      this.edittingDrawerVisible = value
    },
    updateTask($event) {
      if ('priority' in $event) {
        const oldPriority = this.selectedTask.priority

        const index = this.tasks[oldPriority].tasks.findIndex(
          (task) => task.taskId === this.selectedTask.taskId
        )

        if (index !== -1) {
          this.tasks[oldPriority].tasks.splice(index, 1)
          this.tasks[$event.priority].tasks.unshift(this.selectedTask)
        }
      }

      Object.keys($event).forEach((key) => {
        if (key in this.selectedTask) this.selectedTask[key] = $event[key]
      })
    },
    deleteTask() {
      const oldPriority = this.selectedTask.priority

      const index = this.tasks[oldPriority].tasks.findIndex(
        (task) => task.taskId === this.selectedTask.taskId
      )

      if (index !== -1) {
        this.tasks[oldPriority].tasks.splice(index, 1)
      }
    },
    reloadTasks() {
      console.log('fuck')
      this.tasks.forEach((taskList) => {
        taskList.tasks = []
      })

      console.log(this.projectTasks)

      this.projectTasks.forEach((task) => {
        console.log(task)
        this.tasks.find((taskList) => taskList.priority === task.priority).tasks.push(task)
      })
    },
    tryCreateTask() {
      this.resetSelectedTask()
      this.setEditingDrawerVisible(true)
    },
    resetSelectedTask() {
      this.selectedTask = {
        taskName: '',
        founder: '',
        createTime: Date.now(),
        deadline: new Date().toISOString().slice(0, 10),
        subTasks: [],
        isFinished: false,
        description: '',
      }
    },
  },
  mounted() {
    this.resetSelectedTask()

    const { query } = this.$route

    if (
      !this.projectTasks ||
      !this.projectTasks.length ||
      (query && query.projectId && query.projectId !== this.projectId)
    ) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!')
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
    } else {
      console.log(this.projectTasks)

      this.projectTasks.forEach((task) => {
        this.tasks.find((taskList) => taskList.priority === task.priority).tasks.push(task)
      })
    }

    console.log('taskBoard: ', this.tasks)

    this.$emit('load', 'taskBoard')
  },
}
</script>

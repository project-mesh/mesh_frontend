<template>
  <div>
    <task-detail
      :visible="detailDrawerVisible"
      :task="selectedTask"
      @edit="enterEdittingMode"
      @close="setDetailDrawerVisible(false)"
      @taskUpdate="tryUpdateTask"
      @taskDelete="tryDeleteTask"
    ></task-detail>
    <editing-task-detail
      :visible="edittingDrawerVisible"
      :task="selectedTask"
      :loading="loading"
      @edit="enterEdittingMode"
      @close="setEditingDrawerVisible(false)"
      @taskUpdate="tryUpdateTask"
      @taskCreate="tryCreateTask"
    ></editing-task-detail>
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
            :try-create-task="openCreateDrawer"
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
import EditingTaskDetail from './EditingTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import taskDrawerMixin from '@/utils/mixins/taskDrawerMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskColumn,
    TaskDetail,
    EditingTaskDetail,
  },
  mixins: [teamMixin, projectMixin, taskDrawerMixin],

  data() {
    return {
      onlyNotFinished: false,
      onlyViewMine: false,
      // detailDrawerVisible: false,
      // edittingDrawerVisible: false,
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
      // selectedTask: {},
      loading: false,
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
    ...mapGetters(['username', 'projectId', 'projectTasks', 'projectAdminName']),
  },
  methods: {
    ...mapActions(['queryProjectTasks', 'updateTask', 'createTask']),
    // 筛选器
    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },
    // 抽屉相关
    // showTaskDetail(task) {
    //   this.setSelectedTask(task)
    //   if (this.selectedTask) {
    //     this.detailDrawerVisible = true
    //   }
    // },

    // setSelectedTask(task) {
    //   this.selectedTask = task
    // },
    // enterEdittingMode(isEdittingMode) {
    //   if (isEdittingMode) {
    //     this.setDetailDrawerVisible(false)
    //     this.setEditingDrawerVisible(true)
    //   }
    // },
    onDragEnd($event) {
      const toPriority = +$event.to.dataset.priority
      const fromPriority = +$event.from.dataset.priority
      console.log('dargEnd ', fromPriority, toPriority)

      if (toPriority !== fromPriority && this.selectedTask) {
        // todo:
        const requestData = {
          username: this.username,
          projectId: this.projectId,
          taskId: this.selectedTask.taskId,
          priority: toPriority,
        }

        console.log(this.updateTask)

        this.updateTask(requestData)
          .then(() => {
            console.log('updateTaskPriority success')
            this.updateTaskLocal({ priority: toPriority })
          })
          .catch((err) => {
            this.$notification.error({
              message: '更新任务信息失败',
              description: err.message,
            })
          })
      }
    },
    // setDetailDrawerVisible(value) {
    //   this.detailDrawerVisible = value
    // },
    // setEditingDrawerVisible(value) {
    //   this.edittingDrawerVisible = value
    // },
    // closeDrawer() {
    //   this.setDetailDrawerVisible(false)
    //   this.setEditingDrawerVisible(false)
    // },
    tryUpdateTask($event) {
      this.loading = true

      console.log('$event', $event)

      this.updateTask($event)
        .then((res) => {
          console.log('更新任务信息成功')
          this.updateTaskLocal($event)
        })
        .catch((err) => {
          this.$notification.error({
            message: '更新任务信息成功失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    updateTaskLocal(taskInfo) {
      console.log('taskInfo: ', taskInfo)

      if ('priority' in taskInfo) {
        const oldPriority = this.selectedTask.priority

        const index = this.tasks[oldPriority].tasks.findIndex(
          (task) => task.taskId === this.selectedTask.taskId
        )

        if (index !== -1) {
          this.tasks[oldPriority].tasks.splice(index, 1)
          this.tasks[taskInfo.priority].tasks.unshift(this.selectedTask)
        }
      }

      Object.keys(taskInfo).forEach((key) => {
        if (key in this.selectedTask) this.selectedTask[key] = taskInfo[key]
      })
    },
    tryDeleteTask($event) {
      this.deleteTask($event)
        .then(() => {
          console.log('删除任务成功')
          this.deleteTaskLocal()
        })
        .catch((err) => {
          this.$notification.error({
            message: '删除任务失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
        })
    },
    deleteTaskLocal() {
      const oldPriority = this.selectedTask.priority

      const index = this.tasks[oldPriority].tasks.findIndex(
        (task) => task.taskId === this.selectedTask.taskId
      )

      if (index !== -1) {
        this.tasks[oldPriority].tasks.splice(index, 1)
      }
    },
    reloadTasks() {
      this.tasks.forEach((taskList) => {
        taskList.tasks = []
      })

      console.log(this.projectTasks)

      this.projectTasks.forEach((task) => {
        console.log(task)
        this.tasks.find((taskList) => taskList.priority === task.priority).tasks.push(task)
      })
    },
    tryCreateTask($event) {
      this.loading = true

      this.createTask($event)
        .then((res) => {
          console.log('创建任务成功')
          this.createTaskLocal(res.data.task)
        })
        .catch((err) => {
          console.log(err)
          this.$notification.error({
            message: err.message,
            // description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    createTaskLocal(newTask) {
      this.tasks[newTask.priority].tasks.unshift(newTask)
    },
    // openCreateDrawer() {
    //   this.resetSelectedTask()
    //   this.setEditingDrawerVisible(true)
    // },
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

    console.log('In taskBoard mounted, this.projectTasks: ', this.projectTasks)

    if (
      !this.projectTasks ||
      !this.projectTasks.length ||
      (query && query.projectId && query.projectId !== this.projectId)
    ) {
      this.boardLoading = true

      this.queryProjectTasks({
        username: this.username,
        projectId: this.$route.query.projectId,
      })
        .then((res) => {
          this.reloadTasks()
        })
        .catch((err) => {
          this.$notification.error({
            message: '查询项目任务失败',
            description: err.message,
          })
        })
        .finally(() => (this.boardLoading = false))
    } else {
      this.reloadTasks()
    }

    console.log('taskBoard: ', this.tasks)

    this.$emit('load', 'taskBoard')
  },
  created() {
    this.reloadTasks()
  },
}
</script>

<template>
  <div>
    <task-detail
      :visible="detailDrawerVisible"
      :task="selectedTask"
      @edit="enterEditingMode"
      @close="setDetailDrawerVisible(false)"
      @task-update="tryUpdateTask"
      @task-delete="tryDeleteTask"
      @sub-task-create="tryCreateSubTask"
      @open-sub-drawer="openSubDrawer"
      @sub-task-delete="tryDeleteSubTask"
      @sub-task-finish="tryUpdateSubTask"
    ></task-detail>
    <editing-task-detail
      :visible="editingDrawerVisible"
      :task="selectedTask"
      :loading="loading"
      @edit="enterEditingMode(true)"
      @close="setEditingDrawerVisible(false)"
      @task-update="tryUpdateTask"
      @task-create="tryCreateTask"
    ></editing-task-detail>
    <editing-sub-task-detail
      :visible="subEditingDrawerVisiable"
      :task="selectedSubTask"
      :parent-task="selectedTask"
      :loading="loading"
      @edit="enterSubEditingMode(true)"
      @close="setSubEditingDrawerVisible(false)"
      @sub-task-update="tryUpdateSubTask"
    ></editing-sub-task-detail>
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
            :tasks.sync="taskListWithPriority.tasks"
            :priority="taskListWithPriority.priority"
            :only-view-mine="onlyViewMine"
            :only-not-finished="onlyNotFinished"
            :try-create-task="openCreateDrawer"
            :set-task="setSelectedTask"
            :id="taskListWithPriority.priority"
            @end="onDragEnd"
            @show-task-detail="showTaskDetail"
            @task-update="tryUpdateTask"
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
import EditingSubTaskDetail from './EditingSubTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import taskDrawerMixin from '@/utils/mixins/taskDrawerMixin'
import { mapGetters, mapActions } from 'vuex'
import { priorityMarks } from './common/priority'

export default {
  components: {
    //调用组件
    TaskColumn,
    TaskDetail,
    EditingTaskDetail,
    EditingSubTaskDetail,
  },
  mixins: [teamMixin, projectMixin, taskDrawerMixin],

  data() {
    return {
      priorityMarks,
      onlyNotFinished: false,
      onlyViewMine: false,
      detailDrawerVisible: false,
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
    ...mapActions([
      'updateSubTask',
      'deleteSubTask',
      'queryProjectTasks',
      'updateTask',
      'createTask',
      'deleteTask',
      'createSubTask',
    ]),
    // 筛选器
    setTaskStatus(taskToBeUpdate) {
      if (taskToBeUpdate.isFinished) taskToBeUpdate.status = '已完成'
      else if (new Date(taskToBeUpdate.deadline + ' 24:00:00').getTime() < Date.now())
        taskToBeUpdate.status = '已逾期'
      else taskToBeUpdate.status = '开发中'
    },
    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },
    onDragEnd($event) {
      const toPriority = +$event.to.dataset.priority
      const fromPriority = +$event.from.dataset.priority
      console.log('dragEnd ', fromPriority, toPriority)

      if (toPriority !== fromPriority && this.selectedTask) {
        this.$message.info(
          this.selectedTask.taskName +
            ' 的优先级由 ' +
            priorityMarks[fromPriority].label +
            ' 变更为 ' +
            priorityMarks[toPriority].label
        )

        // todo:
        const requestData = {
          username: this.username,
          projectId: this.projectId,
          taskId: this.selectedTask.taskId,
          priority: toPriority,
          principal: this.selectedTask.principal,
          deadline: this.selectedTask.deadline,
        }

        console.log(this.updateTask)

        this.updateTask(requestData)
          .then(() => {
            console.log('updateTaskPriority success')
            this.updateTaskLocal({ task: this.selectedTask, requestData: { priority: toPriority } })
          })
          .catch((err) => {
            this.$notification.error({
              message: '更新任务信息失败',
              description: err.message,
            })
          })
      }
    },
    tryUpdateSubTask($event) {
      this.loading = true

      console.log('$event: ', $event)

      this.updateSubTask($event.requestData)
        .then((res) => {
          console.log('更新任务信息成功')
          this.updateSubTaskLocal($event)
        })
        .catch((err) => {
          this.$notification.error({
            message: '更新子任务信息成功失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    tryUpdateTask($event) {
      this.loading = true

      console.log('$event: ', $event)

      this.updateTask($event.requestData)
        .then((res) => {
          console.log('更新任务信息成功')
          this.updateTaskLocal($event)
        })
        .catch((err) => {
          this.$notification.error({
            message: '更新任务信息失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    updateSubTaskLocal({ subTask: subTaskToBeUpdate, requestData: subTaskInfo }) {
      Object.keys(subTaskInfo).forEach((key) => {
        if (key in subTaskToBeUpdate) subTaskToBeUpdate[key] = subTaskInfo[key]
      })

      this.setTaskStatus(subTaskToBeUpdate)
    },
    updateTaskLocal({ task: taskToBeUpdate, requestData: taskInfo }) {
      if (taskToBeUpdate.subTasks && 'priority' in taskInfo) {
        console.log('fuckkkkkkkkkkkkkkkkkkkkk')
        const oldPriority = taskToBeUpdate.priority

        const index = this.tasks[oldPriority].tasks.findIndex(
          (task) => task.taskId === taskToBeUpdate.taskId
        )

        if (index !== -1) {
          this.tasks[oldPriority].tasks.splice(index, 1)
          this.tasks[taskInfo.priority].tasks.unshift(taskToBeUpdate)
        }
      }

      if ('deadline' in taskInfo && taskToBeUpdate.subTasks) {
        taskToBeUpdate.subTasks.forEach((subTask) => {
          subTask.deadline = taskInfo.deadline
          this.setTaskStatus(subTask)
        })
      }

      Object.keys(taskInfo).forEach((key) => {
        if (key in taskToBeUpdate) taskToBeUpdate[key] = taskInfo[key]
      })

      this.setTaskStatus(taskToBeUpdate)
    },
    tryDeleteSubTask($event) {
      this.deleteSubTask($event.requestData)
        .then(() => {
          console.log('删除子任务成功')
          this.deleteSubTaskLocal($event.subTask)
        })
        .catch((err) => {
          this.$notification.error({
            message: '删除子任务失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
        })
    },
    tryDeleteTask($event) {
      this.deleteTask($event.requestData)
        .then(() => {
          console.log('删除任务成功')
          this.deleteTaskLocal($event.task)
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
    deleteSubTaskLocal(subTask) {
      if (this.selectedTask.subTasks) {
        const stIndex = this.selectedTask.subTasks.findIndex((st) => st.taskId === subTask.taskId)

        if (stIndex !== -1 && this.selectedTask.subTasks)
          this.selectedTask.subTasks.splice(stIndex, 1)
      }
    },
    deleteTaskLocal(taskToBeDelete) {
      const oldPriority = taskToBeDelete.priority

      const index = this.tasks[oldPriority].tasks.findIndex(
        (task) => task.taskId === taskToBeDelete.taskId
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
    tryCreateSubTask($event) {
      console.log('LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL')

      this.createSubTask($event.requestData)
        .then((res) => {
          console.log('创建子任务成功, res', res)
        })
        .catch((err) => {
          this.$notification.error({
            message: '创建子任务失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    tryCreateTask($event) {
      this.loading = true

      this.createTask($event.requestData)
        .then((res) => {
          console.log('创建任务成功')
          this.createTaskLocal({ task: res.data.task })
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
    createTaskLocal({ task: newTask }) {
      this.tasks[newTask.priority].tasks.unshift(newTask)
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
    addclassStatus(priority) {
      let color = ''
      if (priority == 3) {
        color = '#f5222d'
      }
      if (priority == 2) {
        color = '#faad14'
      }
      if (priority == 1) {
        color = '#52c41a'
      }
      if (priority == 0) {
        color = '#1890ff'
      }
      console.log(color)
      return color
    },
    openSubDrawer($event) {
      this.selectedSubTask = $event
      this.enterSubEditingMode(true)
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
  // created() {
  //   console.log('taskBoard created')

  //   this.reloadTasks()

  //   eventBus.$on('task-update', this.tryUpdateTask)

  //   eventBus.$on('sub-task-delete', this.tryDeleteSubTask)

  //   eventBus.$on('sub-task-finish', this.tryUpdateSubTask)

  //   eventBus.$on('sub-task-create', ($event) => {
  //     this.tryCreateSubTask($event)
  //   })

  //   eventBus.$on('open-sub-drawer', ($event) => {
  //     this.selectedSubTask = $event
  //     this.enterSubEditingMode(true)
  //   })
  // },
  // beforeDestroy() {
  //   console.log('TaskBoard beforeDestroy')

  //   eventBus.$off('task-update')

  //   eventBus.$off('sub-task-delete')

  //   eventBus.$off('sub-task-finish')

  //   eventBus.$off('sub-task-create')

  //   eventBus.$off('open-sub-drawer')
  // },
}
</script>
<style lang="less">
#0 {
  color: red;
}
</style>

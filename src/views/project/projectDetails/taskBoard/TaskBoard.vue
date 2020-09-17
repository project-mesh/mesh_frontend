<template>
  <div>
    <!--
    create-task: formData
    delete-task: task  
    update-task: task, formData
    create-sub-task:  task, formData
    delete-sub-task:  task, subTask
    update-sub-task:  task, subTask, formData

        -->
    <creating-task-detail
      :visible="drawerMode === 'create'"
      :editable="editable.create"
      :priority="newPriority"
      @create-task="createTaskData"
      @change-drawer="changeDrawer"
    ></creating-task-detail>
    <task-detail
      :visible="drawerMode === 'display'"
      :editable="editable.display"
      :task="selectedTask"
      @create-task="createTaskData"
      @update-task="updateTaskData"
      @delete-task="deleteTaskData"
      @update-sub-task="updateSubTaskData"
      @delete-sub-task="deleteSubTaskData"
      @create-sub-task="createSubTaskData"
      @change-drawer="changeDrawer"
      @taskUpdate="tryUpdateTask"
      @taskDelete="tryDeleteTask"
    ></task-detail>
    <editing-task-detail
      :visible="drawerMode === 'edit'"
      @edit="enterEditingMode"
      @change-drawer="changeDrawer"
      :task="selectedTask"
      :loading="loading"
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
            :tasks.sync="taskListWithPriority.tasks"
            :priority="taskListWithPriority.priority"
            :only-view-mine="onlyViewMine"
            :only-not-finished="onlyNotFinished"
            :try-create-task="openCreatingDrawer"
            @add-task="openCreatingDrawer"
            @end="onDragEnd"
            @select-task="showTaskDetail"
            @update-task="updateTaskData"
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
import CreatingTaskDetail from './CreatingTaskDetail'
export default {
  components: {
    //调用组件
    TaskColumn,
    TaskDetail,
    EditingTaskDetail,
    CreatingTaskDetail,
  },
  mixins: [teamMixin, projectMixin, taskDrawerMixin],

  data() {
    return {
      drawerMode: '', // 'detail'/'editing'/ ''
      isEditingMode: false,
      onlyNotFinished: false,
      onlyViewMine: false,
      detailDrawerVisible: false,
      drag: false,
      taskListGroup: {
        name: 'taskList',
      },
      newPriority: 1,
      editable: {
        none: {},
        display: {
          taskName: false,
          principal: false,
          deadline: false,
          priority: false,
          isFinished: false,
          description: true,
        },
        create: {
          taskName: true,
          principal: true,
          deadline: true,
          priority: true,
          isFinished: false,
          description: true,
        },
      },

      selectedTask: null,

      bodyStyle: {
        padding: 0,
        minHeight: '1000px',
      },

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

    changeDrawer(drawerMode) {
      this.drawerMode = drawerMode
    },
    showTaskDetail(task) {
      this.setSelectedTask(task)
      this.drawerMode = 'display'
    },
    openCreatingDrawer(priority) {
      this.newPriority = priority
      this.drawerMode = 'create'
    },
    setSelectedTask(task) {
      this.selectedTask = task
    },
    // enterEditingMode(isEditingMode) {
    //   if (isEditingMode) {
    //     this.setDetailDrawerVisible(false)
    //     this.setEditingDrawerVisible(true)
    //   }
    // },
    onDragEnd($event) {
      const toPriority = +$event.to.dataset.priority
      const fromPriority = +$event.from.dataset.priority
      console.log('dragEnd ', fromPriority, toPriority)

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
    //   this.editingDrawerVisible = value
    // },
    // closeDrawer() {
    //   this.setDetailDrawerVisible(false)
    //   this.setEditingDrawerVisible(false)
    // },

    // CUD task
    createTaskData(formData) {
      this.tasks[formData.priority].push(formData)
      // todo 交互
    },
    updateTaskData(task, formData) {
      for (let key in formData) {
        task[key] = formData[key]
        this.$message.info(key + ' is set to ' + formData[key])
      }
      // todo 交互
    },
    deleteTaskData(task) {
      const taskArr = this.tasks[task.priority].tasks
      const toDeleteIndex = taskArr.indexOf(taskArr.find((t) => t.taskId == task.taskId))
      taskArr.splice(toDeleteIndex, 1)
    },

    // CUD sub task
    createSubTaskData(task, formData) {
      // todo todo todo
      // todo 交互
      task.subTasks.push(formData)
    },
    updateSubTaskData(task, subTask, formData) {
      for (var key in formData) {
        subTask[key] = formData[key]
      }
      // todo 交互
    },
    deleteSubTaskData(task, subTask) {
      const subTaskArr = task.subTasks
      const toDeleteIndex = subTaskArr.indexOf(
        subTaskArr.find((t) => t.taskName == subTask.taskName)
      )
      subTaskArr.splice(toDeleteIndex, 1)
      // todo 交互
    },

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

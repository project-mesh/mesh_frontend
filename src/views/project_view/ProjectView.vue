<template>
  <div>
    <task-detail
      :task="selectedTask"
      :visible="drawerMode === 'detail'"
      @update-task="updateTaskData"
      @delete-task="deleteTaskData"
      @update-sub-task="updateSubTaskData"
      @delete-sub-task="deleteSubTaskData"
      @create-sub-task="createSubTaskData"
      @change-drawer="changeDrawer"
    ></task-detail>
    <editing-task-detail
      :visible="drawerMode === 'editing'"
      @edit="enterEditingMode"
      @change-drawer="changeDrawer"
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
          <task-list
            :tasks.sync="taskListWithPriority.tasks"
            :priority="taskListWithPriority.priority"
            :priority-name="taskListWithPriority.priorityName"
            :set-task="setSelectedTask"
            :only-view-mine="onlyViewMine"
            :only-not-finished="onlyNotFinished"
            @update-task="updateTaskData"
            @select-task="showTaskDetail"
            @change-task-priority="changeTaskPriority"
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
import EditingTaskDetail from './EditingTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    //调用组件
    TaskList,
    TaskDetail,
    EditingTaskDetail,
  },
  mixins: [teamMixin, projectMixin],

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
      form: this.$form.createForm(this),
      boardLoading: false,
      selectedTask: null,
      tasks: [
        {
          priority: 0,
          tasks: [],
        },
        {
          priority: 1,
          tasks: [],
        },
        {
          priority: 2,
          tasks: [],
        },
        {
          priority: 3,
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
    // CRUD task
    updateTaskData(task, key, value) {
      task[key] = value
      // todo 交互
    },
    deleteTaskData(task) {
      const taskArr = this.tasks[task.priority].tasks
      const toDeleteIndex = taskArr.indexOf(taskArr.find((t) => t.taskId == task.taskId))
      taskArr.splice(toDeleteIndex, 1)
      // todo 交互
    },

    // CRUD sub task
    createSubTaskData(task, formData) {
      // todo todo todo
      // todo 交互
      task.subTasks.push(formData)
    },
    updateSubTaskData(task, subTask, key, value) {
      subTask[key] = value
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

    // 筛选器
    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },
    // 拖动相关
    changeTaskPriority(task, oldPriority, newPriority) {
      const taskId = task.taskId
      task.priority = newPriority
      this.tasks[newPriority].push(task)
      delete this.tasks[oldPriority].find((task) => task.taskId == taskId)
      console.log(this.tasks)
    },
    // 抽屉相关
    showTaskDetail(task) {
      this.setSelectedTask(task)
      if (this.selectedTask) {
        console.log(task)
        this.drawerMode = 'detail'
      }
    },
    setSelectedTask(task) {
      this.selectedTask = task
    },

    changeDrawer(mode) {
      this.drawerMode = mode
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

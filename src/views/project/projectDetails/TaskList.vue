<template>
  <div class="board">
    <task-detail
      :visible="detailDrawerVisible"
      :task="selectedTask"
      @edit="enterEditingMode"
      @close="setDetailDrawerVisible(false)"
      @task-update="tryUpdateTask"
      @task-celete="tryDeleteTask"
      @task-delete="tryDeleteTask"
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
        }
      "
    >
      <a-checkbox @change="onOnlyViewMineChange">只看我负责的</a-checkbox>
    </span>
    <div class="task-group" v-for="status in allStatus" :key="status">
      <div class="topbutton">
        <a-button
          :disabled="username !== projectAdminName"
          type="primary"
          @click="openCreateDrawer"
        >
          <a-icon type="plus" />
          {{ status }}
        </a-button>
      </div>
      <div class="info-list">
        <a-list item-layout="horizontal" :data-source="getStatusTasks(status)">
          <a-list-item slot="renderItem" slot-scope="task">
            <a slot="actions" @click="showTaskDetail(task)">更多</a>
            <div style="width: 35%" class="task-description">
              <a-list-item-meta :description="task.description" class="description">
                <a slot="title" style="font-size: 17px">{{ task.taskName }}</a>
              </a-list-item-meta>
            </div>
            <div style="width: 40%">
              <a-descriptions layout="vertical" :column="7" size="small">
                <a-descriptions-item :span="2" label="负责人">
                  <div>
                    <a-avatar slot="avatar" :src="getAvatar(task.principal)" />
                    {{ task.principal }}
                  </div>
                </a-descriptions-item>
                <a-descriptions-item :span="2" label="截止日期">
                  {{ task.deadline }}
                </a-descriptions-item>
                <a-descriptions-item :span="2" label="创建时间">
                  {{ moment(+task.createTime).format('YYYY-MM-DD hh:mm') }}
                </a-descriptions-item>
                <a-descriptions-item :span="1" label="优先级">
                  <div
                    :class="{
                      red: task.priority === 3,
                      yellow: task.priority === 2,
                      green: task.priority === 1,
                      blue: task.priority === 0,
                    }"
                  >
                    {{ getTextTaskPriority(task.priority) }}
                  </div>
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import TaskDetail from './taskBoard/TaskDetail'
import EditingTaskDetail from './taskBoard/EditingTaskDetail'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import EditingSubTaskDetail from './taskBoard/EditingSubTaskDetail'
import taskDrawerMixin from '@/utils/mixins/taskDrawerMixin'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import { priorityMarks } from './taskBoard/common/priority'
import eventBus from './eventBus'

export default {
  components: {
    TaskDetail,
    EditingTaskDetail,
    EditingSubTaskDetail,
  },
  mixins: [teamMixin, projectMixin, taskDrawerMixin],
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      allStatus: ['开发中', '已完成', '已逾期'],
      moment,
      selectedTask: {},
      loading: false,
      priorityMarks,
      onlyViewMine: false,
    }
  },
  computed: {
    ...mapGetters([
      'projectTasks',
      'username',
      'teamId',
      'projectId',
      'projectAdminName',
      'projectMembers',
    ]),
  },
  methods: {
    ...mapActions([
      'updateTask',
      'createTask',
      'deleteTask',
      'createSubTask',
      'updateSubTask',
      'deleteSubTask',
    ]),
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    getStatusTasks(status) {
      let resTasks = this.projectTasks.filter((task) => task.status === status)

      if (this.onlyViewMine)
        resTasks = this.projectTasks.filter((task) => task.principal === this.username)

      return resTasks
    },
    getTextTaskPriority(priorityNumber) {
      switch (priorityNumber) {
        case 0:
          return '极低'
        case 1:
          return '普通'
        case 2:
          return '较高'
        case 3:
          return '极高'
        default:
          return '未知优先级'
      }
    },
    getAvatar(username) {
      const user = this.projectMembers.find((member) => member.username === username)
      return user ? user.avatar : ''
    },
    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },
    tryUpdateTask($event) {
      this.loading = true

      this.updateTask($event.requestData)
        .then((res) => {
          console.log('更新任务信息成功')
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
    tryUpdateSubTask($event) {
      this.loading = true

      console.log('$event: ', $event)

      this.updateSubTask($event.requestData)
        .then((res) => {
          console.log('更新任务信息成功')
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
    tryCreateSubTask($event) {
      this.createSubTask($event.requestData)
        .then((res) => {
          console.log(('创建子任务成功, res', res))
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
        })
        .catch((err) => {
          this.$notification.error({
            message: err.message,
            description: err.message,
          })
        })
        .finally(() => {
          this.closeDrawer()
          this.loading = false
        })
    },
    tryDeleteSubTask($event) {
      this.deleteSubTask($event.requestData)
        .then(() => {
          console.log('删除子任务成功')
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
  },
  mounted() {
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
          console.log('queryProjectTasks success')
        })
        .catch((err) => {
          this.$notification.error({
            message: '查询项目任务失败',
            description: err.message,
          })
        })
        .finally(() => (this.boardLoading = false))
    }

    this.$emit('load', 'taskList')
  },
  created() {
    // this.reloadTasks()

    eventBus.$on('task-update', this.tryUpdateTask)

    eventBus.$on('sub-task-delete', this.tryDeleteSubTask)

    eventBus.$on('sub-task-finish', this.tryUpdateSubTask)

    eventBus.$on('sub-task-create', this.tryCreateSubTask)

    eventBus.$on('open-sub-drawer', ($event) => {
      this.selectedSubTask = $event
      this.enterSubEditingMode(true)
    })
  },
}
</script>

<style scoped>
.task-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-group {
  padding: 20px;
}

.task-group:not(:last-of-type) {
  margin-bottom: 40px;
}

.red {
  color: #f5222d;
}

.green {
  color: #52c41a;
}

.blue {
  color: #1890ff;
}

.yellow {
  color: #faad14;
}
</style>

<template>
  <a-drawer :title="task.taskName" width="540" :closable="true" :visible="visible" @close="close">
    <a-card>
      <a-descriptions class="drawer-content" :column="3">
        <a-descriptions-item label="创建者">
          {{ task.founder }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ task.createTime | dateFilter }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人" :span="1">{{ task.principal }}</a-descriptions-item>
        <a-descriptions-item label="截止日期" :span="2" :contenteditable="true">
          {{ task.deadline }}
        </a-descriptions-item>
        <a-descriptions-item label="优先级" :span="1">
          {{ task.priority | formatPriority }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="1">{{ task.status }}</a-descriptions-item>

        <a-descriptions-item label="已完成" :span="1">
          {{ task.isFinished ? '是' : '否' }}
        </a-descriptions-item>

        <a-descriptions-item label="描述" :span="3">{{ task.description }}</a-descriptions-item>
        <a-descriptions-item label="子任务" :span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list
        :parent-task="task"
        @update-sub-task="updateSubTask"
        @delete-sub-task="deleteSubTask"
        @create-sub-task="createSubTask"
      />
      <template slot="actions" class="ant-card-actions">
        <a-popconfirm title="是否要删除此行？" @confirm="handleDelete">
          <a :disabled="username !== projectAdminName">
            <a-icon key="delete" type="delete" />
          </a>
        </a-popconfirm>
        <a :disabled="username !== projectAdminName">
          <a-icon key="edit" type="edit" @click="editTask(task)" />
        </a>
        <a :disbled="username !== projectAdminName && username !== task.principal">
          <a-icon
            v-if="task.isFinished"
            key="check-square"
            type="check-square"
            @click="handleUpdate(false)"
          />
          <a-icon v-else key="check" type="check" @click="handleUpdate(true)" />
        </a>
      </template>
    </a-card>
  </a-drawer>
</template>
<script>
import SubTaskList from './SubTaskList'
import { priorityMarks } from './common/priority'
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
import moment from 'moment'
import eventBus from '../eventBus'

export default {
  components: {
    SubTaskList,
    AvatarFeaturedUser,
  },
  data() {
    return {
      activeKey: [],
      priorityMarks: priorityMarks,
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },

    task: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['projectMembers', 'username', 'teamId', 'projectId', 'projectAdminName']),
  },
  methods: {
    moment,
    changeDeadline: function (dates, deadline) {
      this.$emit('update-task', this.task, { deadline: deadline })
    },
    changePriority: function (priority) {
      this.$emit('update-task', this.task, { priority: priority })
    },
    changePrincipal: function (principal) {
      this.$emit('update-task', this.task, { principal: principal })
    },
    changeTaskFinishingStatus: function () {
      this.$emit('update-task', this.task, { isFinished: !this.task.isFinished })
    },
    deleteTask: function () {
      this.$emit('delete-task', this.task)
      this.close()
      this.$message.info('删除成功')
    },
    finishEditing: function () {
      if (this.newSubTaskName) {
        this.$message.info('新建项目：' + this.newSubTaskName)
        this.addTask()
      }
    },

    createSubTask: function (formData) {
      formData['taskId'] = this.task.taskId
      this.$emit('create-sub-task', this.task, formData)
    },

    updateSubTask: function (subTask, formData) {
      this.$emit('update-sub-task', this.task, subTask, formData)
    },

    deleteSubTask: function (subTask) {
      this.$emit('delete-sub-task', this.task, subTask)
    },

    exitEditing: function () {
      this.newTaskName = ''
    },
    addSubTask: function () {
      let formData = {
        username: '', // todo: 当前用户名
        taskName: this.newTaskName,
        description: '',
        principal: '', //todo: 当前用户名
      }
      // todo: 交互
      this.newSubTaskName = ''
    },

    close: function () {
      this.$emit('close')
    },

    editTask: function (task) {
      this.$message.warning('进入编辑模式')
      this.$emit('edit', true)
    },
    handleUpdate(status) {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
        isFinished: status,
      }
      this.$emit('task-update', {
        task: this.task,
        requestData,
      })
    },
    handleDelete: function () {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
      }
      this.$emit('task-delete', {
        task: this.task,
        requestData,
      })
    },
  },
  filters: {
    formatPriority: (priority) => {
      return (priority in priorityMarks && priorityMarks[priority].label) || ''
    },
    getUserInfo: function (username) {
      const user = this.projectMembers.find((member) => member.username === username)
      // return this.teamMembers.find((member) => member.username === username).avatar
      return user ? user : { username: username, avatar: '' }
    },
  },
  mounted() {
    eventBus.$on('sub-task-create', ($event) => {
      console.log('hello')
    })
  },
}
</script>

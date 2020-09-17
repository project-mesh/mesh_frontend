<template>
  <a-drawer width="540" :closable="true" :visible="visible" @close="close" :destroy-on-close="true">
    <div slot="title">
      <a-input v-if="editing.taskName" v-model="task.taskName" />
      <span v-else>{{ task.taskName }}</span>
    </div>

    <a-card>
      <a-descriptions class="drawer-content" :column="4">
        <a-descriptions-item label="创建者" span="2">
          <avatar-featured-user :username="task.founder" />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ task.createTime | dateFilter }}
        </a-descriptions-item>
        <a-descriptions-item label="负责人" span="2">
          <div>
            <a-select
              v-if="editing.principal"
              width="100%"
              placeholder="请选择项目负责人"
              v-model="task.principal"
              :default-value="task.principal"
              @change="changePrincipal"
            >
              <a-select-option
                v-for="member in projectMembers"
                :key="member.username"
                :value="member.username"
              >
                <avatar-featured-user :username="member.username" />
              </a-select-option>
            </a-select>
            <span v-else><avatar-featured-user :username="task.principal" /></span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="优先级" span="2">
          <a-select style="width: 120px" v-if="editable.priority" v-model="task.priority">
            <a-select-option
              v-for="(priorityMark, priorityIndex) in priorityMarks"
              :key="priorityIndex"
              :value="priorityIndex"
            >
              {{ priorityMark.label }}
            </a-select-option>
          </a-select>
          <span v-else>{{ priorityMarks[task.priority].label }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="1">{{ task.status }}</a-descriptions-item>

        <a-descriptions-item label="截止日期" span="4">
          <div>
            <a-date-picker
              v-if="editing.deadline"
              size="small"
              v-model="task.deadline"
              placeholder="请选择任务截止日期"
              :allow-clear="false"
              :default-date="moment().format()"
              :disabled-date="(date) => date < moment().startOf('day')"
            ></a-date-picker>
            <span v-else>{{ task.deadline }}</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="4">
          <a-textarea
            v-if="editing.description"
            :auto-size="{ minRows: 3 }"
            placeholder="请输入任务描述"
            v-model="task.description"
            style="width: 440px; margin-top: 10px"
          ></a-textarea>
          <div v-else>{{ task.description }}</div>
        </a-descriptions-item>

        <a-descriptions-item v-if="editing.subTasks" label="子任务" span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list
        v-if="editing.subTasks"
        :can-edit="canEdit"
        :task-id="task.taskId"
        :sub-tasks="task.subTasks"
        @update-sub-task="updateSubTask"
        @delete-sub-task="deleteSubTask"
        @create-sub-task="createSubTask"
        @task-principal="task.principal"
      />
      <template slot="actions" class="ant-card-actions" v-if="canEdit">
        <a-popconfirm
          title="确认删除该任务？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleDelete"
        >
          <a-icon key="delete" type="delete" />
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
      priorityMarks: priorityMarks,
      editing: this.editable,
    }
  },
  props: {
    editable: {
      type: Object,
      default: function () {
        return {
          taskName: false,
          priority: false,
          principal: false,
          deadline: false,
        }
      },
    },
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
    ...mapGetters(['username', 'projectId', 'projectMembers', 'projectAdminName', 'teamId']),
    canEdit: function () {
      return this.username == this.task.principal || this.username == this.projectAdminName
    },
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
    editTask: function (task) {
      this.$message.warning('进入编辑模式')
      this.$emit('change-drawer', 'edit')
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

<template>
  <a-drawer width="540" :closable="true" :visible="visible" @close="close">
    <div slot="title">
      <a-input v-if="editing.taskName" v-model="task.taskName" />
      <span v-else>{{ task.taskName }}</span>
    </div>

    <a-card>
      <a-descriptions class="drawer-content" :column="4">
        <a-descriptions-item label="创建者" span="2">
          <avatar-featured-user :username="task.founder" />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="2">
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

        <a-descriptions-item label="子任务" span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list
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
          @confirm="deleteTask"
        >
          <a-icon key="delete" type="delete" />
        </a-popconfirm>

        <a-icon key="edit" type="edit" @click="editTask(task)" />
        <a-icon
          key="check-square"
          :type="task.isFinished ? 'check-square' : 'border'"
          @click="changeTaskFinishingStatus"
        />
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
      default: function () {
        return {
          taskId: 'id',
          taskName: '任务名',
          isFinished: false,
          priority: 0,
          createTime: '0',
          deadline: '1970-01-01',
          description: '描述内容',
          founder: '创建者',
          principal: '负责人',
          subTasks: [
            {
              taskId: 'aklgnlkjsald',
              taskName: '子任务名',
              isFinished: false,
              createTime: '16546513231',
              description: '子任务描述',
              founder: '子任务创建者',
              principal: '子任务负责人',
            },
          ],
        }
      },
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId', 'projectMembers', 'projectAdminName']),
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
      this.$emit('change-drawer', '')
    },
  },
  filters: {
    formatPriority: (priority) => (priorityMarks[priority] ? priorityMarks[priority].label : '空'),
  },
}
</script>

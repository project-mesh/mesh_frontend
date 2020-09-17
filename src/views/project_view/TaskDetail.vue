<template>
  <a-drawer :title="task.taskName" width="540" :closable="true" :visible="visible" @close="close">
    <a-card>
      <a-descriptions class="drawer-content" :column="3">
        <a-descriptions-item label="创建者">{{ task.founder }}</a-descriptions-item>
        <a-descriptions-item label="创建时间" span="2">
          {{ task.createTime | dateFilter }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
        <a-descriptions-item label="截止日期" span="2" contenteditable="true">
          {{ task.deadline }}
        </a-descriptions-item>
        <a-descriptions-item label="优先级" span="3">
          {{ task.priority | formatPriority }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="3">
          {{ task.description }}
        </a-descriptions-item>
        <a-descriptions-item label="子任务" span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list
        :task-id="task.taskId"
        :sub-tasks="task.subTasks"
        @update-sub-task="updateSubTask"
        @delete-sub-task="deleteSubTask"
        @create-sub-task="createSubTask"
      />
      <template slot="actions" class="ant-card-actions">
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
export default {
  components: {
    SubTaskList,
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
  methods: {
    changeTaskFinishingStatus: function () {
      this.$emit('update-task', this.task, 'isFinished', !this.task.isFinished)
    },
    deleteTask: function () {
      this.$emit('delete-task', this.task)
      this.close()
      this.$message.info('删除成功')
    },
    editTask: function (task) {
      this.$message.warning('进入编辑模式')
      this.$emit('change-drawer', 'editing')
    },

    finishEditing: function () {
      if (this.newSubTaskName) {
        this.$message.info('新建项目：' + this.newSubTaskName)
        this.addTask()
      }
    },

    createSubTask: function (formData) {
      this.$message.info('新建' + formData)
      formData['taskId'] = this.task.taskId
      this.$emit('create-sub-task', this.task, formData)
    },

    updateSubTask: function (subTask, key, value) {
      this.$message.info('修改' + key)
      this.$emit('update-sub-task', this.task, subTask, key, value)
    },

    deleteSubTask: function (subTask) {
      this.$message.info('删除')
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

    finishSubTask: function (task) {},
    close: function () {
      this.$emit('change-drawer', '')
    },
  },
  filters: {
    formatPriority: (priority) => priorityMarks[priority].label,
  },
}
</script>

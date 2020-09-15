<template>
  <a-drawer :title="task.taskName" width="540" :closable="true" :visible="visible" @close="close">
    <a-card>
      <a-descriptions class="drawer-content" size="large" column="3">
        <a-descriptions-item label="创建者">
          {{ task.founder }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="2">
          {{ formatTimeStamp(task.createTime) }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
        <a-descriptions-item label="截止日期" span="2" contenteditable="true">
          {{ task.deadline }}
        </a-descriptions-item>
        <a-descriptions-item label="优先级" span="1">{{ task.priority }}</a-descriptions-item>
        <a-descriptions-item label="状态" span="1">{{ task.status }}</a-descriptions-item>

        <a-descriptions-item label="已完成" span="1">
          {{ task.isFinished ? '是' : '否' }}
        </a-descriptions-item>

        <a-descriptions-item label="描述" span="3">{{ task.description }}</a-descriptions-item>
        <a-descriptions-item label="子任务" span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list v-model="subTasks" />
      <template slot="actions" class="ant-card-actions">
        <a-icon key="delete" type="delete" @click="deleteTask(task)" />
        <a-icon key="edit" type="edit" @click="editTask(task)" />
        <a-icon
          key="check-square"
          :type="task.isFinished ? 'check-square' : 'border'"
          @click="finishTask(task, !task.isFinished)"
        />
      </template>
    </a-card>
  </a-drawer>
</template>
<script>
import moment from 'moment'
import SubTaskList from './SubTaskList'
export default {
  components: {
    SubTaskList,
    moment,
  },
  data() {
    return {
      activeKey: [],
      newSubTaskName: '',
      task: this.rawTask,
      subTasks: [
        {
          taskId: 'aklgnlkzzzld',
          taskName: '子任务名',
          isFinished: true,
          createTime: '16546513231',
          description: '子任务描述',
          founder: '子任务创建者',
          principal: '子任务负责人',
        },
        {
          taskId: 'aklgnlkjsald',
          taskName: '子任名2',
          isFinished: false,
          createTime: '1654653445',
          description: '子任务描述2',
          founder: '子任务创建者2',
          principal: '子任务负责人2',
        },
      ],
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },

    rawTask: {
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
    finishEditing: function () {
      if (this.newSubTaskName) {
        this.$message.info('新建项目：' + this.newSubTaskName)
        this.addTask()
      }
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

    formatTimeStamp: function (timeStamp) {
      return moment(timeStamp).format('YYYY-MM-DD')
    },
    finishSubTask: function (task) {},
    finishTask: function (task, status) {
      this.updateTask(task, 'isFinished', status)
    },
    updateTask: function (task, key, value) {
      task[key] = value
      //todo: 通信
    },
    editTask: function (task) {
      this.$message.warning('进入编辑模式')
      this.$emit('edit', true)
    },
    deleteTask: function (task) {
      this.$message.warning('确认删除？')
      //todo: 通信
    },
    close: function () {
      this.visible = false
    },
  },
}
</script>

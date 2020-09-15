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
      <a-collapse v-model="activeKey">
        <a-collapse-panel
          v-for="(subTask, subTaskIndex) in task.subTasks"
          :key="subTaskIndex"
          :header="subTask.taskName"
        >
          <a-descriptions class="drawer-content" size="small" column="3">
            <a-descriptions-item label="创建者" span="1">
              {{ task.founder }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间" span="2">
              {{ formatTimeStamp(subTask.createTime) }}
            </a-descriptions-item>

            <a-descriptions-item label="负责人" span="1">{{ task.principal }}</a-descriptions-item>

            <a-descriptions-item label="已完成" span="2">
              {{ task.isFinished ? '是' : '否' }}
            </a-descriptions-item>
            <a-descriptions-item label="描述" span="3">{{ task.description }}</a-descriptions-item>
          </a-descriptions>
        </a-collapse-panel>
        <a-collapse-panel disabled :show-arrow="false">
          <a-input
            v-model="newSubTaskName"
            slot="header"
            placeholder="按enter添加 按esc退出"
            @keyup.enter="finishEditting"
            @keyup.esc="exitEditting"
            @blur="exitEditting"
          ></a-input>
        </a-collapse-panel>
      </a-collapse>
      <template slot="actions" class="ant-card-actions">
        <a-icon key="delete" type="delete" @click="deleteTask(task)" />
        <a-icon key="edit" type="edit" @click="editTask(task)" />
        <a-icon
          v-if="task.isFinished"
          key="check-square"
          type="check-square"
          @click="finishTask(task, false)"
        />
        <a-icon v-else key="check" type="check" @click="finishTask(task, true)" />
      </template>
    </a-card>
  </a-drawer>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      activeKey: [],
      newSubTaskName: '',
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
    finishEditting: function () {
      if (this.newSubTaskName) {
        this.$message.info('新建项目：' + this.newSubTaskName)
        this.addTask()
      }
    },
    exitEditting: function () {
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
    moment,
    formatTimeStamp: function (timeStamp) {
      return moment(timeStamp).format('YYYY-MM-DD')
    },
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

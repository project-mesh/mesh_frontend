<template>
  <a-drawer :title="task.taskName" width="540" :closable="true" :visible="visible" @close="close">
    <a-card>
      <a-descriptions class="drawer-content" :column="3">
        <a-descriptions-item label="创建者">
          {{ task.founder }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ formatTimeStamp(task.createTime) }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人">{{ task.principal }}</a-descriptions-item>
        <a-descriptions-item label="截止日期" :span="2" :contenteditable="true">
          {{ task.deadline }}
        </a-descriptions-item>
        <a-descriptions-item label="优先级" :span="1">{{ task.priority }}</a-descriptions-item>
        <a-descriptions-item label="状态" :span="1">{{ task.status }}</a-descriptions-item>

        <a-descriptions-item label="已完成" :span="1">
          {{ task.isFinished ? '是' : '否' }}
        </a-descriptions-item>

        <a-descriptions-item label="描述" :span="3">{{ task.description }}</a-descriptions-item>
        <a-descriptions-item label="子任务" :span="3"></a-descriptions-item>
      </a-descriptions>
      <a-collapse v-model="activeKey">
        <a-collapse-panel
          v-for="(subTask, subTaskIndex) in task.subTasks"
          :key="subTaskIndex"
          :header="subTask.taskName"
        >
          <a-descriptions class="drawer-content" size="small" column="3">
            <a-descriptions-item label="创建者" :span="1">
              {{ task.founder }}
            </a-descriptions-item>
            <a-descriptions-item label="创建时间" :span="2">
              {{ formatTimeStamp(subTask.createTime) }}
            </a-descriptions-item>

            <a-descriptions-item label="负责人" :span="1">{{ task.principal }}</a-descriptions-item>

            <a-descriptions-item label="已完成" :span="2">
              {{ task.isFinished ? '是' : '否' }}
            </a-descriptions-item>
            <a-descriptions-item label="描述" :span="3">{{ task.description }}</a-descriptions-item>
          </a-descriptions>
        </a-collapse-panel>
        <a-collapse-panel disabled :show-arrow="false">
          <a-input
            v-model="newSubTaskName"
            slot="header"
            placeholder="按enter添加 按esc退出"
            @keyup.enter="finishEditing"
            @keyup.esc="exitEditing"
            @blur="exitEditing"
          ></a-input>
        </a-collapse-panel>
      </a-collapse>
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
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'

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
      required: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'teamId', 'projectId', 'projectAdminName']),
  },
  methods: {
    ...mapActions(['updateTask', 'deleteTask']),
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
    moment,
    formatTimeStamp: function (timeStamp) {
      return moment(timeStamp).format('YYYY-MM-DD')
    },
    handleUpdate(status) {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
        isFinished: status,
      }

      this.$emit('taskUpdate', requestData)
    },
    // updateTask: function (task, key, value) {
    //   task[key] = value
    //   //todo: 通信
    // },
    editTask: function (task) {
      this.$message.warning('进入编辑模式')
      this.$emit('edit', true)
    },
    handleDelete: function () {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
      }
      // this.deleteTask({
      //   username: this.username,
      //   projectId: this.projectId,
      //   taskId: this.task.taskId,
      // })
      //   .then(() => {
      //     console.log('删除任务成功')
      //     this.$emit('taskDelete')
      //   })
      //   .catch((err) => {
      //     this.$notification.error({
      //       message: '删除任务失败',
      //       description: err.message,
      //     })
      //   })
      //   .finally(() => {
      //     this.close()
      //   })

      this.$emit('taskDelete', requestData)
    },
    close: function () {
      // this.visible = false
      this.$emit('close')
    },
  },
}
</script>

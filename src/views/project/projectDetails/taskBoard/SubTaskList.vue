<template>
  <a-collapse accordion>
    <a-collapse-panel
      v-for="(subTask, subTaskIndex) in parentTask.subTasks"
      :key="subTaskIndex"
      :header="subTask.taskName"
    >
      <div slot="extra">
        <a-icon class="panel-icon" @click="handleRemove(subTask)" key="sub-delete" type="delete" />
        <a-icon type="edit" class="panel-icon" key="sub-edit" @click="handleEdit(subTask)"></a-icon>
        <a-icon
          class="panel-icon"
          @click="handleFinishSubTask(subTask)"
          key="sub-check-square"
          :type="subTask.isFinished ? 'check-square' : 'border'"
        />
      </div>
      <a-descriptions v-if="!isEditing" class="drawer-content" size="small" :column="4">
        <a-descriptions-item label="创建者" :span="2">
          <avatar-featured-user :username="subTask.founder" />
        </a-descriptions-item>
        <a-descriptions-item label="负责人" :span="2">
          <avatar-featured-user :username="subTask.principal" />
          <!--  <avatar-featured-user :username="subTask.principal" -->
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="4">
          {{ subTask.createTime | dateFilter }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" :span="4">
          {{ subTask.description }}
        </a-descriptions-item>
      </a-descriptions>
    </a-collapse-panel>
    <a-collapse-panel disabled :show-arrow="false">
      <a-input
        v-model="newSubTaskName"
        slot="header"
        placeholder="按enter添加 点击其他地方退出"
        @keypress.enter="handleSubTaskCreate"
        @keypress.esc="exitAdding"
        @blur="exitAdding"
      ></a-input>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
import eventBus from '../eventBus'

export default {
  components: {
    AvatarFeaturedUser,
  },
  data() {
    return {
      labelCol: { lg: { span: 6 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 12 } },

      isEditing: false,
      activeKey: [],
      newSubTaskName: '',
      defaultSubTask: {
        taskId: 'aklgnlkzzzld',
        taskName: '子任务名',
        isFinished: true,
        createTime: '16546513231',
        description: '子任务描述',
        founder: '子任务创建者',
        principal: '子任务负责人',
      },
    }
  },
  props: {
    parentTask: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId', 'projectMembers']),
  },
  methods: {
    createSubTask: function (formData) {
      // 本地
      this.$emit('create-sub-task', formData)
    },
    updateSubTask: function (subTask, formData) {
      this.$emit('update-sub-task', subTask, formData)
    },
    deleteSubTask: function (subTask) {
      this.$emit('delete-sub-task', subTask)
    },
    handleEdit(subTask) {
      console.log('fuckkkkkkkkkkkkkkkkk')
      eventBus.$emit('open-sub-drawer', subTask)
    },
    changePrincipal: function (evt, subTask) {
      console.log(evt)
    },
    handleRemove: function (subTask) {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.parentTask.taskId,
        subTaskName: subTask.taskName,
      }
      console.log('delete')
      eventBus.$emit('sub-task-delete', { subTask, requestData })
    },
    handleFinishSubTask: function (subTask) {
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.parentTask.taskId,
        subTaskName: subTask.taskName,
        isFinished: !subTask.isFinished,
      }

      console.log('finish')
      eventBus.$emit('sub-task-finish', { subTask, requestData })
    },
    handleSubTaskCreate: function () {
      if (this.newSubTaskName) {
        if (
          this.parentTask.subTasks &&
          this.parentTask.subTasks.find((subTask) => subTask.taskName === this.newSubTaskName)
        ) {
          return this.$notification.error({
            message: '已有同名子任务！',
          })
        }

        console.log('fuckkkkkkkkkkkkkk')
        const requestData = {
          username: this.username,
          subTaskName: this.newSubTaskName,
          projectId: this.projectId,
          taskId: this.parentTask.taskId,
          principal: this.username,
          founder: this.username,
        }

        console.log('create')
        eventBus.$emit('sub-task-create', { task: this.parentTask, requestData })
      }
    },
    exitAdding: function () {
      this.newSubTaskName = ''
    },
  },
}
</script>
<style scoped>
.panel-icon {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
>

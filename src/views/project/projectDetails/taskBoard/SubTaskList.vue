<template>
  <a-collapse v-model="activeKey" @change="onChange" accordion>
    <a-collapse-panel
      v-for="(subTask, subTaskIndex) in parentTask.subTasks"
      :key="subTaskIndex.toString()"
      :header="subTask.taskName"
    >
      <div slot="extra">
        <div v-if="isEditing && activeKey === subTaskIndex.toString()">
          <a-icon
            v-if="canEdit"
            type="save"
            class="panel-icon"
            key="sub-save"
            @click="handleEditDone($event, subTask, subTaskIndex)"
          ></a-icon>
        </div>
        <div v-else>
          <a-icon
            v-if="canEdit"
            class="panel-icon"
            @click="handleRemove($event, subTask, subTaskIndex)"
            key="sub-delete"
            type="delete"
          />
          <a-icon
            v-if="canEdit"
            type="edit"
            class="panel-icon"
            key="sub-edit"
            @click="handleEdit($event, subTask, subTaskIndex)"
          ></a-icon>
          <a-icon
            class="panel-icon"
            @click="handleFinishSubTask($event, subTask, subTaskIndex)"
            key="sub-check-square"
            :type="subTask.isFinished ? 'check-square' : 'border'"
          />
        </div>
      </div>
      <a-descriptions class="drawer-content" size="small" :column="4">
        <a-descriptions-item label="创建者" span="2">
          <avatar-featured-user :username="subTask.founder" />
        </a-descriptions-item>
        <a-descriptions-item label="负责人" span="2">
          <a-select v-if="isEditing" v-model="subTask.principal" :default-value="subTask.principal">
            <a-select-option
              v-for="member in projectMembers"
              :key="member.username"
              :value="member.username"
            >
              <avatar-featured-user :username="member.username" />
            </a-select-option>
          </a-select>
          <span v-else><avatar-featured-user :username="subTask.principal" /></span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="4">
          {{ subTask.createTime | dateFilter }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="4">
          <a-textarea
            v-if="isEditing"
            v-model="subTask.description"
            :auto-size="{ minRows: 2 }"
            placeholder="请输入任务描述"
            style="width: 400px; margin-top: 10px"
          ></a-textarea>
          <span v-else>{{ subTask.description }}</span>
        </a-descriptions-item>
      </a-descriptions>
    </a-collapse-panel>
    <a-collapse-panel v-if="canEdit" disabled :show-arrow="false" :force-render="false">
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
import { subTasks } from '../../../../mock/services/data'
import eventBus from '../eventBus'

export default {
  components: {
    AvatarFeaturedUser,
  },
  data() {
    return {
      labelCol: { lg: { span: 6 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 12 } },
      selectedSubTask: null,
      activeKey: null,
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
    canEdit: {
      type: Boolean,
      default: false,
    },
    parentTask: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId', 'projectMembers', 'projectAdminName']),
  },
  methods: {
    onChange: function (e) {},

    handleEdit: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      console.log(this.activeKey)
      this.isEditing = true
      if (this.activeKey === subTaskIndex.toString()) {
        this.activeKey = undefined
      }
      this.activeKey = subTaskIndex.toString()

      console.log('fuckkkkkkkkkkkkkkkkk')
      //eventBus.$emit('open-sub-drawer', subTask)
    },
    handleEditDone: function (event, subTask, subTaskIndex) {
      this.isEditing = false
      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.parentTask.taskId,
        deadline: subTask.deadline.format('YYYY-MM-DD'),
        subTaskName: subTask.taskName,
        description: subTask.description,
        principal: subTask.principal,
      }

      console.log('update')
      this.$emit('sub-task-update', {
        subTask: subTask,
        requestData,
      })
    },

    handleRemove: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      this.activeKey = undefined

      const requestData = {
        username: this.username,
        projectId: this.projectId,
        taskId: this.parentTask.taskId,
        subTaskName: subTask.taskName,
      }
      console.log('delete')
      eventBus.$emit('sub-task-delete', { subTask, requestData })
    },

    handleFinishSubTask: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      if (!this.canEdit) return
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
    onClose: function () {
      this.activeKey = new Array()
      this.isEditing = false
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

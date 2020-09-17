<template>
  <a-collapse v-model="activeKey" @change="xx" accordion>
    <a-collapse-panel
      v-for="(subTask, subTaskIndex) in parentTask.subTasks"
      :key="subTaskIndex.toString()"
      :header="subTask.taskName"
      @close="onClose"
    >
      <div slot="extra">
        <div v-if="!isEditing">
          <a-icon
            v-if="canEdit"
            class="panel-icon"
            @click="removeSubTask($event, subTask, subTaskIndex)"
            key="sub-delete"
            type="delete"
          />
          <a-icon
            v-if="canEdit"
            :type="
              isEditing && activeKey && activeKey === subTaskIndex.toString() ? 'save' : 'edit'
            "
            class="panel-icon"
            key="sub-edit"
            @click="editSubTask($event, subTask, subTaskIndex)"
          ></a-icon>
          <a-icon
            class="panel-icon"
            @click="finishSubTask($event, subTask, subTaskIndex)"
            key="sub-check-square"
            :type="subTask.isFinished ? 'check-square' : 'border'"
          />
        </div>
        <div v-else>
          <a-icon
            v-if="canEdit"
            :type="isEditing ? 'save' : 'edit'"
            class="panel-icon"
            key="sub-edit"
            @click="editSubTask($event, subTask, subTaskIndex)"
          ></a-icon>
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
    removeSubTask: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      this.activeKey = undefined
      this.$emit('delete-sub-task', subTask)
    },
    finishSubTask: function (event, subTask, subTaskIndex) {
      if (this.canEdit) this.$emit('update-sub-task', subTask, { isFinished: !subTask.isFinished })
    },
    xx: function (e) {
      console.log(e + ' ' + this.isEditing)
      if (e == undefined && this.isEditing) {
        this.isEditing = false
      }
      if (!this.isEditing && e) {
        this.activeKey = e
      }
    },
    editSubTask: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      console.log(this.isEditing)
      if (!this.isEditing) {
        this.activeKey = subTaskIndex.toString()
      } else {
        // emit
      }
      this.isEditing = !this.isEditing
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

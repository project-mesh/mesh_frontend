<template>
  <a-collapse accordion>
    <a-collapse-panel
      v-for="(subTask, subTaskIndex) in subTasks"
      :key="subTaskIndex"
      :header="subTask.taskName"
    >
      <div slot="extra">
        <a-icon
          class="panel-icon"
          @click="removeSubTask($event, subTask, subTaskIndex)"
          key="sub-delete"
          type="delete"
        />
        <a-icon
          type="edit"
          class="panel-icon"
          key="sub-edit"
          @click="editSubTask(subTask)"
        ></a-icon>
        <a-icon
          class="panel-icon"
          @click="finishSubTask($event, subTask, subTaskIndex)"
          key="sub-check-square"
          :type="subTask.isFinished ? 'check-square' : 'border'"
        />
      </div>
      <a-descriptions v-if="!isEditing" class="drawer-content" size="small" :column="4">
        <a-descriptions-item label="创建者" span="2">
          <avatar-featured-user :username="subTask.founder" />
        </a-descriptions-item>
        <a-descriptions-item label="负责人" span="2">
          <a-select v-model="subTask.principal" :default-value="subTask.principal">
            <a-select-option
              v-for="member in projectMembers"
              :key="member.username"
              :value="member.username"
            >
              <avatar-featured-user :username="member.username" />
            </a-select-option>
          </a-select>
          <!--  <avatar-featured-user :username="subTask.principal" -->
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="4">
          {{ subTask.createTime | dateFilter }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="4">
          {{ subTask.description }}
        </a-descriptions-item>
      </a-descriptions>
    </a-collapse-panel>
    <a-collapse-panel disabled :show-arrow="false">
      <a-input
        v-model="newSubTaskName"
        slot="header"
        placeholder="按enter添加 点击其他地方退出"
        @keypress.enter="finishAdding"
        @keypress.esc="exitAdding"
        @blur="exitAdding"
      ></a-input>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
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
    taskId: {
      type: String,
      required: true,
    },
    subTasks: {
      type: Array,
      required: true,
      default: function () {
        return [
          {
            taskId: 'aklgnlkzzzld',
            taskName: '子任务名',
            isFinished: true,
            createTime: '16546513231',
            description: '子任务描述',
            founder: '子任务创建者',
            principal: '子任务负责人',
          },
        ]
      },
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

    changePrincipal: function (evt, subTask) {
      console.log(evt)
    },
    removeSubTask: function (evt, subTask, subTaskIndex) {
      event.stopPropagation()
      this.$emit('delete-sub-task', subTask)
    },
    finishSubTask: function (evt, subTask, subTaskIndex) {
      event.stopPropagation()
      this.$emit('update-sub-task', subTask, { isFinished: !subTask.isFinished })
    },

    editSubTask: function (subTask) {
      this.isEditing = !this.isEditing
    },

    finishAdding: function () {
      if (this.newSubTaskName) {
        const formData = {
          taskName: this.newSubTaskName,
          taskId: this.taskId,
          isFinished: false,
          description: '',
          principal: this.username,
        }
        this.createSubTask(formData)
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

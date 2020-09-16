<template>
  <a-drawer :width="540" :visible="visible" @close="close">
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="['taskName', { rules: [{ required: true, message: '请输入任务名称' }] }]"
            name="taskName"
            placeholder="请输入任务名称"
          />
        </a-form-item>
        <a-form-item label="截止日期" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-date-picker
            name="deadline"
            style="width: 100%"
            v-decorator="['deadline', { rules: [{ required: true, message: '请选择截止日期' }] }]"
          />
        </a-form-item>

        <a-form-item
          label="负责人"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :required="true"
        >
          <a-select
            ref="select"
            v-decorator="[
              'principal',
              { rules: [{ required: true, message: '请选择任务负责人' }] },
            ]"
          >
            <a-select-option
              v-for="member in projectMembers"
              :key="member.username"
              :value="member.username"
            >
              {{ member.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="优先级"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :required="true"
        >
          <a-select
            ref="select"
            v-decorator="['priority', { rules: [{ required: true, message: '请选择任务优先级' }] }]"
          >
            <a-select-option
              v-for="(mark, markKey) in priorityMarks"
              :key="markKey"
              :value="+markKey"
            >
              {{ mark.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务描述" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea
            rows="4"
            placeholder="请输入该任务的详细描述"
            v-decorator="[
              'description',
              { rules: [{ required: false, message: '请输入该任务的详细描述' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
          <a-button @click="handleSubmit" :loading="updating" type="primary">
            {{ isCreating ? '新建' : '保存' }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-drawer>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 4 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 12 } },
      priorityMarks: {
        0: { label: '较低', color: 'blue' },
        1: { label: '普通', color: 'green' },
        2: { label: '较高', color: 'yellow' },
        3: { label: '极高', color: 'red' },
      },
      updating: false,
    }
  },
  computed: {
    ...mapGetters(['username', 'teamId', 'projectId', 'projectMembers']),
    isCreating() {
      return !('taskId' in this.task)
    },
  },
  watch: {
    visible(value) {
      if (value) {
        this.$nextTick(() => {
          const time = moment(this.task.deadline, 'YYYY-MM-DD')

          console.log(time)

          this.form.setFieldsValue({
            taskName: this.task.taskName,
            deadline: time,
            principal: this.task.principal,
            priority: this.task.priority,
            description: this.task.description,
          })
        })
      }
    },
  },
  methods: {
    ...mapActions(['updateTask', 'createTask']),
    // handler
    handleSubmit(e) {
      this.updating = true

      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values.deadline.format('YYYY-MM-DD'))

          const taskData = {
            priority: values.priority,
            deadline: values.deadline.format('YYYY-MM-DD'),
            taskName: values.taskName,
            description: values.description,
            principal: values.principal,
          }

          if (this.isCreating) {
            this.tryCreateTask(taskData)
          } else {
            this.tryUpdateTask(taskData)
          }
        }
      })
    },
    tryCreateTask(taskData) {
      this.createTask({
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
        ...taskData,
      })
        .then((res) => {
          console.log('创建任务成功')
          this.$emit('taskCreate', taskData)
        })
        .catch((err) => {
          console.log(err)
          this.$notification.error({
            message: err.message,
            // description: err.message,
          })
        })
        .finally(() => {
          this.updating = false
          this.close()
        })
    },
    tryUpdateTask(taskData) {
      this.updateTask({
        username: this.username,
        projectId: this.projectId,
        taskId: this.task.taskId,
        ...taskData,
      })
        .then((res) => {
          console.log('更新任务信息成功')
          this.$emit('taskUpdate', taskData)
        })
        .catch((err) => {
          this.$notification.error({
            message: '更新任务信息失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.updating = false
          this.close()
        })
    },
    close: function () {
      // this.visible = false
      this.$emit('close')
    },
  },
}
</script>

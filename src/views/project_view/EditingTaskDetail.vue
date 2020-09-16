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
          <a-select @focus="focus" ref="select" @change="handleChange">
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
          <a-select @focus="focus" ref="select" @change="handleChange">
            <a-select-option
              v-for="(mark, markKey) in priorityMarks"
              :key="markKey"
              :value="markKey"
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
          <a-button html-type="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-drawer>
</template>

<script>
import { priorityMarks } from './common/priority'
export default {
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },
  },
  data() {
    return {
      priorityMarks: priorityMarks,
      form: this.$form.createForm(this),
      labelCol: { lg: { span: 6 }, sm: { span: 4 } },
      wrapperCol: { lg: { span: 18 }, sm: { span: 12 } },
      projectMembers: [
        { username: '王泽钜', avatar: 'xxxxxxx' },
        { username: '刘学迪', avatar: 'xxxxxxxx' },
        { username: '王新宇', avatar: 'xxxxxxxxxxx' },
      ],
    }
  },
  methods: {
    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    close: function () {
      this.$emit('change-drawer', '')
    },
  },
}
</script>

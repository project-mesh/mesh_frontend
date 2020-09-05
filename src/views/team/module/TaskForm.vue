<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="成员姓名" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="['title', { rules: [{ required: true, message: '请输入新增成员' }] }]"
      />
    </a-form-item>
    <a-form-item label="职位" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-select v-decorator="['owner', { rules: [{ required: true, message: '请选择成员职位' }] }]">
        <a-select-option :value="0">组长</a-select-option>
        <a-select-option :value="1">管理员</a-select-option>
        <a-select-option :value="2">成员</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="标签" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-textarea v-decorator="['description']"></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'TaskForm',
  props: {
    record: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      form: this.$form.createForm(this),
    }
  },
  mounted() {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  methods: {
    onOk() {
      console.log('监听了 modal ok 事件')
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    onCancel() {
      console.log('监听了 modal cancel 事件')
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    handleSubmit() {
      const {
        form: { validateFields },
      } = this
      this.visible = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
      })
    },
  },
}
</script>

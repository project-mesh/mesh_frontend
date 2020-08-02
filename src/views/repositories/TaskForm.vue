<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="['title', { rules: [{ required: true, message: '请输入知识库标题' }] }]"
      />
    </a-form-item>
    <a-form-item label="外部链接" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="[
          'link',
          { rules: [{ required: true, message: '请输入外部链接', pattern: /.*/ }] },
        ]"
      />
    </a-form-item>
    <a-form-item label="简介" :label-col="labelCol" :wrapper-col="wrapperCol">
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

<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="切换团队" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-select v-decorator="['owner', { rules: [{ required: true, message: '请切换团队' }] }]">
        <a-select-option :value="0">摸鱼小队</a-select-option>
        <a-select-option :value="1">摸鱼中队</a-select-option>
        <a-select-option :value="2">摸鱼大队</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'

const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'ChangeForm',
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
<style lang="less">
.ant-modal-content {
  height: 100%;
}
</style>

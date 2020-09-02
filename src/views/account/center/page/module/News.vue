<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item
      label="标题"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
      <a-input v-decorator="['title', {rules:[{required: false, message: '请输入任务名称'}]}]" />
    </a-form-item>
    <a-form-item
      label="内容"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
    >
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
        default: null
      }
    },
    data () {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        },
        form: this.$form.createForm(this)
      }
    },
    mounted () {
      this.record && this.form.setFieldsValue(pick(this.record, fields))
    },
    methods: {
      onOk () {
        console.log('监听了 modal ok 事件')
        return new Promise(resolve => {
          resolve(true)
        })
      },
      onCancel () {
        console.log('监听了 modal cancel 事件')
        return new Promise(resolve => {
          resolve(true)
        })
      },
      handleSubmit () {
        const { form: { validateFields } } = this
        this.visible = true
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)
          }
        })
      }
    }
  }
</script>
<style lang="less">
  div.ant-modal-body{
    height: 300px;
  }
  form.ant-form.ant-form-horizontal{
    height: 250px;
  }
  textarea#description.ant-input{
    height: 200px;
  }
</style>

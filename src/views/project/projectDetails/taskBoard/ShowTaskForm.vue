<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input v-decorator="['taskName']" />
    </a-form-item>
    <a-form-item label="负责人" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input v-decorator="['principal']" />
    </a-form-item>
    <a-form-item label="截止日期" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-date-picker />
    </a-form-item>
  </a-form>
</template>

<script>
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
  // mounted() {
  //   this.record && this.form.setFieldsValue(pick(this.record, fields))
  // },
  methods: {
    handleSubmit() {
      return null
    },
  },
}
</script>

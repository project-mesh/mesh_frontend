<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="[
          'knowledgeName',
          {
            initialValue: isCreateForm ? '' : record.knowledgeName,
            rules: [{ required: isCreateForm, message: '请输入知识库标题' }],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="外部链接" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="[
          'hyperlink',
          {
            initialValue: isCreateForm ? '' : record.hyperlink,
            rules: [{ required: isCreateForm, message: '请输入外部链接', pattern: /.*/ }],
          },
        ]"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import pick from 'lodash.pick'

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
  watch: {
    record(newRecord) {
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(newRecord, ['knowledgeName', 'hyperlink']))
      })
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId']),
    isCreateForm() {
      return Object.keys(this.record).length === 0
    },
    requestName() {
      return this.isCreateForm ? 'createProjectKB' : 'updateProjectKB'
    },
  },
  methods: {
    ...mapActions(['createProjectKB', 'updateProjectKB']),
    handleSubmit() {
      return new Promise((resolve, reject) => {
        const {
          form: { validateFields },
        } = this
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)

            const requestData = {
              username: this.username,
              projectId: this.projectId,
              knowledgeName: values.knowledgeName,
              hyperlink: values.hyperlink,
            }

            if (!this.isCreateForm) requestData.knowledgeId = this.record.knowledgeId

            this[this.requestName](requestData).then(resolve).catch(reject)
          } else {
            reject(errors)
          }
        })
      })
    },
  },
}
</script>

<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        v-decorator="[
          'title',
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
          'link',
          {
            initialValue: isCreateForm ? '' : record.hyperlink,
            rules: [{ required: isCreateForm, message: '请输入外部链接', pattern: /.*/ }],
          },
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
import { mapActions, mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['username', 'teamId']),
    isCreateForm() {
      return Object.keys(this.record).length === 0
    },
    requestName() {
      return this.isCreateForm ? 'createTeamKB' : 'updateTeamKB'
    },
  },
  mounted() {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  methods: {
    ...mapActions(['createTeamKB', 'updateTeamKB']),
    onOk() {
      return new Promise((resolve, reject) => {
        const {
          form: { validateFields },
        } = this
        // this.visible = true
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)

            const requestData = {
              username: this.username,
              teamId: this.teamId,
              knowledgeName: values.title,
              hyperlink: values.link,
            }

            if (!this.isCreateForm) requestData.knowledgeId = this.record.knowledgeId

            this[this.requestName](requestData).then(resolve).catch(reject)
          } else {
            reject(errors)
          }
        })
      }).catch((error) => console.log('error occured in TaskForm: ', error))
    },
    onCancel() {
      console.log('监听了 modal cancel 事件')
      return new Promise((resolve) => {
        resolve(true)
      })
    },
    handleSubmit() {
      // const {
      //   form: { validateFields },
      // } = this
      // console.log('validateFields!')
      // this.visible = true
      // validateFields((errors, values) => {
      //   if (!errors) {
      //     console.log('values', values)
      //   }
      // })
      console.log('handle submit call')
    },
  },
}
</script>

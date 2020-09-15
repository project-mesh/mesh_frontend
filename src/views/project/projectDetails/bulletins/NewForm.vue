<template>
  <a-form @submit="handleSubmit" :form="form">
    <a-form-item label="标题" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input
        :disabled="username !== projectAdminName"
        v-decorator="[
          'title',
          {
            rules: [{ required: true, message: '请输入任务名称' }],
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="内容" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-textarea
        :disabled="username !== projectAdminName"
        v-decorator="['description', {}]"
      ></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters, mapActions } from 'vuex'

// const fields = ['title', 'startAt', 'owner', 'description']
export default {
  name: 'NewForm',
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
    ...mapGetters(['username', 'projectAdminName']),
  },
  methods: {
    ...mapActions(['updateBulletin']),
    handleSubmit() {
      return new Promise((resolve, reject) => {
        if (this.username !== this.projectAdminName) resolve()

        const {
          form: { validateFields },
        } = this
        this.visible = true
        validateFields((errors, values) => {
          if (!errors) {
            console.log('values', values)

            const requestData = {
              username: this.username,
              bulletinName: values.title,
              description: values.description,
            }

            this.updateBulletin(requestData).then(resolve).catch(reject)
          } else reject(errors)
        })
      })
    },
  },
}
</script>
<style lang="less">
div.ant-modal-body {
  height: 300px;
}
form.ant-form.ant-form-horizontal {
  height: 250px;
}
textarea#description.ant-input {
  height: 200px;
}
</style>

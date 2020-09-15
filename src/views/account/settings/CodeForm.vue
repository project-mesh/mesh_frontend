<template>
  <a-form @submit="this.handleSubmit" :form="form">
    <a-form-item label="原本密码" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input-password
        size="large"
        @click="handlePasswordInputClick"
        placeholder="账号原密码"
        v-decorator="[
          'oldPassword',
          {
            rules: [{ required: true, message: '区分大小写' }],
          },
        ]"
      ></a-input-password>
    </a-form-item>
    <a-form-item label="新密码" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input-password
        size="large"
        @click="handlePasswordInputClick"
        placeholder="至少6位密码，区分大小写"
        v-decorator="[
          'password',
          {
            rules: [
              { required: true, message: '至少6位密码，区分大小写' },
              { validator: this.handlePasswordLevel },
            ],
            validateTrigger: ['change', 'blur'],
          },
        ]"
      ></a-input-password>
    </a-form-item>
    <a-form-item label="确认新密码" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-input-password
        size="large"
        placeholder="确认密码"
        v-decorator="[
          'password2',
          {
            rules: [
              { required: true, message: '至少6位密码，区分大小写' },
              { validator: this.handlePasswordCheck },
            ],
            validateTrigger: ['change', 'blur'],
          },
        ]"
      ></a-input-password>
    </a-form-item>
  </a-form>
</template>

<script>
import sendRequest from '../../../api/'
import { mapActions, mapGetters } from 'vuex'
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强',
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success',
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a',
}
import pick from 'lodash.pick'

const fields = ['title', 'startAt', 'owner', 'description']

export default {
  name: 'CodeForm',
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
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000',
      },
    }
  },
  mounted() {
    this.record && this.form.setFieldsValue(pick(this.record, fields))
  },
  computed: {
    ...mapGetters(['username', 'nickname']),
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel]
    },
  },
  methods: {
    ...mapActions(['updateUserPassword']),
    onOk() {
      // this.handleSubmit()
      console.log('监听了 modal ok 事件')
      console.log(this.form)
      return new Promise((resolve, reject) => {
        if (this.handleSubmit()) {
          resolve(true)
        } else {
          reject('表单校验失败')
        }
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
        console.log('errors is: ', errors)
        if (!errors) {
          console.log('values', values)
          this.state.passwordLevelChecked = false
          console.log('will call register api by values:', values)
          this.updateUserPassword({
            username: this.username,
            oldPassword: values.oldPassword,
            password: values.password,
          }).catch((error) => {
            this.$notification.error({
              message: '修改密码失败',
              description: `${error.name}: ${error.message}`,
            })
          })
          return true
        } else {
          return false
        }
      })
    },
    handlePasswordLevel(rule, value, callback) {
      let level = 0

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    handlePasswordInputClick() {
      this.state.passwordLevelChecked = true
    },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
  },
}
</script>

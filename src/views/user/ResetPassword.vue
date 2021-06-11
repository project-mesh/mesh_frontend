<template>
  <div class="main">
    <h3>找回密码</h3>
    <p>我们已将验证码发送至您的邮箱，请使用该验证码重置密码</p>
    <a-form :form="form">
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入验证码"
          v-decorator="[
            'token',
            {
              rules: [{ required: true, message: '请输入验证码' }],
              validateTrigger: ['change', 'blur'],
            },
          ]"
        >
          <a-icon slot="suffix" type="key" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>

      <password-input :form="form" password-id="password" confirm-password-id="confirmPassword" />

      <a-form-item>
        <a-button
          block
          size="large"
          type="primary"
          html-type="submit"
          :loading="submitBtnLoading"
          @click.stop.prevent="onSubmit"
        >
          确认设置密码
        </a-button>
      </a-form-item>
      <ul class="links">
        <li><router-link :to="{ name: 'login' }">使用已有账户登录</router-link></li>
        <li>
          <router-link :to="{ name: 'register' }">注册账户</router-link>
        </li>
      </ul>
    </a-form>
  </div>
</template>

<script>
import { promisify } from '@/utils/util'
import PasswordInput from './components/PasswordInput'
import sendRequest from '@/api'

export default {
  components: {
    PasswordInput,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      submitBtnLoading: false,
    }
  },
  methods: {
    async onSubmit() {
      const {
        form: { validateFields },
        $notification,
        $router,
      } = this

      this.submitBtnLoading = true

      const asyncValidate = promisify(validateFields)

      try {
        const [{ token, password }] = await asyncValidate()

        const {
          data: { isSuccess, msg: message = null },
        } = await sendRequest('resetPassword', { token, password })

        if (isSuccess) {
          $notification.info({
            message: '成功重置密码，请重新登陆',
          })
          return $router.push({ name: 'login' })
        }

        $notification.error({
          message,
        })
      } catch (err) {
        console.log(err)
      } finally {
        this.submitBtnLoading = false
      }
    },
  },
}
</script>

<style scoped>
.links {
  margin-top: 24px;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
</style>

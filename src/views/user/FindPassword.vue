<template>
  <div class="main">
    <h3 class="title">找回密码</h3>
    <a-form :form="form">
      <username-input />
      <a-form-item>
        <a-button
          block
          size="large"
          type="primary"
          html-type="submit"
          :loading="submitBtnLoading"
          @click.stop.prevent="onSubmit"
        >
          找回密码
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
import sendRequest from '@/api'
import UsernameInput from './components/UsernameInput'

export default {
  components: {
    UsernameInput,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      submitBtnLoading: false,
      text: '',
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
        const [{ username }] = await asyncValidate()
        const {
          data: { isSuccess, msg: message = null },
        } = await sendRequest('findPassword', { username })

        if (isSuccess) {
          return $router.push({ name: 'resetPassword' })
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
.title {
  font-size: 16px;
  margin-bottom: 20px;
}

.links {
  margin-top: 24px;
  padding: 0;
  display: flex;
  justify-content: space-between;
}
</style>

<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :active-key="customActiveKey"
        :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-alert
            v-if="isLoginError"
            type="error"
            show-icon
            style="margin-bottom: 24px"
            message="账户或密码错误（admin/ant.design )"
          />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户: admin"
              v-decorator="[
                'username',
                {
                  rules: [{ required: true, message: '请输入帐户名' }],
                  validateTrigger: 'change',
                },
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              placeholder="密码: admin or ant.design"
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码' }],
                  validateTrigger: 'blur',
                },
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >
          确定
        </a-button>
      </a-form-item>
      <div class="user-login-other">
        <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
      </div>
    </a-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { timeFix } from '@/utils/util'
import axios from 'axios'
export default {
  name: 'Login',
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      isLoginError: false,
      // requiredTwoStepCaptcha: false,
      // stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false,
      },
    }
  },
  computed: {
    ...mapGetters(['role']),
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.state.loginBtn = true
          setTimeout(() => {
            this.state.loginBtn = false
          }, 1000)
          this.Login({ username: values.username, password: values.password })
            .then((res) => {
              console.log('success,boy', res)
              if (res.data.isSuccess) {
                if (this.role === 'user') this.$router.push({ name: 'projectList' })
                else this.$router.push({ name: 'manage' })
                // 延迟 1 秒显示欢迎信息
                setTimeout(() => {
                  this.$notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`,
                  })
                }, 1000)
                this.isLoginError = false
              } else {
                this.$notification.error({
                  message: res.data.msg,
                })
              }
            })
            .catch((err) => {
              console.log('error, boy: ', err)
            })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }
  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }
  .forge-password {
    font-size: 14px;
  }
  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;
    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
    .register {
      float: right;
    }
  }
}
</style>

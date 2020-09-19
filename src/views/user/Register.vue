<template>
  <div class="main user-layout-register">
    <h3><span>注册</span></h3>
    <a-form ref="formRegister" :form="form" id="formRegister">
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="用户名"
          v-decorator="[
            'username',
            {
              rules: [{ required: true, message: '请输入用户名' }],
              validateTrigger: ['change', 'blur'],
            },
          ]"
        ></a-input>
      </a-form-item>

      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        :get-popup-container="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked"
      >
        <template slot="content">
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">
              强度：
              <span>{{ passwordLevelName }}</span>
            </div>
            <a-progress
              :percent="state.percent"
              :show-info="false"
              :stroke-color="passwordLevelColor"
            />
            <div style="margin-top: 10px">
              <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
            </div>
          </div>
        </template>
        <a-form-item>
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
      </a-popover>

      <a-form-item>
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

      <a-form-item>
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn"
        >
          注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
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
import sendRequest from '@/api'
import { putObject, getDefaultAvatar, dataURItoBlob } from '../../utils/oss'
export default {
  name: 'Register',
  components: {},
  mixins: [],
  data() {
    return {
      form: this.$form.createForm(this),

      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000',
      },
      registerBtn: false,
    }
  },
  computed: {
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

    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    handlePasswordInputClick() {
      this.state.passwordLevelChecked = true
    },

    async localImgToBase64() {
      let img = new Image()
      img.src = '/avatar2.jpg'
      let canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      let context = canvas.getContext('2d')
      context.drawImage(img, 0, 0)

      var res = ''

      let blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg')).then(
        function (blob) {
          // blob ready, download it
          let reader = new FileReader()
          var base64 = ''

          reader.onload = (function (b) {
            return function (e) {
              // 回调的位置
              b = e.target.result
              base64 = e.target.result
            }
          })(base64)

          reader.readAsDataURL(blob)
          console.log(base64)
          return base64
          // delete the internal blob reference, to let the browser clear memory from it
        }
      )
    },

    handleSubmit() {
      var x = this.localImgToBase64()
      this.form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.state.passwordLevelChecked = false
          sendRequest('register', { ...values })
            .then((res) => {
              //TODO : store commit
              const { data } = res
              console.log('register result, data: ', data)
              if (data.isSuccess) {
                getDefaultAvatar().then((ret) => {
                  console.log('values.username is:', values.username)
                  putObject('userAvatar_' + values.username, dataURItoBlob(ret)).then(() => {
                    console.log('success in put avatar')
                  })
                })
                this.$router.push({ name: 'registerResult', params: { ...values } })
              }

              if (res.err_code === 101)
                this.$notification.error({
                  message: '该用户名已被注册！',
                })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
    },
  },

  watch: {
    'state.passwordLevel': function (val) {},
  },
}
</script>

<style lang="less">
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>

<style lang="less" scoped>
.user-layout-register {
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>

<template>
  <div class="main user-layout-register">
    <h3><span>注册</span></h3>
    <a-form ref="formRegister" :form="form" id="formRegister">
      <username-input />

      <password-input :form="form" password-id="password" confirm-password-id="password2" />

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
import sendRequest from '@/api'
import { putObject, getDefaultAvatar, dataURItoBlob } from '../../utils/oss'
import PasswordInput from './components/PasswordInput'
import UsernameInput from './components/UsernameInput'

export default {
  name: 'Register',
  components: {
    UsernameInput,
    PasswordInput,
  },
  mixins: [],
  data() {
    return {
      form: this.$form.createForm(this),

      state: {
        time: 60,
        smsSendBtn: false,
      },
      registerBtn: false,
    }
  },
  methods: {
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
}
</script>

<style lang="less">
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

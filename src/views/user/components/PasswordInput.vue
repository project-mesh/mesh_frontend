<template>
  <div>
    <a-popover
      placement="rightTop"
      :trigger="['focus']"
      :get-popup-container="(trigger) => trigger.parentElement"
      v-model="passwordLevelChecked"
    >
      <template slot="content">
        <div :style="{ width: '240px' }">
          <div :class="passwordLevelClass">
            强度：
            <span>{{ passwordLevelName }}</span>
          </div>
          <a-progress :percent="percent" :show-info="false" :stroke-color="passwordLevelColor" />
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
            passwordId,
            {
              rules: [
                { required: true, message: '至少6位密码，区分大小写' },
                { validator: this.handlePasswordLevel },
              ],
              validateTrigger: ['change', 'blur'],
            },
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input-password>
      </a-form-item>
    </a-popover>

    <a-form-item>
      <a-input-password
        size="large"
        placeholder="确认密码"
        v-decorator="[
          confirmPasswordId,
          {
            rules: [
              { required: true, message: '至少6位密码，区分大小写' },
              { validator: this.handlePasswordCheck },
            ],
            validateTrigger: ['change', 'blur'],
          },
        ]"
      >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
      </a-input-password>
    </a-form-item>
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

export default {
  props: {
    form: {
      required: true,
      type: Object,
    },
    passwordId: {
      type: String,
      default: 'password',
    },
    confirmPasswordId: {
      type: String,
      default: 'confirm',
    },
  },
  data() {
    return {
      passwordLevelChecked: false,
      passwordLevel: 0,
      percent: 10,
    }
  },
  computed: {
    passwordLevelClass() {
      return levelClass[this.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.passwordLevel]
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
      this.passwordLevel = level
      this.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },

    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue(this.passwordId)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },

    handlePasswordInputClick() {
      this.passwordLevelChecked = true
    },
  },
}
</script>

<style scoped>
.error {
  color: #ff0000;
}

.warning {
  color: #ff7e05;
}

.success {
  color: #52c41a;
}
</style>

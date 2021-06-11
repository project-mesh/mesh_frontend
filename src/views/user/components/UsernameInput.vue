<template>
  <a-form-item>
    <a-input
      size="large"
      type="text"
      placeholder="邮箱"
      v-decorator="[
        id,
        {
          rules: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱不合法' },
          ],
          validateTrigger: 'change',
        },
      ]"
    >
      <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }" />
    </a-input>
  </a-form-item>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'username',
    },
  },
}
</script>

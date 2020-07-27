<template>
  <a-result :is-success="true" :content="false" :title="email" :sub-title="description">
    <template #extra>
      <a-button size="large" style="margin-left: 8px;" @click="goHomeHandle">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'RegisterResult',
  data() {
    return {
      description: 'Welcome to Mesh',
      form: {},
    }
  },
  computed: {
    email() {
      const v = (this.form && this.form.username) || 'xxx'
      return `你的账户：${v} 注册成功`
    },
  },
  created() {
    this.form = this.$route.params
  },
  methods: {
    goHomeHandle() {
      this.$router.push({ name: 'login' })
    },
  },
}
</script>

<style scoped></style>

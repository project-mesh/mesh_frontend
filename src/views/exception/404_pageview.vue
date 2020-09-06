<template>
  <a-result status="404" title="404" :sub-title="showCount">
    <template #extra>
      <a-button type="primary" @click="toHome">返回首页</a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception404Pageview',
  data() {
    return {
      count: '',
      showCount: '',
    }
  },
  mounted() {
    this.fiveToGo()
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/' })
    },
    fiveToGo() {
      const TIME_COUNT = 5
      if (!this.timer) {
        this.count = TIME_COUNT
        this.showCount = '对不起，您要访问的页面不存在。' + TIME_COUNT + '秒后自动返回首页。'
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            this.showCount = '对不起，您要访问的页面不存在。' + this.count + '秒后自动返回首页。'
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
            this.toHome()
          }
        }, 1000)
      }
    },
  },
}
</script>

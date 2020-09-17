<template>
  <iframe class="vue-friendly-iframe" src="http://www.baidu.com">
    IE：你们都看我干吗，我现在也是支持的
  </iframe>
</template>

<script>
export default {
  name: 'KibanaMonitor',
  data() {
    return {
      serverOptions: {
        src: 'https://www.baidu.com/',
      },
    }
  },
}
</script>

<style>
.vue-friendly-iframe iframe {
  height: 60em;
  width: 100%;
}
</style>

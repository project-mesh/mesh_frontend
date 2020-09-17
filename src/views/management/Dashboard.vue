<template>
  <iframe
    style="height: 720px; width: 100%; border: 0"
    src="http://120.26.177.56:7777/#/system-status"
  >
    IE：你们都看我干吗，我现在也是支持的
  </iframe>
</template>

<script>
export default {
  name: 'KibanaMonitor',
  data() {
    return {
      serverOptions: {
        src: 'http://120.26.177.56:7777/#/system-status',
      },
    }
  },
}
</script>

<style>
.vue-friendly-iframe {
  height: 100%;
  width: 100%;
}
</style>

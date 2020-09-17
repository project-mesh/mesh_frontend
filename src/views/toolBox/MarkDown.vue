<template>
  <iframe
    style="height: 720px; width: 100%; border: 0"
    src="https://xuedixuedi.github.io/online_md_edit/text.html"
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
        src: 'https://xuedixuedi.github.io/online_md_edit/text.html',
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

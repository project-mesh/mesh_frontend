<template>
  <vue-friendly-iframe
    class="vue-friendly-iframe"
    src="https://latex.codecogs.com/eqneditor/editor.php"
    scrolling="auto"
  >
    您的浏览器不支持 iframe 标签，请考虑更换 Edge/Firefox/Chrome 等现代浏览器
  </vue-friendly-iframe>
</template>

<script>
export default {}
</script>

<style>
.vue-friendly-iframe iframe {
  height: 80em;
  width: 100%;
}
</style>

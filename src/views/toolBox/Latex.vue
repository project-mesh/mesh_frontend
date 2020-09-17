<template>
  <div>
    <a-button type="primary" @click="test">Primary</a-button>
    <vue-friendly-iframe
      class-name="vue-friendly-iframe"
      src="https://sagecell.sagemath.org/"
      scrolling="no"
      id="iframe-sagecell"
    >
      您的浏览器不支持 iframe 标签，请考虑更换 Edge/Firefox/Chrome 等现代浏览器
    </vue-friendly-iframe>
  </div>
</template>

<script>
export default {
  methods: {
    mounted() {
      var iframe = document.getElementById('iframe-sagecell').firstElementChild
      var elmnt = iframe.contentWindow.document.getElementById('sagecell_about')
      elmnt.style.display = 'none'
    },
    test() {
      var iframe = document.getElementById('iframe-sagecell').firstElementChild
      console.log(iframe)
      var elmnt = iframe.contentWindow.document.getElementById('sagecell_about')
      elmnt.style.display = 'none'
    },
  },
}
</script>

<style>
.vue-friendly-iframe {
  height: 52em;
  width: 100%;
}
</style>

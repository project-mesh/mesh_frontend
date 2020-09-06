<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://github.com/project-mesh/mesh_frontend/blob/master/README.md" target="_blank">
        项目简介
      </a>
      <a href="https://github.com/project-mesh/mesh_frontend/blob/master/LICENSE" target="_blank">
        许可协议
      </a>
      <a href="https://github.com/orgs/project-mesh/people" target="_blank">开发人员</a>
    </template>
    <template v-slot:copyright>
      <a href="https://github.com/project-mesh" target="_blank">Tongji Mesh</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter,
  },
}
</script>

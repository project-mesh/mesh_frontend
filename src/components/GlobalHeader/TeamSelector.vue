<template>
  <a-dropdown placement="bottomRight">
    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
      {{ teamName }}
      <a-icon type="down" />
    </a>
    <a-menu slot="overlay" class="ant-pro-drop-down menu">
      <a-menu-item v-for="team in teams" :key="team.teamId">
        <a href="javascript:;">{{ team.teamName }}</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TeamSelector',
  computed: {
    ...mapGetters(['teamName', 'teams']),
  },
}
</script>
<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>

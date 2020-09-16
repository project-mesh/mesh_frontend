<template>
  <a-dropdown>
    <a-icon type="inbox" :style="{ fontSize: '1.2em' }" />
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item>
          <a-icon type="user" />
          工具1
        </a-menu-item>
        <a-menu-item>
          <a-icon type="setting" />
          工具2
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script>
export default {
  name: 'Toolbox',
  methods: {},
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

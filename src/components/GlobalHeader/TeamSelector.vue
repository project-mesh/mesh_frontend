<template>
  <div id="components-dropdown-demo-placement">
    <a-dropdown>
      <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
        {{ teamName }}
        <a-icon type="down" />
      </a>
      <a-menu slot="overlay">
        <a-menu-item>
          <a href="javascript:;">1st menu item</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">2nd menu item</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;">3rd menu item</a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
  export default {
    name: 'TeamSelector',
    data() {
      return {
        teamName: '数据库课程团队',
      }
    },
  }
</script>
<style>
  #components-dropdown-demo-placement {
    margin-left: 120px;
  }
</style>

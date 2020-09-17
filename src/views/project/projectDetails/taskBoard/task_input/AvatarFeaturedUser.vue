<template>
  <div>
    <a-avatar
      shape="circle"
      size="small"
      style="margin: 0px 2px"
      :src="avatar ? avatar : username"
    />
    {{ username }}
  </div>
</template>
<script>
export default {
  props: {
    username: {
      type: String,
      required: true,
      default: function () {
        return '用户名'
      },
    },
  },
  // todo ！！！
  computed: {
    avatar: () => '',
  },
}
</script>

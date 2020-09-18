<template>
  <div>
    <a-avatar shape="circle" size="small" style="margin: 0px 2px" :src="avatar" />
    {{ username }}
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['projectMembers']),
    avatar() {
      return this.projectMembers.find((member) => member.username === this.username).avatar
    },
  },
}
</script>

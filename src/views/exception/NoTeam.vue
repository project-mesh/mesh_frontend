<template>
  <div class="welcome-img">
    <img src="../../assets/welcome.png" width="500px" />
    <a-button type="primary" @click="handleTeamCreate">创建你的第一个团队</a-button>
  </div>
</template>
<script>
import { Empty } from 'ant-design-vue'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {}
  },
  methods: {
    ...mapMutations(['TOGGLE_CREATING_TEAM']),
    handleTeamCreate() {
      this.TOGGLE_CREATING_TEAM(true)
    },
  },
}
</script>
<style scoped>
.welcome-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

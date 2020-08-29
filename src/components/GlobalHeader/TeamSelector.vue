<template>
  <a-dropdown placement="bottomRight">
    <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
      {{ teamName }}
      <a-icon type="down" />
    </a>
    <a-menu slot="overlay" class="ant-pro-drop-down menu">
      <a-menu-item v-for="team in teams" :key="team.teamId" @click="handleTeamChange(team)">
        {{ team.teamName }}
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TeamSelector',
  computed: {
    ...mapGetters(['username', 'teamName', 'teams', 'teamId']),
  },
  methods: {
    ...mapActions(['queryTeam', 'queryTeamKB']),
    handleTeamChange(team) {
      const requestData = {
        username: this.username,
        teamId: team.teamId,
      }
      const promises = [this.queryTeam(requestData), this.queryTeamKB(requestData)]
      Promise.all(promises)
        .then(() => this.$router.push('/'))
        .catch((error) => {
          this.$notification.error({
            message: '请求团队信息失败，请重试',
            description: `${error.name}: ${error.message}`,
          })
        })
    },
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

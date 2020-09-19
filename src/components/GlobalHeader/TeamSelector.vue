<template>
  <div>
    <a-dropdown v-if="teams && teams.length" placement="bottomRight">
      <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
        {{ teamName }}
        <a-icon type="down" />
      </a>
      <a-menu slot="overlay" class="ant-pro-drop-down menu">
        <a-menu-item v-for="team in teams" :key="team.teamId" @click="handleTeamChange(team)">
          {{ team.teamName }}
        </a-menu-item>
        <a-menu-item @click="handleTeamCreate">
          <a-icon type="plus" />
          <span>创建新团队</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a v-else class="create-team-box" @click="handleTeamCreate">
      <span>创建新团队</span>
    </a>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import store from '../../store'
import { mapMutations } from 'vuex'
export default {
  name: 'TeamSelector',
  computed: {
    ...mapGetters(['username', 'teamName', 'teams', 'teamId', 'isCreatingTeam']),
  },
  methods: {
    ...mapActions(['queryTeam', 'queryTeamKB']),
    ...mapMutations(['TOGGLE_CREATING_TEAM']),
    async handleTeamChange(team) {
      this.$router.push({
        name: 'projectList',
        query: {
          teamId: team.teamId,
        },
      })
    },
    handleTeamCreate() {
      this.TOGGLE_CREATING_TEAM(true)
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

.create-team-box {
  display: flex;
  align-items: center;
}
</style>

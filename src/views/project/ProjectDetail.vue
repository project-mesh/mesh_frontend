<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-card
      style="width: 100%"
      :bordered="false"
      :tab-list="tabListNoTitle"
      :active-tab-key="activeKey"
      @tabChange="(key) => handleTabChange(key)"
    >
      <router-link slot="tabBarExtraContent" :to="{ name: 'projectList', query: { teamId } }">
        返回项目列表
      </router-link>
      <router-view @load="activeKey = $event" />
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tabListNoTitle: [
        { key: 'bulletins', tab: '公告' },
        { key: 'taskList', tab: '列表' },
        { key: 'taskBoard', tab: '看板' },
        { key: 'projectRepo', tab: '知识库' },
        { key: 'statistics', tab: '统计' },
      ],
      activeKey: 'taskList',
    }
  },
  computed: {
    ...mapGetters(['username', 'teamId', 'projectId']),
  },
  mounted() {},
  methods: {
    handleTabChange(key) {
      this.activeKey = key
      this.$router.push({ name: key, query: { teamId: this.teamId, projectId: this.projectId } })
    },
  },
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;
}
</style>

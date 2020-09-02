<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <app-page v-if="noTitleKey === 'project'"></app-page>
          <project-page v-else-if="noTitleKey === 'app'"></project-page>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>

  import { AppPage, ProjectPage } from './page'

  import { mapGetters } from 'vuex'

  export default {
    components: {
      AppPage,
      ProjectPage
    },
    data () {
      return {
        tags: ['很有想法的', '专注设计', '辣~', '大长腿', '川妹子', '海纳百川'],

        tagInputVisible: false,
        tagInputValue: '',

        teams: [],
        teamSpinning: true,

        tabListNoTitle: [
          {
            key: 'app',
            tab: '公告'
          },
          {
            key: 'project',
            tab: '项目(8)'
          }
        ],
        noTitleKey: 'app'
      }
    },
    computed: {
      ...mapGetters(['nickname', 'avatar'])
    },
    mounted () {
      this.getTeams()
    },
    methods: {
      getTeams () {
        this.$http.get('/workplace/teams').then(res => {
          this.teams = res.result
          this.teamSpinning = false
        })
      },

      handleTabChange (key, type) {
        this[type] = key
      },

      handleTagClose (removeTag) {
        const tags = this.tags.filter(tag => tag !== removeTag)
        this.tags = tags
      },

      showTagInput () {
        this.tagInputVisible = true
        this.$nextTick(() => {
          this.$refs.tagInput.focus()
        })
      },

      handleInputChange (e) {
        this.tagInputValue = e.target.value
      },

      handleTagInputConfirm () {
        const inputValue = this.tagInputValue
        let tags = this.tags
        if (inputValue && !tags.includes(inputValue)) {
          tags = [...tags, inputValue]
        }

        Object.assign(this, {
          tags,
          tagInputVisible: false,
          tagInputValue: ''
        })
      }
    }
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

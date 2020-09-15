<template>
  <a-card style="margin-top: 24px" :bordered="false" :title="teamName">
    <div class="admin-info">
      <div>管理员：{{ teamAdminName }}</div>
      <div>创建时间：{{ year }}年{{ month }}月{{ day }}日</div>
    </div>
    <div class="operate">
      <a-button
        type="dashed"
        style="width: 100%"
        icon="plus"
        class="add-member"
        @click="modalVisible = true"
      >
        邀请成员
      </a-button>
    </div>
    <a-list size="large">
      <a-list-item
        :key="index"
        v-for="(item, index) in teamMembers"
        :class="{ changeColor: index % 2 === 0, changeWidth: index % 2 === 1 }"
      >
        <div class="avator-card">
          <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
          <a-popover title="成员任务">
            <a-list
              v-if="teamMemberTask(item.username).length"
              size="small"
              slot="content"
              :data-source="teamMemberTask(item.username)"
            >
              <a-list-item slot="renderItem" slot-scope="task">
                <router-link
                  :to="{ name: 'statistics', query: { teamId, projectId: task.projectId } }"
                >
                  {{ task.taskName }}
                </router-link>
              </a-list-item>
            </a-list>
            <span v-else slot="content">该成员暂无任务</span>
            <a style="margin-left: 10px">{{ item.username }}</a>
          </a-popover>
        </div>
        <div class="list-content">
          <div class="list-content-item">
            <p>{{ item.username === teamAdminName ? '管理员' : '组员' }}</p>
          </div>
        </div>
      </a-list-item>
    </a-list>
    <a-modal
      v-model="modalVisible"
      title="邀请新成员"
      width="500px"
      centered
      @cancel="hideModal"
      @ok="handleOk"
      :ok-button-props="{
        props: {
          disabled: !selectedUsername,
          loading: inviting,
        },
      }"
    >
      <a-form :form="form">
        <a-input-search
          placeholder="输入关键词以搜索用户"
          enter-button
          v-model="keyword"
          @search="onSearch"
        />
        <div v-if="userListVisible" class="scroll-container">
          <div v-if="loading" class="loading-container">
            <a-spin />
          </div>
          <a-radio-group v-else-if="users.length" v-model="selectedUsername">
            <a-radio
              v-for="user in users"
              :key="user.username"
              :style="radioStyle"
              :value="user.username"
              :disabled="isTeamMember(user)"
            >
              <a-avatar size="small" :src="user.avatar" />
              <span style="margin-left: 10px; vertical-align: baseline">{{ user.username }}</span>
            </a-radio>
          </a-radio-group>
          <div v-else style="color: red; text-align: center">无匹配用户</div>
        </div>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'
export default {
  name: 'StandardList',
  mixins: [teamMixin],
  data() {
    return {
      // data,
      status: 'all',
      year: null,
      month: null,
      day: null,
      modalVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      form: this.$form.createForm(this),
      users: [],
      userListVisible: false,
      loading: false,
      keyword: '',
      selectedUsername: '',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      inviting: false,
    }
  },
  computed: {
    ...mapGetters([
      'username',
      'teamMembers',
      'teamAdminName',
      'teamName',
      'teamCreateTime',
      'teams',
      'teamId',
      'teamTasks',
    ]),
  },
  methods: {
    ...mapActions(['queryUser', 'joinTeam']),
    addmember() {},
    dateChange(timeDate) {
      var date = new Date(timeDate) //获取一个时间对象
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.day = date.getDate()
    },
    isTeamMember(user) {
      return this.teamMembers.findIndex((member) => member.username === user.username) !== -1
    },
    onSearch() {
      this.userListVisible = true
      this.loading = true
      this.queryUser({
        username: this.username,
        keyword: this.keyword,
      })
        .then((res) => {
          const { data } = res
          console.log('onSearch', data)
          this.users = data.users
        })
        .finally(() => {
          this.loading = false
        })
    },
    hideModal() {
      this.modalVisible = false
      this.userListVisible = false
      this.loading = false
      this.users = []
    },
    handleOk() {
      this.inviting = true
      this.joinTeam({
        teamId: this.teamId,
        username: this.selectedUsername,
      })
        .then(() => {
          console.log('邀请新成员成功')
        })
        .catch((err) => {
          this.$notification.error({
            message: '邀请新成员失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.inviting = false
          this.selectedUsername = ''
          this.hideModal()
        })
    },
    teamMemberTask(username) {
      return this.teamTasks.filter((task) => task.principal === username)
    },
  },
  mounted() {
    if (!this.teams || this.teams.length === 0) {
      this.$router.replace({ name: 'noTeam' })
    }
  },
  created() {
    this.dateChange(this.teamCreateTime)
  },
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}
.admin-info {
  padding-bottom: 10px;
}
.avator-card {
  padding-left: 20px;
}
.ant-card {
  width: 90%;
  margin-left: 5%;
}
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  padding-right: 20px;
  span {
    line-height: 20px;
  }
  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
.ant-list-item-meta-title {
  margin-top: 1.25%;
  width: 125px;
}
.ant-list-item-meta-content {
  width: 150px;
}
.changeColor {
  background-color: #f0f0f0;
}
.changeWidth {
  background-color: #ffffff;
}
.ant-btn-link {
  margin-right: 200px;
}
.add-member {
  margin-bottom: 10px;
}

.scroll-container {
  overflow: auto;
  padding: 8px 24px;
  max-height: 300px;
  position: relative;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 20px;
  left: 0;
  text-align: center;
}
</style>

<template>
  <a-card style="margin-top: 24px" :bordered="false">
    <template slot="title">
      <div>
        <slot name="title">
          <editable-cell
            :text="teamName"
            :editing="teamNameEditing"
            :validators="[[isNotEmpty, '团队名不能为空']]"
            @change="handleRename($event)"
            @editStatusChange="handleEditStatusChange($event)"
          >
            <span>{{ teamName }}</span>
          </editable-cell>
        </slot>
      </div>
    </template>
    <div class="admin-info">
      <div style="display: inline">管理员：{{ teamAdminName }}</div>
      <div style="display: inline; margin-left: 5%">
        创建时间：{{ year }}年{{ month }}月{{ day }}日
      </div>
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

    <a-table
      :columns="columns"
      row-key="username"
      :data-source="teamMembers"
      :pagination="pagination(teamMembers)"
      @change="onChange"
    >
      <template slot="username" slot-scope="text, item">
        <a-avatar shape="circle" :src="item.avatar" />
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
      </template>
      <template slot="job" slot-scope="text, item">
        <p>{{ item.username === teamAdminName ? '管理员' : '组员' }}</p>
      </template>
    </a-table>
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
import pagination from '@/utils/mixins/paginationMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import EditableCell from './EditableCell'

export default {
  name: 'StandardList',
  mixins: [teamMixin, paginationMixin],
  components: {
    EditableCell,
  },
  data() {
    return {
      status: 'all',
      year: null,
      month: null,
      day: null,
      modalVisible: false,
      teamNameEditing: false,
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
    columns() {
      const columns = [
        {
          title: '成员',
          dataIndex: 'username',
          key: 'username',
          scopedSlots: { customRender: 'username' },
          ellipsis: true,
          sorter: (a, b) => a.username < b.username,
        },
        {
          title: '职位',
          key: 'job',
          scopedSlots: { customRender: 'job' },
          ellipsis: true,
          filters: [
            {
              text: '管理员',
              value: '管理员',
            },
            {
              text: '组员',
              value: '组员',
            },
          ],
          onFilter: (value, record) => {
            if (value == '管理员') {
              return record.username === this.teamAdminName
            } else {
              return record.username !== this.teamAdminName
            }
          },
        },
      ]
      return columns
    },
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
          if (data.isSuccess) {
            this.users = data.users
          }
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
    handleRename(value) {
      console.log(value)
    },
    handleEditStatusChange(value) {
      console.log(value)
    },
    teamMemberTask(username) {
      return this.teamTasks.filter((task) => task.principal === username)
    },
    onChange(pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter)
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

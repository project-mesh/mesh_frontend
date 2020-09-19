<template>
  <a-card style="margin-top: 24px" :bordered="false">
    <template slot="title">
      <div>
        <slot name="title">
          <editable-cell
            :text="teamName"
            :editing="teamNameEditing"
            :validators="[[isNotEmpty, '团队名不能为空']]"
            :disabled="username !== teamAdminName"
            @change="handleRename($event)"
            @editStatusChange="handleEditStatusChange"
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
      <a-popconfirm :title="quitMsg">
        <a-icon slot="icon" type="warning" style="color: red" />
        <a-button type="danger" class="quitBtn">
          <a-icon :type="quitIcon" />
          {{ quitName }}
        </a-button>
      </a-popconfirm>
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
              <router-link :to="{ name: 'taskList', query: { teamId, projectId: task.projectId } }">
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
      <span slot="action" slot-scope="text, item, index">
        <a-popconfirm title="是否要移除此成员？" @confirm="deleteKB(item, index)">
          <a-tooltip title="移除成员">
            <a-icon
              type="user-delete"
              class="removeIcon"
              style="font-size: 23px"
              :disabled="!isAdminButNotHimself(item)"
            />
          </a-tooltip>
        </a-popconfirm>
      </span>
    </a-table>
    <a-modal
      v-model="modalVisible"
      title="邀请新成员"
      width="500px"
      centered
      @cancel="hideModal"
      @ok="handleInviteUsers"
      :ok-button-props="{
        props: {
          disabled: !selectedUsers || selectedUsers.length === 0,
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
          <a-select
            mode="multiple"
            v-else-if="users.length"
            placeholder="添加你想邀请的成员"
            v-model="selectedUsers"
            style="width: 100%"
          >
            <a-select-option
              v-for="user in users"
              :key="user.username"
              :value="user.username"
              :disabled="isTeamMember(user)"
            >
              <a-avatar size="small" :src="user.avatar" />
              <span style="margin-left: 10px; vertical-align: baseline">{{ user.username }}</span>
            </a-select-option>
          </a-select>
          <div v-else style="color: red; text-align: center">无匹配用户</div>
        </div>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import EditableCell from './EditableCell'
import validator from 'validator'
import { getUserAvatar } from '../../utils/oss'
export default {
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
      quitName: '解散团队',
      quitIcon: 'close-square',
      quitMsg: '确定要解散团队吗？',
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
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      inviting: false,
      selectedUsers: [],
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
          sorter: (a, b) => (a.username < b.username ? 1 : -1),
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
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          ellipsis: true,
          align: 'right',
          width: 60,
        },
      ]
      return columns
    },
  },
  methods: {
    ...mapActions(['queryUser', 'joinTeam', 'updateTeam', 'inviteMember']),
    addmember() {},
    isAdminButNotHimself(chosedUser) {
      return this.username === this.teamAdminName && chosedUser.username !== this.teamAdminName
    },
    dateChange(timeDate) {
      const date = new Date(timeDate) //获取一个时间对象
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
          getUserAvatar(data.users[0].username)
            .then((ret) => {
              data.users[0].avatar = ret
            })
            .catch((err) => {
              console.log('error in onSearch avatar:', err)
            })
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
    handleInviteUsers() {
      this.inviting = true

      if (!this.selectedUsers || this.selectedUsers.length === 0) return this.hideModal()

      const promises = []

      this.selectedUsers.forEach((username) =>
        promises.push(
          this.inviteMember({
            inviteName: username,
            teamId: this.teamId,
            username: this.username,
          })
        )
      )

      if (promises.length) {
        return Promise.all(promises)
          .then((res) => {
            console.log('add team members success!, new members: ', this.selectedUsers)
            this.$notification.success({
              message: '成功添加新成员',
            })
          })
          .catch((err) => {
            this.$notification.error({
              message: '添加新团队成员失败',
            })
          })
          .finally(() => {
            this.queryTeam({
              username: this.username,
              teamId: this.teamId,
            })
              .then((res) => {
                this.$notification.success({
                  message: '成功更新团队',
                })
              })
              .catch((err) => {
                this.$notification.error({
                  message: '更新团队失败',
                })
              })
            this.inviting = false
            this.hideModal()
          })
      }

      this.inviting = false
      this.hideModal()
    },
    handleRename(value) {
      console.log(value)
      this.updateTeam({
        username: this.username,
        teamId: this.teamId,
        teamName: value,
      })
        .then((res) => {
          console.log('rename team success')
        })
        .catch((err) => {
          this.$notification.error({
            message: 'rename team failed',
            description: err.msg,
          })
        })
        .finally(() => {
          this.teamNameEditing = false
        })
    },
    handleEditStatusChange($event) {
      this.teamNameEditing = $event
    },
    teamMemberTask(username) {
      return this.teamTasks.filter((task) => task.principal === username)
    },
    isNotEmpty(value) {
      return !validator.isEmpty(value, { ignore_whitespace: true })
    },
    onChange(pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter)
    },
    deleteKB(teammate) {
      console.log(teammate)
    },
  },
  mounted() {
    if (!this.teams || this.teams.length === 0) {
      this.$router.replace({ name: 'noTeam' })
    }
  },
  created() {
    this.dateChange(this.teamCreateTime)
    if (this.username !== this.teamAdminName) {
      this.quitName = '退出团队'
      this.quitIcon = 'user-delete'
      this.quitMsg = '确定要退出团队吗？'
    }
  },
}
</script>

<style lang="less" scoped>
.quitBtn {
  float: right;
  margin-bottom: 0.3%;
}
.removeIcon:hover {
  color: red;
}
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

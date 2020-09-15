<template>
  <div>
    <div class="invite-group">
      <!-- 邀请成员 -->
      <a-select
        class="invite-member"
        mode="multiple"
        placeholder="添加你想邀请的成员"
        :value="selectedItems"
        @change="handleMemberChange"
      >
        <a-select-option
          v-for="item in this.teamMembers"
          :key="item.username"
          :value="item.username"
        >
          {{ item.username }}
        </a-select-option>
      </a-select>
      <a-button type="primary" shape="circle" icon="usergroup-add" />
    </div>
    <a-table
      :columns="columns"
      row-key="username"
      :data-source="teamMembers"
      :pagination="pagination(teamMembers)"
      @change="onChange"
    >
      <span slot="username" slot-scope="text, item">
        <a-avatar shape="circle" :src="item.avatar" />
        <a-popover title="成员任务">
          <a-list
            v-if="projectMemberTask(item.username).length"
            size="small"
            slot="content"
            :data-source="projectMemberTask(item.username)"
          >
            <a-list-item slot="renderItem" slot-scope="task">
              <router-link
                :to="{ name: 'taskBoard', query: { teamId, projectId: task.projectId } }"
              >
                {{ task.taskName }}
              </router-link>
            </a-list-item>
          </a-list>
          <span v-else slot="content">该成员暂无任务</span>
          <a style="margin-left: 10px">{{ item.username }}</a>
        </a-popover>
      </span>
      <span slot="job" slot-scope="text, item">
        <p>{{ item.username === teamAdminName ? '管理员' : '组员' }}</p>
      </span>
    </a-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'
import pagination from '@/utils/mixins/paginationMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
export default {
  name: 'StandardList',
  mixins: [teamMixin, paginationMixin],
  data() {
    return {
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
      selectedItems: [], //选中的成员名单
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
    handleMemberChange(selectedItems) {
      this.selectedItems = selectedItems
    },
    handleInviteMember() {
      console.log(this.selectedItems)
      if (!this.selectedItems || this.selectedItems.length === 0) return this.hideInviteForm()
      const promises = []
      this.selectedItems.forEach((username) =>
        promises.push(
          this.joinProject({
            username,
            teamId: this.teamId,
            projectId: this.selectedUpdatePrj.projectId,
          })
        )
      )
      if (promises.length) {
        return Promise.all(promises)
          .then(() => {
            console.log('add project members success!, new members: ', this.selectedItems)
          })
          .catch((err) => {
            this.$notification.error({
              message: '成功添加新项目成员',
              description: err.message,
            })
          })
          .finally(() => {
            this.hideInviteForm()
          })
      }
      this.hideInviteForm()
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
    projectMemberTask(username) {
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

<style scoped>
.invite-group {
  width: 68%;
  display: flex;
  justify-content: space-between;
}
.invite-member {
  margin-bottom: 10px;
  width: 700px;
}
</style>

<template>
  <div>
    <div id="userQueryTitle">搜索用户关键词</div>
    <div class="ant-pro-page-header-search">
      <a-input-search size="large" style="width: 80%; max-width: 522px" @search="onKeywordSearch">
        <template v-slot:enterButton>搜索</template>
      </a-input-search>
    </div>
    <div id="userShowTitle">搜索结果</div>
    <a-table :columns="columns" :data-source="data" id="userQueryShowTable" bordered>
      <template slot="avatar" slot-scope="avatar">
        <a-avatar :key="avatar">
          {{ avatar }}
        </a-avatar>
      </template>
      <template
        v-for="col in [
          'nickname',
          'gender',
          'birthday',
          'address',
          'status',
          'description',
          'password',
        ]"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="record.editable && col !== 'password'"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.username, col)"
          />
          <a-input
            v-else-if="record.changingPassword && col === 'password'"
            style="margin: -5px 0"
            value=""
            @change="(e) => handlePasswordChange(e.target.value)"
          />
          <template v-else-if="col !== 'password'">
            {{ text }}
          </template>
          <template v-else>********</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable || record.changingPassword">
            <a @click="() => save(record.username)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定要取消吗？" @confirm="() => cancel(record.username)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.username)">编辑</a>
            <a-divider type="vertical" />
            <a :disabled="editingKey !== ''" @click="() => changePassword(record.username)">
              修改密码
            </a>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: '9%',
    scopedSlots: { customRender: 'username' },
    align: 'center',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: '6%',
    scopedSlots: { customRender: 'avatar' },
    align: 'center',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: '10%',
    scopedSlots: { customRender: 'nickname' },
    align: 'center',
  },
  {
    title: '密码',
    dataIndex: 'password',
    width: '8%',
    scopedSlots: { customRender: 'password' },
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '8%',
    scopedSlots: { customRender: 'gender' },
    align: 'center',
  },
  {
    title: '生日',
    dataIndex: 'birthday',
    width: '10%',
    scopedSlots: { customRender: 'birthday' },
    align: 'center',
  },
  {
    title: '位置',
    dataIndex: 'address',
    width: '10%',
    scopedSlots: { customRender: 'address' },
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '10%',
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '个人签名',
    dataIndex: 'description',
    width: '15%',
    scopedSlots: { customRender: 'description' },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
]

const data = []
import { mapActions } from 'vuex'

export default {
  components: {},
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    this.cachePassword = ''
    return {
      data,
      columns,
      editingKey: '',
    }
  },
  computed: {},
  mounted() {},
  methods: {
    ...mapActions(['queryUsers', 'updateUserPasswordAdmin']),
    onKeywordSearch(value) {
      this.queryUsers({ keyword: value })
        .then((response) => {
          data.splice(0, data.length)
          let queryUser
          for (queryUser in response.data) {
            data.push({
              username: queryUser.username,
              avatar: queryUser.avatar,
              nickname: queryUser.nickname,
              gender: queryUser.gender,
              birthday: queryUser.birthday,
              address: queryUser.address,
              status: queryUser.status,
              description: queryUser.description,
            })
          }
        })
        .catch((error) => {
          this.$notification.error({
            message: '搜索关键词失败',
            description: `${error.name}: ${error.message}`,
          })
        })
    },
    handleChange(value, username, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => username === item.username)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handlePasswordChange(value) {
      this.cachePassword = value
    },
    edit(username) {
      const newData = [...this.data]
      const target = newData.filter((item) => username === item.username)[0]
      this.editingKey = username
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    changePassword(username) {
      const newData = [...this.data]
      const target = newData.filter((item) => username === item.username)[0]
      this.editingKey = username
      if (target) {
        target.changingPassword = true
        this.data = newData
      }
    },
    save(username) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => username === item.username)[0]
      const targetCache = newCacheData.filter((item) => username === item.username)[0]
      if (target.editable) {
        if (target && targetCache) {
          this.updateUserInformation({
            username: username,
            nickname: newCacheData.nickname,
            gender: newCacheData.gender,
            birthday: newCacheData.birthday,
            address: newCacheData.address,
            status: newCacheData.status,
            description: newCacheData.description,
          }).catch((error) => {
            this.$notification.error({
              message: '修改信息失败',
              description: `${error.name}: ${error.message}`,
            })
          })
          delete target.editable
          this.data = newData
          Object.assign(targetCache, target)
          this.cacheData = newCacheData
        }
        this.editingKey = ''
      } else {
        this.updateUserPasswordAdmin({ username: username, password: this.cachePassword }).catch(
          (error) => {
            this.$notification.error({
              message: '修改密码失败',
              description: `${error.name}: ${error.message}`,
            })
          }
        )
        this.cachePassword = ''
        delete target.changingPassword
        this.data = newData
      }
    },
    cancel(username) {
      const newData = [...this.data]
      const target = newData.filter((item) => username === item.username)[0]
      this.editingKey = ''
      if (target.editable) {
        if (target) {
          Object.assign(target, this.cacheData.filter((item) => username === item.username)[0])
          delete target.editable
          this.data = newData
        }
      } else {
        this.cachePassword = ''
        delete target.changingPassword
        this.data = newData
      }
    },
  },
}
</script>

<style scoped>
.ant-pro-page-header-search {
  text-align: center;
  margin-bottom: 16px;
}
#userQueryTitle,
#userShowTitle {
  font-weight: bold;
  font-size: 125%;
  margin: 1em;
}
#userQueryShowTable {
  margin: 1em;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>

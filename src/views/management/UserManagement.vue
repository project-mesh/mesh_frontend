<template>
  <div>
    <div id="userQueryTitle">搜索用户关键词</div>
    <div class="ant-pro-page-header-search">
      <a-input-search size="large" style="width: 80%; max-width: 522px" @search="onKeywordSearch">
        <template v-slot:enterButton>搜索</template>
      </a-input-search>
    </div>
    <div id="userShowTitle">搜索结果</div>
    <a-table
      :columns="columns"
      :data-source="data"
      :row-key="'username'"
      id="userQueryShowTable"
      bordered
    >
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

const genderConvert = (gender) => {
  const genderMap = {
    1: '男',
    男: 1,
    0: '女',
    女: 0,
    '-1': '',
  }

  if (gender in genderMap) return genderMap[gender]

  return -1
}

const statusConvert = (status) => {
  const statusMap = {
    0: '',
    1: '摸鱼',
    2: '会议',
    3: '生病',
    4: '休假',
    5: '出差',
    6: '在家',
    7: '运动',
    8: '游戏',
    '': 0,
    摸鱼: 1,
    会议: 2,
    生病: 3,
    休假: 4,
    出差: 5,
    在家: 6,
    运动: 7,
    游戏: 8,
  }

  if (status in statusMap) return statusMap[status]

  return 0
}

import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  components: {},
  data() {
    return {
      data: [],
      cacheData: [],
      cachePassword: '',
      columns,
      editingKey: '',
    }
  },
  computed: {
    ...mapGetters(['username']),
  },
  mounted() {},
  methods: {
    ...mapActions(['queryUserInfo', 'updateUserPasswordAdmin', 'updateUserInfo']),
    onKeywordSearch(value) {
      this.queryUserInfo({ keyword: value, username: this.username })
        .then((res) => {
          this.data.length = 0
          res.data.users.forEach((queryUser) => {
            this.data.push({
              username: queryUser.username,
              avatar: queryUser.avatar,
              nickname: queryUser.nickname,
              gender: genderConvert(queryUser.gender),
              birthday: queryUser.birthday,
              address: queryUser.address,
              status: statusConvert(queryUser.status),
              description: queryUser.description,
            })
          })

          this.cacheData = _.cloneDeep(this.data)
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
      const target = newData.find((item) => username === item.username)
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
      const target = newData.find((item) => username === item.username)
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
      const target = newData.find((item) => username === item.username)
      const targetCache = newCacheData.find((item) => username === item.username)
      if (target.editable) {
        if (target && targetCache) {
          this.updateUserInfo({
            username,
            nickname: target.nickname,
            gender: genderConvert(target.gender),
            birthday: target.birthday,
            address: target.address,
            status: statusConvert(target.status),
            description: target.description,
          })
            .then((res) => {
              console.log('updateUserInfomation success, response: ', res)
            })
            .catch((err) => {
              this.$notification.error({
                message: '修改信息失败',
                description: `${err.name}: ${err.message}`,
              })
            })
          delete target.editable
          this.data = newData
          Object.assign(targetCache, target)
          this.cacheData = newCacheData
        }
      } else {
        this.updateUserPasswordAdmin({ username, password: this.cachePassword })
          .then((res) => {
            console.log('updateUserPasswordAdmin success, response: ', res)
          })
          .catch((err) => {
            this.$notification.error({
              message: '修改密码失败',
              description: `${err.name}: ${err.message}`,
            })
          })
        this.cachePassword = ''
        delete target.changingPassword
        this.data = newData
      }

      this.editingKey = ''
    },
    cancel(username) {
      const newData = [...this.data]
      const target = newData.find((item) => username === item.username)
      this.editingKey = ''
      if (target.editable) {
        if (target) {
          Object.assign(
            target,
            this.cacheData.find((item) => username === item.username)
          )
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

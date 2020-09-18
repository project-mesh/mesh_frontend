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
        <a-avatar :key="avatar" :src="avatar" />
      </template>
      <template
        v-for="col in ['nickname', 'gender', 'birthday', 'address', 'status', 'password']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col">
          <a-input
            v-if="
              record.editable &&
              col !== 'password' &&
              col !== 'status' &&
              col !== 'gender' &&
              col !== 'address'
            "
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
          <a-select
            v-else-if="record.editable && col === 'status'"
            :default-value="String(record.status)"
            @change="handleChange(Number($event), record.username, col)"
          >
            <a-select-option value="1">
              <icon-font type="icon-yao" />
              生病难受中
            </a-select-option>
            <a-select-option value="2">
              <icon-font type="icon-xiujia" />
              休假充电中
            </a-select-option>
            <a-select-option value="3">
              <icon-font type="icon-zengjiicon" />
              努力工作中
            </a-select-option>
            <a-select-option value="4">
              <icon-font type="icon-icon-00FC" />
              在家办公中
            </a-select-option>
            <a-select-option value="5">
              <icon-font type="icon-yu-" />
              持续摸鱼中
            </a-select-option>
            <a-select-option value="6">
              <icon-font type="icon-feiji" />
              出差奔波中
            </a-select-option>
            <a-select-option value="7">
              <icon-font type="icon-game" />
              愉快游戏中
            </a-select-option>
          </a-select>
          <a-select
            v-else-if="record.editable && col === 'gender'"
            :default-value="String(record.gender)"
            @change="handleChange(Number($event), record.username, col)"
          >
            <a-select-option value="1">男</a-select-option>
            <a-select-option value="2">女</a-select-option>
            <a-select-option value="0">未知</a-select-option>
          </a-select>
          <a-cascader
            v-else-if="record.editable && col === 'address'"
            :options="city"
            :default-value="splitAddress(record.address)"
            @change="handleAddressChange($event, record.username)"
          />
          <template v-else-if="col !== 'password' && col !== 'status' && col !== 'gender'">
            {{ text }}
          </template>
          <template v-else-if="col === 'status'">
            <icon-font :type="getStatusType(record.status)" />
            {{ getStatusText(record.status) }}
          </template>
          <template v-else-if="col === 'gender'">
            {{ getGenderText(record.gender) }}
          </template>
          <template v-else>********</template>
        </div>
      </template>
      <template slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="record.description"
          @change="(e) => handleChange(e.target.value, record.username, 'description')"
        />
        <template v-else>个人签名：{{ record.description }}</template>
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
    width: '12%',
    scopedSlots: { customRender: 'birthday' },
    align: 'center',
  },
  {
    title: '位置',
    dataIndex: 'address',
    width: '15%',
    scopedSlots: { customRender: 'address' },
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '12%',
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
  },
]

import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import { Icon } from 'ant-design-vue'
import allCity from '../account/settings/cities.js'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2053325_5hl9fgurem.js',
})

export default {
  components: {
    IconFont,
  },
  data() {
    return {
      city: [],
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
    splitAddress(address) {
      let oriStr = address
      let resStr = oriStr.split(' ')
      return resStr
    },
    getStatusType(status) {
      switch (status) {
        case 1:
          return 'icon-yao'
        case 2:
          return 'icon-xiujia'
        case 3:
          return 'icon-zengjiicon'
        case 4:
          return 'icon-icon-00FC'
        case 5:
          return 'icon-yu-'
        case 6:
          return 'icon-feiji'
        case 7:
          return 'icon-game'
        default:
          return 'icon-error'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 1:
          return '生病难受中'
        case 2:
          return '休假充电中'
        case 3:
          return '努力工作中'
        case 4:
          return '在家办公中'
        case 5:
          return '持续摸鱼中'
        case 6:
          return '出差奔波中'
        case 7:
          return '愉快游戏中'
        default:
          return 'Wrong Status'
      }
    },
    getGenderText(gender) {
      switch (gender) {
        case 1:
          return '男'
        case 2:
          return '女'
        case 0:
          return '未知'
        default:
          return 'Wrong Gender'
      }
    },
    onKeywordSearch(value) {
      if (value === '') {
        this.$notification.error({
          message: '搜索关键词失败',
          description: '不支持搜索空的关键词',
        })
        return undefined
      }
      this.queryUserInfo({ keyword: value, username: this.username })
        .then((res) => {
          //不要把下面这句代码改成this.data.length = 0，会导致列表不被正确清空
          this.data.splice(0, this.data.length)
          this.editingKey = ''
          this.cacheData = []
          this.cachePassword = ''
          res.data.users.forEach((queryUser) => {
            this.data.push({
              username: queryUser.username,
              avatar: queryUser.avatar,
              nickname: queryUser.nickname,
              gender: queryUser.gender,
              birthday: queryUser.birthday,
              address: queryUser.address,
              status: queryUser.status,
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
    handleAddressChange(value, username) {
      const newData = [...this.data]
      const target = newData.find((item) => username === item.username)
      if (target) {
        target['address'] = value[0] + ' ' + value[1] + ' ' + value[2]
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
    checkValidBirthday(birthdayString) {
      let oriStr = birthdayString
      let dateStr = oriStr.split('-')
      let yearNum = parseInt(dateStr[0])
      let monthNum = parseInt(dateStr[1])
      let dayNum = parseInt(dateStr[2])
      let checkDate = new Date(yearNum, monthNum - 1, dayNum)
      if (
        yearNum === checkDate.getFullYear() &&
        monthNum === checkDate.getMonth() + 1 &&
        dayNum === checkDate.getDate()
      ) {
        return true
      } else {
        return false
      }
    },
    save(username) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.find((item) => username === item.username)
      const targetCache = newCacheData.find((item) => username === item.username)
      if (!this.checkValidBirthday(target.birthday)) {
        this.$notification.error({
          description: '请输入yyyy-mm-dd格式的生日，且日期真实存在。',
        })
        return undefined
      }
      if (target.editable) {
        if (target && targetCache) {
          this.updateUserInfo({
            username,
            nickname: target.nickname,
            gender: target.gender,
            birthday: target.birthday,
            address: target.address,
            status: target.status,
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
  async created() {
    this.city = Object.freeze(allCity.city)
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

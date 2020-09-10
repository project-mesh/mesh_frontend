<template>
  <a-card style="margin-top: 24px" :bordered="false" :title="teamName">
    <div class="admin-info">
      <div>管理员：{{ teamAdminName }}</div>
      <div>创建时间：{{ year }}年{{ month }}月{{ day }}日</div>
    </div>
    <div class="operate">
      <a-button type="dashed" style="width: 100%" icon="plus" class="add-member" @click="addmember">
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
          <a-popover title="成员信息">
            <template slot="content">
              <p>{{ item.username }}</p>
              <p>{{ item.username }}</p>
            </template>
            <a-button type="link">{{ item.username }}</a-button>
          </a-popover>
        </div>
        <div class="list-content">
          <div class="list-content-item">
            <p>{{ item.username === teamAdminName ? '管理员' : '组员' }}</p>
          </div>
        </div>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from './module/TaskForm'
import ChangeForm from './module/ChangeForm'
import Info from './components/Info'
import { mapGetters } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'
export default {
  name: 'StandardList',
  components: {
    TaskForm,
    Info,
  },
  mixins: [teamMixin],
  data() {
    return {
      // data,
      status: 'all',
      year: null,
      month: null,
      day: null,
    }
  },
  computed: {
    ...mapGetters(['teamMembers', 'teamAdminName', 'teamName', 'teamCreateTime']),
  },
  methods: {
    addmember() {
      this.$dialog(
        TaskForm,
        {
          record: {},
          on: {
            ok() {
              console.log('ok 回调')
            },
            cancel() {
              console.log('cancel 回调')
            },
            close() {
              console.log('modal close 回调')
            },
          },
        },
        // modal props
        {
          title: '邀请成员',
          width: 700,
          centered: true,
          maskClosable: false,
        }
      )
    },
    edit(record) {
      console.log('record', record)
      this.$dialog(
        TaskForm,
        // component props
        {
          record,
          on: {
            ok() {
              console.log('ok 回调')
            },
            cancel() {
              console.log('cancel 回调')
            },
            close() {
              console.log('modal close 回调')
            },
          },
        },
        // modal props
        {
          title: '操作',
          width: 700,
          centered: true,
          maskClosable: false,
        }
      )
    },
    dateChange(timeDate) {
      var date = new Date(timeDate) //获取一个时间对象
      this.year = date.getFullYear()
      this.month = date.getMonth()
      this.day = date.getDate()
    },
    change() {
      this.$dialog(
        ChangeForm,
        // component props
        {
          record: {},
          on: {
            ok() {
              console.log('ok 回调')
            },
            cancel() {
              console.log('cancel 回调')
            },
            close() {
              console.log('modal close 回调')
            },
          },
        },
        // modal props
        {
          title: '修改团队',
          width: 700,
          centered: true,
          maskClosable: false,
        }
      )
    },
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
</style>

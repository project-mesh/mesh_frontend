<template>
  <a-card style="margin-top: 24px" :bordered="false" :title="teamName">
    <div slot="extra">
      <a-radio-group v-model="status"></a-radio-group>
      <a-button type="dashed" style="width: 100%" @click="change">修改团队</a-button>
    </div>

    <div class="operate">
      <a-button type="dashed" style="width: 100%" icon="plus" @click="addmember">邀请成员</a-button>
    </div>

    <a-list size="large">
      <a-list-item :key="index" v-for="(item, index) in teamMembers">
        <a-list-item-meta>
          <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
          <a slot="title">{{ item.username }}</a>
        </a-list-item-meta>
        <div class="list-content">
          <div class="list-content-item">
            <span>职位</span>
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
    }
  },
  computed: {
    ...mapGetters(['teamMembers', 'teamAdminName', 'teamName']),
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
          width: 400,
          height: 240,
          centered: true,
          maskClosable: false,
        }
      )
    },
  },
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}
.ant-card {
  width: 70%;
  margin-left: 15%;
}
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 40px;
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
div.list-content-item {
  margin-left: 200px;
}
</style>

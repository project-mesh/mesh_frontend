<template>
  <a-card style="margin-top: 24px;" :bordered="false" title="团队">
    <div slot="extra">
      <a-radio-group v-model="status">
      </a-radio-group>
    </div>

    <div class="operate">
      <a-button type="dashed" style="width: 100%" icon="plus" @click="add">新增人员</a-button>
    </div>

    <a-list size="large" :pagination="{showSizeChanger: false, showQuickJumper: false, pageSize: 10, total: 10}">
      <a-list-item :key="index" v-for="(item, index) in data">
        <a-list-item-meta >
          <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
          <a slot="title" >{{ item.title }}</a>
        </a-list-item-meta>
        <div slot="actions">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item><a @click="edit">编辑</a></a-menu-item>
              <a-menu-item><a @click="change">切换</a></a-menu-item>
            </a-menu>
            <a>更多<a-icon type="down"/></a>
          </a-dropdown>
        </div>
        <div class="list-content" >
          <div class="list-content-item">
            <span>职位</span>
            <p>{{ item.owner }}</p>
          </div>
          <div class="list-content-item">
            <span>标签</span>
            <p>{{ item.startAt }}</p>
          </div>

        </div>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
  // 演示如何使用 this.$dialog 封装 modal 组件
  import TaskForm from './module/TaskForm'
  import ChangeForm from './module/ChangeForm';
  import Info from './components/Info'
  const data = []
  data.push({
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    owner: '组长',
    startAt: '摸鱼小跟班',
    progress: {
      value: 90
    }
  })
  data.push({
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    owner: '组长',
    startAt: '摸鱼小跟班',
    progress: {
      value: 90
    }
  })
  data.push({
    title: 'Angular',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    owner: '组长',
    startAt: '摸鱼小组长',
    progress: {
      value: 54
    }
  })
  data.push({
    title: 'Ant Design',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    owner: '组长',
    startAt: '摸鱼小组长',
    progress: {
      value: 66
    }
  })
  data.push({
    title: 'Ant Design Pro',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    owner: '组长',
    startAt: '摸鱼小组长',
    progress: {
      value: 30
    }
  })
  data.push({
    title: 'Bootstrap',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    owner: '组长',
    startAt: '摸鱼小组长',
    progress: {
      status: 'exception',
      value: 100
    }
  })

  export default {
    name: 'StandardList',
    components: {
      TaskForm,
      Info
    },
    data () {
      return {
        data,
        status: 'all'
      }
    },
    methods: {
      add () {
        this.$dialog(TaskForm,
          // component props
          {
            record: {},
            on: {
              ok () {
                console.log('ok 回调')
              },
              cancel () {
                console.log('cancel 回调')
              },
              close () {
                console.log('modal close 回调')
              }
            }
          },
          // modal props
          {
            title: '新增',
            width: 700,
            centered: true,
            maskClosable: false
          })
      },
      edit (record) {
        console.log('record', record)
        this.$dialog(TaskForm,
          // component props
          {
            record,
            on: {
              ok () {
                console.log('ok 回调')
              },
              cancel () {
                console.log('cancel 回调')
              },
              close () {
                console.log('modal close 回调')
              }
            }
          },
          // modal props
          {
            title: '操作',
            width: 700,
            centered: true,
            maskClosable: false
          })
      },
      change () {
        this.$dialog(ChangeForm,
          // component props
          {
            record: {},
            on: {
              ok () {
                console.log('ok 回调')
              },
              cancel () {
                console.log('cancel 回调')
              },
              close () {
                console.log('modal close 回调')
              }
            }
          },
          // modal props
          {
            title: '切换',
            width: 400,
            height:240,
            centered: true,
            maskClosable: false
          })
      },
    }
  }
</script>

<style lang="less" scoped>
  .ant-avatar-lg {
    width: 48px;
    height: 48px;
    line-height: 48px;
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
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
  .ant-list-item-meta-title{
    margin-top: 1.25%;
    width:125px
  }
  .ant-list-item-meta-content{
    width:150px
  }
  div.list-content-item{
    margin-left: 200px;
  }
</style>

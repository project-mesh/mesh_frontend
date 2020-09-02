<template>
    <a-list size="large" :pagination="{showSizeChanger: false, showQuickJumper: false, pageSize: 10, total: 10}">
      <a-list-item :key="index" v-for="(item, index) in data">
        <a-list-item-meta >
          <a slot="title" >{{ item.title }}</a>
        </a-list-item-meta>
        <div slot="actions">
          <a-menu-item><a @click="xiugai">详情</a></a-menu-item>
        </div>
      </a-list-item>
    </a-list>
</template>

<script>
  import TaskForm from './module/News'
  const data = []
  data.push({
    title: '李老八',

  })
  data.push({
    title: '任冲',

  })
  data.push({
    title: '硅谷',
  })
  data.push({
    title: 'Ant Design',
  })
  data.push({
    title: 'Ant Design Pro',
  })
  data.push({
    title: 'Bootstrap',
  })

  export default {
    name: 'StandardList',
    data () {
      return {
        data,
        status: 'all'
      }
    },
    methods:{
      xiugai (record) {
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
            title: '公告详情',
            width: 700,
            centered: true,
            maskClosable: true
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  div.ant-col.ant-col-md-24.ant-col-lg-17
  {
    width:200px
  }
</style>


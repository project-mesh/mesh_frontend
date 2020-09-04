<template>
  <a-list
    size="large"
    :pagination="{ showSizeChanger: false, showQuickJumper: false, pageSize: 10, total: 10 }"
  >
    <a-list-item v-for="bulletin in bulletins" :key="bulletin.bulletinId">
      <a-list-item-meta>
        <a slot="title">{{ bulletin.bulletinName }}</a>
      </a-list-item-meta>
      <div slot="actions">
        <a-menu-item><a @click="modify(bulletin)">详情</a></a-menu-item>
      </div>
    </a-list-item>
  </a-list>
</template>

<script>
import TaskForm from './TaskForm'
import projectMixin from '@/utils/mixins/projectMixin'
import teamMixin from '@/utils/mixins/teamMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [teamMixin, projectMixin],
  name: 'StandardList',
  data() {
    return {
      status: 'all',
    }
  },
  computed: {
    ...mapGetters(['bulletins']),
  },
  methods: {
    modify(bulletin) {
      console.log('bulletin', bulletin)
      this.$dialog(
        TaskForm,
        // component props
        {
          record: bulletin,
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
          title: '公告详情',
          width: 700,
          centered: true,
          maskClosable: true,
        }
      )
    },
  },
}
</script>

<style lang="less" scoped>
div.ant-col.ant-col-md-24.ant-col-lg-17 {
  width: 200px;
}
</style>

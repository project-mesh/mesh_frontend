<template>
  <a-card :bordered="false" :loading="cardLoading">
    <div slot="extra">
      <a-button :disabled="username !== projectAdminName" type="primary" @click="newBulletin">
        发布新公告
        <a-icon type="notification" />
      </a-button>
    </div>
    <a-modal
      :width="700"
      centered
      :visible="visible"
      :confirm-loading="confirmLoading"
      title="编辑"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <TaskForm :record="selectedItem" ref="taskForm"></TaskForm>
    </a-modal>
    <a-modal
      :width="700"
      centered
      :visible="newVisible"
      :confirm-loading="newConfirmLoading"
      title="发布"
      @ok="handleNewOk"
      @cancel="handleNewCancel"
    >
      <NewForm :record="selectedItem" ref="newForm"></NewForm>
    </a-modal>
    <a-list
      size="large"
      :data-source="bulletinWithFormatedCreateTime"
      :pagination="pagination(bulletinWithFormatedCreateTime)"
    >
      <a-list-item slot="renderItem" slot-scope="bulletin, index" :key="bulletin.bulletinId">
        <a-list-item-meta :description="bulletin.description">
          <a slot="title">{{ bulletin.bulletinName }}</a>
        </a-list-item-meta>
        <div slot="actions">
          <a @click="edit(bulletin)">详情</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="removeBulletin(bulletin, index)">
            <a :disabled="username !== projectAdminName || deleteLoading[index]">删除</a>
          </a-popconfirm>
        </div>
        <div>{{ bulletin.createTimeDisplay }}</div>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import TaskForm from './TaskForm'
import NewForm from './NewForm'
import { formatDateByPattern } from '@/utils/dateUtil'
import projectMixin from '@/utils/mixins/projectMixin'
import teamMixin from '@/utils/mixins/teamMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  components: {
    TaskForm,
    NewForm,
  },
  mixins: [teamMixin, projectMixin, paginationMixin],
  data() {
    return {
      visible: false,
      confirmLoading: false,
      newVisible: false,
      newConfirmLoading: false,
      selectedItem: null,
      deleteLoading: [],
    }
  },
  computed: {
    ...mapGetters(['bulletins', 'username', 'projectAdminName']),
    bulletinWithFormatedCreateTime() {
      const formatedData = _.cloneDeep(this.bulletins)
      formatedData.forEach((bulletin) => {
        bulletin.createTimeDisplay = formatDateByPattern(
          new Date(Number(bulletin.createTime)),
          'yyyy-MM-dd hh:mm'
        )
      })

      return formatedData
    },
  },
  methods: {
    ...mapActions(['deleteBulletin']),
    edit(bulletin) {
      this.selectedItem = bulletin
      this.visible = true
    },
    newBulletin() {
      this.newVisible = true
    },
    removeBulletin(bulletin, index) {
      this.$set(this.deleteLoading, index, true)
      this.deleteBulletin({
        username: this.username,
        projectId: bulletin.projectId,
        bulletinId: bulletin.bulletinId,
      })
        .then(() => {
          this.$notification.success({
            message: '成功删除公告',
          })
          this.deleteLoading.splice(index, 1)
        })
        .catch((err) => {
          this.$notification.error({
            message: '删除公告失败',
            description: err.message,
          })
        })
    },
    handleOk() {
      this.confirmLoading = true
      this.$refs.taskForm
        .handleSubmit()
        .catch((err) => {
          console.error('updateBulletin fail, ', err)
        })
        .finally(() => {
          this.visible = false
          this.confirmLoading = false
        })
    },
    handleNewOk() {
      this.newVisible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleNewCancel() {
      this.newVisible = false
    },
  },
  mounted() {
    this.$emit('load', 'bulletins')
  },
}
</script>

<style lang="less" scoped>
div.ant-col.ant-col-md-24.ant-col-lg-17 {
  width: 200px;
}
</style>

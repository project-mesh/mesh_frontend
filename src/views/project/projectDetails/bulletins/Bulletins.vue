<template>
  <a-card :bordered="false">
    <div slot="extra">
      <a-button :disabled="username !== projectAdminName" type="primary" @click="newBulletin">
        发布新公告
        <a-icon type="notification" />
      </a-button>
    </div>
    <a-modal
      :width="700"
      centered
      :visible="updateFormVisible"
      :confirm-loading="updateLoading"
      title="编辑"
      @ok="handleUpdate"
      @cancel="handleUpdateCancel"
    >
      <update-form :record="selectedItem" ref="updateForm"></update-form>
    </a-modal>
    <a-modal
      :width="700"
      centered
      :visible="createFormVisible"
      :confirm-loading="createLoading"
      title="发布"
      @ok="handleCreate"
      @cancel="handleCreateCancel"
    >
      <create-form ref="createForm"></create-form>
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
import UpdateForm from './UpdateForm'
import CreateForm from './CreateForm'
import { formatDateByPattern } from '@/utils/dateUtil'
import projectMixin from '@/utils/mixins/projectMixin'
import teamMixin from '@/utils/mixins/teamMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'

export default {
  components: {
    CreateForm,
    UpdateForm,
  },
  mixins: [teamMixin, projectMixin, paginationMixin],
  data() {
    return {
      updateFormVisible: false,
      updateLoading: false,
      createFormVisible: false,
      createLoading: false,
      selectedItem: null,
      deleteLoading: [],
    }
  },
  computed: {
    ...mapGetters(['bulletins', 'username', 'projectAdminName', 'projectId']),
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
      this.updateFormVisible = true
    },
    newBulletin() {
      this.createFormVisible = true
    },
    removeBulletin(bulletin, index) {
      this.$set(this.deleteLoading, index, true)
      this.deleteBulletin({
        username: this.username,
        projectId: this.projectId,
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
    handleUpdate() {
      this.updateLoading = true
      this.$refs.updateForm
        .handleSubmit()
        .catch((err) => {
          console.error('updateBulletin fail, ', err)
        })
        .finally(() => {
          this.updateFormVisible = false
          this.updateLoading = false
        })
    },
    handleCreate() {
      this.createLoading = true
      this.$refs.createForm
        .handleSubmit()
        .then(() => {
          console.log('创建公告成功')
        })
        .catch((err) => {
          this.$notification.error({
            message: '无效公告ID',
            description: err.message,
          })
        })
        .finally(() => {
          this.createFormVisible = false
          this.createLoading = false
        })
    },
    handleUpdateCancel() {
      this.updateFormVisible = false
    },
    handleCreateCancel() {
      this.createFormVisible = false
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

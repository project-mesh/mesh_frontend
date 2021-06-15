<template>
  <a-card :bordered="false" :loading="cardLoading">
    <!-- <div class="operate">
      <a-button type="dashed" icon="plus" block @click="add">添加</a-button>
    </div> -->

    <div class="operate" slot="extra">
      <div class="search-box">
        <a-input-search v-model="filterText" placeholder="输入要查找的条目" />
      </div>
      <a-button type="primary" icon="plus" @click="add">添加</a-button>
    </div>

    <a-modal
      :width="700"
      centered
      :visible="visible"
      :confirm-loading="confirmLoading"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <TaskForm :record="selectedItem" ref="taskForm"></TaskForm>
    </a-modal>

    <a-list size="large" :data-source="filteredProjects" :pagination="pagination(filteredProjects)">
      <a-list-item slot="renderItem" key="item.knowledgeId" slot-scope="item, index">
        <a-list-item-meta :title="item.knowledgeName" :style="{ marginLeft: '50px' }">
          <a slot="description" :href="item.hyperlink">{{ item.hyperlink }}</a>
        </a-list-item-meta>
        <div slot="actions">
          <a @click="edit(item)" :disabled="!isProjectAdminOrUploader(item)">编辑</a>
        </div>
        <div slot="actions">
          <a-popconfirm title="是否要删除此行？" @confirm="deleteKB(item, index)">
            <a :disabled="!isProjectAdminOrUploader(item)">删除</a>
          </a-popconfirm>
        </div>
        <div class="list-content">
          <div class="name-group">
            <a-avatar slot="avatar" :src="getAvatar(item.uploaderName)" />
            <div class="list-content-item">
              <span>上传人</span>
              <p>{{ item.uploaderName }}</p>
            </div>
          </div>
          <div class="list-content-item">
            <span>上传时间</span>
            <p>{{ item.createTime }}</p>
          </div>
        </div>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from './TaskForm'
import { mapGetters, mapActions } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import _ from 'lodash'

const columns = [
  {
    title: '标题',
    dataIndex: 'knowledgeName',
    key: 'knowledgeName',
    ellipsis: true,
  },
  {
    title: '地址',
    dataIndex: 'hyperlink',
    key: 'hyperlink',
    ellipsis: true,
    scopedSlots: { customRender: 'hyperlink' },
  },
  {
    title: '上传人',
    dataIndex: 'uploaderName',
    key: 'uploaderName',
    ellipsis: true,
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'right',
  },
]

export default {
  name: 'ProjectRepo',
  components: { TaskForm },
  mixins: [teamMixin, projectMixin, paginationMixin],
  data() {
    return {
      // data,
      columns,
      status: 'all',
      selectedItem: {},
      visible: false,
      confirmLoading: false,
      modalTitle: '新建',
      cardLoading: false,
      filterText: '',
    }
  },
  computed: {
    ...mapGetters(['projectKB', 'username', 'projectId', 'projectAdminName', 'teamMembers']),
    filteredProjects() {
      return this.projectKB.filter(
        (knowledge) =>
          knowledge.knowledgeName.toLocaleUpperCase().match(this.filterText.toLocaleUpperCase()) ||
          knowledge.hyperlink.toLocaleUpperCase().match(this.filterText.toLocaleUpperCase())
      )
    },
  },
  methods: {
    ...mapActions(['queryProjectKB', 'queryProject', 'deleteProjectKB']),
    isProjectAdminOrUploader(knowledge) {
      return this.username === this.projectAdminName || this.username === knowledge.uploaderName
    },
    rowKey(knowledge) {
      return knowledge.knowledgeId
    },
    getAvatar(username) {
      return this.teamMembers.find((member) => member.username === username).avatar
    },
    add() {
      this.modalTitle = '新建'
      this.selectedItem = {}
      this.visible = true
    },
    edit(record) {
      this.modalTitle = '编辑'
      this.selectedItem = record
      this.visible = true
    },
    handleOk() {
      this.confirmLoading = true
      this.$refs.taskForm
        .handleSubmit()
        .catch((err) => {
          console.error('In projectRepo, update project KB failed, ', err)
        })
        .finally(() => {
          this.visible = false
          this.confirmLoading = false
        })
    },
    handleCancel() {
      this.visible = false
    },
    deleteKB(knowledge, index) {
      this.deleteProjectKB({
        username: this.username,
        projectId: this.projectId,
        knowledgeId: knowledge.knowledgeId,
      })
        .then((res) => {
          this.$notification.success({
            message: '成功删除项目知识库',
          })
        })
        .catch((err) =>
          this.$notification.err({
            message: '删除知识库失败',
            description: err.message,
          })
        )
    },
  },
  mounted() {
    this.$emit('load', 'projectRepo')
  },
}
</script>

<style lang="less" scoped>
.operate {
  display: flex;
  align-items: center;
}

.search-box {
  margin-right: 10px;
}

.name-group {
  width: 150px;
  display: flex;
  justify-content: space-around;
}

.ant-list-item-meta-content {
  margin-left: 20px;
}
.list-content {
  display: flex;
  justify-content: space-between;
  width: 25%;
  margin: 0 50px;
}
.changeWidth {
  background-color: #ffffff;
}
.list-content-item {
  color: rgba(0, 0, 0, 0.45);
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  margin-left: 0px;

  p {
    margin-top: 4px;
    margin-bottom: 0;
    line-height: 22px;
  }
}
</style>

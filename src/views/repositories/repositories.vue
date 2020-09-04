<template>
  <a-card style="margin-top: 24px" :bordered="false" title="知识库" :loading="cardLoading">
    <div class="operate">
      <a-button type="dashed" icon="plus" block @click="add">添加</a-button>
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

    <a-table
      size="large"
      :columns="columns"
      :data-source="teamKBWithFormatedCreateTime"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: pageSize,
        total: teamKBWithFormatedCreateTime.length,
        current: currentPage,
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
      }"
    >
      <a slot="hyperlink" slot-scope="link, item" href="link">{{ item.hyperlink }}</a>
      <span slot="action" slot-scope="text, item, index">
        <a @click="edit(item)" :disabled="!isTeamAdminOrUploader(item)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否要删除此行？" @confirm="deleteKB(item, index)">
          <a :disabled="!isTeamAdminOrUploader(item) || deleteLoading[index]">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </a-card>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from '@/views/repositories/TaskForm'
import { formatDateByPattern } from '@/utils/dateUtil'
import { mapGetters, mapActions } from 'vuex'
import teamMixin from '@/utils/mixins/teamMixin'

/*
{
  "error_code": 0,
  "data": {
    "isSuccess": true,
    "msg": "",
    "knowledgeBase": [
      {
        "knowledgeId": "asgsdfvgdxzvzsd",
        "knowledgeName": "项目地址",
        "hyperlink": "xxxx",
        "uploaderName": "王新宇",
        "createTime": "1595215568570"
      }
    ]
  }
}
*/

// const data = []
// data.push({
//   knowledgeName: '谷歌',
//   hyperlink: 'www.google.com',
//   uploaderName: '付晓晓',
//   createTime: '1595215568570',
// })
// data.push({
//   knowledgeName: '百度',
//   hyperlink: 'www.baidu.com',
//   uploaderName: '付晓晓',
//   createTime: '1595215561593',
// })
// data.push({
//   knowledgeName: '必应',
//   hyperlink: 'www.bing.com',
//   uploaderName: '付晓晓',
//   createTime: '1595215561593',
// })
// data.push({
//   knowledgeName: '百度',
//   hyperlink: 'www.baidu.com',
//   uploaderName: '付晓晓',
//   createTime: '1595215561593',
// })

// for (const item of data) {
//   const fullDate = new Date(Number(item.createTime))
//   item.createTimeDisplay = formatDateByPattern(fullDate, 'yyyy-MM-dd hh:mm')
// }

//  dataIndex: 'name',
//     key: 'name',
//     slots: { title: 'customTitle' },
//     scopedSlots: { customRender: 'name' },

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
    dataIndex: 'createTimeDisplay',
    key: 'createTimeDisplay',
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
  name: 'Repositories',
  components: { TaskForm },
  mixins: [teamMixin],
  data() {
    return {
      // data,
      columns,
      status: 'all',
      selectedItem: {},
      visible: false,
      confirmLoading: false,
      modalTitle: '新建',
      pageSize: 10,
      currentPage: 1,
      deleteLoading: [],
      cardLoading: false,
    }
  },
  computed: {
    ...mapGetters(['teamKB', 'username', 'teamId', 'teamAdminName']),
    teamKBWithFormatedCreateTime() {
      const formatedData = JSON.parse(JSON.stringify(this.teamKB))
      formatedData.forEach((knowledge) => {
        knowledge.createTimeDisplay = formatDateByPattern(
          new Date(Number(knowledge.createTime)),
          'yyyy-MM-dd hh:mm'
        )
      })

      return formatedData
    },
  },
  methods: {
    ...mapActions(['queryTeamKB', 'queryTeam', 'deleteTeamKB']),
    isTeamAdminOrUploader(knowledge) {
      return this.username === this.teamAdminName || this.username === knowledge.uploaderName
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
    handlePageChange(current) {
      this.currentPage = current
    },
    handlePageSizeChange(current, pageSize) {
      this.pageSize = pageSize
    },
    handleOk() {
      this.confirmLoading = true
      this.$refs.taskForm
        .handleSubmit()
        .then((response) => {
          this.visible = false
          this.confirmLoading = false

          if (!this.selectedItem.knowledgeId) {
            this.deleteLoading.push(false)
          }
        })
        .catch((error) => {
          this.visible = false
          this.confirmLoading = false
        })
    },
    handleCancel() {
      this.visible = false
    },
    deleteKB(knowledge, index) {
      this.$set(this.deleteLoading, index, true)
      this.deleteTeamKB({
        username: this.username,
        teamId: this.teamId,
        knowledgeId: knowledge.knowledgeId,
      })
        .then((response) => {
          this.$notification.success({
            message: '成功删除团队知识库',
          })
          this.deleteLoading.splice(index, 1)
        })
        .catch((error) =>
          this.$notification.error({
            message: '删除知识库失败',
            description: error.message,
          })
        )
    },
  },
  mounted() {
    // for test
    // this.queryTeam({ username: this.username, teamId: this.teamId })
    //   .then((response) => console.log(response))
    //   .catch((error) => console.error(error))
    // // for test
    // this.queryTeamKB({ username: this.username, teamId: this.teamId })
    //   .then((response) => {
    //     this.$notification.success({
    //       message: '成功获取团队知识库',
    //       description: '成功获取团队知识库',
    //     })
    //     this.deleteLoading = new Array(response.data.knowledgeBase).fill(false)
    //   })
    //   .catch((error) => {
    //     this.$notification.error({
    //       message: '获取团队知识库失败',
    //       description: `${error.name}: ${error.message}`,
    //     })
    //   })
    //   .finally(() => {
    //     this.cardLoading = false
    //   })
  },
}
</script>

<style lang="less" scoped>
.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
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
</style>

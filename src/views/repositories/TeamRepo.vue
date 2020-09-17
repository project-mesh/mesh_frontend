<template>
  <a-card style="margin-top: 24px" :bordered="false" title="知识库" :loading="cardLoading">
    <div class="operate" slot="extra">
      <div class="search-box">
        <a-input-search v-model="filterText" placeholder="输入要查找的条目" />
      </div>
      <a-button type="primary" icon="plus" @click="add">添加</a-button>
    </div>

    <a-table
      size="large"
      :columns="columns"
      :row-key="rowKey"
      :data-source="filteredTeamKB"
      :pagination="pagination(filteredTeamKB)"
    >
      <template slot="knowledgeName" slot-scope="text, item">
        <editable-cell
          :text="text"
          :editing="item.knowledgeNameEditing"
          :disabled="!isTeamAdminOrUploader(item)"
          :validators="[[isNotEmpty, '知识库标题不能为空']]"
          @change="handleOk(item, 'knowledgeName', $event)"
          @editStatusChange="handleEditStatusChange(item, 'knowledgeName', $event)"
        >
          <span>{{ text }}</span>
        </editable-cell>
      </template>
      <template slot="hyperlink" slot-scope="text, item">
        <editable-cell
          :text="text"
          :editing="item.hyperlinkEditing"
          :validators="[[isURL, 'url地址无效！']]"
          :disabled="!isTeamAdminOrUploader(item)"
          @change="handleOk(item, 'hyperlink', $event)"
          @editStatusChange="handleEditStatusChange(item, 'hyperlink', $event)"
        >
          <a :href="`http://${text}`">
            {{ text }}
          </a>
        </editable-cell>
      </template>
      <div class="uploader-box" slot="uploader" slot-scope="text">
        <a-avatar :src="getAvatar(text)" />
        <span style="margin-left: 10px">{{ text }}</span>
      </div>
      <span slot="action" slot-scope="text, item, index">
        <a-popconfirm title="是否要删除此行？" @confirm="deleteKB(item, index)">
          <a :disabled="!isTeamAdminOrUploader(item)">删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </a-card>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import { mapGetters, mapActions } from 'vuex'
import validator from 'validator'

import TaskForm from './TaskForm'
import { formatDateByPattern } from '@/utils/dateUtil'
import teamMixin from '@/utils/mixins/teamMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import EditableCell from './EditableCell'
import cloneDeep from 'lodash.clonedeep'
import Mock from 'mockjs2'

const columns = [
  {
    title: '标题',
    dataIndex: 'knowledgeName',
    key: 'knowledgeName',
    ellipsis: true,
    scopedSlots: { customRender: 'knowledgeName' },
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
    scopedSlots: { customRender: 'uploader' },
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
  mixins: [teamMixin, paginationMixin],
  components: {
    EditableCell,
    TaskForm,
  },
  data() {
    return {
      columns,
      status: 'all',
      selectedItem: {},
      visible: false,
      confirmLoading: false,
      modalTitle: '新建',
      cardLoading: false,
      filterText: '',
      newKB: {
        knowledgeId: Mock.mock('@id'),
        knowledgeName: '',
        hyperlink: '',
        createTime: Date.now(),
        uploaderName: this.username,
        knowledgeNameEditing: false,
        hyperlinkEditing: false,
      },
    }
  },
  computed: {
    ...mapGetters(['teamKB', 'username', 'teamId', 'teamAdminName', 'teamMembers']),
    teamKBWithFormatedCreateTime() {
      const formatedData = cloneDeep(this.teamKB)
      formatedData.forEach((knowledge) => {
        knowledge.createTimeDisplay = formatDateByPattern(
          new Date(Number(knowledge.createTime)),
          'yyyy-MM-dd hh:mm'
        )
      })

      return formatedData
    },
    filteredTeamKB() {
      const filtered = this.teamKBWithFormatedCreateTime.filter(
        (knowledge) =>
          knowledge.knowledgeName.toLocaleUpperCase().match(this.filterText.toLocaleUpperCase()) ||
          knowledge.hyperlink.toLocaleUpperCase().match(this.filterText.toLocaleUpperCase())
      )

      if (this.creating) filtered.unshift(this.newKB)

      return filtered
    },
    creating() {
      return this.newKB.knowledgeNameEditing || this.newKB.hyperlinkEditing
    },
  },
  methods: {
    ...mapActions(['queryTeamKB', 'queryTeam', 'deleteTeamKB', 'updateTeamKB', 'createTeamKB']),
    isTeamAdminOrUploader(knowledge) {
      return this.username === this.teamAdminName || this.username === knowledge.uploaderName
    },
    rowKey(knowledge) {
      return knowledge.knowledgeId
    },
    getAvatar(username) {
      const user = this.teamMembers.find((member) => member.username === username)
      // return this.teamMembers.find((member) => member.username === username).avatar
      return user ? user.avatar : ''
    },
    add() {
      if (this.creating) {
        return this.$warning({
          content: '当前已有知识库正在创建！',
        })
      }

      this.newKB.knowledgeNameEditing = true
      this.newKB.hyperlinkEditing = true
      this.newKB.uploaderName = this.username
    },
    edit(record) {
      this.modalTitle = '编辑'
      this.selectedItem = record
      this.visible = true
    },
    handleOk(item, key, value) {
      if (item.knowledgeNameEditing || item.hyperlinkEditing) {
        this.newKB[key] = value
        this.newKB[`${key}Editing`] = false
        if (!item.knowledgeNameEditing && !item.hyperlinkEditing) {
          const requestData = {
            username: this.username,
            teamId: this.teamId,
            knowledgeName: this.newKB.knowledgeName,
            hyperlink: this.newKB.hyperlink,
          }

          this.create(requestData)
        }
      } else this.update(item, key, value)
    },
    handleEditStatusChange(item, key, value) {
      if (`${key}Editing` in item) {
        this.newKB[`${key}Editing`] = value
      }
    },
    create(requestData) {
      this.createTeamKB(requestData)
        .then((res) => {
          this.$notification.success({
            message: '知识词条创建成功',
          })
          this.queryTeamKB({
            username: this.username,
            teamId: this.preference.preferenceTeam,
          })
            .then((res) => {
              this.$notification.success({
                message: '知识库更新成功',
              })
            })
            .catch((err) => {
              this.$notification.error({
                message: '知识库更新失败',
                description: err.message,
              })
            })
        })
        .catch((err) => {
          this.$notification.error({
            message: '知识词条创建失败',
            description: err.message,
          })
        })
        .finally(() => {
          this.newKB.knowledgeName = ''
          this.newKB.knowledgeNameEditing = false
          this.newKB.hyperlink = ''
          this.newKB.hyperlinkEditing = false
        })
    },
    update(item, key, value) {
      const { knowledgeId } = item
      this.updateTeamKB({
        username: this.username,
        teamId: this.teamId,
        knowledgeId,
        [key]: value,
      }).catch((err) => {
        this.$notification.error({
          message: '更新知识库失败',
          description: err.message,
        })
      })
    },
    handleCancel() {
      this.visible = false
    },
    deleteKB(knowledge) {
      if (this.creating) {
        this.newKB.knowledgeNameEditing = false
        this.newKB.hyperlinkEditing = false
        return
      }

      this.deleteTeamKB({
        username: this.username,
        teamId: this.teamId,
        knowledgeId: knowledge.knowledgeId,
      })
        .then((res) => {
          this.$notification.success({
            message: '成功删除团队知识库',
          })
        })
        .catch((err) =>
          this.$notification.err({
            message: '删除知识库失败',
            description: err.message,
          })
        )
    },
    isNotEmpty(value) {
      return !validator.isEmpty(value, { ignore_whitespace: true })
    },
    isURL: validator.isURL,
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

.ant-avatar-lg {
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.list-content {
  display: flex;
  justify-content: space-between;
  width: 25%;
  margin: 0 50px;
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

.uploader-box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>

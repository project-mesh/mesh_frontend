<template>
  <a-card style="margin-top: 24px;" :bordered="false" title="知识库">
    <div class="operate">
      <a-button type="dashed" icon="plus" block @click="add">
        添加
      </a-button>
    </div>

    <a-list
      size="large"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 5,
        total: 50,
      }"
    >
      <a-list-item :key="index" v-for="(item, index) in teamKBWithFormatedCreateTime">
        <a-list-item-meta :title="item.knowledgeName">
          <a slot="description" :href="item.hyperlink">{{ item.hyperlink }}</a>
        </a-list-item-meta>
        <div slot="actions">
          <a-button type="link" @click="edit(item)" :disabled="!isTeamAdminOrUploader(item)">
            编辑
          </a-button>
        </div>
        <div slot="actions">
          <a-button
            type="link"
            :loading="deleteLoading"
            @click="deleteKB(item)"
            :disabled="!isTeamAdminOrUploader(item)"
          >
            删除
          </a-button>
        </div>
        <!-- <div slot="actions">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item><a @click="edit(item)">编辑</a></a-menu-item>
              <a-menu-item><a>删除</a></a-menu-item>
            </a-menu>
            <a>
              更多
              <a-icon type="down" />
            </a>
          </a-dropdown>
        </div> -->
        <div class="list-content">
          <div class="list-content-item">
            <span>上传人</span>
            <p>{{ item.uploaderName }}</p>
          </div>
          <div class="list-content-item">
            <span>上传时间</span>
            <p>{{ item.createTimeDisplay }}</p>
          </div>
        </div>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from '@/views/repositories/TaskForm'
import { formatDateByPattern } from '@/utils/dateUtil'
import { mapGetters, mapActions } from 'vuex'
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

export default {
  name: 'Repositories',
  components: {},
  data() {
    return {
      // data,
      status: 'all',
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
      this.$dialog(
        TaskForm,
        // component props
        {
          record: {},
          on: {
            ok() {},
            cancel() {},
            close() {},
          },
        },
        // modal props
        {
          title: '新增',
          width: 700,
          centered: true,
          maskClosable: false,
          // confirmLoading: true,
        }
      )
    },
    edit(record) {
      this.$dialog(
        TaskForm,
        // component props
        {
          record,
          on: {
            ok() {
              // alert('edit')
            },
            cancel() {},
            close() {},
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
    deleteKB(knowledge) {
      this.deleteTeamKB({
        username: this.username,
        teamId: this.teamId,
        knowledgeId: knowledge.knowledgeId,
      })
        .then((response) =>
          this.$notification.success({
            message: '成功删除团队知识库',
          })
        )
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
    this.queryTeam({ username: this.username, teamId: this.teamId })
      .then((response) => console.log(response))
      .catch((error) => console.error(error))
    // for test

    this.queryTeamKB({ username: this.username, teamId: this.teamId })
      .then((response) => {
        console.log('queryTeamKB resolve')
        this.$notification.success({
          message: '成功获取团队知识库',
          description: '成功获取团队知识库',
        })
      })
      .catch((error) => {
        console.log('queryTeamKB reject')
        this.$notification.error({
          message: '获取团队知识库失败',
          description: '`${error.name}: ${error.message}`',
        })
      })
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

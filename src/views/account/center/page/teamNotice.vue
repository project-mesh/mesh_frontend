<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false">
      <div slot="extra">
        <a-button class="operate" style="margin-left: 8px margin-top: 0%" @click="readAll">
          全部标为已读
        </a-button>
      </div>
      <a-list
        size="large"
        :pagination="{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 5,
          total: this.data.size,
        }"
      >
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta @click="dealOneClick(item.title)">
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div class="unread" v-if="item.isRead">.</div>
          <div class="list-content">
            <div class="list-content-item">
              <span>操作人</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>操作时间</span>
              <p>{{ item.startAt }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
const data = []
data.push({
  title: '你被设置为后端数据库项目的管理员',
  startAt: '2019-09-19 11:55',
  owner: 'test',
  isRead: false,
})
data.push({
  title: '你被设置为前端设计项目的任务UI/UX的负责人',
  startAt: '2020-09-19 11:22',
  owner: 'zengze',
  isRead: true,
})
data.push({
  title: '你发布的知识库百度百科被管理员删除',
  startAt: '2020-09-19 12:36',
  owner: 'zengze',
  isRead: true,
})
data.push({
  title: '你负责的前端设计项目的任务Axure被管理员修改',
  startAt: '2019-09-17 13:20',
  owner: 'test',
  isRead: false,
})
data.push({
  title: '团队新增成员copy',
  startAt: '2019-09-16 22:59',
  owner: 'lxd',
  isRead: true,
})
export default {
  name: 'TeamNoticePage',
  components: {},
  data() {
    return {
      data,
    }
  },
  methods: {
    dealOneClick(listTitle) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].title == listTitle) {
          data[i].isRead = false
          break
        }
      }
    },
    readAll() {
      for (var i = 0; i < data.length; i++) {
        data[i].isRead = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
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
.unread {
  color: red;
  margin-top: -7%;
  right: 0%;
  position: absolute;
  font-size: 50px;
}
</style>

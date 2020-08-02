<template>
  <page-header-wrapper>
    <a-card style="margin-top: 24px;" :bordered="false" title="知识库">
      <div slot="extra">
        <a-radio-group v-model="status">
          <a-radio-button value="team">
            <a-icon type="team" />
          </a-radio-button>
          <a-radio-button value="project">
            <a-icon type="project" />
          </a-radio-button>
        </a-radio-group>

        <!---   <a-input-search style="margin-left: 16px; width: 272px;" />
     --->
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%;" icon="plus" @click="add">添加</a-button>
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
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar" />
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)">编辑</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>编辑</a></a-menu-item>
                <a-menu-item><a>删除</a></a-menu-item>
              </a-menu>
              <a>
                更多
                <a-icon type="down" />
              </a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>上传人</span>
              <p>{{ item.uploader }}</p>
            </div>
            <div class="list-content-item">
              <span>上传时间</span>
              <p>{{ item.uploadAt }}</p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// 演示如何使用 this.$dialog 封装 modal 组件
import TaskForm from './TaskForm'

const data = []
data.push({
  title: 'Alipay',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '那是一种内在的东西， 他们到达不了，也无法触及的',
  uploader: '付晓晓',
  uploadAt: '2018-07-26 22:44',
  progress: {
    value: 90,
  },
})
data.push({
  title: 'Angular',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  uploader: '曲丽丽',
  uploadAt: '2018-07-26 22:44',
  progress: {
    value: 54,
  },
})
data.push({
  title: 'Ant Design',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  description: '生命就像一盒巧克力，结果往往出人意料',
  uploader: '林东东',
  uploadAt: '2018-07-26 22:44',
  progress: {
    value: 66,
  },
})
data.push({
  title: 'Ant Design Pro',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  uploader: '周星星',
  uploadAt: '2018-07-26 22:44',
  progress: {
    value: 30,
  },
})
data.push({
  title: 'Bootstrap',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  uploader: '吴加好',
  uploadAt: '2018-07-26 22:44',
  progress: {
    status: 'exception',
    value: 100,
  },
})

export default {
  name: 'Repositories',
  components: {},
  data() {
    return {
      data,
      status: 'all',
    }
  },
  methods: {
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
            ok() {},
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

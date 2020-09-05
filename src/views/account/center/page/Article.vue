<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false" title="公告">
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
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a @click="edit(item)">详情</a>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>发布人</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>发布时间</span>
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
  title: 'Alipay',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  description: '那是一种内在的东西， 他们到达不了，也无法触及的',
  owner: '付晓晓',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 90,
  },
})
data.push({
  title: 'Angular',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  owner: '曲丽丽',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 54,
  },
})
data.push({
  title: 'Ant Design',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  description: '生命就像一盒巧克力，结果往往出人意料',
  owner: '林东东',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 66,
  },
})
data.push({
  title: 'Ant Design Pro',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  owner: '周星星',
  startAt: '2018-07-26 22:44',
  progress: {
    value: 30,
  },
})
data.push({
  title: 'Bootstrap',
  avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
  description: '那时候我只会想自己想要什么，从不想自己拥有什么',
  owner: '吴加好',
  startAt: '2018-07-26 22:44',
  progress: {
    status: 'exception',
    value: 100,
  },
})
/*const dataSource = []
for (let i = 0; i < 11; i++) {
  dataSource.push({
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    activeUser: 17,
    newUser: 1700,
  })
}*/

export default {
  name: 'Article',
  components: {},
  data() {
    return {
      //dataSource,
      data,
    }
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
</style>

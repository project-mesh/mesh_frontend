<template>
  <div>
    <a-card style="margin-top: 24px" :bordered="false">
      <div slot="extra">
        <a-button class="operate" style="margin-left: 8px" @click="add">全部标为已读</a-button>
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
            <a-avatar slot="avatar" size="small" shape="round" :src="item.avatar" />
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div class="unread">.</div>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TeamNoticePage',
  components: {},
  data() {
    return {}
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

<template>
  <div>
    <div class="change-view">
      <a-radio-group default-value="b" button-style="solid">
        <a-radio-button value="a" @click="showListView()">
          <a-icon type="unordered-list" />
          列表视图
        </a-radio-button>
        <a-radio-button value="b" @click="showCardView()">
          卡片视图
          <a-icon type="appstore" />
        </a-radio-button>
      </a-radio-group>
      <a-button type="primary">
        创建新项目
        <a-icon type="folder-add" />
      </a-button>
    </div>
    <div v-if="listVisible" class="list-view">
      <a-list item-layout="horizontal" :data-source="data">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <div slot="title">{{ item.projectName }}</div>
            <div slot="description">{{ item.projectAdmin }}</div>
            <a slot="description">进入项目</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <div v-if="!listVisible">
      <a-row type="flex" class="card-row">
        <a-col class="card-col">
          <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-card hoverable style="width: 300px;">
                <img
                  slot="cover"
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                <template slot="actions" class="ant-card-actions">
                  <a-icon key="setting" type="setting" />
                  <a-icon key="edit" type="edit" />
                  <a-icon key="ellipsis" type="ellipsis" />
                </template>
                <a-card-meta>
                  <div slot="title">{{ item.projectName }}</div>
                  <div slot="description">{{ item.projectAdmin }}</div>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import store from '../../store'
export default {
  name: 'Project',
  methods: {
    showListView() {
      console.log('显示列表')
      this.listVisible = true
    },
    showCardView() {
      console.log('显示卡片')
      this.listVisible = false
    },
  },
  beforeMount: function () {
    let defaultTeamName = store.getters.teamName
    store.dispatch({
      type: 'GetTeamInfo',
      teamName: defaultTeamName,
    })
    this.data = store.getters.projects
  },
  data() {
    return {
      listVisible: false, //是否显示列表 true显示列表 false显示卡片
      data: [],
    }
  },
}
</script>

<style scoped>
.change-view {
  width: 100%;
  display: flex;
  right: 20px;
  justify-content: space-between;
}
.card-row {
  height: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-col {
  margin-top: 20px;
}
</style>

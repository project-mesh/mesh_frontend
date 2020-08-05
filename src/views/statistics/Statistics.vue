<template>
  <a-layout>
    <a-layout-content style="margin: 0 16px;">
      <a-breadcrumb style="margin: 16px 0;">
        <a-breadcrumb-item>项目</a-breadcrumb-item>
        <a-breadcrumb-item>统计</a-breadcrumb-item>
      </a-breadcrumb>
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            :loading="loading"
            :bordered="false"
            title="任务按执行者分布"
            :style="{ height: '100%' }"
          >
            <div slot="extra" style="height: inherit;">
              <div class="analysis-salesTypeRadio">
                <a-radio-group default-value="a">
                  <a-radio-button value="a">全部任务</a-radio-button>
                  <a-radio-button value="b">未完成</a-radio-button>
                  <a-radio-button value="c">已完成</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div>
              <div>
                <v-chart :force-fit="true" :height="405" :data="pieData" :scale="pieScale">
                  <v-tooltip :show-title="false" data-key="item*percent" />
                  <v-axis />
                  <v-legend data-key="item" />
                  <v-pie position="percent" color="item" :v-style="pieStyle" />
                  <v-coord type="theta" :radius="0.75" :inner-radius="0.6" />
                </v-chart>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-statistic title="Active Users" :value="112893" style="margin-right: 50px;" />
          <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-statistic title="Active Users" :value="112893" style="margin-right: 50px;" />
          <a-statistic title="Account Balance (CNY)" :precision="2" :value="112893" />
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  NumberInfo,
  MiniSmoothArea,
} from '@/components'

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '无负责人', count: 32.2 },
  { item: '蔡徐坤', count: 21 },
  { item: 'Tom', count: 17 },
  { item: 'lxd', count: 5 },
]

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%',
  },
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent',
})
const pieData = dv.rows

export default {
  name: 'Statistics',
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
  },
  data() {
    return {
      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1,
      },
    }
  },
}
</script>

<style lang="less" scoped>
.row {
  padding: '24px';
  min-height: '360px';
}

.col {
  padding: 24px;
  background: #ffffff;
  margin-bottom: 24px;
  margin-left: 24px;
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}

.analysis-salesTypeRadio {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>

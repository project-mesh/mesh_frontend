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
            <ve-ring
              v-if="performeRingVisible"
              :data="performerData"
              :settings="ringSettings"
            ></ve-ring>
            <ve-histogram
              v-if="!performeRingVisible"
              :data="performerData"
              :settings="histogramSettings"
            ></ve-histogram>
            <div>
              <a-radio-group default-value="a">
                <a-radio-button value="a" @click="performeShowRing">
                  环状图
                </a-radio-button>
                <a-radio-button value="b" @click="performeShowHistograme">
                  直方图
                </a-radio-button>
              </a-radio-group>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            :bordered="false"
            title="任务完成情况"
            :style="{ height: '100%' }"
          >
            <div slot="extra" style="height: inherit;"></div>
            <ve-histogram
              v-if="finishHistogramVisible"
              :data="finishData"
              :settings="histogramSettings"
            ></ve-histogram>
            <ve-line
              v-if="!finishHistogramVisible"
              :data="finishData"
              :settings="histogramSettings"
            ></ve-line>
            <div>
              <a-radio-group default-value="a">
                <a-radio-button value="a" @click="finishShowHistogram">
                  直方图
                </a-radio-button>
                <a-radio-button value="b" @click="finishShowLine">
                  折线图
                </a-radio-button>
              </a-radio-group>
            </div>
          </a-card>
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
import { values } from 'mockjs2'
export default {
  name: 'Statistics',
  components: {},
  data() {
    this.ringSettings = {
      roseType: 'radius',
      radius: [100, 150],
    }
    this.histogramSettings = {
      itemStyle: {
        color: '#1890ff',
      },
    }
    return {
      performeRingVisible: true, //第一个表格显示环状图true 直方图 false
      finishHistogramVisible: true, //显示直方图true 折线图 false
      performerData: {
        columns: ['principal', 'count'],
        rows: [
          { principal: '虞姬', count: 1393 },
          { principal: '蔡文姬', count: 3530 },
          { principal: '白起', count: 2923 },
          { principal: '张飞', count: 1723 },
          { principal: '诸葛亮', count: 3792 },
          { principal: '未分配', count: 4593 },
        ],
      },
      finishData: {
        columns: ['case', 'count'],
        rows: [
          { case: '未完成', count: 1393 },
          { case: '已完成', count: 3530 },
          { case: '已逾期', count: 2923 },
          { case: '未认领', count: 1723 },
          { case: '已认领', count: 3792 },
        ],
      },
    }
  },
  methods: {
    performeShowRing() {
      console.log('显示环状图')
      this.performeRingVisible = true
    },
    performeShowHistograme() {
      console.log('显示饼状图')
      this.performeRingVisible = false
    },
    finishShowHistogram() {
      console.log('显示直方图')
      this.finishHistogramVisible = true
    },
    finishShowLine() {
      console.log('显示折线图')
      this.finishHistogramVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.row {
  padding: 20px;
  min-height: 300px;
}

.col {
  padding-top: 10px;
  background: #ffffff;
  margin-bottom: 24px;
  margin-left: 60px;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.analysis-salesTypeRadio {
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>

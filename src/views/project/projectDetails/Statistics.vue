<template>
  <a-layout style="background: #fff">
    <a-layout-content style="margin: 0 16px">
      <!-- <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>
          <router-link :to="{ name: 'projectList', query: { teamId: $route.query.teamId } }">
            项目
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>统计</a-breadcrumb-item>
      </a-breadcrumb> -->
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            title="任务分布"
            :style="{ height: '100%' }"
          >
            <div slot="extra" style="height: inherit">
              <div class="analysis-salesTypeRadio">
                <a-radio-group v-model="filterType" default-value="all">
                  <a-radio-button value="all">全部任务</a-radio-button>
                  <a-radio-button value="finished">已完成</a-radio-button>
                  <a-radio-button value="unfinished">未完成</a-radio-button>
                  <a-radio-button value="overdue">已逾期</a-radio-button>
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
                <a-radio-button value="a" @click="performeShowRing">环状图</a-radio-button>
                <a-radio-button value="b" @click="performeShowHistograme">直方图</a-radio-button>
              </a-radio-group>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            title="任务完成情况"
            :style="{ height: '100%' }"
          >
            <div slot="extra" style="height: inherit"></div>
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
                <a-radio-button value="a" @click="finishShowHistogram">直方图</a-radio-button>
                <a-radio-button value="b" @click="finishShowLine">折线图</a-radio-button>
              </a-radio-group>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card
            class="antd-pro-pages-dashboard-analysis-salesCard"
            title="概览报表"
            :style="{ height: '100%' }"
          >
            <ve-wordcloud :data="performerData"></ve-wordcloud>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-button type="primary" @click="export2Excel">导出统计数据到本地</a-button>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import projectMixin from '@/utils/mixins/projectMixin'
import teamMixin from '@/utils/mixins/teamMixin'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'

export default {
  name: 'Statistics',
  components: {},
  mixins: [teamMixin, projectMixin],
  data() {
    this.ringSettings = {
      roseType: 'radius',
    }
    this.histogramSettings = {
      itemStyle: {
        color: '#1890ff',
      },
    }
    this.wordCloudSettings = {
      shape: 'cardioid',
    }
    return {
      performeRingVisible: true, //第一个表格显示环状图true 直方图 false
      finishHistogramVisible: true, //显示直方图true 折线图 false
      filterType: 'all',
      // performerData: {
      //   columns: ['principal', 'count'],
      //   rows: [
      //     { principal: '虞姬', count: 1393 },
      //     { principal: '蔡文姬', count: 3530 },
      //     { principal: '白起', count: 2923 },
      //     { principal: '张飞', count: 1723 },
      //     { principal: '诸葛亮', count: 3792 },
      //     { principal: '未分配', count: 4593 },
      //   ],
      // },
      // finishData: {
      //   columns: ['case', 'count'],
      //   rows: [
      //     { case: '未完成', count: 1393 },
      //     { case: '已完成', count: 3530 },
      //     { case: '已逾期', count: 2923 },
      //     { case: '未认领', count: 1723 },
      //     { case: '已认领', count: 3792 },
      //   ],
      // },
    }
  },
  computed: {
    ...mapGetters(['projectTasks', 'projectMembers']),
    performerData() {
      const data = { columns: ['principal', 'count'], rows: [] }

      let filteredTasks = this.projectTasks

      switch (this.filterType) {
        case 'finished':
          filteredTasks = this.projectTasks.filter((task) => task.status === '已完成')
          break
        case 'unfinished':
          filteredTasks = this.projectTasks.filter((task) => task.status === '开发中')
          break
        case 'overdue':
          filteredTasks = this.projectTasks.filter((task) => task.status === '已逾期')
          break
      }

      filteredTasks.forEach((task) => {
        let index
        if ((index = data.rows.findIndex((item) => item.principal === task.principal)) !== -1) {
          ++data.rows[index].count
        } else {
          data.rows.push({ principal: task.principal, count: 1 })
        }
      })

      console.log('performerData: ', data)

      return data
    },
    finishData() {
      const data = { columns: ['case', 'count'], rows: [] }

      this.projectTasks.forEach((task) => {
        let index
        if ((index = data.rows.findIndex((item) => item.case === task.status)) !== -1) {
          ++data.rows[index].count
        } else {
          data.rows.push({ case: task.status, count: 1 })
        }
      })

      console.log('finishData: ', data)

      return data
    },
    formatedProjectTasks() {
      const formatedData = cloneDeep(this.projectTasks)

      formatedData.forEach((task) => {
        switch (task.priority) {
          case 1:
            task.priority = '普通'
            break
          case 2:
            task.priority = '较高'
            break
          case 3:
            task.priority = '极高'
            break
        }

        task.createTime = new Date(task.createTime).toLocaleString()
      })

      return formatedData
    },
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
    //导出的方法
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../../excel/Export2Excel')
        const tHeader = ['任务名', '任务状态', '创建时间', '截止日期', '优先级', '创建人', '负责人'] // 设置Excel的表格第一行的标题
        const filterVal = [
          'taskName',
          'status',
          'createTime',
          'deadline',
          'priority',
          'founder',
          'principal',
        ] // index、nickName、name是tableData里对象的属性
        const list = this.formatedProjectTasks //把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '统计数据') //导出Excel 文件名
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]))
    },
  },
  mounted() {
    this.$emit('load', 'statistics')
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

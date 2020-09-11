<template>
  <a-layout style="background: #fff">
    <a-layout-header style="text-align: center">
      <a-button type="primary" @click="export2Excel">导出实时数据到本地</a-button>
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <a-card title="总体数据" :style="{ height: '100%' }">
            <ve-histogram :data="histoChartData" :settings="histoChartSettings"></ve-histogram>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户总数" :style="{ height: '100%' }">
            <ve-line :data="lineChartData"></ve-line>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户分布" :style="{ height: '100%' }">
            <ve-map :data="mapChartData" :settings="mapChartSettings"></ve-map>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户构成" :style="{ height: '100%' }">
            <ve-pie :data="pieChartData"></ve-pie>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import China from 'echarts/map/json/china.json'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'Statistics',
  components: {},
  data() {
    this.mapChartSettings = {
      mapOrigin: China,
    }
    this.histoChartSettings = {
      yAxisName: ['用户数'],
    }
    return {
      lineChartData: {
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
        ],
      },
      // histoChartData: {
      //   columns: ['日期', '访问用户', '下单用户', '下单率'],
      //   rows: [
      //     { 日期: '1/1', 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
      //     { 日期: '1/2', 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
      //     { 日期: '1/3', 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
      //     { 日期: '1/4', 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
      //     { 日期: '1/5', 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
      //     { 日期: '1/6', 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 },
      //   ],
      // },
    }
  },
  computed: {
    ...mapGetters([
      'maleUser',
      'femaleUser',
      'unknownUser',
      'userAge',
      'userLocation',
      'currentOnlineUser',
      'avgTeamUser',
      'avgTeamProject',
      'currentTotalUser',
      'historyTotalUser',
      'timeInterval',
    ]),
    histoChartData() {
      const columns = ['日期', '累积用户数']
      const rows = []

      let curDate = moment().date()

      for (let i = 0; i < this.historyTotalUser.length; ++i) {
        rows.push({
          日期: moment()
            .date(curDate - this.timeInterval * i)
            .format('YYYY MM DD'),
          累积用户数: this.historyTotalUser[i].totalUser,
        })
      }

      return { columns, rows: rows.reverse() }
    },
    //     mapChartData: {
    //   columns: ['位置', '税收', '人口', '面积'],
    //   rows: [
    //     { 位置: '吉林', 税收: 123, 人口: 123, 面积: 92134 },
    //     { 位置: '北京', 税收: 1223, 人口: 2123, 面积: 29234 },
    //     { 位置: '上海', 税收: 2123, 人口: 1243, 面积: 94234 },
    //     { 位置: '浙江', 税收: 4123, 人口: 5123, 面积: 29234 },
    //   ],
    // },
    mapChartData() {
      const columns = ['位置', '用户数']
      const rows = []

      for (let i = 0; i < this.userLocation.length; ++i) {
        let location = this.userLocation[i].location

        if (location.endsWith('省')) {
          location = location.slice(0, -1)
        } else if (location.endsWith('族自治区') || location.endsWith('特别行政区')) {
          location = location.slice(0, -5)
        } else if (location.endsWith('自治区')) {
          location = location.slice(0, -3)
        }
        rows.push({
          位置: location,
          用户数: this.userLocation[i].userCount,
        })
      }

      return {
        columns,
        rows,
      }
    },
    //     pieChartData: {
    //   columns: ['日期', '访问用户'],
    //   rows: [
    //     { 日期: '1/1', 访问用户: 1393 },
    //     { 日期: '1/2', 访问用户: 3530 },
    //     { 日期: '1/3', 访问用户: 2923 },
    //     { 日期: '1/4', 访问用户: 1723 },
    //     { 日期: '1/5', 访问用户: 3792 },
    //     { 日期: '1/6', 访问用户: 4593 },
    //   ],
    // },
    pieChartData() {
      const columns = ['性别', '用户数']
      const rows = []

      rows.push(
        {
          性别: '男',
          用户数: this.maleUser,
        },
        {
          性别: '女',
          用户数: this.femaleUser,
        },
        {
          性别: '未知',
          用户数: this.unknownUser,
        }
      )

      return {
        columns,
        rows,
      }
    },
  },
  methods: {
    ...mapActions(['queryGeneralStatistics', 'queryTotalUser', 'queryUserStatistics']),
    //导出的方法
    export2Excel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../excel/Export2Excel')
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
    Promise.all([
      this.queryGeneralStatistics(),
      this.queryUserStatistics(),
      this.queryTotalUser({
        timeInterval: 10,
        itemCount: 10,
      }).catch((err) => {
        console.error('error in query statistics, error: ', err)
      }),
    ])
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
</style>

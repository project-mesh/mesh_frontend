<template>
  <a-layout style="background: #fff">
    <a-layout-content style="margin: 0 16px">
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <a-card title="总体数据" :style="{ height: '100%' }">
            <ve-histogram :data="histoChartData" :settings="histoChartSettings"></ve-histogram>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel('histoChart')">导出数据到本地</a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户分布" :style="{ height: '100%' }">
            <ve-map :data="mapChartData" :settings="mapChartSettings"></ve-map>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel('mapChart')">导出数据到本地</a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户总数" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit">
              <a-radio-group default-value="a">
                <a-radio-button value="a" @click="lineChartShowSevenAction">
                  七日用户量
                </a-radio-button>
                <a-radio-button value="b" @click="lineChartShowThirtyAction">
                  三十日用户量
                </a-radio-button>
              </a-radio-group>
            </div>
            <ve-line v-if="lineChartShowSeven" :data="lineChartSevenData"></ve-line>
            <ve-line v-if="!lineChartShowSeven" :data="lineChartThirtyData"></ve-line>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel('lineChart')">导出数据到本地</a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户构成" :style="{ height: '100%' }">
            <div slot="extra" style="height: inherit">
              <a-radio-group default-value="a">
                <a-radio-button value="a" @click="pieChartShowAgeAction">年龄比例</a-radio-button>
                <a-radio-button value="b" @click="pieChartShowGenderAction">
                  性别比例
                </a-radio-button>
              </a-radio-group>
            </div>
            <ve-pie v-if="pieChartShowAge" :data="pieChartAgeData"></ve-pie>
            <ve-pie v-if="!pieChartShowAge" :data="pieChartGenderData"></ve-pie>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel('pieChart')">导出数据到本地</a-button>
            </div>
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
    this.rowDataForExcel = []
    this.mapChartSettings = {
      mapOrigin: China,
    }
    this.histoChartSettings = {
      axisSite: { right: ['团队平均成员数', '团队平均项目数'] },
      yAxisType: ['KMB', 'normal'],
      yAxisName: ['在线用户', '平均数'],
    }
    return {
      pieChartShowAge: true,
      lineChartShowSeven: true,
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
    lineChartSevenData() {
      const columns = ['日期', '总用户量']
      const rows = []
      const curDate = new Date()
      let month = curDate.getMonth() + 1
      let date = curDate.getDate()
      rows.push({
        日期: month + '/' + date,
        总用户量: this.currentTotalUser,
      })
      if (this.historyTotalUser[0]) {
        for (let i = 1; i < 7; ++i) {
          let historyDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * i)
          let month = historyDate.getMonth() + 1
          let date = historyDate.getDate()
          rows.push({
            日期: month + '/' + date,
            总用户量: this.historyTotalUser[i - 1].totalUser,
          })
        }
      }
      return {
        columns,
        rows: rows.reverse(),
      }
    },
    lineChartThirtyData() {
      const columns = ['日期', '总用户量']
      const rows = []
      const curDate = new Date()
      let month = curDate.getMonth() + 1
      let date = curDate.getDate()
      rows.push({
        日期: month + '/' + date,
        总用户量: this.currentTotalUser,
      })
      if (this.historyTotalUser[0]) {
        for (let i = 1; i < 30; ++i) {
          let historyDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * i)
          let month = historyDate.getMonth() + 1
          let date = historyDate.getDate()
          rows.push({
            日期: month + '/' + date,
            总用户量: this.historyTotalUser[i - 1].totalUser,
          })
        }
      }
      return {
        columns,
        rows: rows.reverse(),
      }
    },
    histoChartData() {
      const columns = ['日期', '当前在线用户数', '团队平均成员数', '团队平均项目数']
      const rows = []
      rows.push({
        日期: '获取时间：' + this.formatTimestamp(),
        当前在线用户数: this.currentOnlineUser,
        团队平均成员数: this.avgTeamUser,
        团队平均项目数: this.avgTeamProject,
      })
      return {
        columns,
        rows,
      }
    },
    mapChartData() {
      const columns = ['位置', '用户数']
      const rows = []
      if (this.userLocation === undefined) {
        return { columns, rows }
      }
      for (let i = 0; i < this.userLocation.length; ++i) {
        let location = this.userLocation[i].location

        if (location.endsWith('省')) {
          location = location.slice(0, -1)
        } else if (location.endsWith('维吾尔自治区')) {
          location = location.slice(0, -6)
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
    pieChartGenderData() {
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
    pieChartAgeData() {
      const columns = ['年龄段', '用户数']
      const rows = []
      let userAges = new Array(0, 0, 0, 0, 0, 0, 0)
      for (let item in this.userAge) {
        if (this.userAge[item].age <= 0) {
          userAges[6] += this.userAge[item].userCount
        } else if (this.userAge[item].age <= 18) {
          userAges[0] += this.userAge[item].userCount
        } else if (this.userAge[item].age <= 29) {
          userAges[1] += this.userAge[item].userCount
        } else if (this.userAge[item].age <= 39) {
          userAges[2] += this.userAge[item].userCount
        } else if (this.userAge[item].age <= 49) {
          userAges[3] += this.userAge[item].userCount
        } else if (this.userAge[item].age <= 59) {
          userAges[4] += this.userAge[item].userCount
        } else if (this.userAge[item].age >= 60) {
          userAges[5] += this.userAge[item].userCount
        }
      }
      rows.push(
        {
          年龄段: '18岁及以下',
          用户数: userAges[0],
        },
        {
          年龄段: '19岁-29岁',
          用户数: userAges[1],
        },
        {
          年龄段: '29岁-39岁',
          用户数: userAges[2],
        },
        {
          年龄段: '39岁-49岁',
          用户数: userAges[3],
        },
        {
          年龄段: '49岁-59岁',
          用户数: userAges[4],
        },
        {
          年龄段: '60岁及以上',
          用户数: userAges[5],
        },
        {
          年龄段: '未填写年龄',
          用户数: userAges[6],
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
    pieChartShowAgeAction() {
      this.pieChartShowAge = true
    },
    pieChartShowGenderAction() {
      this.pieChartShowAge = false
    },
    lineChartShowSevenAction() {
      this.lineChartShowSeven = true
    },
    lineChartShowThirtyAction() {
      this.lineChartShowSeven = false
    },
    formatTimestamp() {
      let formatDate = new Date()
      let year = formatDate.getFullYear()
      let month = formatDate.getMonth() + 1
      let date = formatDate.getDate()
      let hour = formatDate.getHours()
      let minute = formatDate.getMinutes()
      let currentDate = year + '-'
      function add0(m) {
        return m < 10 ? '0' + m : m
      }
      currentDate += add0(month) + '-' + add0(date) + ' ' + add0(hour) + ':' + add0(minute)
      return currentDate
    },
    //导出的方法
    export2Excel(excel_type) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../excel/Export2Excel')
        if (excel_type === 'mapChart') {
          const tHeader = ['位置', '用户数']
          const filterVal = ['location', 'userCount']
          const list = this.userLocation
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '用户分布数据')
        } else if (excel_type === 'histoChart') {
          const tHeader = ['日期', '当前在线用户数', '团队平均成员数', '团队平均项目数']
          const data = [
            [this.formatTimestamp(), this.currentOnlineUser, this.avgTeamUser, this.avgTeamProject],
          ]
          export_json_to_excel(tHeader, data, '总体数据')
        } else if (excel_type === 'pieChart') {
          if (!this.pieChartShowAge) {
            const tHeader = ['性别', '用户数']
            const data = [
              ['男', this.maleUser],
              ['女', this.femaleUser],
              ['未知', this.unknownUser],
            ]
            export_json_to_excel(tHeader, data, '性别分布数据')
          } else {
            const tHeader = ['年龄', '用户数']
            const filterVal = ['age', 'userCount']
            const list = this.userAge
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '年龄分布数据')
          }
        } else {
          const tHeader = ['时间', '用户数']
          const filterVal = ['日期', '总用户量']
          const list = this.lineChartThirtyData.rows
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '用户量变化数据')
        }
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
        timeInterval: 1, //单位是天
        itemCount: 29, //加上当前用户量正好一共30条
      }).catch((err) => {}),
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

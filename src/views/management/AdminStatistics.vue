<template>
  <a-layout style="background: #fff">
    <a-layout-content style="margin: 0 16px">
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <a-card title="总体数据" :style="{ height: '100%' }">
            <ve-histogram :data="histoChartData" :settings="histoChartSettings"></ve-histogram>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel">导出数据到本地</a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :sm="24" :md="10" class="col">
          <a-card title="用户分布" :style="{ height: '100%' }">
            <ve-map :data="mapChartData" :settings="mapChartSettings"></ve-map>
            <div slot="actions" style="height: inherit">
              <a-button type="primary" @click="export2Excel">导出数据到本地</a-button>
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
              <a-button type="primary" @click="export2Excel">导出数据到本地</a-button>
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
              <a-button type="primary" @click="export2Excel">导出数据到本地</a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import projectMixin from '@/utils/mixins/projectMixin'
import teamMixin from '@/utils/mixins/teamMixin'
import China from 'echarts/map/json/china.json'

export default {
  name: 'Statistics',
  components: {},
  mixins: [teamMixin, projectMixin],
  data() {
    this.mapChartSettings = {
      mapOrigin: China,
    }
    this.histoChartSettings = {
      axisSite: { right: ['团队平均成员数', '团队平均项目数'] },
      yAxisType: ['KMB', 'normal'],
      yAxisName: ['在线用户量', '平均数'],
    }
    return {
      pieChartShowAge: true,
      lineChartShowSeven: true,
      mapChartData: {
        columns: ['位置', '用户数'],
        rows: [
          { 位置: '吉林', 用户数: 123 },
          { 位置: '北京', 用户数: 1223 },
          { 位置: '上海', 用户数: 2123 },
          { 位置: '浙江', 用户数: 4123 },
        ],
      },
      lineChartSevenData: {
        columns: ['日期', '总用户量'],
        rows: [
          { 日期: '1/1', 总用户量: 1393 },
          { 日期: '1/2', 总用户量: 3530 },
          { 日期: '1/3', 总用户量: 2923 },
          { 日期: '1/4', 总用户量: 1723 },
          { 日期: '1/5', 总用户量: 3792 },
          { 日期: '1/6', 总用户量: 4593 },
          { 日期: '1/7', 总用户量: 4593 },
        ],
      },
      lineChartThirtyData: {
        columns: ['日期', '总用户量'],
        rows: [
          { 日期: '1/1', 总用户量: 1393 },
          { 日期: '1/2', 总用户量: 3530 },
          { 日期: '1/3', 总用户量: 2923 },
          { 日期: '1/4', 总用户量: 1723 },
          { 日期: '1/5', 总用户量: 3792 },
          { 日期: '1/6', 总用户量: 4593 },
          { 日期: '1/7', 总用户量: 4593 },
          { 日期: '1/8', 总用户量: 1393 },
          { 日期: '1/9', 总用户量: 3530 },
          { 日期: '1/10', 总用户量: 2923 },
          { 日期: '1/11', 总用户量: 1723 },
          { 日期: '1/12', 总用户量: 3792 },
          { 日期: '1/13', 总用户量: 4593 },
          { 日期: '1/14', 总用户量: 4593 },
          { 日期: '1/15', 总用户量: 1393 },
          { 日期: '1/16', 总用户量: 3530 },
          { 日期: '1/17', 总用户量: 2923 },
          { 日期: '1/18', 总用户量: 1723 },
          { 日期: '1/19', 总用户量: 3792 },
          { 日期: '1/20', 总用户量: 4593 },
          { 日期: '1/21', 总用户量: 4593 },
          { 日期: '1/22', 总用户量: 1393 },
          { 日期: '1/23', 总用户量: 3530 },
          { 日期: '1/24', 总用户量: 2923 },
          { 日期: '1/25', 总用户量: 1723 },
          { 日期: '1/26', 总用户量: 3792 },
          { 日期: '1/27', 总用户量: 4593 },
          { 日期: '1/28', 总用户量: 4593 },
          { 日期: '1/29', 总用户量: 4593 },
          { 日期: '1/30', 总用户量: 4593 },
        ],
      },
      histoChartData: {
        columns: ['日期', '当前在线用户数', '团队平均成员数', '团队平均项目数'],
        rows: [
          {
            日期: Date().toLocaleString(),
            当前在线用户数: 100,
            团队平均成员数: 8.71,
            团队平均项目数: 2.98,
          },
        ],
      },
      pieChartAgeData: {
        columns: ['年龄段', '用户数'],
        rows: [
          { 年龄段: '18岁及以下', 用户数: 1393 },
          { 年龄段: '19岁-29岁', 用户数: 3530 },
          { 年龄段: '29岁-39岁', 用户数: 2923 },
          { 年龄段: '39岁-49岁', 用户数: 1723 },
          { 年龄段: '49岁-59岁', 用户数: 3792 },
          { 年龄段: '60岁及以上', 用户数: 4593 },
          { 年龄段: '未填写年龄', 用户数: 1123 },
        ],
      },
      pieChartGenderData: {
        columns: ['性别', '用户数'],
        rows: [
          { 性别: '男性', 用户数: 1393 },
          { 性别: '女性', 用户数: 3530 },
          { 性别: '未知', 用户数: 2923 },
        ],
      },
    }
  },
  computed: {},
  methods: {
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
  mounted() {},
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

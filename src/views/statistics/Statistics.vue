<template>
  <a-layout>
    <a-layout-content style="margin: 0 16px;">
      <a-breadcrumb style="margin: 16px 0;">
        <a-breadcrumb-item>项目</a-breadcrumb-item>
        <a-breadcrumb-item>统计</a-breadcrumb-item>
      </a-breadcrumb>
      <a-row :gutter="24" class="row">
        <a-col :sm="24" :md="10" class="col">
          <chart-card title="总销售量">
            <a-icon type="buy" slot="action" />
            <span slot="total">$ 100.00</span>
            <span>
              周同比 12%
            </span>
          </chart-card>
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
export default {
  name: 'Statistics',
}
</script>

<style scoped>
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
</style>

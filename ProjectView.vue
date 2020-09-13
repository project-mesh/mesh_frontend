
<template>
<div class="dd">
  <div class="aa">
    <a-button @click="showModal">
      添加分组
    </a-button>
    <a-modal v-model="visible" title="分组名称" @ok="handleOk">
      <a-input ref="userNameInput" v-model="userName" placeholder="Basic usage">
      <a-icon slot="prefix" type="user" />
      <a-tooltip slot="suffix" title="Extra information">
        <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
      </a-tooltip>
    </a-input>
    </a-modal>
  </div>
  <br />
  <div class="hh">
    <a-button type="primary" @click="showDrawer"> <a-icon type="plus" /> 开发中 </a-button>
    <a-drawer
      title="项目详情"
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-form :form="form" layout="vertical" hide-required-mark>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="名称">
              <a-input
                v-decorator="[
                  'name',
                  {
                    rules: [{ required: true, message: 'Please enter user name' }],
                  },
                ]"
                placeholder="Please enter project name"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="成员">
              <a-select
                v-decorator="[
                  'owner',
                  {
                    rules: [{ required: true, message: 'Please select an owner' }],
                  },
                ]"
                placeholder="Please choose project member"
              >
                <a-select-option value="xiao">
                  xxx
                </a-select-option>
                <a-select-option value="mao">
                  xxxx
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="截止日期">
              <a-select
                v-decorator="[
                  'approver',
                  {
                    rules: [{ required: true, message: 'Please choose the approver' }],
                  },
                ]"
                placeholder="Please enter the deadline"
              >
                <a-select-option value="jack">
                  xxxx
                </a-select-option>
                <a-select-option value="tom">
                  xxx
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="优先级">
              <a-radio-group name="radioGroup" :default-value="1">
                <a-radio :value="1">
                  重要
                </a-radio>
                <a-radio :value="2">
                  较高
                </a-radio>
                <a-radio :value="3">
                  普通
                </a-radio>
                <a-radio :value="4">
                  较低
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>  
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="描述">
              <a-textarea
                v-decorator="[
                  'description',
                  {
                    rules: [{ required: true, message: 'Please enter url description' }],
                  },
                ]"
                :rows="4"
                placeholder="please enter the description"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="onClose">
          提交
        </a-button>
      </div>
    </a-drawer>
  </div>

  <div class="project-list1">
    <a-list item-layout="horizontal" :data-source="data1">
        <a-list-item slot="renderItem" slot-scope="item, index">
        <a slot="actions" @click="showDrawer">编辑</a>
        <a slot="actions" @click="showDrawer">更多</a>
        <a-list-item-meta
          description="摸鱼大法"
        >
        <a slot="title">{{ item.title }}</a>
        </a-list-item-meta>
        <a-table :columns="columns" :data-source="data2" :pagination="false" :showHeader="false" >
          <!--<a slot="name" slot-scope="text">{{ text }}</a>-->
          <span slot="name" slot-scope="text"> </span>
          <span slot="age" slot-scope="text"> </span>
          <span slot="address" slot-scope="text"> </span>
          <span slot="tags" slot-scope="text"> </span>
        </a-table>        
      </a-list-item>
    </a-list>
  </div>
</div>
</template>

<script>
const data1 = [
  {
    title: '项目1',
  },
  {
    title: '项目2',
  },
  {
    title: '项目3',
  },
  {
    title: '项目4',
  },
];
const data2 = [
  {
    key: '1',
    name: '负责人',
    age: '截止日期',
    address: '状态',
    tags: '优先级',
  },
  {
    key: '2',
    name: 'John Brown',
    age: '2020-10-05',
    address: '进行中',
    tags: '重要',
  },
];
const columns = [
  {
    title: '负责人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '截止时间',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '状态',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '优先级',
    key: 'tags',
    dataIndex: 'tags',
  },
];
export default {
  data() {
    return {
      data1,
      data2,
      columns,
      form: this.$form.createForm(this),
      visible: false,
      visible: false,
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
  },
};
</script>

<style></style>

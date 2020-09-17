<template>
  <a-collapse accordion>
    <a-collapse-panel
      v-for="(subTask, subTaskIndex) in subTasks"
      :key="subTaskIndex"
      :header="subTask.taskName"
    >
      <div slot="extra">
        <a-icon
          class="panel-icon"
          @click="deletSubTask($event, subTask, subTaskIndex)"
          key="sub-delete"
          type="delete"
        />
        <a-icon
          type="edit"
          class="panel-icon"
          key="sub-edit"
          @click="editSubTask(subTask)"
        ></a-icon>
        <a-icon
          class="panel-icon"
          @click="finishSubTask($event, subTask, subTaskIndex)"
          key="sub-check-square"
          :type="subTask.isFinished ? 'check-square' : 'border'"
        />
      </div>
      <a-descriptions v-if="!isEditing" class="drawer-content" size="small" column="3">
        <a-descriptions-item label="创建者">
          {{ subTask.founder }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="2">
          {{ formatTimeStamp(subTask.createTime) }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人">{{ subTask.principal }}</a-descriptions-item>
        <a-descriptions-item label="已完成" span="2">
          {{ subTask.isFinished ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="3">{{ subTask.description }}</a-descriptions-item>
      </a-descriptions>
      <a-form v-else :form="form">
        <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input
            v-decorator="['taskName', { rules: [{ required: true, message: '请输入子任务名称' }] }]"
            name="taskName"
            placeholder="请输入子任务名称"
          />
        </a-form-item>

        <a-form-item
          label="负责人"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :required="true"
        >
          <a-select @focus="focus" ref="select" @change="handleChange">
            <a-select-option
              v-for="member in projectMembers"
              :key="member.username"
              :value="member.username"
            >
              {{ member.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-textarea
            rows="1"
            placeholder="请输入该子任务的详细描述"
            v-decorator="[
              'description',
              { rules: [{ required: false, message: '请输入该子任务的详细描述' }] },
            ]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
          <a-button html-type="submit" type="primary">提交</a-button>
          <a-button style="margin-left: 8px">保存</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel disabled :show-arrow="false">
      <a-input
        v-model="newSubTaskName"
        slot="header"
        placeholder="按enter添加 按esc退出"
        @keypress.enter="finishEditing"
        @keypress.esc="exitEditing"
        @blur="exitEditing"
      ></a-input>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import dateFilter from './common/dataFilter'
dateFilter(Vue)
export default {
  model: {
    prop: 'subTasks',
    event: 'update-sub-task',
  },
  data() {
    return {
      labelCol: { lg: { span: 4 }, sm: { span: 2 } },
      wrapperCol: { lg: { span: 16 }, sm: { span: 12 } },

      isEditing: false,
      activeKey: [],
      newSubTaskName: '',
    }
  },
  props: {
    subTasks: {
      type: Array,
      default: function () {
        return [
          {
            taskId: 'aklgnlkzzzld',
            taskName: '子任务名',
            isFinished: true,
            createTime: '16546513231',
            description: '子任务描述',
            founder: '子任务创建者',
            principal: '子任务负责人',
          },
          {
            taskId: 'aklgnlkjsald',
            taskName: '子任务名2',
            isFinished: false,
            createTime: '1654653445',
            description: '子任务描述2',
            founder: '子任务创建者2',
            principal: '子任务负责人2',
          },
        ]
      },
    },
  },
  methods: {
    formatTimeStamp: function (timeStamp) {
      return moment(timeStamp).format('YYYY-MM-DD')
    },
    deleteSubTask: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      this.$emit('update-sub-task', subTaskIndex)
      this.$set(this.subTasks[subTaskIndex], 'isFinished', !subTask.isFinished)
    },
    finishSubTask: function (event, subTask, subTaskIndex) {
      event.stopPropagation()
      this.$emit('update-sub-task', subTaskIndex)
      this.$set(this.subTasks[subTaskIndex], 'isFinished', !subTask.isFinished)
    },
    editSubTask: function (subTask) {
      this.isEditing = true
      this.$message.info(subTask.subTaskName)
    },
    finishEditing: function () {
      if (this.newSubTaskName) {
        this.$message.info('新建项目：' + this.newSubTaskName)
        this.addTask()
      }
    },
  },
}
</script>
<style scoped>
.panel-icon {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
>

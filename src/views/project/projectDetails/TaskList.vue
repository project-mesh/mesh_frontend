<template>
  <a-card :bordered="false" :loading="boardLoading">
    <br />
    <div>
      <a-button type="primary" @click="tryAddNewTask">
        <a-icon type="plus" />
        开发中
      </a-button>
      <a-drawer
        title="drawerTitle"
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
                    'taskName',
                    {
                      rules: [{ required: true, message: '请输入任务名' }],
                    },
                  ]"
                  placeholder="任务名"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="成员">
                <a-select
                  v-decorator="[
                    'principal',
                    {
                      rules: [{ required: true, message: '请选择负责人' }],
                    },
                  ]"
                  placeholder="负责人"
                >
                  <a-select-option
                    v-for="member in projectMembers"
                    :key="member.username"
                    :value="member.username"
                  >
                    {{ member.username }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="截止日期">
                <a-input
                  v-decorator="[
                    'deadline',
                    {
                      rules: [{ required: true, message: '请选择截止日期' }],
                    },
                  ]"
                  placeholder="截至日期"
                >
                  <!-- <a-select-option value="jack">xxxx</a-select-option>
                  <a-select-option value="tom">xxx</a-select-option> -->
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="优先级">
                <a-radio-group name="radioGroup" v-decorator="['priority']">
                  <a-radio :value="1">普通</a-radio>
                  <a-radio :value="2">较高</a-radio>
                  <a-radio :value="3">极高</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="24">
              <a-form-item label="描述">
                <a-textarea v-decorator="['description']" :rows="4" placeholder="任务描述" />
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
          <a-button :style="{ marginRight: '8px' }" @click="onClose">取消</a-button>
          <a-button type="primary" @click="isCreateTask ? handleCreateTask() : handleUpdateTask()">
            {{ isCreateTask ? '创建' : '更新' }}
          </a-button>
        </div>
      </a-drawer>
    </div>

    <div class="project-list1">
      <a-list item-layout="horizontal" :data-source="taskStatus">
        <a-list-item slot="renderItem" slot-scope="status">
          <a-list-item-meta>
            <a slot="title">{{ status }}</a>
          </a-list-item-meta>
          <a-table
            :bordered="false"
            :columns="columns"
            :data-source="classifiedTasks(status)"
            row-key="taskId"
            :pagination="false"
            style="width: 60%"
          >
            <!--<a slot="name" slot-scope="text">{{ text }}</a>-->
            <span slot="createTime" slot-scope="text">{{ new Date(+text).toLocaleString() }}</span>
            <template slot="action" slot-scope="text, task">
              <a @click="editTask(task)">更多</a>
            </template>
          </a-table>
        </a-list-item>
      </a-list>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal',
  },
  {
    title: '任务名',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    title: '截止日期',
    key: 'deadline',
    dataIndex: 'deadline',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

import { mapGetters, mapActions } from 'vuex'
import pick from 'lodash.pick'
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'

export default {
  mixins: [teamMixin, projectMixin],
  data() {
    return {
      columns,
      form: this.$form.createForm(this),
      visible: false,
      selectedTask: null,
      taskStatus: ['开发中', '已完成', '已逾期'],
      boardLoading: false,
      isCreateTask: false,
      tasks: [
        {
          status: '开发中',
          tasks: [],
        },
        {
          status: '已逾期',
          tasks: [],
        },
        {
          status: '已完成',
          tasks: [],
        },
      ],
    }
  },
  methods: {
    ...mapActions(['queryProjectTasks', 'createTask']),
    openDrawer() {
      this.visible = true
    },
    closeDrawer() {
      this.visible = false
    },
    handleCreateTask() {
      this.closeDrawer()

      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values: ', values)

          this.createTask({
            username: this.username,
            projectId: this.projectId,
            taskName: values.taskName,
            priority: values.priority,
            deadline: values.deadline,
            description: values.description,
            principal: values.principal,
          }).then((res) => {})
        }
      })
    },
    handleUpdateTask() {
      this.closeDrawer()
    },
    tryAddNewTask() {
      this.isCreateTask = true
      this.selectedTask = null
      this.openDrawer()
      console.log(this.projectMembers)
      this.$nextTick(() => {
        this.form.setFieldsValue({
          taskName: '',
          principal: '',
          deadline: '',
          priority: 1,
          description: '',
        })
      })
    },
    editTask(task) {
      this.isCreateTask = false
      this.selectedTask = task
      this.openDrawer()
      console.log(this.projectMembers)
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.selectedTask, ['taskName', 'principal', 'deadline', 'priority', 'description'])
        )
      })
    },
    classifiedTasks(status) {
      return this.tasks.find((taskList) => taskList.status === status).tasks
    },
  },
  computed: {
    ...mapGetters(['projectMembers', 'projectTasks', 'username', 'projectId', 'teamId']),
  },
  mounted() {
    if (!this.projectTasks || this.projectTasks.length === 0) {
      this.boardLoading = true

      this.queryProjectTasks({
        username: this.username,
        projectId: this.$route.query.projectId,
      })
        .then((res) => {
          const { tasks: resTasks } = res.data

          resTasks.forEach((task) => {
            this.tasks.find((taskList) => taskList.status === task.status).tasks.push(task)
          })
        })
        .catch((err) => {
          this.$notification.error({
            message: '查询项目任务失败',
            description: err.message,
          })
        })
        .finally(() => (this.boardLoading = false))
    } else {
      this.projectTasks.forEach((task) => {
        this.tasks.find((taskList) => taskList.status === task.status).tasks.push(task)
      })
    }

    this.$emit('load', 'taskList')
  },
}
</script>

<style></style>

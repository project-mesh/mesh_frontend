<template>
  <div class="board">
    <div class="task-group" v-for="status in allStatus" :key="status">
      <div class="topbutton">
        <a-button type="primary" @click="showDrawer">
          <a-icon type="plus" />
          {{ status }}
        </a-button>
      </div>

      <div class="info-list">
        <a-list item-layout="horizontal" :data-source="getStatusTasks(status)">
          <a-list-item slot="renderItem" slot-scope="task">
            <a slot="actions" @click="showDrawer">更多</a>
            <a-list-item-meta :description="task.description">
              <a slot="title" style="font-size: 17px">{{ task.taskName }}</a>
            </a-list-item-meta>
            <div class="description" style="width: 35%">
              <a-descriptions layout="vertical" :column="6" size="small">
                <a-descriptions-item :span="1" label="负责人">
                  {{ task.principal }}
                </a-descriptions-item>
                <a-descriptions-item :span="2" label="截止日期">
                  {{ task.deadline }}
                </a-descriptions-item>
                <a-descriptions-item :span="2" label="创建时间">
                  {{ moment(+task.createTime).format('YYYY-MM-DD hh:mm') }}
                </a-descriptions-item>
                <a-descriptions-item :span="1" label="优先级">
                  {{ getTextTaskPriority(task.priority) }}
                </a-descriptions-item>
              </a-descriptions>
            </div>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import teamMixin from '@/utils/mixins/teamMixin'
import projectMixin from '@/utils/mixins/projectMixin'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

const data1 = [
  {
    title: '项目1',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目2',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目3',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目4',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
]
const data2 = [
  {
    title: '项目1',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目2',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目3',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
  {
    title: '项目4',
    description: 'asdfghjklssdfghjk',
    name: 'John',
    deadline: '2020-12-21',
    state: '已完成',
    priority: '重要',
  },
]

export default {
  mixins: [teamMixin, projectMixin],
  data() {
    return {
      data1,
      data2,
      form: this.$form.createForm(this),
      visible: false,
      allStatus: ['开发中', '已完成', '已逾期'],
      moment,
    }
  },
  computed: {
    ...mapGetters(['projectTasks']),
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    getStatusTasks(status) {
      return this.projectTasks.filter((task) => task.status === status)
    },
    getTextTaskPriority(priorityNumber) {
      switch (priorityNumber) {
        case 0:
          return '极低'
        case 1:
          return '普通'
        case 2:
          return '较高'
        case 3:
          return '极高'
        default:
          return '未知优先级'
      }
    },
  },
}
</script>

<style>
.task-group {
  padding: 20px;
}

.task-group:not(:last-of-type) {
  margin-bottom: 40px;
}
</style>

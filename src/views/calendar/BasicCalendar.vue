<template>
  <div>
    <div id="calendar">
      <span id="calendarTitle">日历</span>
      <span id="calendarConfig">
        <a-checkbox @change="onOnlyNotFinishedChange">仅显示未完成</a-checkbox>
        <a-checkbox @change="onOnlyViewMineChange">只看我负责的</a-checkbox>
        <a-select
          id="programSelector"
          default-value="_allProjects"
          style="width: 120px"
          @change="handleSelectedProjectChange"
        >
          <a-select-option value="_allProjects">所有项目</a-select-option>
          <a-select-option
            v-for="item in teamProjects"
            :key="item.projectName"
            :value="item.projectName"
          >
            {{ item.projectName }}
          </a-select-option>
        </a-select>
        <a-button @click="refreshCalendar">回到本月</a-button>
      </span>
      <a-calendar :key="calendarID">
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getDayData(value)" :key="item.taskId">
            <template
              v-if="
                (item.principal === username || !onlyViewMine) &&
                (!item.isFinished || !onlyNotFinished) &&
                (item.projectName === selectedProject || selectedProject === '_allProjects')
              "
            >
              <a-checkbox
                :disabled="![item.principal, teamAdminName].includes(username)"
                :checked="item.isFinished"
                @change="onProjectFinishedChange"
                :value="[item.taskId, item.projectId]"
              ></a-checkbox>
              <div @click="handleClickOnTask(item)" id="taskCheckbox">
                {{ item.taskName }}
              </div>
              <div @click="handleClickOnTask(item)" id="taskPriciple">
                {{ item.principal }}
              </div>
              <div @click="handleClickOnTask(item)" id="projectName">
                项目：{{ item.projectName }}
              </div>
            </template>
          </li>
        </ul>
      </a-calendar>
    </div>
    <a-modal width="60" v-model="viewTaskForm" title="任务详情" centered>
      <a-breadcrumb separator=">">
        <a-breadcrumb-item>
          <router-link
            :to="{ name: 'statistics', query: { teamId, projectId: selectedTask.projectId } }"
          >
            {{ selectedTask.projectName }}
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ selectedTask.status }}</a-breadcrumb-item>
      </a-breadcrumb>
      <div id="taskPriorityView">
        <a-icon type="warning" />
        <span>任务优先级：{{ getTextTaskPriority(selectedTask.priority) }}</span>
      </div>
      <a-descriptions id="taskDescription" bordered>
        <a-descriptions-item label="任务名">
          {{ selectedTask.taskName }}
        </a-descriptions-item>
        <a-descriptions-item label="截止日期">
          {{ selectedTask.deadline }}
        </a-descriptions-item>
        <a-descriptions-item label="创建者">
          {{ selectedTask.founder }}
        </a-descriptions-item>
        <a-descriptions-item label="任务状态">
          {{ selectedTask.status }}
        </a-descriptions-item>
        <a-descriptions-item label="创建日期">
          {{ formatTimestamp(selectedTask.createTime) }}
        </a-descriptions-item>
        <a-descriptions-item label="负责人">
          {{ selectedTask.principal }}
        </a-descriptions-item>
        <a-descriptions-item label="任务描述">
          {{ selectedTask.description }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import teamMixin from '@/utils/mixins/teamMixin'

export default {
  mixins: [teamMixin],
  data() {
    return {
      calendarID: +new Date(),
      onlyViewMine: false,
      onlyNotFinished: false,
      selectedProject: '_allProjects',
      viewTaskForm: false,
      selectedTask: [],
    }
  },
  computed: mapGetters(['teamTasks', 'username', 'teamId', 'teamAdminName', 'teamProjects']),
  methods: {
    ...mapActions(['queryTeamTasks', 'updateTask']),
    //点击切换任务是否完成
    onProjectFinishedChange(e) {
      let taskUpdated = this.teamTasks.find(
        (currentTask) =>
          currentTask.taskId === e.target.value[0] && currentTask.projectId === e.target.value[1]
      )
      taskUpdated.isFinished = e.target.checked
      this.updateTask({
        username: this.username,
        taskId: e.target.value[0],
        projectId: e.target.value[1],
        isFinished: e.target.checked,
      })
        .then(() => {
          this.$notification.success({
            description: '设置任务状态成功',
          })
        })
        .catch((error) => {
          this.$notification.error({
            message: '设置任务状态失败',
            description: `${error.name}: ${error.message}`,
          })
        })
    },
    getListData(value, granularity) {
      const listData = this.teamTasks.filter((task) => {
        const date = moment(task.deadline, 'YYYY-MM-DD')
        return date.isSame(value, granularity)
      })

      return listData || []
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
    getMonthData(value) {
      return this.getListData(value, 'month')
    },

    getDayData(value) {
      return this.getListData(value, 'day')
    },

    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
    },

    handleSelectedProjectChange(value) {
      this.selectedProject = value
    },
    handleClickOnTask(item) {
      this.viewTaskForm = true
      this.selectedTask = item
    },
    // 这个方法用来重置 calendar 控件为初始状态。参见 https://segmentfault.com/a/1190000016629544
    refreshCalendar() {
      return (this.calendarID = +new Date())
    },
    formatTimestamp(time) {
      let formatDate = new Date(time)
      let year = formatDate.getFullYear()
      let month = formatDate.getMonth() + 1
      let date = formatDate.getDate()
      let currentDate = year + '-'
      if (month >= 10) {
        currentDate += month + '-'
      } else {
        currentDate += '0' + month + '-'
      }
      if (date >= 10) {
        currentDate += date
      } else {
        currentDate += '0' + date
      }
      return currentDate
    },
  },
  mounted() {
    this.queryTeamTasks({ username: this.username, teamId: this.$route.query.teamId })
      .then(() => {
        this.$notification.success({
          description: '成功获取团队任务',
        })
      })
      .catch((error) => {
        this.$notification.error({
          message: '获取团队任务失败',
          description: `${error.name}: ${error.message}`,
        })
      })
  },
}
</script>
<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
#calendar {
  margin: 1em;
}
#calendarTitle {
  font-weight: bold;
  font-size: 125%;
}
#taskPriciple {
  text-align: center;
  font-size: 80%;
  font-weight: lighter;
  display: inline;
}
#projectName {
  text-align: center;
  font-size: 80%;
  font-weight: lighter;
}
#calendarTitle {
  display: block;
}
#taskCheckbox {
  display: inline;
}
#calendarConfig {
  display: block;
  text-align: right;
  padding: 8px 16px;
  border-bottom: 1px solid #e3e3e3;
}
#programSelector {
  margin-right: 0.5em;
}
#taskDescription {
  margin: 1em;
}
#taskPriorityView {
  text-align: right;
  margin-right: 1em;
}
</style>

<style>
/* 这段代码改成style scoped会无效 */
.ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value,
.ant-fullcalendar-selected-day .ant-fullcalendar-value {
  background: none !important;
}
.ant-fullcalendar-header .ant-radio-group {
  display: none;
}
</style>

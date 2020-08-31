<template>
  <div id="calendar">
    <span id="calendarTitle">日历</span>
    <span id="calendarConfig">
      <a-checkbox @change="onOnlyNotFinishedChange">
        仅显示未完成
      </a-checkbox>
      <a-checkbox @change="onOnlyViewMineChange">
        只看我的
      </a-checkbox>
      <a-button @click="refreshCalendar">
        回到本月
      </a-button>
      <a-select
        id="programSelector"
        default-value="_allProjects"
        style="width: 120px;"
        @change="handleSelectedProjectChange"
      >
        <a-select-option value="_allProjects">
          所有项目
        </a-select-option>
        <a-select-option
          v-for="item in teamProjects"
          :key="item.projectName"
          :value="item.projectName"
        >
          {{ item.projectName }}
        </a-select-option>
      </a-select>
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
              @change="return false"
            >
              {{ item.taskName }}
            </a-checkbox>
            <div id="projectName">项目：{{ item.projectName }}</div>
          </template>
        </li>
      </ul>
    </a-calendar>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      calendarID: +new Date(),
      onlyViewMine: false,
      onlyNotFinished: false,
      selectedProject: '_allProjects',
    }
  },
  computed: mapGetters(['teamTasks', 'username', 'teamId', 'teamAdminName', 'teamProjects']),
  methods: {
    ...mapActions(['queryTeamTasks']),

    getListData(value, granularity) {
      const listData = this.teamTasks.filter((task) => {
        const date = moment(task.deadline, 'YYYY-MM-DD')
        return date.isSame(value, granularity)
      })

      return listData || []
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
    // 这个方法用来重置 calendar 控件为初始状态。参见 https://segmentfault.com/a/1190000016629544
    refreshCalendar() {
      return (this.calendarID = +new Date())
    },
  },

  mounted() {
    this.queryTeamTasks({ username: this.username, teamId: this.teamId })
      .then((response) => {
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
#projectName {
  text-align: center;
  font-size: 80%;
  font-weight: lighter;
}
#calendarTitle {
  display: block;
}
#calendarConfig {
  display: block;
  text-align: right;
  padding: 8px 16px;
  border-bottom: 1px solid #e3e3e3;
}
#programSelector {
  margin-left: 0.5em;
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

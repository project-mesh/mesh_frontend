<template>
  <div id="calendar">
    <span id="calendarTitle">日历</span>
    <span id="calendarConfig">
      <a-button @click="refreshCalendar">
        回到本月
      </a-button>
    </span>
    <a-calendar :key="calendarID">
      <ul slot="dateCellRender" slot-scope="value" class="events">
        <li v-for="item in getDayData(value)" :key="item.taskId">
          <a-checkbox
            :disabled="![item.principal, teamAdminName].includes(username)"
            :checked="item.isFinished"
            @click="return false"
          >
            {{ item.taskName }}
          </a-checkbox>
          <div id="projectName">项目：{{ item.projectName }}</div>
        </li>
      </ul>
      <ul slot="monthCellRender" slot-scope="value" class="events">
        <li v-for="item in getMonthData(value)" :key="item.taskId">
          <a-checkbox
            :disabled="![item.principal, teamAdminName].includes(username)"
            :checked="item.isFinished"
            @click="return false"
          >
            {{ item.taskName }}
          </a-checkbox>
          <div id="projectName">项目：{{ item.projectName }}</div>
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
    }
  },
  computed: mapGetters(['teamTasks', 'username', 'teamId', 'teamAdminName']),
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
  padding-right: 16px;
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

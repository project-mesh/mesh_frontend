<template>
  <div id="calendar">
    <span id="calendarTitle">日历</span>
    <a-calendar>
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
      <!-- <template slot="monthCellRender" slot-scope="value">
        <div v-if="getMonthData(value)" class="notes-month">
          <section>{{ getMonthData(value) }}月</section>
          <span>宜：摸鱼</span>
        </div>
      </template> -->
    </a-calendar>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import teamMixin from '@/utils/mixins/teamMixin'

export default {
  mixins: [teamMixin],
  computed: mapGetters(['teamTasks', 'username', 'teamId', 'teamAdminName']),
  methods: {
    ...mapActions(['queryTeamTasks']),
    // getListData(value) {
    //   let listData
    //   switch (value.date()) {
    //     case 1:
    //       listData = [{ type: true, content: '预习摸鱼', projectName: '摸鱼大业' }]
    //       break
    //     case 2:
    //       listData = [{ type: false, content: '复习摸鱼', projectName: '摸鱼大业' }]
    //       break
    //     case 3:
    //       listData = [
    //         { type: false, content: '放弃摸鱼', projectName: '摸鱼大业' },
    //         { type: false, content: '开始摸鱼', projectName: '摸鱼大业' },
    //       ]
    //       break
    //     default:
    //   }
    //   return listData || []
    // },

    // getMonthData(value) {
    //   if (value.month() !== 12) {
    //     return value.month()
    //   }
    // },

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
  },

  mounted() {
    this.queryTeamTasks({ username: this.username, teamId: this.$route.query.teamId })
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
</style>

<style>
.ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value,
.ant-fullcalendar-selected-day .ant-fullcalendar-value {
  background: none !important;
}
</style>

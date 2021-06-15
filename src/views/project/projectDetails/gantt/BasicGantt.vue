<template>
  <div>
    <div class="toolbox">
      <!-- <button @click="updateFirstRow">Update first row</button>
     -->
      <a-button-group size="large">
        <a-button type="primary" @click="increaseZoomLevel">
          <a-icon type="minus" />
          缩小
        </a-button>
        <a-button type="primary" @click="decreaseZoomLevel">
          放大
          <a-icon type="plus" />
        </a-button>
      </a-button-group>
    </div>

    <div class="gstc-wrapper" ref="gstc"></div>
  </div>
</template>

<script>
import GSTC from 'gantt-schedule-timeline-calendar'
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js'
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js'
import { Plugin as ItemResizing } from 'gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js'
import { Plugin as ItemMovement } from 'gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js'
import 'gantt-schedule-timeline-calendar/dist/style.css'

let gstc, state

// helper functions

// main component
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'GSTC',
  computed: {
    ...mapGetters(['projectId', 'projectName', 'username', 'projectTasks', 'projectSubTasks']),
  },
  mounted() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */
    const config = {
      licenseKey:
        '====BEGIN LICENSE KEY====\nEZ4nLvdzgCbYHV7YqRSsysJtJvU6l5/g62Z14TOzjeDL2SfpqCPQpNR7AWDLaStjCs83TITTxEVkHuIPX91YlLpIcMAv24QWf4w4RZFbY9eHjGNwNDnqv+Vj6zRNGruBQX5SFXy7q5JldR4qdsoYk0asN6Wyw2FlRXVF0zndqi9q+QfJp8lNQHaApeCFlWcgmWkCFIURlhNWYruX426wkO1hCwKp8m3bPiVVh1ZBqXdNXhcUGW7u5rjDBJfo2FyTHNbJNlvjIP5u9A0qF+cIPbyQpjaa1lp7uGHq9RaA6pPpXYN4cFZjExeeffp6tCmzM/pPih9sFLMmDTcI+YTeNg==||U2FsdGVkX1/FfAGX5lFg5DQDv9D3CYXSGv+kSNWyToyEOyZSQf/BIq4SP9Ydc00gR7D6pwYsIKPydeV3a6dwH07pFfnmOMg7yntc3W6oIDY=\nBlO99icAouFBbzGIi/Psq1MzhKdP94Ug7f9ApsUb3nLKZoCcxwwW2hxxy73mbhJoZJDCDyk+jvny7gKyfOq3Tn0QXL0lUofmvX7Akobp1ymwfakgV2YuEo8O5UPoZp6fju8jCexBChhwMbr30k0BhmJVjXEYl0uxaycB36E37fj25vYVgERxcK/R7O0z45EVmNTLzMpldObt58WmFikmczam+nGGDShOuAYonrMjMNCUc1J7VO6VL/419qS+Qpe80ChXaUtDS81f/Pyc1QZEstzHLvncsgzniJxvxVurujef0o8HZ+z9lyqScU+1m4Bb9WhAzEIX+FoIMHBxsrr2tg==\n====END LICENSE KEY====',
      plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
      list: {
        columns: {
          data: {
            [GSTC.api.GSTCID('id')]: {
              id: GSTC.api.GSTCID('id'),
              width: 60,
              data: ({ row }) => GSTC.api.sourceID(row.id),
              sortable: ({ row }) => Number(GSTC.api.sourceID(row.id)),
              header: {
                content: '编号',
              },
            },
            [GSTC.api.GSTCID('label')]: {
              id: GSTC.api.GSTCID('label'),
              width: 200,
              data: 'label',
              header: {
                content: '任务名',
              },
            },
          },
        },
        rows: this.generateRows(),
      },
      chart: {
        items: this.generateItems(),
      },
    }

    state = GSTC.api.stateFromConfig(config)

    gstc = GSTC({
      element: this.$refs.gstc,
      state,
    })
  },

  beforeUnmount() {
    if (gstc) gstc.destroy()
  },
  methods: {
    ...mapActions(['queryTeamTasks', 'updateTask']),
    updateFirstRow() {
      state.update(`config.list.rows.${GSTC.api.GSTCID('0')}`, (row) => {
        row.label = 'Changed dynamically'
        return row
      })
    },

    increaseZoomLevel() {
      state.update('config.chart.time.zoom', (o) => {
        return o + 1
      })
    },

    decreaseZoomLevel() {
      state.update('config.chart.time.zoom', (o) => {
        return o - 1
      })
    },
    /**
     * @returns { import("gantt-schedule-timeline-calendar").Items }
     */
    generateItems() {
      const items = {}
      for (let i = 0; i < this.projectTasks.length; i++) {
        const task = this.projectTasks[i]
        const taskId = task.taskId
        const founder = task.founder
        const id = GSTC.api.GSTCID('t' + taskId.toString())
        const rowId = GSTC.api.GSTCID(taskId.toString())
        const startTime = GSTC.api.date(task.createTime).startOf('day').valueOf()
        const endTime = GSTC.api.date(task.deadline).endOf('day').valueOf()
        const priorityColor = ['#1890FF', '#52C41A', '#FAAD14', '#F5222D']
        items[id] = {
          id,
          label: founder,
          rowId,
          style: {
            background: priorityColor[task.priority],
          },
          time: {
            start: startTime,
            end: endTime,
          },
        }
      }
      return items
    },
    /**
     * @returns { import("gantt-schedule-timeline-calendar").Rows }
     */
    generateRows() {
      const rows = {}
      for (let i = 0; i < this.projectTasks.length; i++) {
        const task = this.projectTasks[i]
        const taskId = task.taskId
        const id = GSTC.api.GSTCID(taskId.toString())
        rows[id] = {
          id,
          label: task.taskName,
        }
      }
      return rows
    },
  },
}
</script>
<style scoped>
.gstc-component {
  margin: 0;
  padding: 0;
}
.toolbox {
  padding: 10px;
}
</style>

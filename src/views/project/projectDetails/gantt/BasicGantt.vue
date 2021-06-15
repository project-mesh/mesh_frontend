<template>
  <div>
    <div class="toolbox">
      <a-checkbox @change="onOnlyNotFinishedChange">仅显示未完成</a-checkbox>
      <a-checkbox @change="onOnlyViewMineChange">只看我负责的</a-checkbox>
      <a-button-group>
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
  data() {
    return {
      onlyNotFinished: false,
      onlyViewMine: false,
      rows: null,
      items: null,
    }
  },
  mounted() {
    /**
     * @type { import("gantt-schedule-timeline-calendar").Config }
     */
    this.rows = this.generateRows()
    this.items = this.generateItems()
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
        rows: this.rows,
      },
      chart: {
        items: this.items,
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
    filterRows() {
      let res = {}
      for (const key in this.rows) {
        const value = this.rows[key]
        if (this.onlyViewMine && value.principal != this.username) {
          continue
        }
        if (this.onlyNotFinished && value.isFinished) {
          continue
        }
        res[key] = value
      }
      return res
    },
    onOnlyNotFinishedChange(e) {
      this.onlyNotFinished = e.target.checked
      state.update('config.list.rows', (rows) => {
        return this.filterRows()
      })
    },

    onOnlyViewMineChange(e) {
      this.onlyViewMine = e.target.checked
      state.update('config.list.rows', (rows) => {
        return this.filterRows()
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
      const priorityColor = ['#1890FF', '#52C41A', '#FAAD14', '#F5222D']
      const items = {}
      for (const task of this.projectTasks) {
        const taskId = task.taskId
        const id = GSTC.api.GSTCID('t' + taskId.toString())
        const rowId = GSTC.api.GSTCID(taskId.toString())
        const startTime = GSTC.api.date(task.createTime).startOf('day').valueOf()
        const endTime = GSTC.api.date(task.deadline).endOf('day').valueOf()
        items[id] = {
          id,
          label: task.principal,
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
      for (const task of this.projectTasks) {
        const taskId = task.taskId
        const id = GSTC.api.GSTCID(taskId.toString())
        rows[id] = {
          id,
          isFinished: task.isFinished,
          principal: task.principal,
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

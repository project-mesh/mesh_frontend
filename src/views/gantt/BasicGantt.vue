<template>
  <div>
    <div class="toolbox">
      <button @click="updateFirstRow">Update first row</button>
      <button @click="changeZoomLevel">Change zoom level</button>
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

/**
 * @returns { import("gantt-schedule-timeline-calendar").Rows }
 */
function generateRows() {
  const rows = {}
  for (let i = 0; i < this.teamProjects.length; i++) {
    const id = GSTC.api.GSTCID(i.toString())
    const prj = this.teamProjects[i]
    rows[id] = {
      id,
      label: prj.projectName,
    }
  }
  return rows
}

/**
 * @returns { import("gantt-schedule-timeline-calendar").Items }
 */
function generateItems() {
  const items = {}
  let start = GSTC.api.date().startOf('day').subtract(6, 'day')
  for (let i = 0; i < this.teamProjects.length; i++) {
    const id = GSTC.api.GSTCID(i.toString())
    const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * 100).toString())
    const prj = this.teamProjects[i]
    const name = this.teamProjects[i].projectName
    start = start.add(1, 'day')
    items[id] = {
      id,
      label: prj.adminName,
      rowId,
      time: {
        start: start.valueOf(),
        end: start.add(1, 'day').endOf('day').valueOf(),
      },
    }
  }
  return items
}

// main component
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import teamMixin from '@/utils/mixins/teamMixin'

export default {
  name: 'GSTC',
  computed: mapGetters(['teamTasks', 'username', 'teamId', 'teamAdminName', 'teamProjects']),
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
              header: {
                content: 'ID',
              },
            },
            [GSTC.api.GSTCID('label')]: {
              id: GSTC.api.GSTCID('label'),
              width: 200,
              data: 'label',
              header: {
                content: 'Label',
              },
            },
          },
        },
        rows: generateRows(),
      },
      chart: {
        items: generateItems(),
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

    changeZoomLevel() {
      state.update('config.chart.time.zoom', 21)
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

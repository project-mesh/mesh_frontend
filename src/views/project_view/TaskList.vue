<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <div>
    <a-card class="task-list" style="display: inline-block" :title="priorityName">
      <draggable
        group="taskGroup"
        :list="tasks"
        :move="moveTask"
        :animation="200"
        :empty-insert-threshold="200"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <transition-group
          :data-status="status"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="task-info"
            v-for="(task, taskIndex) in tasks"
            :key="taskIndex"
            @click="clickTaskInfo(task)"
          >
            <task-info :task="task"></task-info>
          </div>
        </transition-group>
        <a-button slot="footer" block type="primary" @click="addTask">+ 任务</a-button>
      </draggable>
    </a-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TaskInfo from './TaskInfo'
import TaskDetail from './TaskDetail'
import { mapGetters, vuex } from 'vuex'

export default {
  components: {
    //调用组件
    draggable,
    TaskInfo,
    TaskDetail,
  },
  data: function () {
    return {
      visible: true,
      taskGroup: {
        name: 'task',
      },
      modalTitle: '新建',
      confirmLoading: false,
      drag: false,
    }
  },
  props: {
    // taskListWithStatus: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       status: '新建',
    //       tasks: [],
    //     }
    //   },
    // },
    priorityName: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
    setTask: {
      type: Function,
      required: true,
    },
  },
  computed: {
    // dragOptions() {
    //   return {
    //     animation: 200,
    //   }
    // },
    ...mapGetters(['username', 'projectAdminName']),
  },
  methods: {
    clickTaskInfo: function (task) {
      console.log(task)
      console.log(task.taskId + ' is clicked')
      this.$emit('showTaskDetail', task)
    },
    addTask: function () {
      this.showModal()
    },
    showModal: function () {
      this.visible = true
    },
    handleOk: function () {
      // todo: something
      this.visible = false
    },
    handleCancel: function () {
      // todo: something
      this.visible = false
    },
    addTag: function () {
      this.showModal()
    },
    onDragStart() {
      console.log('dragStart')
      this.drag = true
    },
    onDragEnd(evt) {
      this.$emit('end', evt)
    },
    moveTask: function (evt, originalEvt) {
      if (
        this.projectAdminName !== this.username &&
        evt.draggedContext.element.principal !== this.username
      )
        return false

      if (
        evt.to.dataset.status === '已逾期' ||
        (evt.from.dataset.status === '已逾期' && evt.to.dataset.status === '开发中')
      )
        return false

      this.setTask(evt.draggedContext.element)
      return true
    },
  },
}
</script>
<style>
.task-list {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 800px;
  overflow: auto;
}

.flip-list-move {
  transition: transform 0.5s;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-info:not(:last-of-type) {
  margin-bottom: 10px;
  border-bottom: 1px solid #e8e8e8;
}
</style>

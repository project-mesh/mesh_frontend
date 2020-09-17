<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <div>
    <a-card
      class="task-column"
      style="display: inline-block"
      :title="priorityMarks[priority].label"
    >
      <draggable
        group="taskGroup"
        :list="tasks"
        :animation="200"
        :empty-insert-threshold="200"
        :move="moveTask"
        @end="endMovingTask"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <task-info
            class="task-info"
            v-for="(task, taskIndex) in tasks"
            v-show="
              (task.principal === username || !onlyViewMine) &&
              (!task.isFinished || !onlyNotFinished)
            "
            :key="taskIndex"
            :task="task"
            @update-task="updateTaskData"
            @click.native="selectTask(task)"
          ></task-info>
        </transition-group>
        <div slot="footer">
          <a-button block type="primary" @click="addTask">
            <a-icon type="plus" />
            任务
          </a-button>
        </div>
      </draggable>
    </a-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import moment from 'moment'
import TaskInfo from './TaskInfo'
import TaskDetail from './TaskDetail'
import { mapGetters, vuex } from 'vuex'
import { priorityMarks } from './common/priority'

export default {
  components: {
    //调用组件
    draggable,
    TaskInfo,
  },
  data: function () {
    return {
      taskGroup: {
        name: 'task',
      },
      newTaskName: '',
      drag: false,
      modalTitle: '新建',
      confirmLoading: false,
      movingTask: null,
      targetPriority: null,
      priorityMarks: priorityMarks,
    }
  },
  props: {
    priority: {
      type: Number,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
    onlyViewMine: {
      type: Boolean,
      default: function () {
        return false
      },
    },
    onlyNotFinished: {
      type: Boolean,
      default: function () {
        return false
      },
    },
    tryCreateTask: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['username', 'projectId']),
  },
  methods: {
    selectTask: function (task) {
      this.$emit('select-task', task)
    },
    updateTaskData: function (task, formData) {
      this.$emit('update-task', task, formData)
    },
    moveTask: function (evt) {
      this.movingTask = evt.draggedContext.element
      this.targetPriority = evt.relatedContext.component.$parent.$parent.priority
      return true
    },

    endMovingTask: function () {
      if (this.movingTask) {
        this.$message.info(
          this.movingTask.taskName +
            ' 的优先级由 ' +
            priorityMarks[this.movingTask.priority].label +
            ' 变更为 ' +
            priorityMarks[this.targetPriority].label
        )
        this.$emit('update-task', this.movingTask, 'priority', this.targetPriority)
        this.movingTask.priority = this.targetPriority
        this.$emit('update:tasks', this.tasks) // [INFO] 这步是为了和父组件的，重组后的tasks同步,和后端数据无关，
        this.movingTask = null
        this.targetPriority = null
      }
    },

    finishEditing: function () {
      if (this.newTaskName) {
        this.$message.info('新建项目：' + this.newTaskName)
        this.addTask()
      }
      this.textareaVisible = false
    },
    exitEditing: function () {
      this.newTaskName = ''
      this.textareaVisible = false
    },
    addTask: function () {
      this.$emit('add-task', this.priority)
    },

    handleOk: function () {
      // todo: something
      this.visible = false
    },
    handleCancel: function () {
      // todo: something
      this.visible = false
    },
  },
}
</script>
<style>
.task-column {
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

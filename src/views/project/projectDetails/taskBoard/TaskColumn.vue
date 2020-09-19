<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <div>
    <a-card
      class="task-column"
      :title="priorityMarks[priority].label"
      :head-style="{ color: addclassStatus(priorityMarks[priority].label) }"
    >
      <draggable
        group="taskGroup"
        :list="tasks"
        :animation="200"
        :empty-insert-threshold="200"
        :move="moveTask"
        @end="onDragEnd"
      >
        <transition-group
          :data-priority="priority"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
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
            @task-update="$emit('task-update', $event)"
          ></task-info>
        </transition-group>
        <div slot="footer">
          <a-button
            block
            class="add-task"
            :disabled="username !== projectAdminName"
            type="primary"
            @click="tryCreateTask()"
          >
            + 任务
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
import { mapGetters } from 'vuex'
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
    setTask: {
      type: Function,
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
    ...mapGetters(['username', 'projectAdminName']),
  },
  methods: {
    selectTask: function (task) {
      console.log('hello')
      this.$emit('show-task-detail', task)
    },
    updateTaskData: function (task, formData) {
      this.$emit('update-task', task, formData)
    },
    moveTask: function (evt) {
      this.setTask(evt.draggedContext.element)
      return true
    },
    // 新建任务等等
    showTextarea: function () {
      this.textareaVisible = true
      this.$emit('edit-new-task-name', this.priority)
      console.log(this.$refs.textarea)
      console.log(this.$refs.textarea.focus)
      this.$refs.textarea.focus()
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
      let formData = {
        username: '', // todo: 当前用户名
        taskName: this.newTaskName,
        priority: this.priority,
        deadline: moment().format('YYYY-MM-DD'), // today
        description: '',
        principal: '', //todo: 当前用户名
      }

      // todo: 交互
      this.newTaskName = ''
    },
    onDragEnd(evt) {
      this.$emit('end', evt)
    },
    handleOk: function () {
      // todo: something
      this.visible = false
    },
    handleCancel: function () {
      // todo: something
      this.visible = false
    },
    addclassStatus(priorityName) {
      let color = ''
      if (priorityName == '极高') {
        color = ' #f5222d'
      }
      if (priorityName == '较高') {
        color = '#faad14'
      }
      if (priorityName == '普通') {
        color = '#52c41a'
      }
      if (priorityName == '较低') {
        color = '#1890ff'
      }
      return color
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
  margin-top: 15px;
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

.add-task {
  margin-top: 10px;
}
</style>

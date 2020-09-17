<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <div>
    <a-card class="task-list" :title="priorityName">
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
          :data-priority="priority"
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <div
            class="task-info"
            v-for="(task, taskIndex) in tasks"
            v-show="
              (task.principal === username || !onlyViewMine) &&
              (!task.isFinished || !onlyNotFinished)
            "
            :key="taskIndex"
            @click="clickTaskInfo(task)"
          >
            <task-info :task="task"></task-info>
          </div>
        </transition-group>
        <div slot="footer">
          <a-button
            block
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
      modalTitle: '新建',
      confirmLoading: false,
      drag: false,
    }
  },
  props: {
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

    clickTaskInfo: function (task) {
      console.log(task)
      console.log(task.taskId + ' is clicked')
      this.$emit('showTaskDetail', task)
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
      this.setTask(evt.draggedContext.element)
      return true
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

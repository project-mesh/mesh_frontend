<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <div>
    <a-card class="task-list" style="display: inline-block" :title="priorityMarks[priority].label">
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
            @click.native="selectTask"
          ></task-info>
        </transition-group>
        <div slot="footer">
          <a-textarea
            v-show="textareaVisible"
            ref="textarea"
            placeholder="请输入新项目名
按enter确认 按esc取消"
            allow-clear
            @keyup.enter="finishEditing"
            @keyup.esc="exitEditing"
            @blur="exitEditing"
            :auto-size="{ minRows: 3, maxRows: 20 }"
            :value="newTaskName"
          />
          <a-button v-show="!textareaVisible" block type="primary" @click="showTextarea">
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
import TaskDetail from './TaskDetail'
import { mapGetters, vuex } from 'vuex'
import { priorityMarks } from './common/priority'
export default {
  components: {
    //调用组件
    draggable,
    TaskInfo,
    TaskDetail,
  },
  data: function () {
    return {
      textareaVisible: false,
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
    // taskListWithStatus: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       status: '新建',
    //       tasks: [],
    //     }
    //   },
    // },
    //},
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
    selectTask: function (task) {
      this.$emit('select-task', task)
    },
    updateTaskData: function (task, key, value) {
      this.$emit('update-task', task, key, value)
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
            ' is moved from ' +
            this.movingTask.priority +
            ' to ' +
            this.targetPriority
        )
        this.$emit('update-task', this.movingTask, 'priority', this.targetPriority)
        this.movingTask.priority = this.targetPriority
        this.$emit('update:tasks', this.tasks) // [INFO] 这步是为了和父组件的，重组后的tasks同步,和后端数据无关，
        console.log(this.priority + ':')
        for (var item of this.tasks) {
          console.log(item.priority)
        }
        this.movingTask = null
        this.targetPriority = null
      }
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

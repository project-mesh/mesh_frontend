<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <a-card class="task-list" style="display: inline-block" :title="taskListWithTag.tag">
    <a-modal
      centered
      :width="700"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <show-task-form></show-task-form>
    </a-modal>
    <draggable
      group="taskGroup"
      :list="taskListWithTag.tasks"
      :move="moveTask"
      v-bind="dragOptions"
      :empty-insert-threshold="200"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div class="task-info" v-for="(task, taskIndex) in taskListWithTag.tasks" :key="taskIndex">
          <task-info :task="task" :show-task-templatest="showTask"></task-info>
        </div>
      </transition-group>
      <a-button slot="footer" block type="primary" @click="addTask">+ 任务</a-button>
    </draggable>
  </a-card>
</template>

<script>
import draggable from 'vuedraggable'
import TaskInfo from './TaskInfo'
import ShowTaskForm from './ShowTaskForm'
export default {
  components: {
    //调用组件
    draggable,
    TaskInfo,
    ShowTaskForm,
  },
  data: function () {
    return {
      visible: false,
      taskGroup: {
        name: 'task',
      },
      modalTitle: '新建',
      confirmLoading: false,
      drag: false,
    }
  },
  props: {
    taskListWithTag: {
      type: Object,
      default: function () {
        return {
          tag: '新建',
          tasks: [],
        }
      },
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        // group: 'description',
        // disabled: false,
        // ghostClass: 'ghost',
      }
    },
  },
  methods: {
    showTask: function () {
      this.showModal()
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

    moveTask: function (evt, originalEvt) {
      // var toElement = evt.relatedContext.element.tag
      // var fromElement = evt.draggedContext.element.taskName
      console.log('realtedContext', evt.relatedContext)
      console.log('draggedContext', evt.draggedContext)
      return true
      // console.log('taskMove拖动中')

      // console.log(fromElement + ' is moved to ' + toElement)
      // console.log(evt)
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

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
      draggable=".task-info"
      :list="taskListWithTag.tasks"
      :move="moveTask"
    >
      <task-info
        v-for="(task, taskIndex) in taskListWithTag.tasks"
        :key="taskIndex"
        :task="task"
        :show-task-list="showTask"
      ></task-info>
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
      var toElement = evt.relatedContext.element.tag
      var fromElement = evt.draggedContext.element.taskName
      console.log('taskMove拖动中')

      console.log(fromElement + 'is moved to ' + toElement)
      console.log(evt)
    },
  },
}
</script>
<style>
.task-list {
  display: inline-block;
  vertical-align: top;
  width: 400px;
  height: 800px;
}
</style>

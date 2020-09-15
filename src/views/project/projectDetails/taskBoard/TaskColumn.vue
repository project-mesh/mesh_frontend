<!-- 展示一个分类下各个的项目的摘要 -->
<template>
  <a-card class="task-list" :title="status">
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
      :list="tasks"
      :move="moveTask"
      :animation="200"
      :empty-insert-threshold="200"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <transition-group
        class="data-span"
        :data-status="status"
        type="transition"
        :name="!drag ? 'flip-list' : null"
      >
        <div
          class="task-info"
          v-for="(task, taskIndex) in tasks"
          :key="taskIndex"
          @click="showTask(task)"
        >
          <task-info :task="task"></task-info>
        </div>
      </transition-group>
      <a-button
        :disabled="username !== projectAdminName"
        slot="footer"
        block
        type="primary"
        @click="addTask"
      >
        + 任务
      </a-button>
    </draggable>
  </a-card>
</template>

<script>
import draggable from 'vuedraggable'
import TaskInfo from './TaskInfo'
import ShowTaskForm from './ShowTaskForm'
import { mapGetters } from 'vuex'

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
    // taskListWithStatus: {
    //   type: Object,
    //   default: function () {
    //     return {
    //       status: '新建',
    //       tasks: [],
    //     }
    //   },
    // },
    status: {
      type: String,
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
    ...mapGetters(['username', 'projectAdminName']),
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
    onDragStart() {
      console.log('dragStart')
      this.drag = true
    },
    onDragEnd(evt) {
      this.$emit('end', evt)
    },
    moveTask: function (evt) {
      if (
        this.projectAdminName !== this.username &&
        evt.draggedContext.element.principal !== this.username
      )
        return false

      const fromStatus = (evt.from.dataset || evt.from.querySelector('.data-span').dataset).status
      const toStatus = (evt.to.dataset || evt.to.querySelector('.data-span').dataset).status

      console.log(fromStatus, toStatus)

      if (toStatus === fromStatus) return true
      if (toStatus === '已逾期' || (fromStatus === '已逾期' && toStatus === '开发中')) return false

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

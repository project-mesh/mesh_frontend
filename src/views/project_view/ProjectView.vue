/* eslint-disable */
<template>
  <div style="background-color: #ececec; padding: 20px">
    <a-modal
      :width="700"
      centered
      :visible="visible"
      :confirm-loading="confirmLoading"
      :title="modalTitle"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <show-task-form></show-task-form>
    </a-modal>
    <draggable :list="tasks">
      <button slot="footer" @click="addTag">+ tag</button>
      <a-card
        class="task-tags"
        v-for="(tasks_with_tag, tag_index) in tasks"
        :key="tag_index"
        style="display: inline-block"
        width="30"
      >
        <draggable
          group="{'name' : 'task'}"
          :list="tasks_with_tag.tasks"
          draggable=".task-item"
          :move="taskMove"
        >
          <div slot="header">{{ tasks_with_tag.tagname }}</div>
          <button slot="footer" @click="addTask">+ 任务</button>
          <a-card
            @click="showTask"
            :name="task.id"
            class="task-item"
            v-for="(task, task_index) in tasks_with_tag.tasks"
            :key="task_index"
            :title="task.taskName"
          >
            <b>负责人</b>
            {{ task.principal }}
          </a-card>
        </draggable>
      </a-card>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import ShowTaskForm from './ShowTaskForm'
export default {
  components: {
    //调用组件
    draggable,
    ShowTaskForm,
  },
  //    <-- <a-card v-for="(index, item) in list" :key="item"></a-card>--->
  data() {
    return {
      visible: false,
      form: this.$form.createForm(this),
      tasks: [
        {
          tagname: '开发中',
          tasks: [
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: 'UI/UX设计',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘雪迪',
              principal: '蒋金峰',
              subTasks: [],
            },
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: '444',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘雪迪',
              principal: '蒋金峰',
              subTasks: [],
            },
            {
              tag: '开发中',
              taskId: 'aklgnlkjsald',
              taskName: '1111',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘雪迪',
              principal: '蒋金峰',
              subTasks: [],
            },
          ],
        },
        {
          tagname: '开发完毕',
          tasks: [
            {
              tag: '开发完毕',
              taskId: 'aklgnlkjsald',
              taskName: '222',
              isFinished: false,
              priority: 1,
              createTime: '16546513231',
              deadline: '2020-06-18',
              description: '任务内容详细描述xxxxxxxx',
              founder: '刘雪迪',
              principal: '蒋金峰',
              subTasks: [],
            },
          ],
        },
      ],
    }
  },
  methods: {
    showModal: function () {
      this.visible = true
    },
    showTask: function () {
      this.showModal()
    },
    addTask: function () {
      this.showModal()
    },
    addTag: function () {
      this.showModal()
    },

    handleOk: function () {
      // todo: something
      this.visible = false
    },
    handleCancel: function () {
      // todo: something
      this.visible = false
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

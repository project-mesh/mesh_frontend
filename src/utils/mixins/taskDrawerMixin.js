export default {
  data() {
    return {
      detailDrawerVisible: false,
      editingDrawerVisible: false,
      subEditingDrawerVisiable: false,
      selectedTask: {},
      selectedSubTask: {},
    }
  },
  methods: {
    showTaskDetail(task) {
      this.setSelectedTask(task)
      if (this.selectedTask) {
        this.setEditingDrawerVisible(false)
        this.setSubEditingDrawerVisible(false)
        this.setDetailDrawerVisible(true)
      }
    },
    setSelectedTask(task) {
      this.selectedTask = task
    },
    setSelectedSubTask(subTask) {
      this.selectedSubTask = subTask
    },
    enterEditingMode(isEditingMode) {
      if (isEditingMode) {
        this.setDetailDrawerVisible(false)
        this.setSubEditingDrawerVisible(false)
        this.setEditingDrawerVisible(true)
      }
    },
    enterSubEditingMode(value) {
      if (value) {
        this.setDetailDrawerVisible(false)
        this.setEditingDrawerVisible(false)
        this.setSubEditingDrawerVisible(true)
      }
    },
    setDetailDrawerVisible(value) {
      this.detailDrawerVisible = value
    },
    setEditingDrawerVisible(value) {
      this.editingDrawerVisible = value
    },
    setSubEditingDrawerVisible(value) {
      this.subEditingDrawerVisiable = value
    },
    closeDrawer() {
      this.setDetailDrawerVisible(false)
      this.setEditingDrawerVisible(false)
      this.setSubEditingDrawerVisible(false)
    },
    resetSelectedTask() {
      this.selectedTask = {
        taskId: '',
        taskName: '',
        founder: '',
        createTime: Date.now(),
        deadline: new Date().toISOString().slice(0, 10),
        subTasks: [],
        isFinished: false,
        description: '',
        priority: null,
      }
    },
    resetSelectedSubTask() {
      this.selectedSubTask = {
        taskId: '',
        taskName: '',
        founder: '',
        createTime: Date.now(),
        deadline: new Date().toISOString().slice(0, 10),
        isFinished: false,
        description: '',
      }
    },
    openCreateDrawer() {
      this.resetSelectedTask()
      this.setEditingDrawerVisible(true)
    },
    openSubCreateDrawer() {
      this.resetSelectedSubTask()
      this.setSubEditingDrawerVisible(true)
    },
  },
}

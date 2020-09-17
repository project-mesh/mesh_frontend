export default {
  data() {
    return {
      detailDrawerVisible: false,
      edittingDrawerVisible: false,
      selectedTask: {},
    }
  },
  methods: {
    showTaskDetail(task) {
      this.setSelectedTask(task)
      if (this.selectedTask) {
        this.detailDrawerVisible = true
      }
    },

    setSelectedTask(task) {
      this.selectedTask = task
    },
    enterEdittingMode(isEdittingMode) {
      if (isEdittingMode) {
        this.setDetailDrawerVisible(false)
        this.setEditingDrawerVisible(true)
      }
    },
    setDetailDrawerVisible(value) {
      this.detailDrawerVisible = value
    },
    setEditingDrawerVisible(value) {
      this.edittingDrawerVisible = value
    },
    closeDrawer() {
      this.setDetailDrawerVisible(false)
      this.setEditingDrawerVisible(false)
    },
    resetSelectedTask() {
      this.selectedTask = {
        taskName: '',
        founder: '',
        createTime: Date.now(),
        deadline: new Date().toISOString().slice(0, 10),
        subTasks: [],
        isFinished: false,
        description: '',
      }
    },
    openCreateDrawer() {
      this.resetSelectedTask()
      this.setEditingDrawerVisible(true)
    },
  },
}

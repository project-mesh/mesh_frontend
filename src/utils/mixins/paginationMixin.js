export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
    }
  },
  methods: {
    pagination(data) {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: this.pageSize,
        total: data.length,
        current: this.currentPage,
        onChange: this.handlePageChange,
        onShowSizeChange: this.handlePageSizeChange,
      }
    },
    handlePageChange(current) {
      this.currentPage = current
    },
    handlePageSizeChange(current, pageSize) {
      this.pageSize = pageSize
    },
  },
}

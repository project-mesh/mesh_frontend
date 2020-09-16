<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input v-model="value" @pressEnter="check" />
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      <slot></slot>
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: true,
    },
    validators: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      value: this.text,
      editable: this.editing,
    }
  },
  watch: {
    editable(value) {
      this.$emit('editStatusChange', value)
    },
  },
  methods: {
    check() {
      for (let i = 0; i < this.validators.length; ++i) {
        if (!this.validators[i][0](this.value)) {
          return this.$notification.error({
            message: this.validators[i][1],
          })
        }
      }
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true
    },
  },
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>

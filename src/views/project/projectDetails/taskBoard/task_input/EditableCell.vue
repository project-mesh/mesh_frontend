<template>
  <div class="editable">
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
      this.$emit('changeEditMode', true)
    },
  },
}
</script>

<style scoped></style>

<template>
  <a-date-picker
    format="YYYY-MM-DD"
    :disabled-date="disabledDate()"
    :show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
    @ok="onOk"
  />
</template>

<script>
import moment from 'moment'
export default {
  components: {
    moment,
  },
  props: {
    /*
    taskKey: {
      type: String,
      require: true,
      default: function () {
        return ''
      },
    },*/
  },
  methods: {
    disabledDate(current) {
      // Can not select days before today and today
      return current < moment().endOf('day')
    },
    onOk(value, dateString) {
      console.log(dateString)
    },
  },
}
</script>

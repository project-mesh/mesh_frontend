/* eslint-disable */
<template>
  <div style="background-color: #ececec; padding: 20px">
    <draggable @start="start" @end="end">
      <a-card
        class="list-group"
        v-for="(list, list_index) in lists"
        :key="list_index"
        style="display: inline-block"
      >
        <draggable group="{ name: 'people', pull: 'clone', put: false }" :list="list">
          <a-card class="list-group-item" v-for="(item, item_index) in list" :key="item_index">
            {{ item.name }}
          </a-card>
        </draggable>
      </a-card>
    </draggable>
  </div>
</template>
<script>
// 引入拖拽组件
import draggable from 'vuedraggable'
export default {
  components: {
    //调用组件
    draggable,
  },
  //    <-- <a-card v-for="(index, item) in list" :key="item"></a-card>--->
  data() {
    return {
      lists: [
        [
          { name: 'John', id: 1 },
          { name: 'Joao', id: 2 },
          { name: 'Jean', id: 3 },
          { name: 'Gerard', id: 4 },
        ],
        [
          { name: 'Juan', id: 5 },
          { name: 'Edgard', id: 6 },
          { name: 'Johnson', id: 7 },
        ],
      ],
    }
  },
  methods: {
    add: function () {
      this.list.push({ name: 'Juan' })
    },
    replace: function () {
      this.list = [{ name: 'Edgard' }]
    },
    clone: function (el) {
      return {
        name: el.name + ' cloned',
      }
    },
    log: function (evt) {
      window.console.log(evt)
    },
  },
}
</script>

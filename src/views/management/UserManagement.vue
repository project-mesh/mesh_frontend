<template>
  <div>
    <div id="userQueryTitle">搜索用户关键词</div>
    <div class="ant-pro-page-header-search">
      <a-input-search size="large" style="width: 80%; max-width: 522px">
        <template v-slot:enterButton>搜索</template>
      </a-input-search>
    </div>
    <div id="userShowTitle">搜索结果</div>
    <a-table :columns="columns" :data-source="data" id="userQueryShowTable" bordered>
      <template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="(e) => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title="确定要取消吗？" @confirm="() => cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
          </span>
          <a :disabled="editingKey !== ''">修改密码</a>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '15%',
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: '15%',
    scopedSlots: { customRender: 'avatar' },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: '15%',
    scopedSlots: { customRender: 'age' },
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: '40%',
    scopedSlots: { customRender: 'address' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  },
]

const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}
import {} from 'vuex'

export default {
  components: {},
  data() {
    this.cacheData = data.map((item) => ({ ...item }))
    return {
      data,
      columns,
      editingKey: '',
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => key === item.key)[0]
      const targetCache = newCacheData.filter((item) => key === item.key)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter((item) => key === item.key)[0])
        delete target.editable
        this.data = newData
      }
    },
  },
}
</script>

<style scoped>
.ant-pro-page-header-search {
  text-align: center;
  margin-bottom: 16px;
}
#userQueryTitle,
#userShowTitle {
  font-weight: bold;
  font-size: 125%;
  margin: 1em;
}
#userQueryShowTable {
  margin: 1em;
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>

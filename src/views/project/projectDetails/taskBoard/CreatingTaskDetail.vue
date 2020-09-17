<template>
  <a-drawer width="540" :closable="false" :visible="visible" @close="close">
    <div slot="title">
      <a-input placeholder="请输入任务标题" v-if="editing.taskName" v-model="task.taskName" />
      <span v-else>{{ task.taskName }}</span>
    </div>
    -
    <a-card>
      <a-descriptions class="drawer-content" :column="4">
        <a-descriptions-item label="创建者" span="2">
          <span style="margin-left: 20px">
            <avatar-featured-user :username="task.founder" />
          </span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="2">
          {{ moment().format('YYYY-MM-DD') }}
        </a-descriptions-item>

        <a-descriptions-item label="负责人" span="2">
          <div>
            <a-select
              v-if="editing.principal"
              width="100%"
              placeholder="请选择项目负责人"
              v-model="task.principal"
              :default-value="task.principal"
            >
              <a-select-option
                v-for="member in projectMembers"
                :key="member.username"
                :value="member.username"
              >
                <avatar-featured-user :username="member.username" />
              </a-select-option>
            </a-select>
            <span v-else>{{ task.principal }}</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="优先级" span="2">
          {{ task.priority }}
          <!--      在这里改优先级容易乱掉
          <a-select
            width="100%"
            placeholder="请选择项目优先级"
            v-model="task.priority"
            :default-value="task.priority"
            @change="changePriority"
          >
            <a-select-option
              v-for="(priorityMark, priorityIndex) in priorityMarks"
              :key="priorityIndex"
              :value="priorityIndex"
            >
              {{ priorityMark.label }}
        
            </a-select-option>
          </a-select>
          -->
        </a-descriptions-item>

        <a-descriptions-item label="截止日期" span="4">
          <div>
            <a-date-picker
              v-if="editing.deadline"
              size="small"
              v-model="task.deadline"
              placeholder="请选择任务截止日期"
              :allow-clear="false"
              :default-date="moment().format()"
              :disabled-date="(date) => date < moment().startOf('day')"
            ></a-date-picker>
            <span v-else>{{ task.deadline }}</span>
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="描述" span="4">
          <a-textarea v-model="task.description" width="100%"></a-textarea>
          {{ task.description }}
        </a-descriptions-item>
        <a-descriptions-item v-if="false" label="子任务" span="3"></a-descriptions-item>
      </a-descriptions>
      <sub-task-list
        v-if="false"
        :task-id="task.taskId"
        :sub-tasks="task.subTasks"
        @update-sub-task="updateSubTask"
        @delete-sub-task="deleteSubTask"
        @create-sub-task="createSubTask"
      />
      <template v-if="mode === 'create'" slot="actions" class="ant-card-actions">
        <a-icon key="edit" type="plus" @click="createTask" />
      </template>
      <template v-else slot="actions" class="ant-card-actions">
        <a-popconfirm
          title="确认删除该任务？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="deleteTask"
        >
          <a-icon key="delete" type="delete" />
        </a-popconfirm>

        <a-icon key="edit" type="edit" @click="editTask(task)" />
        <a-icon
          key="check-square"
          :type="task.isFinished ? 'check-square' : 'border'"
          @click="changeTaskFinishingStatus"
        />
      </template>
    </a-card>
  </a-drawer>
</template>
<script>
import { priorityMarks } from './common/priority'
import AvatarFeaturedUser from './task_input/AvatarFeaturedUser'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  components: {
    AvatarFeaturedUser,
  },
  data() {
    return {
      mode: 'create',
      priorityMarks: priorityMarks,

      editing: {
        taskName: true,
        priority: true,
        principal: true,
        deadline: true,
        description: true,
      },
      essential: {
        taskName: true,
        principal: true,
      },
      defaultValue: {
        principal: 'username',
      },
      task: {
        taskName: '',
        founder: 'username',
        deadline: '',
        priority: this.priority,
        principal: '',
        description: '',
      },
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: function () {
        return false
      },
    },
    priority: {
      type: Number,
      default: function () {
        return 1
      },
    },
    editable: {
      type: Object,
      default: function () {
        return {
          taskName: true,
          priority: true,
          principal: true,
          deadline: true,
          description: true,
        }
      },
    },
  },
  methods: {
    moment,
    createTask: function () {
      console.log(this.task)
      this.emit('create-task', this.task)
    },

    addSubTask: function () {
      let formData = {
        username: '', // todo: 当前用户名
        taskName: this.newTaskName,
        description: '',
        principal: '', //todo: 当前用户名
      }
      // todo: 交互
      this.newSubTaskName = ''
    },

    close: function () {
      this.$emit('change-drawer', '')
    },
  },
  computed: {
    ...mapGetters(['projectMembers']),
  },
  filters: {
    formatPriority: (priority) => this.priorityMarks[priority].label,
  },
}
</script>

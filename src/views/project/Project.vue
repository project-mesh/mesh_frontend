<template>
  <div>
    <div class="change-view">
      <a-radio-group
        default-value="card"
        :value="listVisible ? 'list' : 'card'"
        button-style="solid"
      >
        <a-radio-button value="list" @click="showListView()">
          <a-icon type="unordered-list" />
          列表视图
        </a-radio-button>
        <a-radio-button value="card" @click="showCardView()">
          卡片视图
          <a-icon type="appstore" />
        </a-radio-button>
      </a-radio-group>
      <div class="search-and-create">
        <div class="search-box">
          <a-input-search placeholder="输入要查找的项目" enter-button @search="onSearch" />
        </div>
        <a-button type="primary" @click="() => (createProjForm = true)">
          创建新项目
          <a-icon type="folder-add" />
        </a-button>
      </div>
    </div>
    <a-modal v-model="createProjForm" title="创建新项目" centered @ok="handleSubmit">
      <!-- 项目创建表单 -->
      <a-form
        :form="form"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleSubmit"
      >
        <a-form-item label="项目名称">
          <a-input
            v-decorator="['projName', { rules: [{ required: true, message: '请输入项目名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="项目权限">
          <a-select
            v-decorator="[
              'projAuthority',
              { rules: [{ required: true, message: '请选择项目权限!' }] },
            ]"
            placeholder="公有/私有"
          >
            <a-select-option value="public">公开</a-select-option>
            <a-select-option value="private">私密</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目负责人">
          <a-select
            v-decorator="[
              'projAuthority',
              { rules: [{ required: true, message: '请选择项目负责人!' }] },
            ]"
            placeholder="选择项目管理员"
          >
            <a-select-option value="1">xxx</a-select-option>
            <a-select-option value="2">yyy</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目封面">
          <a-upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </a-form>
    </a-modal>
    <div v-if="listVisible" class="list-view">
      <a-list item-layout="horizontal" :data-source="teamProjects">
        <a-list-item slot="renderItem" slot-scope="item">
          <img slot="extra" width="100" alt="logo" :src="item.projectLogo" />
          <a-list-item-meta>
            <div slot="title">{{ item.projectName }}</div>
            <div slot="description">{{ item.adminName }}</div>
            <a slot="description" @click="tryJumpToProjectDetail(item.projectId)">进入项目</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
    <div v-if="!listVisible">
      <div>
        <a-list
          type="flex"
          :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }"
          :data-source="teamProjects"
          class="card-row"
        >
          <a-list-item slot="renderItem" slot-scope="item" class="list-item">
            <a-card
              hoverable
              style="width: 100%; overflow: hidden"
              @click="tryJumpToProjectDetail(item.projectId)"
            >
              <img
                style="height: 400px; overflow: hidden; object-fit: cover"
                slot="cover"
                alt="example"
                :src="item.projectLogo"
                class="card-img"
              />
              <template slot="actions" class="ant-card-actions">
                <a-icon key="setting" type="setting" />
                <a-icon key="edit" type="edit" />
                <a-icon key="ellipsis" type="ellipsis" />
              </template>
              <a-card-meta>
                <div slot="title" class="card-text">{{ item.projectName }}</div>
                <div slot="description" class="card-text">{{ item.adminName }}</div>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store'
import { mapActions, mapGetters } from 'vuex'
import { timeFix } from '@/utils/util'
import teamMixin from '@/utils/mixins/teamMixin'

//图片转 base64
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'Project',
  mixins: [teamMixin],
  computed: mapGetters(['teamProjects', 'preference']),
  watch: {
    ['$route.query.teamId']() {
      this.loadTeamInfo()
    },
  },
  methods: {
    ...mapActions(['queryTeam', 'createTeam', 'updatePreferenceShowMode']),
    tryJumpToProjectDetail(projectId) {
      this.$router.push({ name: 'statistics', query: { teamId: this.teamId, projectId } })
    },
    showListView() {
      console.log('显示列表')
      this.listVisible = true
      this.updatePreferenceShowMode({
        username: this.username,
        preferenceShowMode: 'list',
      }).then(() => {
        console.log('update preferenceShowMode success')
      })
    },
    showCardView() {
      console.log('显示卡片')
      this.listVisible = false
      this.updatePreferenceShowMode({
        username: this.username,
        preferenceShowMode: 'card',
      }).then(() => {
        console.log('update preferenceShowMode success')
      })
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleSubmit(e) {
      this.createProjForm = false
      e.preventDefault()
      console.log('哈哈哈哈哈哈哈')
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.createTeam({
            username: store.getters.username,
            teamId: store.getters.teamId,
            projectName: values.projName,
            adminName: '',
            isPublic: values.projAuthority !== 'private',
          })
            .then((response) => {
              console.log('success,boy', response)
              // 延迟显示欢迎信息
              setTimeout(() => {
                this.$notification.success({
                  message: '创建成功',
                  description: `${timeFix()}，已成功添加新项目`,
                })
              }, 0)
            })
            .catch((err) => {
              console.log('error, boy: ', err)
              this.$notification.error({
                message: '创建失败',
                description: err,
              })
            })
        }
      })
    },
  },
  data() {
    return {
      listVisible: false, //是否显示列表 true显示列表 false显示卡片
      createProjForm: false, //显示创建项目的表单
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this),
    }
  },
  beforeRouteEnter(to, from, next) {
    console.log('before router enter')
    next()
  },
  mounted: function () {
    this.listVisible = this.preference.preferenceShowMode !== 'card'
  },
}
</script>

<style scoped>
.change-view {
  width: 100%;
  display: flex;
  right: 20px;
  justify-content: space-between;
}
.card-row {
  height: 500px;
  margin-top: 20px;
}
.card-img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-and-create {
  display: flex;
  justify-content: space-between;
}
.search-box {
  margin-right: 10px;
}
</style>

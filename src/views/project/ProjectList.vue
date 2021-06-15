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
          <a-input-search placeholder="输入要查找的项目" v-model="filterText" enter-button />
        </div>
        <a-button :disabled="username !== teamAdminName" type="primary" @click="showCreateForm">
          创建新项目
          <a-icon type="folder-add" />
        </a-button>
      </div>
    </div>
    <a-modal
      v-model="createProjForm"
      title="创建新项目"
      centered
      @ok="handleCreateSubmit"
      :ok-button-props="{ loading: createLoading }"
    >
      <!-- 项目创建表单 -->
      <a-form
        :form="createForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleCreateSubmit"
      >
        <a-form-item label="项目名称">
          <a-input
            v-decorator="['prjName', { rules: [{ required: true, message: '请输入项目名称!' }] }]"
          />
        </a-form-item>
        <a-form-item label="项目权限">
          <a-select
            v-decorator="[
              'prjAuthority',
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
              'prjAdmin',
              { rules: [{ required: true, message: '请选择项目负责人!' }] },
            ]"
            placeholder="选择项目管理员"
          >
            <a-select-option
              v-for="member in teamMembers"
              :key="member.username"
              :value="member.username"
            >
              {{ member.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目封面">
          <a-upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            v-decorator="['prjLogo']"
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
    <a-modal
      v-model="modifyProjForm"
      title="修改项目信息"
      centered
      @ok="handleUpdateSubmit"
      :ok-button-props="{ loading: updateLoading }"
    >
      <a-form
        :form="updateForm"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
        @submit="handleUpdateSubmit"
      >
        <a-form-item label="项目名称">
          <a-input
            v-decorator="[
              'prjName',
              {
                rules: [{ required: true, message: '请输入项目名称!' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="项目权限">
          <a-select
            v-decorator="[
              'prjAuthority',
              { rules: [{ required: true, message: '请选择项目权限!' }] },
            ]"
            placeholder="公有/私有"
          >
            <a-select-option value="public">公开</a-select-option>
            <a-select-option value="private">私密</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目负责人">
          <a-select v-decorator="['prjAdmin']" placeholder="选择项目管理员">
            <a-select-option v-for="member in teamMembers" :key="member.username" :value="member">
              {{ member.username }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目封面">
          <a-upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            v-decorator="['prjLogo']"
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
      <a-list item-layout="horizontal" :data-source="filteredProjects">
        <a-list-item slot="renderItem" slot-scope="item">
          <img
            slot="extra"
            style="width: 100px; height: 100px; object-fit: cover"
            alt="logo"
            :src="item.projectLogo"
          />
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
          :data-source="filteredProjects"
          class="card-row"
        >
          <a-list-item slot="renderItem" slot-scope="item" class="list-item">
            <a-card hoverable style="width: 100%; overflow: hidden">
              <img
                style="height: 400px; overflow: hidden; object-fit: cover"
                slot="cover"
                alt="example"
                :src="item.projectLogo"
                class="card-img"
                @click="tryJumpToProjectDetail(item.projectId)"
              />
              <template slot="actions" class="ant-card-actions">
                <a :disabled="username !== item.adminName" @click="showUpdatePrjForm(item)">
                  <a-icon key="edit" type="edit" />
                </a>
                <a :disabled="username !== item.adminName" @click="handleProjectDelete(item)">
                  <a-icon key="delete" type="delete" />
                </a>
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
import { putProjectLogo, dataURItoBlob, getDefaultProjectAvatar } from '../../utils/oss'

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']

//图片转 base64
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'Project',
  mixins: [teamMixin],
  computed: {
    ...mapGetters([
      'teamProjects',
      'preference',
      'username',
      'teamAdminName',
      'teamMembers',
      'teamId',
      'projectMembers',
    ]),
    filteredProjects() {
      return this.teamProjects.filter((project) =>
        project.projectName.toLocaleUpperCase().match(this.filterText.toLocaleUpperCase())
      )
    },
    filteredOptions() {
      return OPTIONS.filter((o) => !this.selectedItems.includes(o))
    },
  },
  watch: {
    ['$route.query.teamId']() {
      this.loadTeamInfo()
    },
  },
  methods: {
    ...mapActions([
      'queryTeam',
      'createProject',
      'updatePreferenceShowMode',
      'deleteProject',
      'updateProject',
      'joinProject',
      'queryProject',
    ]),
    tryJumpToProjectDetail(projectId) {
      const currPrj = this.teamProjects.find((prj) => prj.projectId === projectId)
      if (!currPrj) {
        return this.$notification.error({
          message: '你不是该项目成员！',
        })
      }
      const username = this.username
      this.queryProject({
        username: this.username,
        projectId: projectId,
      }).then((response) => {
        const members = response.data.project.members
        if (!members.some((m) => m.username == username)) {
          return this.$notification.error({
            message: '你不是该项目成员！',
          })
        } else {
          this.$router.push({ name: 'taskList', query: { teamId: this.teamId, projectId } })
        }
      })
    },
    showListView() {
      console.log('显示列表')
      this.listVisible = true
      this.updatePreferenceShowMode({
        username: this.username,
        showMode: 'list',
      }).then(() => {
        console.log('update preferenceShowMode success')
      })
    },
    showCardView() {
      console.log('显示卡片')
      this.listVisible = false
      this.updatePreferenceShowMode({
        username: this.username,
        showMode: 'card',
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
    handleMemberChange(selectedItems) {
      this.selectedItems = selectedItems
    },
    //删除项目
    handleProjectDelete(prj) {
      const vm = this
      this.$confirm({
        title: '您是否要删除该团队?',
        content: (h) =>
          h('div', { style: { color: 'red' } }, [`请确认即将删除的团队名称：${prj.projectName}`]),
        onOk() {
          // this.deleteLoading = true
          return new Promise((resolve, reject) => {
            vm.deleteProject({
              username: vm.username,
              teamId: vm.teamId,
              projectId: prj.projectId,
            })
              .then(resolve)
              .catch((err) => {
                vm.$notification.error({
                  message: '删除项目失败',
                  description: err.message,
                })
                reject(err)
              })
          })
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test',
      })
    },
    handleCreateSubmit(e) {
      e.preventDefault()
      this.createLoading = true
      this.createForm.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          console.log('prjLogp:', values.prjLogo)
          this.createProject({
            username: store.getters.username,
            teamId: store.getters.teamId,
            projectName: values.prjName,
            adminName: values.prjAdmin,
            isPublic: values.prjAuthority === 'public',
          })
            .then((response) => {
              console.log('success,boy', response)
              console.log('projectId is:', response.data.project.projectId)
              if (values.prjLogo && values.prjLogo !== 'xxx') {
                console.log('prjLogo is:', values.prjLogo)
                putProjectLogo(
                  response.data.project.projectId,
                  dataURItoBlob(values.prjLogo.file.thumbUrl)
                )
              } else {
                getDefaultProjectAvatar().then((ret) => {
                  console.log('defaultAvatar ret is:', ret)
                  putProjectLogo(response.data.project.projectId, dataURItoBlob(ret)).then(() => {
                    console.log('success in put Logo')
                  })
                })
              }
              // 延迟显示欢迎信息
              setTimeout(() => {
                this.$notification.success({
                  message: '创建成功',
                  description: `${timeFix()}，已成功添加新项目`,
                })
                this.queryTeam({
                  username: this.username,
                  teamId: this.teamId,
                })
                  .then(() => {
                    this.$notification.success({
                      message: '团队信息加载成功！',
                    })
                  })
                  .catch((err) => {
                    this.$notification.error({
                      message: '请求团队信息失败，请重试',
                    })
                  })
              }, 1000)
              // 实时更新
            })
            .catch((err) => {
              console.log('error, boy: ', err)
              this.$notification.error({
                message: '创建失败',
                description: err.message,
              })
            })
            .finally(() => {
              this.createLoading = false
              this.createProjForm = false
            })
        }
      })
    },
    handleUpdateSubmit(e) {
      e.preventDefault()
      this.updateLoading = true
      this.updateForm.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.updateProject({
            username: store.getters.username,
            teamId: store.getters.teamId,
            projectId: this.selectedUpdatePrj.projectId,
            isPublic: values.prjAuthority === 'public',
            projectName: values.prjName,
            adminName: values.prjAdmin,
          })
            .then((response) => {
              console.log('success,boy', response)
              if (values.prjLogo && values.prjLogo.file) {
                putProjectLogo(
                  this.selectedUpdatePrj.projectId,
                  dataURItoBlob(values.prjLogo.file.thumbUrl)
                )
              }
            })
            .catch((err) => {
              this.$notification.error({
                message: '更新失败',
                description: err,
              })
            })
            .finally(() => {
              this.updateLoading = false
              this.modifyProjForm = false
            })
        }
      })
    },
    showUpdatePrjForm(prj) {
      this.selectedUpdatePrj = prj
      this.modifyProjForm = true

      if (Object.keys(prj).length) {
        this.$nextTick(() => {
          const formData = {
            prjName: prj.projectName,
            prjAuthority: prj.isPublic ? 'public' : 'private',
            prjLogo: prj.projectLogo,
            prjAdmin: prj.adminName,
          }

          this.updateForm.setFieldsValue(formData)
        })
      }
    },
    showCreateForm() {
      this.createProjForm = true

      this.$nextTick(() => {
        const formData = {
          prjName: '',
          prjAuthority: 'public',
          prjLogo: 'xxx',
          prjAdmin: '',
        }
        this.createForm.setFieldsValue(formData)
      })
    },
  },
  data() {
    return {
      listVisible: false, //是否显示列表 true显示列表 false显示卡片
      createProjForm: false, //显示创建项目的表单
      modifyProjForm: false, //现实修改项目信息的表单
      addMember: false, //显示添加项目成员的表单
      previewVisible: false,
      previewImage: '',
      fileList: [],
      updateForm: this.$form.createForm(this, { name: 'update' }),
      createForm: this.$form.createForm(this, { name: 'create' }),
      filterText: '',
      selectedUpdatePrj: null,
      createLoading: false,
      updateLoading: false,
      selectedItems: [], //选中的成员名单
      prjMembers: [],
    }
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

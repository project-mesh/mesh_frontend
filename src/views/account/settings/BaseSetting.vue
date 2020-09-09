<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="horizontal" :form="form">
          <a-form-item label="账号/邮箱">
            <div>{{ username }}</div>
          </a-form-item>
          <a-form-item label="昵称">
            <a-input placeholder="给自己起个名字" />
          </a-form-item>
          <a-form-item label="生日">
            <a-date-picker @change="onChange" />
            <icon-font type="icon-juxiezuo" class="xingzuo" />
            <icon-font type="icon-tuxiao" class="shengxiao" />
          </a-form-item>
          <a-form-item label="地址">
            <a-cascader
              v-decorator="[
                'residence',
                {
                  initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                  rules: [{ type: 'array', required: true, message: '请输入你的地址' }],
                },
              ]"
              :options="city"
            />
          </a-form-item>
          <a-form-item label="个性签名">
            <a-textarea v-decorator="['description']"></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button type="primary">保存</a-button>
            <a-button class="operate" style="margin-left: 8px" @click="add">修改密码</a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img" />
        </div>
      </a-col>
    </a-row>
    <avatar-modal ref="modal" @ok="setavatar" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Icon } from 'ant-design-vue'
import AvatarModal from './AvatarModal'
import CodeForm from './CodeForm'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2053325_2myvezomfgb.js',
})
const city = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]
const birthDayStr = '2000-06-13'
export default {
  components: {
    AvatarModal,
    CodeForm,
    IconFont,
  },
  computed: mapGetters(['username']),
  data() {
    return {
      // cropper
      city,
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
      },
    }
  },
  methods: {
    ...mapActions(['updateUserPassword']),
    setavatar(url) {
      this.option.img = url
    },
    add() {
      this.$dialog(
        CodeForm,
        // component props
        {
          record: {},
          on: {
            ok() {
              alert('外部ok')
              console.log('ok 回调')
            },
            cancel() {
              console.log('cancel 回调')
            },
            close() {
              console.log('modal close 回调')
            },
          },
        },
        // modal props
        {
          title: '修改密码',
          width: 700,
          centered: true,
          maskClosable: false,
        }
      )
    },
  },
  mounted() {
    console.log('wzzzzzzzzj', city)
  },
}
</script>

<style lang="less" scoped>
.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.ant-upload-preview {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img,
  .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}

.xingzuo {
  margin-left: 2%;
  font-size: 18px;
}
.shengxiao {
  margin-left: 2%;
  font-size: 22px;
}
</style>

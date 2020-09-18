<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel"
  >
    <a-row>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :auto-crop="options.autoCrop"
          :auto-crop-width="options.autoCropWidth"
          :auto-crop-height="options.autoCropHeight"
          :fixed-box="options.fixedBox"
          @realTime="realTime"
        ></vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :before-upload="beforeUpload" :show-upload-list="false">
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{ span: 1, offset: 2 }" :md="2">
        <a-button icon="plus" @click="changeScale(1)" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="minus" @click="changeScale(-1)" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="undo" @click="rotateLeft" />
      </a-col>
      <a-col :lg="{ span: 1, offset: 1 }" :md="2">
        <a-button icon="redo" @click="rotateRight" />
      </a-col>
      <a-col :lg="{ span: 2, offset: 6 }" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { putObject, dataURItoBlob, getMyAvatar } from '../../../utils/oss'
import imageCompression from 'browser-image-compression'
import axios from 'axios'

export default {
  data() {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
      },
      previews: {},
    }
  },
  computed: {
    ...mapGetters(['username', 'nickname', 'birthday', 'avatar']),
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    ...mapMutations(['SET_AVATAR']),
    edit(id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close() {
      this.id = null
      this.visible = false
    },
    cancelHandel() {
      this.close()
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload(file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64

      // reader.readAsDataURL(file)
      // reader.onload = () => {
      //   this.options.img = reader.result
      // }
      // console.log('in before', file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      }

      imageCompression(file, options).then((resultFile) => {
        reader.readAsDataURL(resultFile)
        reader.onload = () => {
          this.options.img = reader.result
        }
        console.log('in before', resultFile)
      })
      return false
    },

    // 上传图片（点击上传按钮）
    finish(type) {
      // 输出
      this.$refs.cropper.getCropData((data) => {
        console.log('getCropData', data)
        putObject('userAvatar_' + this.username, dataURItoBlob(data)).then((res) => {
          getMyAvatar()
        })
        // let imgUrl = testGet('userAvatar_' + this.username)
        // getBase64(imgUrl).then((ret) => {
        //   console.log(`data:image/jpg;base64,${ret}`)
        //   let base64Data = 'data:image/jpg;base64,' + ret.toString()
        //   this.SET_AVATAR(base64Data)
        //   console.log('avatar is:', this.avatar)
        // })
        this.$emit('ok', data)
        this.okHandel()
        // axios.get(imgUrl).then((res) => {
        //   console.log('from ali', res)
        //   let result = this.getBase64(res)
        //
        //   console.log('result is:', result)
        // })
        // this.updateUserInfo({
        //   username: this.username,
        //   nickname: this.nickname,
        //   avatar: data,
        //   birthday: this.birthday,
        // }).catch((error) => {
        //   this.$notification.error({
        //     message: '更新头像失败',
        //     description: `${error.name}: ${error.message}`,
        //   })
        // })
      })
    },
    okHandel() {
      const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传头像成功')
      }, 2000)
    },

    realTime(data) {
      this.previews = data
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>

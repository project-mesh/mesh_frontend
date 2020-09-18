<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="horizontal" :form="form">
          <a-form-item label="账号/邮箱">
            <span>{{ username }}</span>
            <a-tooltip title="男">
              <icon-font
                type="icon-xingbienanxianxing"
                id="gender-male"
                :class="{ blue: gender === 1 }"
                @click="chooseMale"
              />
            </a-tooltip>
            <a-tooltip title="女">
              <icon-font
                type="icon-xingbienvxianxing"
                id="gender-female"
                :class="{ pink: gender === 2 }"
                @click="chooseFemale"
              />
            </a-tooltip>
            <a-tooltip title="未知">
              <icon-font
                type="icon-xingbie"
                id="gender-unknown"
                :class="{ purple: gender === 0 }"
                @click="chooseUnknown"
              />
            </a-tooltip>
          </a-form-item>
          <a-form-item label="昵称">
            <a-input v-decorator="['nickname', { initialValue: nickname }]" />
          </a-form-item>
          <a-form-item label="状态" has-feedback>
            <a-select
              v-decorator="[
                'status',
                {
                  rules: [{ required: true, message: '挑一个自己的状态' }],
                  initialValue: status,
                },
              ]"
              placeholder="挑一个自己的状态"
              @change="handleChange"
            >
              <a-select-option value="1">
                <icon-font type="icon-yao" />
                生病难受中
              </a-select-option>
              <a-select-option value="2">
                <icon-font type="icon-xiujia" />
                休假充电中
              </a-select-option>
              <a-select-option value="3">
                <icon-font type="icon-zengjiicon" />
                努力工作中
              </a-select-option>
              <a-select-option value="4">
                <icon-font type="icon-icon-00FC" />
                在家办公中
              </a-select-option>
              <a-select-option value="5">
                <icon-font type="icon-yu-" />
                持续摸鱼中
              </a-select-option>
              <a-select-option value="6">
                <icon-font type="icon-feiji" />
                出差奔波中
              </a-select-option>
              <a-select-option value="7">
                <icon-font type="icon-game" />
                愉快游戏中
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="生日">
            <a-date-picker
              @change="onChange"
              :default-value="birthday ? moment(birthday, dateFormat) : null"
            />
            <a-tooltip :title="xingzuoTag">
              <icon-font :type="xingzuoIcon" class="xingzuo" @click="dealBirthday" />
            </a-tooltip>
            <a-tooltip :title="shengxiaoTag">
              <icon-font :type="shengxiaoIcon" class="shengxiao" />
            </a-tooltip>
          </a-form-item>
          <a-form-item label="地址">
            <a-cascader
              placeholder="地址"
              :default-value="defaultCitiesList ? defaultCitiesList : null"
              v-decorator="[
                'city',
                {
                  initialValue: this.defaultAddress ? this.defaultAddress : null,
                  rules: [{ type: 'array', required: true, message: '请输入你的地址' }],
                },
              ]"
              :options="city"
            />
          </a-form-item>
          <a-form-item label="个性签名">
            <a-textarea
              v-decorator="[
                'description',
                {
                  initialValue: this.description,
                },
              ]"
              placeholder="介绍一下自己"
            ></a-textarea>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="saveSettings">保存</a-button>
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
import allCity from './cities.js'
import moment from 'moment'
import store from '../../../store'
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2053325_5hl9fgurem.js',
})
export default {
  components: {
    AvatarModal,
    CodeForm,
    IconFont,
  },
  computed: {
    ...mapGetters(['username', 'status', 'nickname', 'address', 'description', 'avatar']),
    cities: function () {
      let tmp = this.address.split(' ')
      if (tmp) {
        return tmp
      } else {
        return ' '
      }
    },
  },
  watch: {
    birthdayStr: function (newValue) {
      let oriStr = newValue
      let dateStr = oriStr.split('-')
      let yearNum = parseInt(dateStr[0])
      let xingzuoNum = parseInt(dateStr[1] + dateStr[2])
      let shengXiaoNum = yearNum % 12
      //从猴开始，0为猴
      switch (shengXiaoNum) {
        case 0: {
          this.$set(this, 'shengxiaoTag', '生肖：猴')
          this.$set(this, 'shengxiaoIcon', 'icon-houxiao')
          break
        }
        case 1: {
          this.$set(this, 'shengxiaoTag', '生肖：鸡')
          this.$set(this, 'shengxiaoIcon', 'icon-jixiao')
          break
        }
        case 2: {
          this.$set(this, 'shengxiaoTag', '生肖：狗')
          this.$set(this, 'shengxiaoIcon', 'icon-gouxiao')
          break
        }
        case 3: {
          this.$set(this, 'shengxiaoTag', '生肖：猪')
          this.$set(this, 'shengxiaoIcon', 'icon-zhuxiao')
          break
        }
        case 4: {
          this.$set(this, 'shengxiaoTag', '生肖：鼠')
          this.$set(this, 'shengxiaoIcon', 'icon-shuxiao')
          break
        }
        case 5: {
          this.$set(this, 'shengxiaoTag', '生肖：牛')
          this.$set(this, 'shengxiaoIcon', 'icon-niuxiao')
          break
        }
        case 6: {
          this.$set(this, 'shengxiaoTag', '生肖：虎')
          this.$set(this, 'shengxiaoIcon', 'icon-huxiao')
          break
        }
        case 7: {
          this.$set(this, 'shengxiaoTag', '生肖：兔')
          this.$set(this, 'shengxiaoIcon', 'icon-tuxiao')
          break
        }
        case 8: {
          this.$set(this, 'shengxiaoTag', '生肖：龙')
          this.$set(this, 'shengxiaoIcon', 'icon-longxiao')
          break
        }
        case 9: {
          this.$set(this, 'shengxiaoTag', '生肖：蛇')
          this.$set(this, 'shengxiaoIcon', 'icon-shexiao')
          break
        }
        case 10: {
          this.$set(this, 'shengxiaoTag', '生肖：马')
          this.$set(this, 'shengxiaoIcon', 'icon-maxiao')
          break
        }
        case 11: {
          this.$set(this, 'shengxiaoTag', '生肖：羊')
          this.$set(this, 'shengxiaoIcon', 'icon-yangxiao')
          break
        }
      }
      if (xingzuoNum > 1221) {
        this.$set(this, 'xingzuoTag', '星座：摩羯座')
        this.$set(this, 'xingzuoIcon', 'icon-mojiezuo')
      } else if (xingzuoNum > 1122) {
        this.$set(this, 'xingzuoTag', '星座：射手座')
        this.$set(this, 'xingzuoIcon', 'icon-sheshouzuo')
      } else if (xingzuoNum > 1023) {
        this.$set(this, 'xingzuoTag', '星座：天蝎座')
        this.$set(this, 'xingzuoIcon', 'icon-tianxiezuo')
      } else if (xingzuoNum > 922) {
        this.$set(this, 'xingzuoTag', '星座：天秤座')
        this.$set(this, 'xingzuoIcon', 'icon-tianchengzuo')
      } else if (xingzuoNum > 822) {
        this.$set(this, 'xingzuoTag', '星座：处女座')
        this.$set(this, 'xingzuoIcon', 'icon-chunvzuo')
      } else if (xingzuoNum > 722) {
        this.$set(this, 'xingzuoTag', '星座：狮子座')
        this.$set(this, 'xingzuoIcon', 'icon-shizizuo')
      } else if (xingzuoNum > 621) {
        this.$set(this, 'xingzuoTag', '星座：巨蟹座')
        this.$set(this, 'xingzuoIcon', 'icon-juxiezuo')
      } else if (xingzuoNum > 520) {
        this.$set(this, 'xingzuoTag', '星座：双子座')
        this.$set(this, 'xingzuoIcon', 'icon-shuangzizuo')
      } else if (xingzuoNum > 419) {
        this.$set(this, 'xingzuoTag', '星座：金牛座')
        this.$set(this, 'xingzuoIcon', 'icon-jinniuzuo')
      } else if (xingzuoNum > 320) {
        this.$set(this, 'xingzuoTag', '星座：白羊座')
        this.$set(this, 'xingzuoIcon', 'icon-baiyangzuo')
      } else if (xingzuoNum > 218) {
        this.$set(this, 'xingzuoTag', '星座：双鱼座')
        this.$set(this, 'xingzuoIcon', 'icon-shuangyuzuo')
      } else if (xingzuoNum > 119) {
        this.$set(this, 'xingzuoTag', '星座：水瓶座')
        this.$set(this, 'xingzuoIcon', 'icon-shuipingzuo')
      } else {
        this.$set(this, 'xingzuoTag', '星座：摩羯座')
        this.$set(this, 'xingzuoIcon', 'icon-mojiezuo')
      }
      console.log(this.shengxiaoTag)
      console.log(this.xingzuoTag)
    },
  },
  data() {
    return {
      // cropper
      city: [],
      defaultCitiesList: [' ', ' ', ' '],
      birthdayStr: '',
      statusStr: '1', //在数据库中存的是数字，这里需要一步数字转换字符串
      gender: 1,
      shengxiaoTag: '生肖：兔',
      shengxiaoIcon: 'icon-tuxiao',
      xingzuoTag: '星座：巨蟹座',
      xingzuoIcon: 'icon-juxiezuo',
      dateFormat: 'YYYY-MM-DD',
      defaultAddress: '',
      preview: {},
      form: this.$form.createForm(this),
      option: {
        img: '',
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
    ...mapActions(['updateUserPassword', 'updateUserInfo']),
    moment,
    setavatar(url) {
      this.option.img = url
    },
    saveSettings() {
      // console.log('test console, cities is:', this.cities)
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.city = values.city[0] + ' ' + values.city[1] + ' ' + values.city[2]
          console.log('new values of form: ', values)
          let sendData = {
            username: this.username,
            nickname: values.nickname,
            status: Number(values.status),
            address: values.city || store.getters.address,
            description: values.description,
            birthday: this.birthdayStr || store.getters.birthday,
            gender: this.gender,
          }
          this.updateUserInfo(sendData)
            .then((res) => {
              if (res.data.isSuccess) {
                this.$notification.success({
                  message: '修改个人信息成功！',
                })
              } else {
                this.$notification.error({
                  message: '修改个人信息失败，请重试',
                })
              }
            })
            .catch((err) => {
              this.$notification.error({
                message: '修改个人信息失败，请重试',
                description: `${err.name}: ${err.message}`,
              })
            })
        }
      })
    },
    handleChange(value) {
      this.statusStr = value
      value = '5'
      console.log(this.statusStr)
    },
    onChange(date, dateString) {
      this.birthdayStr = dateString
      console.log('onChange about birthday:', this.birthdayStr)
    },
    add() {
      this.$dialog(
        CodeForm,
        // component props
        {
          record: {},
          on: {
            ok() {
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
    dealBirthday() {},
    chooseMale() {
      this.gender = 1
    },
    chooseFemale() {
      this.gender = 2
    },
    chooseUnknown() {
      this.gender = 0
    },
  },
  async created() {
    this.city = Object.freeze(allCity.city)
    this.gender = store.getters.gender
    this.birthday = store.getters.birthday
    this.defaultAddress = store.getters.address
    this.option.img = this.avatar
    if (store.getters.address && store.getters.address.split(' ').length === 3) {
      this.defaultCitiesList = store.getters.address.split(' ')
    }
    console.log('test console, status is:', this.status)
    console.log('test console, birthday is:', this.birthday)
    console.log('test console, defaultCitiesList', this.defaultCitiesList)
    console.log('yesyes', this.gender)
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
#gender-male {
  margin-left: 30%;
  font-size: 22px;
}
#gender-female {
  margin-left: 3%;
  font-size: 22px;
}
#gender-unknown {
  margin-left: 3%;
  font-size: 22px;
}
.blue {
  color: aqua;
}
.pink {
  color: palevioletred;
}
.purple {
  color: purple;
}
</style>

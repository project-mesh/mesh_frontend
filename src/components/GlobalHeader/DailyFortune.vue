<template>
  <icon-font
    type="iconmofang_xingzuoyunshi"
    @click="openNotification"
    :style="{ fontSize: '1.2em' }"
  />
</template>
<script>
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2071810_2dvqjaj08b4.js',
})

export default {
  name: 'DailyFortune',
  components: {
    IconFont,
  },
  methods: {
    openNotification() {
      this.$notification.open({
        message: (
          <div>
            今日运势：
            <span style='color:red;'>§ 中吉 §</span>
          </div>
        ),
        description: (
          <div>
            <div style='color:red;'>宜：摸鱼</div>
            <div style='text-align:center;font-weight:lighter;font-size: 80%;'>要到好多Money</div>
            <div>忌：摸鱼</div>
            <div style='text-align:center;font-weight:lighter;font-size: 80%;'>愉悦身心</div>,
          </div>
        ),
        icon: <a-icon type='smile' theme='twoTone' />,
      })
    },
  },
}
</script>

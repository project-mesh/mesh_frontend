<template>
  <icon-font
    type="iconmofang_xingzuoyunshi"
    @click="openNotification"
    :style="{ fontSize: '1.2em' }"
  />
</template>
<script>
import { mapGetters } from 'vuex'
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2071810_2dvqjaj08b4.js',
})

export default {
  name: 'DailyFortune',
  computed: {
    ...mapGetters(['username']),
  },
  components: {
    IconFont,
  },
  methods: {
    openNotification() {
      const luckValue = this.getRandomNumber()
      if (luckValue >= 55) {
        this.$notification.open({
          message: (
            <div>
              今日运势：
              <span style='color:red;'>§ {this.getGeneralLuck(luckValue)} §</span>
            </div>
          ),
          description: (
            <div>
              <div style='color:red;'>宜：{this.getGoodThings()[0]}</div>
              <div style='text-align:center;font-weight:lighter;font-size: 90%;'>
                {this.getGoodThings()[1]}
              </div>
              <div style='color:green;'>忌：{this.getBadThings()[0]}</div>
              <div style='text-align:center;font-weight:lighter;font-size: 90%;'>
                {this.getBadThings()[1]}
              </div>
              ,
            </div>
          ),
          icon: <a-icon type='frown' theme='twoTone' two-tone-color='#ff0000' />,
        })
      } else {
        this.$notification.open({
          message: (
            <div>
              今日运势：
              <span style='color:green;'>§ {this.getGeneralLuck(luckValue)} §</span>
            </div>
          ),
          description: (
            <div>
              <div style='color:green;'>宜：{this.getGoodThings()[0]}</div>
              <div style='text-align:center;font-weight:lighter;font-size: 90%;'>
                {this.getGoodThings()[1]}
              </div>
              <div style='color:red;'>忌：{this.getBadThings()[0]}</div>
              <div style='text-align:center;font-weight:lighter;font-size: 90%;'>
                {this.getBadThings()[1]}
              </div>
            </div>
          ),
          icon: <a-icon type='smile' theme='twoTone' />,
        })
      }
    },
    getRandomNumber() {
      let seedrandom = require('seedrandom')
      let checkDate = new Date()
      let rng = seedrandom(
        String(checkDate.getFullYear()) +
          String(checkDate.getMonth()) +
          String(checkDate.getDate()) +
          this.username +
          'salt'
      )
      return Math.abs(rng.int32() % 100) + 1
    },
    getGeneralLuck(value) {
      if (value >= 95) {
        return '大凶'
      }
      if (value >= 80) {
        return '凶'
      }
      if (value >= 55) {
        return '小凶'
      }
      if (value >= 20) {
        return '小吉'
      }
      if (value >= 5) {
        return '中吉'
      }
      return '大吉'
    },
    getGoodThings() {
      let seedrandom = require('seedrandom')
      let checkDate = new Date()
      let rng = seedrandom(
        String(checkDate.getFullYear()) +
          String(checkDate.getMonth()) +
          String(checkDate.getDate()) +
          this.username +
          'goodsalt'
      )
      const goodValue1 = Math.abs(rng.int32() % 10)
      const goodValue2 = Math.abs(rng.int32() % 10)
      const goodThingsList = [
        ['摸鱼', '一直摸鱼一直爽'],
        ['看书', '真有趣'],
        ['上哔哩哔哩', '愉悦身心'],
        ['学 Python', '今天能把爬虫学完'],
        ['写作业', '都会'],
        ['去学校', '老师今天心情很好'],
        ['上课', '都能听懂'],
        ['聊天', '总能找到话题'],
        ['刷题', '道道都是精品'],
        ['玩跳舞的线', '很快就完美了'],
      ]
      return [
        goodThingsList[goodValue1][0] + '，' + goodThingsList[goodValue2][0],
        goodThingsList[goodValue1][1] + '；' + goodThingsList[goodValue2][1],
      ]
    },
    getBadThings() {
      let seedrandom = require('seedrandom')
      let checkDate = new Date()
      let rng = seedrandom(
        String(checkDate.getFullYear()) +
          String(checkDate.getMonth()) +
          String(checkDate.getDate()) +
          this.username +
          'badsalt'
      )
      const badValue1 = Math.abs(rng.int32() % 10)
      const badValue2 = Math.abs(rng.int32() % 10)
      const badThingsList = [
        ['开电脑', '死机不可避免'],
        ['祭祖', '祖宗不理你'],
        ['装弱', '被识破'],
        ['崇拜大神', '被大神鄙视'],
        ['玩王者荣耀', '会连续掉分'],
        ['前后段联调', '无限 CORS 报错'],
        ['吃苹果', '一点也不甜'],
        ['买电子垃圾', '会买到真的垃圾'],
        ['玩马里奥制造2', '掉坑会准得离谱'],
        ['拖地板', '总也拖不干净'],
      ]
      return [
        badThingsList[badValue1][0] + '，' + badThingsList[badValue2][0],
        badThingsList[badValue1][1] + '；' + badThingsList[badValue2][1],
      ]
    },
  },
}
</script>

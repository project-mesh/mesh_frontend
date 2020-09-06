<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      @close="onClose"
      :closable="false"
      :visible="visible"
      :drawer-style="{ position: 'absolute' }"
      style="position: absolute"
    >
      <div class="setting-drawer-index-content">
        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">暗色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                  alt="dark"
                />
                <div class="setting-drawer-index-selectIcon" v-if="settings.theme === 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">亮色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                  alt="light"
                />
                <div class="setting-drawer-index-selectIcon" v-if="settings.theme !== 'dark'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip
              class="setting-drawer-theme-color-colorBlock"
              v-for="(item, index) in colorList"
              :key="index"
            >
              <template slot="title">
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon type="check" v-if="item.color === settings.primaryColor"></a-icon>
              </a-tag>
            </a-tooltip>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">侧边栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('sidemenu')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                  alt="sidemenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="settings.layout === 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">顶部栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('topmenu')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                  alt="topmenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="settings.layout !== 'sidemenu'">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
          <div :style="{ marginTop: '24px' }">
            <a-list :split="false">
              <a-list-item>
                <a-tooltip slot="actions">
                  <template slot="title">该设定仅 [顶部栏导航] 时有效</template>
                  <a-select
                    size="small"
                    style="width: 80px"
                    :value="settings.contentWidth ? 'Fixed' : 'Fluid'"
                    @change="handleContentWidthChange"
                  >
                    <a-select-option value="Fixed">固定</a-select-option>
                    <a-select-option value="Fluid" v-if="settings.layout !== 'sidemenu'">
                      流式
                    </a-select-option>
                  </a-select>
                </a-tooltip>
                <a-list-item-meta>
                  <div slot="title">内容区域宽度</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :default-checked="settings.fixedHeader"
                  @change="handleFixedHeader"
                />
                <a-list-item-meta>
                  <div slot="title">固定 Header</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :disabled="settings.layout === 'topmenu'"
                  :default-checked="settings.fixSiderbar"
                  @change="handleFixSiderbar"
                />
                <a-list-item-meta>
                  <div
                    slot="title"
                    :style="{
                      textDecoration: settings.layout === 'topmenu' ? 'line-through' : 'unset',
                    }"
                  >
                    固定侧边菜单
                  </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">其他设置</h3>
          <div>
            <a-list :split="false">
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :default-checked="settings.colorWeak"
                  @change="onColorWeak"
                />
                <a-list-item-meta>
                  <div slot="title">色弱模式</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
      <div class="setting-drawer-index-handle" @click="toggle" slot="handle">
        <a-icon type="setting" v-if="!visible" />
        <a-icon type="close" v-else />
      </div>
    </a-drawer>
  </div>
</template>

<script>
import config from '@/config/defaultSettings'
import SettingItem from './SettingItem'
import { updateTheme, updateColorWeak, colorList } from './settingConfig'
import {
  TOGGLE_NAV_THEME,
  TOGGLE_LAYOUT,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_COLOR,
  TOGGLE_WEAK,
} from '@/store/mutation-types'

export default {
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  components: {
    SettingItem,
  },
  mixins: [],
  data() {
    return {
      visible: false,
      colorList,
    }
  },
  watch: {},
  mounted() {
    updateTheme(this.settings.primaryColor)
    if (this.settings.colorWeak !== config.colorWeak) {
      updateColorWeak(this.settings.colorWeak)
    }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    toggle() {
      this.visible = !this.visible
    },
    onColorWeak(checked) {
      this.$store.commit(TOGGLE_WEAK, checked)
      this.$emit('change', { type: 'colorWeak', value: checked })
      updateColorWeak(checked)
    },
    handleMenuTheme(theme) {
      this.$store.commit(TOGGLE_NAV_THEME, theme)
      this.$emit('change', { type: 'theme', value: theme })
    },
    handleLayout(mode) {
      this.$store.commit(TOGGLE_LAYOUT, mode)
      this.$emit('change', { type: 'layout', value: mode })
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      this.handleFixSiderbar(false)

      this.handleContentWidthChange('Fixed')
    },
    handleContentWidthChange(type) {
      this.$store.commit(TOGGLE_CONTENT_WIDTH, type)
      this.$emit('change', { type: 'contentWidth', value: type })
    },
    changeColor(color) {
      if (this.settings.primaryColor !== color) {
        this.$store.commit(TOGGLE_COLOR, color)
        this.$emit('change', { type: 'primaryColor', value: color })
        updateTheme(color)
      }
    },
    handleFixedHeader(fixed) {
      this.$store.commit(TOGGLE_FIXED_HEADER, fixed)
      this.$emit('change', { type: 'fixedHeader', value: fixed })
    },
    handleFixSiderbar(fixed) {
      if (this.settings.layout === 'topmenu') {
        this.$emit('change', { type: 'fixSiderbar', value: false })
        this.$store.commit(TOGGLE_FIXED_SIDEBAR, false)
        return
      }
      this.$store.commit(TOGGLE_FIXED_SIDEBAR, fixed)
      this.$emit('change', { type: 'fixSiderbar', value: fixed })
    },
  },
}
</script>

<style lang="less" scoped>
.setting-drawer-index-content {
  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}

.setting-drawer-index-handle {
  position: absolute;
  top: 240px;
  background: #1890ff;
  width: 48px;
  height: 48px;
  right: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 1001;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;

  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>

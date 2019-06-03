<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="setVisible(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="setVisible(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="setVisible(1)"></span>
        </div>
        <div class="icon-wrapper" @click="setVisible(0)">
          <span class="icon-A"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import { ebookMixin } from "../../util/mixin.js";
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'
export default {
  mixins: [ebookMixin],
  methods: {
    setVisible(key){
      this.setSettingVisible(key)
    }
  },
  components:{
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 200;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  font-size: px2rem(20);
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include center;
    .icon-progress {
      font-size: px2rem(24);
    }
    .icon-bright {
      font-size: px2rem(22);
    }
  }
}
</style>
<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" 
         @click="onMaskClick"
         @touchmove='move'
         @touchend='moveEnd'
         @mousedown.left='onMouseEnter'
         @mousemove='onMouseMove'
         @mouseup='onMouseEnd'></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "../../util/mixin.js";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from "../../util/localStorage";
import { flatten } from '../../util/book.js'
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  methods: {
    initEpub() {
      const url = process.env.VUE_APP_RES_URL + "/epub/" + this.fileName + ".epub";
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition()
      this.parseBook()
      this.book.ready.then(() => {
        return this.book.locations.generate(750*(window.innerWidth/375)*(getFontSize(this.fileName)/16))
      }).then(locations => {
        this.navigation.forEach(nav => {
          nav.pagelist = []
        })
        locations.forEach(item => {
          const loc = item.match(/\[(.*)\]!/)[1]
          this.navigation.forEach(nav => {
            if(nav.href){
              const href = nav.href.match(/^(.*)\.html$/)
              if(href === loc){
                nav.pagelist.push(item)
              }
            }
          })
          let currentPage = 1
          this.navigation.forEach((nav, index) => {
            if(index === 0){
              nav.page = 1
            } else {
              nav.page = currentPage
            }
            currentPage += nav.pagelist.length
          })
        })
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    },
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.currentBook.rendition.themes.fontSize(fontSize + "px");
        this.setDefaultFontSize(fontSize);
      }
    },
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.currentBook.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
    parseBook(){
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find(item,level = 0){
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0],++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
         this.setNavigation(navItem)
      })
    },
    onMaskClick(e) {
      if(this.mouseState && (this.mouseState === 2 || this.mouseState === 3)){
        return
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (e.offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (e.offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    move(e){
      let offsetY = 0
      if(this.firstOffsetY){
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      }else{
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd(e){
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    onMouseEnter(e){
      this.mouseState = 1
      e.preventDefault()
      e.stopPropagation()
      this.mouseStartTime = e.timeStamp
    },
    onMouseMove(e){
      if(this.mouseState === 1){
        this.mouseState = 2
      }else if(this.mouseState === 2){
        let offsetY = 0
        if(!this.firstOffsetY){
          this.firstOffsetY = e.clientY
        }else{
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e){
      if(this.mouseState === 2){
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else if(this.mouseState === 3){
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if(time < 100){
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    initRendition(){
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        method: "default"
      });
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontSize();
        this.initFontFamily();
        this.initTheme();
        this.initGlobalStyle()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          )
        ]).then(() => {});
      });
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
      }
      this.hideTitleAndMenu();
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
      }
      this.hideTitleAndMenu();
    },
    toggleTitleAndMenu() {
      this.setMenuVisible(!this.menuVisible);
      this.setFontFamilyVisible(false);
      this.setSettingVisible(-1);
    }
  },
  mounted() {
    const fileName = this.$route.params.fileName.split("|").join("/");
    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.ebook-reader {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 150;
    background: transparent;
  }
}
</style>
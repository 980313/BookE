import {
  mapActions,
  mapGetters
} from 'vuex'
import {
  themeList,
  removeAll,
  addClass,
  getReadTimeByMinute
} from './book'
import { saveLocation, getBookmark } from './localStorage'
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookmark',
      'paginate',
      'isPaginating',
      'pagelist'
    ]),
    themeList () {
      return themeList(this)
    },
    getSectionName () {
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookmark',
      'setIsPaginating',
      'setPagelist',
      'setPaginate'
    ]),
    initGlobalStyle () {
      removeAll()
      switch (this.defaultTheme) {
        case 'Default':
          addClass(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addClass(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addClass(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addClass(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
      }
    },
    display (traget, cb) {
      if (traget) {
        this.currentBook.rendition.display(traget).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(progress * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length
          const currentPage = currentLocation.start.locations
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + '/' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    }
  }
}

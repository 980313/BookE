<template>
  <div class="ebook" ref="ebook">
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-title></ebook-title>
    <ebook-bookmark></ebook-bookmark>
    <ebook-header></ebook-header>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader'
import EbookMenu from '../../components/ebook/EbookMenu'
import EbookTitle from '../../components/ebook/EbookTitle'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../util/localStorage';
import { ebookMixin } from '../../util/mixin.js'
export default {
  mixins: [ebookMixin],
  components:{
    EbookReader,
    EbookMenu,
    EbookTitle,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  methods: {
    startLoopReadTime(){
      let readTime = getReadTime(this.fileName)
      if(!readTime){
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if(readTime % 30 === 0){
          saveReadTime(this.fileName, readTime)
        }
      },1000)
    },
    move(v){
      this.$refs.ebook.style.top = v + 'px'
    },
    restore(){
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = null
      },200)
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if(this.task){
      clearInterval(this.task)
    }
  },
  watch: {
    offsetY(v){
      if(!this.menuVisible && this.bookAvailable){
        if(v > 0){
          this.move(v)
        }else if(v === 0){
          this.restore()
        }
      }
    }
  },
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
.ebook{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
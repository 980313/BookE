const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('SET_FILENAME', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('SET_MENU_VISIBLE', menuVisible)
  },
  setSettingVisible: ({ commit }, settingVisible) => {
    return commit('SET_SETTING_VISIBLE', settingVisible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => {
    return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
  },
  setCurrentBook: ({ commit }, currentBook) => {
    return commit('SET_CURRENT_BOOK', currentBook)
  },
  setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
    return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
  },
  setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
    return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
  },
  setDefaultTheme: ({ commit }, defaultTheme) => {
    return commit('SET_DEFAULT_THEME', defaultTheme)
  },
  setProgress: ({ commit }, progress) => {
    return commit('SET_PROGRESS', progress)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('SET_BOOK_AVAILABLE', bookAvailable)
  },
  setSection: ({ commit }, section) => {
    return commit('SET_SECTION', section)
  },
  setCover: ({ commit }, cover) => {
    return commit('SET_COVER', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('SET_METADATA', metadata)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('SET_NAVIGATION', navigation)
  },
  setIsBookmark ({ commit }, isBookmark) {
    return commit('SET_IS_BOOKMARK', isBookmark)
  },
  setOffsetY ({ commit }, offsetY) {
    return commit('SET_OFFSETY', offsetY)
  },
  setPaginate: ({ commit }, paginate) => {
    return commit('SET_PAGINATE', paginate)
  },
  setIsPaginating: ({ commit }, isPaginating) => {
    return commit('SET_IS_PAGINATING', isPaginating)
  },
  setPagelist: ({ commit }, pagelist) => {
    return commit('SET_PAGELIST', pagelist)
  }
}
export default actions

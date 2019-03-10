import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.config.devtools = true

export const store = new Vuex.Store({
  strict: true,
  state: {
    isRemoveModeEnabled: false,
    isUserLoggedIn: false,
    activeListId: '',
    defaultListId: '',
    currentMetaId: 'meta',
    isDefaultList: true,
    selectListName: '',
    userId: '',
  },
  mutations: {
    resetState: (state) => {
      state.isRemoveModeEnabled = false
      state.isUserLoggedIn = false
      state.activeListId = ''
      state.defaultListId = ''
      state.currentMetaId = 'meta'
      state.isDefaultList = true
      state.selectListName = ''
      state.userId = ''
    },
    toggleRemoveWordMode: (state) => {
      state.isRemoveModeEnabled = !state.isRemoveModeEnabled
    },
    toggleSignInMode: (state, isLoggedIn) => {
      if (isLoggedIn) {
        return state.isUserLoggedIn = true
      }
      state.isUserLoggedIn = !state.isUserLoggedIn
    },
    clearSignInMode: (state) => {
      state.isUserLoggedIn = false
    },
    enableSignInMode: (state) => {
      state.isUserLoggedIn = true
    },
    setActiveListId: (state, id) => {
      state.activeListId = id
    },
    // setCurrentMetaId: (state, id) => {
    //   state.currentMetaId = id
    // },
    setIsDefaultList: (state, isDefaultList) => {
      state.isDefaultList = isDefaultList
    },
    setDefaultListId: (state, id) =>
      state.defaultListId = id,
    setSelectedListName: (state, listName) =>
      state.selectListName = listName,
    setUserId: (state, uid) =>
      state.userId = uid,
    updateStoreFromMeta: (state, newState) => {
      state.defaultListId = newState.defaultListId
      state.activeListId = newState.activeListId
      state.defaultListId = newState.defaultListId
      state.isDefaultList = newState.isDefaultList
      state.selectListName = newState.selectListName
      state.userId = newState.userId
    }
  },
  getters: {
    getActiveListId: state =>
      state.activeListId,
    getCurrentMetaId: state =>
      state.currentMetaId,
    getIsDefaultList: state =>
      state.isDefaultList,
    getDefaultListId: state =>
      state.defaultListId,
  }
})
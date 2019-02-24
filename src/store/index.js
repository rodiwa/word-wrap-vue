import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state: {
    isRemoveModeEnabled: false,
    isUserLoggedIn: false,
    activeListId: '',
    defaultListId: '',
    currentMetaId: '',
    isDefaultList: true,
  },
  mutations: {
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
    setCurrentMetaId: (state, id) => {
      state.currentMetaId = id
    },
    setIsDefaultList: (state, isDefaultList) => {
      state.isDefaultList = isDefaultList
    },
    setDefaultListId: (state, id) =>
      state.defaultListId = id
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
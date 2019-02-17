import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state: {
    isRemoveModeEnabled: false,
    isUserLoggedIn: false
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
    }
  }
})
import { createStore } from 'vuex'
import authModule from '../store/modules/auth'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: true,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
  },
  actions: {},
  modules: { auth: authModule },
})

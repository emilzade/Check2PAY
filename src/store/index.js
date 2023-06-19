import { createStore } from 'vuex'
import authModule from '../store/modules/auth'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: true,
    prodApi: 'http://localhost:84',
    testApi: 'http://localhost:90',
    searchHistoryItemByPartition: '',
    currentVendorCode: 1,
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
    setSearchHistoryItemByPartition(state, data) {
      state.searchHistoryItemByPartition = data
    },
    setCurrentVendorCode(state, data) {
      state.currentVendorCode = data
    },
  },
  actions: {
    fetchGetObject() {
      return {
        method: 'Get',
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
        },
      }
    },
  },
  modules: { auth: authModule },
})

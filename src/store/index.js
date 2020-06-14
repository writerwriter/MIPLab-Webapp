import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
  },
  mutations: {
    Loading(state){
      state.isLoading = true;
    },
    Loaded(state) {
      state.isLoading = false;
    }
  },
  actions: {
  },
  modules: {
  }
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    userState:null
  },
  mutations: {
    changeState (state,obj) {
      console.log(obj)
      //state.userState = num;
    }
  },
  actions:{
    changeState({commit},obj){
      commit('changeState',obj)
    }
  }
})

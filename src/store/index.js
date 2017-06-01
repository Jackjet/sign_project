import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  top_title:"",
  userState:null,
  uploadData:{},
  uploadMessage:{}
}

const Actions = {
    changeState({commit},num){
      commit('changeState',num)
    },
    changeStorageData({commit},jsonData){
      commit('changeStorageData',jsonData)
    },
    changeStorageMsg({commit},jsonData){
      commit('changeStorageMsg',jsonData)
    },
    changeTitle({commit},stringData){
      commit('changeTitle',stringData)
    }
  }
const Mutations = {
  changeState (state,num) {
      state.userState = num;
  },
  changeStorageData(state,jsonData){
      state.uploadData = jsonData;
  },
  changeStorageMsg(state,jsonData){
      state.uploadMessage = jsonData;
  },
  changeTitle(state,stringData){
      state.top_title = stringData;
  }
}

const Getters = {
  userState(state) {    
      return state.userState;
  },
  uploadData(state){
      return state.uploadData;
  },
  uploadMessage(state){
      return state.uploadMessage;
  },
  top_title(state){

      return state.top_title;
  }
}

export default new Vuex.Store({
  state:state,
  actions:Actions,
  mutations:Mutations,
  getters:Getters
})

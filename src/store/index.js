import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  top_title:"",         //页面顶部导航文字
  userState:null,       //登录用户的状态  0 1 2 3
  userName:null,        //用户名称
  roleState:null,       //用户的角色（是否为主管） 0 1
  uploadData:{},        //
  uploadMessage:{},
  comNav:true,           //控制公共导航的显示隐藏   menu_left.vue  nav_top.vue  footer 
}

const Actions = {
    changeState({commit},num){
      commit('changeState',num)
    },
    changeUserName({commit},name){
      commit('changeUserName',name)
    },
    changeRolState({commit},num){
      commit('changeRolState',num)
    },
    changeStorageData({commit},jsonData){
      commit('changeStorageData',jsonData)
    },
    changeStorageMsg({commit},jsonData){
      commit('changeStorageMsg',jsonData)
    },
    changeTitle({commit},stringData){
      commit('changeTitle',stringData)
    },
    changeComNav({commit},state2){
      commit('changeComNav',state2)
    }
  }
const Mutations = {
  changeState (state,num) {
      state.userState = num;
  },
  changeUserName(state,name){
      state.userName = name;
  },
  changeRolState(state,num){
      state.roleState = num;
  },
  changeStorageData(state,jsonData){
      state.uploadData = jsonData;
  },
  changeStorageMsg(state,jsonData){
      state.uploadMessage = jsonData;
  },
  changeTitle(state,stringData){
      state.top_title = stringData;
  },
  changeComNav(state,state2){
    state.comNav = state2;
  }
}

const Getters = {
  userState(state) {    
      return state.userState;
  },
  userName(state){
      return state.userName;
  },
  roleState(state){
      return state.roleState;
  },
  uploadData(state){
      return state.uploadData;
  },
  uploadMessage(state){
      return state.uploadMessage;
  },
  top_title(state){

      return state.top_title;
  },
  comNav(state){
    return state.comNav;
  }
}

export default new Vuex.Store({
  state:state,
  actions:Actions,
  mutations:Mutations,
  getters:Getters
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  curAccount:null,      //用户所有数据
  top_title:"",         //页面顶部导航文字
  userState:null,       //登录用户的状态  0 1 2 3
  userAccId:null,       //登录用户的accid  （标识）
  userName:null,        //用户名称
  roleState:null,       //用户的角色（是否为主管） 0 1
  headImg:null,
  uploadData:{},        //
  uploadMessage:{},
  uploadFile:'',
  comNav:true,          //控制公共导航的显示隐藏   menu_left.vue  nav_top.vue  footer 
  countLetter:null,     //站内未读信息
  model:{state:false,context:''}
}

const Actions = {
    saveCurAccount({commit},jsonData){
      commit('saveCurAccount',jsonData)
    },
    changeState({commit},num){
      commit('changeState',num)
    },
    changeAccid({commit},accid){
      commit('changeAccid',accid)
    },
    changeUserName({commit},name){
      commit('changeUserName',name)
    },
    changeRolState({commit},num){
      commit('changeRolState',num)
    },
    changeHeadImg({commit},href){
      commit('changeHeadImg',href)
    },
    changeStorageData({commit},jsonData){
      commit('changeStorageData',jsonData)
    },
    changeStorageMsg({commit},jsonData){
      commit('changeStorageMsg',jsonData)
    },
    changeStorageFile({commit},fileName){
      commit('changeStorageFile',fileName)
    },
    changeTitle({commit},stringData){
      commit('changeTitle',stringData)
    },
    changeComNav({commit},state2){
      commit('changeComNav',state2)
    },
    changeCountLetter({commit},num){
      commit('changeCountLetter',num)
    },
    changeModel({commit},obj){
      commit('changeModel',obj)
    }
  }
const Mutations = {
  saveCurAccount(state,jsonData){   //用户信息
    state.curAccount = jsonData;
  },
  changeState (state,num) {    //用户状态
      state.userState = num;
  },
  changeAccid (state,accid) {    //用户标识
    state.userAccId = accid;
},
  changeUserName(state,name){  //用户名称
      state.userName = name;
  },
  changeRolState(state,num){   //用户角色
      state.roleState = num;
  },
  changeHeadImg(state,href){
      state.headImg = href;
  },
  changeStorageData(state,jsonData){
      state.uploadData = jsonData;
  },
  changeStorageMsg(state,jsonData){
      state.uploadMessage = jsonData;
  },
  changeStorageFile(state,fileName){
    state.uploadFile = fileName;
},
  changeTitle(state,stringData){      
      state.top_title = stringData;
  },
  changeComNav(state,state2){
    state.comNav = state2;
  },
  changeCountLetter(state,num){
    state.countLetter = num;
  },
  changeModel(state,obj){
    state.model = obj;
  }
}

const Getters = {
  curAccount(state){
    return state.curAccount;
  },
  userState(state) {        
      return state.userState;
  },
  userAccId(state){
    return state.userAccId;
  },
  userName(state){
      return state.userName;
  },
  roleState(state){
      return state.roleState;
  },
  headImg(state){
    return state.headImg;
  },
  uploadData(state){
      return state.uploadData;
  },
  uploadMessage(state){
      return state.uploadMessage;
  },
  uploadFile(state){
    return state.uploadFile;
  },
  top_title(state){

      return state.top_title;
  },
  comNav(state){
    return state.comNav;
  },
  countLetter(state){
    return state.countLetter;
  },
  model(state){
    return state.model
  }
}

export default new Vuex.Store({
  state:state,
  actions:Actions,
  mutations:Mutations,
  getters:Getters
})

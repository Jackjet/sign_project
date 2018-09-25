// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'

import 'babel-polyfill'

import axios from 'axios'

import './assets/css/font2/font.css';
import '@/assets/css/share.min.css';
import '@/assets/css/sign_check.scss';
import '@/assets/css/jquery.mCustomScrollbar.min.css';

axios.defaults.withCredentials = true;
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.prototype.$http = axios;
import MyPlugin from './assets/js/common.js'
Vue.use(MyPlugin)

/* url */
Vue.prototype.URL = require('./assets/js/URL.js').default;
Vue.prototype.validateQb =  require('./assets/js/validate.js').default;
/* 公共js */
const JQ = require('./assets/js/plugin/jquery-1.12.2.min.js');
const JQ2 = require('./assets/js/plugin/jquery.mCustomScrollbar.concat.min.js');
require('./assets/js/plugin/jquery.share.js');
require('./assets/js/plugin/jquery.qrcode.min.js');

//页码公共组件
import pagination from './components/common/pagination/index.js';
Vue.use(pagination)

//温馨提示公共组件
import alertModel from './components/common/alert/index.js';
Vue.use(alertModel)

//模态框公共组件
import Model from './components/common/model/index.js';
Vue.use(Model)

//公共加载效果
//模态框公共组件
import Loading from './components/common/loading/index.js';
Vue.use(Loading)

//table公共组件
import TableList from './components/common/table/index.js';
Vue.use(TableList)

// /*tree公共组件 */
import Tree from './components/common/Tree/index.js';
Vue.use(Tree)


Vue.prototype.setLSData=function(key, value){
 localStorage.setItem(key, JSON.stringify(value));
};
/*
 * 获取localStorage
 */
Vue.prototype.getLSData=function(key){
  return JSON.parse(window.localStorage.getItem(key));
};
/*
 * 清楚localStorage数据
 */
Vue.prototype.removeLSData=function(key){
  window.localStorage.removeItem(key);
};

Vue.prototype.removeArr = function(arr,val) {   //移除数组中
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};

Array.prototype.in_array = function (element) {    
  　　for (var i = 0; i < this.length; i++) { 
  　　  if (this[i] == element){
          return true
        } 
      } 
      return false;    
  }  

/*自定义focus指令 */
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el){
    el.focus();
  },
  update(el,binding){  
      if(binding.value){
        el.focus();
      }   
  }
})

Vue.filter('filterdata', function (value) {//value为13位的时间戳
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    if(value){
      var time = new Date(parseInt(value));
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      return y + '.' + add0(m) + '.' + add0(d);
    }else{
      return '无法获取';
    }   
});

//路由跳转之前
router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;  
  if(to.name != 'noallow' && to.name !="Welcome" &&  to.name != "Product" && to.name != "onlineSign" && to.name != "onlineSignState"){
    Vue.prototype.getLoginData(to.name);
  }  
  if(from.name == "letter"){    //从站内信跳转到其他地方获取未读信息
    Vue.prototype.countUnreadMessage(store);
  }
  if(to.name != 'sign_state' && to.name != 'onlineSignState'){   
    localStorage.removeItem('uploadData');
    localStorage.removeItem('uploadMessage');    
  }

  if(to.name == 'noallow' || to.name=="Welcome" || to.name == "Product" || to.name== "onlineSign" || to.name == "onlineSignState" || to.name=="p_toFillin"){
    store.dispatch('changeComNav',false) 
  }else{
    store.dispatch('changeComNav',true)
  }
  next();
})     


Vue.config.productionTip = false;
Vue.prototype.Event2=new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'

/*var Promise = require('es6-promise').Promise;*/
import 'babel-polyfill'
/*require('es6-promise').polyfill()*/
import axios from 'axios'


axios.defaults.withCredentials = true;
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.prototype.$http = axios;
import MyPlugin from './assets/js/common.js'
Vue.use(MyPlugin)


//页码公共组件
import pagination from './components/common/pagination/index.js';
Vue.use(pagination)

//模态框公共组件
import alertModel from './components/common/alert/index.js';
Vue.use(alertModel)

//公共加载效果
//模态框公共组件
import Loading from './components/common/loading/index.js';
Vue.use(Loading)

const JQ = require('./assets/js/jquery-1.12.2.min.js');
const JQ2 = require('./assets/js/jquery.mCustomScrollbar.concat.min.js');
require('./assets/js/jquery.share.js');
require('./assets/js/jquery.qrcode.min.js');

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

Vue.prototype.removeArr = function(arr,val) {
   console.log("开始数组")
   console.log(arr)
   console.log("比较数组")
   console.log(val)
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    // console.log("结果数组")
    // console.log(arr)
    return arr;
};

Vue.prototype.httpPost=function(url,data,success,fail){
      this.$http({
        "method":"POST",
        "url":Vue.prototype.apiPath + url,
        "data":JSON.stringify(data),
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        requestHeader:{'Content-Type':'application/json'},
        responseType: 'json'
      }).then(success).catch(fail)
  };

Vue.filter('filterdata', function (value) {//value为13位的时间戳
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    var time = new Date(parseInt(value));
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();

    return y + '.' + add0(m) + '.' + add0(d);
});


router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  if(to.name == "file"){
    document.title="签吧-归档"
  }
  if(to.name == "sign_check"){
    document.title="签吧-验签"
  }
  if(to.name == "statistics_count"){
    document.title="签吧-签署次数"
  }
  if(to.name == "statistics_detail"){
    document.title="签吧-签署次数详情"
  }
  if(to.name == "log"){
    document.title="签吧-日志"
  }
  if(to.name == "Welcome"){
    document.title="签吧-首页"
  }
  if(to.name == "Product"){
    document.title="签吧-产品介绍"
  }
  if(to.name == "onlineSign" || to.name == "onlineSignState"){
    document.title="签吧-在线验签"
  }
  if(to.name != 'sign_state' && to.name != 'onlineSignState'){   
    localStorage.removeItem('uploadData');
    localStorage.removeItem('uploadMessage');    
  }

  if(to.name == 'noallow' || to.name=="Welcome" || to.name == "Product" || to.name== "onlineSign" || to.name == "onlineSignState"){
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

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

import Vuex from 'vuex'
Vue.use(Vuex)

Vue.prototype.$http = axios;
import MyPlugin from './assets/js/common.js'
Vue.use(MyPlugin)
import 'babel-polyfill'

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

/*const JQ2 = require('./assets/js/jquery-ui.min.js');
const JQ3 = require('./assets/js/jquery.mousewheel.min.js');
const JQ4 = require('./assets/js/jquery.mCustomScrollbar.min.js');*/


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

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

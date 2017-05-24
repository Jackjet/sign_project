// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
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

const JQ = require('./assets/js/jquery-1.12.2.min.js');
const JQ2 = require('./assets/js/jquery.mCustomScrollbar.concat.min.js');

/*const JQ2 = require('./assets/js/jquery-ui.min.js');
const JQ3 = require('./assets/js/jquery.mousewheel.min.js');
const JQ4 = require('./assets/js/jquery.mCustomScrollbar.min.js');*/

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

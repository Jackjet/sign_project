import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import sign_state from '@/components/sign_state'
// import sign_check from '@/components/sign_check'

Vue.use(Router)

//const Hello = resolve => require(['@/components/Hello'], resolve)
const Index = resolve => require(['@/components/index'], resolve)                      //首页
const Welcome = resolve => require(['@/components/welcome'], resolve)                  //欢迎页
const Product = resolve => require(['@/components/product_info'], resolve)             //产品介绍
const onlineSign = resolve => require(['@/components/online_check'], resolve)             //在线验签页
const onlineSignState = resolve => require(['@/components/online_state'], resolve)             //在线验签结果页
const sign_state = resolve => require(['@/components/sign_state'], resolve)   //验签成功失败页面
const sign_check = resolve => require(['@/components/sign_check'], resolve)   //验签页面
const file = resolve => require(['@/components/file'], resolve)         //归档页面
const statistics_count = resolve => require(['@/components/statistics_count'], resolve)         //统计页面
const statistics_detail = resolve => require(['@/components/statistics_detail'], resolve)         //统计详情页
const log = resolve => require(['@/components/log'], resolve)         //日志页面
const log_operation = resolve => require(['@/components/log_operation'], resolve)         //日志页面
const noallow = resolve => require(['@/components/noallow'], resolve)         //日志页面

//const sign_state = r => require.ensure([], () => r(require('@/components/sign_state')), 'sign_state')


export default new Router({
  
  //mode: 'history',
  routes: [
    // {
    //   path: '/hello',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children:[
        {
          path:"welcome",
          name: 'Welcome',
          component:Welcome
        },
        {
          path:"product_info",
          name: 'Product',
          component:Product
        },
        {
          path:"onlinesign",
          name:"onlineSign",
          component:onlineSign
        },
        {
          path:"onlinestate",
          name:"onlineSignState",
          component:onlineSignState
        }
      ]
    },
    {
      path: '/sign_check',
      name: 'sign_check',
      component: sign_check
    },
    {
      path: '/sign_state',
      name: 'sign_state',
      component: sign_state
    },
    {
      path: '/file',
      name: 'file',
      component: file
    },
    {
      path: '/statistics_count',
      name: 'statistics_count',
      component: statistics_count
    },
    {
      path: '/statistics_detail/:companyId/:startTime/:endTime',
      name: 'statistics_detail',
      component: statistics_detail
    },
    {
      path: '/404',
      name: 'noallow',
      component: noallow
    },
    {
      path: '/log',
      name: 'log',
      component: log,
      children: [
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'user_operation/:id',
          component: log_operation
        }
      ]
    },
    {
      path:'/',
      redirect:'/index/welcome'
    },
    {
      path:'*',
      redirect:'/404'
    }
  ]
})

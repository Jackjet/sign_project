import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// const Hello = resolve => require(['@/components/Hello'], resolve)
const Index = resolve => require(['@/components/welcome/index'], resolve)                         //首页
const Welcome = resolve => require(['@/components/welcome/welcome'], resolve)                     //欢迎页
const Product = resolve => require(['@/components/welcome/product_info'], resolve)                //产品介绍
const onlineSign = resolve => require(['@/components/welcome/online_check'], resolve)             //在线验签页
const onlineSignState = resolve => require(['@/components/welcome/online_state'], resolve)        //在线验签结果页

//首页 
const indexAdmin = resolve => require(['@/components/index/index_admin'], resolve)                //管理员首页   

//站内信
const letter = resolve => require(['@/components/letter/letter'], resolve)                        //站内信          

//我的文档
const documentList = resolve => require(['@/components/file/documentList'], resolve)              //文档列表页面      
const draft = resolve => require(['@/components/file/draft'], resolve)                            //草稿箱             
const sign_check = resolve => require(['@/components/file/sign_check'], resolve)                  //验签页面
const sign_state = resolve => require(['@/components/file/sign_state'], resolve)                  //验签成功失败页面
const file = resolve => require(['@/components/file/file'], resolve)                              //归档页面
const mySend = resolve => require(['@/components/file/mySend'], resolve)                          //我发起的文档列表             
const copy = resolve => require(['@/components/file/copy'], resolve)                              //抄送给我的文档列表              
const toFillin = resolve => require(['@/components/file/toFillin'], resolve)                      //发起签约页面                
const docDetail = resolve => require(['@/components/file/docDetail'], resolve)                    //文档详情页面                
const report = resolve => require(['@/components/file/report'], resolve)                          //鉴定报告页面  +****

//通讯录
const contacts = resolve => require(['@/components/mailList/contacts'], resolve)                       //联系人           
const partner = resolve => require(['@/components/mailList/partner'], resolve)                         //合作伙伴                  
const organization = resolve => require(['@/components/mailList/organization'], resolve)               //组织架构                     

//我的账户
const security = resolve => require(['@/components/myAccount/security'], resolve)                    //安全设置                
const basicInfo = resolve => require(['@/components/myAccount/basicInfo'], resolve)                  //基本设置                
const stampList = resolve => require(['@/components/myAccount/stampList'], resolve)                  //签章管理                 
const companyReal = resolve => require(['@/components/myAccount/companyReal'], resolve)              //企业实名认证                 

//签署统计
const statistics_count = resolve => require(['@/components/statistics/statistics_count'], resolve)              //统计页面
const statistics_detail = resolve => require(['@/components/statistics/statistics_detail'], resolve)            //统计详情页
const log = resolve => require(['@/components/statistics/log'], resolve)                                        //日志页面
const log_operation = resolve => require(['@/components/statistics/log_operation'], resolve)                    //日志页面

const examine = resolve => require(['@/components/statistics/examine'], resolve)                                //实名认证审核页面
const examineDetail = resolve => require(['@/components/statistics/examine_detail'], resolve)                   //实名认证审核页面

const noallow = resolve => require(['@/components/noallow'], resolve)                                           //404页面


//const sign_state = r => require.ensure([], () => r(require('@/components/sign_state')), 'sign_state')



export default new Router({  
  // mode: 'history',
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
          path:"welcome",                           //欢迎页
          name: 'Welcome',
          component:Welcome
        },
        {
          path:"product_info",                      //产品介绍页
          name: 'Product',
          component:Product
        },
        {
          path:"onlinesign",                        //在线验签页
          name:"onlineSign",
          component:onlineSign
        },
        {
          path:"onlinestate",                      //在线验签结果页面
          name:"onlineSignState",
          component:onlineSignState
        }
      ]
    },
    {
      path:"/cus/account/accountIndex",            //大B管理员首页
      name: 'indexAdmin',
      component:indexAdmin
    }, 
    {
      path:"/doc/documentList/sign",               //文档列表
      name: 'documentList',
      component:documentList,
      meta:{
        type:'201'
      }
    },
    {
      path:"/doc/documentInfo/toDocDetail/:docId",        //文档详情页
      name: 'docDetail',      
      meta:{
        type:'201'
      },         
      component:docDetail  
    },
    {
      path:"/doc/documentInfo/toMysend",                  //我发起的   文档列表
      name: 'mySend',               
      component:mySend  
    },
    {
      path:"/doc/document/copy",                         //抄送给我的      文档列表
      name: 'copy',               
      component:copy  
    },
    {
      path:"/doc/document/toEvidenceReport",             //鉴定报告页面
      name: 'report',               
      component:report,
      meta:{
        type:'201'
      }
    },
    {
      path:"/doc/documentList/draft",                     //草稿箱
      name: 'draft',
      component:draft
    },
    {
      path: '/file',                                      //归档
      name: 'file',
      component: file,
    },   
    {
      path: '/sign_check',                                //验签
      name: 'sign_check',
      component: sign_check
    },
    {
      path: '/sign_state',                                //验签结果
      name: 'sign_state',
      component: sign_state,
      meta:{
        type:'204'
      }
    },
    {
      path:"/cus/account/security",                       //安全设置
      name: 'security',               
      component:security 
    },
    {
      path:"/sys/auth/comAuthIndex",                      //企业实名认证
      name: 'companyReal',               
      component:companyReal,
      meta:{
        type:'301'
      }
    }, 
    {
      path:"/cus/account/basicInfo",                      //基本信息
      name: 'basicInfo',               
      component:basicInfo  
    },
    {
      path:"/doc/stamp/stampList",                        //签章管理
      name: 'stampList',               
      component:stampList  
    },
    {
      path:"/cus/partners/PartnersList",                  //合作伙伴
      name: 'partner',               
      component:partner  
    },
    {
      path:"/cus/orgStructure/toOrgStructurePage",        //组织架构
      name: 'organization',               
      component:organization  
    }, 
    {
      path:'/contacts',         //联系人
      name:'contacts',
      component:contacts
    },    
    {
      path:"/doc/document/toFillin",                     //发起签约页面
      name: 'toFillin',               
      component:toFillin  
    },
    {
      path:'/letter',         //站内消息
      name:'letter',
      component:letter
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
      path:'/examine',
      name:'examine',
      component:examine
    },
    {
      path:'/examineDetail',
      name:'examineDetail',
      component:examineDetail
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
          name:'log_operation',
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

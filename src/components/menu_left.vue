<template>
  <div id="divSidebarMenu" class="left_col" >
            <!--不自动滚动条添加class 去掉content-1   mCustomScrollbar-->
            <div class="scroll-view " :id=" cloudyState ? '' : 'content-1'"  v-cloak  :class="[cloudyState ? 'sign_page_scrollBody':'']">
                <div class="navbar nav_title">
                    <router-link to="/cus/account/accountIndex" class="site_title" :class="[cloudyState ? 'site_title_c':'']"><i></i></router-link>
                </div>
                <div class="clearfix"></div>
                <div id="sidebar-menu" class="main_menu_side hidden-print main_menu" >
                    <div class="menu_section">
                      <!--超级管理员-->
                        <ul class="side-menu" id="menu" v-if="userStateNum == 0">
                            <li class="menuUserHeadIcon">
                                <img :src="'data:image/png;base64,'+headImg" @click="baseInfo">
                                <router-link class="letter-num" to="/letter">{{countLetter}}</router-link>                                
                                <h3 v-if="userStateNum != 1 " id="menuDisplayNameText " class="shengl">{{curAccount  ? curAccount.displayName  : ''}}</h3>
                                <h3 v-if="userStateNum == 1"></h3>
                                <p v-if="userStateNum != 3 && userStateNum != 0" id="menuCompanyNameText" class="shengl">{{curAccount ? curAccount.companyName : ''}}</p>
                                <p v-if="userStateNum == 0">&nbsp;</p>
                            </li>
                            <li name="menuLiAdmin" class="menuli">
                              <a><i class="icon-group"></i> 企业管理 <span   class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li>
                                        <a :href="linkHref+'sys/largeCompany/toLargeCompanyPage'">企业账户管理</a>
                                    </li>
                                    <li>
                                        <a :href="linkHref+'sys/largeCompany/toLoginUserManage'">账户管控</a>
                                    </li>
                                    <li>
                                        <a :href="linkHref+'doc/stamp/stampAdmin'">签章管控</a>
                                    </li>
                                    <li><router-link to="/examine">实名认证审核</router-link></li>
                                </ul>
                            </li>
                            <li name="menuLiAdmin" class="menuli"><a><i class="icon-mail-list"></i> 系统管理 <span
                                    class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="linkHref+'sys/function/functionPage'">功能管理</a></li>
                                    <li><a :href="linkHref+'sys/function/roleFunctionPage'">权限管理</a></li>
                                </ul>
                            </li>
                            <li name="menuLiAdmin"  class="menuli">
                                <a><i class="icon-open-folder"></i> 文档管理 <span class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="linkHref+'sys/largeCompany/toDocEvidence'">鉴证管理</a></li>
                                </ul>
                            </li>
                            <li name="menuLiAdmin" class="menuli" >
                                <a><i class="icon-file"></i> 统计 <span class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="linkHref+'sys/log/dumpLogs'">接口日志</a></li>
                                    <li><router-link to="/statistics_count">签署次数</router-link></li>
                                    <li><router-link to="/log/user_operation/1">日志</router-link></li>
                                </ul> 
                            </li> 
                        </ul>   
                        <!--用户-->
                        <ul class="side-menu" id="menu" v-if="userStateNum != 0">
                            <li class="menuUserHeadIcon">
                                <img :src="'data:image/png;base64,'+headImg" @click="baseInfo">
                                <router-link class="letter-num" to="/letter">{{countLetter}}</router-link>                                
                                <h3 v-if="userStateNum != 1 " id="menuDisplayNameText " class="shengl">{{curAccount  ? curAccount.displayName  : ''}}</h3>
                                <h3 v-if="userStateNum == 1"></h3>
                                <p v-if="userStateNum != 3 && userStateNum != 0" id="menuCompanyNameText" class="shengl">{{curAccount ? curAccount.companyName : ''}}</p>
                                <p v-if="userStateNum == 0">&nbsp;</p>
                            </li>
                            <li class="indexLi menuli" v-for="(item,index) in menus" :key="index">
                              <router-link :to="item.path" v-if="item.children.length == 0">{{item.text}}</router-link>
                              <a href="javascript:;" v-else><i :class="item.icon"></i>{{item.text}}<span class="icon-left-open-big"></span></a>
                              <ul class="child_menu" v-if="item.children.length > 0" >
                                  <li v-for="(subject,val) in item.children" :key="val">
                                    <router-link :to="subject.path" :class="[type && type ==  subject.type ? 'router-link-active':'']">{{subject.text}}</router-link>
                                  </li>
                              </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="bottom-btn" v-if="!cloudyState">
              <router-link to="/index/welcome">返回官网</router-link>
              <a href="javascript:;" @click="signout">退出</a>
            </div>
           <!--  <div class="bottom-btn-cloudy" v-if="cloudyState">
              <a href="javascript:;" @click="signout">退出</a>
            </div> -->
            <alertModel title="退出" context="确定要退出当前用户吗？"  :showState="showState"  v-show="showState"  :type="2"    @cancelHandle="showState = false" @sureHandle="sureDele">
            </alertModel>
        </div>
</template>

<script>
import { mapGetters } from 'vuex';
import menus from '@/assets/js/menu.js';
export default {
  name: 'menu_left',
  data () {
    return {
      msg:{},
      userStateNum:null,  
      showState:false,
      menus: [],
      type:null
    }
  },
  computed:{
    ...mapGetters([
      'userState','countLetter','headImg','curAccount'
    ])
  },
  methods:{
    getData(){
      var That = this;
      this.httpGet(That.URL.getCurAccount,{},function(response){
        var result = response.data;
        if(result.meta.success){
          That.msg = result.data;
          That.userStateNum = result.data.accType;
          if(That.userStateNum == 1){
            That.menus = menus['one']
          }else if(That.userStateNum == 2){
            That.menus = menus['two']
          }else{
            That.menus = menus['three']
          }
          /**做导航滚动 */
          setTimeout(()=>{
            if(!That.cloudyState){
              $("#content-1").mCustomScrollbar({
                theme:"minimal"
              });
            }
            $('#menu .menuli').on('click',function () {
              $(this).addClass('active');
              $(this).children('.child_menu').slideDown();
              $(this).siblings('li').removeClass('active');
              $(this).siblings('li').children('.child_menu').slideUp();
              
            })
          })
          That.$store.dispatch('changeState',result.data.accType);          
          That.$store.dispatch('changeAccid',result.data.accId);     
          That.$store.dispatch('changeRolState',result.data.role);    
          That.$store.dispatch('saveCurAccount',result.data);    
          if(result.data.accType == 0){ //系统管理员
            That.$store.dispatch('changeUserName',result.data.displayName);  
          }          
          if(result.data.accType == 1){  //大B管理员
            That.$store.dispatch('changeUserName',result.data.companyName);  
          }
          if(result.data.accType == 2){  //大B用户 
            That.$store.dispatch('changeUserName',result.data.memName)
          } 
          if(result.data.accType == 3){ //小B
            That.$store.dispatch('changeUserName',result.data.displayName);  
          }      
        }else{
            That.alertCommonTip(result.meta.message);
        }
        
      })
    },
    getHeadIcon(){
      this.httpGet(this.URL.getHeadIcon,{},(response)=>{
        var result = response.data;
        this.$store.dispatch('changeHeadImg',result)
      })
    },
    countUnreadMessage(){   //获取站内未读信息
      this.httpGet(this.URL.countUnreadMessage,{},(response)=>{
        var result = response.data;
        if(result.meta.success){
          this.$store.dispatch("changeCountLetter",result.data);
        }
      })
    },
    signout(){
      this.showState = true;      
    },
    baseInfo(){
      // window.location.href=this.linkHref+"cus/account/basicInfo";
      this.$router.push({
          name:"basicInfo",
      });
    },
    sureDele(){   
       let Href = null;
       if(this.cloudyState){
         Href = 'https://fssc.bigfintax.com';
       }else{
         Href = this.linkHref+"logout";
       }
       this.httpGet(this.URL.logoutWithoutPage,{},(response)=>{})
       window.location.href = Href;
    },
    init(){
        /* 控制左导航第一次进入页面的时候展开二级导航 */
        $(function(){   
          setTimeout(function(){
            $('.router-link-active').parents('.child_menu').show().parents('li').addClass('active');
          },100);
        })
    }
  },
  mounted(){    
         this.getData();
         this.getHeadIcon();    
         this.countUnreadMessage();  
         this.init();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(to,from){
        this.type = to.meta.type;
        var _this = this;
        if(to.name == "indexAdmin"){
          setTimeout(()=>{
            $(".indexLi").siblings('li').removeClass('active').children('.child_menu').hide();
            $('.router-link-active').parents('li').addClass('on');
          },100)
        }else{
          $('.indexLi').removeClass('on');
        }        
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/base.scss';
.router-link-active{
  color: $pink !important;
}
.activeClass{
  color:#ff503f !important;
}

#divSidebarMenu{
  height:100%;
  width:170px;
  background: #2A3137;
  left:0;
  position: fixed;
  z-index: 101;
  .scroll-view{
    // height: 650px;
  }
  .nav_title{
    background: #2A3137;
    width: 170px;
    height: 49px;
    margin-bottom:0;
    min-height:49px;
    .site_title{
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: 400;
      font-size: 22px;
      width: 100%;
      color: #ECF0F1 !important;
      margin-left: 0 !important;
      line-height: 59px;
      display: block;
      margin: 0;
      padding-left: 2px;
      i {
        display: block;
        width:60px;
        height:39px;
        background: url($URL2+'logo.svg') left no-repeat;
        -webkit-background-size:90% 90%;
        background-size:90% 90%;
        -webkit-border-radius:0px;
        -moz-border-radius:0px;
        border-radius:0px;
        border:none;
        margin-left:11px;
        margin-top:6px;
      }
      &.site_title_c{
        i{
          background: url($URL2+'logo_small_c.png') left no-repeat;
          background-size:70% 70%;
          width: 48px;
          height: 48px;
          margin-top: 0px;
        }
      }
    }
  }
  .side-menu{
    .menuUserHeadIcon{
      text-align: center;
      padding-top: 25px;
      padding-bottom: 20px;
      background-color: #171C1F;
      position: relative;
      img{
        width: 80px;
        height: 80px;
        border-radius:50px;
        overflow: hidden;
      }
      .letter-num{
        width: 22px;
        height: 22px;
        position: absolute;
        top: 25px;
        right: 45px;
        background: $pink;
        color: #fff;
        border-radius: 100%;
        -ms-border-radius:100%;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        cursor: pointer;
        padding-left: 0;
        &.router-link-active{
          color: #fff !important;
        }
      }
      h3{
        padding-left:0;
        padding-top: 15px;
        font-size:14px;
        line-height:22px;
        color: #fff;
        width:100%;
        text-align: center;
      }
      p{
        color: rgba(255,255,255,0.50);
        font-size:12px;
        margin:0;
        line-height:22px;
      }
    }



    li{
      &.indexLi{
        border-left:4px #2A3137 solid;
      }
      a{
        @include pm-no;
        height:48px;
        line-height:48px;
        padding-left: 15px;
        color: $gray;
        cursor: pointer;
        display: block;
        font-size:14px;
        position:relative;
        span{
          float: right;
          text-align: center;
          font-size: 10px;
          min-width: inherit;
          position: absolute;
          top: 0px;
          right: 25px;
        }
        i{
          margin-right:5px;
        }
      }
      #indLogoutIcon{
        padding-left:0;
        i{
          font-size:20px;
          color:$pink;
        }
      }
      .child_menu{
        display: none;
        background: #171C1F;
        li{
          padding-left:23px;
        }
        a:hover{
          background: none;
          color: $pink;
        }
        .current-page{
          a{color: $pink;}
        }
      }
      &.active{
        border-left:4px solid #FF503F;
        .block{
          display: block;
        }
        &>a{
          background: $pink;
          color: $white ;
          a{
            color: white;
          }
          &:hover{
            background: $pink;
          }
        }
        .icon-left-open-big{
          transform:rotate(-90deg);
        }
      }
      &.active{
        a{
          color: white;
        }
      }
      &.on{
        background:#ff503f;
        border-left:4px #ff503f solid;
        a{
          color: #fff !important;
        }
        &~li a{
          background:none !important;
        }
      }
    }
    &>li{
      &>a:hover{
        background: none;
      }
      &.active>a{
        background: $pink !important;
      }
    }
  }
  .bottom-btn-cloudy{
    width: 100%;
    position: fixed;
    bottom: 20px;
    left: 0;
    max-width: 170px;
    a{
      width:100%;
      text-align: center;
      display: block;
      float: left;
      position: relative;
      color: $white;
      }
  }
  .bottom-btn{
    width: 100%;
    position: fixed;
    bottom: 20px;
    left: 0;
    max-width: 170px;
    a{
      width: 72px;
      text-align: center;
      display: block;
      float: left;
      position: relative;
      color: $white;
      &:nth-child(1){
        width: 98px;
        &:after{
          content: ".";
          position: absolute;
          font-size: 0;
          height: 12px;
          width: 1px;
          color: #fff;
          right: 0px;
          background: #fff;
          top: 5px;
        }
      }
      &:hover{
        color: #FF503F;
      }
    }
  }
}

@media (max-width:992px) {
  .main_container #divSidebarMenu{
    // display: none !important;
  }
}

@media (max-height:750px) {
  #divSidebarMenu{
    .scroll-view{
      height: 650px;
    }
  }
}
@media (max-height:700px) {
  #divSidebarMenu{
    .scroll-view{
      height: 560px;
    }
  }
}

</style>

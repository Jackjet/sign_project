<template>
  <div id="divSidebarMenu" class="left_col" >
            <!--不自动滚动条添加class 去掉content-1   mCustomScrollbar-->
            <div class="scroll-view " id="content-1" >
                <div class="navbar nav_title">
                    <a href="/cus/account/accountIndex" class="site_title"><i></i></a>
                </div>
                <div class="clearfix"></div>
                <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                    <div class="menu_section">
                        <ul class="side-menu">
                            <li class="menuUserHeadIcon">
                                <img src="/cus/account/getHeadIcon">
                                
                                <h3 v-if="userStateNum != 3" id="menuDisplayNameText " class="shengl">{{msg.memName}}</h3>
                                <p v-if="userStateNum != 3" id="menuCompanyNameText" class="shengl">{{msg.companyName}}</p>
                                <h3 v-if="userStateNum == 3" id="menuDisplayNameText " class="shengl">{{msg.displayName}}</h3>
                                <!--<a id="indLogoutIcon" @click="signout">
                                    <i class="icon-sign-out-1" title="退出"></i>
                                </a>-->
                                <div style="height:25px;"></div>
                            </li>
                            <li name="menuLiAdmin" v-if="userStateNum == 0"><a><i class="icon-group"></i> 企业管理 <span
                                    class="icon-left-open-big"></span></a>

                                <ul class="child_menu">
                                    <li>
                                        <a :href="url+'/sys/largeCompany/toLargeCompanyPage'">企业账户管理</a>
                                    </li>
                                     <li>
                                        <a :href="url+'/sys/largeCompany/toLoginUserManage'">账户管控</a>
                                    </li>
                                </ul>

                            </li>
                            <li name="menuLiAdmin" v-if="userStateNum == 0"><a><i class="icon-mail-list"></i> 系统管理 <span
                                    class="icon-left-open-big"></span></a>
                                <ul class="child_menu" style="display:none">
                                    <li><a :href="url+'/sys/function/functionPage'">功能管理</a></li>
                                    <li><a :href="url+'/sys/function/roleFunctionPage'">权限管理</a></li>
                                </ul>
                            </li>
                            <li name="menuLiAdmin" :class="[{ active: activeTj}]" v-if="userStateNum == 0" class="active">
                                <a><i class="icon-file"></i> 统计 <span class="icon-left-open-big"></span></a>
                                <ul class="child_menu" style="display:block">
                                    <li><router-link to="/statistics_count">签署次数</router-link></li>
                                    <li><router-link to="/log/user_operation/1">日志</router-link></li>
                                    <!-- <li><a to="/">日志</a></li> -->
                                </ul>
                            </li>
                            <li v-if="userStateNum != 0" name="menuLiUser" ><a :href="url+'/cus/account/accountIndex'"><i
                                    class="icon-home"></i> 首页 </a></li>
                            <li v-if="userStateNum != 0" :class="[{ active: activeFile}]" name="menuLiUser" ><a><i class="icon-file"></i> 我的文档<span class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="url+'/doc/documentList/sign'">文档列表</a></li>
                                    <li id="aDraft" v-if="userStateNum == 2 || userStateNum == 3"><a :href="url+'/doc/documentList/draft'">草稿箱</a> </li>
                                    <li><router-link to="/file">归档</router-link></li>
                                    <li><router-link to="/sign_check">验签</router-link></li>
                                </ul>
                            </li>
                            <li v-if="userStateNum != 0" name="menuLiUser"><a><i class="icon-user"></i> 我的账户 <span class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="url+'/cus/account/security'">安全设置</a></li>
                                    <li><a :href="url+'/cus/account/basicInfo'">基本信息</a></li>
                                    <li><a :href="url+'/doc/stamp/stampList'">签章样式</a></li>
                                </ul>
                            </li>
                            <li v-if="userStateNum != 0" name="menuLiUser"><a><i class="icon-mail-list"></i> 通讯录 <span class="icon-left-open-big"></span></a>
                                <ul class="child_menu">
                                    <li class="hideMenuLi adminPartners" v-if="userStateNum == 1"><a
                                            :href="url+'/cus/companyPartners/toCompanyPartnersManagement'">合作伙伴</a>
                                    </li>
                                    <li class="hideMenuLi adminPartners" v-if="userStateNum == 1"><a
                                            :href="url+'/cus/orgStructure/toOrgStructurePage'">组织架构</a>
                                    </li>
                                    <li class="hideMenuLi cusPartners" v-if="userStateNum == 2 "><a
                                            :href="url+'/cus/companyPartners/toCompanyPartnersList'">合作伙伴</a>
                                    </li>
                                    <li class="hideMenuLi cusPartners" v-if="userStateNum == 2"><a
                                            :href="url+'/cus/orgStructure/toOrgStructurePage'">组织架构</a>
                                    </li>
                                    <li class="hideMenuLi comPartners" v-if="userStateNum == 3"><a
                                            :href="url+'/cus/ordinaryPartners/toOrdinaryPartnersList'">合作伙伴</a>
                                    </li>
                                </ul>
                            </li>
                            <li></li>
                        </ul>

                    </div>
                </div>
            </div>

            <alertModel title="退出" context="确定要退出当前用户吗？"  :showState="showState"  v-show="showState"  :type="type"    @cancelHandle="showState = false" @sureHandle="sureDele">
            </alertModel>
            <div class="bottom-btn">
              <a href="/index.html#/index/welcome">返回官网</a>
              <a href="javascript:;" @click="signout">退出</a>
            </div>
        </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'menu_left',
  data () {
    return {
      url: '',
      msg:{},
      userStateNum:null,  
      activeFile:true,
      activeTj:true,
      showState:false,
      type:2
    }
  },
  computed:{
    ...mapGetters([
      'userState'
    ])
  },
  methods:{
    getData(){
      var That = this;
      this.httpGet('cus/account/getCurAccount',{},function(response){
        var result = response.data;
        if(result.meta.success){
          That.msg = result.data;
          That.userStateNum = result.data.accType;
          That.$store.dispatch('changeState',result.data.accType);          
          That.$store.dispatch('changeRolState',result.data.role);    
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
        
      },function(response){
        console.log(response);
      })
    },
    signout(){
      this.showState = true;      
    },
    sureDele(){
      window.location.href=this.apiPath.substring(0,this.apiPath.length-1)+"/logout";
    }
  },
  mounted(){    
         this.getData();          
        $('#sidebar-menu ul>li[name="menuLiUser"]').on('click',function () {
          $(this).addClass('active');
          $(this).children('.child_menu').slideDown();
          $(this).siblings('li').removeClass('active');
          $(this).siblings('li').children('.child_menu').slideUp();
        })
       // $("#sidebar-menu ul>li.active").find('.child_menu').slideDown();
        $("#sidebar-menu ul>li.active").find('.child_menu').css("display","block");
        $("#content-1").mCustomScrollbar({
					theme:"minimal"
				});
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(to,from){
        var _this = this;
        if(to.name == "file" || to.name == "sign_check"){
          _this.activeFile = true;
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
/*@import '../assets/css/font2/font.css';

@import '../assets/css/jquery.mCustomScrollbar.min.css';*/
@import '../assets/css/base.scss';
.router-link-active{
  color: $pink !important;
}
#divSidebarMenu{
  height:100%;
  width:170px;
  background: #2A3137;
  left:0;
  position: fixed;
  z-index: 10;
  .scroll-view{
    height: 650px;
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
        width:79px;
        height:39px;
        background: url($URL2+'logo.svg') left no-repeat;
        -webkit-background-size:90% 90%;
        background-size:90% 90%;
        -webkit-border-radius:0px;
        -moz-border-radius:0px;
        border-radius:0px;
        border:none;
        padding-left:18px;
        margin-top:5px;
      }
    }
  }
  .side-menu{
    .menuUserHeadIcon{
      text-align: center;
      padding-top: 25px;
      padding-bottom: 10px;
      background-color: #171C1F;
      img{
        width: 80px;
        height: 80px;
        //@include prefixer(border-radius,50px);
        border-radius:50px;
        overflow: hidden;
      }
      h3{
        padding-left:0;
        padding-top: 10px;
        font-size:14px;
        line-height:45px;
        color: #fff;
        width: 80%;
        padding:10px 10% 0 10%;
      }
      p{
        color: rgba(255,255,255,0.50);
        font-size:12px;
        margin:0;
        line-height:22px;
      }
    }



    li{
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
          //@include prefixer(transform,rotate(-90deg));
          transform:rotate(-90deg);
        }
      }
      &.active{
        a{
          color: white;
        }
      }
    }
    &>li{
      &>a:hover{
        background: none;
        //color: $white;
      }
      &.active>a:hover{
        background: $pink !important;
      }
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
    display: none !important;
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

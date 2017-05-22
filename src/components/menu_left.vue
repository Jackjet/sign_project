<template>
  <div id="divSidebarMenu" class="left_col" >
            <div class="scroll-view mCustomScrollbar" style="height:700px;" >
                <div class="navbar nav_title">
                    <a href="/jsp/cus/account/accountIndex" class="site_title"><i></i></a>
                </div>
                <div class="clearfix"></div>
                <!-- sidebar menu -->
                <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
                    <div class="menu_section">
                        <ul class="side-menu">
                            <li class="menuUserHeadIcon">
                                <img src="../assets/images/img.jpg">
                                
                                <h3 id="menuDisplayNameText " class="shengl">{{msg.displayName}}</h3>
                                <p id="menuCompanyNameText" class="shengl">{{msg.companyName}}</p>
                                <a id="indLogoutIcon" href="#">
                                    <i class=" icon-sign-out-1" title="退出"></i>
                                </a>

                            </li>

                            <li name="menuLiAdmin" v-if="userState == 0"><a><i class="icon-group"></i> 企业管理 <span
                                    class="fa fa-chevron-left"></span></a>

                                <ul class="child_menu">
                                    <li>
                                        <a :href="url+'/sys/largeCompany/toLargeCompanyPage'">企业账户管理</a>
                                    </li>
                                </ul>

                            </li>
                            <li name="menuLiAdmin" v-if="userState == 0"><a><i class="icon-mail-list"></i> 系统管理 <span
                                    class="fa fa-chevron-left"></span></a>
                                <ul class="child_menu" style="display:none">
                                    <li><a :href="url+'/sys/function/functionPage'">功能管理</a></li>
                                    <li><a :href="url+'/sys/function/roleFunctionPage'">权限管理</a></li>
                                </ul>
                            </li>
                            <li name="menuLiAdmin" :class="[{ active: activeTj}]" v-if="userState == 0" class="active">
                                <a><i class="icon-file"></i> 统计 <span class="fa fa-chevron-left"></span></a>
                                <ul class="child_menu" style="display:block">
                                    <li><router-link to="/statistics_count">签署次数</router-link></li>
                                    <!-- <li><a to="/">日志</a></li> -->
                                </ul>
                            </li>
                            <li v-if="userState != 0" name="menuLiUser" ><a :href="url+'/cus/account/accountIndex'"><i
                                    class="icon-home"></i> 首页 </a></li>
                            <li v-if="userState != 0" :class="[{ active: activeFile}]" name="menuLiUser" ><a><i class="icon-file"></i> 我的文档{{activeFile}}<span class="fa fa-chevron-left"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="url+'/doc/documentList/sign'">文档列表</a></li>
                                    <li id="aDraft" v-if="userState == 2 || userState == 3"><a :href="url+'/doc/documentList/draft'">草稿箱</a> </li>
                                    <li><router-link to="/file">归档</router-link></li>
                                    <li><router-link to="/sign_check">验签</router-link></li>
                                </ul>
                            </li>
                            <li v-if="userState != 0" name="menuLiUser"><a><i class="icon-user"></i> 我的账户 <span class="fa fa-chevron-left"></span></a>
                                <ul class="child_menu">
                                    <li><a :href="url+'/cus/account/security'">安全设置</a></li>
                                    <li><a :href="url+'/cus/account/basicInfo'">基本信息</a></li>
                                    <li><a :href="url+'/doc/stamp/stampList'">签章样式</a></li>
                                </ul>
                            </li>
                            <li v-if="userState != 0" name="menuLiUser"><a><i class="icon-mail-list"></i> 通讯录 <span class="fa fa-chevron-left"></span></a>
                                <ul class="child_menu">
                                    <li class="hideMenuLi adminPartners" v-if="userState == 1"><a
                                            :href="url+'/cus/companyPartners/toCompanyPartnersManagement'">合作伙伴</a>
                                    </li>
                                    <li class="hideMenuLi adminPartners" v-if="userState == 1"><a
                                            :href="url+'/cus/orgStructure/toOrgStructurePage'">组织架构</a>
                                    </li>
                                    <li class="hideMenuLi cusPartners" v-if="userState == 2 "><a
                                            :href="url+'/cus/companyPartners/toCompanyPartnersManagement'">合作伙伴</a>
                                    </li>
                                    <li class="hideMenuLi cusPartners" v-if="userState == 2"><a
                                            :href="url+'/cus/orgStructure/toOrgStructurePage'">组织架构</a>
                                    </li>
                                    <li class="hideMenuLi comPartners" v-if="userState == 3"><a
                                            :href="url+'/cus/companyPartners/toCompanyPartnersManagement'">合作伙伴</a>
                                    </li>
                                </ul>
                            </li>
                            <li></li>
                        </ul>

                    </div>
                </div>
                <!-- /sidebar menu -->
            </div>
        </div>
</template>

<script>
export default {
  name: 'menu_left',
  data () {
    return {
      url: 'http://192.168.22.237:8080',
      userState:null,
      msg:{},
      activeFile:true,
      activeTj:true,
    }
  },
  methods:{
    getData(){
      var That = this;
      this.httpGet('cus/account/getCurAccount',{},function(response){
        var result = response.data;
        if(result.meta.success){
          That.msg = result.data;
          That.userState = result.data.accType;
        }
      },function(response){
        console.log(response);
      })
    }
  },
  mounted(){        
        $('#sidebar-menu ul>li[name="menuLiUser"]').on('click',function () {
            $(this).addClass('active');
            $(this).children('.child_menu').slideDown();
            $(this).siblings('li').removeClass('active');
            $(this).siblings('li').children('.child_menu').slideUp();
        })
        this.getData();
        $("#sidebar-menu ul>li.active").find('.child_menu').slideDown();
    //console.log(this.$route)
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
@import '../assets/css/font2/font.css';
@import '../assets/css/base.scss';
@import '../assets/css/jquery.mCustomScrollbar.min.css';
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
        width:142px;
        height:50px;
        background: url($URL+'logo-white03.png') left no-repeat;
        -webkit-background-size:100% 100%;
        background-size:100% 100%;
        -webkit-border-radius:0px;
        -moz-border-radius:0px;
        border-radius:0px;
        border:none;
        padding:0;
        margin-top:-2px;
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
        padding-left: 25px;
        color: $gray;
        cursor: pointer;
        display: block;
        font-size:14px;
        .fa{
          float: right;
          text-align: center;
          margin-top: 5px;
          font-size: 10px;
          min-width: inherit;
          position: absolute;
          top: 14px;
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
        li{
          padding-left:25px;
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
          color: $white;
          &:hover{
            background: $pink;
          }
        }
        .fa{
          //@include prefixer(transform,rotate(-90deg));
          transform:rotate(-90deg);
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
}
@media (max-width:992px) {
  .main_container #divSidebarMenu{
    display: none !important;
  }
}
</style>

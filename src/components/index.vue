<template>
  <div class="index_welcome">
      <div class="container-fluid top-nav" id="fixedBar">
          <div class="container header row">
              <span class="col-lg-3"><img class="logo" src="../assets/images/welcome/logo.png"></span>
              <div class="col-lg-9 nav-btn">
                <!--<a href="javascript:;" class="nav-a active">首页</a>-->
                <router-link to="/index/welcome" class="nav-a">首页</router-link>
                <router-link to="/index/product_info" class="nav-a">产品介绍</router-link>
                <router-link to="/index/onlinesign" class="nav-a">在线验签</router-link>
                <!--<a class="userName" v-show="userName">当前用户：{{userName ? userName : ""}}</a>-->
                <a v-show="userName && userState != 0" href="/cus/account/accountIndex" class="register" target="_blank">个人中心</a>
                <a v-show="userName && userState==0" href="/sys/largeCompany/toLargeCompanyPage" class="register" target="_blank">个人中心</a>
                <a v-show="!userName" href="/logout" class="login" target="_blank">登录</a>
                <a v-show="!userName" href="/register" class="register" target="_blank">注册</a>
              </div>                      
          </div>
      </div>
      <div class="fiexd-right">
        <div class="fixed-icon" @click="toTop"><i class="icon-up-open-big"></i></div>
        <div class="fixed-icon service">
          <i class="icon-service"></i>
          <ul class="hover-box">
            <li><img src="../assets/images/welcome/phone.png"><span>95105813</span></li>
            <li><img src="../assets/images/welcome/qq.png"><a target="_blank" href="http://crm2.qq.com/page/portalpage/wpa.php?uin=8008301560&aty=2&a=2&curl=&ty=1">销售一交谈</a></li>
            <!--<li><img src="../assets/images/welcome/qq.png"><a href="tencent://message/?uin=2075217613&amp;Site=www.xxx.com&amp;Menu=yes">销售二交谈</a></li>-->
            <li><img src="../assets/images/welcome/mail.png"><span>sales@gdca.com.cn</span></li>
            <li><img src="../assets/images/welcome/time.png"><span>周一至周五 9:00-18:00 节假日休息</span></li>
          </ul>
          
        </div>
        <div class="fixed-icon share">
          <i class="icon-share"></i>
          <div class="hover-box">
             
             <ul>
               <li><img src="../assets/images/welcome/wenxin.png">微信</li>
               <li><img src="../assets/images/welcome/qq.png">QQ</li>
               <li><img src="../assets/images/welcome/qqkongjian.png">qq空间</li>
               <li><img src="../assets/images/welcome/xinlangweibo.png">微博</li>
               <li><img src="../assets/images/welcome/tengxunweibo.png">腾讯微博</li>
               <li><img src="../assets/images/welcome/douban.png">豆瓣</li>
             </ul>
             <div id="share-1"></div>
          </div>
        </div>
        <div class="fixed-icon ewm-box">
          <i class="icon-ewm"></i>
          <div class="hover-box">
            <img src="../assets/images/welcome/chart.png" alt="">
          </div>
        </div>
      </div>
      <div class="main-contain">
          <router-view></router-view>
      </div>
      <footer> 
        <p>
          <a href="https://www.gdca.com.cn/about_gdca/other/contact/" target="_blank">联系我们</a>
          <a href="http://www.miit.gov.cn/" target="_blank">工业和信息化部</a>
          <a href="http://www.mps.gov.cn/n16/index.html" target="_blank">公安部</a>
          <a href="http://www.court.gov.cn/" target="_blank">最高人民法院</a>
          <a href="http://www.saic.gov.cn/" target="_blank">工商行政管理局</a>
          <a href="http://www.mofcom.gov.cn/" target="_blank">商务部</a>
          <a href="http://www.sac.gov.cn/" target="_blank">国家标准化管理委员会</a>
          <a href="http://www.oscca.gov.cn/" target="_blank">国家密码管理局</a>          
        </p>
        <p class="copy">Copyright © 2015 数安时代科技股份有限公司 广东信鉴信息科技有限公司 All Rights Reserved. 粤ICP备05036352号</p>
      </footer>
  </div>
</template>

<script>
export default {
  name: 'index_welcome',
  data () {
    return {
    }
  },
  computed:{
    userName(){
      return this.$store.state.userName;
    },
    userState(){
      return this.$store.state.userState;
    }
  },
  methods:{
    toTop(){
        var speed=200;//滑动的速度
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
    },
    fixed(state){
      if(state){
        $('#fixedBar').removeClass('bgback');
        $(window).scroll(function(event){
         if($(window).scrollTop() > 500){
            $('#fixedBar').addClass('bgback')
         }else{
            $('#fixedBar').removeClass('bgback')
         }
        })
      }else{
        $(window).unbind('scroll');
        $('#fixedBar').addClass('bgback');
      }
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(to,from){
        if(to.name == 'Welcome'){          
          this.fixed(true);
        }else{
          this.fixed(false);          
        }
    }
  },
  mounted(){
    //alert(this.$store.state.userName )
    if(this.$route.name == "Welcome"){
      this.fixed(true);
    }else{
      this.fixed(false);
    }    
    /*分享到朋友圈*/
   $('#share-1').share({sites: ['wechat', 'qq', 'qzone','weibo','tencent','douban']});   
   $('#share-1 .social-share-icon').on('mouseenter',function(){
      var index = $(this).index();
      $("#share-1").siblings('ul').find('li').css({'color':"#000"})
      $("#share-1").siblings('ul').find('li').eq(index).css({'color':'#FF503F'});

   })

   var Timer = null;
   var Timer2 = null;
   //右边浮动导航
   $('.fiexd-right .fixed-icon').on('mouseenter',function(){
      clearInterval(Timer2);
      var That = $(this);
      Timer2 = setInterval(function(){
        That.siblings('.fixed-icon').find('.hover-box').fadeOut();
        That.find('.hover-box').fadeIn();
      },100)      
      clearInterval(Timer);
   })

   $('.fiexd-right .fixed-icon').on('mouseleave',function(){
      var That = $(this);
      clearInterval(Timer2);
      Timer = setInterval(function(){
        That.find('.hover-box').hide();
      },100);
      
   })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
/*@import '../assets/css/font2/font.css';
@import '../assets/css/base.scss';
@import '../assets/css/sign_check.scss';
@import '../assets/css/share.min.css';*/
/*.router-link-active{
  color: $pink !important;
}*/

</style>

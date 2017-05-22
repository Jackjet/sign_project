<template>
  <div class="nav_top">
    <div class="nav-contain">
      <h3>标题</h3>
      <div class="btn-box">
        <a href="javascript:;"><i class="icon-users"></i>添加成员</a>
        <a href="javascript:;"><i class="icon-partner"></i>添加合作伙伴</a>
        <a href="javascript:;"><i class="icon-sign"></i>发起签约</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav_top',
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
.router-link-active{
  color: $pink !important;
}
.nav_top{
  width:100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #f6f6f6;
  height:49px;
  line-height: 49px;
  border-bottom: 1px #D3D7DA solid;
  z-index: 9;
  .nav-contain{
    padding-left: 200px;
    .btn-box{
        position:absolute;
        right:30px;
        top:10px;
        height:30px;
        line-height:30px;
      a{
        height:30px;
        line-height:30px;
        display: inline-block;
        margin:0 10px;
        padding:0 15px;
        color:#fff;
        background:#FF503F;
        border-radius:30px;
        i{
          margin-right: 5px;
        }
      }
    }
  }
}
@media (max-width:992px) {
  .main_container .nav-contain{
    padding-left:30px;
  }
}
</style>

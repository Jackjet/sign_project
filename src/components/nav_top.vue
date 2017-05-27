<template>
  <div class="nav_top">
    <div class="nav-contain">
      <h3>{{topTitle}}</h3>
      <div class="btn-box"> 
        <a href="cus/orgStructure/toOrgStructurePage" v-if="userState == 1 "><i class="icon-users"></i>添加成员</a>
        <a href="cus/companyPartners/toCompanyPartnersManagement" v-if="userState == 1"><i class="icon-partner"></i>添加合作伙伴</a>
        <a href="doc/document/toFillin" v-if="userState == 2 || userState ==3"><i class="icon-sign" ></i>发起签约</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav_top',
  data () {
    return {
    }
  },
  computed:{
    userState(){
      return this.$store.state.userState
    },
    topTitle(){
      return this.$store.state.top_title;
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

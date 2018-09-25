<template>
  <div class="nav_top">
    <div class="nav-contain">
      <h3>{{topTitle}} <a href="javascript:;" @click="backDocList" v-if="backShow">返回</a></h3>
      <div class="btn-box"> 
        <router-link to="/cus/orgStructure/toOrgStructurePage" v-if="userState == 1 "><i class="icon-users"></i>添加成员</router-link>
        <router-link to="/cus/partners/PartnersList" v-if="userState == 1"><i class="icon-partner"></i>添加合作伙伴</router-link>
        <a href="javascript:;" v-if="userState == 2 || userState ==3" @click="createDoc"><i class="icon-sign-1" ></i>发起签约</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'nav_top',
  data () {
    return {
      backShow:false,
      fromTab:'',
      indexStatus:'',
      tabIndex:'',
      beginTime:'',
      endTime:'',
      page:'',
      pageSize:'',
      timeIndex:0,
      toFillin:false,
    }
  },
  computed:{
    userState(){
      return this.$store.state.userState
    },
    topTitle(){
      return this.$store.state.top_title;
    }
  },
  methods:{
    backDocList(){
      this.$router.push({
          name:"documentList",
          query: { 
              indexStatus: this.indexStatus,
              tabIndex:this.tabIndex,
              fromTab:this.fromTab,
              timeIndex:this.timeIndex,
              beginTime:this.beginTime,
              endTime:this.endTime,
              page:this.page,
              pageSize:this.pageSize
          }
      });
    },
    createDoc(){
      /*if(this.toFillin){
        console.log(this.toFillin)
        window.location.href= this.linkHref + "index.html#/doc/document/toFillin?time="+ new Date().getTime();
        return false;
      }*/
      this.$router.push({
          name:"toFillin"
      });
    }
  },
  watch:{
    '$route': function(to,from){
        if((to.name == 'docDetail'  && from.name == 'documentList') || (to.name == 'docDetail'  && from.name == 'report')){
          this.backShow = true;
          this.indexStatus = to.query.indexStatus
          this.tabIndex = to.query.tabIndex;
          this.fromTab = to.query.fromTab;
          this.timeIndex = to.query.timeIndex;
          this.beginTime = to.query.beginTime;
          this.endTime = to.query.endTime;
          this.page = to.query.page;
          this.pageSize = to.query.pageSize;
        }else{
          this.backShow = false;
        }
        /*if(to.name == 'toFillin'){
          this.toFillin = true;
        }*/
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/base.scss';
.router-link-active{
  color: #fff !important;
}
.nav_top{
  position: fixed;
  left:170px;
  top: 0;
  right: 0;
  background: #f6f6f6;
  height:49px;
  line-height: 49px;
  border-bottom: 1px #D3D7DA solid;
  z-index: 100;
  .nav-contain{
    padding-left: 30px;
    h3{
      font-weight: normal;
      position: relative;
      a{
        width: 60px;
        margin-left: 15px;
        background:#fff;
        border: 1px #ccc solid;
        line-height: 28px;
        height: 28px;
        color: #4b4b4b;
        display: block;
        position: absolute;
        left: 150px;
        top: 10px;
        text-align: center;
        border-radius:4px;
        -ms-border-radius:4px;
      }
    }
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
        font-size: 16px;
        i{
          margin-right: 5px;
          font-size: 16px;
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

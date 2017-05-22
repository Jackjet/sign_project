<template>
  <div class="statistics_count statistics_detail">
    <div class="right_col">
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
               <input type="text" name="" placeholder="关键字：签约ID/名称"><a href="#" class="btn-pink btn-default">查询</a><a class="btn-default" href="#">清空</a>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white">
        <h3 class="title">统计时间：2017.05.19 13:00 <a class="btn-default btn-pink" href="#">导出Excel</a></h3>
        <div class="table">
          <li class="title">
            <span>账号(电子邮箱)</span>
            <span>签约ID</span>
            <span>名称</span>
            <span>签约金额</span>
            <span>签署人</span>
            <span>签约时间</span>
          </li>
          <li class="li-class">
            <span>704562587@qq.com</span>
            <span>1020020155555</span>
            <span>电脑采购采购草孤傲的骄傲是</span>
            <span>1000</span>
            <span>数安时代</span>
            <span>签约时间</span>
            <i></i>
          </li>
          <li v-for = "item in statisticsList" class="li-class">
            <span>{{item.accNo}}</span>
            <span>{{item.docId}}</span>
            <span>电脑采购采购草孤傲的骄傲是</span>
            <span>1000</span>
            <span>数安时代</span>
            <span>{{item.signTime}}</span>
          </li>
          <li class="pr">
            <span>共324条记录</span>
            <div class="page-box">
               <pagination :total="pageData.total" :currentpage="pageData.currentpage" :display="pageData.display"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'statistics_detail',
  data () {
    return {
      pageData:{
    		total: 81,      //总条数
    		display: 15,    //每页条数
    		currentpage: 1  //当前页数	
  	  },
      statisticsParms:{    //统计详情接口参数
        startTime:"",
        endTime:"",
        displayName:"",
        pageIndex:0,  
        pageLength:10
      },
      statisticsList:[]    //统计接口返回参数列表
    }
  },
  methods:{
    getData(){
      var That = this;
      this.httpGet('doc/documentInfo/signStatisticsDetails',{
        signStartDate:That.statisticsParms.startTime,
        signEndDate:That.statisticsParms.endTime,
        displayName:That.statisticsParms.displayName,
        pageIndex:That.statisticsParms.pageIndex,
        pageLength:That.statisticsParms.pageLength
      },function(response){
        console.log(response)
        var result = response.data;
        if(result.meta.success){
          this.statisticsList = result.data.list;
          console.log(resule.data.list)
        }
      },function(response){
        console.log(response);
      })
    },
    pageChangeHandel(currentNum){  //侦听翻页函数
      //console.log("我被翻页了，页码是："+currentNum);
      this.statisticsParms.pageIndex = currentNum-1;
      this.getData();
    },
    searchHandle(title){ 
      /*if(this.searchTitle == title && title != ""){
          return;
      }*/
      this.getData();
      //this.searchTitle = title;
    },
    deleteHandle(){
      this.statisticsParms.displayName = "";
      this.getData();
      /*this.statisticsParms.startTime="";
      this.statisticsParms.endTime="";*/
    },
    init(){
        this.statisticsParms.displayName = this.$route.params.displayName;
        this.statisticsParms.startTime = this.$route.params.startTime;
        this.statisticsParms.endTime = this.$route.params.endTime;
    }
  },
  mounted(){
    this.init();
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

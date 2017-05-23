<template>
  <div class="statistics_count statistics_detail">
    <div class="right_col">
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
               <input type="text" name="" placeholder="关键字：签约ID/名称" v-model="statisticsParms.docName"  @keyup.enter="searchHandle(statisticsParms.docName)" ><a href="javascript:;" class="btn-pink btn-default" @click="searchHandle(statisticsParms.docName)">查询</a><a class="btn-default" href="javascript:;" @click="deleteHandle()">清空</a>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white">
        <h3 class="title">统计时间：2017.05.19 13:00 <a class="btn-default btn-pink" href="javascript:;"  @click="exportData()">导出Excel</a></h3>
        <div class="table table-five">
          <li class="title">
            <span>账号(电子邮箱)</span>
            <span>签约ID</span>
            <span>名称</span>
           <!--  <span>签约金额</span> -->
            <span>签署人</span>
            <span>签约时间</span>
          </li>
          
          <li v-for = "item in statisticsList" class="li-class">
            <span :title="item.accNo">{{item.accNo}}</span>
            <span :title="item.docId">{{item.docId}}</span>
            <span :title="item.docName">{{item.docName}}</span>
           <!--  <span>1000</span> -->
            <span :title="item.signDisplayName">{{item.signDisplayName}}</span>
            <span :title="item.signTime">{{item.signTime}}</span>
            <i></i>
          </li>
          <li class="pr">
            <span>共{{pageData.total}}条记录</span>
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
      searchTitle:"",
      pageData:{
    		total: null,      //总条数
    		/*display: 15,    //每页条数
    		currentpage: 1  //当前页数	*/
  	  },
      statisticsParms:{    //统计详情接口参数
        startTime:"",
        endTime:"",
        companyId:"",
        docName:"",
        pageIndex:1,  
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
        companyId:That.statisticsParms.companyId,
        docName:That.statisticsParms.docName,
        pageIndex:That.statisticsParms.pageIndex,
        pageLength:That.statisticsParms.pageLength
      },function(response){
        console.log(response)
        var result = response.data;
        if(result.meta.success){
          That.statisticsList = result.data.list;
          That.pageData.total = result.data.totalCount;
        }
      },function(response){
        console.log(response);
      })
    },
    pageChangeHandel(currentNum){  //侦听翻页函数
      //console.log("我被翻页了，页码是："+currentNum);
      this.statisticsParms.pageIndex = currentNum;
      this.getData();
    },
    searchHandle(title){ 
      if(this.searchTitle == title &&  title != ""){
          return;
      }
      this.getData();
      this.searchTitle = title;
    },
    deleteHandle(){
      this.statisticsParms.docName = "";
      this.getData();
    },
    exportData(){  //导出接口
      window.open(this.apiPath+"doc/documentInfo/exportSignStatisticsDetails?signStartDate="+this.statisticsParms.startTime+"&signEndDate="+this.statisticsParms.endTime+"&companyId="+this.statisticsParms.companyId+"&docName="+this.statisticsParms.docName+"&pageIndex="+this.statisticsParms.pageIndex+"&pageLength="+this.statisticsParms.pageLength);      
    },
    init(){
        this.statisticsParms.companyId = this.$route.params.companyId;
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

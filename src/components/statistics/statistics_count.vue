<template>
  <div class="statistics_count">
    <div class="right_col">
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
                <div class="row clf">
                  <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12">签约时间</div>
                  <!--<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="input"><calendar @changeDate="changeStartDate" :val="'1'"></calendar></span>
                    <span class="txt">至</span>
                    <span class="input"><calendar @changeDate="changeEndDate"></calendar></span>
                  </div>-->
                  <div class="time-box2 col-lg-11 floatLeft">
                      <span class="calendarBox">
                          <div class="input-append date form_datetime"  id="date_start" >
                              <input size="16" type="text" value="" placeholder="归档开始时间"  v-model.trim="statisticsParms.startTime" readonly>
                              <b class="add-on"><i class="icon-calendar"></i></b>
                          </div>
                      </span>
                      <span class="txt">--</span>
                      <span class="calendarBox">
                          <div class="input-append date form_datetime"  id="date_end">
                              <input size="16" type="text" value="" placeholder="归档结束时间" v-model.trim="statisticsParms.endTime" readonly>
                              <b class="add-on"><i class="icon-calendar"></i></b>
                          </div>
                      </span>  
                      <input v-model.trim="statisticsParms.displayName" type="text" class="inputName"  name="" placeholder="关键字：企业名称" @keyup.enter="searchHandle(statisticsParms.displayName)">                    
                      <a href="javascript:;" class="search-btn" @click="searchHandle(statisticsParms.displayName)">查询</a>
                      <a href="javascript:;" @click="deleteHandle" >清空</a>
                  </div>
                  <!--<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                    <input v-model="statisticsParms.displayName" type="text" name="" placeholder="关键字：企业名称" @keyup.enter="searchHandle(statisticsParms.displayName)">
                  </div>-->
                  <!--<div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn-box">
                    <a href="javascript:;" class="search-btn" @click="searchHandle(statisticsParms.displayName)">查询</a>
                    <a href="javascript:;" @click="deleteHandle" >清空</a>
                  </div>-->
                </div>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white"  v-cloak>
        <h3 class="title">统计时间：{{statisticsParms.startTime}} 至 {{statisticsParms.endTime}} <a class="btn-default btn-pink" href="javascript:;" @click="exportData()">导出Excel</a></h3>
        <div class="table">
          <div class="loadSource" v-show="loadingState">
              <p><img src="../../assets/images/loading.gif" alt=""></p>
          </div>
          <li class="title">
            <span>企业名称</span>
            <span>签约次数（次/企业）</span>
          </li>
          <li v-for="(item,index) in statisticsList" class="li-class" :key="index">
            <span>{{item.displayName}}</span>
            <span @click="jumpTo(item.companyId)">{{item.signCount}}</span>
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0  && !loadingState">
            <p><img src="../../assets/images/noAnyThing.png" alt=""></p>
            <p v-text="'暂无数据'"></p>
          </li>
          <li class="pr">
            <span>共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">
               <pagination  :total="pageData.total" :currentpage="statisticsParms.pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
	 
    </div>
    <!--公共弹框-->
    <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose"  :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
    </alertModel>
	</div>
</template>

<script>
import '@/assets/js/plugin/bootstrap-datepicker.js';
export default {
  name: 'statistics_count',
  data () {
    return {
      loadingState:false,
  		pageData:{           //翻页配置
  			total: 0,          //总条数
  			//display: 1,      //每页条数
  			//currentpage: 1   //当前页数	
  		},
      searchTitle:"",      //查询中间变量，避免多次请求数据库
      statisticsParms:{    //统计接口参数
        startTime:"",
        endTime:"",
        displayName:"",
        pageIndex:1,  
        pageLength:10
      },
      statisticsList:[],    //统计接口返回参数列表,
      timeSelect:false,  //判断有没有选日期，
      searchTitleTem:"",
      showAlertData:{        //公共弹框参数
            showAlert:false,
            title:"温馨提示",
            context:"",
            autoClose:false
        }
    }
  },
  methods:{
    getData(){
      var _this = this;
      _this.loadingState = true;
      this.httpGet(_this.URL.signStatistics,{
        signStartDate:_this.statisticsParms.startTime,
        signEndDate:_this.statisticsParms.endTime,
        displayName:_this.statisticsParms.displayName,
        pageIndex:(_this.statisticsParms.pageIndex),
        pageLength:_this.statisticsParms.pageLength
      },function(response){
        var result = response.data;
        _this.loadingState = false;
        if(result.meta.success){
            _this.statisticsList = result.data.list;
            _this.pageData.total = result.data.totalCount;
        }else{
            _this.alertCommonTip(result.meta.message)
        }
      })
    },
    exportData(){  //导出接口
      window.open(this.apiPath+"doc/documentInfo/exportSignStatistics?signStartDate="+this.statisticsParms.startTime+"&signEndDate="+this.statisticsParms.endTime+"&pageIndex="+this.statisticsParms.pageIndex+"&pageLength="+this.statisticsParms.pageLength);      
    },
  	pageChangeHandel(currentNum){  //侦听翻页函数
  		//console.log("我被翻页了，页码是："+currentNum);
      this.statisticsParms.pageIndex = currentNum;
      this.getData();
  	},
  	changeStartDate(value){
      this.statisticsParms.startTime=value;
      this.timeSelect = true;
  	},
    changeEndDate(value){
      this.statisticsParms.endTime = value;
      this.timeSelect = true;
    },
    searchHandle(val){ 
        if(this.timeSelect){
            this.getData();
            this.timeSelect = false;
        }else{
            if(this.searchTitleTem == val) return;
            this.getData();
            this.searchTitleTem = val;
        }
    },
    deleteHandle(){
      this.statisticsParms.displayName = "";
      // this.statisticsParms.startTime="";
      // this.statisticsParms.endTime="";
      this.getData();
      
    },
    jumpTo(item){
      this.$router.push({ 
        name: 'statistics_detail', 
        params: { 
          "companyId": item,
          "startTime":this.statisticsParms.startTime,
          "endTime":this.statisticsParms.endTime
        }
      })
    },
    getNowDate(n){
        this.statisticsParms.startTime = this.getDataFn(n).formatwdate;
        this.statisticsParms.endTime = this.getDataFn(n).currentdate;
    },
    init(){
       /*日期控件*/
        $('#date_start').datepicker({
            todayBtn: "linked",
            endDate:new Date(),
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy-mm-dd',  
            
        }).on("changeDate",(e) => {
            this.statisticsParms.startTime = $("#date_start").find('input').val();
            $('#date_start').find('input').val(this.statisticsParms.startTime);
            this.timeSelect = true;
        });
        $('#date_end').datepicker({
            todayBtn: "linked",
            endDate:new Date(),
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            todayHighlight: true,
            format: 'yyyy-mm-dd',  
            
        }).on("changeDate",(e) => {
            this.statisticsParms.endTime = $("#date_end").find('input').val();
            $('#date_start').find('input').val(this.statisticsParms.endTime);
            this.timeSelect = true;
        });
    }
  },
  mounted(){
    if(this.cloudyState){
        document.title="云合同-签署次数";
    }else{
        document.title="签吧-签署次数";
    }
    this.getNowDate(30);
    this.getData();
    this.init();
    this.$store.dispatch('changeTitle','统计>签署次数');    
    this.TimerLogin = setInterval(()=>{this.getLoginData()},600000)   
  },
  destroyed(){
    clearInterval(this.TimerLogin);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
  @import '../../assets/css/datepicker3.css';
</style>

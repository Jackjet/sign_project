<template>
  <div>
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
                <div class="search-log clf" v-show="paramsId == 2 || paramsId == 3">
                  <div>
                    <label>文档ID</label>
                    <input type="text" v-model.trim="fileDocId"/>
                  </div>
                  <div>
                    <label>文档主题</label>
                    <input type="text"  v-model.trim="fileDocName"/>
                  </div>
                </div>
                <div class="row clf">
                  <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12">签约时间</div>
                  <div class="time-box3 col-lg-11 col-md-11 col-sm-12 col-xs-12 floatLeft">
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
                      <a href="javascript:;" class="search-btn" @click="searchHandle(statisticsParms.displayName)">查询</a>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white"  v-cloak v-show="paramsId == 1">
        <h3 class="title">统计时间：{{statisticsParms.startTime}} 至 {{statisticsParms.endTime}}
          <!-- <a class="btn-default btn-pink" href="javascript:;" @click="exportData()">导出Excel</a> -->
        </h3>
        <div class="table table-seven">
          <div class="loadSource" v-show="loadingState">
              <p><img src="../../assets/images/loading.gif" width="50" height="51" alt=""></p>
          </div>
          <li class="title">
            <span>日志ID</span>
            <span>账户ID</span>
            <span>更改前状态</span>
            <span>更改后状态</span>
            <span>修改时间</span>
            <span>结果</span>
            <span>备注</span>
          </li>
          <li v-for="(item,index) in statisticsList" class="li-class" :key="index">
            <span :title="item.auditId">{{item.auditId}}</span>
            <span :title="item.accId">{{item.accId}}</span>
            <span :title="item.beforeStatus">{{item.beforeStatus = item.beforeStatus != null ?  item.beforeStatus : "&nbsp;" }}</span>
            <span :title="item.afterStatus">{{item.afterStatus = item.afterStatus != null ? item.afterStatus : "&nbsp;" }}</span>
            <span :title="item.auditTime">{{item.auditTime | filterdata}}</span>
            <span :title="item.result">{{item.result}}</span>
            <span :title="item.memo">{{item.memo}}</span>
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0 && !loadingState" >
              <p><img src="../../assets/images/noAnyThing.png" alt=""></p>
              <p v-text="'暂无数据'"></p>
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">
               <pagination  :total="pageData.total" :currentpage="pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
      

      <div class="panel-box panel-white"  v-cloak v-show="paramsId == 2">
        <h3 class="title">统计时间：{{statisticsParms.startTime}} 至 {{statisticsParms.endTime}}
          <!-- <a class="btn-default btn-pink" href="javascript:;" @click="exportData()">导出Excel</a> -->
        </h3>
        <div class="table table-elven">
          <div class="loadSource" v-show="loadingState">
              <p><img src="../../assets/images/loading.gif" width="50" height="51" alt=""></p>
          </div>
          <li class="title">
            <span>操作ID</span>
            <span>文档（登陆）ID</span>
            <span>操作类型</span>
            <span>客户端IP</span>
            <span>客户端端口</span>
            <span>客户端操作系统</span>
            <span>客户端浏览器</span>
            <span>服务端时间</span>
            <span>操作时间戳</span>
            <span>文档主题</span>
          </li>
          <li v-for="(item,index) in statisticsList" class="li-class" :key="index" @click="goDetail(item)">
            <span :title="item.operId">{{item.operId = item.operId != null ? item.operId : "&nbsp;" }}</span>
            <span :title="item.conId">{{item.conId = item.conId != null ? item.conId : "&nbsp;" }}</span>
            <span :title="item.operType">{{item.operType = item.operType != null ? item.operType : "&nbsp;" }}</span>
            <span :title="item.clientIp">{{item.clientIp = item.clientIp != null ? item.clientIp : "&nbsp;" }}</span>
            <span :title="item.clientPort">{{item.clientPort = item.clientPort != null ? item.clientPort : "&nbsp;" }}</span>
            <span :title="item.clientOs">{{item.clientOs = item.clientOs != null ? item.clientOs : "&nbsp;" }}</span>
            <span :title="item.clientBrowser">{{item.clientBrowser = item.clientBrowser != null ? item.clientBrowser : "&nbsp;" }}</span>
            <span :title="item.serverTime">{{(item.serverTime = item.serverTime != null ? item.serverTime  : "&nbsp;") | filterdata}}</span>
            <span :title="item.operStamp">{{(item.operStamp = item.operStamp != null ? item.operStamp  : "&nbsp;") | filterdata }}</span>
            <span :title="item.docName">{{item.docName = item.docName != null ? item.docName : "&nbsp;" }}</span>
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0 && !loadingState">
              <p><img src="../../assets/images/noAnyThing.png" alt=""></p>
              <p v-text="'暂无数据'"></p>
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">
               <pagination  :total="pageData.total" :currentpage="pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
      <div class="panel-box panel-white"  v-cloak v-show="paramsId == 3">
        <h3 class="title">统计时间：{{statisticsParms.startTime}} 至 {{statisticsParms.endTime}}
          <!-- <a class="btn-default btn-pink" href="javascript:;" @click="exportData()">导出Excel</a> -->
        </h3>
        <div class="table table-seven">
          <div class="loadSource" v-show="loadingState">
              <p><img src="../../assets/images/loading.gif" width="50" height="51" alt=""></p>
          </div>
          <li class="title">
            <span>记录ID</span>
            <span>文档ID</span>
            <span>账户ID</span>
            <span>操作类型</span>
            <span>操作后合同生命周期</span>
            <span>操作时间</span>
            <span>文档主题</span>
          </li>
          <li v-for="(item,index) in statisticsList" class="li-class" :key="index" @click="goDetail(item)">
            <span :title="item.recordId">{{item.recordId = item.recordId != null ? item.recordId : "&nbsp;" }}</span>
            <span :title="item.docId">{{item.docId = item.docId != null ? item.docId : "&nbsp;" }}</span>
            <span :title="item.accId">{{item.accId = item.accId != null ? item.accId : "&nbsp;" }}</span>
            <span :title="item.type">{{item.type = item.type != null ? item.type : "&nbsp;" }}</span>
            <span :title="item.cycle">{{item.cycle = item.cycle != null ? item.cycle : "&nbsp;" }}</span>
            <span :title="item.operTime">{{(item.operTime = item.operTime != null ? item.operTime : "&nbsp;") | filterdata }}</span>
            <span :title="item.docName">{{item.docName = item.docName != null ? item.docName : "&nbsp;" }}</span>            
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0 && !loadingState">
              <p><img src="../../assets/images/noAnyThing.png" alt=""></p>
              <p v-text="'暂无数据'"></p>
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">
               <pagination  :total="pageData.total" :currentpage="pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
      <!--公共弹框-->
    <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
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
      fileDocId:'',        //文档id
      fileDocName:'',      //文档名称
  		pageData:{           //翻页配置
  			total: 0,          //总条数
  			//display: 1,      //每页条数
  			//currentpage: 1   //当前页数	
  		},
      //searchTitle:"",      //查询中间变量，避免多次请求数据库
      statisticsParms:{    //用户操作信息获取接口参数
        startTime:"",
        endTime:"",
        pageIndex:1,  
        pageLength:10
      },
      statisticsList:[],    //接口返回参数列表,
      timeSelect:false,  //判断有没有选日期，
      paramsId:null,
      showAlertData:{        //公共弹框参数
            showAlert:false,
            title:"警告",
            context:"",
            autoClose:false
        }
      //searchTitleTem:""
    }
  },
  computed:{
    pageIndex(){
      return this.statisticsParms.pageIndex
    }
  },
  methods:{
    goDetail(item){
      this.$router.push({
        name:'docDetail',
        params:{
          docId:this.paramsId == 2 ?item.conId : item.docId
        }
      })
    },
    getData(indexUrl){
      let _this = this;
      var url = "";
      let data = {};
      if(this.paramsId == 1){
        url=this.URL.getAccountAudit;
        data = {
          "startDate":_this.statisticsParms.startTime,
          "endDate":_this.statisticsParms.endTime,
          // displayName:_this.statisticsParms.displayName,
          "pageIndex":(_this.statisticsParms.pageIndex),
          "pageLength":_this.statisticsParms.pageLength
        }
      }
      if(this.paramsId == 2){
        url = this.URL.getOperdata;
        data = {
          "startDate":_this.statisticsParms.startTime,
          "endDate":_this.statisticsParms.endTime,
          // displayName:_this.statisticsParms.displayName,
          "docId":_this.fileDocId,
          "docName":_this.fileDocName,
          "pageIndex":(_this.statisticsParms.pageIndex),
          "pageLength":_this.statisticsParms.pageLength
        }
      }
      if(this.paramsId == 3){
        url = this.URL.getProcessRecord;
        data = {
          "startDate":_this.statisticsParms.startTime,
          "endDate":_this.statisticsParms.endTime,
          // displayName:_this.statisticsParms.displayName,
          "docId":_this.fileDocId,
          "docName":_this.fileDocName,
          "pageIndex":(_this.statisticsParms.pageIndex),
          "pageLength":_this.statisticsParms.pageLength
        }
      }
      
      _this.loadingState = true;
      this.httpGet(url,data,function(response){
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
        /*if(this.timeSelect){
            //this.getData();
            this.statisticsParms.pageIndex = 1;
            this.pageChangeHandel(this.statisticsParms.pageIndex)
            this.timeSelect = false;
        }*/
        // this.pageChangeHandel(this.statisticsParms.pageIndex)
        this.pageChangeHandel(1);
        this.Event2.$emit('tip2',1);
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
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(to,from){
       this.statisticsParms.pageIndex = 1;
       this.getNowDate(30);    
       this.paramsId = to.params.id;
       this.getData(to.params.id);
      
    }
  },
  mounted(){
    if(this.cloudyState){
        document.title="云合同-日志";
    }else{
        document.title="签吧-日志";
    }
    this.init();
    this.getNowDate(30);    
    this.paramsId = this.$route.params.id;
    this.getData(this.paramsId);
    this.$store.dispatch('changeTitle','统计>日志');  
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

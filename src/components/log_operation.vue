<template>
  <div>
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
                <div class="row clf">
                  <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12">签约时间</div>
                  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <span class="input"><calendar @changeDate="changeStartDate"></calendar></span>
                    <span class="txt">至</span>
                    <span class="input"><calendar @changeDate="changeEndDate"></calendar></span>
                  </div>
                  <!-- <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                    <input v-model="statisticsParms.displayName" type="text" name="" placeholder="关键字：企业名称" @keyup.enter="searchHandle(statisticsParms.displayName)">
                    </div> -->
                  <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn-box">
                    <a href="javascript:;" class="search-btn" @click="searchHandle(statisticsParms.displayName)">查询</a>
                    <!-- <a href="javascript:;" @click="deleteHandle" >清空</a> -->
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
          <li class="title">
            <span>日志ID</span>
            <span>账户ID</span>
            <span>更改前状态</span>
            <span>更改后状态</span>
            <span>修改时间</span>
            <span>结果</span>
            <span>备注</span>
          </li>
          <li v-for="item in statisticsList" class="li-class">
            <span :title="item.auditId">{{item.auditId}}</span>
            <span :title="item.accId">{{item.accId}}</span>
            <span :title="item.beforeStatus">{{item.beforeStatus = item.beforeStatus != null ?  item.beforeStatus : "&nbsp;" }}</span>
            <span :title="item.afterStatus">{{item.afterStatus = item.afterStatus != null ? item.afterStatus : "&nbsp;" }}</span>
            <span :title="item.auditTime">{{item.auditTime | filterdata}}</span>
            <span :title="item.result">{{item.result}}</span>
            <span :title="item.memo">{{item.memo}}</span>
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0" v-text="'暂无数据'">
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">{{pageIndex}}
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
            <span>备注</span>
          </li>
          <li v-for="item in statisticsList" class="li-class">
            <span :title="item.operId">{{item.operId = item.operId != null ? item.operId : "&nbsp;" }}</span>
            <span :title="item.conId">{{item.conId = item.conId != null ? item.conId : "&nbsp;" }}</span>
            <span :title="item.operType">{{item.operType = item.operType != null ? item.operType : "&nbsp;" }}</span>
            <span :title="item.clientIp">{{item.clientIp = item.clientIp != null ? item.clientIp : "&nbsp;" }}</span>
            <span :title="item.clientPort">{{item.clientPort = item.clientPort != null ? item.clientPort : "&nbsp;" }}</span>
            <span :title="item.clientOs">{{item.clientOs = item.clientOs != null ? item.clientOs : "&nbsp;" }}</span>
            <span :title="item.clientBrowser">{{item.clientBrowser = item.clientBrowser != null ? item.clientBrowser : "&nbsp;" }}</span>
            <span :title="item.serverTime">{{item.serverTime = item.serverTime != null ? item.serverTime : "&nbsp;" }}</span>
            <span :title="item.operStamp">{{item.operStamp = item.operStamp != null ? item.operStamp : "&nbsp;" }}</span>
            <span :title="item.memo">{{item.memo = item.memo != null ? item.memo : "&nbsp;" }}</span>
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0" v-text="'暂无数据'">
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">{{pageIndex}}
               <pagination  :total="pageData.total" :currentpage="pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
      <div class="panel-box panel-white"  v-cloak v-show="paramsId == 3">
        <h3 class="title">统计时间：{{statisticsParms.startTime}} 至 {{statisticsParms.endTime}}
          <!-- <a class="btn-default btn-pink" href="javascript:;" @click="exportData()">导出Excel</a> -->
        </h3>
        <div class="table table-six">
          <li class="title">
            <span>记录ID</span>
            <span>文档ID</span>
            <span>账户ID</span>
            <span>操作类型</span>
            <span>操作后合同生命周期</span>
            <span>操作时间</span>
          </li>
          <li v-for="item in statisticsList" class="li-class">
            <span :title="item.recordId">{{item.recordId = item.recordId != null ? item.recordId : "&nbsp;" }}</span>
            <span :title="item.docId">{{item.docId = item.docId != null ? item.docId : "&nbsp;" }}</span>
            <span :title="item.accId">{{item.accId = item.accId != null ? item.accId : "&nbsp;" }}</span>
            <span :title="item.type">{{item.type = item.type != null ? item.type : "&nbsp;" }}</span>
            <span :title="item.cycle">{{item.cycle = item.cycle != null ? item.cycle : "&nbsp;" }}</span>
            <span :title="item.operTime">{{item.operTime = item.operTime != null ? item.operTime : "&nbsp;" }}</span>            
            <i></i>
          </li>
          <li class="no-message" v-show="statisticsList.length == 0" v-text="'暂无数据'">
          </li>
          <li class="pr">
            <span class="widthAuto">共{{pageData.total}}条记录/当前页为第{{statisticsParms.pageIndex}}页</span>
            <div class="page-box">{{pageIndex}}
               <pagination  :total="pageData.total" :currentpage="pageIndex" :display="statisticsParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
    </div>
</template>

<script>
import calendar from "./calendar.vue";
export default {
  name: 'statistics_count',
  components:{
	calendar
  },
  data () {
    return {
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
      paramsId:null
      //searchTitleTem:""
    }
  },
  computed:{
    pageIndex(){
      return this.statisticsParms.pageIndex
    }
  },
  methods:{
    getData(indexUrl){
      var url = "";
      if(this.paramsId == 1){
        url="cus/accountAudit/getAccountAudit"
      }
      if(this.paramsId == 2){
        url = "doc/operdata/getOperdata"
      }
      if(this.paramsId == 3){
        url = "doc/operdata/getProcessRecord"
      }
      var _this = this;
      this.httpGet(url,{
        "startDate":_this.statisticsParms.startTime,
        "endDate":_this.statisticsParms.endTime,
        // displayName:_this.statisticsParms.displayName,
        "pageIndex":(_this.statisticsParms.pageIndex),
        "pageLength":_this.statisticsParms.pageLength
      },function(response){
        var result = response.data;
        if(result.meta.success){
            _this.statisticsList = result.data.list;
            _this.pageData.total = result.data.totalCount;
        }
      },function(response){
        console.log(response);
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
            //this.getData();
            this.statisticsParms.pageIndex = 1;
            this.pageChangeHandel(this.statisticsParms.pageIndex)
            this.timeSelect = false;
        }
    },
    // deleteHandle(){
    //   this.statisticsParms.displayName = "";
    //   this.getData();
    //   /*this.statisticsParms.startTime="";
    //   this.statisticsParms.endTime="";*/
    // },
    getNowDate(){
        this.statisticsParms.startTime = this.getDataFn().formatwdate;
        this.statisticsParms.endTime = this.getDataFn().currentdate;
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': function(to,from){
       this.statisticsParms.pageIndex = 1;
       this.getNowDate();    
       this.paramsId = to.params.id;
       this.getData(to.params.id);
       //this.$store.dispatch('changeTitle','统计>日志');  
       // console.log(to.params.id)
    }
  },
  mounted(){
   
    this.getNowDate();    
    this.paramsId = this.$route.params.id;
    this.getData(this.paramsId);
    this.$store.dispatch('changeTitle','统计>日志');  
    document.title = "统计>日志";
    //console.log(this.$route.params.id)    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

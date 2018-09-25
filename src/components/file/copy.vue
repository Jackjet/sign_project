<template>
  <div class="copy" v-cloak>
      <div class="right_col">
          <div class="panel-tab">
              <div class="search clf">
                    <div class="search-input">
                        <i class="icon-search"></i><input type="text" v-model.trim="searchTitle" placeholder="文档名称" @keyup.enter="searchSendList"> 
                    </div>
                    <div class="timebox">
                        <label>发送时间</label>
                        <span class="calendarBox">
                            <div class="input-append date form_datetime"  id="date_start" >
                                <input size="16" type="text" value="" placeholder="开始时间"  v-model.trim="startTime" readonly>
                                <b class="add-on"><i class="icon-calendar"></i></b>
                            </div>
                        </span>
                        <span class="txt">至</span>
                        <span class="calendarBox">
                            <div class="input-append date form_datetime"  id="date_end">
                                <input size="16" type="text" value="" placeholder="结束时间" v-model.trim="endTime" readonly>
                                <b class="add-on"><i class="icon-calendar"></i></b>
                            </div>
                        </span>    
                        <div class="quickTime">
                            <a href="javascript:;" @click="selectDateHandle(1,$event)"  :class="[timeIndex == 1 ? 'active' : '']">一周内</a>
                            <a href="javascript:;" @click="selectDateHandle(2,$event)" :class="[timeIndex == 2 ? 'active' : '']">一月内</a>
                            <a href="javascript:;" @click="selectDateHandle(3,$event)" :class="[timeIndex == 3 ? 'active' : '']">三月内</a>
                        </div>                 
                        <a href="javascript:;" class="search-btn" @click="searchHandle()">查询</a>
                         <a href="javascript:;" @click="clearHandle">清空</a>
                    </div>
                </div>
          </div>
          <TableList
                :tableTitle="'抄送我'"
                :tableTitleState="false"
                :tableClass="'table-five'"
                :tableLoading="documentList.tableLoading"
                :total="documentList.pageTotal"
                :currentpage="documentList.pageIndex"
                :display="documentList.pageLength"
                @pagechange="pageChangeHandel"
            >
                <ul slot="panel-content">
                    <li class="title">
                        <span>文档名称</span>
                        <span>发起方</span>
                        <span>发送时间</span>
                        <span>截止时间</span>
                        <span>状态</span>
                    </li>
                    <li v-for="(item,index) in documentList.tableList" :key="index"  @click="linkTo(item.docId)">
                        <span :title="item.docName?item.docName:''">{{item.docName?item.docName:''}}</span>
                        <span :title="item.senderName?item.senderName:''">{{item.senderName?item.senderName:''}}</span>
                        <span>{{item.sendTime?item.sendTime:''}}</span>
                        <span>{{item.duration?item.duration:''}}</span>
                        <span>{{item.signStatus | filterState}}</span>
                    </li>
                </ul>
            </TableList>
      </div>
      <!--公共弹框-->
    <alertModel :title="showAlertData.title" :context="showAlertData.context"  :showState="showAlertData.showAlert" :autoClose="showAlertData.autoClose"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
    </alertModel>
  </div>
</template>
<script>
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.css';
    import Vue from 'vue';
    Vue.filter('filterState', function (value) { //value为status状态码
        var statusTxt = '';
        switch(value){
            case '200':
                statusTxt = "待签署";
                break;
            case '201':
                statusTxt = "待我签";
                break;
            case '202':
                statusTxt = "待他人签";
                break;
            case '300':
                statusTxt = "已完成";
                break;
            case 'D400':
                statusTxt = "已撤销";
                break;
            default:
                break;
                 
        }
        return statusTxt;
    });
    export default{
        name:'copy',
        data(){
            return {
                startTime:'',        //搜索开始时间
                endTime:'',          //搜索结束时间
                selectStartTime:'',  //点击时间开始时间
                selectEndTime:'',    //点击时间结束时间
                timeIndex:0,         //时间类型，0自定义，1 一周内，2 一月内，3 三月内
                searchTitle:'',      //查询title
                documentList:{       //列表数据
                    tableLoading:false,
                    tableList:[],
                    pageTotal:0,
                    pageIndex:1,
                    pageLength:10,
                },
                showAlertData:{        //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                }
            }
        },
        methods:{
            searchSendList(){
                var startTimeSub = this.timeIndex == 0 ? this.startTime:this.selectStartTime;
                var endTimeSub = this.timeIndex == 0 ? this.endTime:this.selectEndTime;    
                if(new Date(startTimeSub).getTime() > new Date(endTimeSub).getTime()){
                    // this.showAlertData = {
                    //     showAlert:true,
                    //     context:"开始日期大于结束日期不合法"
                    // }
                    this.alertCommonTip('开始日期大于结束日期不合法');
                    return;
                }
                /*if(this.selectIndex == 1){
                    this.searchStructDocumentLight(startTimeSub,endTimeSub);
                    return false;
                }*/
                this.documentList.tableLoading = true;
                this.httpGet(this.URL.searchCarbonDocList,{
                    page:this.documentList.pageIndex,
                    pageSize:this.documentList.pageLength,
                    condition:this.searchTitle,
                    beginTime:startTimeSub,
                    endTime:endTimeSub
                },(res)=>{
                    this.documentList.tableLoading = false;
                    var result = res.data;
                    if(result.meta.success){
                        this.documentList.tableList = result.data.list;
                        this.documentList.pageTotal = result.data.totalCount;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            searchHandle(){  //查询
                this.searchSendList()
            },
            clearHandle(){  //清空
                this.searchTitle = '';
                this.startTime = this.endTime =  this.selectStartTime = this.selectEndTime = '';
                this.timeIndex = 0;
                this.searchSendList();
            },
            selectDateHandle(value,event){  //选择查询时间方式
            //this.getReParms.signStartDate=value;
                if($(event.target).hasClass('active')){;
                    $(event.target).removeClass('active');
                    this.timeIndex = 0;
                    // this.timeSelect = true;          
                    this.startTime = this.endTime = '';
                    this.searchSendList();
                    return false;
                }
                this.timeIndex = value;
                switch(value){
                    case 1:
                        this.getNowDate(7);                
                        break;
                    case 2:
                        this.getNowDate(30);
                        break;
                    case 3:               
                        this.getNowDate(90);
                        break;
                    default:
                        break;        
                }
                // this.timeSelect = true;
                this.startTime = this.endTime = '';
                if(this.documentList.pageIndex != 1){
                    this.Event2.$emit('tip2',1);
                }else{
                    this.searchSendList();
                }           
            },
            linkTo(docId){
                // window.location.href=this.linkHref+"doc/documentInfo/toDocDetail?docId="+docId
                this.$router.push({
                    name:"docDetail",
                    params: { docId: docId }
                });
            },
            pageChangeHandel(val){   //翻页
                this.documentList.pageIndex = val;
                this.searchSendList();
            },
            getNowDate(n){
                this.selectStartTime = this.getDataFn(n).formatwdate;
                this.selectEndTime = this.getDataFn(n).currentdate;
            },
            init(){
                var This = this;
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
                    this.startTime = $("#date_start").find('input').val();
                    $('#date_start').find('input').val(this.startTime);
                    this.timeIndex = 0;
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
                    this.endTime = $("#date_end").find('input').val();
                    $('#date_end').find('input').val(this.endTime);
                    this.timeIndex = 0;
                });
            }
        },
        mounted(){
            this.init();
            this.searchSendList();
            if(this.cloudyState){
                document.title="云合同-抄送我";
            }else{
                document.title="签吧-抄送我";
            }
            this.$store.dispatch("changeTitle","我的文档 > 抄送我")
        }
    }
</script>
<style lang="scss" scoped>
.copy{
    .panel-box{
        .table{
            ul{
                li{
                    cursor: pointer;
                    span{
                        width: 13%;
                        &:nth-child(1),&:nth-child(2){
                            width: 25%;
                        }
                    }
                }
            }
        }
    }
}
</style>

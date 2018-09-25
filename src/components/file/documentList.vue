<template>
    <div class="documentList" id="documentList">
        <div class="right_col">
            <div class="panel-tab">
                <div class="tabBox" v-if="roleState == 1 && userState == 2 "> <!--大B user 主管-->
                    <ul class="clf">
                        <li :class="[subordinate==false ? 'active':'']" @click="tabChangeMine">
                            <a href="javascript:;">我自己的</a>
                        </li>
                        <li :class="[subordinate==true ? 'active':'']">
                            <a href="javascript:;" @click="tabChangeBranch">我下属的</a>
                        </li>
                    </ul>
                </div>
                <div class="tabNav">
                    <label>文档状态</label>
                    <ul class="clf" v-if="userState == 1"> <!--大B管理员-->
                        <li><a href="javascript:;" :class="[tabIndex == 0 ? 'active':'']" @click="changeStatus(0,'')">不限</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 1 ? 'active':'']" @click="changeStatus(1,'200')">待签署</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 4 ? 'active':'']" @click="changeStatus(4,'300')">已完成</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 5 ? 'active':'']" @click="changeStatus(5,'D400')">撤销/过期</a></li>
                    </ul>
                    <ul class="clf" v-else-if="userState == 2 "> <!--大B user-->
                        <li><a href="javascript:;" :class="[tabIndex == 0 ? 'active':'']" @click="changeStatus(0,'')">不限</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 2 ? 'active':'']" v-show="!subordinate" @click="changeStatus(2,'201')">待我签</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 3 ? 'active':'']" v-show="!subordinate" @click="changeStatus(3,'202')">待他人签</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 1 ? 'active':'']" v-show="subordinate" @click="changeStatus(1,'200')">待签署</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 4 ? 'active':'']" @click="changeStatus(4,'300')">已完成</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 5 ? 'active':'']" @click="changeStatus(5,'D400')">撤销/过期</a></li>
                    </ul>
                    <ul class="clf" v-else> <!--小B管理员-->
                        <li><a href="javascript:;" :class="[tabIndex == 0 ? 'active':'']" @click="changeStatus(0,'')">不限</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 2 ? 'active':'']" @click="changeStatus(2,'201')">待我签</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 3 ? 'active':'']" @click="changeStatus(3,'202')">待他人签</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 4 ? 'active':'']" @click="changeStatus(4,'300')">已完成</a></li>
                        <li><a href="javascript:;" :class="[tabIndex == 5 ? 'active':'']" @click="changeStatus(5,'D400')">撤销/过期</a></li>
                    </ul>
                    
                </div>
                <div class="search clf">
                    <div class="search-input">
                        <i class="icon-search"></i><input type="text" v-model.trim="searchTitle" placeholder="文档名称" @keyup.enter="searchHandle"> 
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
                table-title="合作伙伴" 
                tableClass="table-six"
                :pageNumberState="true"
                :tableTitleState="false"
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
                        <span>{{tabStatus | filterShowTime}}</span>
                        <span>状态</span>
                        <span>操作</span>
                    </li>
                    <li v-for="(item,index) in documentList.tableList" :key="index" @click="lookDetail(item.docId)">
                        <span :title="item.docName ? item.docName : ''"><b class="i-fs" v-if="item.isSender == 1">发</b><b class="i-fs" v-if="item.isSender == 0">收</b>{{item.docName}}</span>
                        <span :title="item.senderName ? item.senderName : ''">{{item.senderName}}</span>
                        <span>{{item.sendTime}}</span>
                        <span>{{item.duration}}</span>
                        <span v-if="item.overTime == 1">已过期</span>
                        <span v-else class="signStatus">{{item.signStatus | filterState}}<i v-if="item.signStatus=='202' && item.selfSigned == 0" title="自己未签署" class="myNotSign"></i></span>
                        <span>
                            <a href="javascript:;" v-if="item.signStatus == '201' && item.stampType != '1'" @click.stop="signFile(item.docId)">签署</a>
                            <a href="javascript:;" v-if="item.signStatus == '201' && item.stampType == '1'" title="请到手机端签署" @click.stop="signFile('none')" style="color:#ccc">签署</a>
                            <a href="javascript:;" @click.stop="lookDetail(item.docId)">查看</a>
                            <a href="javascript:;" @click.stop="downLoadHandle(item.docId)">下载</a>
                            <a href="javascript:;" v-if="item.signStatus == '300' && userState != 1" class="file_btn" @click.stop="fileHandle($event,item.docId)">归档到<i class="triangle"></i></a>
                        </span>
                    </li>
                </ul>
            </TableList>  
            
        </div>  
        <!-- 归档到 -->
        <div class="dropdown-menu" id="dropdown-menu" v-show="fileDirState">
            <i></i>
            <div class="scroll_box" :id=" cloudyState ? '' : 'content-2'" :class="[cloudyState ? 'sign_page_scrollBody':'']">
                <dl v-if="fileDirList.length == 0"><dd style="padding-left:70px;">暂无数据</dd></dl>
                <dl v-for="(item,index) in fileDirList" :key="index" @click.stop="addArchiveRecord(item.dirId)"><dd>{{item.dirName}}</dd></dl>
            </div>
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
    Vue.filter('filterShowTime', function (value) { //value为status状态码
        var statusTxt = '';
        if(value == '300'){
            statusTxt = '完成时间'
        }else if(value == 'D400'){
            statusTxt = '撤销时间'
        }else{
            statusTxt = '截止时间'
        }
        return statusTxt;
    });
    export default{
        name:"documentList",
        data(){
            return{
                selectIndex:0,       //列表选中，0为我自己的，1为我下属的
                startTime:'',        //搜索开始时间
                endTime:'',          //搜索结束时间
                selectStartTime:'',  //点击时间开始时间
                selectEndTime:'',    //点击时间结束时间
                timeSelect:true,     //是否选中时间
                searchTitle:'',      //搜索名称
                TemSearchTitle:'',   //搜索临时变量
                subordinate:false,   //是否切换到下属 
                tabIndex:0,       //默认不限  （0-不限，1-待签署，2-待我签，3-待其他人签，4-已完成，5-已撤销）
                tabStatus:'',        //tab状态
                documentList:{       //列表数据
                    tableLoading:false,
                    tableList:[],
                    pageTotal:0,
                    pageIndex:1,
                    pageLength:10,
                },
                fileDirList:[],        //文件夹数据列表
                fileDirState:false,    //归档到状态
                documentState:false,   //控制归档弹框全局显示隐藏
                addArchiveData:{
                    dirId:null,
                    docId:null
                },
                timeSelect:false,       //是否选中了时间
                timeIndex:0,            //时间类型，0自定义，1 一周内，2 一月内，3 三月内
                showAlertData:{        //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                },
                posiHight:270,
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState
            },
            roleState(){        //是否为主管     
                return this.$store.state.roleState;
            }
        },
        methods:{      
            searchDocumentLight(){   //获取文档列表数据
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
                if(this.selectIndex == 1){
                    this.searchStructDocumentLight(startTimeSub,endTimeSub);
                    return false;
                }
                this.documentList.tableLoading = true;
                this.httpGet(this.URL.searchDocumentLight,{
                    page:this.documentList.pageIndex,
                    pageSize:this.documentList.pageLength,
                    signStatus:this.tabStatus,
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
            searchStructDocumentLight(startTimeSub,endTimeSub){   //获取我下属的文档列表数据
                this.documentList.tableLoading = true;
                this.httpGet(this.URL.searchStructDocumentLight,{
                    page:this.documentList.pageIndex,
                    pageSize:this.documentList.pageLength,
                    cycle:this.tabStatus,
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
            searchArchiveDirList(){    //获取归档到文件夹数据
                this.httpGet(this.URL.searchArchiveDirList,{},(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        this.fileDirList = result.data;
                        if(!this.cloudyState){
                            $("#content-2").mCustomScrollbar("destroy");
                            setTimeout(function(){
                                $("#content-2").mCustomScrollbar({
                                    theme:"minimal"
                                });
                            })
                        }
                       
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })

            },
            addArchiveRecord(dirId){    //添加到归档文件
                this.fileDirState=false;
                this.httpGet(this.URL.addArchiveRecord,{
                    dirId:dirId,
                    docId:this.addArchiveData.docId
                },(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        
                        this.searchDocumentLight();
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            changeStatus(num,status){  //tabIndex   status
                this.tabIndex = num;
                this.tabStatus = status;
                if(this.documentList.pageIndex != 1){
                    this.Event2.$emit('tip2',1);
                }else{
                    this.searchDocumentLight();
                }
            },
            tabChangeMine(){   //我自己的
                this.subordinate=false;
                this.selectIndex = 0;
                if(this.tabStatus == '200'){
                    this.tabIndex = 2; 
                    this.tabStatus = '201';
                }
                this.searchDocumentLight();
            },
            tabChangeBranch(){ //下属的
                this.subordinate=true;
                this.selectIndex = 1;
                if(this.tabStatus == '201' || this.tabStatus == '202'){
                    this.tabIndex = 1; 
                    this.tabStatus = '200';
                }
                this.searchDocumentLight();
            },
            pageChangeHandel(val){   //翻页
                this.documentList.pageIndex = val;
                this.searchDocumentLight();
            },
            fileHandle(event,docId){      //归档到
                // if(this.fileDirList.length == 0){
                //     this.alertCommonTip('暂无归档文件夹');
                //     return;
                // }
                this.documentState = false;
                if(!this.documentState){
                    this.documentState = true;
                    this.fileDirState = true;
                    var tagX = event.target.offsetLeft;
                    var tagY = event.target.offsetTop;
                    var objHtml = document.getElementById("dropdown-menu");
                    objHtml.style.left=tagX+65+'px';
                    objHtml.style.top=tagY+this.posiHight+'px';
                    this.addArchiveData.docId = docId;
                }
            },
            selectDateHandle(value,event){  //选择查询时间方式
            //this.getReParms.signStartDate=value;
                if($(event.target).hasClass('active')){
                    $(event.target).removeClass('active');
                    this.timeIndex = 0;
                    this.timeSelect = true;          
                    this.startTime = this.endTime = '';
                    this.searchDocumentLight();
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
                this.timeSelect = true;
                this.startTime = this.endTime = '';
                // this.searchDocumentLight(); 
                if(this.documentList.pageIndex != 1){
                    this.Event2.$emit('tip2',1);
                }else{
                    this.searchDocumentLight();
                }           
            },
            searchHandle(){   //查询
                this.documentList.pageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.searchDocumentLight();                
                /*此代码有判断为空是否可以查询
                if(this.timeSelect){
                    this.searchDocumentLight();
                    this.timeSelect = false;
                }else{
                    if(this.TemSearchTitle == val) return false;
                    this.searchDocumentLight();
                    this.TemSearchTitle = val;
                }*/
            },
            clearHandle(){   //清空
                // this.selectIndex = 0;
                this.startTime = this.selectStartTime = this.endTime = this.selectEndTime = '';
                this.documentList.pageIndex = 1;
                this.timeIndex = 0;
                this.searchTitle = '';
                this.Event2.$emit('tip2',1);
                this.searchDocumentLight();
            },
            lookDetail(docId){   //查看
                // window.location.href=this.linkHref+"doc/documentInfo/toDocDetail?docId="+docId+"&indexStatus="+this.tabStatus+"&tabIndex="+this.tabIndex+"&fromTab="+this.selectIndex;
                this.$router.push({
                    name:"docDetail",
                    params: { docId: docId },
                    query: { 
                        indexStatus: this.tabStatus,
                        tabIndex:this.tabIndex,
                        fromTab:this.selectIndex,
                        timeIndex:this.timeIndex,
                        beginTime:this.timeIndex == 0 ? this.startTime:this.selectStartTime,
                        endTime:this.timeIndex == 0 ? this.endTime:this.selectEndTime,
                        page:this.documentList.pageIndex,
                        pageSize:this.documentList.pageLength,
                    }
                });
            },
            downLoadHandle(docId){    //下载
                window.location.href=this.linkHref+"doc/documentInfo/downloadDocument?docId="+docId;
            },
            signFile(docId){          //签署
                if(docId == 'none') return;
                window.location.href=this.linkHref+"doc/document/toSignDoc?docId="+docId; 
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
                    this.endTime = $("#date_end").find('input').val();
                    $('#date_end').find('input').val(this.endTime);
                    this.timeIndex = 0;
                    this.timeSelect = true;
                });
                $(document).on('click',function(){
                    if(This.documentState){
                        This.fileDirState = false;
                        This.documentState = false;
                    }
                })
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-我的文档";
            }else{
                document.title="签吧-我的文档";
            }
            this.$store.dispatch('changeTitle','我的文档 > 文档列表');            
            this.init();
            if(this.getUrlPara('docTip')){
                this.alertCommonTip(this.getUrlPara('docTip'));
            }
            var Timer = setInterval(()=>{               
                if(this.userState){
                    clearInterval(Timer);
                    if(this.userState == 1){  //大b管理员获取的是下属的列表数据
                        this.selectIndex = 1;
                    }
                    if(this.userState == 2 && this.roleState == 1){
                        this.posiHight = 320;
                        this.selectIndex = this.getUrlPara('fromTab');
                        if(this.selectIndex == 1){
                            this.subordinate = true;
                        }else{
                            this.subordinate = false;
                        }
                    }
                    this.tabStatus = this.getUrlPara('indexStatus');                    
                    this.tabIndex = this.getUrlPara('tabIndex') ? this.getUrlPara('tabIndex') : '';
                    this.timeIndex = this.getUrlPara('timeIndex') ? this.getUrlPara('timeIndex') : 0;
                    this.documentList.pageIndex = Number(this.getUrlPara('page') ? this.getUrlPara('page') : 1);
                    this.documentList.pageLength = Number(this.getUrlPara('pageSize') ? this.getUrlPara('pageSize') : 10);
                    this.Event2.$emit('tip2',this.documentList.pageIndex);
                    if(this.timeIndex == 0){
                        this.startTime = this.getUrlPara('beginTime') ? this.getUrlPara('beginTime') : '';
                        this.endTime = this.getUrlPara('endTime') ? this.getUrlPara('endTime') : '';
                    }else{
                        this.selectStartTime = this.getUrlPara('beginTime') ? this.getUrlPara('beginTime') : '';
                        this.selectEndTime = this.getUrlPara('endTime') ? this.getUrlPara('endTime') : ''; 
                    }
                    this.searchDocumentLight();
                }
            },300);
            this.searchArchiveDirList();    //获取文件夹数据
        }
    }
</script>
<style lang="scss" scoped>
    $border:#e6e7ed;
    $pink:#ff503f;
    $black:#acacac;
    .documentList{
        .panel-tab{            
            .tabBox{
                margin-bottom: 10px;
                ul{
                    border-bottom: 1px $border solid;
                    li{
                        width: 100px;
                        float: left;     
                        &.active{
                            border-bottom: 2px $pink solid;
                        }               
                        a{
                            width: 80px;
                            margin: 0 auto;
                            line-height: 35px;
                            display: block;
                            text-align: center;
                            color: #4a4a4a;
                        }
                    }
                }
            }
            
        }
        .tabNav{
            padding: 10px;
            background: #F8F8F8;
            label{
                float: left;   
                line-height: 30px;
                margin-right: 20px;         
            }
            ul{
                li{
                    float: left;
                    width: 100px;
                    text-align: center;
                    line-height: 30px;
                    a{
                        width: 70%;
                        color: #4a4a4a;
                        display: block;
                        margin: 0 auto;
                        &.active{
                            background: #ff503f;
                            color: #fff;
                            border-radius: 50px;
                        }
                    }
                }
            }
        }
        .panel-box{
            .table-six{
                ul{
                    li{
                        cursor: pointer;
                        span{
                            &:nth-child(1){
                                width: 19%;
                            }
                            &:nth-child(2){
                                width: 19%;
                            }
                            &:nth-child(3){
                                width: 10%;
                            }
                            &:nth-child(4){
                                width: 10%;
                            }
                            &:nth-child(5){
                                width: 10%;
                            }
                            &:nth-child(6){
                                width: 20%;
                            }
                            .i-fs,.i-shou{
                                color: #ff503f;
                                padding: .5px 3px;
                                border: 1px solid #ff503f;
                                border-radius: 3px;
                                box-sizing: border-box;
                                margin-right: 8px;
                                font-weight: normal;
                                font-size: 12px;
                                margin-left:0;
                            }
                            &.signStatus{
                                position: relative;
                                .myNotSign{
                                    width:47px;
                                    height:19px;
                                    background: url("../../assets/images/woweiqian2.png") no-repeat;
                                    -ms-background-size:cover;
                                    -moz-background-size:cover;
                                    -webkit-background-size:cover;
                                    background-size:cover;
                                    display: inline-block;
                                    position: absolute;
                                    left:80px;
                                    top:20px;
                                }
                            }
                            
                        }
                        a{
                            color: #4397D7;
                            &.file_btn{
                                position: relative;
                                padding-right: 15px;
                                .triangle{
                                    width: 0;
                                    height: 0;
                                    border: 4px solid;
                                    border-color: #4397D7 transparent transparent transparent;
                                    position: absolute;
                                    top: 10px;
                                    right: 5px;
                                }
                            }
                        }
                    }
                }
            }
        }

        /*归档到*/
        .dropdown-menu{
            width: 200px;    
            position:absolute;
            box-shadow:0 0 10px #97a8fd;
            -ms-box-shadow:0 0 10px #97a8fd;
            border-radius:10px;
            z-index: 10;
            left:0;
            top:0;
            border-radius: 10px;
            -ms-border-radius:10px;
            .scroll_box{
                max-height:200px;
                .mCustomScrollBox{
                    border-radius:10px;
                    -ms-border-radius:10px;
                }
            }
            i{
                font-size:0;  
                width:0;  
                height:0;  
                border:5px solid; 
                border-color:rgba(0,0,0,0) rgba(0,0,0,0) rgba(255,255,255,1) rgba(0,0,0,0); 
                right:30px;
                position: absolute;
                top:-10px; 
                z-index: 55;
            }
            dl{
                height: 45px;
                display: block;
                line-height: 45px;
                border-bottom: 1px $border solid;
                background:none;
                cursor: pointer;
                &:hover{
                    background:#fcfcfc;
                }
                dd{
                    padding-left: 30px;
                }
            }
        }
    }
    @media (min-width:1460px) {
        .documentList .panel-box .table-six ul li span.signStatus .myNotSign{
            left: 95px;
        }
    }
</style>



<template>
    <div class="letter-page" v-cloak>
        <div class="right_col">
            <div class="search-com">
                <div class="search">
                    <label>搜索信息</label>
                    <input type="text" placeholder="关键字搜索" v-model.trim="searchTitle" @keydown.enter="searchHandle">
                    <span class="search-btn" @click="searchHandle">搜索</span>
                </div>
            </div>
            <div class="letter-list clf">
                <div class="loadSource" v-show="tableLoading" :class="[cloudyState ? 'loadSource_c' : '']">
                    <p v-if="!cloudyState"><img src="../../assets/images/loading.gif" alt="" width="80" height="51"></p>
                    <p v-if="cloudyState"><img src="../../assets/images/logo_small.png" width="48px" height="48px" alt=""></p>
                </div>
                <ul>
                    <li>
                        <span class="icon" :class="[selectAll ? 'icon-check2-default' : 'icon-square']" @click="selectAllHandle"></span>
                        <p>全选</p>
                        <b class="delete" @click="delMessage">删除</b>
                    </li>
                    <li v-for="(item,index) in letterList" :key="index">
                        <span class="icon" :class="[ item.checkItem ? 'icon-check2-default':'icon-square']"  @click="selectHandle(item)"></span>
                        <p class="isRead" v-html="item.text" :class="[item.isRead == 1 ? 'isReadOver' : '']"></p>
                        <b class="newsTime">{{item.msgTime | filterdata}}</b>
                    </li>
                    <!-- <li>
                        <span class="icon icon-square"></span>
                        <p>您收到一份来自广东信鉴公司的<span class="contract">【电脑采购合同】</span>，请于<span class="time"><b class="icon-clock"></b>2015-08-25</span>完成文件签署。</p>
                        <b class="newsTime">2017.04.11  20:00:00</b>
                    </li>
                    <li>
                        <span class="icon icon-square"></span>
                        <p>您的同事刘小龙已把<span class="contract">【电脑采购合同】</span>归档到<2017年采购类>，请知悉！</p>
                        <b class="newsTime">2017.04.11  20:00:00</b>
                    </li> -->
                    <li class="no-message" v-show="letterList.length == 0  && !tableLoading">
                        <p><img src="../../assets/images/noAnyThing.png" alt=""></p>
                        <p v-text="'暂无数据'"></p>
                    </li> 
                    <li>
                        <div class="pageNumber">
                            <span>共{{pageData.total}}条记录/当前页为第{{pageData.currentpageIndex}}页</span>
                            <div class="page-box">
                                <pagination  :total="pageData.total" :currentpage="pageData.currentpageIndex" :display="pageData.display"  @pagechange="pageChangeHandel"></pagination>
                            </div>
                        </div> 
                    </li>
                    
                </ul>
            </div>
        </div>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    export default{
        name:'letter',
        data(){
            return{
                tableLoading:false,     //加载状态
                pageData:{
                    total:0,
                    currentpageIndex:1,
                    display:10
                },
                searchTitle:'',
                temSearchTitle:'',
                letterList:[],
                temLetterList:[],     //存放已勾选的数组
                selectAll:false,      //是否选中全选
                rcvIds:[],            //未读数据数组
                delRcvIds:[],         //删除信息数组
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                }
            }
        },
        methods:{
            searchMessagePaging(){    //获取站内信息列表
                this.tableLoading = true;
                this.httpGet(this.URL.searchMessagePaging,{
                    filter:this.searchTitle,
                    pageIndex:this.pageData.currentpageIndex,
                    pageLength:this.pageData.display
                },(response)=>{
                    this.tableLoading = false;
                    var result = response.data;
                    if(result.meta.success){
                        this.letterList = result.data.list;
                        for(var i = 0; i < this.letterList.length;i++){
                            if(this.letterList[i].isRead == "0"){        //标记未读信息
                                this.rcvIds.push(this.letterList[i].rcvId)
                            }
                            this.letterList[i].checkItem = false;
                            for(var j = 0 ; j < this.temLetterList.length; j++){
                                if(this.letterList[i].rcvId == this.temLetterList[j].rcvId){
                                    this.letterList[i].checkItem = true;
                                }
                            }
                        }
                        this.pageData.total = result.data.pageCount;
                        this.readMessage();
                        this.countUnreadMessage();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            readMessage(){        //站内消息标记为已读
                if(this.rcvIds.length == 0) return false;
                this.httpGet(this.URL.readMessage,{
                    rcvIds:this.rcvIds.join(',')
                },(response)=>{                    
                    var result = response.data;
                    if(result.meta.success){
                        this.rcvIds = [];   
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            delMessage(){        //删除站内信息
                this.letterList.forEach((element)=>{
                     if(element.checkItem){
                        this.delRcvIds = this.removeArr(this.delRcvIds,element.rcvId);
                        this.delRcvIds.push(element.rcvId);
                    }
                });
                if(this.delRcvIds.length == 0) return false;
                this.httpGet(this.URL.delMessage,{
                    rcvIds:this.delRcvIds.join(',')
                },(response)=>{                    
                    var result = response.data;
                    if(result.meta.success){
                        this.delRcvIds = [];
                        this.temLetterList = [];
                         if(this.selectAll){
                            this.selectAll = false;
                            // this.pageData.currentpageIndex = 1;
                            this.Event2.$emit('tip2',1);
                        } 
                        this.searchMessagePaging();   
                        // this.countUnreadMessage();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })

            },
            selectHandle(item){    //勾选
                var state = item.checkItem;
                if(state){   //取消选中  
                    this.selectAll = false;   //取消全选
                    for(var i = 0; i < this.temLetterList.length; i++){
                        if(this.temLetterList[i].rcvId == item.rcvId){
                            this.temLetterList.splice(i,1);         //往临时数组里面删除一条数据
                        }
                    }                            
                    item.checkItem = false; 
                }else{       //选中     
                    var selectNum = 0;                    
                    this.temLetterList.push(item);                  //往临时数组里面添加一条数据
                    this.temLetterList =  this.unique3(this.temLetterList,'rcvId');
                    item.checkItem = true; 
                    
                    //判断全选是否选中
                    for(var i = 0; i < this.letterList.length;i++){                       
                        if(this.letterList[i].checkItem == true){
                            selectNum++;
                        }                        
                    }
                    if(selectNum == this.letterList.length){
                        this.selectAll = true; 
                    }
                }
            },
            selectAllHandle(){           //全选
                if(!this.selectAll){     //全选选中
                    this.selectAll = true;
                    for(var i = 0 ; i < this.letterList.length; i++){
                        this.letterList[i].checkItem = true;
                        this.temLetterList.push(this.letterList[i]);
                        this.temLetterList = this.unique3(this.temLetterList,'rcvId')
                    }
                    
                }else{                   //取消全选
                    this.selectAll = false;
                    for(var i = 0 ; i < this.letterList.length; i++){
                        this.letterList[i].checkItem = false;
                        for(var j = 0 ; j < this.temLetterList.length;j++){
                            if(this.letterList[i].rcvId == this.temLetterList[j].rcvId){ 
                                this.temLetterList.splice(j,1);
                            }
                        }
                    }
                }
            },
            searchHandle(){      //搜索
                /*if(this.temSearchTitle != this.searchTitle){
                    this.searchMessagePaging();
                    this.temSearchTitle = this.searchTitle;
                }*/
                this.searchMessagePaging();

            },
            countUnreadMessage(){   //获取站内未读信息
                this.httpGet(this.URL.countUnreadMessage,{},(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        this.$store.dispatch("changeCountLetter",result.data);
                    }
                })
            },
            pageChangeHandel(val){
                this.pageData.currentpageIndex = val;
                this.searchMessagePaging();
            },
            init(){
                let This = this;
                $('.letter-list').delegate('.contract','click',function(){
                    var docId = $(this).attr('docid');
                    // window.location.href='/doc/documentInfo/toDocDetail?docId='+docId;
                    This.$router.push({
                        name:"docDetail",
                        params: { docId: docId }
                    });
                })
            }
        },
        mounted(){
            this.searchMessagePaging();
            this.init();
            if(this.cloudyState){
                document.title="云合同-站内消息";
            }else{
                document.title="签吧-站内消息";
            }
            this.$store.dispatch("changeTitle","站内消息");
        }
    }
</script>
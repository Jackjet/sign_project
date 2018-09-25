<template>
    <div>
        <!-- 新手指引 -->
        <div class="fitIeTip" v-show="guideUser"></div> <!--大Buser-->
        <div class="fitIeTip2" v-show="guideAdmin"></div> <!--大B管理员-->
        <div class="fitIeTip3" v-show="smallGuideAdmin"></div> <!--小B管理员-->
        <div class="mask-image" v-show="guideUser || guideAdmin" @click="hideGuide">
            <label>欢迎您登录签吧平台，您可以试试点击右上角按钮！</label>
            <a class="mask-image-btn">
                <img src="../../assets/images/maskImageBtn.png">
            </a>
        </div>
        <div class="mask-image" v-show="smallGuideAdmin">
            <transition-group
                name="bounce"
                enter-active-class="animated fadeInRight"
                leave-active-class="animated fadeOutLeft"
            >
            <div :key="1" v-show="guide1"  class="guide-img">
                <img  src="../../assets/images/guide1.png" alt="" @click="guide1 = false;guide2 = true" >
            </div>
            <div :key="2"  v-show="guide2"  class="guide-img">
                <img src="../../assets/images/guide2.png" alt="" @click="guide2 = false;guide3 = true" >
            </div>
            <div :key="3" v-show="guide3"  class="guide-img">
                <img  src="../../assets/images/guide3.png" alt="" @click="guide3 = false;guide4 = true" >
            </div>
            <div :key="4"  v-show="guide4"  class="guide-img">
                <img src="../../assets/images/guide4.png" alt=""   >
                <span class="again" @click="guide4 = false;guide1 = true;"></span>
                <span class="start" @click="guide4 = false;smallGuideAdmin = false;"></span>
            </div>
            
            </transition-group>
        </div>
        <!-- 大b管理员 -->
        <div class="right_col index_admin" v-if="userState == 1" v-cloak>
            <!-- 成员列表 -->
            <TableList 
                table-title="成员列表" 
                tableClass="table-five"
                :pageNumberState="false"
                :tableLoading="searchMemberList.tableLoading" 
                :total="searchMemberList.pageTotal"
                :currentpage="searchMemberList.pageIndex"
                :display="searchMemberList.pageLength"
                @pagechange="pageChangeHandel"
            >
                <h3 slot="panel-header" class="lookMore">成员列表 <a href="javascript:;" class="more" @click="memberListMore">查看更多>></a></h3>
                <ul slot="panel-content" class="member">
                    <li class="title">
                        <span>姓名</span>
                        <span>账号（邮箱）</span>
                        <span>手机</span>
                        <span>部门</span>
                        <span>备注</span>
                    </li>
                    <li v-for="(item,index) in searchMemberList.tableList" :key="index">
                        <span :title="item.name">{{item.name}}  <i v-if="item.isRole == 1"><img src="../../assets/images/zhuguan.png" alt=""></i></span>
                        <span :title="item.accNo">{{item.accNo}}</span>
                        <span :title="item.mobileNo">{{item.mobileNo}}</span>
                        <span :title="item.structureName">{{item.structureName}}</span>
                        <span :title="item.memo">{{item.memo}}</span>
                    </li>
                    <!-- <li>
                        <a href="javascript:;" class="more">查看更多</a>
                    </li> -->
                </ul>
            </TableList>
            <!-- 合作伙伴 -->
            <TableList 
                table-title="合作伙伴" 
                tableClass="table-six"
                :pageNumberState="false"
                :tableLoading="PartnersList.tableLoading" 
                :total="PartnersList.pageTotal"
                :currentpage="PartnersList.pageIndex"
                :display="PartnersList.pageLength"
                @pagechange="pageChangeHandel"
            >
                <h3 slot="panel-header" class="lookMore">合作伙伴 <a href="javascript:;" class="more" @click="partnerListMore">查看更多>></a></h3>
                <ul slot="panel-content">
                    <li class="title">
                        <span>企业名称</span>
                        <span>账号（邮箱）</span>
                        <span>手机号码</span>
                        <span>所属部门</span>
                        <span>是否激活</span>
                        <span>备注</span>
                    </li>
                    <li v-for="(item,index) in PartnersList.tableList" :key="index">
                        <span>{{item.name}}</span>
                        <span>{{item.accNo}}</span>
                        <span>{{item.mobileNo}}</span>
                        <span>{{item.structureName}}</span>
                        <span>{{item.accStatus == 1 ? '未激活' : item.accStatus == 2 ? '已激活' : '已激活，已实名认证'}}</span>
                        <span>{{item.memo}}</span>
                    </li>
                    <!-- <li>
                        <a href="javascript:;" class="more">查看更多</a>
                    </li> -->
                </ul>
            </TableList>
        </div>

        <!-- 大B User  小B管理员 -->
        <div class="right_col" v-show="userState == 2 || userState == 3">
            <div class="row">
                  <div class="col-md-12 col-sm-12 col-xs-12">
                      <div class="index-panel x_panel">
                          <h3>共有<span id="toDealNum">{{totalNum}}</span>份文件</h3>
                          <ul class="clf nav">
                              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                  <a href="javascript:;" class="clf" @click="toDocList('202','3','0')">
                                      <div class="text-right">
                                          <i class="icon-replace"></i>
                                      </div>
                                      <div class="txt">
                                          <h4 id="showNum2" >{{showNum.one}}</h4>
                                          <span>待他人签</span>
                                      </div>
                                  </a>
                              </li>
                              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                  <a href="javascript:;" class="clf" @click="toDocList('201','2','0')">
                                      <div class="text-right">
                                          <i class="icon-replace-me"></i>
                                      </div>
                                      <div class="txt">
                                          <h4 id="showNum1">{{showNum.two}}</h4>
                                          <span>待我签</span>
                                      </div>
                                  </a>
                              </li>
                              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                  <a href="javascript:;" class="clf" @click="toDraft">
                                      <div class="text-right">
                                          <i class="icon-drafts"></i>
                                      </div>
                                      <div class="txt">
                                          <h4 id="showNum3">{{showNum.three}}</h4>
                                          <span>草稿箱</span>
                                      </div>
                                  </a>
                              </li>
                              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                                  <a href="javascript:;" class="clf" @click="toDocList('300','4','0')">
                                      <div class="text-right">
                                          <i class="icon-complete"></i>
                                      </div>
                                      <div class="txt">
                                          <h4 id="showNum4">{{showNum.four}}</h4>
                                          <span>已完成</span>
                                      </div>
                                  </a>
                              </li>
                          </ul>
                      </div>
                      <!-- 发 -->
                      <div class="index-panel clf">
                            <h3><span class="i-fs">发</span>我发起<a href="javascript:;" @click="mySendMore">更多>></a></h3>
                            <div class="index-send clf">
                                <!--发没有数据调用此次代码-->
                                <div class="no-message" v-if="mySend.total == 0 && !mySend.loading">
                                         <img src="../../assets/images/no-record.png" alt=""> 
                                    <p>没有您发起的文档<router-link to="/doc/document/toFillin">发起签约</router-link></p>
                                </div>

                                <!-- 发有数据 -->
                                <div class="index-send-left col-lg-5 col-md-12 col-sm-12 col-xs-12">
                                    <ul class="list-left clf" id="sendDocList">
                                        <li v-for="(item,index) in mySend.list" :key="index" @mouseover="changeIndex(index)" :class="[docIndex == index ? 'active' : '']" @click="goDetail(item.docId)">
                                            <a href="javascript:;" >
                                                <h4 class="shengl">{{item.docName}}</h4>
                                                <p>有效期：{{item.duration}}</p>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="index-send-right col-lg-7 col-md-12 col-sm-12 col-xs-12">
                                    <div class="sign-list" id="content-2" v-show="mySend.total != 0">
                                        <ul class="clf">
                                            <li class="clf" v-for="(item,index) in signTable" :key="index" :class="item.isSponsor == '0' && !item.signed ? 'wait':''">
                                                <span  :class="[item.accNo != '0' && mySend.list[sIndex].signOrderType == '002' ? '' : 'opacity']" >{{ item.accNo < 10 ? '0'+item.accNo : item.accNo }}</span>
                                                 <span>
                                                    <b class="line"></b>
                                                    <i class="icon-send-person" v-if="item.isSponsor == 1  && item.signStatus != 'D400' "></i>
                                                    <i class="icon-chexiao" v-else-if="item.isSponsor == 1 && item.signStatus == 'D400'"></i>
                                                    <b class="icon-song" v-else-if="item.isCarbon == 1">@</b>
                                                    <i :class="[item.signed ? 'icon-check-default':'icon-wait']" v-else-if="item.isSponsor == 0 && item.signStatus != 'D400' && item.signStatus != 'NONE'"></i>
                                                    <b class="guoqi" v-else-if="item.duration">-</b>
                                                    <b v-else-if="item.signStatus == 'D400'" class="icon-close"></b>
                                                    <b v-else class="icon-circle"></b>
                                                    <strong v-if="item.isSponsor == 1 && item.signStatus != 'D400' ">发起人</strong>
                                                    <strong v-else-if="item.isCarbon == 1">抄送人</strong>
                                                    <strong v-else-if="item.isSponsor == 0 && item.signStatus != 'D400' && item.signStatus != 'NONE'">{{item.signed ? '已签署' : '待签署'}}</strong>
                                                    <strong v-else-if="item.duration">截止日期：{{item.duration}}</strong>
                                                    <strong v-else-if="item.signStatus == 'D400'">已撤销</strong>
                                                    <strong v-else></strong>
                                                </span>
                                                <span class="shengl" :title="item.name" >
                                                    <b :class="[item.isSponsor != 0 ? 'opacity icon-seal' : (item.stampType == 0 ? 'icon-seal' : 'icon-sign-pen') ]"></b>{{item.name}}
                                                    <strong class="faqiren" v-if="item.isSponsor == 1  && item.signStatus == 'D400'">发起人</strong>
                                                </span>
                                                <span v-if="item.isSponsor != 0 && item.signStatus != 'D400'">{{item.sendTime}}</span>
                                                <!-- <span v-if="item.isSponsor != 0 && item.signStatus == 'D400'">{{item.cancelTime}}</span> -->
                                                <span v-if="item.signStatus == 'D400'">{{item.cancelTime}}</span>
                                                <span v-if="item.isSponsor == 0">{{item.signTime}}</span>
                                            </li>
                                           
                                        </ul>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <!-- 收 -->
                      <div class="index-panel clf mb30" id="waitDocList">
                          <h3><span class="i-fs">收</span>抄送我<a href="javascript:;" @click="carbonMore">更多>></a></h3>
                          <!-- 收没有数据 -->
                           <div class="no-message" v-if="carbonDocListTotal == 0">
                                        <img src="../../assets/images/no-record.png" alt=""> 
                                <p>没有抄送我的文档
                                    <!-- <router-link to="/doc/document/toFillin">发起签约</router-link> -->
                                </p>
                            </div>
                          <!-- 收有数据 -->
                          <div class="pannel-shou clf" v-for="(item,index) in carbonDocList" :key="index">
                              <div class="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                                  <a href="javascript:;" @click="goDetail(item.docId)">
                                      <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                                          <h4 class="shengl">{{item.docName}}</h4>
                                          <p> {{'签署方：'+ carbonSigner[index]}}</p>
                                      </div>
                                      <div class="col-lg-4 col-md-4 col-md-4 col-xs-4 text-right ">
                                          <p>发起人：{{item.senderName}}</p>
                                          <p>有效期：{{item.duration}}</p>
                                      </div>
                                  </a>
                              </div>
                              <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 pannel-btn text-center">
                                  <a href="javascript:;" @click="goDetail(item.docId)">查看</a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
        </div>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>

    
</template>
<script>
    export default{
        name:"index_admin",
        data(){
            return{
                guideAdmin:false, //新手指引 大B admin
                guideUser:false,  //新手指引 大B user              
                smallGuideAdmin:false, //小B admin
                guide1:false,
                guide2:false,
                guide3:false,
                guide4:false,                
                showNum:{
                    one:'',
                    two:'',
                    three:'',
                    four:''
                },
                searchMemberList:{
                    tableLoading:false,
                    tableList:[],
                    pageTotal:1,
                    pageIndex:1,
                    pageLength:5,
                },
                PartnersList:{
                    tableLoading:false,
                    tableList:[],
                    pageTotal:1,
                    pageIndex:1,
                    pageLength:5,
                },
                mySend:{
                    loading:false,
                    list:[],
                    total:null,                    
                },
                isExitCarbon:[false,false,false],        //是否存在抄送人
                isExitSignerCancle:[false,false,false],  //是否存在发起人撤销文档
                carbonDocList:[],   //抄送给我的列表数据
                carbonDocListTotal:null,
                carbonSigner:[],
                docIndex:0,
                signers:{'one':[],'two':[],'three':[],'four':[],'five':[],'six':[]},
                sIndex:0,    //我发起的选中index
                signTable:[],
                totalNum:0,
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false,
                }


            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            },
            curAccount(){
                return this.$store.state.curAccount;
            }
        },
        methods:{
            /*大B管理员 */
            searchMemberListLight(){   //企业成员
                this.searchMemberList.tableLoading = true;
                this.httpGet(this.URL.searchMemberListLight,{
                    structureId:'',
                    page:1,
                    pageSize:10
                },(response)=>{
                    this.searchMemberList.tableLoading = false;
                    let result = response.data;
                    if(result.meta.success){
                        this.searchMemberList.tableList = result.data.list;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            ajaxSearchPartnersListLight(){   //合作伙伴数据
                this.PartnersList.tableLoading = true;
                this.httpGet(this.URL.ajaxLight,{
                    condition:'',
                    page:1,
                    accStatus:0,
                    pageSize:10
                },(response)=>{
                    this.PartnersList.tableLoading = false;
                    let result = response.data;
                    if(result.meta.success){
                        this.PartnersList.tableList = result.data.list;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            memberListMore(){
                // window.location.href= this.linkHref+"cus/orgStructure/toOrgStructurePage";
                this.$router.push({
                    name:"organization",
                });
                
            },
            partnerListMore(){
                // window.location.href= this.linkHref+"cus/companyPartners/toCompanyPartnersManagement";
                this.$router.push({
                    name:"partner",
                });
            },
            //小b，大buser
            signDocCount(status,num){                
                this.httpGet(this.URL.signDocCount,{
                    signStatus:status
                },(response)=>{
                    let result = response.data;
                    if(num == 1){
                        this.showNum.one = result;                        
                    }
                    if(num == 2){
                        this.showNum.two = result;
                    }
                    if(num == 4){
                        this.showNum.four = result;
                    }
                    this.totalNum = this.totalNum + result;
                })
            },
            indexDraft(){  //获取草稿箱数据
                this.httpGet(this.URL.indexDraft,{},(response)=>{
                    this.showNum.three = response.data;
                    this.totalNum = this.totalNum + response.data;
                })
            },
            searchSendList(){   //我发起的列表
                this.mySend.loading = true;
                this.httpGet(this.URL.searchSponsorDocListLight,{
                    page:1,
                    pageSize:3,
                    condition:'',
                    beginTime:'',
                    endTime:''
                },(res)=>{
                    this.mySend.loading = false;
                    let result = res.data;
                    if(result.meta.success){
                        this.mySend.list = result.data.list;
                        if(this.mySend.list.length == 0){
                            this.mySend.total = 0;
                            return;
                        }
                        for(let i = 0 ; i < this.mySend.list.length ; i++){
                            this.signtorList(this.mySend.list[i].docId,i);
                        }
                        
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            signtorList(docId,num){  //我发起的列表对应的签署人详情
                this.httpGet(this.URL.signtorList,{
                    docId:docId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        let signers = result.data.list;
                        let index = 0;
                        for(let i = 0; i < signers.length; i++){
                            if(signers[i].isSponsor == 1){        //发起人
                                signers[i].accNo = index;
                            }else if(signers[i].isCarbon == 1){   //抄送人
                                // this.isExitCarbon = true;
                                signers[i].accNo = index;
                            }else if(signers[i].isSponsor == 1 && signers[i].signStatus == 'D400'){  //发起人撤销
                                // isExitSignerCancle = true;
                                signers[i].accNo = index;
                            }else if(signers[i].duration){      //截止日期
                                signers[i].accNo = index;
                            }else{
                                signers[i].accNo = ++index;
                            }
                        }

                        //我发起
                        if(num == 0){
                            this.signers.one= signers;   
                            this.isExitCarbonHandle(this.signers.one,0);
                            this.isExitSignerCancleHandle(this.signers.one,0);
                            this.changeIndex(0);
                        }
                        if(num == 1){
                            this.signers.two= signers;
                            this.isExitCarbonHandle(this.signers.two,1);
                            this.isExitSignerCancleHandle(this.signers.two,1);
                        }
                        if(num == 2){
                            this.signers.three= signers;
                            this.isExitCarbonHandle(this.signers.three,2);
                            this.isExitSignerCancleHandle(this.signers.three,2);
                        }

                        
                        //抄送我
                        if(num == 3){
                            for(let i = 0 ; i < result.data.list.length; i++){
                                if(result.data.list[i].isSponsor == 0){
                                    this.signers.four.push(result.data.list[i].name);
                                }
                            }
                            this.carbonSigner[0] = this.signers.four.join(',')
                        }
                        if(num == 4){
                            for(let i = 0 ; i < result.data.list.length; i++){
                                if(result.data.list[i].isSponsor == 0){
                                    this.signers.five.push(result.data.list[i].name);
                                }
                            }
                            this.carbonSigner[1] = this.signers.five.join(',')
                        }
                        if(num == 5){
                            for(let i = 0 ; i < result.data.list.length; i++){
                                if(result.data.list[i].isSponsor == 0){
                                    this.signers.six.push(result.data.list[i].name);
                                }
                            }
                            this.carbonSigner[2] = this.signers.six.join(',')
                        }
                        
                    }
                })
            },
            isExitCarbonHandle(arr,num){
                for(var i = 0 ; i < arr.length ; i++){
                    if(arr[i].isCarbon == 1){                        
                        this.isExitCarbon[num] = true;
                    }
                }
            },
            isExitSignerCancleHandle(arr,num){
                for(var i = 0 ; i < arr.length ; i++){
                    if(arr[i].isSponsor == 1  && arr[i].signStatus == 'D400'){                        
                        this.isExitSignerCancle[num] = true;
                    }
                }
            },
            searchCarbonDocList(){   //抄送给我的列表数据
                this.httpGet(this.URL.searchCarbonDocList,{
                    page:1,
                    pageSize:3,
                    condition:'',
                    beginTime:'',
                    endTime:''
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.carbonDocList = result.data.list;
                        if(this.carbonDocList.length == 0){
                            this.carbonDocListTotal = 0;
                            return false;
                        }
                        for(let i = 0 ; i < this.carbonDocList.length ; i++){
                            this.signtorList(this.carbonDocList[i].docId,i+3)
                        }
                        
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            changeIndex(val){ //鼠标移过改变index
                this.docIndex = val;
                if(val == 0){
                    this.signTable = this.signers['one'];
                    this.sIndex = 0;
                }else if(val == 1){
                    this.signTable = this.signers['two'];
                    this.sIndex = 1;
                }else{
                    this.signTable = this.signers['three'];
                    this.sIndex = 2;
                }
                
                // $("#content-2").mCustomScrollbar("destroy");
                setTimeout(function(){
                    $("#content-2").mCustomScrollbar({
                        theme:"minimal"
                    });
                })

            },
            goDetail(docId){   //点击列表到详情页面
                this.$router.push({
                    name:'docDetail',
                    params:{docId:docId}
                })
            },
            toDocList(indexStatus,tabIndex,fromTab){
                this.$router.push({
                    name:'documentList',
                    query:{
                        indexStatus,
                        tabIndex,
                        fromTab
                    }
                })
            },
            toDraft(){
                this.$router.push({
                    name:'draft'
                })
            },
            mySendMore(){   //我发送的的更多
                this.$router.push({
                    name:'mySend'
                })
            },
            carbonMore(){   //抄送给我的
                this.$router.push({
                    name:'copy'
                })
            },
            pageChangeHandel(val){
            },
            /*新手指引 */
            guideShow(){
                let maskCookie = 'justsignMask'+this.curAccount.accId;
                if(null == this.getCookie(maskCookie) && this.curAccount.firstLogin == 1){  //第一次进入
                    $("body").css('overflow','hidden')
                    if(this.userState == 1){   //大B-user  小b-admin
                        this.guideAdmin = true;
                    }else if(this.userState == 2){
                        this.guideUser = true;
                    }else{
                        this.smallGuideAdmin = true;
                    }
                }
            },
            hideGuide(){
                let maskCookie = 'justsignMask'+this.curAccount.accId;
                this.setCookie(maskCookie,'1','d30');
                $("body").css('overflow','auto');
                this.guideUser = this.guideAdmin = false;
            },
            getCookie(name){
                var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
                if(arr=document.cookie.match(reg)){
                    return unescape(arr[2]);
                }else{
                    return null;
                }
            },
            setCookie(name,value,time){
                var strsec = this.getsec(time);
                var exp = new Date();
                exp.setTime(exp.getTime() + strsec*1);
                document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
            },
            getsec(str){
                var str1=str.substring(1,str.length)*1;
                var str2=str.substring(0,1);
                if (str2=="s")
                {
                    return str1*1000;
                }
                else if (str2=="h")
                {
                    return str1*60*60*1000;
                }
                else if (str2=="d")
                {
                    return str1*24*60*60*1000;
                }
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-首页";
            }else{
                document.title="签吧-首页";
            }
            this.$store.dispatch("changeTitle","首页")
            this.signDocCount('202',1);
            this.signDocCount('201',2);
            this.signDocCount('300',4);
            this.indexDraft();
            let Timer = setInterval(()=>{               
                if(this.userState){
                    this.guideShow();
                    this.guide1 = true;
                    clearInterval(Timer);
                    if(this.userState == 1){  //大b管理员
                        this.searchMemberListLight();
                        this.ajaxSearchPartnersListLight();
                    }
                    if(this.userState == 2 || this.userState == 3){   //大Buser，小B管理员
                        this.searchSendList();
                        this.searchCarbonDocList();
                    }
                    
                }
            },300);
        }
    }
</script>
<style scoped lang="scss">
@import '../../assets/css/animate.min.css';
$border:#e6e7ed;
$pink:#ff503f;
$URL:"../../assets/images/";//url路径前缀
/*首页*/
.fitIeTip,.fitIeTip2,.fitIeTip3{
    position: fixed;
    top:0;
    right:0;
    opacity: 0.7;
    z-index: 900;
    width:100%;
    height:100%;
    background: url($URL+"mask_user_index.png") no-repeat top right;
    -webkit-background-size:auto;
    background-size:auto;
}
.fitIeTip2{
    background: url($URL+"mask_admin_index.png") no-repeat top right;
    -webkit-background-size:auto;
    background-size:auto;
}
.fitIeTip3{
    background: rgba(0,0,0,1);
}
.mask-image{
    width: 100%;
    /*width: 1920px;*/
    height: 100%;
    /*height: 917px;*/
    position: fixed;
    top:0;
    left:0;
    opacity: 1;
    z-index: 950;
    .guide-img{
        width: 80%;
        position: absolute;
        left: 50%;
        margin-left: -45%;
        top: 50%;
        margin-top: -25%;
        img{
            width: 100%;
        }
        .again{
            width: 15%;
            height: 10%;
            position: absolute;
            left: 15%;
            bottom: 18%;
            cursor: pointer;
            background:rgba(0,0,0,0.01);
        }
        .start{
            width: 15%;
            height: 10%;
            position: absolute;
            right: 5%;
            bottom: 18%;
            cursor: pointer;
            background:rgba(0,0,0,0.01);
        }
    }
}
.mask-image-btn{
    position: absolute;
    top: 55%;
    left: 50%;
    margin-left:-75px;
    cursor: pointer;

}
.mask-image-btn img{
    width: 150px;
    height: 51px;
}
.mask-image label{
    position: absolute;
    top: 40%;
    left: 0;
    width:100%;
    text-align: center;
    color: #fff;
    font-size: 22px;

}

.index_admin{
    padding: 75px 30px 10px;
    .lookMore{
        a{
            float: right;
            margin-right: 20px;
            color: #4397D7;
        }
    }
}
.index-panel{
    background: #fff;
    margin-bottom:30px;
    .text-right{
        text-align: right;
    }
}
.index-panel .icon{
    color: #fff;
    font-size:18px;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
    margin-right:5px;
}
.index-panel .icon-fa{
    background: #FEC006;
}
.index-panel .icon-shou{
    background: #ff503f;
}
.index-panel h3,.index-panel h4 ,.index-panel p,.index-panel ul,.index-panel li{
    padding:0;
    margin:0;
}
.index-panel h3{
    height:45px;
    font-size:14px;
    line-height:45px;
    padding-left:15px;
    border-bottom:1px #e6e7ed solid;
    font-weight: normal;
    a{
        float: right;
        margin-right: 15px;
        color:#4397D7;
        font-weight: normal;
    }
}
.index-panel h3 span{
    color: #ff503f;
    &.i-fs{
        color: #ff503f;
        padding: .5px 3px;
        border: 1px solid #ff503f;
        border-radius: 3px;
        box-sizing: border-box;
        margin-right: 8px;
    }
}
.index-panel .nav{
    padding:10px 0 15px;
    margin:0;
}
.index-panel .nav li a{
    padding:10px 0;
    color: #757575;
    display: block;
}
.index-panel .nav li i{
    font-size:50px;
    color: #FFA79F;
}
.index-panel .nav li a{
    padding:5px 15px 8px;
}
.index-panel .nav li a:hover span{
    color: #757575;
}
.index-panel .nav li a> div{
    width:50%;
    float: left;
}
.index-panel .txt{
    padding-top:10px;    
}
.index-panel .txt h4{
    font-size:25px;
    font-weight: normal;
    color: #757575;
}
.index-panel .txt span{
    font-size:12px;
    font-weight:normal;
}

.index-panel .index-send,#waitDocList{
    padding:0;
    .no-message{
        padding: 50px 0;
        p{color: rgba(75,75,75,0.5);line-height:35px;}
        a{
                width: 120px;
                height: 40px;
                line-height: 38px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                -ms-border-radius: 4px;
                border-radius: 4px;
                border: 1px #ccc solid;
                color: #4b4b4b;
                display: block;
                margin: 10px auto 0;
        }
    }
}
.index-panel .index-send .list-left li{
    padding:20px 20px;
    border-bottom:1px #e6e7ed solid;
    border-left:4px #fff solid;
    // height:90px;
}

.index-panel .index-send .list-left li:nth-child(3){
    border-bottom:0px;
}
.index-panel .index-send .list-left li:hover,.index-panel .index-send .list-left li.active{
    border-left:4px #ff503f solid;
    background: #fafcff;
}
.index-panel .index-send .list-left h4{
    font-size:14px;
    line-height: 30px;
    color: #4b4b4b;
    font-weight: normal;
}
.index-panel .index-send .list-left p{
    color: #a3a3a3;
    font-size:12px;
}
.index-panel .index-send-right{
    background: #fafcff;
    .sign-list{
            height: 260px;
            ul{
                li{
                    span{
                        display: block;
                        float: left;
                        text-align: center;
                        height: 80px;
                        line-height: 80px;
                        word-break:keep-all;/* 不换行 */
                        white-space:nowrap;/* 不换行 */
                        
                        text-overflow:ellipsis;     
                        color: #989898;               
                        &:nth-child(1){
                            width: 5%;
                            text-align: right;
                            position: relative;
                            left: 5%;
                            font-size: 18px;
                            color:#000;
                            overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                            &.gray{
                                color: #ccc;
                            }
                        }
                        &:nth-child(2){
                            position: relative;
                            width: 35%;                        
                            b.line{
                                position: absolute;
                                top: 0;
                                left: 0;
                                font-size: 0;
                                height: 100%;
                                width: 0;
                                border-left: 1px $border solid;
                                left: 50%;
                                z-index: 0;
                            }
                            .icon-song{
                                background: #fff;
                                width: 20px;
                                height: 20px;
                                border-radius: 100%;
                                -ms-border-radius: 100%;
                                display: block;
                                border-radius: 100%;
                                border: 1px #ff503f solid;
                                line-height: 20px;
                                color: #ff503f;
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%,-50%);
                                -ms-transform: translate(-50%,-50%);
                            }
                            .icon-circle:before{
                                background:#fff;
                                font-size: 20px;
                                position: relative;
                                z-index: 100;
                                border-radius: 100%;
                                -ms-border-radius:100%;
                            }
                            .guoqi{
                                border-radius: 100%;
                                width: 20px;
                                height: 20px;
                                background:#ff503f;
                                color: #fff;
                                font-size:30px;
                                z-index: 1;
                                position: absolute;
                                display: block;
                                left: 50%;
                                top: 50%;
                                line-height: 14px;
                                font-weight: normal;
                                transform: translate(-50%,-50%);
                                -ms-transform: translate(-50%,-50%);
                            }
                            .icon-check-default{
                                color: $pink;
                            }
                            .icon-check-default,.icon-wait,.icon-close,.icon-chexiao{
                                font-size: 20px;
                            }
                            .icon-close::before{
                                border-radius: 100%;
                                background:#fff;
                                border:1px #989898 solid;
                                z-index: 1;
                                position: relative;
                            }
                            .icon-chexiao{
                                color: $pink;
                            }
                            strong{
                                position: absolute;
                                left: 60%;
                                font-weight: normal;
                                color:$pink;
                            }
                            .icon-send-person{
                                font-size: 30px;
                                color: $pink;
                            }
                            i::before{
                                background: #fff;
                                border-radius: 100%;
                                -ms-border-radius:100%;
                                position: relative;
                                z-index: 1;
                            }
                        }
                        &:nth-child(3){
                            width: 35%;
                            text-align: left;
                            color: #4a4a4a;
                            overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                            b{
                                margin-right: 5px;
                            }
                        }
                        &:nth-child(4){
                            width: 15%;
                            color: #4a4a4a;
                            overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                        }
                        // &:nth-child(5){
                        //     width: 19%;
                        //     padding: 0 5%
                        // }
                        .faqiren{
                            font-weight: normal;
                            font-size: 12px;
                            color:#ffbb4d;
                            border: 1px #ffbb4d solid;
                            border-radius: 4px;
                            -ms-border-radius:4px;
                            padding: 1px 5px;
                        }
                    }
                    &:nth-child(1){
                        span{
                            color: #4a4a4a;
                        }
                    }
                    &.wait{
                        span{
                             color: #989898;
                            strong{
                                color: #989898;
                            }
                        }
                    }
                }
            }
        }
}
.index-panel .index-send .list-right{
    height:270px;
    overflow: hidden;
}
.index-panel .index-send .list-right p{
    color: #000;
}
.index-panel .index-send .list-right li{
    padding:0px 15px 0 0;
}
.index-panel #partnersTable{
    width:100% !important;
    background: #fafcff !important;
    padding-left:15px !important;
}
.index-panel #partnersTable td{
    background: #fafcff;
    border-left:5px #fafcff solid;
}
.index-panel #partnersTable td:nth-child(1){
    text-align: right;
    width:20%;
}
.index-panel #partnersTable td:nth-child(2){
    width:20%;
}
.index-panel #partnersTable td:nth-child(3){
    width:15%;
}
.index-panel #partnersTable td:nth-child(4){
    text-align: left;
    width:25%;
}
.index-panel #partnersTable td:nth-child(5){
    text-align: left;
    width:30%;
}
.index-panel .pannel-shou{
    padding:20px 20px;
    border-bottom:1px #e6e7ed solid;
    border-left:4px #fff solid;
    
}
.index-panel .pannel-shou:hover{
    border-left:4px #ff503f solid;
}
.index-panel .pannel-shou h4{
    font-size:14px;
    line-height: 25px;
    font-weight: normal;
    color: #4b4b4b;
}
.index-panel .pannel-shou p{
    color: #a3a3a3;
    font-size:12px;
    line-height: 25px;
}

.index-panel .pannel-btn{
    height: 50px;
    line-height:50px;
    // padding:0 15px;
}
.index-panel .pannel-btn a{
    padding:0;
    width:80px;
    display: block;
    float: right;
    text-align: center;
    height:35px;
    line-height:35px;
    border:1px #e6e7ed solid;
    margin-top:7.5px;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border-radius:3px;
    color: #4a4a4a;
}

.list-right .file-img{
    width:38%;

}
.panel-box .table-five .member {
    li{
        border-left: 0;
        span{
            position: relative;
            i{
                position: absolute;
                height: 45px;
                line-height: 45px;
                overflow-y: hidden;
                left: 0px;
                top: 0;
                img{
                    display: block;
                }
            }
        }
    }
}
</style>
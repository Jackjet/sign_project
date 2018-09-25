<template>
  <div class="partner-page">
      <div class="right_col">
            <div class="search-com">
                <div class="tabNav" style="margin-bottom:10px;" v-if="userState == 1">
                    <label>账户状态</label> 
                    <ul class="clf">
                        <li><a  href="javascript:;" :class="[accStatus == 0 ? 'active':'']" @click="changeAccStatus(0)">不限</a></li>
                        <li><a  href="javascript:;" :class="[accStatus == 2 ? 'active':'']" @click="changeAccStatus(2)">已激活</a></li>
                        <li><a  href="javascript:;" :class="[accStatus == 1 ? 'active':'']" @click="changeAccStatus(1)">未激活</a></li>
                    </ul>
            </div>
                <div class="search">
                    <label>搜索合作伙伴</label>
                    <input type="text" :placeholder="userState == 3 ? '关键字：账号/企业名称':'关键字：账号/企业名称/分组'" v-model.trim="searchTitle" @keyup.enter="searchHandle"><!-- @keyup.enter="searchContacts"-->
                    <span class="search-btn" @click="searchHandle">搜索</span>
                </div>
            </div>
            <TableList v-if="userState == 1"
                :tableClass="'table-eight'"
                :tableLoading="partnersList.tableLoading"
                :total="partnersList.pageTotal"
                :currentpage="partnersList.pageIndex"
                :display="partnersList.pageLength"
                @pagechange="pageChangeHandel"
            >   
                <div slot="panel-header" class="contacts_title">
                    <h3 class="title">
                        合作伙伴    
                        <a class="addPartnerBtn" href="javascript:;" @click="exportTem"><i class="icon-export"></i>&nbsp;导出合作伙伴</a>      
                        <a class="addPartnerBtn" href="javascript:;"  @click="clickImport"><i class="icon-arrow"></i>&nbsp;导入合作伙伴</a>
                        <a class="addPartnerBtn" :href="linkHref+'cus/companyPartners/downloadPartnersTemplate'"><i class="icon-download"></i>&nbsp;下载模板</a>    
                        <a class="addPartnerBtn" href="javascript:;" @click="clickAddPar"><i class="icon-partner"></i>&nbsp;添加合作伙伴</a>            
                    </h3>
                </div>
                <ul slot="panel-content">
                    <li class="title">
                        <span>企业名称</span>
                        <span>账号</span>
                        <span>手机号码</span>
                        <span>所属部门</span>
                        <span>是否激活</span>
                        <span>分组</span>
                        <span>备注</span>
                        <span>操作</span>
                    </li>
                    <li v-for="(item,index) in partnersList.tableList" :key="index" :dataId="item.id">
                        <span :title="item.name?item.name:''">{{item.name?item.name:''}}</span>
                        <span :title="item.accNo?item.accNo:''">{{item.accNo?item.accNo:''}}</span>
                        <span :title="item.mobileNo?item.mobileNo:''">{{item.mobileNo?item.mobileNo:''}}</span>
                        <span :title="item.structureName?item.structureName:''">{{item.structureName?item.structureName:''}}</span>
                        <span>{{ item.accStatus == 1 ? '未激活': item.accStatus == 2 ? '已激活未实名认证':'已激活已实名认证' }}</span>
                        <span>{{item.groupTag ? item.groupTag : ''}}</span>
                        <span :title="item.memo?item.memo:''">{{item.memo?item.memo:''}}</span>
                        <span><a href="javascript:;" @click="clickEdit(item)">编辑</a><a href="javascript:;" @click="delPar.partnerId = item.partnerId;delPar.state = true">删除</a></span>
                    </li>
                </ul>
            </TableList>

            <TableList v-else-if="userState == 2"
                :tableClass="'table-five'"
                :tableLoading="partnersList.tableLoading"
                :total="partnersList.pageTotal"
                :currentpage="partnersList.pageIndex"
                :display="partnersList.pageLength"
                @pagechange="pageChangeHandel"
            >   
                <div slot="panel-header" class="contacts_title">
                    <h3 class="title">
                        合作伙伴                
                    </h3>
                </div>
                <ul slot="panel-content">
                    <li class="title">
                        <span>企业名称</span>
                        <span>账号</span>
                        <span>手机号码</span>
                        <span>分组</span>
                        <span>备注</span>
                    </li>
                    <li v-for="(item,index) in partnersList.tableList" :key="index" :dataId="item.id">
                        <span :title="item.name?item.name:''">{{item.name?item.name:''}}</span>
                        <span :title="item.accNo?item.accNo:''">{{item.accNo?item.accNo:''}}</span>
                        <span :title="item.mobileNo?item.mobileNo:''">{{item.mobileNo?item.mobileNo:''}}</span>
                        <span>{{item.groupTag ? item.groupTag : ''}}</span>
                        <span :title="item.memo?item.memo:''">{{item.memo?item.memo:''}}</span>
                    </li>
                </ul>
            </TableList>

            <TableList v-else
                :tableClass="'table-six'"
                :tableLoading="partnersList.tableLoading"
                :total="partnersList.pageTotal"
                :currentpage="partnersList.pageIndex"
                :display="partnersList.pageLength"
                @pagechange="pageChangeHandel"
            >   
                <div slot="panel-header" class="contacts_title">
                    <h3 class="title">
                        合作伙伴 
                        <a class="addPartnerBtn" href="javascript:;"  @click="clickAddPar"><i class="icon-partner"></i>&nbsp;添加合作伙伴</a>               
                    </h3>
                </div>
                <ul slot="panel-content">
                    <li class="title">
                        <span>企业名称</span>
                        <span>账号</span>
                        <span>手机号码</span>
                        <span>是否激活</span>
                        <span>备注</span>
                        <span>操作</span>
                    </li>
                    <li v-for="(item,index) in partnersList.tableList" :key="index" :dataId="item.id">
                         <span :title="item.name?item.name:''">{{item.name?item.name:''}}</span>
                        <span :title="item.accNo?item.accNo:''">{{item.accNo?item.accNo:''}}</span>
                        <span :title="item.mobileNo?item.mobileNo:''">{{item.mobileNo?item.mobileNo:''}}</span>
                        <span>{{ item.accStatus == 1 ? '未激活': item.accStatus == 2 ? '已激活未实名认证':'已激活已实名认证' }}</span>
                        <span :title="item.memo?item.memo:''">{{item.memo?item.memo:''}}</span>
                        <span><a href="javascript:;" @click="clickEidtSmall(item)">编辑</a><a href="javascript:;" @click="delPar.partnerId = item.partnerId;delPar.state = true">删除</a></span>
                    </li>
                </ul>
            </TableList>

        </div>

        <!--导入合作伙伴弹框-->
        <alertModel :title="'导入合作伙伴'"    v-show="importMem.state" :showState="importMem.state"  @cancelHandle="importMem.state = false" :type="2" @sureHandle="sureImport">
            <div slot="alert-content" class="form importForm">
                <form id="importForms" action="/cus/companyPartners/importPartners" enctype="multipart/form-data" method="post">
                    <p class="clf">
                        <label>合作伙伴导入</label>
                        <span @click="selectTemple" >{{importMem.txt}}
                            <input type="file" id="templateFile" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" >
                        </span>                        
                    </p>
                </form>
            </div>
        </alertModel>

        <!-- 编辑合作伙伴弹框  -->
        <alertModel :title="'编辑合作伙伴'" :sureBtnTxt="editPar.sureBtnTxt"  :alelrtClassWidth="'700px'" :showState="editPar.state" :type="2" v-show="editPar.state"  @cancelHandle="editPar.state = false" @sureHandle="editParHandle">
            <div slot="alert-content" class="addParForm clf">
                <p class="clf">
                    <label for=""><b>*</b>电子邮箱</label>
                    <input type="text" v-model.trim="editPar.email" placeholder="作为登录账号" readonly class="gray" maxlength="64">
                </p>
                <p class="clf">
                    <label for=""><b>*</b>企业名称</label>
                    <input type="text" v-model.trim="editPar.companyName" placeholder="企业名称" v-if="editPar.item && editPar.item.accStatus != 1" class="gray" readonly maxlength="64">  
                    <input type="text" v-model.trim="editPar.companyName" placeholder="企业名称" v-else  maxlength="64">  
                    <i></i>                 
                </p>
                <p class="clf">
                    <label for=""><b>*</b>手机号码</label>
                    <input type="text" v-model.trim="editPar.phone" placeholder="手机号码"  v-if="editPar.item && editPar.item.accStatus != 1" class="gray" readonly>
                    <input type="text" v-model.trim="editPar.phone" placeholder="手机号码"  v-else>
                </p>
                <p class="clf" v-if="userState == 1">
                    <label for="">所属部门</label>
                    <span @click.stop="editPar.addParStatus = true" :class="[addPar.structureTxt.length == 0 ? 'fGray':'']"><i></i>{{addPar.structureTxt.length == 0 ? '点击选择部门' : addPar.structureTxt.join(',')}}</span>
                    
                </p>
                <p class="clf" v-if="userState == 1">
                    <label for="">分组</label>
                    <input type="text" v-model.trim="editPar.groupTag" maxlength="64">
                </p>
                <p class="clf">
                    <label for="">备注</label>
                    <input type="text" v-model.trim="editPar.memo" maxlength="256">
                </p>
                <div class="select-input" :id="cloudyState ? '':'select-input2'" :class="[cloudyState ? 'sign_page_scrollBody':'']" v-show="editPar.addParStatus" @click.stop="stopHandle">
                    <Tree @selectSpanCheckBox="selectSpanCheckBoxHandleEdit"   :treeListData="treeListDataEidt" :type="'sector'"></Tree>
                </div> 
            </div>
        </alertModel>

        <!-- 添加合作伙伴弹框  -->
        <alertModel :title="'添加合作伙伴'" :sureBtnTxt="addPar.sureBtnTxt"  :alelrtClassWidth="'700px'"  :type="2" v-show="addPar.state"  @cancelHandle="addPar.state = false" @sureHandle="addParHandle">
            <div slot="alert-content" class="addParForm clf">
                <p class="clf">
                    <label for=""><b>*</b>电子邮箱</label>
                    <input type="text" v-model.trim="addPar.email" placeholder="作为登录账号" @blur="checkPartner" maxlength="64">
                    <div style="color:#ff503f;">{{addPar.tip}}</div>
                </p>
                <p class="clf">
                    <label for=""><b>*</b>企业名称</label>
                    <input type="text" v-model.trim="addPar.companyName" placeholder="企业名称" v-if="!addPar.exit" maxlength="64">  
                    <input type="text" v-model.trim="addPar.companyName" placeholder="企业名称" v-if="addPar.exit" class="gray" readonly maxlength="64">  
                    <i></i>                 
                </p>
                <p class="clf">
                    <label for=""><b>*</b>手机号码</label>
                    <input type="text" v-model.trim="addPar.phone" placeholder="手机号码" v-if="!addPar.exit">
                    <input type="text" v-model.trim="addPar.phone" placeholder="手机号码" v-if="addPar.exit" class="gray" readonly>
                </p>
                <p class="clf" v-if="userState == 1">
                    <label for="">所属部门</label>
                    <span @click.stop="addPar.addParStatus = true" :class="[addPar.structureTxt.length == 0 ? 'fGray':'']"><i></i>{{addPar.structureTxt.length == 0 ? '点击选择部门' : addPar.structureTxt.join(',')}}</span>
                </p>
                <p class="clf" v-if="userState == 1">
                    <label for="">分组</label>
                    <input type="text" v-model.trim="addPar.groupTag" maxlength="64">
                </p>
                <p class="clf">
                    <label for="">备注</label>
                    <input type="text" v-model.trim="addPar.memo" maxlength="256">
                </p>
                <div class="select-input" :id="cloudyState ? '' :'select-input'" :class="[cloudyState ? 'sign_page_scrollBody':'']" v-show="addPar.addParStatus" @click.stop="stopHandle">
                    <Tree @selectSpanCheckBox="selectSpanCheckBoxHandle"   :treeListData="treeListDataAdd" :type="'sector'"></Tree>
                </div> 
            </div>
        </alertModel>
        <!--删除合作伙伴-->
        <alertModel :title="'删除合作伙伴'" :context="'确认删除此合作伙伴？'" :type="2" :showState="delPar.state" v-show="delPar.state"  @cancelHandle="delPar.state = false" @sureHandle="sureDelPar">
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title"  :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showHtml="true"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
        </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import '@/assets/js/plugin/jquery.form.js';
    export default{
        data(){
            return{
                delPar:{
                    state:false,
                    partnerId:null,
                },
                importMem:{
                    state:false,
                    txt:'点击选择',
                    downTxt:'5666++'
                },
                treeListDataAdd:[],  //添加成员弹框tree数据
                treeListDataEidt:[], //编辑成员弹框tree数据
                addPar:{
                    state:false,
                    email:'',        //邮箱
                    companyName:'',  //企业名称
                    phone:'',        //手机号码
                    groupTag:'',     //分组
                    memo:'',         //备注
                    sureBtnTxt:'确定',
                    addParStatus:false,   //选择所属部门弹框状态
                    structureId:[],       //所属部门id
                    structureTxt:[],    
                    tip:'',      
                    exit:false,          
                },
                editPar:{            //编辑
                    state:false,
                    email:'',        //邮箱
                    companyName:'',  //企业名称
                    phone:'',        //手机号码
                    groupTag:'',     //分组
                    memo:'',         //备注
                    sureBtnTxt:'确定',
                    addParStatus:false,   //选择所属部门弹框状态
                    structureId:[],       //所属部门id
                    structureTxt:[], 
                    item:null,                   
                },
                searchTitle:'',           //搜索title
                accStatus:0,             //是否激活的状态 ''-不限   0-未激活   1-激活
                partnersList:{            //合作伙伴列表数据
                    tableLoading:false,
                    tableList:[],
                    title:'',
                    pageTotal:null,
                    pageIndex:1,
                    pageLength:10,
                },
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                },
                
            }
        },
        computed:{
            ...mapGetters([
                'userState',
            ])
        },
        methods:{        
            limit64(){

            }, 
            sureDelPar(){    //确认删除合作伙伴
                let requestUrl = this.userState == 1 ? this.URL.delCompanyPartners : this.URL.delOrdinaryPartners;
                this.httpPost(requestUrl,{
                    partnerId:this.delPar.partnerId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.delPar.state = false;
                        this.searchPartnerList();
                    }
                })
            },
            checkPartner(){  //核对成员有无存在
                let requestUrl = this.userState == 1 ? this.URL.checkPartners : this.URL.checkPartnerSmall;
                this.httpGet(requestUrl,{
                    accNo:this.addPar.email
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.addPar.tip = "";
                        this.addPar.companyName = result.data.companyName;
                        this.addPar.phone = result.data.mobileNo;   
                        this.addPar.exit = true;
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'Exist'){
                                this.addPar.tip = "合作伙伴已经存在。";
                        }else if(msg == 'Myself'){
                                this.addPar.tip = "不能添加己方单位作为合作伙伴";
                        }else if(msg == 'Admin'){
                            this.addPar.tip = "不能添加管理员作为合作伙伴。";
                        }else{ //(not)
                            this.addPar.tip = '';
                        }
                    }
                              
                })
            },
            clickEdit(item){  //点击编辑
                this.editPar.item = item;
                this.editPar.state = true;
                [this.addPar.structureId,this.addPar.structureTxt] = [[],[]];
                this.httpGet(this.URL.getCompanyPartners,{
                    partnerId:item.partnerId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        let data = result.data;
                        [this.editPar.email,this.editPar.companyName,this.editPar.phone,this.editPar.groupTag,this.editPar.memo] = [data.email,data.displayName,data.mobileNo,data.groupTag,data.memo]
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })

                this.httpGet(this.URL.ajaxSearchStructureIdList,{
                    partnerId:item.partnerId
                },(response)=>{
                    let result = response.data;
                    this.addPar.structureId = result.split('|');
                    this.ajaxGetTreeEdit();
                })
            },
            clickEidtSmall(item){
                this.editPar.item = item;
                this.editPar.state = true;
                [this.addPar.structureId,this.addPar.structureTxt] = [[],[]];
                this.httpGet(this.URL.getOrdinaryPartners,{
                    partnerId:item.partnerId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        let data = result.data;
                        [this.editPar.email,this.editPar.companyName,this.editPar.phone,this.editPar.memo] = [data.email,data.displayName,data.mobileNo,data.memo]
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            exportTem(){
                let accStatus = null;
                if(this.accStatus == 2){  //已激活
                    accStatus = 1;
                }else if(this.accStatus == 1){  //未激活
                    accStatus = 0;
                }else{
                    accStatus = '';
                }
			    window.location.href=this.linkHref + this.URL.exportPartnersExcel+"?condition="+this.searchTitle+"&accStatus="+accStatus;
            },
            clickImport(){  //点击导入新成员按钮
                this.importMem.state = true; 
                this.importMem.txt = '点击上传';
                $("#templateFile").val('');
            },
            selectTemple(){  //点击导入新成员
                let This = this;
                $("#templateFile").val('');
                $("#templateFile").unbind().change(function(){
                    let Name = $(this).val().split('\\');
                    This.importMem.txt = Name[Name.length-1];
                })
            },
            sureImport(){   //确认导入
                let This = this;
                if($("#templateFile").val() == ''){
                    // this.alertCommonTip("请上传文件");
                    this.modelCommonTip('请上传文件')
                    return false;
                }
                $("#importForms").ajaxSubmit({
                    url:This.apiPath + This.URL.importPartners,//默认是form action
                    success:function(data){                        
                        let msg = eval('(' + data + ')');
                        if(msg.code=="success"){
                            This.importMem.state = false;
                            
                            if(null != msg.failCount && 0 < msg.failCount){                                
                                This.alertCommonTip("有"+msg.successCount+"条记录上传成功。有"+msg.failCount+"条记录上传失败。<br/><a href="+This.linkHref+"cus/companyPartners/downloadPartnersNotImport><font color=red>下载导入记录</font></a>");
                            }else{
                                This.alertCommonTip("有"+msg.successCount+"条记录上传成功。有"+msg.failCount+"条记录上传失败。")
                            }                          
                            var obj = document.getElementById("importForms") ;
                            obj.reset();          
                            This.partnersList.pageIndex = 1;
                            This.searchPartnerList();
                            This.Event2.$emit('tip2',1);
                            return;
                        }else if(msg.code=="notFile"){               //未上传文件
                            This.alertCommonTip(msg.result);
                        }else if(msg.code=="fileFormatError"){       //文件格式不对
                            This.alertCommonTip(msg.result);
                        }else if(msg.code=="repeatedlyProcesses"){   //当前企业正在导入合作伙伴，请勿重复操作
                            This.alertCommonTip(msg.result);
                        }else if(msg.code == 'fileTooLong'){         //导入条数太长
                            This.alertCommonTip(msg.result);
                        }else if(msg.code=="failure"){               //执行失败
                            This.alertCommonTip(msg.result);       
                            return;
                        }else{
                            This.alertCommonTip("处理异常，请联系管理员。")
                        }
                    }
                });
            },
            clickAddPar(){  //点击添加合作伙伴
                this.addPar.state = true;
                this.addPar.exit = false;
                this.addPar.tip = '';
                [this.addPar.email,this.addPar.companyName,this.addPar.phone,this.addPar.groupTag,this.addPar.memo,this.addPar.structureId,this.addPar.structureTxt] = ['','','','','',[],[]]
            },
            stopHandle(){}, //tree组件点击组织冒泡
            ajaxGetTreeAdd(){  //获取添加成员弹框组织架构                
                this.httpPost(this.URL.ajaxGetTree,{
                    // isWithCount:1
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.treeListDataAdd = result.data;
                        $("#select-input").mCustomScrollbar({
                            theme:"minimal"
                        });
                    }else{
                        this.alertCommonTip(this.meta.message)
                    }
                    
                })
            },
            ajaxGetTreeEdit(){  //获取编辑合作伙伴弹框组织架构                
                this.httpPost(this.URL.ajaxGetTree,{
                    // isWithCount:1
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.treeListDataEidt = result.data;
                        $("#select-input2").mCustomScrollbar({
                            theme:"minimal"
                        });
                        this.initTree();
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                   
                })
            },
            initTree(){   //初始化编辑成员框数据
                this.treeListDataEidt.forEach((itemFirst,index1)=>{
                    this.forStructureId(itemFirst)
                    itemFirst.children.forEach((itemSecond,index2)=>{
                        this.forStructureId(itemSecond)
                        itemSecond.children.forEach((itemThree,index3)=>{
                            this.forStructureId(itemThree)
                            itemThree.children.forEach((itemFour,index4)=>{
                                this.forStructureId(itemFour)
                                itemFour.children.forEach((itemFive,index5)=>{
                                    this.forStructureId(itemFive)
                                })
                            })
                        })
                    })
                })
            },
            forStructureId(item){  //初始化组织架构选中
                for(let i = 0 ; i < this.addPar.structureId.length ; i++){
                    if(item.id == this.addPar.structureId[i]){
                        item.checked = true;
                        this.addPar.structureTxt.push(item.text);
                    }
                }
            },
            selectSpanCheckBoxHandle(item){  //组织架构筛选
                let arr = [item]
                if(!item.checked){
                    item.checked = true;
                    this.forArrHandle(arr,true);
                }else{
                    item.checked = false;
                    this.forArrHandle(arr,false)
                }     
            },
            selectSpanCheckBoxHandleEdit(item){  //编辑成员组织架构筛选
                let arr = [item]
                if(!item.checked){
                    item.checked = true;
                    this.forArrHandle(arr,true);
                }else{
                    item.checked = false;
                    this.forArrHandle(arr,false)
                }
            },
            forArrHandle(arr,state){  //for循环函数
                let structureIds = [];
                let structureTxts = [];
                arr.forEach((itemFirst,index1)=>{
                    itemFirst.checked = state;
                    structureIds.push(itemFirst.id);
                    structureTxts.push(itemFirst.text);
                    itemFirst.children.forEach((itemSecond,index2)=>{
                        itemSecond.checked = state;
                        structureIds.push(itemSecond.id);
                        structureTxts.push(itemSecond.text);
                        itemSecond.children.forEach((itemThree,index3)=>{
                            itemThree.checked = state;
                            structureIds.push(itemThree.id);
                            structureTxts.push(itemThree.text);
                            itemThree.children.forEach((itemFour,index4)=>{
                                itemFour.checked = state;
                                structureIds.push(itemFour.id);
                                structureTxts.push(itemFour.text);
                                itemFour.children.forEach((itemFive,index5)=>{
                                    itemFive.checked = state;
                                    structureIds.push(itemFive.id);
                                    structureTxts.push(itemFive.text);
                                })
                            })
                        })
                    })
                })               
                if(state){ 
                    for(let i = 0; i < structureIds.length; i++){
                        this.addPar.structureId.push(structureIds[i]);
                        this.addPar.structureId = this.unique1(this.addPar.structureId);
                    }
                    for(let i = 0; i < structureTxts.length; i++){
                        this.addPar.structureTxt.push(structureTxts[i]);
                        this.addPar.structureTxt = this.unique1(this.addPar.structureTxt);
                    }
                }else{
                    if(structureIds.length == 0) return;
                    for(let i = 0 ; i < structureIds.length; i++){
                        if(structureIds.length !== 0) {
                            for(let j = 0 ; j < this.addPar.structureId.length ; j++){
                                if(this.addPar.structureId[j] == structureIds[i]){
                                    this.addPar.structureId.splice(j,1);
                                }
                            }
                        }                        
                    }
                    for(let i = 0 ; i < structureTxts.length; i++){
                        if(structureTxts.length == 0) return;
                        for(let j = 0 ; j < this.addPar.structureTxt.length ; j++){
                            if(structureTxts[i] == this.addPar.structureTxt[j]){
                                this.addPar.structureTxt.splice(j,1);
                            }
                        }
                    }
                }
            },
            beforeAddPar(item){   //添加合作伙伴之前的验证
                if(this.validateQb.isEmpty(item.email)){
                    this.modelCommonTip('邮箱不能为空');
                    return false;
                }
                if(!this.validateQb.isEmail(item.email)){
                    this.modelCommonTip('邮箱格式不正确');
                    return false;
                }
                if(this.validateQb.isEmpty(item.companyName)){
                    this.modelCommonTip('企业名称不能为空');
                    return false;
                }
                if(this.validateQb.isEmpty(item.phone)){
                    this.modelCommonTip('手机号码不能为空');
                    return false;
                }
                if(!this.validateQb.isPhone(item.phone)){
                    this.modelCommonTip('手机号码格式不正确');
                    return false;
                }
                if(this.addPar.structureId.length == 0 && this.userState == 1){
                    this.modelCommonTip('所属部门不能为空');
                    return false;
                }
                return true;
            },
            addParHandle(){  //确认添加合作伙伴     
                if(!this.beforeAddPar(this.addPar)) return;
                this.addPar.sureBtnTxt = '提交中...';
                let requestUrl = this.userState == 1 ? this.URL.addCompanyPartners : this.URL.addOrdinaryPartners;
                let data = null;
                if(this.userState == 1){  //大B
                    data = {
                        accNo: this.addPar.email,
                        displayName:this.addPar.companyName,
                        mobileNo:this.addPar.phone,
                        structureId:this.addPar.structureId.join(','),
                        groupTag:this.addPar.groupTag,
                        memo:this.addPar.memo
                    }  
                    this.httpPost(requestUrl,data,(response)=>{
                        this.addPar.sureBtnTxt = '确定';
                        let result = response.data;
                        if(result.meta.success){
                            this.addPar.state = false;
                            this.partnersList.pageIndex = 1;
                            this.Event2.$emit("tip2",1);
                            this.searchPartnerList();
                        }else{
                            let msg = result.meta.message;
                            if(msg == 'Myself'){
                                this.alertCommonTip("不能添加己方单位作为合作伙伴");
                            }else if(msg == 'Admin'){
                                this.alertCommonTip("不能添加管理员作为合作伙伴");
                            }else if(msg  == 'Exist'){
                                this.alertCommonTip("合作伙伴已经存在");
                            }else if(msg == 'deleted.user'){
                                this.alertCommonTip('该用户已被停用');
                            }else{
                                this.alertCommonTip(msg);
                            }
                        }
                    })
                }else{   //小B
                    data = {
                        'account.displayName':this.addPar.companyName,
                        'account.accNo':this.addPar.email,
                        'account.mobileNo':this.addPar.phone,
                        'groupTag':this.addPar.groupTag,
                        'memo':this.addPar.memo
                    }
                    this.httpGet(requestUrl,data,(response)=>{
                        this.addPar.sureBtnTxt = '确定';
                        let result = response.data;
                        if(result.meta.success){
                            this.addPar.state = false;
                            this.partnersList.pageIndex = 1;
                            this.Event2.$emit("tip2",1);
                            this.searchPartnerList();
                        }else{
                            let msg = result.meta.message;
                            if(msg == 'Myself.Company.Partners'){
                                this.alertCommonTip("不能添加己方单位作为合作伙伴。");
                            }else if(msg == 'Company.Partners.Admin'){
                                this.alertCommonTip("不能添加管理员作为合作伙伴");
                            }else if(msg  == 'Exist.Company.Partners'){
                                this.alertCommonTip("合作伙伴已经存在");
                            }else if(msg == 'no.login'){
                                this.alertCommonTip("登录已过期");
                            }else if(msg == 'no.permission'){
                                this.alertCommonTip("没有权限");
                            }else if(msg == 'deleted.user'){
                                this.alertCommonTip('该用户已被停用');
                            }else{
                                this.alertCommonTip(msg);
                            }
                        }
                    })
                }
                
            },
            editParHandle(){ //确认编辑合作伙伴
                if(!this.beforeAddPar(this.editPar)) return;
                this.editPar.sureBtnTxt = '提交中...';
                let requestUrl = this.userState == 1 ? this.URL.editCompanyPartnersById : this.URL.editOrdinaryPartnersById;
                let data = null;
                if(this.userState == 1){
                    data = {
                        partnerId:this.editPar.item.partnerId,
                        accNo: this.editPar.email,
                        displayName:this.editPar.companyName,
                        mobileNo:this.editPar.phone,
                        structureId:this.addPar.structureId.join(','),
                        groupTag:this.editPar.groupTag,
                        memo:this.editPar.memo
                    }   
                }else{
                    data = {
                        partnerId:this.editPar.item.partnerId,
                        accNo: this.editPar.email,
                        displayName:this.editPar.companyName,
                        mobileNo:this.editPar.phone,
                        memo:this.editPar.memo
                    }
                }
                this.httpPost(requestUrl,data,(response)=>{
                    this.editPar.sureBtnTxt = '确定';
                    let result = response.data;
                    if(result.meta.success){
                        this.editPar.state = false;
                        this.searchPartnerList();
                    }else{
                        this.alertCommonTip("修改失败");
                    }
                })
            },
            searchHandle(){  //搜索
                this.partnersList.pageIndex = 1;
                this.searchPartnerList();
                this.Event2.$emit('tip2',1);
            },
            changeAccStatus(num){//改变账户状态
                this.accStatus = num;
                this.searchPartnerList();
            },
            searchPartnerList(){   //获取合作伙伴列表
                let parUrl = '';
                let data = {};
                if(this.userState == 1 || this.userState == 0){
                    parUrl = this.URL.ajaxLight;
                    data = {
                        accStatus:this.accStatus,
                        condition:this.searchTitle,
                        page:this.partnersList.pageIndex,
                        pageSize:this.partnersList.pageLength
                    }
                }else if(this.userState == 2){
                    parUrl = this.URL.BigUserSearchParList;
                    data = {
                        // accStatus:this.accStatus,
                        condition:this.searchTitle,
                        page:this.partnersList.pageIndex,
                        pageSize:this.partnersList.pageLength
                    }
                }else{
                    parUrl = this.URL.searchParList;
                    data = {
                        // accStatus:this.accStatus,
                        condition:this.searchTitle,
                        page:this.partnersList.pageIndex,
                        pageSize:this.partnersList.pageLength
                    }
                }
                this.partnersList.tableLoading = true;
                this.httpGet(parUrl,data,(response)=>{
                    this.partnersList.tableLoading = false;
                    let result = response.data;
                    if(result.meta.success){
                        this.partnersList.tableList = result.data.list;
                        this.partnersList.pageTotal = result.data.totalCount;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },            
            pageChangeHandel(val){
                this.partnersList.pageIndex = val;
                this.searchPartnerList();
            },
            init(){
                $(document).on('click',()=>{
                    if(this.addPar.addParStatus){                        
                        this.addPar.addParStatus = false;
                    }
                    if(this.editPar.addParStatus){                        
                        this.editPar.addParStatus = false;
                    }
                })
            }   
        },
        mounted(){
            this.init();  
            if(this.cloudyState){
                document.title="云合同-合作伙伴";
            }else{
                document.title="签吧-合作伙伴";
            }
            this.$store.dispatch("changeTitle",'通讯录 > 合作伙伴');
            let Timer = setInterval(()=>{
                if(this.userState != null){
                    clearInterval(Timer);
                    this.searchPartnerList();
                    if(this.userState == 1){
                        this.ajaxGetTreeAdd();
                    }
                }
            },300)
        }
    }
</script>
<style lang="scss" scoped>
</style>


<template>
    <div class="organization">
        <div class="right_col">          
            <div class="side_left">
                <p class="title">组织架构列表<i  v-if="userState == 1" class="icon-add-folders-kong" :class="[addDep.hover ? 'active' : '']" @click="addDep.state = true ; addDep.name = ''" @mouseenter="addDep.hover = true" @mouseout="addDep.hover = false"></i></p> 
                <div class="loadSource" v-show="ajaxGetTreeLoading" :class="[cloudyState?'loadSource_c':'']">
                    <p v-if="!cloudyState"><img src="../../assets/images/loading.gif" alt="" width="80" height="51"></p>
                    <p v-if="cloudyState"><img src="../../assets/images/logo_small.png" alt="" width="48" height="48"></p>
                </div>
                <div class="tree-contain">
                    <div class="side_left_tree" :id="cloudyState ? '' :'side_left_tree'" :class="[cloudyState ? 'sign_page_scrollBody':'']" >
                        <Tree @selectTreeItem="selectTreeItemHandle" :showHandle="userState == 1 ? true : false" :treeListData="treeListData" :type="'organization'" @editDepartant="editDepartant" @delDepartant="delDepartant"></Tree>
                            
                    </div>    
                    <div class="disableUser" @click="disableHandle" v-if="userState == 1">
                        <span title="已停用联系人" :class="[deleteFlag == 1 ? 'on':'']"><b class="folderNo"></b>
                            已停用联系人{{'('+disableNum+')'}}
                        </span>
                    </div>
                </div>          
            </div>
            <div class="side_right">                
                <div class="search-com" style="margin-bottom:20px;">
                    <div class="search">
                        <label>搜索成员</label>
                        <input type="text" placeholder="关键字：账号/姓名" v-model.trim="organizaList.condition" @keyup.enter="searchHandle"><!-- @keyup.enter="searchContacts"-->
                        <span class="search-btn" @click="searchHandle">搜索</span>
                    </div>
                </div>
                <TableList
                :tableTitle="tableTitle"
                :tableClass="'table-five'"
                :tableLoading="organizaList.tableLoading"
                :total="organizaList.pageTotal"
                :pageIndex="organizaList.pageIndex"
                :pageLength="organizaList.pageLength"
                :pageNumberState="false"
                @pagechange="pageChangeHandel"
                >
                <h3 slot="panel-header" class="organizationHeader">
                    {{tableTitle}}
                    <div class="btnbox" v-if="userState == 1 && deleteFlag == 0">
                        
                        <a href="javascript:;" @click="clickImport">
                            <i class="icon-arrow"></i>导入新成员
                        </a>
                        <a href="/cus/companyMember/downloadMembersTemplate">
                            <i class="icon-download"></i>下载模板
                        </a>
                        <a href="javascript:;" @click="addMemClick">
                            <i class="icon-add-user"></i>添加新成员
                        </a>                        
                    </div>
                </h3>
                <ul slot="panel-content" class="organizationList">
                    <li class="title">
                        <span><b :class="[(userState == 2 || deleteFlag == 1) ? 'hideIcon' : '',select.all ? 'icon-check2-default':'icon-square']" @click="selectAllHandle"></b>姓名</span>
                        <span>邮箱（账号）</span>                      
                        <span>部门</span>
                         <span>是否激活</span>
                         <span v-if="userState == 1">操作</span>
                         <span v-if="userState == 2">备注</span>
                     </li>
                    <li v-for="(item,index)  in organizaList.tableList" :key="index" @click.stop="showClick(item,index)">                        
                        <span :title="item.name?item.name:''"><b @click.stop="selectItemHandle(item)" :class="[(userState == 2 || deleteFlag == 1)? 'hideIcon' : '',item.selectVal ? 'icon-check2-default':'icon-square']"></b>{{item.name?item.name:''}}</span>
                        <span :title="item.accNo?item.accNo:''">{{item.accNo?item.accNo:''}}</span>
                        <span :title="item.structureName?item.structureName:''">{{item.structureName?item.structureName:''}}</span>
                        <span v-if="item.isActivated == 1 ">已激活</span>
                        <span class="jihuo" v-if="item.isActivated == 0 && userState == 1 &&　deleteFlag　== 0" ><a   @click.stop="reActivateByMail(item)" href="javascript:;" :title="'点击发送激活邮件'" style="border:0;padding:0;margin:0;">未激活</a></span>
                        <span class="jihuo" v-if="item.isActivated == 0 && userState == 1 &&　deleteFlag　== 1" style="color:#4b4b4b">未激活</span>
                        <span v-if="item.isActivated == 0 && userState == 2">未激活</span>
                        <span v-if="userState == 1 && deleteFlag == 0">
                            <a href="javascript:;" @click.stop="editClick(item,index)">编辑</a>
                            <a href="javascript:;" @click.stop="select.index = index;del.state = true">停用</a>
                        </span>
                        <span v-if="userState == 1 && deleteFlag == 1">
                            <a href="javascript:;" @click.stop="sureEnable.memId = item.memId ; sureEnable.index = index ; sureEnable.state = true;">启用</a>
                        </span>
                        <span v-if="userState == 2">{{item.memo}}</span>
                        <img  v-if="item.isRole == 1" class="role" src="../../assets/images/zhuguan.png" alt="">
                    </li>
                    <li v-show="organizaList.pageTotal > 0">
                        <div class="pageNumber" style="border-top:0;border-bottom:0px;">
                            <a href="javascript:;" class="cancellation" :class="[select.list.length > 0 ? 'active' : '']" @click="zhuxiaoHandle" v-if="userState == 1 && deleteFlag == 0">停用</a>
                            <a href="javascript:;" class="setRole" @click="setMemberRole" :class="[select.list.length > 0 ? 'active' : '']" v-if="userState == 1 && deleteFlag == 0">设为主管</a>  
                            <span :title="organizaList.pageTotal+'条记录/当前页为第'+organizaList.pageIndex+'页'">{{organizaList.pageTotal}}条记录/当前页为第{{organizaList.pageIndex}}页</span>
                            <div class="page-box">
                                <pagination :total="organizaList.pageTotal" :currentpage="organizaList.pageIndex" :display="organizaList.pageLength"  @pagechange="pageChangeHandel" ></pagination>
                            </div>
                        </div> 
                    </li>  
    
                </ul>
                </TableList>
          </div>
        </div>
        <!-- 启用成员弹框 -->
        <alertModel :title="'启用成员'" :sureBtnTxt="enable.sureBtnTxt"  :alelrtClassWidth="'700px'" :showState="enable.state" :type="2" v-show="enable.state"  @cancelHandle="enable.state = false" @sureHandle="enableMemberMore">
            <div slot="alert-content" class="clf editMember enableMember">
                <p class="clf enable-p">
                    <label for=""><b>*</b>部门</label>
                    <input type="text" v-model.trim="enable.department" readonly  @click.stop="enable.editDepStatus = true;">  
                    <i></i>                 
                </p>
                <div class="select-input" :id="cloudyState ? '' :'select-input3'" v-show="enable.editDepStatus" :class="[cloudyState ? 'sign_page_scrollBody':'']">
                    <Tree @selectTreeItem="selectTreeItemHandleEnable" :showNum="false"  :treeListData="treeListData" :type="'organization'"></Tree>
                </div> 
            </div>
        </alertModel>
        <!-- 删除存在合作伙伴的部门弹框提示 -->
        <alertModel :title="'警告'" :context="'此部门存在合作伙伴<br/>删除此部门将会把此部门下的合作伙伴移到根部门'"  :showHtml="true" :sureBtnTxt="partnerExit.sureBtnTxt"  :type="2" v-show="partnerExit.state"  @cancelHandle="partnerExit.state = false" @sureHandle="partnerExitHandle">
        
        </alertModel>

        <!--确定启用弹框-->
        <alertModel :title="'提示框'" :context="'确定启用此用户？'" :type="2"   v-show="sureEnable.state"  @cancelHandle="sureEnable.state = false"  @sureHandle="enableHandle">
        </alertModel>

        <!--导入成员弹框-->
        <alertModel :title="'导入新成员'"    v-show="importMem.state"  @cancelHandle="importMem.state = false" :type="2" @sureHandle="sureImport">
            <div slot="alert-content" class="form importForm">
                <form id="importForms" action="/cus/companuMember/importMembers" enctype="multipart/form-data" method="post">
                    <p class="clf">
                        <label>新成员导入</label>
                        <span @click="selectTemple" >{{importMem.txt}}
                            <input type="file" id="templateFile" name="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" >
                        </span>                        
                    </p>
                </form>
            </div>
        </alertModel>
        <!-- 添加成员弹框  -->
        <alertModel :title="'添加成员'" :sureBtnTxt="addMem.sureBtnTxt" class="editMemberAlert"  :sweet="true" :alelrtClassWidth="'700px'" :showState="addMem.state" :type="2" v-show="addMem.state"  @cancelHandle="addMem.state = false" @sureHandle="addMemMemHandle">
            <div slot="alert-content" class="editMember clf">
                <p class="clf">
                    <label for=""><b>*</b>邮箱</label>
                    <input type="text" v-model.trim="addMem.email" maxlength="64">
                </p>
                <p class="clf">
                    <label for=""><b>*</b>部门</label>
                    <input type="text" v-model.trim="addMem.department" readonly class="gray" >               
                </p>
                <p class="clf">
                    <label for=""><b>*</b>姓名</label>
                    <input type="text" v-model.trim="addMem.name" maxlength="64">
                </p>
                <p class="clf">
                    <label for="">职位</label>
                    <input type="text" v-model.trim="addMem.job"  maxlength="32">
                </p>
                <p class="clf">
                    <label for=""><b>*</b>手机</label>
                    <input type="text" v-model.trim="addMem.phone">
                </p>
                <p class="clf">
                    <label for="">备注</label>
                    <input type="text" v-model.trim="addMem.memo"  maxlength="256">
                </p>
                <p class="clf">
                    <label for="">设为主管</label>
                    <span class="icon-check2-default" :class="addMem.role == 1 ? 'active' : ''" @click="addMem.role = addMem.role == 1 ? 0 : 1 "></span>
                </p>
                <p class="clf">
                    <label for="">实名认证</label>
                    <span class="icon-check2-default" :class="addMem.real == 1 ? 'active' : ''" @click="addMem.real = addMem.real == 1 ? 0 : 1 "></span>
                </p>
                <div class="real" v-show="addMem.real == 1">
                    <form id="realBox" method="post" enctype="multipart/form-data">
                        <div class="certimg">
                            <a href="javascript:;" class="font" @click="uploadImgChange('frontImg','frontFile')">
                                <div class="imgBg">
                                    <img src="../../assets/images/sfz_front.png" alt="">
                                </div>                            
                                <p>点击上传身份证人像面</p>
                                <div class="frontImg" >
                                    <img src="../../assets/images/transparent.png" id="frontImg"/>
                                </div>
                                <input type="file" id="frontFile" name="idcard_file_f">
                            </a>    
                        </div>
                        <div class="certimg">
                            <a href="javascript:;" class="back" @click="uploadImgChange('backImg','backFile')">
                                <div class="imgBg">
                                    <img src="../../assets/images/sfz_back.png" alt="">
                                </div>
                                <p>点击上传身份证国徽面</p>
                                <div class="backImg">
                                    <img src="../../assets/images/transparent.png" id="backImg"/>
                                </div>
                                <input type="file" id="backFile" name="idcard_file_b">
                            </a>     
                        </div>
                    </form>
                    <div class="clf tipBox">
                        <p class="frontTip"></p>
                        <p class="backTip"></p>
                        <p class="allTip" style="width:100%;"></p>
                    </div>
                    <p class="clf">
                        <label for=""><b>*</b>真实姓名</label>
                        <input type="text" v-model.trim="addMem.idCardName">
                    </p>
                    <p class="clf">
                        <label for=""><b>*</b>身份证号</label>
                        <input type="text" v-model.trim="addMem.idCardNo">
                    </p>
                </div>
            </div>
        </alertModel>
        <!-- 编辑成员弹框  -->
        <alertModel :title="'编辑成员'" :sureBtnTxt="editMem.sureBtnTxt"  :alelrtClassWidth="'700px'" :showState="editMem.state" :type="2" v-show="editMem.state"  @cancelHandle="editMem.state = false" @sureHandle="editMemHandle">
            <div slot="alert-content" class="editMember clf">
                <p class="clf">
                    <label for=""><b>*</b>邮箱</label>
                    <input type="text" v-model.trim="editMem.email" readonly class="gray"  maxlength="64">
                </p>
                <p class="clf">
                    <label for=""><b>*</b>部门</label>
                    <input type="text"   v-model.trim="editMem.department" readonly  @click.stop="editMem.editDepStatus = true;">  
                    <i></i>                 
                </p>
                <p class="clf">
                    <label for=""><b>*</b>姓名</label>
                    <input type="text" v-model.trim="editMem.name" v-if="editMem.isActive == 0"  maxlength="64">
                    <input type="text" v-model.trim="editMem.name" v-if="editMem.isActive != 0" class="gray" readonly  maxlength="64">
                </p>
                <p class="clf">
                    <label for="">职位</label>
                    <input type="text" v-model.trim="editMem.job"  maxlength="32">
                </p>
                <p class="clf">
                    <label for=""><b>*</b>手机</label>
                    <input type="text" v-model.trim="editMem.phone" v-if="editMem.isActive == 0">
                    <input type="text" v-model.trim="editMem.phone" v-if="editMem.isActive != 0" class="gray" readonly>
                </p>
                <p class="clf">
                    <label for="">备注</label>
                    <input type="text" v-model.trim="editMem.memo"  maxlength="256">
                </p>
                <p class="clf">
                    <label for="">设为主管</label>
                    <span class="icon-check2-default" :class="editMem.role == 1 ? 'active' : ''" @click="editMem.role = editMem.role == 1 ? 0 : 1 "></span>
                </p>
                <div class="select-input" :id="cloudyState ? '' : 'select-input'" v-show="editMem.editDepStatus" :class="[cloudyState ? 'sign_page_scrollBody':'']">
                    <Tree @selectTreeItem="selectTreeItemHandleEdit" :showNum="false"  :treeListData="treeListDataEdit" :type="'organization'"></Tree>
                </div> 
            </div>
        </alertModel>
        <!-- 成员信息弹框  -->
        <alertModel :title="'成员信息'"   :alelrtClassWidth="'500px'" :showState="showMem.state" :type="2" v-show="showMem.state"  @cancelHandle="showMem.state = false">
            <div slot="alert-content" class="showMember clf">
                <p class="clf">
                    <label for="">邮箱<b>*</b></label>
                    <!-- <input type="text" v-model.trim="showMem.email" readonly class="gray"  maxlength="64"> -->
                    <span>{{showMem.email}}</span>
                </p>
                <p class="clf">
                    <label for="">部门<b>*</b></label>
                    <span>{{showMem.department}}</span>               
                </p>
                <p class="clf">
                    <label for="">姓名<b>*</b></label>
                    <span>{{showMem.name}}</span>
                </p>                
                <p class="clf">
                    <label for="">手机<b>*</b></label>
                    <span>{{showMem.phone}}</span>
                </p>
                <p class="clf">
                    <label for="">职位<b class="opacity">*</b></label>
                    <span>{{showMem.job}}</span>
                </p>
                <p class="clf">
                    <label for="">备注<b  class="opacity">*</b></label>
                    <span>{{showMem.memo}}</span>
                </p>
                <p class="clf">
                    <label for="">主管<b  class="opacity">*</b></label>
                    <span>{{showMem.role == 1 ? '是':'否'}}</span>
                </p>
            </div>
            <div slot="alert-footer">
                <a class="center-btn" @click="showMem.state = false">关闭</a>
            </div>
        </alertModel>
        <!-- 添加部门弹框  -->
        <alertModel :title="'添加部门'"  :showState="addDep.state" :type="2" v-show="addDep.state"  @cancelHandle="addDep.state = false" @sureHandle="addDepHandle">
            <div slot="alert-content" class="form">
                <p class="clf">
                    <label for=""><b>*</b>部门名称</label>
                    <input type="text" v-model.trim="addDep.name" @keyup.enter="addDepHandle" maxlength="128">
                </p>
                <p class="clf">
                    <label for="">上级部门</label>
                    <input type="text" v-model.trim="addDep.leaderDep" readonly class="gray">
                </p>
            </div>
        </alertModel>
        <!-- 编辑部门弹框  -->
        <alertModel :title="'编辑部门'"   :showState="editDep.state" :type="2" v-show="editDep.state"  @cancelHandle="editDep.state = false" @sureHandle="editDepSure">
            <div slot="alert-content" class="form">
                <p class="clf">
                    <label for=""><b>*</b>部门名称</label>
                    <input type="text" v-model.trim="editDep.name" @keyup.enter="editDepSure" maxlength="128">
                </p>
                <p class="clf">
                    <label for="">上级部门</label>
                    <input type="text" v-model.trim="editDep.leaderDep" readonly class="gray">
                </p>
            </div>
        </alertModel>
        <!--删除部门弹框-->
        <alertModel :title="'删除部门'" :context="'是否确定删除此部门？'" :type="2"  v-show="delDep.state"  @cancelHandle="delDep.state = false" @sureHandle="delDepSure">
        </alertModel>
        <!--批量注销弹框-->
        <alertModel :title="'温馨提示'" :context="'是否确认停用选中的用户？'"  :showState="del.moreState" :type="2" v-show="del.moreState"  @cancelHandle="del.moreState = false" @sureHandle="delMemberMore">
        </alertModel>
        <!--注销某一个弹框-->
        <alertModel :title="'温馨提示'" :context="'是否确认停用用户？'"  :showState="del.state" :type="2" v-show="del.state"  @cancelHandle="del.state = false" @sureHandle="delMember">
        </alertModel>
        <Loading :text="'身份证识别中,请稍等'" v-show="realState"></Loading>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context"  :autoClose="showAlertData.autoClose"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
  </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import '@/assets/js/plugin/jquery.form.js';
    import translateImg from '@/assets/images/transparent.png';
    export default{
        data(){
            return{  
                rootId:null,
                searchTitle:'',
                deleteFlag:0,  //搜索合作伙伴的状态  0-正常用户  1-停用用户
                disableNum:null,   //停用联系人条数
                enable:{
                    state:false,
                    sureBtnTxt:'确定',
                    editDepStatus:false,  //选择部门弹窗
                    department:'请选择部门',        //部门名称
                    item:null,            //选中的部门
                },
                sureEnable:{
                    state:false,
                    memId:null,
                    index:null
                },
                partnerExit:{
                    state:false,                    
                },
                importMem:{
                    state:false,
                    txt:'点击选择'
                },                                               
                addDep:{             //添加部门弹框
                    state:false,     //弹框状态
                    leaderDep:'',    //上级部门
                    name:'',         //部门名称
                    hover:false,     //鼠标移入添加部门icon
                },
                delDep:{             //删除部门
                    state:false,   
                    item:null,       //删除部门item
                },
                editDep:{
                    state:false,
                    item:null,      //编辑部门item
                    name:'',        //部门名称
                    leaderDep:'',   //上级部门名称
                    
                },
                editMem:{            //编辑成员
                    state:false,     //状态
                    email:'',       //邮箱
                    department:'',  //部门
                    name:'',        //姓名
                    job:'',         //职位
                    phone:'',       //手机
                    memo:'',        //备注
                    role:0,         //是否为主管
                    isActive:0,     //是否激活
                    editDepStatus: false,   //编辑成员组织结构列表是否显示
                    item:null,             //选中的部门item
                    sureBtnTxt:'确定',     
                },
                showMem:{            //成员信息
                    state:false,     //状态
                    email:'',       //邮箱
                    department:'',  //部门
                    name:'',        //姓名
                    job:'',         //职位
                    phone:'',       //手机
                    memo:'',        //备注
                    role:0,         //是否为主管
                    isActive:0,     //是否激活
                    sureBtnTxt:'关闭',     
                },
                addMem:{            //添加新成员
                    state:false,     //状态
                    email:'',       //邮箱
                    department:'',  //部门
                    name:'',        //姓名
                    job:'',         //职位
                    phone:'',       //手机
                    memo:'',        //备注
                    role:0,         //是否为主管
                    real:0,         //实名认证
                    frontImg:null,  //身份证正面
                    backImg:null,   //身份证反面
                    idCardName:null,    //真实姓名
                    idCardNo:null,     //身份证号
                    idCardToken:null,   //身份证token
                    sureBtnTxt:'确定',     
                },
                realState:false,
                treeListData:[],      //tree列表数据
                ajaxGetTreeLoading:false,   //获取tree数据状态
                treeListDataEdit:[],  //编辑成员弹框tree数据
                selectItem:null,      //选中的tree item
                tableTitle:'',
                organizaList:{                  //组织架构列表数据
                    tableLoading:false,
                    tableList:null,
                    title:'',
                    condition:'',
                    pageTotal:100,
                    pageIndex:1,   //当前页
                    pageLength:10, //每页显示多少条
                },
                select:{
                    list:[],       //选中的列表               
                    index:null,    //点击注销或者编辑的时候找到标识下标
                    all:false,     //是否全选
                },
                del:{             //注销弹框
                    state:false,       //某一个
                    moreState:false,   //批量
                },
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"温馨提示",
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
            partnerExitHandle(){  //将删除部门的合作伙伴移动到根目录
                this.httpGet(this.URL.movePartnerToStructure,{
                    fromStructureId:this.delDep.item.id,
                    toStructureId:this.rootId.id
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.delDepSure();
                        this.partnerExit.state = false;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            enableHandle(){   //点击启用按钮(先判断部门存不存在)
                this.httpGet(this.URL.unDelMember,{
                    memId:this.sureEnable.memId
                },(response)=>{
                    let result = response.data;
                    this.sureEnable.state = false;
                    if(result.meta.success){
                        // this.searchMemberListLight();
                        this.ajaxGetTree();
                        this.searchDisNum();
                        this.select.index = null;                                      
                    }else{
                        if(result.meta.message == 'structure.error'){
                            this.enable.department = '请选择部门';
                            this.enable.state = true;
                            this.select.index = this.sureEnable.index;
                        }else{
                            this.alertCommonTip(result.meta.message)
                        }
                        
                    }
                })
            },
            enableMemberMore(){  //选中部门之后启用用户
                this.httpGet(this.URL.unDelMember,{
                    memId:this.organizaList.tableList[this.select.index].memId,
                    structId:this.enable.item.id
                },(response)=>{
                    let result = response.data;
                    this.enable.state = false;
                    if(result.meta.success){
                        // this.searchMemberListLight();
                        this.alertCommonTip("启用成功！")
                        this.ajaxGetTree();
                        this.searchDisNum();
                        this.select.index = null;                        
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
                
            },
            disableHandle(){  //点击停用联系人
                $('.treeview').find('span').removeClass('on');
                this.deleteFlag = 1;
                this.tableTitle = '已停用联系人';
                this.searchMemberListLight();
            },
            reActivateByMail(item){  //重发激活邮件
                /*this.httpPost(this.URL.reActivateByMail,{
                    "email":item.accNo
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.alertCommonTip('激活邮件已成功发送');
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })*/
                let This = this;
                $.ajax({
                    type: "POST",
                    async: false,
                    url: This.apiPath + This.URL.reActivateByMail,
                    data: {
                        "email": item.accNo
                    },
                    success: function (result) {
                        if(result.meta.success){
                            This.alertCommonTip('激活邮件已成功发送');
                        }else{
                            This.alertCommonTip(result.meta.message);
                        }
                    }
                });
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
                    this.modelCommonTip('请上传文件');
                    return false;
                }
                $("#importForms").ajaxSubmit({
                    url:This.apiPath + This.URL.importMembers,//默认是form action
                    success:function(data){                        
                        let msg = eval('(' + data + ')');
                        if(msg.code=="success"){
                            This.importMem.state = false;
                            This.alertCommonTip("有"+msg.successCount+"条记录上传成功。有"+msg.failCount+"条记录上传失败。")
                            var obj = document.getElementById("importForms") ;
                            obj.reset();                          
                            This.ajaxGetTree();
                            // This.searchMemberListLight();
                            This.organizaList.pageIndex = 1;         //跳到第一页
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
            //调用ocr接口
            realHandle(){
                let This = this;
                if(!this.addMem.frontImg){
                    $(".frontTip").text("请上传身份证正面图片")
                    return;
                }
                if(!this.addMem.backImg){
                    $(".backTip").text("请上传身份证背面图片")
                    return;
                }
                this.realState = true;
                $('#realBox').ajaxSubmit({  
                        url : This.apiPath+This.URL.userAuthrityStep,  
                        xhrFields: {
                                withCredentials: true
                        },
                        type:'post',
                        beforeSubmit:function(){
                            console.log("上传中")
                        },
                        success: function(res){ 
                            This.realState = false;
                            let result = JSON.parse(res);
                            console.log(result)
                            This.addMem.idCardToken = result.data.idCardToken;
                            if(result.meta.success){
                                This.addMem.idCardName = result.data.idCardName;
                                This.addMem.idCardNo = result.data.idCardNo;
                                $(".allTip").text("身份证上传完成");
                                $(".frontTip,.backTip").text("");
                                This.realState = false;
                            }else{
                                if(result.meta.message == 'invalid.data.idcard_f'){
                                    $(".frontTip").text("请重新上传身份证正面图片")
                                }else if(result.meta.message == 'invalid.data.idcard_b'){
                                    $(".backTip").text("请重新上传身份证背面图片")
                                }else if(result.meta.message == 'error'){
                                    This.alertCommonTip("服务器异常，请稍后重试");
                                }else{
                                    This.alertCommonTip(result.meta.message)
                                }
                            }
                        },
                        error:function(res){
                            This.realState = false;
                            if(res.statusText == "timeout"){
                                This.alertCommonTip('服务器繁忙，请稍后再试')
                            }                        
                        },
                        timeout:30000
                    });
            },
            //实名认证上传图片
            uploadImgChange(objImg,obj){   //点击上传图片
                $("#"+obj).val("");
                $(".allTip").text("");
                $("#"+obj).unbind().on('change',()=>{
                    let name = $("#"+obj).val().split('.')[1];
                    if(name != 'png' &&  name != "gif" && name != "jpg" && name != "jpeg"){
                        this.modelCommonTip('不支持该类型，请上传png、gif或jpg类型图片');
                        return false;
                    }
                    var oMyFile = $("#"+obj);
                    if(oMyFile.files){  //判断ie是否支持此属性
                        let filesSize = $("#"+obj)[0].files[0].size/1024/1024;
                        if(filesSize > 2){
                            this.modelCommonTip('请上传小于2M的图片');
                            return false;
                        }
                    }                    
                    this.change(objImg, obj);

                    if(objImg == 'backImg'){   
                        $('.backTip').text("");
                        $('.backImg').siblings('.imgBg').hide();
                        $('.backImg').siblings('p').hide();
                    }else{
                        $('.frontTip').text("");
                        $('.frontImg').siblings('.imgBg').hide();    
                        $('.frontImg').siblings('p').hide();                    
                    }
                    
                //    $('#stampFile').val('');  //解决第二次选同一张图片，不能触发onchange事件
                })
            },
            change(pre_id,file_id) {
                let This = this;
                var pic = document.getElementById(pre_id), file = document.getElementById(file_id);
                if (file == undefined || file == '') {
                    return;
                }
                var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
                if(ext == ''){
                    return;
                }
                if(ext!='png'&&ext!='jpg'&&ext!='jpeg'&&ext!='gif'){
                    $("#alterBox_h").modal("show");
                    document.getElementById('alterBoxTitle_h').innerHTML = "图片的格式必须为png、jpg、gif格式！";
                    return;
                }
            
                if(file.files){
                    this.html5Reader(file,pre_id);
                }else{
                    file.select();
                    file.blur();
                    var reallocalpath = document.selection.createRange().text;
                    pic.width=116;
                    pic.height=86;
                    pic.style.opacity = 1;
                    pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
                    pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                    if(pre_id == 'backImg'){
                        This.addMem.backImg = true;
                    }else{
                        This.addMem.frontImg = true;
                    }
                    setTimeout(()=>{
                        if(This.addMem.frontImg && This.addMem.backImg){
                            This.realHandle();
                        }
                    }) 
                }
            },
            html5Reader(file,pre_id){
                let This = this;
                var file = file.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var pic = document.getElementById(pre_id);
                    $(pic).css('opacity',1);
                    pic.src=this.result;
                    if(pre_id == 'backImg'){
                        This.addMem.backImg = true;
                    }else{
                        This.addMem.frontImg = true;                        
                    }
                    setTimeout(()=>{
                        if(This.addMem.frontImg && This.addMem.backImg){
                            This.realHandle();
                        }
                    }) 
                }
            }, 
            addMemClick(){   //点击添加成员
                this.addMem.department = this.selectItem.text;
                this.addMem.state = true;
                //初始化基本数据
                this.addMem.email = this.addMem.name = this.addMem.job = this.addMem.phone = this.addMem.memo = '';
                this.addMem.role = 0;
                //初始化实名认证数据
                this.addMem.real = 0;                
                this.addMem.frontImg = false;
                this.addMem.backImg = false;
                this.addMem.idCardNo = this.addMem.idCardName = this.addMem.idCardToken = null;
                $(".frontTip,.backTip,.allTip").text('');
                $("#frontImg,#backImg").attr('src',translateImg);
                $(".imgBg").show().siblings('p').show();                
            },
            beforeAddMem(item,num){    //添加成员前的验证
                let CLASS = num == 1 ? 'topClass' : '';
                if(this.validateQb.isEmpty(item.email)){
                    this.modelCommonTip('邮箱不能为空',2000,CLASS);
                    return false;
                }
                if(!this.validateQb.isEmail(item.email)){
                    this.modelCommonTip('邮箱格式不正确',2000,CLASS);
                    return false;
                }
                if(this.validateQb.isEmpty(item.name)){
                    this.modelCommonTip('姓名不能为空',2000,CLASS);
                    return false;
                }
                if(this.validateQb.isEmpty(item.phone)){
                    this.modelCommonTip('手机号码不能为空',2000,CLASS);
                    return false;
                }
                if(!this.validateQb.isPhone(item.phone)){
                    this.modelCommonTip('手机号码格式不正确',2000,CLASS);
                    return false;
                }
                if(item.real && item.real == 1){
                    if(!this.addMem.frontImg){
                        this.modelCommonTip('请上传身份证正面图片',2000,CLASS);
                        return false;
                    }
                    if(!this.addMem.backImg){
                        this.modelCommonTip('请上传身份证反面图片',2000,CLASS);
                        return false;
                    }
                    if(!this.addMem.idCardName){
                        this.modelCommonTip('真实姓名不能为空',2000,CLASS);
                        return false;
                    }
                    if(this.addMem.idCardName == ''){
                        this.modelCommonTip('真实姓名不能为空',2000,CLASS);
                        return false;
                    }
                    if(!this.addMem.idCardNo){
                        this.modelCommonTip('身份证号不能为空',2000,CLASS);
                        return false;
                    }
                    if(this.addMem.idCardNo == ''){
                        this.modelCommonTip('身份证号不能为空',2000,CLASS);
                        return false;
                    }
                    if(!this.validateQb.isCardNo(this.addMem.idCardNo)){
                        this.modelCommonTip('身份证号码不合法，请核对',2000,CLASS);
                        return false;
                    }
                }
                return true;
            },
            addMemMemHandle(){  //添加成员确定按钮
                if(!this.beforeAddMem(this.addMem,1)) return;  
                this.addMem.sureBtnTxt = "提交中...";
                if(this.addMem.real == 0){  //判断如果不实名，提交实名数据为空
                    this.addMem.idCardNo = '';
                    this.addMem.idCardName = '';
                    this.addMem.idCardToken = '';
                }
                this.httpPost(this.URL.addMember,{
                    "structId":this.selectItem.id,
                    "email":this.addMem.email,    //邮箱
                    "name":this.addMem.name,      //姓名
                    "position":this.addMem.job,   //职位
                    "tel":this.addMem.phone,      //手机
                    "memo":this.addMem.memo,      //备注
                    "role":this.addMem.role,      //是否为主管
                    "isAuth":this.addMem.real,
                    "idCardName": this.addMem.idCardName || "",
                    "idCardNo":this.addMem.idCardNo || "",
                    "idCardToken":this.addMem.idCardToken || ""
                },(response)=>{
                    let result = response.data;
                    this.addMem.sureBtnTxt = '确定';
                    if(result.meta.success){
                        this.addMem.state = false;
                        this.ajaxGetTree();
                        // this.searchMemberListLight();
                        if(result.data.result.indexOf('AUTH_FAIL') != -1){
                            this.alertCommonTip('添加成员成功，但实名认证不通过');
                        }else{
                            this.alertCommonTip('添加成员成功');
                        }
                    }else{
                        let msg = result.meta.message
                        if(msg == 'wrongEmail'){
                            this.alertCommonTip("电子邮箱格式错误");
                        }else if(msg == 'wrongPhone'){
                            this.alertCommonTip("手机号码格式错误");
                        }else if(msg == 'repeatEmail'){
                            this.alertCommonTip("该邮箱地址已注册");
                        }else if(msg == 'wrongCompany'){
                            this.alertCommonTip("公司名称有误");
                        }else{
                            this.alertCommonTip("添加失败");
                        }
                    }
                    
                })
            },
            editClick(item,index){  //点击编辑按钮
                this.editMem.state = true;
                this.editMem.item = null;  //选中的部门初始化
                this.ajaxGetTreeEdit();
                this.httpGet(this.URL.getMemberDetail,{
                    memId:item.memId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.editMem.email = result.data.email || '';
                        this.editMem.department = item.structureName ;
                        this.editMem.name = result.data.name || '';
                        this.editMem.job = result.data.position;
                        this.editMem.phone = result.data.phone ||　'';
                        this.editMem.memo = result.data.memo;
                        this.editMem.role = result.data.role;
                        this.editMem.isActive = this.organizaList.tableList[index].isActivated;
                        this.editMem.item = result.data;
                        
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            showClick(item,index){  //点击li
                this.showMem.state = true;
                this.httpGet(this.URL.getMemberDetail,{
                    memId:item.memId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.showMem.email = result.data.email;
                        this.showMem.department = item.structureName;
                        this.showMem.name = result.data.name;
                        this.showMem.job = result.data.position;
                        this.showMem.phone = result.data.phone;
                        this.showMem.memo = result.data.memo;
                        this.showMem.role = result.data.role;
                        this.showMem.isActive = this.organizaList.tableList[index].isActivated;
                        this.showMem.item = result.data;
                        
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            editMemHandle(){  //确认编辑成员
            if(!this.beforeAddMem(this.editMem,2)) return;  
                this.editMem.sureBtnTxt = '提交中...';
                this.httpGet(this.URL.editMember,{
                    memId:this.editMem.item.memId,
                    email:this.editMem.email,
                    name:this.editMem.name,
                    tel:this.editMem.phone ? this.editMem.phone : '',
                    position:this.editMem.job ? this.editMem.job : '',
                    role:this.editMem.role,
                    memo:this.editMem.memo ? this.editMem.memo : '',
                    structId:this.editMem.item.structId,
                },(response)=>{
                    this.editMem.sureBtnTxt = '确定';
                    let result = response.data;
                    if(result == 'success'){
                        this.editMem.state = false;
                        this.ajaxGetTree();
                        // this.searchMemberListLight();
                    }else{
                        this.alertCommonTip(result);
                    }
                })
            },
            editDepartant(item){   //点击组织架构编辑按钮
                this.editDep.item = item;
                this.editDep.name = item.text;
                this.editDep.leaderDep = item.parText; 
                this.editDep.state = true;
                // this.selectItem = item; 
            },
            editDepSure(){   //确定编辑部门
                if(this.validateQb.isEmpty(this.editDep.name)){
                    // this.alertCommonTip("部门名称不能为空");
                    this.modelCommonTip('部门名称不能为空');
                    return
                }
                this.httpPost(this.URL.editOrgStructureLight,{
                    structureName:this.editDep.name,
                    structureId:this.editDep.item.id,
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.editDep.state=false;
                        this.ajaxGetTree();                        
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            delDepartant(item){  //点击组织架构删除按钮
                this.delDep.item = item;
                this.delDep.state = true;
            },
            delDepSure(){    //确认删除部门
                this.delDep.state = false;
                this.httpPost(this.URL.delOrgStructure,{
                    structureId:this.delDep.item.id
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        // this.delDep.state = false;
                        this.delDep.item = null;
                        this.selectItem = null;
                        $("#side_left_tree #browser").find('span').removeClass('on')
                        $("#side_left_tree #browser").find('ul').eq(0).find('li').eq(0).find('span').eq(0).addClass('on')
                        this.ajaxGetTree();
                    }else{
                        if(result.meta.message == 'has.member'){
                            this.alertCommonTip("组织架构存在成员不能删除");
                        }else if(result.meta.message == 'has.partner'){
                            this.partnerExit.state = true;
                        }else if(result.meta.message == 'has.childStructure'){
                            this.alertCommonTip("该部门包含子部门，无法删除。");
                        }else{
                            this.alertCommonTip(result.meta.message)
                        }
                        
                    }
                })
            },
            addDepHandle(){  //添加部门
                if(this.validateQb.isEmpty(this.addDep.name)){
                    this.modelCommonTip('部门名称不能为空');
                    return false;
                }
                if(this.selectItem.level >= 5){
                    this.modelCommonTip('部门不能大于5级');
                    return false;
                }
                this.httpPost(this.URL.addOrgStructure,{
                    structureName:this.addDep.name,
                    parStructureId:this.selectItem.id ? this.selectItem.id : ''
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.addDep.state = false;
                        this.ajaxGetTree();
                    }else{
                        this.alertCommonTip(result.meta.success);
                    }
                })
            },
            delMember(){  //停用某一个用户
                this.httpGet(this.URL.delMember,{
                    memId:this.organizaList.tableList[this.select.index].memId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        // this.searchMemberListLight();
                        this.ajaxGetTree();
                        this.searchDisNum();
                        this.select.index = null;
                        this.del.state = false;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            zhuxiaoHandle(){
                if(!$(".cancellation").hasClass('active')) return;     
                this.del.moreState = true
            },
            delMemberMore(){     //批量停用用户    
                let　data = [];           
                for(let i = 0 ; i < this.select.list.length ; i++){
                    data.push({
                        'memId':this.select.list[i].memId
                    })
                }
                this.httpPost(this.URL.delMemberList,data,(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.del.moreState = false;
                        // this.searchMemberListLight();
                        this.ajaxGetTree();
                        this.searchDisNum();
                        this.select.list = [];     
                        this.select.all = false;                   
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },            
            setMemberRole(){   //设置主管
                if(!$(".setRole").hasClass('active')) return;
                let　data = [];
                for(let i = 0 ; i < this.select.list.length ; i++){
                    data.push({
                        'memId':this.select.list[i].memId,
                        "role":"1"
                    })
                }
                this.httpPost(this.URL.setMemberRole,data,(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.searchMemberListLight();
                        this.select.list = [];
                        this.select.all = false;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            selectAllHandle(){   //全选
                if(this.select.all){    //取消全选
                    this.select.all = false;
                    if(this.organizaList.tableList.length == 0) return;
                    for(let i = 0 ; i < this.organizaList.tableList.length ; i++){
                        this.organizaList.tableList[i].selectVal = false;
                        if(this.select.list.length == 0) return;
                        for(let j = 0 ; j < this.select.list.length; j++){
                            if(this.organizaList.tableList[i].accId == this.select.list[j].accId){
                                this.select.list.splice(j,1)
                            }
                        }
                    }

                }else{     //全选选中
                    this.select.all = true;
                    for(let i = 0 ; i < this.organizaList.tableList.length ; i++){
                        this.organizaList.tableList[i].selectVal = true;
                        this.select.list.push(this.organizaList.tableList[i]);
                        this.select.list = this.unique3(this.select.list,'accId');
                    }
                }
            },
            selectItemHandle(item){  //选中复选框
                if(item.selectVal){  //取消选中
                    item.selectVal = false;
                    this.select.all = false;
                    if(this.select.list.length == 0) return;
                    for(let i = 0 ; i < this.select.list.length ; i++){
                        if(this.select.list[i].accId == item.accId){
                            this.select.list.splice(i,1);
                        }
                    }
                }else{   //选中
                    item.selectVal = true;
                    this.select.list.push(item);
                    let selectNum = 0;
                    if(this.organizaList.tableList.length == 0) return;
                    for(let i = 0 ; i < this.organizaList.tableList.length ; i++){
                        if(this.select.list.length == 0) return;
                        for(let j = 0 ; j < this.select.list.length; j++){
                            if(this.organizaList.tableList[i].accId == this.select.list[j].accId){
                                selectNum++;
                            }
                        }
                    }
                    if(selectNum == this.organizaList.tableList.length && this.organizaList.tableList.length > 0){
                        this.select.all  = true;
                    }else{
                        this.select.all = false;
                    }
                }
            },
            ajaxGetTree(){  //获取组织架构
                this.ajaxGetTreeLoading = true;
                this.httpPost(this.URL.ajaxGetTreeNum,{
                    // isWithCount:1
                },(response)=>{
                    let result = response.data;
                    this.ajaxGetTreeLoading = false;
                    if(result.meta.success){
                        this.treeListData = result.data;   
                        this.rootId = result.data[0];          
                        if(!this.selectItem){      //初始化，默认给选中item为第一个数据                        
                            this.selectItem = result.data[0];
                            setTimeout(()=>{
                                $("#side_left_tree #browser").find('ul').eq(0).find('li').eq(0).find('span').eq(0).addClass('on')
                            })
                        }
                        // this.addDep.leaderDep = result.data[0].text.split('(')[0];this.selectItem
                        this.addDep.leaderDep = this.selectItem.text.split('(')[0];
                        this.getStructNameString();
                        this.searchMemberListLight();
                        
                        if(!this.cloudyState){
                            $("#side_left_tree").mCustomScrollbar({
                                theme:"minimal"
                            });
                            $("#select-input3").mCustomScrollbar({
                                theme:"minimal"
                            });
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            ajaxGetTreeEdit(){  //获取编辑成员弹框组织架构
                
                this.httpPost(this.URL.ajaxGetTree,{
                    // isWithCount:1
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.treeListDataEdit = result.data;
                        if(!this.cloudyState){
                            $("#select-input").mCustomScrollbar({
                                theme:"minimal"
                            });
                        }
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            searchHandle(){  //搜索成员
                this.organizaList.pageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.searchMemberListLight();
            },
            searchMemberListLight(){   //大B管理员获取成员列表
                this.organizaList.tableLoading = true;
                this.httpGet(this.URL.searchMemberListLight,{
                    structureId:this.deleteFlag == 1 ? '' : this.selectItem.id,
                    deleteFlag:this.deleteFlag,
                    condition:this.organizaList.condition,
                    page:this.organizaList.pageIndex,
                    pageSize:this.organizaList.pageLength
                },(response)=>{
                    let　result = response.data;
                    this.organizaList.tableLoading = false;
                    if(result.meta.success){                        
                        this.organizaList.pageTotal = result.data.totalCount;
                        this.organizaList.tableList = result.data.list;
                        let selectNum = 0;
                        if(this.organizaList.tableList.length == 0){this.select.all = false; return;} 
                        for(let i = 0 ; i < this.organizaList.tableList.length ; i++){
                            if(this.select.list.length == 0) return;
                            for(let j = 0 ; j < this.select.list.length; j++){
                                if(this.organizaList.tableList[i].accId == this.select.list[j].accId){
                                    selectNum++;
                                    this.organizaList.tableList[i].selectVal = true;
                                }
                            }
                        }
                        if(selectNum == this.organizaList.tableList.length && this.organizaList.tableList.length > 0){
                            this.select.all  = true;
                        }else{
                            this.select.all = false;
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            searchDisNum(){  //获取停用联系人的条数
                this.httpGet(this.URL.searchMemberListLight,{
                    structureId:'',
                    deleteFlag:1,
                    condition:this.organizaList.condition,
                    page:this.organizaList.pageIndex,
                    pageSize:this.organizaList.pageLength
                },(response)=>{
                    let　result = response.data;
                    if(result.meta.success){ 
                        this.disableNum = result.data.totalCount;
                    }
                })
            },
            getStructNameString(){   //获取组织架构字符串
                this.httpGet(this.URL.getStructNameString,{
                    structureId:this.selectItem.id,
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.tableTitle = result.data;
                    }
                })
            },
            selectTreeItemHandle(val){  //tree组件列表点击
                this.selectItem = val;
                this.addDep.leaderDep = this.selectItem.text.split('(')[0];
                this.getStructNameString();
                this.organizaList.pageIndex = 1;
                this.Event2.$emit('tip2',1);  //跳到第一页
                this.deleteFlag = 0;
                this.searchMemberListLight();
            },
            selectTreeItemHandleEdit(val){  //编辑成员弹框tree列表点击
                this.editMem.department = val.text;
                this.editMem.item.structId = val.id
            },
            selectTreeItemHandleEnable(val){   //启用成员弹框tree列表点击
                this.enable.editDepStatus = false;
                this.enable.department = val.text;
                this.enable.item= val;
            },
            pageChangeHandel(val){
                this.organizaList.pageIndex = val;
                this.searchMemberListLight();
            },
            init(){
                $(document).on('click',()=>{
                    if(this.editMem.editDepStatus){
                        this.editMem.editDepStatus = false;
                    }
                })
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-组织架构";
            }else{
                document.title="签吧-组织架构";
            }
            this.$store.dispatch("changeTitle","通讯录 > 组织架构");
            this.ajaxGetTree();
            this.init();
            let Timer = setInterval(()=>{
                if(this.userState){
                    clearInterval(Timer);
                    if(this.userState == 1){
                        this.searchDisNum();
                    }
                }
            },30)
        }
    }
</script>
<style lang="scss" scoped>
</style>

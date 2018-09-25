<template>
    <div class="toFillin" v-cloak>
        <div class="right_col">
            <div class="fileContent">
                <h3>文档内容</h3>
                <div class="formBox">
                    <div class="sideLeft">
                        <div class="form-box" >
                            <img class="bg" @click="previewHandle" src="../../assets/images/docThumbNull.png" alt="" width="104" height="134">          
                            <p class="warn" v-html="form.warn"></p> 
                            <i class="icon-warn" @mouseenter="form.sweetStatus = true" @mouseleave="form.sweetStatus = false"></i>     
                            <div class="sweet" v-show="form.sweetStatus">
                                <i class="triangle2"></i>
                                <p>支持 doc/docx/pdf/wps/xls以及jpg/png格式，大小&lt;10M</p>
                            </div> 
                            <div class="warter" v-show="form.water"></div>           
                        </div>
                        <form id="uploadForm" method="post" enctype="multipart/form-data">     
                            <div class="upload-btn"  @click="selectFile()">
                                <p>上传文档</p>                          
                                <input type="file" id="file" name="uploadFile" contenteditable="false" style="opacity:0.01"> 
                            </div>
                        </form>
                    </div>
                    <div class="sideRight">
                        <div class="formGroup">
                            <div class="inputControl row clf">
                                <label for="" class="col-lg-2  col-md-3 col-sm-3"><span>主题<b>*</b></span></label>
                                <input type="text" class="col-lg-6 col-md-6 col-sm-6"  name="" id="" v-model.trim="submitData.docName" v-on:input="monitor(submitData.docName)">
                                <div class="col-lg-3 col-md-3 col-sm-3 fair">
                                    <span class="icon-check2-default" :class="[submitData.signatureType == '002' ? 'active' : '']" @click="submitData.signatureType = submitData.signatureType == '001' ? '002':'001' "></span>
                                    <span>公平签署</span>
                                    <span class="icon-help"  @mouseenter="form.fairStatus = true" @mouseleave="form.fairStatus = false">
                                        <div class="sweet" v-show="form.fairStatus">
                                            <i class="triangle2"></i>
                                            <p>公平签署是指签署人全部签名后才生效，缺少任意一个签署人的签名，其他已签署的签名均无效。建议用户采用，保障文件签署的公平。</p>
                                        </div>
                                    </span>
                                </div>
                                <p class="col-lg-offset-2 titleTip">{{form.titleTip}}</p>
                            </div>
                            
                            <div class="inputControl row clf">
                                <label for="" class="col-lg-2  col-md-3 col-sm-3"><span>截止签约日期<b>*</b></span></label>
                                <span class="calendarBox col-lg-3 col-md-4 col-sm-6">
                                    <div class="input-append date form_datetime"  id="date_start" >
                                        <input size="16" type="text" value=""  v-model.trim="submitData.durationTime" readonly>
                                        <b class="add-on"><i class="icon-calendar"></i></b>
                                    </div>
                                </span>
                                <div class="col-lg-3 col-md-3 col-sm-3 fair">
                                    <span class="icon-check2-default"  @click="submitData.durationTime = submitData.durationTime == '' ? '':'' " :class="[submitData.durationTime == '' ? 'active' : '']"></span>
                                    <span >永久有效</span>
                                </div>
                            </div>
                            <div class="inputControl row clf">
                                <label for="" class="col-lg-2  col-md-3 col-sm-3"><span>备注<b class="opacity">*</b></span></label>
                                <textarea  class="col-lg-9 col-md-8 col-sm-8" v-model.trim="submitData.memo" v-on:input="monitorMemo(submitData.memo)"/>
                                <p class="col-lg-offset-2 titleTip">{{form.memoTip}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="signSetting clf">
                <h3 class="title">签署设置</h3>
                <div class="settingBox">
                    <div class="template clf" v-if="docTemplate.list.length > 0">
                        <a href="javascript:;" @click="templateState = true">使用模板</a>
                        <span>（使用保存的签署人、抄送人和签署顺序）</span>
                    </div>
                    <div class="signWay clf">
                        <h4>选择签署方式</h4>
                        <ul class="row clf">
                            <li class="col-lg-4 col-md-6 col-sm-12 col-xs-12" @click="signOrder = '002'">
                                <span :class="[signOrder == '002' ? 'icon-radio-select':'icon-circle2']"></span>
                                <span>顺序签<b>&nbsp;&nbsp;(A->B->C->D ，可拖动签署人调整排序)</b></span>
                            </li>
                            <li class="col-lg-4 col-md-5 col-sm-12 col-xs-12" @click="signOrder = '001'">
                                <span :class="[signOrder == '001' ? 'icon-radio-select':'icon-circle2']"></span>
                                <span>任意签<b>&nbsp;&nbsp;(签署人先到先签，无固定顺序)</b></span>
                            </li>                            
                        </ul>
                    </div>
                    <div class="addSingers">
                        <h4>添加签署人</h4>
                        <ul v-show="signOrder == '001'" >  <!--任意签-->
                            <li v-for="(item,index) in selectSignerArrayCheck" :key="index"  @mouseover="showDelSign(index,1)"  @mouseout="hideDelSign(1)">
                                    <span><b class="icon-menu"></b></span>
                                    <span :class="[signOrder == '002'?'':'opacity']">{{index+1}}</span>
                                    <span :class="[item.isColleague == 2 ? 'icon-sign-pen':'icon-seal']"></span>
                                    <span class="shengl">{{item.name?item.name : ''}}</span>
                                    <!--<span>{{item.accType  == 2 ? item.companyName : (item.isColleague != 2 ? item.accNo : item.mobileNo)}}</span>-->
                                    <span>{{(item.accType  == 2 && item.isColleague != 2) ? item.companyName : (item.accType == 3 ? item.accNo : item.mobileNo)}}</span>
                                    <i class="icon-del-circle" v-show="delIndex.one == index" @click="delSelectMail(item,index)"></i>
                            </li>
                        </ul>
                        <ul v-show="signOrder == '002'" >
                            <draggable v-model="selectSignerArrayCheck">
                                <transition-group>
                                    <li v-for="(item,index) in selectSignerArrayCheck" :key="index" @mouseover="showDelSign(index,1)" @mouseout="hideDelSign(1)">
                                            <span><b class="icon-menu"></b></span>
                                            <span :class="[signOrder == '002'?'':'opacity']">{{index+1}}</span>
                                            <span :class="[item.isColleague == 2 ? 'icon-sign-pen':'icon-seal']"></span>
                                            <span class="shengl">{{item.name?item.name : ''}}</span>
                                            <span>{{(item.accType  == 2 && item.isColleague != 2) ? item.companyName : (item.accType == 3 ? item.accNo : item.mobileNo)}}</span>
                                            <i class="icon-del-circle" v-show="delIndex.one == index" @click="delSelectMail(item,index)"></i>
                                    </li>
                                </transition-group>
                            </draggable>
                        </ul>
                        <a href="javascript:;"  class="addContacts"  @click="addMailList()"><i class="icon-add-circle"></i>从通讯录添加</a>
                        <a href="javascript:;"  class="addContacts" @click="addContactsHandle(0)"><i class="icon-add-circle"></i>{{userState == 2 ? '新建联系人' : '新建签署人'}}</a>                        
                    </div>
                    <div class="addCaoSong">
                        <h4 class="selectNo">添加抄送人 <span>(只接受副本不签署)</span> <span><i :class="[addCaoSongState ? 'icon-two-up' : 'icon-two-down']" @click="addCaoSongState = !addCaoSongState"></i></span></h4>
                        <ul >
                            <li v-for="(item,index) in carbonCopiesArray" :key="index" @mouseover="showDelSign(index,2)"  @mouseout="hideDelSign(2)">
                                    <span><b class="icon-menu"></b></span>
                                    <span>{{index+1}}</span>
                                    <span :class="[item.isColleague == 2 ? 'icon-sign-pen':'icon-seal',selectSignerIndex == 0 ? '' : 'opacity']"></span>
                                    <span class="shengl">{{item.name?item.name : ''}}</span>
                                    <span>{{item.accType == 2 ? item.companyName : (item.isColleague != 2 ? item.accNo : item.mobileNo)}}</span>
                                    <i class="icon-del-circle" @click="delSelectCao(item,index)" v-show="delIndex.two == index"></i>
                            </li>
                        </ul>
                        <div v-show="addCaoSongState">
                            <a href="javascript:;"  class="addContacts"  @click="addCaosongList()"><i class="icon-add-circle"></i>从通讯录添加</a> 
                            <a href="javascript:;"  class="addContacts" @click="addContactsHandle(1)"><i class="icon-add-circle"></i>{{userState == 2 ? '新建联系人' : '新建签署人'}}</a>     
                        </div>                                              
                        <div class="saveTemBox"><a href="javascript:;" class="saveTem" @click="saveTem">保存模板</a><p>(保存设定的签署人，抄送人和签署次序)</p></div>
                        
                        <!-- <div class="template clf" v-if="docTemplate.list.length==0">
                            <b>你还没有模板</b>
                            <span>（你可以在完成签署设置后，保存模版，方便下次使用。模版保存内容包括设定的签署人，抄送人和签署次序）</span>
                        </div> -->
                    </div>
                </div>
            </div>
            <div class="submitBox clf">
                <div class="btn-box clf">
                    <a href="javascript:;" @click="saveDraftSure">{{submitDraft}}</a>
                    <a href="javascript:;" @click="createDocument('send')">{{submitSend}}</a>
                </div>
            </div>
        </div>
        <!-- 添加签署人弹框 -->
        <div class="modelAddSigners" v-show="addSignerState">
            <div class="modelBox">
                <div class="modelHeader">
                    <h3>从通讯录添加<b class="icon-close" @click="addSignerState = false"></b></h3>
                </div>
                <div class="modelBody clf">
                    <div class="sideLeft">
                        <div class="search">
                            <input type="text" v-model.trim="signersData.condition" @keyup.enter="searchCompanySignatoryLight(1)">
                            <i class="icon-search"></i>
                        </div>
                        <div class="sideContent">
                            <div class="group">
                                <h3>分组</h3>
                                <!-- 签署人 -->
                                <ul v-if="selectSignerIndex == 0">
                                    <li>
                                        <p class="cur" :class="[groupIndex == 1 ? 'active' : '']"  style="padding-left:30px;" @click="selectGroup(1)">所有</p>
                                    </li>
                                    <li>
                                        <p><span class="icon-seal"></span>企业签章</p>
                                        <a href="javascript:;" :class="[groupIndex == 2 ? 'active' : '']" @click="selectGroup(2)">合作伙伴</a>
                                        <a v-if="userState == 2" href="javascript:;" :class="[groupIndex == 3 ? 'active' : '']" @click="selectGroup(3)">组织架构</a>
                                        
                                    </li>
                                    <li>
                                        <p class="cur" :class="[groupIndex == 4 ? 'active' : '']" @click="selectGroup(4)"><span class="icon-sign-pen"></span>个人签名</p>                                    
                                    </li>
                                </ul>
                                <!-- 抄送人 -->
                                <ul v-if="selectSignerIndex == 1">
                                    <li v-if="userState == 2">
                                        <p class="cur" :class="[groupIndex == '1.1' ? 'active' : '']"  style="padding-left:30px;" @click="selectGroup(1.1)">所有</p>
                                    </li>
                                    <li v-if="userState == 3">
                                        <p class="cur" :class="[groupIndex == '1' ? 'active' : '']"  style="padding-left:30px;" @click="selectGroup(1)">所有</p>
                                    </li>
                                    <li>
                                        <p class="cur" :class="[groupIndex == 2 ? 'active' : '']"  style="padding-left:30px;" @click="selectGroup(2)">合作伙伴</p>
                                        
                                    </li>
                                    <li v-if="userState == 2">
                                        <p class="cur" :class="[groupIndex == 3 ? 'active' : '']"  style="padding-left:30px;" @click="selectGroup(3)">组织架构</p>
                                    </li>
                                    <li v-if="userState == 2">
                                        <p class="cur" :class="[groupIndex == '4.1' ? 'active' : '']" style="padding-left:30px;" @click="selectGroup(4.1)">联系人</p>                                    
                                    </li>
                                    <li v-if="userState == 3">
                                        <p class="cur" :class="[groupIndex == '4' ? 'active' : '']" style="padding-left:30px;" @click="selectGroup(4)">联系人</p>                                    
                                    </li>
                                </ul>
                            </div>
                            <div class="signerTable">
                                <ul class="clf">
                                    <li class="title"> 
                                        <span><b :class="[selectAll ? 'icon-check2-default':'icon-square']" @click="selectAllHandle"></b></span>
                                        <span><b class="icon-seal opacity"  v-if="selectSignerIndex == 0" ></b>名称</span>
                                        <span>账号</span>
                                    </li>
                                    <li class="loadSource" v-show="signersData.loading" :class="[cloudyState ? 'loadSource_c' : '']">
                                        <p v-if="!cloudyState"><img src="../../assets/images/loading.gif" alt="" width="80" height="51"></p>
                                        <p v-if="cloudyState"><img src="../../assets/images/logo_small.png" alt="" width="48" height="48"></p>
                                    </li>
                                    <li class="no-message" v-show="signersData.pageData.total == 0  && !signersData.loading">
                                        <p><img src="../../assets/images/noAnyThing.png" alt="" ></p>
                                        <p v-text="'暂无数据'"></p>
                                    </li>
                                    <li v-for="(item,index) in signersData.list" :key="index" @click="selectSigner(item)"> 
                                        <span ><b :class="[item.selectVal ? 'icon-check2-default':'icon-square']" ></b></span>
                                        <span class="shengl" :title="item.name + (item.companyName ? '/'+item.companyName:'')"><b v-if="selectSignerIndex == 0" :class="[item.isColleague == 2 ? 'icon-sign-pen' : 'icon-seal']"></b>{{item.name ? item.name:''}}{{item.companyName ? '/'+item.companyName:''}}</span>
                                        <span class="shengl" :title="item.isColleague == 2 ?  item.mobileNo : item.accNo">{{item.isColleague == 2 ?  item.mobileNo : item.accNo }}</span>
                                    </li>                                    
                                    <li class="pageBox">
                                        <b>共{{signersData.pageData.total}}条记录</b>
                                        <div class="page-box" >
                                            <!-- :pagegroup="2" -->
                                            <pagination :total="signersData.pageData.total" :currentpage="signersData.pageData.pageIndex" :display="signersData.pageData.pageLength"  :isShowPreNex="1" @pagechange="pageChangeHandel"></pagination>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                        </div>
                    </div>
                    <div class="sideRight">
                        <div class="selectedTable">
                            <h3>已选</h3>
                            <ul>
                                <li class="title">
                                    <span><b class="icon-seal opacity"></b>名称</span>
                                    <span>账号</span>
                                </li>
                            </ul>
                            <ul class="ul-list sign_page_scroll">
                                <li v-for="(item,index) in selectSignerArray" :key="index"  @mouseover="showDelSign(index,3)" @mouseout="hideDelSign(3)">
                                    <span class="shengl" :title="item.name + (item.companyName ? '/'+item.companyName:'')"><b :class="[item.isColleague == 2 ? 'icon-sign-pen' : 'icon-seal' , selectSignerIndex == 0 ? '' : 'opacity']"></b>{{item.name ? item.name:''}}{{item.companyName ? '/'+item.companyName:''}}</span>
                                    <span class="shengl" :title="item.isColleague == 2 ?  item.mobileNo : item.accNo">{{item.isColleague == 2 ?  item.mobileNo : item.accNo }}</span>
                                    <i class="icon-del-circle" @click="delSelect(item,index)" v-show="delIndex.three == index"></i>
                                </li>
                            </ul>
                            <div class="btnBox clf">
                                <a href="javascript:;" @click="sureAddSigners">确定</a>
                                <a href="javascript:;" @click="cancleAddSigners">取消</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modelFooter"></div>
            </div>
        </div>
        <!-- 模板里列表弹框 -->
        <!--  -->
        <div class="templateList" v-show="templateState">
            <div class="modelBox">
                <div class="modelHeader">
                    <h3>签署流程模板<b class="icon-close" @click="templateState = false"></b></h3>
                </div>
                <div class="modelBody clf ">
                    <!-- mCustomScrollbar -->
                    <ul class="sign_page_scroll">
                        <div class="no-message" v-show="docTemplate.list.length == 0">
                            <p><img src="../../assets/images/noAnyThing.png" alt="" ></p>
                            <p v-text="'暂无数据'"></p>
                        </div> 
                        <li class="row clf" v-for="(item,index) in docTemplate.list" :key="index" @click="useTem(item)" @mouseover="showDelSign(index,4)" @mouseout="hideDelSign(4)">
                            <div class="delBox"> 
                                <span class="icon-del-circle"  @click.stop="delTemplate(item.tempId)" v-show="delIndex.four == index"></span>
                            </div>
                            <div class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-7 col-md-7 col-sm-7 infoBox">
                                <h4>{{item.tempName}} <span>{{item.signOrderType == '002' ? '顺序签' : '任意签'}}</span></h4>
                                <div>
                                    <label for="">签署人 : </label>
                                    <p>
                                        <span v-for="(item2,val) in item.signators" :key="val">{{item2.name}}<b v-if="item2.companyName">【{{item2.companyName}}】</b>、
                                        </span>
                                    </p>
                                </div>
                                <div v-if="item.carbonCopies.length > 0">
                                    <label for="">抄送人 : </label>
                                    <p>
                                        <span v-for="(item2,val) in item.carbonCopies" :key="val">{{item2.name}}<b v-if="item2.companyName">/{{item2.companyName}}</b>、
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-3 col-sm-3 timeBox">
                                <p>创建日期：{{item.createTime}}</p>
                            </div>
                        </li>
                        
                    </ul>
                </div>
                <div class="modelFooter"></div>
            </div>
        </div>
        <!--新建签署流程模板-->
        <alertModel :alelrtClassWidth="'498px'" :title="'新建签署流程模板'"   :type="2"  v-show="createTemplate.state"  @cancelHandle="createTemplate.state = false" @sureHandle="sureCreateHandle">
            <div slot="alert-content" class="createTemplate">
                <div class="clf row">
                    <label for="" class="col-lg-3 col-md-3 col-sm-3">模板名称</label>
                    <div  class="col-lg-8 col-md-8 col-sm-8">
                        <input  type="text" placeholder="请输入模板名称" v-model.trim="submitTemData.tempName" @keydown.enter="sureCreateHandle">
                    </div>
                </div>
                <p class="clf">*保存设定的签署人，抄送人和签署次序，方便下次使用</p>
            </div>
        </alertModel>
        <!-- 新建签署人弹框 -->
        <alertModel :alelrtClassWidth="'498px'" :title=" userState == 3 ? '新建签署人':'新建联系人'"   :type="2"  v-show="createSigners.state"  @cancelHandle="createSigners.state = false" @sureHandle="CreateSignerHandle">
            <div slot="alert-content" class="createSigner" id="addContact" :class="[userState == 3 ? 'height' : '']">
                <div class="clf row" :class="userState == 3 ? '':'opacity'">
                    <label for="" class="col-lg-3 col-md-3 col-sm-3">类型</label>
                    <div  class="col-lg-8 col-md-8 col-sm-8 typeSelect">
                        <ul >
                            <li @click="changecreateSignersType(0)" v-if="userState == 3"><span  :class="[createSigners.type == 0 ? 'icon-radio-select' : 'icon-circle2']"></span>企业</li>
                            <li @click="changecreateSignersType(1)"><span  :class="[createSigners.type == 1 ? 'icon-radio-select' : 'icon-circle2']"></span>个人</li>
                        </ul>
                    </div>                    
                </div>
                <div class="clf row" v-if="createSigners.type == 0" >
                    <label for="" class="col-lg-3 col-md-3 col-sm-3">邮箱</label>
                    <div  class="col-lg-8 col-md-8 col-sm-8">
                        <input name="email" v-model.trim="addContacts.email" type="text" @blur="checkPartners"  placeholder="请输入邮箱">
                    </div>
                    <p style="clear:both; text-align:left;color:#ff503f;" v-show="emailExit" class="col-lg-offset-3 col-md-offset-3 col-sm-offset-3">{{emailExitTip}}</p>
                </div>                
                <div class="clf row">
                    <label for="" class="col-lg-3 col-md-3 col-sm-3">手机</label>
                    <div  class="col-lg-8 col-md-8 col-sm-8">
                        <input name="phone" v-model.trim="addContacts.phone" @blur="checkContact"  type="text" placeholder="请输入手机号码" v-if="emailReg">
                        <input name="phone" v-model.trim="addContacts.phone" @blur="checkContact"  type="text" placeholder="请输入手机号码" v-if="!emailReg" readonly class="gray">
                    </div>
                    <p style="clear:both; text-align:left;color:#ff503f;" v-show="phoneExit" class="col-lg-offset-3 col-md-offset-3 col-sm-offset-3">用户已存在</p>
                </div>               
                <div class="clf row">
                    <label for="" class="col-lg-3 col-md-3 col-sm-3">{{createSigners.type == 0 ? '企业名称' : '姓名'}}</label>
                    <div  class="col-lg-8 col-md-8 col-sm-8">
                        <input  name="username" v-model.trim="addContacts.name" type="text" :placeholder="createSigners.type == 0 ? '企业名称' : '姓名'" v-if="emailReg" >
                        <input  name="username" v-model.trim="addContacts.name" type="text" :placeholder="createSigners.type == 0 ? '企业名称' : '姓名'"v-if="!emailReg"  readonly class="gray">
                    </div>
                </div>                
                
                               
            </div>
        </alertModel>
        <alertModel :title="'保存到草稿箱'" :context="'确认保存到草稿箱？'"  :type="2" v-show="sureDraft.state" @cancelHandle="sureDraft.state = false" @sureHandle="saveDraft"></alertModel>
        <!-- 成功发起签署，轮到自己签署弹框 -->
        <div class="successAlert" v-show="successAlert.State">
            <div class="modelBox">
                <div class="moderBody">
                    <p class="tipTxt"><span class="icon-check2-default"></span>您已成功发起签约</p>
                    <p class="tipTxt2" v-if="successAlert.canToSign">您可以点击<a href="javascript:;" @click="goSign">立即签署</a>完成签约！</p>
                    <a class="goDoc" href="javascript:;" v-if="MYSEND" @click="backDocList(0)">返回文档列表</a>
                    <a class="goDoc" href="javascript:;" v-if="!MYSEND" @click="backDocList(1)">返回我发起的文档列表</a>
                </div>
                
            </div>
        </div>
        <!--发起签约错误弹框-->
        <alertModel :title="createAlertData.title" :context="createAlertData.context"   v-show="createAlertData.showAlert" >
            <p slot="alert-footer"></p>
        </alertModel>

        <!-- 发起签约包含个人签署弹框 -->
        <alertModel :title="'温馨提示'" :context="includeZyq.context" v-show="includeZyq.state">
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="includeZyq.state = false">取消</a>
                <a href="javascript:;" class="sure-btn" @click="sureHandleCreat">确定</a>
            </div>
        </alertModel>  
        <showpdf v-show="pdfShow" :docId="this.submitData.docId" @closePreview="closePreview"></showpdf>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    import '@/assets/js/plugin/jquery.form.js'; 
    import '@/assets/js/plugin/bootstrap-datepicker.js';
    import '@/assets/css/datepicker3.css';
    import draggable from 'vuedraggable';
    import showPdf from '@/components/common/getPdf/getPdf.vue'
    export default{
        name:'toFillin',
        data(){
            return{
                submitDraft:'存草稿',
                submitSend:'发送签署',
                delIndex:{
                    one:null,
                    two:null,
                    three:null,
                    four:null
                },
                includeZyq:{
                    state:false,
                    context:'',
                    errorNum:null,     //0为选择了公平签署，1为截止时间为具体时间
                },
                createAlertData:{
                    title:"警告",
                    context:"",
                    showAlert:false
                },
                createTemplate:{                 //新建签署流程模板弹框
                    state:false
                },
                createSigners:{                 //新建签署人弹框
                    state:false,
                    type:1,                     //新建类型  默认为企业（0） 个人（1）
                },
                form:{
                    warn:"",                //上传文件不符合条件的提示
                    sweetStatus:false,      //温馨提示语状态  
                    water:false,            //上传水的状态
                    warterTime:null,        //上传水定时器
                    getPdfNum:0,            //上传pdf几次
                    fairStatus:false,       //公平签署提示语状态,
                    titleTip:'',
                    memoTip:'',    
                    temMemoTip:'',          //备注临时变量                              
                },
                submitData:{
                    docId:null,
                    docName:'',
                    temDocName:'',             //docName临时变量
                    signatureType:'001',       //001默认签署方式  002是公平签署
                    durationTime:'',           //签约截止时间
                    memo:'',                   //备注
                    createDocState:true,       //发送签署是否可以点击
                },
                signOrder:'002',               //001为任意签 002顺序签  
                selectSignerIndex:null,        //添加签署人还是添加抄送人    0是添加签署人，1是添加抄送人
                selectSignerArray:[],          //选中签署人数据
                selectSignerArrayCheck:[],     //提交的选中签署人数据
                carbonCopiesArray:[],          //提交的抄送人数据
                addCaoSongState:false,         //添加抄送人状态
                /* 弹框 */
                addSignerState:false,       //添加签署人弹框状态
                groupIndex:1,               //1 所有  2合作伙伴 3组织架构  4个人签名
                signersData:{               //签署人列表数据
                    list:[],                //列表数据
                    pageData:{              //添加签署人翻页数据
                        total:0,
                        pageIndex:1,
                        pageLength:10,
                    }, 
                    loading:false,         //请求加载显示  
                    condition:'',          //搜索关键字        
                },
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false,
                },
                templateState:false,         //模板列表显示隐藏状态
                docTemplate:{                //模板列表数据
                    list:[]                  
                },
                submitTemData:{              //模板提交数据
                    tempName:'',             //模板名称
                    docName:'',              //文档名称
                },
                successAlert:{
                    State:false,
                    canToSign:false,
                    docId:null
                },
                sureDraft:{
                    state:false
                },
                addContacts:{
                    index:null,
                    name:'',    //名称、企业名称
                    phone:'',   //手机号码
                    email:'',   //邮箱
                },
                pdfShow:false,
                emailExit:false,
                emailExitTip:'',
                emailReg:true,  //新建签署人是否可以修改
                phoneExit:false,
                MYSEND:false,
                selectAll:false,    //添加签署人全选按钮
            }
        },
        components: {
            draggable,
            showpdf:showPdf
        },
        computed:{
            userState(){
                return this.$store.state.userState
            }
        },
        methods:{
            monitor(name){   //监听主题输入框(长度不能大于32，不能输入特殊字符)
                let num = this.getBt(name);
                let reg = /[\\/:*?"<>|]/;
                if(reg.test(name)){
                    this.submitData.docName = name.slice(0,name.length-1);
                }                
                if(num >= 64){
                    this.form.titleTip = '文档主题长度不超过32';
                    this.submitData.docName = this.submitData.temDocName;
                }else{
                    this.form.titleTip = '';
                    this.submitData.temDocName = this.submitData.docName;
                }
            },
            monitorMemo(name){  //监听备注长度不超过64
                let num = this.getBt(name);
                // this.form.temMemoTip = this.submitData.memo;
                if(num >= 120){
                    this.form.memoTip = '备注内容不超过64';
                    this.submitData.memo = this.form.temMemoTip;
                    
                }else{
                    this.form.memoTip = '';
                    this.form.temMemoTip = this.submitData.memo;
                }
            },
            getBt(str){
                var char = str.match(/[^\x00-\xff]/ig);
                return str.length + (char == null ? 0 : char.length);
            },
            showDelSign(index,num){   //鼠标移入删除按钮显示
                if(num == 1){
                    this.delIndex.one = index;
                }
                if(num == 2){
                    this.delIndex.two = index;
                }
                if(num == 3){
                    this.delIndex.three = index;
                }
                if(num == 4){
                    this.delIndex.four = index;
                }
            },
            hideDelSign(num){     //鼠标移出删除按钮隐藏
                if(num == 1){
                    this.delIndex.one = null;
                }
                if(num == 2){
                    this.delIndex.two = null;
                }
                if(num == 3){
                    this.delIndex.three = null;
                }
                if(num == 4){
                    this.delIndex.four = null;
                }
            },
            selectAllHandle(){        //全选按钮                
                if(this.selectAll){   //取消全选
                    this.selectAll = false; 
                    for(let i = 0 ; i < this.signersData.list.length;i++){
                        this.signersData.list[i].selectVal = false;
                        for(let j = 0 ; j < this.selectSignerArray.length; j++){
                            if(this.signersData.list[i].accId == this.selectSignerArray[j].accId && this.signersData.list[i].isColleague == this.selectSignerArray[j].isColleague){
                                this.selectSignerArray.splice(j,1);
                            }
                        }
                    }
                }else{                //全选选中
                    this.selectAll = true;
                    let addArr = [];
                    for(var i = 0 ; i < this.signersData.list.length;i++){
                        this.signersData.list[i].selectVal = true;
                        addArr.push(this.signersData.list[i]);                     
                    }
                    for(let i = 0; i < this.selectSignerArray.length; i++){
                        for(let j = 0 ; j < addArr.length ; j++){
                            if(this.selectSignerArray[i].accId == addArr[j].accId &&　this.selectSignerArray[i].isColleague == addArr[j].isColleague){
                                addArr.splice(j,1);
                            }
                        }
                    }
                    this.selectSignerArray = this.selectSignerArray.concat(addArr);
                }
            },
            searchCompanySignatoryLight(num){  //获取签署人列表
                if(num){
                    this.groupIndex = num;
                }
                let getUrl = '';
                if(this.userState == 2){
                    getUrl = this.URL.searchCompanySignatoryLight
                }else{
                    getUrl = this.URL.searchOrdinaryPartnersLight
                }
                this.signersData.loading = true;
                this.httpGet(getUrl,{
                    pageSize:this.signersData.pageData.pageLength,
                    page:this.signersData.pageData.pageIndex,
                    condition:this.signersData.condition,
                    searchType:this.groupIndex
                },(response)=>{
                    var result = response.data;
                    this.signersData.loading = false;
                    if(result.meta.success){
                        this.signersData.list = result.data.list;
                        this.signersData.pageData.total = result.data.totalCount;
                        let selectAllNum = 0;
                        for(var i = 0 ; i < this.signersData.list.length;i++){
                            for(var j = 0 ; j < this.selectSignerArray.length;j++){
                                if(this.signersData.list[i].accId == this.selectSignerArray[j].accId && this.signersData.list[i].isColleague == this.selectSignerArray[j].isColleague){
                                    this.signersData.list[i].selectVal = true;
                                    selectAllNum++;
                                }
                            }
                        }
                        if(this.signersData.list.length > 0 && (selectAllNum == this.signersData.list.length)){  //判断全选
                            this.selectAll = true;
                        }else{
                            this.selectAll = false;   
                        }
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            getDocTemplate(){               //获取模板
                this.httpGet(this.URL.getDocTemplate,{},(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        this.docTemplate.list = result.data.list;
                    }else{
                        this.alertCommonTip(result.message);
                    }
                })
            },
            sureHandleCreat(){  //包含个人签署时弹框确定
                if(this.includeZyq.errorNum == 0){
                    this.submitData.signatureType = '001';
                }
                if(this.includeZyq.errorNum == 1){
                    this.submitData.durationTime = '';
                    
                }
                
                this.includeZyq.state = false;
                this.createDocument('send');
            },
            createDocument(createType){                //发起签约
           
                if(createType == 'send'){
                    if(!this.beforeCreate()) return;
                }             
                if(!this.submitData.createDocState) return;
                
                let signOrders = [];
                let stampTypeList = [];
                let carbonCopies = [];
                let userAccId = this.$store.state.userAccId;
                for(var i = 0; i<this.selectSignerArrayCheck.length;i++){
                    signOrders.push(this.selectSignerArrayCheck[i].accId);
                    if(userAccId == this.selectSignerArrayCheck[i].accId){   //判断发起人在不在签署列表（等于表示在签署列表）
                        this.MYSEND = true;
                    }
                    if(this.selectSignerArrayCheck[i].isColleague == 2){  //个人签
                        stampTypeList.push(1);
                    }else{
                        stampTypeList.push(0); //企业签
                    }
                }
                for(var j = 0 ; j < this.carbonCopiesArray.length;j++){
                    carbonCopies.push(this.carbonCopiesArray[j].accId);                    
                }
                if(stampTypeList.in_array('1') && createType == 'send'){
                    if(this.submitData.signatureType == '002'){//公平签署
                        this.includeZyq.errorNum = 0;
                        this.includeZyq.state = true;
                        this.includeZyq.context = '包含个人签署时，暂不支持公平签署，点击确定，我们将会把公平签署修改成默认签署方式';
                        return;
                    }
                    // if(this.submitData.durationTime != ''){
                    //     this.includeZyq.errorNum = 1;
                    //     this.includeZyq.state = true;
                    //     this.includeZyq.context = '包含个人签署时，签署截止日期暂不支持固定时间，我们将会把截止日期修改成永久有效';
                    //     return;
                    // }
                }
               
                this.submitData.createDocState = false;
                if(createType == 'draft'){
                    this.submitDraft = '存储中...'
                }else{
                    this.submitSend = '发送中...'
                }
                // return false;
                this.httpPost(this.URL.createDocumentLight,{
                    docId:this.submitData.docId,                   //文档id
                    docName:this.submitData.docName,               //主题
                    memo:this.submitData.memo,                     //备注
                    orderType:this.signOrder,                      //签署顺序
                    signatureType:this.submitData.signatureType,   //签署方式   公平签署和默认签署
                    stampTypeList:stampTypeList.join(','),         //签章类型列表
                    createType:createType,                         //存草稿还是发送
                    signOrders:signOrders.join(','),               //签署人用,隔开
                    carbonCopies:carbonCopies.join(','),           //抄送人用,隔开
                    duration:this.submitData.durationTime

                },(response)=>{
                    var result = response.data;
                    if(result.meta.success){     
                        this.submitDraft = '存草稿';
                        this.submitSend = '发送签署';                   
                        if(result.data.redirect == 'draft'){
                            // window.location.href=this.linkHref+'index.html#/doc/documentList/draft';
                            this.$router.push({
                                name:"draft"
                            });
                        }else{
                            this.successAlert.State = true;
                            this.successAlert.canToSign = result.data.canToSign;
                            this.successAlert.docId = result.data.docId;
                        }
                    }else{
                        if(result.meta.message == 'bad.status'){   //文档状态错误
                            this.createAlertData={
                                title:"警告",
                                context:"文档状态错误",
                                showAlert:true
                            }
                            setTimeout(()=>{
                                window.location.href=this.linkHref+'index.html#/doc/documentList/sign';
                            },2000)
                        }
                        if(result.meta.message == 'no.login'){
                            this.createAlertData={
                                title:"警告",
                                context:"登录过期",
                                showAlert:true
                            }
                            setTimeout(()=>{
                                window.location.href=this.linkHref+'logout';
                            },1000)
                        }
                    }
                })
            },
            beforeCreate(){
                if(!this.submitData.docId){
                    this.alertCommonTip('请上传文档');
                    return false;
                }
                if(this.submitData.docName == ''){
                    this.alertCommonTip('请填写文档主题');
                    return false;
                }
                if(this.selectSignerArrayCheck.length == 0){
                    this.alertCommonTip('至少选择一个签署人才能发起签约');
                    return false;
                }
                return true;
            },
            saveDraftSure(){
               
                if(!this.submitData.docId){
                    this.alertCommonTip('请上传文档');
                    return false;
                }
                 this.sureDraft.state = true;
            },
            saveDraft(){  //确认保存到草稿箱
                this.createDocument('draft');
            },
            goSign(){  //点击立即签署
                window.location.href=this.linkHref+'doc/document/toSignDoc?docId='+this.successAlert.docId;
            }, 
            backDocList(num){   //点击返回文档列表
                // window.location.href=this.linkHref+'index.html#/doc/documentList/sign';
                if(num == 0){
                    this.$router.push({
                        name:"documentList"
                    });
                }
                if(num == 1){
                    this.$router.push({
                        name:"mySend"
                    });
                }
            },
            saveTem(){       //点击保存模板按钮
                if(this.selectSignerArrayCheck.length == 0){
                    this.alertCommonTip("至少选择一个签署人");
                    return false;
                }
                this.createTemplate.state = true;
            },
            addTemplate(){   //创建模板
                let signOrders = [];
                let stampTypeList = [];
                let carbonCopies = [];
                for(var i = 0; i<this.selectSignerArrayCheck.length;i++){
                    signOrders.push(this.selectSignerArrayCheck[i].accId);
                    if(this.selectSignerArrayCheck[i].isColleague == 2){  //个人签
                        stampTypeList.push(1);
                    }else{
                        stampTypeList.push(0); //企业签
                    }
                }
                for(var j = 0 ; j < this.carbonCopiesArray.length;j++){
                    carbonCopies.push(this.carbonCopiesArray[j].accId);                    
                }
                this.httpPost(this.URL.addTemplate,{
                    tempName:this.submitTemData.tempName,  //模板名称
                    docName:'',
                    signOrderType:this.signOrder,                 //签署顺序
                    signatureType:this.submitData.signatureType,  //签署方式   公平签署和默认签署
                    stampTypes:stampTypeList.join('|'),           //签章类型列表
                    signators:signOrders.join('|'),               //签署人 用|隔开
                    carbonCopies:carbonCopies.join('|')           //抄送人

                },(response)=>{
                    var result = response.data;
                    this.createTemplate.state = false;
                    if(result.meta.success){
                        this.submitTemData.tempName = '';
                        // this.showAlertData={            //公共弹框参数
                        //     showAlert:true,
                        //     title:"成功创建模板",
                        //     context:"成功创建模板，下次可以直接使用模板"
                        // }
                        this.alertCommonTip('成功创建模板，下次可以直接使用模板');
                        this.getDocTemplate();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                    
                })
            },
            delTemplate(tempId){  //删除模板
                this.httpGet(this.URL.delDocTemplate,{
                    tempId:tempId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.getDocTemplate();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            useTem(item){   //使用模板
                this.selectSignerArrayCheck = item.signators;
                this.carbonCopiesArray = item.carbonCopies;
                this.signOrder = item.signOrderType; 
                this.templateState = false;

            },
            selectGroup(val){             //选择分组
                this.groupIndex = val;
                this.signersData.pageData.pageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.searchCompanySignatoryLight();
            },
            addMailList(){               //从通讯录添加签署人
                this.selectSignerIndex = 0;
                this.Event2.$emit('tip2',1);
                this.groupIndex = 1;
                this.cancleAddSigners();
                this.searchCompanySignatoryLight();
                this.addSignerState = true;
            },
            addCaosongList(){            //从通讯录添加抄送人
                this.selectSignerIndex = 1;
                if(this.userState == 2){
                    this.groupIndex = 1.1;
                }else{
                    this.groupIndex = 1;
                }
                this.Event2.$emit('tip2',1);
                this.cancleAddSigners();
                this.searchCompanySignatoryLight();
                this.addSignerState = true;
            },
            selectSigner(item){         //选择签署人
                if(item.selectVal){     //取消选中
                    this.selectAll = false;       
                    item.selectVal = false;
                    for(var i = 0 ; i < this.selectSignerArray.length;i++){
                        if(this.selectSignerArray[i].accId == item.accId && this.selectSignerArray[i].isColleague == item.isColleague){
                            this.selectSignerArray.splice(i,1);
                            return;                        
                        }
                    }                    
                }else{   //选中
                    item.selectVal = true;                    
                    this.selectSignerArray.push(item);
                    let selectAllNum = 0;
                    for(let i = 0 ; i < this.signersData.list.length; i++){
                        for(let j = 0 ; j < this.selectSignerArray.length ; j++){
                            if(this.signersData.list[i].accId == this.selectSignerArray[j].accId && this.signersData.list[i].isColleague ==  this.selectSignerArray[j].isColleague){
                                selectAllNum ++;
                            }
                        }
                    }
                    if(selectAllNum == this.signersData.list.length){
                        this.selectAll = true;
                    }
                }
            },
            delSelect(item,index){          //删除已选联系人
                this.selectSignerArray.splice(index,1);
                for(var i = 0; i<this.signersData.list.length;i++){
                    if(this.signersData.list[i].accId == item.accId && this.signersData.list[i].isColleague == item.isColleague){
                        this.signersData.list[i].selectVal = false;
                        return;                        
                    }
                }
            },
            delSelectMail(item,index){      //删除通讯录已选联系人
                this.selectSignerArrayCheck.splice(index,1);
            },
            delSelectCao(item,index){      //删除通讯录已选联系人
                this.carbonCopiesArray.splice(index,1);
            },
            sureAddSigners(){               //签署人弹框确定 （弹框外面已选要等于弹框里面已选）
                this.addSignerState = false;
                if(this.selectSignerIndex == 0){   //添加签署人
                    this.selectSignerArrayCheck = [];
                    for(var i = 0; i < this.selectSignerArray.length;i++){
                        this.selectSignerArrayCheck.push(this.selectSignerArray[i]);
                    }
                }
                
                if(this.selectSignerIndex == 1) {   //添加抄送人
                    this.carbonCopiesArray = [];
                    for(var i = 0; i < this.selectSignerArray.length;i++){
                        this.carbonCopiesArray.push(this.selectSignerArray[i]);
                    }
                }
            },
            cancleAddSigners(){             //取消签署人弹框确定（弹框里面已选要等于弹框外面已选）            
                this.selectSignerArray =  [];
                if(this.selectSignerIndex == 0){
                    for(var i = 0 ; i < this.selectSignerArrayCheck.length;i++){
                        this.selectSignerArray.push(this.selectSignerArrayCheck[i])
                    }
                }
                if(this.selectSignerIndex == 1){
                    for(var i = 0 ; i < this.carbonCopiesArray.length;i++){
                       
                        this.selectSignerArray.push(this.carbonCopiesArray[i]);
                    }
                }
                this.addSignerState = false;
            },
            sureCreateHandle(){     //确认添加模板
                if(this.submitTemData.tempName == ''){
                    this.alertCommonTip("模板名称不能为空");
                    return false;
                }
                this.addTemplate();
            },
            addContactsHandle(val){
                this.addContacts.name = this.addContacts.phone = this.addContacts.email = '';
                this.emailExit = false;
                this.emailReg = true;
                this.addContacts.index = val;
                if(this.userState == 2){
                    this.createSigners.type = 1;
                }else{
                    this.createSigners.type = 0;
                }
                this.createSigners.state = true 
            },
            CreateSignerHandle(){   //确认新建签署人
                if(!this.validatePlugin($('#addContact'))){return false;}
                let urlLink = null;
                let subData = {};
                if(this.createSigners.type == 1){   //联系人
                    urlLink = this.URL.addAccountContact;
                    subData = {
                        accNo:'',
                        name:this.addContacts.name,
                        phone:this.addContacts.phone,
                        memo:''
                    }
                }else{
                    urlLink = this.URL.ajaxAddOrdinaryPartners;
                    subData = {
                        'account.accNo':this.addContacts.email,
                        'account.displayName':this.addContacts.name,
                        'account.mobileNo':this.addContacts.phone
                    }
                }
                this.httpGet(urlLink,subData,(response)=>{
                    var result = response.data;
                    if(result.meta.success){   
                        this.createSigners.state = false;
                        if(this.addContacts.index == 0){   //新建签署人添加联系人
                            this.selectSignerArrayCheck.push(result.data);
                        }
                        if(this.addContacts.index == 1){   //添加抄送人添加签署人
                            this.carbonCopiesArray.push(result.data);
                        }
                        this.addContacts.name = this.addContacts.phone = this.addContacts.email = '';
                    }else{
                        if(result.meta.message == 'deleted.user'){
                            this.alertCommonTip('该用户已被停用');
                        }else{
                            this.alertCommonTip(result.meta.message);
                        }                        
                    }
                })
            },
            selectFile(){
                var _this = this;
                var TimerUpload = null ;
                $("#file").unbind().on('change',function(){
                    var arrTem = [];
                    arrTem = this.value.split("\\");
                    _this.uploadFileName = arrTem[arrTem.length-1];
                    $('#uploadForm').ajaxSubmit({  
                    url : _this.apiPath+_this.URL.uploadProgress,  
                    xhrFields: {
                            withCredentials: true
                    },
                    type:'post',
                    beforeSubmit: function() {
                        var val = $(':file').fieldValue();  
                        var arr = val[0].split('.');              
                        var Suffix = arr[arr.length-1];
                        if (val == "") {
                            return false;
                        }
                        if(Suffix != 'pdf' && Suffix != 'doc' && Suffix != 'docx' && Suffix != 'wps' && Suffix != 'xls' && Suffix != 'jpg' && Suffix != 'png'){
                            _this.uploadWarn = true;
                            _this.form.warn = '不支持该格式文档<br/>支持 doc/docx/pdf/wps/xls<br/>以及jpg/png格式，大小<10M';
                            return false;
                        }   
                        var oMyFile = document.getElementById('file');
                        
                        if(oMyFile.files){  //判断ie是否支持此属性
                            var fileName = oMyFile.files[0].size / 1048576 ;
                                if(fileName > 10 ){
                                    _this.form.warn = '上传文件不得大于10M';
                                    $("#file").val("");
                                    $("#file").removeAttr('disabled');
                                    return false;
                                } 
                        }
                       _this.form.warn='';
                       var arr2 = arr[0].split("\\");
                       if(_this.submitData.docName == ''){
                            _this.submitData.docName = arr2[arr2.length-1]
                       }                       
                        $("#file").attr('disabled','disabled');  
                        
                        //上传水效果
                        _this.form.water = true;
                        if(_this.form.water){                            
                            let warterNum = 0;
                            _this.warterTime = setInterval(()=>{
                                warterNum++;
                                _this.form.warn = warterNum+'%';
                                $('.warter').css('top',(100-warterNum)+'%');
                                if(warterNum >= 93){
                                    clearInterval(_this.warterTime);
                                }
                            },30)
                        }
                        },
                        success: function(res){
                            let result = JSON.parse(res)
                            if(result.meta.success){
                                _this.submitData.docId = result.data.docId;
                                _this.getPdfPreview();
                            }else{
                                _this.alertCommonTip(result.meta.message);
                            }
                        },
                        error:function(res){
                            if(res.statusText == "timeout"){
                                _this.alertCommonTip("服务器繁忙，请稍后再试");
                                $("#file").val("");
                                $("#file").removeAttr('disabled');
                            }
                        
                        },
                        timeout:30000
                    });

                })

            },
            getPdfPreview(){
                this.httpGet(this.URL.getPdfPreview,{
                    docId:this.submitData.docId,
                },(response)=>{
                    var result = response.data;
                       
                    if(result.result == '001'){
                        $("#file").removeAttr('disabled');  
                        clearInterval(this.warterTime);
                        this.form.water = false;
                        this.form.getPdfNum = 0;
                        this.form.warn = '100%';
                        setTimeout(()=>{
                            this.form.warn = '读取预览完毕';
                        },300)
                        $('.warter').css('top','0%');
                        $('.form-box').find('.bg').attr('src','data:image/png;base64,'+result.imgBase64);
                    }else{
                        this.form.getPdfNum ++;
                        if(this.form.getPdfNum <= 3){
                            this.getPdfPreview();
                        }
                    }
                })
            },
            pageChangeHandel(val){  //弹框翻页
                this.signersData.pageData.pageIndex = val;
                this.searchCompanySignatoryLight();
            },
            searchCompanySignatory(){
                this.httpGet(this.URL.getUploadDoc,{
                    docId:this.submitData.docId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.submitData.docName = result.data.docName;
                        this.submitData.durationTime=result.data.duration;
                        this.submitData.memo = result.data.memo;
                        this.submitData.signatureType = result.data.signatureType;
                        this.signOrder = result.data.signOrder ? result.data.signOrder : '002';
                        this.selectSignerArrayCheck = result.data.signators;
                        this.carbonCopiesArray = result.data.carbonList;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            previewHandle(){   //点击预览
                if(this.submitData.docId){
                    this.pdfShow = true;
                    this.Event2.$emit('getpdf',0,this.submitData.docId);
                }
                
            },
            closePreview(){   //关闭预览弹框
                this.pdfShow = false;
            },
            changecreateSignersType(num){
                this.createSigners.type = num;
                this.addContacts.name = this.addContacts.phone = this.addContacts.email = '';
            },
            checkContact(){   //手机自动补全
                if(this.createSigners.type == 1){
                    this.httpGet(this.URL.checkContact,{
                        phone:this.addContacts.phone
                    },(response)=>{
                        let result = response.data;
                        if(result.meta.meta != 'not.exist'){
                            this.addContacts.name = result.data.name;
                        }
                    })
                }
            },
            checkPartners(){   //邮箱自动补全
                if(this.createSigners.type == 0){
                    this.httpGet(this.URL.checkPartnerSmall,{
                        accNo:this.addContacts.email
                    },(response)=>{
                        let result = response.data;
                        if(result.meta.success){
                            this.emailExit = false;
                            this.addContacts.name = result.data.companyName;
                            this.addContacts.phone = result.data.mobileNo;   
                            // this.addPar.exit = true;
                            this.emailReg = false;
                        }else{
                            let msg = result.meta.message;
                            if(msg == 'Exist'){
                                this.emailExit = true;
                                this.emailExitTip= "合作伙伴已经存在。";
                            }else if(msg == 'Myself'){
                                this.emailExit = true;
                                this.emailExitTip = "不能添加己方单位作为合作伙伴";
                            }else if(msg == 'Admin'){
                                this.emailExit = true;
                                this.emailExitTip = "不能添加管理员作为合作伙伴。";
                            }else{ //(not)
                                this.emailExitTip = '';
                                this.emailExit = false;
                            }
                             this.emailReg = true;
                        }
                       /* if(result.resultCode != 'not.exist'){  //用户存在
                            this.addContacts.phone = result.account.mobileNo;
                            if(result.account == 3){  //小b
                                this.addContacts.name = result.account.displayName;                                
                            }
                            if(result.account == 2){
                                this.addContacts.name = result.account.name+'/'+result.account.companyName;
                            }
                        }*/
                        
                    })
                }
            },
            init(){
                 var This = this;
                /*日期控件*/
                $('#date_start').datepicker({
                    todayBtn: "linked",
                    startDate:new Date(),
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight: true,
                    format: 'yyyy-mm-dd',  
                    
                }).on("changeDate",(e) => {
                    this.submitData.durationTime = $("#date_start").find('input').val();
                    $('#date_start').find('input').val(this.submitData.durationTime);
                });
            }        
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-发起签约";
            }else{
                document.title="签吧-发起签约";
            }
            this.init();
            this.getDocTemplate();
            if(this.getUrlPara('docId')){
                .0 
                this.submitData.docId = this.getUrlPara('docId');
                this.getPdfPreview();
                this.searchCompanySignatory();
            }
            var Timer = setInterval(()=>{               
                if(this.userState){
                    clearInterval(Timer);
                    this.searchCompanySignatoryLight();
                }
            },300);            
            this.$store.dispatch('changeTitle',"我的文档 > 发起签约");
        }
    }
</script>
<style lang="scss" scoped>
// @import 'tofill.scss';

.toFillin{
    $white:#fff;
    $pink:#ff503f;
    $borderEd:#ededed;
    $gray3a:#3a3a3a;
    $colorCCC:#CCC;
    $color4B4B4B:#4b4b4b;
    .fileContent{
        background:$white;
        h3{
            height: 50px;
            line-height: 50px;
            text-indent: 1%;
            font-weight: normal;
            border-bottom: 1px  $borderEd  solid;
        }
        .formBox{
            padding: 30px 0;
            position: relative;
            .sideLeft{
                position: absolute;
                top: 30px;
                left: 0;
                width: 250px;
                .form-box{
                    width: 200px;
                    height: 200px;
                    display: block;
                    margin: 0 auto;
                    border: 1px $borderEd solid;
                    position: relative;
                    overflow: hidden;
                    .bg{
                        display: block;
                        margin: 0 auto;
                        padding-top: 10px;
                    }
                    .warn{
                        font-size: 12px;
                        padding: 5px 10px;
                        text-align: center;
                        color: $pink;
                        line-height: 15px;
                    }
                    .icon-warn{
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        color:$pink;   
                        z-index: 100;                     
                    }
                    .sweet{
                        display: block;
                        width:170px;
                        position: absolute;
                        text-align: left;
                        background: rgba(0,0,0,0.8);
                        -webkit-border-radius:4px;
                        -ms-border-radius:4px;
                        -moz-border-radius:4px;
                        border-radius:4px;
                        right: 10px;
                        bottom: 35px;
                        padding: 5px 5px;                        
                        color: #fff;
                        line-height: 20px;
                        p{
                            font-size: 12px;
                            transform:scale(0.9);
                            -ms-transform:scale(0.9);
                        }
                        .triangle2{
                            width: 0;
                            height: 0;
                            border: 5px solid;
                            position: absolute;
                            bottom: -10px;
                            display: block;
                            right:5px;
                            border-color: rgba(0,0,0,0.8) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);
                        }
                    }
                    .warter{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        background: rgba(30,187,238,0.6);
                        z-index: 10;
                    }
                }
                #uploadForm{
                    .upload-btn{
                        width: 150px;
                        height: 45px;
                        border: 1px $pink solid ;
                        border-radius: 5px;
                        -ms-border-radius:5px;
                        margin: 20px auto;
                        overflow: hidden;
                        position: relative;
                        p{
                            text-align: center;
                            line-height: 43px;
                            font-size: 16px;
                            color: $pink;
                        }
                        input{
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            font-size: 50px;
                            opacity: 0;
                            top: 0;
                            left: 0;
                        }
                    }
                }
            }
            .sideRight{
                padding-left: 300px;
                padding-top: 20px;
                .formGroup{
                    position: relative;
                   .inputControl{
                       margin-bottom: 15px;
                       label{
                           text-align:right;
                           color: $gray3a;
                           span{
                               padding-right: 15px;
                               line-height: 35px;
                               height: 35px;

                               b{
                                   color: $pink;
                                   padding: 0 15px;
                               }
                           }
                       }
                       input{
                           height: 35px;
                           line-height: 35px;
                           border: 1px $borderEd solid;
                           text-indent: 10px;
                       }
                       textarea{
                           border: 1px $borderEd solid;
                           height: 120px;
                           line-height:25px;
                           text-indent: 10px;
                           resize: none;
                       }
                       .fair{
                           padding-left: 10px;
                           span{
                               line-height: 35px;
                               margin-left: 5px;
                               float: left;
                               &.icon-check2-default{
                                   font-size: 20px;
                                   &.active{
                                       color: $pink;
                                   }
                               }
                               &:nth-child(1){
                                   color: $colorCCC;
                               }
                               &:nth-child(3){
                                   color: $pink;
                                   position: relative;
                                   .sweet{
                                        width:250px;
                                        position: absolute;
                                        bottom:40px;
                                        left:50%;
                                        margin-left:-140px;
                                        background: rgba(0,0,0,0.8);
                                        padding:10px;
                                        color: #fff;
                                        font-size:10px;
                                        -webkit-border-radius:5px;
                                        -moz-border-radius:5px;
                                        -ms-border-radius:5px;
                                        border-radius:5px;
                                        p{
                                            font-size: 12px;
                                            line-height: 20px;
                                        }
                                        .triangle2{
                                            width:0;
                                            height:0;
                                            border:5px solid;
                                            position: absolute;
                                            bottom:-10px;
                                            left:135.5px;
                                            display: block;
                                            border-color:rgba(0,0,0,0.8) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);
                                        }
                                    }
                               }
                           }
                       }
                       .titleTip{
                           color: $pink;
                           clear: both;
                       }
                   } 
                   .calendarBox{
                       position: relative;
                       input{
                           width: 100%;
                           text-indent: 10px;
                       }
                       .add-on{
                           position: absolute;
                           top: 8px;
                           right: 0;
                       }
                   }
                }
            }
        }
    }
    .signSetting{
        margin-top: 30px;
        background: $white;
        padding-bottom: 20px;
        margin-bottom:120px;
        .title{
            text-indent: 1%;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px $borderEd solid;
            font-weight: normal;
        }
        .settingBox{
            padding: 0 20px;
        }
        .template{
            margin:20px auto;
            padding:15px;
            width: 96%;
            float: left;
            background: #FFF4F3;
            clear: both;
            b,a{
                color: $pink;
                font-weight: normal;
            }
            a{
                text-decoration: underline;
            }
            span{
                color: #FFA49B;
            }
        }
        .signWay{
            clear: both;
            padding-bottom: 30px;
            h4{
                line-height: 45px;
                // font-weight: normal;
            }
            ul{
                li{
                    cursor: pointer;
                   span{

                        &.icon-circle2,&.icon-radio-select{
                            color: $pink;
                            margin-right: 10px;
                        }
                        b{
                            font-weight: normal;
                            color: $colorCCC;
                        }
                   }  
                }
            }
        }
        .addSingers,.addCaoSong{
            h4{
                line-height: 45px;
            }
            ul{
                li{
                    height: 50px;
                    line-height: 50px;
                    border-left: 4px $pink solid;
                    margin: 5px auto 5px 0;
                    padding-left: 20px;
                    width: 800px;
                    position: relative;
                    cursor: pointer;
                    span{
                        display: block;
                        float: left;
                        text-align: center;
                        -webkit-user-select:none;                        
                        -moz-user-select:none;                    
                        -ms-user-select:none;                    
                        user-select:none;
                        height: 50px;
                        &:nth-child(1){
                            width: 50px;
                            b{
                                color: #cdc2cd;
                            }
                        }
                        &:nth-child(2){
                            width: 50px;
                        }
                        &:nth-child(3){
                            width: 50px;
                        }
                        &:nth-child(4){
                            width: 150px;
                            text-align: left;
                        }
                        &:nth-child(5){
                            padding-left: 20px;
                        }
                    }
                    i{
                        position: absolute;
                        right: 20px;
                        top: 0;
                        line-height: 50px;
                        color: $color4B4B4B;
                    }
                    &:hover{
                        box-shadow:0 0 5px #ccc;
                        -ms-box-shadow:0 0 5px #ccc;
                    }
                }
            }
            .addContacts{
                width: 150px;
                display: block;
                margin-top: 20px;
                color: #000;
                &:hover{
                    color: $pink;
                }
                i{
                    color: $pink;
                    margin-right: 10px;
                }
            }
        }
        .addCaoSong{
            padding-top: 20px;
            h4{
                line-height: 45px;                
                span{
                    color: $colorCCC;
                    font-weight: normal;
                    margin-left: 10px;
                    i{
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }
            .addContacts{
                width: 150px;
                display: block;
                margin-bottom: 20px;
                color: #000;
                &:hover{
                    color: $pink;
                }
                i{
                    color: $pink;
                    margin-right: 10px;
                }
            }
            .saveTemBox{
                margin: 30px 0 0;
                .saveTem{
                    width: 200px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    border: 1px $colorCCC solid;
                    display: block;                    
                    border-radius: 5px;
                    color: #000;
                    margin-right: 20px;
                    float: left;
                }
                p{
                    line-height: 45px;
                    height: 45px;
                }
            }
        }
    }
    .submitBox{
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        background: rgba(0,0,0,0.5);
        .btn-box{
            width: 300px;
            display: block;
            margin: 20px auto;
            padding-left: 170px;
            a{
                width: 120px;
                float: left;
                height: 40px;
                line-height: 40px;
                border-radius: 5px;
                -ms-border-radius:5px;
                color: #000;
                // border: 1px $colorCCC solid;
                float: left;
                text-align: center;
                background: #fff;
                &:nth-child(2){
                    float: right;
                    color:$white;
                    background: $pink;
                }
            }
        }
    }
    //添加签署人弹框   模板列表弹框
    .modelAddSigners,.templateList,.successAlert{
        background: rgba(0,0,0,0.8);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        .modelBox{
            width: 80%;
            position: absolute;
            left: 50%;
            top: 50%;
            background: $white;
            border-radius: 10px;
            -ms-border-radius:10px;
            transform: translate(-50%,-50%);
            -ms-transform: translate(-50%,-50%);
        }
        .modelHeader{
            padding: 5px 0;
            border-bottom: 1px $borderEd solid;
            h3{
                line-height: 40px;
                height: 40px;
                padding-left: 1%;
                b{
                    float: right;
                    font-size: 20px;
                    padding-right: 10px;
                    cursor: pointer;
                }
            }
        }
        .modelBody{
            .sideLeft{
                width: 65%;
                float: left;
                .search{
                    width: 90%;
                    margin: 0 auto;
                    padding: 10px 0;
                    position: relative;
                    input{
                        width: 100%;
                        height: 35px;
                        line-height: 35px;
                        border: 1px $borderEd solid;
                        text-indent: 40px;
                        box-sizing:border-box;
                        -moz-box-sizing:border-box; /* Firefox */
                        -ms-box-sizing:border-box;
                        -webkit-box-sizing:border-box; /* Safari */
                    }
                    i{
                        position: absolute;
                        height: 35px;
                        line-height: 35px;
                        left: 1%;
                        top: 12px;
                        font-size: 18px;
                        color: $color4B4B4B;
                    }
                }
                .sideContent{
                    width: 90%;
                    margin: 0 auto;
                    .group{
                        border: 1px $borderEd solid;
                        box-sizing:border-box;
                        -moz-box-sizing:border-box; /* Firefox */
                        -webkit-box-sizing:border-box; /* Safari */
                        width: 30%;
                        float: left;
                        height: 580px;
                        h3{
                            height: 45px;
                            line-height: 45px;
                            padding-left: 10px;
                            font-weight:normal;
                        }
                        ul{
                            li{
                                line-height: 45px;
                                border-bottom: 1px $borderEd solid;
                                text-indent: 10px;
                                color: $color4B4B4B;
                                span{
                                    margin-right: 10px;
                                }
                                p{
                                    line-height: 45px;
                                    &.cur{
                                        cursor: pointer;
                                        &:hover{
                                            color: $pink;
                                        }
                                    }
                                }
                                a{
                                    padding-left:45px;
                                    display: block;
                                    color: $color4B4B4B;
                                    &:hover{
                                        color: $pink;
                                    }
                                }
                                .active{
                                    background: #99c6f7;
                                }
                            }
                        }
                    }
                    .signerTable{
                        height: 580px;
                        width:70%;
                        float: left;
                        margin-left: -1px;
                        box-sizing:border-box;
                        -moz-box-sizing:border-box; /* Firefox */
                        -webkit-box-sizing:border-box; /* Safari */
                        border: 1px $borderEd solid;
                        position: relative;
                        ul{
                            width: 100%;
                            li{
                                cursor: pointer;
                                height: 45px;
                                line-height: 45px;
                                display: block;
                                clear: both;
                                background: #f6f7fc;
                                span{
                                    float: left;
                                    &:nth-child(1){
                                        width: 20%;     
                                        text-align: center;
                                        b{
                                            font-size: 20px; 
                                            color: $colorCCC;
                                            position: relative;
                                            &.icon-check2-default{
                                                color: $pink;
                                            }
                                        }                                  
                                    }
                                    &:nth-child(2){
                                        width:48%;   
                                        padding-right: 2%;
                                        b{
                                            color: $color4B4B4B;
                                            margin-right: 3px;
                                        }                                     
                                    }
                                    &:nth-child(3){
                                        width:28%;
                                        padding-right: 2%;                                        
                                    }
                                }
                                &.title{
                                    background: #fff;
                                    border-bottom: 1px $borderEd solid;
                                }
                                &:nth-child(2n){
                                    background: #fff;
                                }
                                &.pageBox{
                                    position: absolute;
                                    width: 100%;
                                    bottom: 0;
                                    b{
                                        color: $colorCCC;
                                        padding-left: 20px;
                                        font-weight: normal;
                                    }
                                    
                                }
                                .page-box{
                                    position: static;
                                    float: right;
                                    margin-top: 5px;
                                }
                                &.no-message{
                                    height: auto;
                                    background: #fff;
                                }
                            }
                        }
                    }
                }
            }
            .sideRight{
                width: 35%;
                height: 650px;
                float: left;
                box-sizing:border-box;
                -moz-box-sizing:border-box; /* Firefox */
                -webkit-box-sizing:border-box; /* Safari */
                border-left: 1px $borderEd solid;
                .selectedTable{
                    h3{
                        height: 55px;
                        line-height: 55px;
                        padding-left: 30px;
                        border-bottom: 1px $borderEd solid;
                    }
                    ul{
                        li{
                            height: 45px;
                            line-height: 45px;
                            display: block;
                            clear: both;
                            position: relative;
                            .icon-del-circle{
                                position: absolute;
                                left: 90%;
                                top: 0;
                                line-height: 45px;
                                color: $color4B4B4B;
                                cursor: pointer;
                            }
                            &:last-child{
                                background: #f6f7fd;
                            }
                            span{
                                float: left;
                                &:nth-child(1){
                                    width:53%;   
                                    padding-right: 2%;
                                    b{
                                        color: $color4B4B4B;
                                        margin-right: 5px;
                                        margin-left: 5px;
                                    }                                     
                                }
                                &:nth-child(2){
                                    width:35%;
                                    padding-right: 10%;                                        
                                }
                            }
                            // &:nth-child(2){
                            //     background: #f6f7fc;
                            // }
                            &.pageBox{
                                position: static;
                                b{
                                    color: $colorCCC;
                                    padding-left: 20px;
                                    font-weight: normal;
                                }
                                
                            }
                            .page-box{
                                position: static;
                                float: right;
                            }
                            &.title{
                                background: #fff;
                                border-bottom: 1px $borderEd solid;
                            }
                        }
                        &.ul-list{
                            height: 450px;
                            overflow-y: auto;
                        }
                    }
                    .btnBox{
                        width: 180px;
                        margin: 20px auto 0;
                        a{
                            float: right;
                            width: 80px;
                            height: 35px;
                            line-height: 35px;
                            border-radius: 2px;
                            -ms-border-radius:2px;
                            text-align: center;
                            background: #e6e6e6;
                            color: $color4B4B4B;
                            margin-right: 20px;
                            &:nth-child(1){
                                background: $pink;
                                color: #fff;
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
    }
    //成功发起签约弹框
    .successAlert{
        .modelBox{
            width: 400px;
            padding: 50px 20px;
            .moderBody{
                .tipTxt{
                    text-align: center;
                    width: 300px;
                    margin: 0 auto;
                    height: 50px;
                    line-height: 50px;
                    background: #efefef;
                    font-size: 18px;
                    .icon-check2-default{
                        color: $pink;
                        font-size: 18px;
                        margin-right:15px;
                    }
                }
                .tipTxt2{
                    text-align: center;
                    line-height: 50px;
                    font-size: 16px;
                    a{
                        text-decoration: underline;
                        color: $pink;
                        margin: 0 5px;
                        font-size: 16px;
                    }
                }
                .goDoc{
                    line-height: 60px;
                    text-align: center;
                    text-decoration: underline;
                    text-align: center;
                    margin: 0 auto;
                    display:block;
                    color: $pink;
                }
            }
        }
    }
    /*新建模板*/
    .createTemplate{
        label{
            height: 35px;
            line-height: 35px;
        }
        input{
            height: 35px;
            line-height: 35px;
            border: 1px $borderEd solid;
            width: 100%;
            text-indent: 10px;
        }
        p{
            padding-top: 15px;
            font-size: 12px;
            color: $pink;
            padding-left: 14%;
        }
    }
    /*新建签署人*/
    .createSigner{
        &.height{
            height: 206px;
        }
        .row{
            margin-bottom: 20px;
            label{
                height: 35px;
                line-height: 35px;
            }
            input{
                height: 35px;
                line-height: 35px;
                border: 1px $borderEd solid;
                width: 100%;
                text-indent: 10px;
            }
        }
        .typeSelect{
            ul{
                li{
                    width:40%;
                    float: left;
                    text-align: left;
                    line-height: 35px;
                    cursor: pointer;
                    span{
                        margin-right: 5px;
                        color: $pink;
                    } 
                }
            }
        }
    }
    .templateList{
        .modelBox{
            max-width: 1000px;
            .modelBody{
                ul{
                    height: 500px;
                    overflow-y: auto;
                    li{
                        padding: 1% 1%;
                        line-height: 24px;
                        position: relative;
                        border-bottom: 1px $borderEd solid;
                        cursor: pointer;
                        // &:last-child{
                        //     border-bottom: none;
                        // }
                        .delBox{
                            width: 8%;
                            text-align: center;
                            position: absolute;
                            height: 90%;
                            text-align: center;
                            right: 0;
                            top: 0;
                            span{
                                font-size: 14px;
                                color: $color4B4B4B;
                                position: absolute;
                                top:12px;
                                left: 50%;
                                width: 28px;
                                // transform: translate(-50%,-50%);
                                // -ms-transform: translate(-50%,-50%);
                            }
                            
                        }
                        .infoBox{
                            h4{
                                line-height: 30px;
                                span{
                                    font-weight: normal;
                                    font-size: 12px;
                                    display: inline-block;
                                    border: 1px $pink solid;
                                    height: 20px;
                                    line-height:20px;
                                    color: $pink;
                                    padding: 0 5px;
                                    border-radius: 5px;
                                    margin-left: 5px;

                                }
                            }
                            label{
                                float: left;                                
                            }
                            p{
                                padding-left: 60px;
                                span{
                                    b{
                                        font-weight: normal;
                                    }
                                }
                            }
                        }
                        .timeBox{
                            text-align: right;
                            color: $colorCCC;
                            p{
                                padding-right: 5%;
                                line-height: 30px;
                            }
                        }
                        
                    }
                }
            }
        }
    }
}
</style>

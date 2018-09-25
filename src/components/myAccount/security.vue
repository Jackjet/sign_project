<template>
    <div class="security">
        <div class="right_col">
            <div class="panel-box panel-white security_box clf">
                <div class="side_left">
                    <canvas class="process" width="180px" height="180px">50%</canvas>
                    <p class="safety_text">低</p>
                    <p class="txt">安全等级</p>
                </div>
                <div class="side_right">
                    <ul>
                        <li class="clf" v-if="userState == 1">
                            <span><b :class="[serviceCert ? 'icon-ok2' : 'icon-reduce']"></b>{{serviceCert ? '已绑定':'未绑定'}}</span>
                            <span>接口证书</span>
                            <span>用于调用接口时对参数签名值进行验签</span>
                            <span>
                                <a href="javascript:;" @click="uploadCert" :class="[hasCertTxt == '上传证书' ? 'red':'']">{{hasCertTxt}}
                                    <form id="uploadForm" method="post"  enctype="multipart/form-data">
                                        <input id="uploadCert" type="file" name="uploadCert" />
                                    </form>
                                </a>
                            </span>
                        </li>
                        <li class="clf" v-if="userState == 2">
                            <span><b :class="[accExtType == '001' ? 'icon-ok2':'icon-reduce']"></b>{{accExtType == '001' ? '已实名认证':'未完成'}}</span>
                            <span>身份认证</span>
                            <span>用于提升账号的安全性和信任级别。认证后的有签署的账号不能修改认证信息。</span>
                            <span v-if="accExtType == '001'"><a href="javascript:;">已实名认证</a></span>
                            <span v-else><a href="javascript:;" @click="realClick" class="red">实名认证</a></span>
                            
                        </li>
                        <li class="clf" v-if="userState == 3">
                            <span><b :class="[accExtType == '001' ? 'icon-ok2':'icon-reduce']"></b>{{accExtType == '001' ? '已实名认证': accExtType == '002'?'待审核':'未完成'}}</span>
                            <span>身份认证</span>
                            <span>用于提升账号的安全性和信任级别。认证后的有签署的账号不能修改认证信息。</span>
                            <span v-if="accExtType == '001'"><a href="javascript:;">已实名认证</a></span>
                            <span v-else><a href="javascript:;" @click="realClick" class="red">{{accExtType == '002' ? '重新上传' : '实名认证'}}</a></span>
                            
                        </li>
                        <li class="clf">
                            <span><b class="icon-ok2"></b>已设置</span>
                            <span>登录密码</span>
                            <span>安全性高的密码可以使账号更安全。建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。</span>
                            <span><a href="javascript:;" @click="showRegister(2)">修改密码</a></span>
                        </li>
                        <li  class="clf">
                            <span><b :class="[mobileStatus == 1 ? 'icon-ok2':'icon-reduce']"></b>{{mobileStatus == 1 ? '已绑定':'未完成'}}</span>
                            <span>绑定手机</span>
                            <span>绑定手机后，您即可享受丰富的手机服务，如注册通知、验证码等。</span>
                            <span  v-if="mobileStatus != 1"><a href="javascript:;" @click="showRegister(1)">绑定手机</a></span>
                            <span  v-else-if="mobileStatus == 1 &&　accExtType != '001'"><a href="javascript:;" @click="showRegister(0)">更换手机</a></span>
                            <span v-else><a href="javascript:;" @click="noChangePhone">更换手机</a></span>
                        </li>
                        <li  class="clf">
                            <span><b :class="[ukyBind ? 'icon-ok2':'icon-reduce']"></b>{{ukyBind?'已完成':'未完成'}}</span>
                            <span>U-key登录</span>
                            <span>绑定U-key后，可实现账号安全登录，而且不用输入用户名，即可进入系统。</span>
                            <span v-if="ukyBind"><a href="javascript:;" @click="delUKeyState = true">解除绑定</a></span>
                            <span v-if="!ukyBind"><a href="javascript:;" @click="pinShow" class="red" >绑定</a></span>
                        </li>
                    </ul>
                </div>
            </div>
            <tableList
                :tableTitle="'证书信息'"
                :tableClass="'table-six'"
                :tableLoading="certificateData.tableLoading"
                :total="10"
                :currentpage="certificateData.currentpage"
                :display="certificateData.display"
                :pageNumberState = 'false'
            >
                <ul slot="panel-content">
                    <li class="title">
                        <span>证书编号</span>
                        <span>证书颁发者</span>
                        <span>证书类型</span>
                        <span>有效期始</span>
                        <span>有效期至</span>
                        <span>{{certificateData.certificateList.length > 0 ? '操作' : ''}}</span>
                    </li>
                    <li v-if="certInterface">
                        <span>{{certInterface.certNo}}</span>
                        <span>{{certInterface.issuer}}</span>
                        <span>接口证书</span>
                        <span>{{certInterface.validityBeginTime | filterdata}}</span>
                        <span>{{certInterface.validityEndTime | filterdata}}</span>
                        <span><!--<a href="javascript:;" @click="serviceCertState = true" title="解除绑定">解绑</a>--></span>
                    </li>
                    <li v-for="(item,index) in certificateData.certificateList" :key="index">
                        <span>{{item.certNo}}</span>
                        <span>{{item.issuer}}</span>
                        <span>{{item.certType == 1 ? 'UKey证书':''}}</span>
                        <span>{{item.validityBeginTime | filterdata}}</span>
                        <span>{{item.validityEndTime | filterdata}}</span>
                        <span><a href="javascript:;" title="解除绑定" @click="delUKeyState = true">解绑</a></span>
                    </li>
                    <div class="no-message" v-if="!certInterface &&　certificateData.certificateList.length == 0">
                        <p><img src="../../assets/images/noAnyThing.png" alt="" ></p>
                        <p v-text="'暂无数据'"></p>
                    </div> 
                </ul>
            </tableList>
        </div>
         <!-- 实名弹框  -->
        <alertModel :title="'实名认证'" :sureBtnTxt="real.sureBtnTxt" class="bigUserModel"  :alelrtClassWidth="'700px'" :showState="real.state" :type="2" v-show="real.state"  @sureHandle="sureRealHandle">
            <div slot="alert-header" class="saoma clf">
                <i class="icon-close3" @click="closeRealModel"></i>
                <!-- <h3><span :class="[real.num == 0 ? 'active':'']" @click="real.num = 0">实名认证</span><span :class="[real.num == 1 ? 'active':'']" @click="real.num = 1">扫码认证</span> <i class="icon-close" ></i></h3> -->
                <p v-show="real.num != 2">{{real.num == 0 ? '上传身份证认证':'手机扫码，真宜签认证'}}</p>
                <p style="cursor:pointer;" v-show="real.num == 2" @click="backScanStep"><i class="icon-left"></i>手机实名认证步骤</p>
                <i v-show="real.num != 2" :class="[real.num == 0 ? 'icon-erweima':'icon-pc']" @click="changeRealState"></i>
                <i v-show="real.num != 2" :class="[real.num == 0 ? 'icon-sm':'icon_real']"></i>
            </div>
            <div slot="alert-content" class="clf security_real">
                <div class="real" v-show="real.num == 0">
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
                    <p class="clf" v-if="mobileStatus != 1">
                        <label for=""><b>*</b>手机号码</label>
                        <input type="text" v-model.trim="real.mobile">
                    </p>
                    <p class="clf code" v-if="mobileStatus != 1">
                        <label for=""><b>*</b>验证码</label>
                        <input type="text" v-model.trim="real.code">
                        <a href="javascript:;" class="sendCode" @click="getCode(0)">获取验证码</a>
                    </p>
                    <p class="clf">
                        <label for=""><b>*</b>真实姓名</label>
                        <input type="text" v-model.trim="real.idCardName">
                    </p>
                    <p class="clf">
                        <label for=""><b>*</b>身份证号</label>
                        <input type="text" v-model.trim="real.idCardNo">
                    </p>
                </div>
                <div class="realEwm" v-show="real.num == 1">
                    <div class="ewm-box clf">
                        <span>
                            <b>
                                <img v-show="!scanImg" src="" alt="二维码生成中">
                                <img v-show="scanImg" :src="'data:image/png;base64,'+scanImg" alt="二维码生成中">                                
                                <b class="refushEwm" v-show="overState">
                                    <a href="javascript:;" @click="getScanImg">刷新二维码</a>
                                </b>
                            </b>
                            <p>{{scanTxt}}</p>
                        </span>
                        <span>
                            <img src="../../assets/images/shoujitu.png" alt="">
                        </span>
                    </div>
                    <div class="ewm-tip">
                        <p>
                            使用你的手机版 <a href="http://m.gdca.com.cn/" target="_blank">真宜签</a> 完成实名认证 | <a href="javascript:;" @click="goStep">手机实名认证步骤</a><br>扫一扫完成网页端实名认证
                        </p>
                    </div>
                </div>
                <div class="realStep" v-show="real.num == 2">
                    <ul>
                        <li>
                            <p>点击"个人中心"</p>
                            <img src="../../assets/images/pic01.png" alt="">
                        </li>
                        <li>
                            <p class="step2">点击"开始实名认证"</p>
                            <img src="../../assets/images/pic02.png" alt="">
                        </li>
                        <li>
                            <p class="step3">认证完成</p>
                            <img src="../../assets/images/pic03.png" alt="">
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="alert-footer" class="bottom">
                <div v-show="real.num == 0" :class="mobileStatus != 1 ? 'marginTop20':''">
                    <a class="center-btn" @click="sureRealHandle">{{real.sureBtnTxt}}</a>
                </div>
                <div v-show="real.num == 2">
                    <a class="center-btn" @click="backScanStep">返回</a>
                </div>
            </div>
        </alertModel>
        <Loading :text="'身份证识别中,请稍等'" v-show="realState"></Loading>
        <!-- 修改手机号码/修改密码 -->
        <alertModel :title="register.title[register.index]"  :type="2"  v-show="register.state"  @cancelHandle="register.state = false" @sureHandle="sureRegister">
            <div slot="alert-content" class="infoRegister">
                
                <div v-if="register.index == 2">
                    <p class="clf">
                        <label for="">原密码</label>
                        <input type="password" v-model.trim="psw.oldPwd">
                    </p>
                    <p class="clf">
                        <label for="">新密码</label>
                        <input type="password" v-model.trim="psw.newPwd">
                    </p>
                    <p class="clf">
                        <label for="">确认密码</label>
                        <input type="password" v-model.trim="psw.repeatPwd">
                    </p>
                </div>
                <div v-else>
                    <p class="clf">
                        <label for="">原手机号</label>
                        <input type="text" v-model.trim="mobileBind" readonly class="gray" >
                    </p>
                    <p class="clf" v-if="register.index == 0">
                        <label for="">新手机号</label>
                        <input type="text"  v-model.trim="regPhone.newPhone">
                    </p>
                    <p class="clf">
                        <label for="">验证码</label>
                        <input type="text" class="code" name="code" v-model.trim="regPhone.code">
                        <a class="sendCode" @click="getCode(1)">获取验证码</a>
                    </p>
                </div>
            </div>
        </alertModel>
        <!--输入pin码弹框-->
        <alertModel :title="'请输入PIN码'"  :type="2"  v-show="pin.state"  :sureBtnTxt="pin.sureBtnTxt"  @cancelHandle="pin.state = false" @sureHandle="getCertData">
            <div slot="alert-content" class="pinNum">
                <p>
                    <label for="">PIN码</label>
                    <input type="password" id="pin" style="text-indent:10px" @keyup.enter="getCertData">
                </p>
                <p style="color:red;">
                    <label for="" class="opacity">提示</label>
                    <span v-html="pin.tip"></span>
                </p>
            </div>
        </alertModel>
        <!-- serviceCertState -->
        <alertModel :title="'温馨提示'" :context="'解除接口证书绑定？'"  :type="2"   v-show="serviceCertState"  @cancelHandle="serviceCertState = false" @sureHandle="unBindServiceCert">
        </alertModel>
        <!-- delUKey -->
        <alertModel :title="'温馨提示'" :context="'是否确认解除UKey证书绑定？'"  :type="2"   v-show="delUKeyState"  @cancelHandle="delUKeyState = false" @sureHandle="deleteUKey">
        </alertModel>
        <!-- 确认扫码实名认证 -->
        <alertModel :title="'当前用户与真宜签用户信息不匹配'"  :type="2" :alelrtClassWidth="'600px'"  v-show="scanState"  @cancelHandle="cancelScanHandle" @sureHandle="sureScanHandle">
            <div slot="alert-content" class="scan-model">
                <p v-show="!matching.name">当前用户的姓名<span>{{scanData.curName}}</span>将更改为<span>{{scanData.authName}}</span></p>
                <p v-show="!matching.phone">当前用户的手机<span>{{scanData.curPhone}}</span>将更改为<span>{{scanData.authPhone}}</span></p>
            </div>
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="'温馨提示'" :context="showAlertData.context" :autoClose="showAlertData.autoClose"   :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import '@/assets/js/plugin/jquery.form.js';
    import translateImg from '@/assets/images/transparent.png';

    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    import '@/assets/js/GDCAPKI/gdca_sof_method.js'; 
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');
    export default{
        name:"security",
        data(){
            return{
                showAlertData : {   //公共弹框参数
                    showAlert:false,
                    context:'',
                    autoClose:false
                },
                certInterface:null,      //接口证书
                certificateData:{                    
                    certificateList:[],    //证书列表
                    tableLoading:false,    //证书加载状态
                    total:0,               //证书总条数
                    currentpage:1,         //证书当前页
                    display:10,            //翻页条数                    
                },
                serviceCert:null,          //接口证书
                mobileStatus:1,            //绑定手机（大B管理员默认就是已绑定）
                mobileBind:'',             //绑定的手机号码
                accExtType:null,           //实名认证
                ukyBind:false,             //uky绑定
                real:{                     //实名认证
                    state:false,           //状态
                    num:0,                 //0-实名认证  1-扫码认证
                    frontImg:null,         //身份证正面
                    backImg:null,          //身份证反面
                    idCardName:null,       //真实姓名
                    idCardNo:null,         //身份证号
                    idCardToken:null,      //身份证token
                    sureBtnTxt:'确定',     
                    mobile:'',
                    code:''
                },
                register:{   //更换手机号,修改密码
                    state:false,
                    title:["更换手机号码","绑定手机","修改密码"],
                    index:0,//0-修改手机号码，1-绑定手机 ，2-密码 
                },
                regPhone:{                  //更换手机号码               
                    newPhone:'',            //新手机号码
                    code:'',                //验证码  
                },
                psw:{                       //修改密码
                    oldPwd:'',              //旧密码
                    newPwd:'',              //新密码
                    repeatPwd:'',           //重复密码
                },
                pin:{                       //pin码弹框
                    state:false,
                    sureBtnTxt:'确定',
                    tip:""
                },
                ddata:null,            //证书信息
                realState:false,       //调用OCR
                sendCodeState:true,    //可不可以发送验证码（true 可发送）
                ResetCodeTime:0,       //倒计时
                //接口证书
                hasCertTxt:false,         //有无接口证书（false 无）
                //关联证书
                signCertData:'',       //证书信息
                sign:'',               //证书信息
                certNo:'',             //证书信息
                certId:'',             //解绑参数
                delUKeyState:false,    //ukey解绑状态
                serviceCertState:false,  //接口证书状态
                //canvas
                dealCount:1,
                successCount:1, 
                txgo:null,
                txgoi:null,
                //扫码认证
                scanState:false,    
                scanTxt:'',           //扫描状态
                overState:false,      //扫描是否超时
                scanNum:0,            //扫码失败次数
                matching:{            //信息匹配
                    name:true,        //匹配
                    phone:true,       //匹配
                },
                scanTimer:null,       //扫码计时器
                scanImg:null,         //实名认证二维码
                claimUuid:null,       //获取二维码返回的id
                confirm:false,   
                scanData:{
                    curName:null,
                    curPhone:null,
                    authName:null,
                    authPhone:null,
                },     
            }
        },
        computed:{
            ...mapGetters([
            'userState','curAccount'
            ])
        },
        methods:{
            noChangePhone(){
                this.modelCommonTip('已实名认证，无法修改手机号');
            },
            closeRealModel(){  //关闭实名认证弹框
                this.real.state = false;
                this.ResetCodeTime = 0;
                clearInterval(this.scanTimer);
            },
            cancelScanHandle(){  //取消覆盖信息
                this.scanState = false;
                this.getScanImg();
            },
            sureScanHandle(){  //扫码信息不匹配，确定实名认证并覆盖信息
                this.confirm = true;
                this.authQrCodeBindCheck();
            },
            authQrCodeBindCheck(){
                this.httpGet(this.URL.authQrCodeBindCheck,{
                    claimUuid:this.claimUuid,
                    confirm:this.confirm
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.alertCommonTip('实名认证成功!');
                        this.getData();
                        this.real.state=false;
                        this.scanState = false;     
                        clearInterval(this.scanTimer);                
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'confirm'){  //真宜签账号和当前账号不匹配
                            this.scanData.curName = result.data.curName;
                            this.scanData.curPhone = result.data.curPhone,
                            this.scanData.authName = result.data.authName;
                            this.scanData.authPhone = result.data.authPhone;
                            if(this.scanData.curName === this.scanData.authName){
                                this.matching.name = true;
                            }else{
                                this.matching.name = false;
                            }
                            if(this.scanData.curPhone === this.scanData.authPhone){
                                this.matching.phone = true;
                            }else{
                                this.matching.name = false;
                            }
                            this.scanState = true;
                            clearInterval(this.scanTimer);
                            this.scanTxt = '';
                        }else if(msg == 'LOADING'){
                            this.scanTxt="扫码成功，等待输入pin码";
                             this.overState = true;
                        }else if(msg == 'CANCEL'){
                            this.scanTxt = '用户取消授权';
                            this.overState = true;
                            clearInterval(this.scanTimer);
                        }else if(msg == 'TIME_OUT'){
                            this.scanTxt = '二维码失效';
                            this.overState = true;
                            clearInterval(this.scanTimer)
                        }else if(msg == 'no.login'){   //下面是签吧的失败判断
                            this.alertCommonTip('请重新登录');
                            setTimeout(()=>{
                                window.location.href = this.linkHref + 'logout'
                            },2000)
                        }else if(msg == 'not.allow' || msg == 'acc_type'){
                            this.alertCommonTip('您无权限');
                        }else if(msg == 'binded'){
                            this.alertCommonTip('您已实名认证');
                        }else if(msg == 'ERROR'){
                            this.alertCommonTip("服务器忙，请稍后重试");
                        }else if(msg == 'PHONE_BINDED'){
                            this.alertCommonTip('该手机号已绑定');
                            this.scanTxt = '该手机号已绑定';
                            this.scanState = false;
                            this.overState = true;
                            clearInterval(this.scanTimer)
                        }else{
                            
                        }
                    }
                })
            },
            changeRealState(){    //切换实名认证方式
                this.real.num = this.real.num == 0 ? 1 : 0;
                if(this.real.num == 1){
                    this.getScanImg();
                }else{
                    clearInterval(this.scanTimer)
                }

            },
            getScanImg(){        //扫码认证获取二维码
                this.scanTxt = '';
                this.overState = false;
                clearInterval(this.scanTimer);
                this.httpGet(this.URL.authQrCodeBind,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.scanImg = result.data.qRCodeBase64;
                        this.claimUuid = result.data.claimUuid;
                        this.scanTimer = setInterval(()=>{
                            this.authQrCodeBindCheck();
                        },1000);
                    }else{
                        ++this.scanNum;
                        let msg = result.meta.message;                        
                        if(msg == 'no.login'){
                            this.alertCommonTip('请重新登录');
                            setTimeout(()=>{
                                window.location.href = this.linkHref + 'logout'
                            },2000)
                        }else if(msg == 'acc_type'){
                            this.alertCommonTip('您没有权限');
                        }else if(msg == 'binded'){
                            this.alertCommonTip("您已实名认证");
                        }else if(msg == 'busy'){
                            if(this.scanNum < 3){
                                this.getScanImg();
                            }else{
                                this.alertCommonTip('服务器忙，请稍后再试');
                                this.overState = true;
                            }                            
                        }else{
                            if(this.scanNum < 3){
                                this.getScanImg();
                            }else{
                                this.alertCommonTip('服务器忙，请稍后再试');
                                this.overState = true;
                            }
                        }
                    }
                })
            },
            goStep(){  //手机认证步骤
                this.real.num = 2;
                clearInterval(this.scanTimer);
            },
            backScanStep(){  //回到实名认证
                this.real.num = 1;
                this.getScanImg();
            },
            uploadCert(){  //上传证书
                let This = this;
                $("#uploadCert").val('');
                $("#uploadCert").unbind().change(function(){
                    if($(this)[0].files){
                        
                        let file = $(this)[0].files[0];
                        if(file.type.indexOf('cert') != -1){  //application/x-x509-ca-cert
                            This.uploadCertSubmit();      
                        }else{
                            This.alertCommonTip("仅支持 .cer 证书文件");
                            return false;
                        }
                    }else{
                        let Name = $(this).val();
                        if(Name.indexOf('.cer') != -1){
                            This.uploadCertSubmit();                            
                        }else{
                            This.alertCommonTip("仅支持 .cer 证书文件");
                            return false;
                        }
                    }
                })

            },
            uploadCertSubmit(){  //调用上传证书接口
                let This = this;
                if($("#uploadCert").val() == ''){
                    this.alertCommonTip("请上传.cer证书文件");
                    return false;
                }
                $("#uploadForm").ajaxSubmit({
                    url:This.apiPath + This.URL.bindServiceCert,//默认是form action
                    success:function(data){                      
                        let result = eval('(' + data + ')');
                        if(result.meta.success){        
                            This.alertCommonTip("接口证书关联成功");                    
                            This.getData();
                            This.getServiceCert();
                        }else{
                            let msg = result.meta.message;
                            if(msg == 'no.login'){
                                This.alertCommonTip('请重新登录');
                                setTimeout(()=>{
                                    window.location.href = This.linkHref + 'logout'
                                },2000)
                            }else if(msg == 'no.permission'){
                                This.alertCommonTip("您没有权限操作");
                            }else{
                                This.alertCommonTip('系统错误，请稍后重试');
                            }
                        }
                        
                    }
                });
            },
            unBindServiceCert(){  //接口证书解绑
                this.httpPost(this.URL.unBindServiceCert,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.getData();
                        this.getServiceCert();
                        this.serviceCertState = false;
                        this.alertCommonTip("证书解绑成功");
                    }else{
                        this.alertCommonTip('解绑失败');
                    }
                })
            },
            pinShow(){  //关联证书
                $("#pin").val("");     
                this.pin.state = true; 
                this.pin.tip = '';
                this.pin.sureBtnTxt="确定";      
                this.random = this.randomWord(true,32,1000);
            },
            getCertData(){   //绑定UKEY
                let This = this;   
                this.pin.sureBtnTxt="绑定中...";      
                gMethod.checkReadUserList(this, function (res) {
                    This.ddata = res; 
                    This.toLoginUkey();
                }, function (err) {
                    var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                    This.alertCommonTip("获取U-KEY失败，请确认是否插入U-KEY或安装客户端");
                });
            },
            toLoginUkey() {   //pin码弹框确定按钮
                let This = this;
                let pin = $(' #pin').val();
                if('' == pin){
                    This.pin.tip = "PIN码不能为空";
                    return;
                }                
                gMethod.checkLoginKey(this, pin, function (res) {
                    This.setCertInfo();
                },function(err){
                    $("#pin").val("");
                    This.pin.sureBtnTxt="确定";
                    if(err > 0){
                        This.pin.tip = "PIN码错误，请重试(您还剩"+err+"次机会)";
                    }else{
                        
                        This.pin.tip = "已超过最大尝试次数，请联系客户服务<br/>（020-95105813）重置密码。";
                    }
                    return;
                });
            },
            setCertInfo() {   
                let This = this;
                $GDCA.exportUserCert(this.ddata, function (usercert) {
                    This.signCertData = usercert;   //证书信息
                    $GDCA.setSignMethod(16, function (res) {
                        var baseRan = new Base64String().encode(This.random);
                        $GDCA.signData(This.ddata, baseRan, function (res) {
                            This.pin.state = false;
                            This.sign = res;
                            if (!This.sign) {
                                This.alertCommonTip('签名数据为空');
                                return false;
                            }
                            This.relateUKeyStep();
                        }, function (err) {
                            This.pin.state = false;
                            This.alertCommonTip('签名数据失败');
                        });
                    }, function (err) {
                        This.pin.state = false;
                        This.alertCommonTip('设置签名方法失败');
                    });                    
                }, function (err) {
                    var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                    This.alertCommonTip("获取U-KEY失败，请确认是否插入U-KEY或安装客户端");
                });
            },
            relateUKeyStep() { //关联证书
                this.httpPost(this.URL.relateUKey,{
                    "certNo": this.certNo, 
                    "sign": this.sign, 
                    "random": this.random, 
                    "certData": this.signCertData
                    },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        let msg = result.data;
                        if ("success" == msg) {
                            this.alertCommonTip('UKey证书关联成功');
                            this.getData();
                        }else if ("already" == msg) {
                            this.alertCommonTip('绑定失败，该UKEY证书已绑定其它账户');
                        }else if ("revocation" == msg) {
                            this.alertCommonTip('UKEY证书已被吊销');
                            
                        }else if ("verifyFailed" == msg) {
                            this.alertCommonTip('UKEY验签失败');                            
                        }else {
                            this.alertCommonTip('服务器异常');
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            /*
                ** randomWord 产生任意长度随机字母数字组合
                ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
            */
            randomWord(randomFlag, min, max){
                let str = "",
                    range = min,
                    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let pos = null;
                // 随机产生
                if(randomFlag){
                    range = Math.round(Math.random() * (max-min)) + min;
                }
                for(let i=0; i<range; i++){
                    pos = Math.round(Math.random() * (arr.length-1));
                    str += arr[pos];
                }
                return str;
            },
            //解除绑定ukey
            deleteUKey(){
                let This = this;
                $.ajax({
                    type: "POST",
                    url: this.apiPath + this.URL.deleteUKey,
                    data: {"certId": this.certId},
                    dataType: "text",
                    success: function (result) {
                        This.pin.sureBtnTxt="确定";   
                        if ("success" == result) {
                            This.delUKeyState = false;                               
                            This.alertCommonTip('UKey证书成功解绑');
                            This.getData();
                        } else {
                            This.alertCommonTip(result.meta.message)
                        }
                    }
                });
                /*this.httpPost(this.URL.deleteUKey,{
                    certId:this.certId
                },(response)=>{
                    let result = response.data;
                    console.log(result)
                })*/
            },
            sureRegister(){  //确定修改
                if(this.register.index == 0){ //修改手机号码
                    this.modifyPhone();
                }else if(this.register.index == 1){  //绑定手机                
                    this.bindPhoneHandle(this.mobileBind,this.regPhone.code,()=>{                        
                        //初始化验证码数据
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#fff"});

                        this.alertCommonTip("手机号码绑定成功");
                        this.register.state = false;
                        this.getData();
                    });
                }else{ //修改密码
                    this.modifyPassword();
                }
            },
            modifyPhone(){  //修改手机号码
                if($('.code').val() == ""){
                    this.modelCommonTip('请输入验证码');                    
                    return false;
                }
                this.httpPost(this.URL.modifyPhone,{
                    phoneOld:this.mobileBind,
                    phoneNew:this.regPhone.newPhone,
                    code:$('.code').val()
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        //验证码初始化
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#fff"});

                        this.alertCommonTip("手机号修改成功");
                        this.register.state = false;
                        this.getData();
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'bad.phone'){
                            this.alertCommonTip("手机号格式错误");
                        }else if(msg == 'authed'){
                            this.alertCommonTip("已实名认证无法修改手机号");
                        }else if(msg == 'overtime'){
                            this.alertCommonTip("验证码已超时");
                        }else if(msg == '验证码错误'){
                            this.alertCommonTip("验证码已超时");
                        }else if(msg == 'bad.code'){
                            this.alertCommonTip("验证码错误");
                        }else{
                            this.alertCommonTip(msg);
                        }
                    }
                })
            },
            modifyPassword(){      //修改密码
                if(this.validateQb.isEmpty(this.psw.oldPwd)){
                    this.modelCommonTip('必须输入原密码');
                    return;
                }
                if(this.validateQb.isEmpty(this.psw.newPwd)){
                    this.modelCommonTip('必须输入新密码');
                    return;
                }
                if(this.psw.newPwd.length < 6 ){
                    this.modelCommonTip('新密码不少于6位');
                    return;
                }
                if(this.psw.newPwd.length > 16){
                    this.modelCommonTip('新密码不大于16位');
                    return;
                }
                if(this.validateQb.isChina(this.psw.newPwd)){
                    this.modelCommonTip('密码不得包含中文');
                    return;
                }
                if(this.psw.oldPwd == this.psw.newPwd){
                    this.modelCommonTip('新旧密码不能相同');
                    return;
                }
                if(this.validateQb.isEmpty(this.psw.repeatPwd)){
                    this.modelCommonTip('确认密码不能为空');
                    return;
                }
                if(this.psw.newPwd != this.psw.repeatPwd){
                    this.modelCommonTip('两次输入密码不相同');
                    return;
                }                
                this.httpPost(this.URL.modifyPassword,{
                    pwdOld:this.psw.oldPwd,
                    pwdNew:this.psw.newPwd
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.alertCommonTip("修改成功");
                        this.register.state = false;
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'bad.password'){
                            this.alertCommonTip("原密码错误，请重试。");
                        }else{
                            this.alertCommonTip(msg)
                        }
                    }
                })
            },
            showRegister(num){       //更换手机（0）/修改密码（1）
                this.register.state = true;
                this.register.index = num;
                if(num == 0){         //修改手机号码
                    [this.regPhone.newPhone,this.regPhone.code] = ['','']   //初始化修改手机弹框数据
                }else{   //修改密码 
                    [this.psw.oldPwd,this.psw.newPwd,this.psw.repeatPwd,this.regPhone.code] = ['','','','']
                }
            }, 
            getCode(num){  //获取验证码 (0-实名认证获取验证码   1-绑定手机或者修改手机获取验证码)                
                let phone = null;
                if(this.register.index == 1){  //绑定手机获取验证码
                    phone = num == 0 ? this.real.mobile : this.mobileBind;
                }else{
                    phone = num == 0 ? this.real.mobile : this.regPhone.newPhone;
                }                
                if(this.validateQb.isEmpty(phone)){
                    this.modelCommonTip('手机号码不能为空');
                    return false;
                }
                if(!this.validateQb.isPhone(phone)){
                    this.modelCommonTip('手机号码格式不正确');
                    return false;
                }    
                if(this.register.index == 0 &&　this.mobileBind == phone && num == 1){  //修改手机
                    this.modelCommonTip('新手机号码不能跟原手机号码相同');
                    return false;
                } 
                if(!this.sendCodeState) return false;  
                this.httpGet(this.URL.verificationCode,{
                    mobileNo:phone
                },(response)=>{
                    let result = response.data;
                    if(result == "success"){
                        this.sendCodeState = false;
                        this.ResetCodeTime = 60;
                        this.resetCode();          
                    }
                })
            },
            resetCode(){ //验证码倒计时
                this.ResetCodeTime -- ;
                if(this.ResetCodeTime <= 0){
                    this.ResetCodeTime = 60;
                    this.sendCodeState = true;
                    $(".sendCode").text("获取验证码");
                    $(".sendCode").css({'cursor':'pointer','background':"#fff"});
                }else{
                    $(".sendCode").text("重新发送("+this.ResetCodeTime+'s)');
                    $(".sendCode").css({'cursor':'not-allowed','background':'#e6e7ed'});
                    setTimeout(()=>{
                        this.resetCode();
                    },1000)
                }                
            },
            realClick(){   //点击实名认证
                if(this.userState == 2){   //大Buser实名认证
                    this.real.state = true;
                    this.real.num = 0;
                    //初始化实名认证数据            
                    this.real.frontImg = false;
                    this.real.backImg = false;
                    this.real.idCardNo = this.real.idCardName = this.real.idCardToken = null;
                    this.real.mobile = this.mobileBind;
                    $(".frontTip,.backTip,.allTip").text('');
                    $("#frontImg,#backImg").attr('src',translateImg);
                    $(".imgBg").show().siblings('p').show(); 
                }
                if(this.userState == 3){
                    // window.location.href = this.linkHref + 'sys/auth/comAuthIndex';
                    this.$router.push({
                        name:"companyReal"
                    });
                }                             
            },
            beforeReal(){    //实名认证前的验证
                if(!this.real.frontImg){
                    this.modelCommonTip('请上传身份证正面图片');
                    return false;
                }
                if(!this.real.backImg){
                    this.modelCommonTip('请上传身份证反面图片');
                    return false;
                }
                if(!this.real.idCardName){
                    this.modelCommonTip('真实姓名不能为空');
                    return false;
                }
                if(this.real.idCardName == ''){
                    this.modelCommonTip('真是姓名不能为空');
                    return false;
                }
                if(!this.real.idCardNo){
                    this.modelCommonTip('身份证号不能为空');
                    return false;
                }
                if(this.real.idCardNo == ''){
                    this.modelCommonTip('身份证号不能为空');
                    return false;
                }
                if(!this.validateQb.isCardNo(this.real.idCardNo)){
                    this.modelCommonTip('身份证号码不合法，请核对');
                    return false;
                }
                return true;
            },
            sureRealHandle(){ //点击实名认证确定按钮
                if(this.real.sureBtnTxt != '确定') return
                if(!this.beforeReal()) return;                 
                this.real.sureBtnTxt = "提交中...";
                if(this.mobileStatus != 1){  //未绑定手机（先绑定手机）
                    this.bindPhoneHandle(this.real.mobile,this.real.code,()=>{
                        this.userAuthrityHandle();  //调用实名认证接口
                    })
                }else{
                    this.userAuthrityHandle();
                }              
            },
            bindPhoneHandle(phone,code,success){   //绑定手机
                this.httpPost(this.URL.bindPhone,{
                    phone:phone,
                    code:code
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        success();
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'overtime'){
                            this.alertCommonTip('超时！请重新获取验证码！');
                        }else if(msg == 'wrong'){
                            this.alertCommonTip("验证码错误");
                        }else if(msg == 'wrongPhone'){
                            this.alertCommonTip('手机格式错误');
                        }else{
                            this.alertCommonTip(msg);
                        }
                    }
                    
                })
            },
            userAuthrityHandle(){  //调用实名认证接口
                this.real.sureBtnTxt = "提交中...";
                this.httpPost(this.URL.userAuthrity,{
                    "idCardName": this.real.idCardName,
                    "idCardNo":this.real.idCardNo,
                    "idCardToken":this.real.idCardToken
                },(response)=>{
                    let result = response.data;
                    this.real.sureBtnTxt = "确定";
                    if(result.meta.success){
                        this.real.state = false;
                        this.getData();
                        this.alertCommonTip("实名认证成功");

                        //初始化验证码数据
                        this.ResetCodeTime = 0;
                        this.sendCodeState = true;
                        $(".sendCode").text("获取验证码");
                        $(".sendCode").css({'cursor':'pointer','background':"#fff"});
                        
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'NO_LOGIN'){
                            this.alertCommonTip("登录已过期");
                            setTimeout(()=>{
                                window.location.href=this.linkHref+"login";
                            },2000)
                        }else if(msg == 'dunplicate.phone'){
                            this.alertCommonTip("该手机号已经实名认证过了，不能重复认证");
                        }else if(msg == 'identify.false'){
                            this.alertCommonTip("该姓名与身份证号码不对应，请确认");
                        }else if(msg == 'identify.error'){
                            this.alertCommonTip("身份证信息验证失败，请重试")
                        }else if(msg == 'ERROR'){
                            this.alertCommonTip("系统异常，请稍候重试");
                        }else if(msg == 'WRONG_ACCOUNT_TYPE'){
                            this.alertCommonTip("实名认证的账户类型不正确");
                        }else if(msg == 'NO_PARAM'){
                            this.alertCommonTip("参数为空");
                        }else if(msg == 'NO_RESPONSE'){
                            this.alertCommonTip("系统异常，请稍后重试");
                        }else if(msg == 'DUNPLICATE'){
                            this.alertCommonTip("此手机号或身份证已被认证，不能重复申请");
                        }else if(msg == 'NOT_RELATE'){
                            this.alertCommonTip("上传的身份证照与填写的姓名不匹配");
                        }else if(msg == 'BAD_DATA'){
                            this.alertCommonTip("实名认证数据错误，认证失败");
                        }else{
                            this.alertCommonTip(msg);
                        }
                    }
                })
            },
            realHandle(){   //调用OCR
                let This = this;
                if(!this.real.frontImg){
                    $(".frontTip").text("请上传身份证正面图片")
                    return;
                }
                if(!this.real.backImg){
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
                            This.real.idCardToken = result.data.idCardToken;
                            if(result.meta.success){
                                This.real.idCardName = result.data.idCardName;
                                This.real.idCardNo = result.data.idCardNo;
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
                        this.alertCommonTip("不支持该类型，请上传png、gif或jpg类型图片");
                        return false;
                    }
                    var oMyFile = $("#"+obj);
                    if(oMyFile.files){  //判断ie是否支持此属性
                        let filesSize = $("#"+obj)[0].files[0].size/1024/1024;
                        if(filesSize > 2){
                            this.alertCommonTip("请上传小于2M的图片");
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
                    this.alertCommonTip("图片的格式必须为png、jpg、gif格式！");
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
                        This.real.backImg = true;
                    }else{
                        This.real.frontImg = true;
                    }
                    setTimeout(()=>{
                        if(This.real.frontImg && This.real.backImg){
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
                        This.real.backImg = true;
                    }else{
                        This.real.frontImg = true;                        
                    }
                    setTimeout(()=>{
                        if(This.real.frontImg && This.real.backImg){
                            This.realHandle();
                        }
                    }) 
                }
            }, 
            getServiceCert(){  //获取证书(大B管理员)
                this.httpGet(this.URL.getServiceCert,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.serviceCert = result.data;
                        if(this.serviceCert !== null){  //有接口证书
                            this.hasCertTxt = '重新上传';
                            this.certInterface = result.data;
                            this.successCount = 3;
                            this.getAccountCertList();  //获取证书信息  
                        }else{
                            this.hasCertTxt = '上传证书';
                            this.certInterface = null;
                            this.successCount = 2;
                            this.getAccountCertList();  //获取证书信息  
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                    
                })
            },
            getAuthStatus(){   //判断有无实名认证(小Badmin)
                this.httpGet(this.URL.getAuthStatus,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){ 
                        let msg = result.data;
                        if(msg == 'authed'){  //已实名
                            this.successCount++;
                            this.accExtType = '001';
                        }else if(msg == 'submitted'){ //已提交
                            this.accExtType = '002';
                        }else{
                            this.accExtType = '000';
                        }
                    }else{
                        if(result.meta.message == 'no.login'){
                            this.alertCommonTip("请重新登录");
                            setTimeout(()=>{
                                window.location.href = this.linkHref + 'logout'
                            },2000)
                        }/*else{
                            this.alertCommonTip(result.meta.message)
                        }*/
                    }
                    this.getAccountCertList();
                })
            },
            getAccountCertList(){  //获取证书列表（判断UKEY有无绑定）
                this.httpGet(this.URL.getAccountCertList,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.certificateData.certificateList = result.data;
                        if(result.data.length >=1 ){
                            this.certId = result.data[0].certId;
                            this.ukyBind = true;
                            this.successCount++;
                        }else{
                            this.ukyBind = false;
                        }
                        this.setLevel();
                    }
                })
            },            
            getData(){   //获取基本信息
                this.successCount = 1;
                this.httpGet(this.URL.getCurAccount,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.$store.dispatch('changeState',result.data.accType);          
                        this.$store.dispatch('changeAccid',result.data.accId);     
                        this.$store.dispatch('changeRolState',result.data.role);    
                        this.$store.dispatch('saveCurAccount',result.data);   
                        this.mobileBind = this.real.mobile = result.data.mobileNo;
                        if(result.data.accType == 2){ //大Buser
                            this.mobileStatus = this.curAccount.mobileStatus;   //判断有无绑定手机
                            this.accExtType = this.curAccount.accExtType;       //判断有无实名认证
                            if(this.mobileStatus == 1){
                                this.successCount++
                            }
                            if(this.accExtType == 1){
                                this.successCount++
                            }
                            this.getAccountCertList();  //获取证书信息  
                            
                        }else if(result.data.accType == 3){
                            this.mobileStatus = this.curAccount.mobileStatus;   //判断有无绑定手机
                            if(this.mobileStatus == 1){
                                this.successCount++
                            }
                            this.getAuthStatus();       //获取实名状态

                        }else{
                            this.getServiceCert(); //获取接口信息
                        }
                        
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }        
                })
            },
            //canvas
            setLevel() {                                     
                this.txgoi = 0;
                var showNum = (this.successCount) * 25;
                var tags = ['无','极低','低','中','高'];
                $(".safety_text").text(tags[this.successCount]);
                this.txgo = setInterval(()=>{
                    this.addNum(showNum,180)
                },10);
            },
            addNum(percent, width) {
                if (this.txgoi < percent) {                    
                    this.txgoi++;
                    $('canvas.process').text(this.txgoi + "%");
                    this.drawProcess(width);
                } else {
                    clearInterval(this.txgo);
                }
            },
            drawProcess(width) {
                $('canvas.process').each(function () {
                    var text = $(this).text();
                    var process = text.substring(0, text.length - 1);
                    var canvas = this;
                    var context = canvas.getContext('2d');
                    context.clearRect(0, 0, width, width);

                    context.beginPath();
                    context.moveTo(width / 2, width / 2);
                    context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2, false);
                    context.closePath();
                    context.fillStyle = '#ddd';
                    context.fill();

                    context.beginPath();
                    context.moveTo(width / 2, width / 2);
                    context.arc(width / 2, width / 2, width / 2, 0, Math.PI * 2 * process / 100, false);
                    context.closePath();
                    context.fillStyle = '#ff7e30';
                    context.fill();

                    context.beginPath();
                    context.moveTo(width / 2, width / 2);
                    context.arc(width / 2, width / 2, width / 2 - 10, 0, Math.PI * 2, true);
                    context.closePath();
                    context.fillStyle = 'rgba(255,255,255,1)';
                    context.fill();

                    context.beginPath();
                    context.arc(width / 2, width / 2, width / 2 - 20, 0, Math.PI * 2, true);
                    context.closePath();
                    context.strokeStyle = '#ddd';
                    context.stroke();
                    context.font = "bold 19pt Arial";
                    /*context.strokeText('Hello', 10, 50);  */
                    /* context.fillStyle = '#2a2';*/
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.moveTo(width / 2, width / 2);
                    context.fillText(text, width / 2, width / 2);
                });
            }

        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-安全设置";
            }else{
                document.title="签吧-安全设置";
            }
            this.$store.dispatch("changeTitle","我的账户>安全设置");
            this.getData();
        }
    }
</script>
<style lang="scss" scoped>

</style>

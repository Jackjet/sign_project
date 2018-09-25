<template>
    <div class="basicInfo">
        <div class="right_col">
            <div class="panel-box panel-white">
                <h3>个人信息</h3>
                <div class="basic_box clf">
                    <div class="side_left">
                        <form action="/cus/account/uploadHeadIcon" method="post" enctype="multipart/form-data" id="uploadIconForm">
                            <span>
                                <img :src="'data:image/png;base64,'+headImg" alt="">
                            </span>
                            <input type="file" id="uploadIcon" name="uploadIcon" @change="headIconChange" unselectable="on">
                            <p>点击换头像</p>
                        </form>   
                    </div>
                    <div class="side_right" v-if="curAccount">
                        <ul class="clf" v-if="userState == 2"> <!-- 大B-user -->
                            <li><p class="clf"><span>账号</span><span>{{curAccount.accNo}}</span></p></li>
                            <li><p class="clf"><span>手机号码</span><span>{{curAccount.mobileNo}} <a href="javascript:;" @click="showRegister(0)" v-if="curAccount.accExtType != '001'">修改</a></span></p></li>
                            <li><p class="clf"><span>姓名</span><span>{{curAccount.memName}}</span></p></li>
                            <li><p class="clf"><span>注册时间</span><span>{{curAccount.createTime | filterdata}}</span></p></li>
                            <li><p class="clf"><span>部门</span><span>{{curAccount.structureName}}</span></p></li>
                            <li><p class="clf"><span>认证状态</span><span>{{curAccount.accExtType && curAccount.accExtType == '001' ? '已认证':'未认证'}}</span></p></li>                            
                        </ul>
                        <ul class="oneLine" v-if="userState != 2">  <!--大B-admin   小B-admin-->
                            <li>
                                <p class="clf"><span>账号</span><span>{{curAccount.accNo}}</span></p>
                                <p class="clf"><span>手机号码</span><span>{{curAccount.mobileNo}}<a href="javascript:;" @click="showRegister(0)"  v-if="curAccount.accExtType != '001'">修改</a></span></p>
                                <p class="clf">
                                    <span>企业名称</span>
                                    <span>{{ userState == 3 ? curAccount.displayName : curAccount.companyName}}<a href="javascript:;" @click="showRegister(1)">修改企业名称</a>
                                    </span>
                                </p>
                                <p class="clf"><span>注册时间</span><span>{{curAccount.createTime  | filterdata}}</span></p>
                                <p class="clf"><span>登录密码</span><span>******<a href="javascript:;" @click="showRegister(2)">修改</a></span></p>
                                <p class="clf"><span>法人姓名</span><span>{{companyInfo.legal}}<a href="javascript:;" @click="showRegister(3)">修改</a></span></p>
                                <p class="clf" v-if="userState == 1"><span>系统标识(SystemId)</span><span>{{companyInfo.systemId}}</span></p>
                                <p class="clf" v-if="userState == 1"><span>接口服务私钥</span><span><a href="javascript:;" @click="getServicePrikey">查看</a></span></p>
                                <p class="clf"><span>电话</span><span>{{companyInfo.tel}}<a href="javascript:;" @click="showRegister(4)">修改</a></span></p>
                                <p class="clf"><span>认证状态</span><span>{{curAccount.accExtType &&　 curAccount.accExtType == '001' ? '已认证':'未认证'}}</span></p>
                                <p class="clf"><span>地址</span><span>{{companyInfo.address}}<a href="javascript:;" @click="showRegister(5)">修改</a></span></p>
                                <p class="clf" v-if="userState == 1"><span>备注</span><span>{{companyInfo.largeMemo}}<a href="javascript:;" @click="showRegister(6)">修改</a></span></p>
                                <p class="clf" v-if="userState == 3"><span>备注</span><span>{{companyInfo.memo}}<a href="javascript:;" @click="showRegister(6)">修改</a></span></p>
                            </li>
                        </ul>
                    </div>
                </div>                
            </div>

            <div class="panel-box panel-white basic_box_second" v-if="userState == 2">  <!-- 大B-user -->
                <h3>企业信息</h3>
                <ul class="clf">    
                    <li>
                        <p class="clf">
                            <span>企业名称</span>
                            <span>{{companyInfo.name}}</span>
                        </p>                            
                    </li>
                    <li>
                        <p class="clf">
                            <span>法人姓名</span>
                            <span>{{companyInfo.legal}}</span>
                        </p>                            
                    </li>
                    <li>
                        <p class="clf">
                            <span>电话</span>
                            <span>{{companyInfo.tel}}</span>
                        </p>                            
                    </li>
                    <li>
                        <p class="clf">
                            <span>地址</span>
                            <span>{{companyInfo.address}}</span>
                        </p>                            
                    </li>
                    <li>
                        <p class="clf">
                            <span>备注</span>
                            <span>{{companyInfo.largeMemo}}</span>
                        </p>
                    </li>
                </ul>
            </div>
        </div>

        <alertModel :title="'企业接口服务私钥'" :context="''"  :sureBtnTxt="sys.sureBtnTxt" :type="3"  :showState="sys.state"  v-show="sys.state"  @cancelHandle="sys.state = false" >
            <div class="alert-header" slot="alert-header"> <!--v-if="type == 2"-->
				
                <div >
                    <h3>企业接口服务私钥</h3>
                </div>
			</div>
            <div slot="alert-content" class="sysAlert">
                <label for="">私钥:</label>
                <p id="sysId" class="shengl" :title="sys.id">{{sys.id}}</p>                
            </div>
            <div slot="alert-footer" v-if="sys.type == 2">
                <a href="javascript:;" class="cancel-btn"  @click="sys.state = false">关闭</a>
                <button id="btn" :data-clipboard-text="sys.id" class="sure-btn">复制到黏贴版</button>
            </div>
            <div slot="alert-footer" v-if="sys.type == 1">
                <a href="javascript:;" class="sweet-btn"  @click="sys.state = false" style="float:none;margin:0 auto;">我知道了</a>
            </div>
        </alertModel>

        <!-- 修改手机号码 -->
        <alertModel :title="register.title[register.index]"  :type="2"  v-show="register.state"  @cancelHandle="register.state = false" @sureHandle="sureRegister">
            <div slot="alert-content" class="infoRegister">
                <div v-if="register.index == 0">
                    <p class="clf">
                        <label for="">原手机号</label>
                        <input type="text" v-model.trim="curAccount.mobileNo" readonly class="gray" >
                    </p>
                    <p class="clf">
                        <label for="">新手机号</label>
                        <input type="text"  v-model.trim="mobile.newPhone">
                    </p>
                    <p class="clf">
                        <label for="">验证码</label>
                        <input type="text" class="code" name="code" v-model.trim="mobile.code">
                        <a class="sendCode" @click="getCode">获取验证码</a>
                    </p>
                </div>
                <div v-if="register.index == 1">
                    <p class="clf">
                        <label for="">原公司名称</label>
                        <input type="text" v-model="this.userState == 3 ? curAccount.displayName : curAccount.companyName" readonly class="gray">
                    </p>
                    <p class="clf">
                        <label for="">新公司名称</label>
                        <input type="text" v-model.trim="companyName" @keyup.enter="modifyCompanyName" maxlength="64">
                    </p>
                </div>
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
                <div v-if="register.index == 3">
                    <p class="clf">
                        <label for="">原法人姓名</label>
                        <input type="text" v-model.trim="companyInfo.legal" class="gray"  readonly>
                    </p>
                    <p class="clf">
                        <label for="">新法人姓名</label>
                        <input type="text" v-model.trim="legal.name" @keyup.enter="sureRegister" maxlength="64">
                    </p>
                </div>
                <div v-if="register.index == 4">
                    <p class="clf">
                        <label for="">原电话</label>
                        <input type="text" v-model="companyInfo.tel" readonly class="gray">
                    </p>
                    <p class="clf">
                        <label for="">新电话</label>
                        <input type="text" v-model.trim="tel" @keyup.enter="sureRegister">
                    </p>
                </div>
                <div v-if="register.index == 5">
                    <p class="clf">
                        <label for="">原地址</label>
                        <input type="text" readonly class="gray" v-model.trim="companyInfo.address">
                    </p>
                    <p class="clf">
                        <label for="">新地址</label>
                        <input type="text" v-model.trim="address" @keyup.enter="sureRegister" maxlength="64">
                    </p>
                </div>
                <div v-if="register.index == 6"> 
                    <p class="clf">
                        <label for="">原备注</label>
                        <input type="text" readonly class="gray" v-if="userState == 1" v-model.trim="companyInfo.largeMemo">
                        <input type="text" readonly class="gray" v-if="userState == 3" v-model.trim="companyInfo.memo">
                    </p>
                    <p class="clf">
                        <label for="">新备注</label>
                        <input type="text" v-model.trim="memo" @keyup.enter="sureRegister" maxlength="128">
                    </p>
                </div>
            </div>
        </alertModel>        
        <!--公共弹框-->
        <alertModel :title="'温馨提示'" :context="showAlertData.context" :autoClose="showAlertData.autoClose"  :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false" >
        </alertModel>
        <!-- <Model v-show="model.state" :atuoClose="model.autoClose"></Model> -->
        
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import '@/assets/js/plugin/clipboard.min.js';
    export default{
        name:'basicInfo',
        data(){
            return{
                // model:{
                //     state:false,
                //     autoClose:false
                // },
                headImg:'',                
                companyInfo:{},
                sys:{             //企业接口服务私钥
                    id:'当前企业用户无服务接口私钥',
                    state:false,
                    sureBtnTxt:'关闭',
                    largeCompanyId:'',
                    type:1    
                },      
                showAlertData : {
                    showAlert:false,
                    context:'',
                    autoClose:false
                },
                register:{   //修改用户信息弹框
                    state:false,
                    title:["修改手机号码","修改企业名称","修改密码","修改法人姓名","修改电话","修改地址","修改备注"],
                    index:6,//0-修改手机号码，1-企业名称，2-密码，3-法人姓名，4-电话，5-地址，6-备注 
                },
                mobile:{
                    newPhone:'',            //新手机号码
                    code:'',                //验证码                   
                },
                companyName:'',             //新公司名称
                psw:{
                    oldPwd:'',              //旧密码
                    newPwd:'',              //新密码
                    repeatPwd:'',           //重复密码
                },
                legal:{                     //法人
                    name:''
                },
                tel:'',                     //电话
                address:'',                 //地址    
                memo:'',              
                sendCodeState:true,
                ResetCodeTime:0,   //倒计时60秒
            }
        },
        computed:{
            ...mapGetters([
                'curAccount','userState'
            ])
        },
        methods:{
            getServicePrikey(){
                this.sys.state = true;
                this.httpGet(this.URL.getServicePrikey,{
                    largeCompanyId:this.curAccount.largeCompanyId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.sys.id = result.data ? result.data : '当前企业用户无服务接口私钥';
                        this.sys.type = result.data ? 2 : 1;
                    }
                })
            },
            sureRegister(){  //确定修改
                if(this.register.index == 0){ //修改手机号码(接口有待修改)
                    this.modifyPhone();
                }else if(this.register.index == 1){ //修改企业名称(接口有待修改)
                    this.modifyCompanyName();
                }else if(this.register.index == 2){ //修改密码
                    this.modifyPassword();
                }else if(this.register.index == 3){ //修改法人姓名
                    if(this.validateQb.isEmpty(this.legal.name)){
                        this.modelCommonTip('法人姓名不能为空');
                        return;
                    }
                    let val = this.legal.name;
                    this.modifyHandle('legel',val);
                }else if(this.register.index == 4){ //修改电话
                    if(this.validateQb.isEmpty(this.tel)){
                        this.modelCommonTip('电话不能为空');
                        return;
                    }
                    if(this.tel == this.companyInfo.tel){
                        this.modelCommonTip('新电话不能跟旧电话相同');
                        return;
                    }
                    let val = this.tel;
                    this.modifyHandle('tel',val);
                }else if(this.register.index == 5){ //修改地址
                    if(this.validateQb.isEmpty(this.address)){
                        this.modelCommonTip('地址不能为空');
                        return;
                    }
                    let val = this.address;
                    this.modifyHandle('address',val);
                }else{
                    if(this.validateQb.isEmpty(this.memo)){
                        this.modelCommonTip('备注不能为空');
                        return;
                    }
                    let val = this.memo;
                    this.modifyHandle('memo',val);
                }
            },
            modifyHandle(condition,val){        //修改
                this.httpGet(this.URL.updateAccountCompany,{
                    modifyField:condition,
                    modifyValue:val
                },(response)=>{
                    let result = response.data;
                    this.register.state = false;
                    if(result.meta.success){
                        this.alertCommonTip("修改成功");
                        this.getCurAccountCompany();
                    }else{
                        this.alertCommonTip("修改失败");
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
            modifyCompanyName(){   //修改企业名称
                if(this.companyName == ''){
                    this.modelCommonTip('新公司名称不能为空');
                    return;
                }
                this.httpPost(this.URL.modifyCompanyName,{
                    newCompanyName:this.companyName
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.register.state = false;
                        this.getCurAccountCompany();
                        this.getData();
                        this.alertCommonTip("企业名称修改成功");
                    }else{
                        let msg = result.meta.message;
                        if(msg == 'over.long'){
                            this.alertCommonTip("企业名称过长")
                        }else{
                            this.alertCommonTip(msg)
                        }
                    }
                })
            },
            modifyPhone(){  //修改手机号码
                if($('.code').val() == ""){
                    this.modelCommonTip('请输入验证码');
                    return false;
                }
                this.httpPost(this.URL.modifyPhone,{
                    phoneOld:this.curAccount.mobileNo,
                    phoneNew:this.mobile.newPhone,
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
            getCode(){  //获取验证码
                if(this.validateQb.isEmpty(this.mobile.newPhone)){
                    this.modelCommonTip('手机号码不能为空');
                    return false;
                }
                if(!this.validateQb.isPhone(this.mobile.newPhone)){
                    this.modelCommonTip('手机号码格式不正确');
                    return false;
                } 
                if(this.curAccount.mobileNo == this.mobile.newPhone){
                    this.modelCommonTip('新手机号码不能跟原手机号码相同');
                    return false;
                } 
                if(!this.sendCodeState) return false;         
                this.httpGet(this.URL.verificationCode,{
                    mobileNo:this.mobile.newPhone
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
                if(this.ResetCodeTime == 0){
                    this.ResetCodeTime = 60;
                    this.sendCodeState = true;
                    $(".sendCode").text("获取验证码");
                    $(".sendCode").css({'cursor':'pointer','background':"#fff"});
                }else{
                    $(".sendCode").text("重新发送("+this.ResetCodeTime+"s)");
                    $(".sendCode").css({'cursor':'not-allowed','background':'#e6e7ed'});
                    setTimeout(()=>{
                        this.resetCode();
                    },1000)
                }                
            },
            showRegister(num){       //修改弹框显示
                this.register.state = true;
                this.register.index = num;
                if(num == 0){         //修改手机号码
                    [this.mobile.newPhone,this.mobile.code] = ['','']   //初始化修改手机弹框数据
                }else if(num == 1){   //修改企业名称
                    [this.companyName] = ['']   //初始化修改手机弹框数据
                }else if(num == 2){   //修改密码 
                    [this.psw.oldPwd,this.psw.newPwd,this.psw.repeatPwd] = ['','','']
                }else if(num == 3){   //修改法人名称
                    [this.legal.name] = [''];
                }else if(num == 4){   //修改号码
                    [this.tel] = [''];
                }else if(num == 5){   //修改地址
                    [this.address] = [''];
                }else{
                    [this.memo] = [''];
                }
            },            
            getHeadIcon(){   //获取头像
                this.httpGet(this.URL.getHeadIcon,{},(response)=>{
                    this.headImg = response.data;
                    this.$store.dispatch('changeHeadImg',response.data)
                })
            },
            getCurAccountCompany(){   //获取企业信息
                this.httpGet(this.URL.getCurAccountCompany,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.companyInfo = result.data;
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            getData(){   //获取基本信息
                this.httpGet(this.URL.getCurAccount,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                    this.msg = result.data;
                    this.userStateNum = result.data.accType;
                    this.$store.dispatch('changeState',result.data.accType);          
                    this.$store.dispatch('changeAccid',result.data.accId);     
                    this.$store.dispatch('changeRolState',result.data.role);    
                    this.$store.dispatch('saveCurAccount',result.data);    
                    if(result.data.accType == 0){ //系统管理员
                        this.$store.dispatch('changeUserName',result.data.displayName);  
                    }          
                    if(result.data.accType == 1){  //大B管理员
                        this.$store.dispatch('changeUserName',result.data.companyName);  
                    }
                    if(result.data.accType == 2){  //大B用户 
                        this.$store.dispatch('changeUserName',result.data.memName)
                    } 
                    if(result.data.accType == 3){ //小B
                        this.$store.dispatch('changeUserName',result.data.displayName);  
                    }      
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }        
                })
            },
            headIconChange(){  //修改头像
                let uploadIcon = document.getElementById("uploadIcon");
                let uploadIconForm = document.getElementById("uploadIconForm");
                if (uploadIcon.value == null || uploadIcon.value == "") {
                    return;
                }
                var ext = uploadIcon.value.substring(uploadIcon.value.lastIndexOf(".") + 1).toLowerCase();
                if (ext != 'gif' && ext != 'jpg' && ext != 'png' && ext != 'jpeg') {
                    this.alertCommonTip("仅支持 .gif/.jpg/.png 格式");
                    return;
                }
                if (uploadIcon.files != undefined) {
                    var file = uploadIcon.files[0];
                    if (file.size > 2 * 1024 * 1024) {
                        this.alertCommonTip("文件大小不允许超过2MB");
                        return;
                    }
                }
                /*if (uploadIcon.files == undefined) {
                    uploadIconForm.submit();
                    return;
                }*/
                let fd = new FormData();
                fd.append("uploadIcon", uploadIcon.files[0]);
                fd.append("supportFile", true);
                let xhr = new XMLHttpRequest();
                xhr.addEventListener("load", this.uploadIconComplete, false);
                xhr.open("POST", this.apiPath + this.URL.uploadHeadIcon);//修改成自己的接口
                xhr.send(fd);
            },
            uploadIconComplete(evt) {   //上传头像
                let result = evt;
                if (evt.target){
                    result = evt.target.responseText;
                }
                if (result.indexOf('unlogin') != -1) {
                    window.location.href="/logout";;
                } else if (result.indexOf('error') != -1) {
                    this.alertCommonTip("上传失败");
                } else if (result.indexOf('success') != -1) {
                    this.getHeadIcon();
                    
                } else {
                    this.alertCommonTip("上传失败");
                }
            }            
        },
        mounted(){
            this.getHeadIcon();
            this.getCurAccountCompany();
            if(this.cloudyState){
                document.title="云合同-基本信息";
            }else{
                document.title="签吧-基本信息";
            }
            this.$store.dispatch("changeTitle","安全设置 > 基本信息");
            var clipboard = new Clipboard('#btn');
            let This = this;
            clipboard.on('success', function(e) {
                console.log(e);
                This.modelCommonTip("复制成功");
            });

            clipboard.on('error', function(e) {
                console.log(e);
            });
        }
    }
</script>
<style lang="scss" scoped>
    $border:#dedede;
    $pink:#ff503f;
    .basicInfo{
        .sysAlert{
            label{
                font-size: 16px;
                padding-bottom:15px;
                display:block;
            }
            p{
                color: #4a4a4a;
                font-size: 16px;
                color: $pink;
                // word-wrap: break-word;
                overflow: hidden;
                width: 100%;
            }
        }
        h3{
            font-size: 14px;
            font-weight: normal;
            text-indent: 10px;
        }
        .basic_box{
            position: relative;
            .side_left{
                width: 20%;
                position: absolute;
                height: 96%;
                top: 2%;
                left: 0;
                border-right: 1px $border solid;
                overflow: hidden;
                form{
                    height: 170px;
                    position: relative;
                }
                span{
                    width: 120px;
                    height: 120px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -70px;
                    margin-left: -60px;
                    border-radius: 100%;
                    overflow: hidden;
                    -ms-border-radius:100%;
                    
                    img{
                        width: 100%;
                    }
                }
                p{
                    position: absolute;
                    width: 100%;
                    top: 85%;
                    text-align: center;
                }
                input[type="file"]{
                    position: absolute;
                    left: 0;
                    top:0;
                    width: 100%;
                    font-size: 100px;
                    height: 100%;
                    opacity: 0;
                }
            }
            .side_right{
                padding-left: 20%;
                ul{
                    padding: 4px;
                    li{
                        width: 50%;
                        float: left;
                        p{
                            background:#f6f8fc;
                            margin: 4px;
                            line-height: 50px;
                            span{
                                padding-left: 10px;
                                display: block;
                                float: left;
                                &:nth-child(1){
                                    width: 20%;
                                }
                                a{
                                    color: #3498DB;
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                    &.oneLine{
                        li{
                            width: 100%;
                        }
                    }
                }
            }
        }
        .basic_box_second{
            ul{
                padding: 4px;
                li{
                    width: 100%;
                    float: left;
                    p{
                        background:#f6f8fc;
                        margin: 4px;
                        line-height: 50px;
                        span{
                            padding-left: 10px;
                            display: block;
                            float: left;
                            &:nth-child(1){
                                width: 20%;
                            }
                        }
                    }
                }
            }
        }
        .infoRegister{
            width: 300px;
            margin: 0 auto;
            p{
                padding: 10px 0;
                label{
                    width: 80px;
                    margin-right: 10px;
                    display: block;
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    text-align: right;
                }
                input{
                    width: 200px;
                    display: block;
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    border: 1px $border solid;
                    border-radius:2px;
                    -ms-border-radius:2px;
                    text-indent: 10px;
                    &.code{
                        width: 90px;
                        border-radius: 0;
                        -ms-border-radius:0;
                        border-top-left-radius:2px;
                        -ms-border-top-left-radius:2px;
                        border-bottom-left-radius:2px;
                        -ms-border-bottom-left-radius:2px;
                    }
                }
                .sendCode{
                    width: 110px;
                    height: 30px;
                    line-height: 30px;
                    border: 1px $border solid;
                    display: block;
                    float: left;
                    color: #4a4a4a;
                    margin-left: -1px;
                    border-top-right-radius:2px;
                    -ms-border-top-right-radius:2px;
                    border-bottom-right-radius:2px;
                    -ms-border-bottom-right-radius:2px;
                }
            }
        }
        
    }
</style>

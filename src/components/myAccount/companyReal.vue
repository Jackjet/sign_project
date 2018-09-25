<template>
    <div class="companyReal">
        <div class="right_col">
            <div class="panel-box panel-white">
                <div class="realForm row">
                   <form id="realBox" method="post" enctype="multipart/form-data">
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">企业名称<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="com_name" v-model.trim="com_name">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">法人姓名<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="legel_name" v-model.trim="legel_name">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">法人身份证号<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="legel_idc" v-model.trim="legel_idc">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">法人身份证照片<b>*</b></label>
                            <div class="col-md-8 col-sm-8 col-xs-12 col-lg-8">
                                <div class="uploadImg">
                                    <div class="imgBox" @click="uploadImgChange('frontImg','frontFile')">
                                        <i class="icon-picture"></i>
                                        <p>点击上传</p>
                                        <img src="../../assets/images/transparent.png" id="frontImg"/>
                                        <input type="file" id="frontFile" name="idcard_file_f">
                                    </div>
                                    <p>身份证正面</p>
                                </div>
                                <div class="uploadImg">
                                    <div class="imgBox" @click="uploadImgChange('backImg','backFile')">
                                        <i class="icon-picture"></i>
                                        <p>点击上传</p>
                                        <img src="../../assets/images/transparent.png" id="backImg"/>
                                        <input type="file"  id="backFile" name="idcard_file_b">
                                    </div>
                                    <p>身份证反面</p>
                                </div>
                            </div>
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">工商注册号<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="bus_reg_id" v-model.trim="bus_reg_id">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">营业执照<b>*</b></label>
                            <div class="col-md-8 col-sm-8 col-xs-12 col-lg-8">
                                <div class="uploadImg">
                                    <div class="imgBox" @click="uploadImgChange('certFront','certFrontFile')">
                                        <i class="icon-picture"></i>
                                        <p>点击上传</p>
                                        <img src="../../assets/images/transparent.png" id="certFront"/>
                                        <input type="file" name="bus_file_f" id="certFrontFile">
                                    </div>
                                    <p>正本照片</p>
                                </div>
                                <div class="uploadImg">
                                    <div class="imgBox" @click="uploadImgChange('certBack','certBackFile')">
                                        <i class="icon-picture"></i>
                                        <p>点击上传</p>
                                        <img src="../../assets/images/transparent.png" id="certBack"/>
                                        <input type="file" name="bus_file_b" id="certBackFile">
                                    </div>
                                    <p>副本照片</p>
                                </div>
                            </div>
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">联系人手机号<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="contact_phone" v-model.trim="contact_phone">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">组织机构代码<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="org_code" v-model.trim="org_code">
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">组织机构代码证<b>*</b></label>
                            <div class="col-md-8 col-sm-8 col-xs-12 col-lg-8">
                                <div class="uploadImg">
                                    <div class="imgBox" @click="uploadImgChange('organizationImg','organizationFile')">
                                        <i class="icon-picture"></i>
                                        <p>点击上传</p>
                                        <img src="../../assets/images/transparent.png" id="organizationImg"/>
                                        <input type="file" name="org_file_f" id="organizationFile" >
                                    </div>
                                    <p>副本照片</p>
                                </div>
                            </div>
                        </div>
                        <div class="clf item">
                            <label class="col-lg-3 col-md-3 col-sm-3 col-xs-12">税务登记号<b>*</b></label>
                            <input type="text" class="col-md-6 col-sm-6 col-xs-12 col-lg-6" name="tax_code" v-model.trim="tax_code">
                        </div>
                        <div class="clf item">
                            <div class="btnBox">
                                <a href="javascript:;" @click="backSecurity">取消</a>
                                <a href="javascript:;" @click="realHandle">{{sureBtnTxt}}</a>
                            </div>
                        </div>
                   </form>
                </div>
            </div>
        </div>
        <!--公共弹框-->
        <alertModel :title="'温馨提示'" :context="showAlertData.context" :autoClose="showAlertData.autoClose"  :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    import '@/assets/js/plugin/jquery.form.js';
    export default{
        data(){
            return{
                sureBtnTxt:'确定',
                showAlertData : {   //公共弹框参数
                    showAlert:false,
                    context:'',
                    autoClose:false
                },
                real:{
                    frontImg:false,                 //身份证正面
                    backImg:false,                  //身份证反面
                    certFront:false,                //营业执照正本照片
                    certBack:false,                 //营业执照副本照片
                    organizationImg:false,          //组织机构代码证        
                },
                com_name:'',                    //企业名称
                legel_name:'',                  //法人姓名
                legel_idc:'',                   //法人身份证号
                bus_reg_id:'',                  //工商注册号
                contact_phone:'',               //联系人手机号
                org_code:'',                    //组织机构代码
                tax_code:'',                    //税务登记号
            }
        },
        methods:{
            backSecurity(){
                this.$router.push({
                    name:'security'
                });
            },
            beforeSubmit(){
                if(this.validateQb.isEmpty(this.com_name)){
                    this.alertCommonTip('企业名称不能为空');
                    return false;
                }
                if(this.validateQb.isEmpty(this.legel_name)){
                    this.alertCommonTip("法人姓名不能为空");
                    return false;
                }
                if(this.validateQb.isEmpty(this.legel_idc)){
                    this.alertCommonTip("身份证号不能为空");
                    return false;
                }
                if(!this.validateQb.isCardNo(this.legel_idc)){
                    this.alertCommonTip("身份证号不合法");
                    return false;                    
                }
                if(!this.real.frontImg){
                    this.alertCommonTip("请上传身份证正面图片");
                    return false;    
                }
                if(!this.real.backImg){
                    this.alertCommonTip("请上传身份证反面图片");
                    return false;    
                }
                if(this.validateQb.isEmpty(this.bus_reg_id)){
                    this.alertCommonTip("工商注册号不能为空");
                    return false;
                }
                if(!this.real.certFront){
                    this.alertCommonTip("请上传营业执照正本图片");
                    return false;    
                }
                if(!this.real.certBack){
                    this.alertCommonTip("请上传营业执照副本图片");
                    return false;    
                }
                if(this.validateQb.isEmpty(this.contact_phone)){
                    this.alertCommonTip("联系人手机不能为空");
                    return false;
                }
                if(!this.validateQb.isPhone(this.contact_phone)){
                    this.alertCommonTip("联系人手机格式不正确");
                    return false;
                }
                if(this.validateQb.isEmpty(this.org_code)){
                    this.alertCommonTip("组织机构代码不能为空");
                    return false;
                }
                if(!this.real.organizationImg){
                    this.alertCommonTip("请上传组织机构代码证图片");
                    return false;    
                }
                if(this.validateQb.isEmpty(this.tax_code)){
                    this.alertCommonTip("税务登记号不能为空");
                    return false;
                }
                return true
            },
            realHandle(){  //点击确定按钮
                if(this.sureBtnTxt != '确定') return;
                if(!this.beforeSubmit()) return;
                let This = this;
                this.sureBtnTxt = '提交中...';
                $('#realBox').ajaxSubmit({  
                    url : This.apiPath+This.URL.comAuthority,  
                    xhrFields: {
                            withCredentials: true
                    },
                    type:'post',
                    beforeSubmit:function(){
                        
                    },
                    success: function(res){ 
                        This.sureBtnTxt = '确定'
                        let backData = JSON.parse(res);
                        if(backData.meta.success){
                            This.alertCommonTip("实名认证提交成功,请等待管理员审核");
                            setTimeout(function(){
                                This.$router.push({
                                    name:"security"
                                });
                            },2000)
                        }else{
                            let msg = backData.meta.message;
                            if(msg == 'no.login'){
                                This.alertCommonTip("请重新登录");
                                setTimeout(()=>{
                                    window.location.href = This.linkHref + 'logout'
                                },2000)
                            }else{
                                This.alertCommonTip(msg);
                            }
                        }                      
                        
                    },
                    error:function(res){
                        if(res.statusText == "timeout"){
                            This.alertCommonTip('服务器繁忙，请稍后再试');
                        }                        
                    },
                    timeout:30000
                });
            },
            //实名认证上传图片
            uploadImgChange(objImg,obj){   //点击上传图片
                $("#"+obj).val("");
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
                    this.alertCommonTip('图片的格式必须为png、jpg、gif格式！');
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
                    This.setImg(pre_id);
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
                    This.setImg(pre_id);
                }
            }, 
            setImg(pre_id){  //设置照片有无上传
                if(pre_id == 'frontImg'){
                    this.real.frontImg = true;
                }else if(pre_id == 'backImg'){
                    this.real.backImg = true;
                }else if(pre_id == 'certFront'){
                    this.real.certFront = true;
                }else if(pre_id == 'certBack'){
                    this.real.certBack = true;
                }else{
                    this.real.organizationImg = true;
                }
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title = "云合同-企业实名认证";
            }else{
                document.title = '签吧-企业实名认证';
            }
            this.$store.dispatch('changeTitle','企业实名认证');
        }
    }
</script>

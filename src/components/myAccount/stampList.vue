<template>
    <div class="stampList" v-cloak>         
        <div class="right_col">
            <!-- 我的 -->
            <p class="stampTitle">公司印章（共{{stampTotal}}个）
                <a href="javascript:;" v-if="userState !=2 "  @click="showCreateStamp(1)"><i class="icon-circle-add"></i>上传签章</a>
                <a href="javascript:;" v-if="userState !=2 "  @click="showCreateStamp(0)" ><i class="icon-circle-add"></i>自动创建</a>
            </p>
            <div class="panel-box panel-white"  v-show="stampList.length == 0 && !stampListState">
                <div class="no-message">
                    <p><img src="../../assets/images/noAnyThing.png" alt="" ></p>
                    <p v-text="'暂无数据'"></p>
                </div>
            </div>
            <div class="panel-box panel-white stampList_box" v-for="(item,index) in stampList" :key="index">
                <h3>{{item.ownerInfo}}</h3>
                <ul class="clf stampList_info">
                    <li>
                        <p class="clf">
                            <span>证书编号</span>
                            <span>{{item.cert_no}}</span>
                        </p>
                    </li>
                    <li>
                        <p class="clf">
                            <span>颁发机构</span>
                            <span>{{item.issuer  | filterorganization}}</span>
                        </p>
                    </li>
                    <li>
                        <p class="clf">
                            <span>证书类型</span>
                            <span>{{item.keyType | filtercert}}</span>
                        </p>
                    </li>
                    <li>
                        <p class="clf">
                            <span>有效期至</span>
                            <span>{{item.valid_end | filterdata}}</span>
                        </p>
                    </li>
                </ul>
                <ul class="list clf">
                    <li v-for="(item2,index2) in item.stampArr" :key="index2" ><!--class="rotateStamp"-->
                        <div class="thumbnail">
                            <div class="image" id="stamp_div_0"><img v-if="item2.isDefault == 'Y'" class="defFlagImg" src="../../assets/images/defFlagImg.png">
                                <img id="stamp_img_0"  v-if="item2.stampFlag && item2.stampFlag != 3" width="200" height="200"  :src="'data:image/png;base64,'+item2.base64_data" alt="" class="stampImg aaa">
                                <img id="stamp_img_0"  v-else-if="item2.stampFlag == '3'" width="240" height="185" :src="'data:image/png;base64,'+item2.base64_data" alt="" class="stampImg">
                                <img id="stamp_img_0"  v-else  :src="'data:image/png;base64,'+item2.base64_data" alt="" class="stampImg">
                                <div class="mask">
                                </div>
                            </div>
                            <div class="caption clf">
                                <p class="clf">
                                    <span id="textStampName" class="shengl">{{item2.stampName}}</span>                                     
                                    <a class="stampOptBtn" v-if="userState != 2" @click="clickStampBtn(index,index2,item2.stampId)">
                                        <i class="icon-del"></i>
                                    </a>                                 
                                    <a class="stampOptBtn" title="默认" v-if="userState != 1" @click="setDefaultStamp(item2.stampBindId)">
                                        <i class="icon-check-default"></i>
                                    </a> 
                                    <a class="stampOptBtn" title="授权" v-if="userState == 1" @click="clickWarrant(item2.stampId)">
                                        <i class="icon-shouquan"></i>
                                    </a> 
                                    
                                    <a  class="stampOptBtn" v-if="userState != 2" @click.stop="copyStampHandle(index,index2)">
                                        <i class="icon-copy"></i>
                                        <div class="copyStampDropDown" v-show="stampIndex == index && clickIndex == index2">
                                            <div class="copyStampDropDownTitle"><i></i>复制签章样式到</div>
                                            <div class="eachSpanBox clf " :id="cloudyState ? '':'eachSpanBox'+index2" :class="[cloudyState ? 'sign_page_scrollBody':'']" > <!--mCustomScrollbar-->
                                                <span v-show="item3.cert_no != item.cert_no" v-for="(item3,index3) in copyStampList" :key="index3" @click.stop="selectCopyStamp(item3)"><a class="stampCopyCheck" :class="[item3.selectStatus ? 'icon-check2-default':'icon-square ']"></a><p :title="item3">{{item3.name}}</p></span>
                                            </div>
                                            <div class="copyStampDropDownFooter"><span class="copyCancle" @click.stop="cancleCopy">取消</span><span class="copyComfirm" @click.stop="sureCopyHandle">确定</span></div>
                                        </div>                                            
                                    </a>  
                                </p>
                            </div>
                        </div>                        
                    </li>
                    <li v-if="userState != 2">
                        <div class="thumbnail addStampSignal" @click="showCreateStamp(2,item)">
                            <i class="icon-add-signers"></i>
                        </div>
                    </li>
                    
                </ul>
            </div>
        </div>
        
        <!--确认删除弹框-->
        <alertModel :title="'温馨提示'" :context="'是否确定删除？'"  :type="2" v-show="delAlert.state"   @cancelHandle="delAlert.state = false" @sureHandle="delStamp($event)">
        </alertModel>
        <!--把签章授权给用户弹框-->
        <alertModel :title="'把签章授权给用户'"  :type="2" :alelrtClassWidth="'598px'"  :showState="warrant.state"  v-show="warrant.state"  @cancelHandle="warrant.state = false" @sureHandle="sureWarrant" :sureBtnTxt="warrant.sureBtnTxt">
            <div class="side_left_tree"  slot="alert-content" style="max-height:400px;height:auto" :id="cloudyState ? '' :warrantScroll" :class="[cloudyState ? 'sign_page_scrollBody':'']"> <!--mCustomScrollbar-->
                    <Tree @selectTreeItem="selectTreeItemHandle"  @checkBoxSelect="checkBoxSelectHandle" :treeListData="warrant.treeListData" :selectAccId="warrant.selectAccId"  :treeLoading="warrant.treeLoading"></Tree>
            </div>  
        </alertModel>
        <!-- 创建签章弹框 自动创建 -->
        <!-- @cancelHandle="cancleCreateStamp" @sureHandle="sureCreateStamp" -->
        <alertModel :title="'自动创建'"  :alelrtClassWidth="'798px'" :type="2" :scrollModel="true" :sweet="true" :showState="creatStamp.state"  @cancelHandle="cancleCreateStamp" v-show="creatStamp.state"   >
            <div slot="alert-content" class="createBox">
                <div class="form">
                    <form action="" id="uploadFormZiDong"  method="post" enctype="multipart/form-data">
                        <div class="input-control  clf">
                            <label>签章类型</label>
                            <div class="input-right" >
                                <select id="sealTemplate" @change="sealTemplateChanged()" v-model="stampFlag" name="stampFlag">
                                    <option value="1">合同章</option>
                                    <option value="4">单位公章</option>
                                    <option value="2">财务专用章</option>
                                    <option value="3">发票专用章</option>
                                </select>    
                            </div>
                        </div>
                        <input type="hidden" placeholder="请输入签章名称" name="stampName" v-model="stampName">  
                        <div class="input-control  clf">
                            <!-- <label class="opacity">绑定</label>
                            <div class="input-right">
                                <a href="javascript:;"  class="bindUkey" @click="getCertData">
                                    绑定UKEY
                                </a>                                
                            </div> -->
                            <span class="bindUkeyTip red"  >{{ddata ? ' 证书获取成功' :bindUkeyTip}}</span>
                        </div>
                        <div class="canvasBox clf">
                            <div id="divView" class="signet">
                                <div id="divSeal"></div>
                            </div>
                        </div>
                        <input type="hidden" name="genImgFile" v-model="genImgFile">
                        <div class="input-control clf">
                            <label>法定名称</label>
                            <div class="input-right">
                                <input id="legalNameText" type="text" class="input-templet" style="background:#efefef;" readonly>
                            </div>                        
                        </div>
                        <div class="input-control clf">
                            <label>印章编码</label>
                            <div class="input-right">
                                <input id="infoCodingText" type="text" class="input-templet" placeholder="请输入印章编码" v-model="infoCodingText" @keyup="infoCodingChanged" autocomplete="off">
                                <!-- <p style="color:#ff503f;text-align:left;" v-show="infoCodingTip">输入位数不对，建议输入13位数字</p> -->
                            </div>                        
                        </div>
                        <div class="input-control clf" v-show="stampFlag == 3">
                            <label>税号</label>
                            <div class="input-right">
                                <input id="appendix1Text" type="text" class="input-width" @keyup="appendix1Changed" v-model="appendix1Text" autocomplete="off">
                                <!-- <p style="color:#ff503f;text-align:left;" v-show="appendixTip">输入位数不对，建议输入18位数字</p> -->
                            </div>                        
                        </div>
                        <div class="input-control clf">
                            <label>印章颜色</label>
                            <div class="input-right color">
                                <span class="red"  :class="[colorIndex == 1 ? 'active':'']"  @click="selectColorChanged(1,'#ff0000')"><i class="icon-ok2"></i></span>
                                <span class="blue" :class="[colorIndex == 2 ? 'active':'']" @click="selectColorChanged(2,'#4a90e2')"><i class="icon-ok2"></i></span>
                            </div>                        
                        </div>
                        <div class="input-control clf">
                            <label>印章尺寸</label>
                            <div class="input-right">
                                <span class="size">{{jsonSeal ? jsonSeal.inFrame.exHeight : ''}}mm*{{jsonSeal ? jsonSeal.inFrame.exWidth : ''}}mm</span>
                            </div>                        
                        </div>
                        <input type="hidden" name="certValidDate" v-model="certValidDate">
                        <input type="hidden" name="keyType" v-model="keyType">
                        <input type="hidden" name="certBase64Data" v-model="signCertData">
                    </form>
                </div>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="cancleCreateStamp">取消</a>
				<a href="javascript:;" class="sure-btn" :class="[ddata ? '' : 'gray-btn']"    @click="sureCreateStamp" >{{creatStamp.sureBtnTxt}}</a>
            </div>
        </alertModel>
        <!-- 添加签章 -->
        <alertModel :title="addStamp.title"   :alelrtClassWidth="'798px'" :type="2"  :showState="addStamp.state"  v-show="addStamp.state"  @cancelHandle="addStamp.state = false" >
            <div slot="alert-content" class="createBox">
                <div class="form">                    
                    <form id="uploadForm" method="post" enctype="multipart/form-data">    
                        <div class="input-control  clf"  v-if="addStamp.index == 1">
                            <!-- <label >绑定</label>
                            <div class="input-right">
                                <a href="javascript:;" class="bindUkey" @click="getCertData">
                                    绑定UKEY
                                </a>
                                <span class="bindUkeyTip" :class="[bindUkeyState ? 'red' : '']">{{bindUkeyTip}}</span>
                            </div> -->
                            <span class="bindUkeyTip red" style="padding-left:20%;text-align:left;" >{{ddata ? ' 证书获取成功' :bindUkeyTip}}</span>
                        </div> 
                        <div class="input-control  clf">
                            <label>签章类型</label>
                            <div class="input-right">
                                <select id="sealTemplate2" class="form-control" name="stampFlag" @change="selectType" v-model="stampFlag">                            
                                    <option value="">无</option>
                                    <option value="1">合同章</option>
                                    <option value="4">单位公章</option>
                                    <option value="2">财务专用章</option>
                                    <option value="3">发票专用章</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-control clf">
                            <label>签章名称</label>
                            <div class="input-right">
                                <input type="text" placeholder="请输入签章名称" name="stampName" v-model="stampName" >
                            </div>
                        </div>
                        <div class="input-control uploadImg clf">
                            <label>签章图片</label>
                            <div class="input-right">
                                <div class="imgShow" id="imgShow" @click="uploadImgChange">
                                    <i class="icon-picture"></i>
                                    <p class="iconTip">点击上传</p>
                                    <img id="stampFile_pre" class="img_pre" src="" style="display:none">
                                    <input id="stampFile" type="file" name="stampFile">
                                </div> 
                                <p class="imgTip">支持透明的png、gif与白色背景的jpg图片，大小<2MB</p> 
                            </div>                      
                        </div>                        
                        <div v-if="addStamp.index == 2">  <!--添加-->
                            <input type="hidden" name="certCode" v-model="certCode" >
                        </div>
                        
                        <div v-if="addStamp.index == 1">  <!--上传-->
                            <input type="hidden" name="certValidDate" v-model="certValidDate">
                            <input type="hidden" name="keyType" v-model="keyType">
                            <input type="hidden" name="certBase64Data" v-model="signCertData">
                        </div>
                    </form>
                </div>
            </div>
            <div slot="alert-footer">
                <a href="javascript:;" class="cancel-btn"  @click="cancleCreateStamp">取消</a>
				<a href="javascript:;" class="sure-btn" :class="[ddata || addStamp.index == 2 ? '' : 'gray-btn']"    @click="sureCreateStamp" >{{addStamp.sureBtnTxt}}</a>
            </div>
        </alertModel>
        <!--输入pin码弹框-->
        <alertModel :title="'请输入PIN码'"  :type="2"  v-show="pin.state"  :sureBtnTxt="pin.sureBtnTxt"  @cancelHandle="pin.state = false" @sureHandle="toLoginUkey">
            <div slot="alert-content" class="pinNum">
                <p>
                    <label for="">PIN码</label>
                    <input type="password" id="pin">
                </p>
                <p style="color:red;">
                    <label for="" class="opacity">提示</label>
                    <span v-html="pin.tip"></span>
                </p>
            </div>
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel> 
        </div>
        
    </div>
</template>
<script>
    
    import Vue from 'vue';
    Vue.filter('filterorganization', function (value) { //过滤颁发机构
        let statusTxt = '无法获取';
        if(value){
            let certIssuer = value.toLowerCase();
            if(certIssuer.indexOf('gdca') != -1 || ( certIssuer.indexOf('guang') != -1 && certIssuer.indexOf('certificate auth') != -1)){
                statusTxt = '数安时代科技股份有限公司（GDCA）';
            }else{
                statusTxt = value;            
            }
        }
        
        return statusTxt;
    });
    Vue.filter('filtercert',function(value){    //过滤证书
        let cert = '';
        switch (value) {
            case '001': 
                cert = 'U-Key证书';
                break;
            case '002':
                cert = 'PFX证书';
                break;
            case '003':
                cert = '托管证书';
                break;
            default:
                cert = '未知格式证书';
                break;
        }
        return cert;
    })
    // const stampCert = require('@/assets/js/seal/stampCert.js').default;
    // console.log(stampCert)
    import '@/assets/js/seal/Blob.js'; 
    import Raphael from 'raphael';
    // console.log(Raphael)
    import '@/assets/js/seal/raphael.export.js'; 
    import '@/assets/js/seal/canvg.min.js'; 
    // import '@/assets/js/seal/saveSvgAsPngYy.js'; 
    const saveSvg = require("@/assets/js/seal/saveSvgAsPngYy.js").default;
    import '@/assets/js/seal/spectrum.js'; 
    import '@/assets/js/seal/FileSaver.min.js'; 
    import '@/assets/js/seal/canvas-toBlob.js'; 
    const arraySealTemplate =  require('@/assets/js/seal/makeSealByRaphael.js')
    const readSealTemplate = require('@/assets/js/seal/sealTemplates.js');

    //gdca
    import '@/assets/js/GDCAPKI/jquery.jsonp.js'; 
    const Base64String = require("@/assets/js/GDCAPKI/base64.js").default;
    import '@/assets/js/GDCAPKI/gdca-pki-errcode.js'; 
    const $GDCA = require('@/assets/js/GDCAPKI/gdca-pki-lib.js').default;     
    import '@/assets/js/GDCAPKI/gdca_sof_method.js'; 
    const gMethod = require('@/assets/js/GDCAPKI/gdca_sof_method.js');

    import '@/assets/js/plugin/jquery.form.js';
    export default{
        name:'stampList',
        data(){
            return{
                stampList:[],        //签章列表数据
                stampListState:false,  //获取签章列表数据状态
                copyStampList:[],    //复制到签章列表数据
                stampTotal:null,     //签章总数
                getStampPerArr:[],   //每个签章对应数据
                stampIndex:null,     //点击的哪一个列表index
                clickIndex:null,     //点击删除，复制，设置默认，授权的签章index
                certCodeList:[],     //复制到哪一个的证书列表数组
                showAlertData:{        //公共弹框参数
                    showAlert:false,
                    title:"温馨提示",
                    context:"",
                    autoClose:false
                },
                delAlert:{
                    state:false
                },
                del:{
                    index:null,
                    StampId:null
                },
                //授权
                warrant:{
                    state:false,
                    sureBtnTxt:'确定',
                    treeListData:[],
                    selectAccId:[],
                    stampId:null,
                    treeLoading:false
                },
                //创建签章
                creatStamp:{
                    state:false,
                    title:'',
                    sureBtnTxt:'确定',
                    submitData:{

                    }
                },
                bindUkeyTip:"请先插入UKEY",
                bindUkeyState:false,
                //添加签章
                addStamp:{
                    state:false,
                    title:'',
                    sureBtnTxt:'确定',
                    index:1,  //上传签章
                    submitData:{

                    }
                },
                pin:{  //pin码弹框
                    state:false,
                    sureBtnTxt:'确定',
                    tip:""
                },
                stampFlag:'',         //类型
                legalNameText:null,  //法定名称
                stampName:null,
                infoCodingText:null,  //信息编码
                appendix1Text:'000000000000000000',  //税号
                colorIndex:1,   //印章颜色  1为红色  2为蓝色
                appendixTip:false,
                infoCodingTip:false,
                ddata:null,
                genImgFile:null,    //自动创建时的图片
                certCode:null,
                //声明变量
                rPaper:null,
                arrSeal:null,
                jsonSeal:null,
                divWidth:null,
                divHeight:null,
                viewBoxWidth:70,
                viewBoxHeight:null,
                setControlsFlag:false,
                customImg:new Image(),
                actualImgWidth:null,
                actualImgHeight:null,
                //绑定UKEY
                SGD_CERT_VALID_TIME:6,  //证书有效期
		        SGD_CERT_DER_PUBLIC_KEY:8,  //证书公钥信息
                certValidDate:null,
                certPublicKey:null,
                signCertData:null,   //证书信息
                keyType:'001',       //证书类型UKEY
                certInfoTimer:null,
            }
        },
        computed:{
            userState(){
                return this.$store.state.userState;
            },
            curAccount(){
                return this.$store.state.curAccount;
            },
            userName(){
                return this.$store.state.userName;
            }
        },
        methods:{
            pageGetCertInfo(stepFun,secFun,threeFun){
                let This = this;
                var sOID = '1.2.86.21.1.3';
                // $GDCA.getCertInfo(This.signCertData, This.SGD_CERT_VALID_TIME, function(certValidDate){
                    // This.certValidDate = new Base64String().decode(certValidDate);
                    // $GDCA.getCertInfo(This.signCertData, This.SGD_CERT_DER_PUBLIC_KEY, function(certPublicKey){
                    //     This.certPublicKey = certPublicKey;
                        stepFun();
                    // },secFun);
                // },threeFun);
            },
            checkCertValidDate(toValidDate) {
                let This = this;
                try{
                    var dateStr = toValidDate.split('notafter:')[1];
                    var timeArray =  dateStr.split(':');
                    var dateArray = timeArray[0].split('-');
                    dateArray[1] = parseInt(dateArray[1]) - 1;
                    var checkDate = new Date(dateArray[0],dateArray[1],
                            dateArray[2],timeArray[1],timeArray[2],timeArray[3]);
                    if(checkDate == undefined || checkDate == '' || checkDate < new Date()){
                        This.alertCommonTip("UKEY已过期");
                        return false;
                    }
                    return true;
                }catch(e){
                    return false;
                }
            },
            getStampAndCertList(){   //获取签章列表
                this.copyStampList = [];
                this.stampIndex = null;     //点击的哪一个列表index
                this.clickIndex = null;     //点击删除，复制，设置默认，授权的签章index   
                this.stampListState = true;               
                this.httpGet(this.URL.getStampAndCertList,{},(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.stampList = result.data.certList;
                        this.stampListState = false;                        
                        for(let i = 0; i < this.stampList.length ; i++){
                            this.stampList[i].stampArr = [];
                            this.copyStampList.push({
                                name:this.stampList[i].ownerInfo,
                                cert_no:this.stampList[i].cert_no,
                                selectStatus:false
                            });                            
                        }
                        this.stampTotal = result.data.stampCount;
                        this.getStampPerTotal();
                        
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            compare(property){   //根据数组的某一项进行升序排序
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            },
            getStampPerTotal(){      //获取所有签章的每条数据
                if(this.stampTotal == 0) return false;
                for(let i = 1; i <= this.stampTotal; i++){
                    this.httpPost(this.URL.getStampPer,{ajaxTime:i},(response)=>{
                        let result = response.data;
                        result.data.stampList[0].ajaxTime= i;
                        if(result.meta.success){
                            for(let j = 0; j < this.stampList.length; j++){
                                if(result.data.stampList[0].certCode == this.stampList[j].cert_no){
                                    this.stampList[j].stampArr.push(result.data.stampList[0]);
                                    this.stampList[j].stampArr.sort(this.compare('ajaxTime'));
                                    if(!this.cloudyState){
                                        setTimeout(()=>{
                                            $(".eachSpanBox").mCustomScrollbar({
                                                theme:"minimal"
                                            });
                                        })
                                    }
                                }
                            }
                        }else{
                            this.alertCommonTip(result.meta.message);
                        }
                    })
                } 
                /*setTimeout(()=>{
                    $('.stampList_box .list').find('li').fadeTo(500,0.34,function () {
                        $(this).removeClass('rotateStamp').addClass('fadeInStamp');
                    }).fadeTo(500,1);
                },300)     */         
            },
            getStampBindList(stampId){      //获取授权列表
                this.warrant.treeLoading = true;
                this.httpGet(this.URL.stampBindList,{
                    stampId:stampId
                },(response)=>{
                    let result = response.data;
                    this.warrant.treeListData = result.accList;
                    this.warrant.selectAccId = [];
                    this.warrant.treeListData.forEach((itemFirst,index1)=>{
                        if(itemFirst.checked){
                            this.warrant.selectAccId.push(itemFirst.id)
                        }
                        itemFirst.children.forEach((itemSecond,index2)=>{
                            if(itemSecond.checked){
                                this.warrant.selectAccId.push(itemSecond.id)
                            }
                            itemSecond.children.forEach((itemThree,index3)=>{
                                if(itemThree.checked){
                                    this.warrant.selectAccId.push(itemThree.id)
                                }
                                itemThree.children.forEach((itemFour,index4)=>{
                                    if(itemFour.checked){
                                        this.warrant.selectAccId.push(itemFour.id)
                                    }
                                    itemFour.children.forEach((itemFive,index5)=>{
                                        if(itemFive.checked){
                                            this.warrant.selectAccId.push(itemFive.id)
                                        }
                                    })
                                })
                            })
                        })
                    })
                    this.warrant.treeLoading = false;
                    setTimeout(()=>{
                        $('#warrantScroll').mCustomScrollbar({
                            theme:"minimal"
                        })   
                    })
                })
            },
            //创建签章
            showCreateStamp(num,item){  //0表示自动创建，1表示上传签章，2表示添加签章
                let This = this;
                this.addStamp.index = num;
                this.pin.tip = "";
                $("#stampFile_pre").prop("src","").hide();
                $("#imgShow .iconTip,#imgShow .icon-picture").show();
                this.bindUkeyTip = "请先插入UKEY";
                this.bindUkeyState = false;
                this.certBase64Data  = this.signCertData = null;
                if(num == 0){
                    this.creatStamp.state = true;
                    this.infoCodingText = null;
                    this.colorIndex = 1;         
                    this.stampFlag = 1;                    
                    this.creatStamp.title = '自动创建';            
                    if(!this.rPaper){
                        var $divView;
                        $divView = $('#divView');
                        this.divWidth = $divView.width();
                        this.divHeight = $divView.height();
                        $divView.width(this.divWidth);
                        $divView.height(this.divHeight);
                        this.rPaper = Raphael('divSeal', this.divWidth, this.divHeight);
                        this.viewBoxHeight = this.viewBoxWidth * this.divHeight / this.divWidth;
                        this.rPaper.setViewBox((this.divWidth - this.viewBoxWidth) / 2, (this.divHeight - this.viewBoxHeight) / 2, this.viewBoxWidth, this.viewBoxHeight);
                    }
                    this.sealTemplateChanged(1);
                    this.autoTimer();
                    

                }else if(num == 1){
                    this.stampFlag = '';        
                    this.addStamp.title = '上传签章';
                    this.addStamp.state = true;
                    this.stampName = "";
                    this.autoTimer();
                    $("#imgShow").find("#stampFile").remove();
                    $("#imgShow").append('<input id="stampFile" type="file" name="stampFile" style="width: 140px;height: 140px !important;font-size: 100px; position: absolute; top: 0; left: 0; opacity: 0; z-index: 5; font-size: 100px; overflow: hidden;">')                    
                }else{
                    this.stampFlag = '';        
                    this.addStamp.title = '添加签章';
                    this.certCode = item.cert_no;
                    this.addStamp.state = true;
                    this.stampName = "";
                    $("#imgShow").find("#stampFile").remove();
                    $("#imgShow").append('<input id="stampFile" type="file" name="stampFile" style="width: 140px;height: 140px !important;font-size: 100px; position: absolute; top: 0; left: 0; opacity: 0; z-index: 5; font-size: 100px; overflow: hidden;">')            
                }      
            },
            getCertData(){   //绑定UKEY
                let This = this;                
                gMethod.checkReadUserList(this, function (res) {
                    $("#pin").val("");
                    This.pin.state = true;
                    This.ddata = res;
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
                    This.pin.sureBtnTxt="绑定中...";
                gMethod.checkLoginKey(this, pin, function (res) {
                    This.pin.sureBtnTxt="绑定中...";
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
                    // $("#certBase64Data").val(signCertData);
                    This.signCertData = usercert;   //证书信息
                    // console.log(usercert)
                    if(This.addStamp.index == 0){
                        $.ajax({
                            type: "GET",
                            scriptCharset: "utf-8",
                            url: This.apiPath + This.URL.getCertInfo,
                            cache: false,
                            data: {
                                'cert': usercert,
                            },
                            async: false,
                            success: function (data) {
                                if (data.meta.success) {
                                    data = data.data;
                                    $("#legalNameText").val(data.owner);
                                    This.legalNameText = data.owner;
                                    This.jsonSeal.legalName.text = data.owner;
                                    This.legalNameChanged();
                                }
                            }
                        });
                    }
                    This.pageGetCertInfo(function () {
                        // if (This.checkCertValidDate(This.certValidDate) != true) {
                        //     return;
                        // }
                        This.bindUkeyTip = "绑定证书成功";
                        This.bindUkeyState = true;
                        This.pin.sureBtnTxt = "确定";
                        This.pin.state = false;
                        if(This.addStamp.index == 0){                            
                            This.autoCreate();
                        }
                        if(This.addStamp.index == 1){
                            This.uploadStamp();
                        }
                        
                    },function(err){
                        This.alertCommonTip("获取U-KEY公钥失败");
                        This.pin.state = false;
                        
                    },function(err){
                        This.alertCommonTip("获取U-KEY有效期失败");
                        
                    });
                }, function (err) {
                    var txt = 'code=' + err.ErrorCode + ',msg=' + err.ErrorMsg;
                    // $("#alterBox_h").modal("show");
                    // document.getElementById('alterBoxTitle_h').innerHTML = "获取U-KEY失败，请确认是否插入U-KEY或安装客户端";
                    This.alertCommonTip("获取U-KEY失败，请确认是否插入U-KEY或安装客户端");
                });
            },
            cancleCreateStamp(){
                this.creatStamp.state = false;
                this.addStamp.state = false;
                
                clearInterval(this.certInfoTimer);
                $('body').css({"height":'auto',"overflow":'auto'}); 
                // this.rPaper.clear();
            },
            valitateStamp(num){
                if(num != 2){
                    // if(!this.certBase64Data && !this.signCertData){
                    if(!this.ddata){
                        this.alertCommonTip("请先插入UKEY");
                        return false;
                    }
                }
                if(!this.stampName || this.stampName == ""){
                    this.alertCommonTip("签章名称不能为空");
                    return false;
                }               

                if(num != 0){
                    if($("#stampFile_pre").attr('src') == ""){
                        this.alertCommonTip("请上传签章图片");
                        return false;
                    }
                }
                return true;
            },
            sureCreateStamp(){   //点击确定按钮
                let This = this;
                if(!this.valitateStamp(this.addStamp.index)) return ;
                let submitData = {}
                if(this.addStamp.index == 0){  //自定义签章
                    /*绑定UKEY */
                    this.getCertData();
                    
                }else{
                    if(this.stampFlag == 0){
                        this.stampFlag = "";
                    }
                    if(this.addStamp.index == 1){  //上传签章
                        /*绑定UKEY */
                        this.getCertData();
                    }
                    if(this.addStamp.index == 2){  //添加签章
                        this.uploadStamp();
                    }
                } 
            },
            autoTimer(){   //请求证书定时器
                let This = this;
                This.ddata = null;
                This.certInfoTimer = setInterval(()=>{
                    if(This.ddata){
                        clearInterval(This.certInfoTimer)
                    }
                    gMethod.checkReadUserList(this, function (res) {    
                        This.ddata = res; 
                        $GDCA.exportUserCert(res, function (usercert) {
                            $.ajax({
                                type: "GET",
                                scriptCharset: "utf-8",
                                url: This.apiPath + This.URL.getCertInfo,
                                cache: false,
                                data: {
                                    'cert': usercert,
                                },
                                success: function (data) {
                                    if (data.meta.success) {
                                        data = data.data;
                                        if(This.addStamp.index == 0){
                                            $("#legalNameText").val(data.owner);
                                            This.legalNameText = data.owner;
                                            This.jsonSeal.legalName.text = data.owner;
                                            This.legalNameChanged();
                                        }
                                    } else {
                                        if (data.meta.message == 'no.login'){
                                            This.alertCommonTip("请重新登录")
                                        }else {
                                            This.alertCommonTip("读取UKEY失败")
                                        }
                                    }
                                }
                            });
                        }, function (err) {});
                    }, function (err) {});
                },1000)
            },
            uploadStamp(){  //添加和上传签章
                let This = this;
                this.addStamp.sureBtnTxt = "提交中...";
                $('input[name="certBase64Data"]').val(this.signCertData)
                $('#uploadForm').ajaxSubmit({  
                    url : This.apiPath+This.URL.addStampLight,  
                    xhrFields: {
                            withCredentials: true
                    },
                    type:'post',
                    success: function(res){
                        This.addStamp.sureBtnTxt = "确定"; 
                        let backData = JSON.parse(res);
                        
                        if(backData.meta.success){
                            This.addStamp.state = false;
                            This.alertCommonTip("添加签章成功");
                            This.getStampAndCertList();
                        }else{
                            let msg = backData.meta.message;
                            if(msg == 'bad.cert'){
                                This.alertCommonTip("证书数据错误")
                            }else if(msg == 'invalid.cert'){
                                This.alertCommonTip("证书已过期")
                            }else if(msg == "flag.exist"){
                                This.alertCommonTip("签章类型已存在")
                            }else{
                                This.alertCommonTip(msg)
                            }
                        }
                    },
                    error:function(res){
                        if(res.statusText == "timeout"){
                            This.alertCommonTip('服务器繁忙，请稍后再试')
                        }                        
                    },
                    timeout:30000
                });

            },
            autoCreate(){  //自动创建
                    let This = this;
                    // console.log($('input[name="certBase64Data"]').val())
                    this.genImgFile = this.saveGenImg();
                    $("input[name='genImgFile']").val(this.genImgFile);
                    this.creatStamp.sureBtnTxt = "提交中...";                    
                    $('input[name="certBase64Data"]').val(this.signCertData)
                    setTimeout(function(){
                        $('#uploadFormZiDong').ajaxSubmit({  
                            url : This.apiPath+This.URL.addStampLight,  
                            xhrFields: {
                                    withCredentials: true
                            },
                            type:'post',
                            beforeSubmit:function(){
                                
                            },
                            success: function(res){ 
                                This.creatStamp.sureBtnTxt = "确定";
                                let backData = JSON.parse(res);
                                
                                if(backData.meta.success){
                                    This.creatStamp.state = false;
                                    This.alertCommonTip("添加签章成功");
                                    This.getStampAndCertList();
                                }else{
                                    let msg = backData.meta.message;
                                    if(msg == 'bad.cert'){
                                        This.alertCommonTip("证书数据错误")
                                    }else if(msg == 'invalid.cert'){
                                        This.alertCommonTip("证书已过期")
                                    }else if(msg == "flag.exist"){
                                        This.alertCommonTip("签章类型已存在")
                                    }else{
                                        This.alertCommonTip(msg)
                                    }
                                }
                            },
                            error:function(res){
                                if(res.statusText == "timeout"){
                                    This.alertCommonTip('服务器繁忙，请稍后再试')
                                }                        
                            },
                            timeout:30000
                        });
                    })
            },
            uploadImgChange(){   //点击上传图片
                $("#stampFile").unbind().on('change',()=>{     
                    let name = $("#stampFile").val().split('.')[1];
                    if(name != 'png' &&  name != "gif" && name != "jpg" && name != "jpeg"){
                        this.alertCommonTip("不支持该类型，请上传png、gif或jpg类型图片");
                        return false;
                    }
                    var oMyFile = document.getElementById('stampFile');
                    if(oMyFile.files){  //判断ie是否支持此属性
                        let filesSize = $("#stampFile")[0].files[0].size/1024/1024;
                        if(filesSize > 2){
                            this.alertCommonTip("请上传小于2M的图片");
                            return false;
                        }
                    }                    
                    this.change('stampFile_pre', 'stampFile');
                    $("#stampFile_pre").show();
                    $('#imgShow .icon-picture').hide();
                    $('#imgShow .iconTip').hide();
                //    $('#stampFile').val('');  //解决第二次选同一张图片，不能触发onchange事件
                })
            },
            change(pre_id,file_id) {
                console.log(122)
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
                }
            },
            html5Reader(file,pre_id){
                var file = file.files[0];
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var pic = document.getElementById(pre_id);
                    $(pic).css('opacity',1);
                    pic.src=this.result;
                }
            },  
            //授权
            clickWarrant(stampId){
                this.getStampBindList(stampId);
                this.warrant.state = true;
                this.warrant.stampId = stampId;
            },
            sureWarrant(){  //点击授权确定按钮
                this.warrant.sureBtnTxt = '授权中...'
                this.httpPost(this.URL.stampBind,{
                    stampId:this.warrant.stampId,
                    selectAccId:this.warrant.selectAccId.join(',')
                },(response)=>{
                    this.warrant.sureBtnTxt = '确定';
                    let result = response.data;
                    if(result.meta.success){
                        this.warrant.state = false;
                        this.alertCommonTip("授权成功");
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            selectTreeItemHandle(val){
                // console.log(val)
            },
            checkBoxSelectHandle(item){
                if(item.checked){
                    item.checked = false;
                    for(let i = 0 ; i < this.warrant.selectAccId.length; i++){
                        if(this.warrant.selectAccId[i] == item.id){
                            this.warrant.selectAccId.splice(i,1);
                        }
                    }
                }else{
                    item.checked = true;
                    this.warrant.selectAccId.push(item.id)
                }
            },
            //设默认
            setDefaultStamp(id){  //设置默认签章
                this.httpPost(this.URL.defaultStamp,{
                    stampBindId:id
                },(response)=>{
                    let result = response.data;                    
                    if(result.meta.success){
                        this.getStampAndCertList();
                    }
                })
            },   
            //删除         
            clickStampBtn(stampIndex,delIndex,delStampId){  //点击删除签章按钮
                this.stampIndex = stampIndex;
                this.del.index = delIndex;
                this.del.StampId = delStampId;
                this.delAlert.state = true;
            },
            delStamp(){  //确定删除签章   找到对应证书下面的对应签章
                this.httpPost(this.URL.delStamp,{
                    stampId: this.del.StampId
                },(response)=>{
                    let result = response.data;
                    this.delAlert.state = false;
                    if(result.meta.success){
                        this.stampList[this.stampIndex].stampArr.splice(this.del.index,1);  
                        this.stampTotal =  this.stampTotal-1;
                        if(this.stampList[this.stampIndex].stampArr.length == 0){
                            this.stampList.splice(this.stampIndex,1);
                        }                  
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            //复制
            copyStampHandle(stampIndex,clickIndex){         //点击复制印章 (判断复制印章div显示隐藏)
                this.stampIndex = stampIndex;
                this.clickIndex = clickIndex;
            },
            selectCopyStamp(item){    //复制签章选择              
                if(item.selectStatus){
                    item.selectStatus = false;
                    for(let i = 0; i < this.certCodeList.length ; i++){
                        if(this.certCodeList[i] == item.cert_no){
                            this.certCodeList.splice(i,1);
                        }
                    }
                }else{
                    this.certCodeList.push(item.cert_no);
                    item.selectStatus = true;
                }
            },
            sureCopyHandle(){  //复制印章确定按钮
                let stampId = this.stampList[this.stampIndex].stampArr[this.clickIndex].stampId;
                this.httpPost(this.URL.copyStamp,{
                    stampId: stampId,
                    certCodeList:this.certCodeList.join(',')
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        $('body').css({"height":'100%',"overflow":'hidden'});                    
                        this.showAlertData = {
                            showAlert:true,
                            title:"温馨提示",
                            context:"签章复制成功"
                        }  
                        this.certCodeList=[];                                            
                        this.getStampAndCertList();
                        this.cancleCopy();
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                    
                })
            },
            cancleCopy(){   //复制签章取消按钮
                this.clickIndex = null;
                for(let i = 0 ;  i < this.copyStampList.length; i++){
                    this.copyStampList[i].selectStatus = false;
                }
            },
            /*印章代码 */
            selectType(){
                this.stampFlag = $('#sealTemplate2').val();
                
                if( $("#sealTemplate2").find("option:selected").text() == "无"){
                    this.stampName = '';
                }else{
                    this.stampName = $("#sealTemplate2").find("option:selected").text();
                }
            },
            sealTemplateChanged(num) {
                var templateIndex = null;
                if(num == 1){  //初始化
                    templateIndex = 0;
                    $("#sealTemplate option:first").prop("selected", 'selected');  
                }else{
                    templateIndex = $('#sealTemplate').get(0).selectedIndex;
                }
                this.stampName = $("#sealTemplate").find("option:selected").text();
                this.stampFlag = $('#sealTemplate').val();
                let Timer = setInterval(()=>{    
                       
                    if(this.userName){
                        clearInterval(Timer);
                        if(this.legalNameText){
                            this.jsonSeal = readSealTemplate(templateIndex,this.legalNameText);
                        }else{
                            this.jsonSeal = readSealTemplate(templateIndex,this.userName);
                        }                        
                        this.sealTemplate2Controls();
                        this.textTypeChanged();
                        if(this.colorIndex == 1){
                            this.selectColorChanged(1,"#ff0000");
                        }else{
                            this.selectColorChanged(2,"#4a90e2");
                        }
                        $('#infoCodingText').val(this.infoCodingText)
                        this.jsonSeal.infoCoding.text = this.infoCodingText;  //信息编码
                        this.infoCodingChanged();    
                        this.drawSeal();
                    }
                },300);
                
            },
            // 印章模板参数（除文本参数外）输出到控件
            sealTemplate2Controls() {
                let This = this;
                This.setControlsFlag = true;
                var sealExFrame = This.jsonSeal.exFrame;
                var sealInFrame = This.jsonSeal.inFrame;
                var sealLegalName = This.jsonSeal.legalName;
                var sealInfoCoding = This.jsonSeal.infoCoding;
                var sealAppendix1 = This.jsonSeal.appendix1;
                var sealAppendix2 = This.jsonSeal.appendix2;
                var sealAppendix3 = This.jsonSeal.appendix3;
                var sealCenterPattern = This.jsonSeal.centerPattern;
                var sealCenterLine = This.jsonSeal.centerLine;
                // 印章颜色
                if (This.jsonSeal.color != null) {
                    $('#sealColor').spectrum('set', This.jsonSeal.color);
                }
                // 外圆
                if (sealExFrame != null) {
                    $('#exFrameExWidth').val(sealExFrame.exWidth);
                    $('#exFrameExHeight').val(sealExFrame.exHeight);
                    $('#exFrameLineWidth').val(sealExFrame.lineWidth);
                } else {
                    $('#exFrameExWidth').val(null);
                    $('#exFrameExHeight').val(null);
                    $('#exFrameLineWidth').val(null);
                }
                // 内圆
                if (sealInFrame != null) {
                    $('#inFrameExWidth').val(sealInFrame.exWidth);
                    $('#inFrameExHeight').val(sealInFrame.exHeight);
                    $('#inFrameLineWidth').val(sealInFrame.lineWidth);
                } else {
                    $('#inFrameExWidth').val(null);
                    $('#inFrameExHeight').val(null);
                    $('#inFrameLineWidth').val(null);
                }
                // 法定名称文字
                if (sealLegalName != null) {
                    $('#legalNameText').val(sealLegalName.text);
                } else {
                    $('#legalNameText').val(null);
                }
                // 信息编码文字
                if (sealInfoCoding != null) {
                    $('#infoCodingText').val(sealInfoCoding.text);
                } else {
                    $('#infoCodingText').val(null);
                }
                // 附文1
                if (sealAppendix1 != null) {
                    $('#appendix1Text').val(sealAppendix1.text);
                } else {
                    $('#appendix1Text').val(null);
                }
                // 附文2
                if (sealAppendix2 != null) {
                    $('#appendix2Text').val(sealAppendix2.text);
                } else {
                    $('#appendix2Text').val(null);
                }
                // 附文3
                if (sealAppendix3 != null) {
                    $('#appendix3Text').val(sealAppendix3.text);
                } else {
                    $('#appendix3Text').val(null);
                }
                // 中心图案
                if (sealCenterPattern != null) {
                    $('#centerPattern').val(sealCenterPattern.style);
                    $('#cntPtnWidth').val(sealCenterPattern.width);
                    $('#cntPtnOffsetX').val(sealCenterPattern.offsetX);
                    $('#cntPtnOffsetY').val(sealCenterPattern.offsetY);
                } else {
                    This.jsonSeal.centerPattern = {};
                    This.jsonSeal.centerPattern.style = 'none';
                    $('#centerPattern').val('none');
                    $('#cntPtnWidth').val(null);
                    $('#cntPtnOffsetX').val(null);
                    $('#cntPtnOffsetY').val(null);
                }
                // 中心线
                if (sealCenterLine != null) {
                    $('#centerLineLength').val(sealCenterLine.length);
                    $('#centerLineWidth').val(sealCenterLine.lineWidth);
                    $('#centerLineInterval').val(sealCenterLine.interval);
                    $('#centerLineOffsetX').val(sealCenterLine.offsetX);
                    $('#centerLineOffsetY').val(sealCenterLine.offsetY);
                } else {
                    $('#centerLineLength').val(null);
                    $('#centerLineWidth').val(null);
                    $('#centerLineInterval').val(null);
                    $('#centerLineOffsetX').val(null);
                    $('#centerLineOffsetY').val(null);
                }
                This.setControlsFlag = false;
            },
            // 文本参数改变
            textTypeChanged() {
                let This = this;
                This.setControlsFlag = true;
                var sealLegalNamePrms = This.jsonSeal.legalName == null ? null : This.jsonSeal.legalName.prms;
                var sealInfoCodingPrms = This.jsonSeal.infoCoding == null ? null : This.jsonSeal.infoCoding.prms;
                var sealAppendix1Prms = This.jsonSeal.appendix1 == null ? null : This.jsonSeal.appendix1.prms;
                $('#fontName').val(null);
                $('#charHeight').val(null);
                $('#charWidth').val(null);
                $('#autoCharWidth').val(null);
                $('#charDistance').val(null);
                $('#textWidth').val(null);
                $('#textOffset').val(null);
                $('#textDegree').val(null);
                This.setControlsFlag = false;
            },
            // 绘制印章
            drawSeal() {
                let This = this;
                This.rPaper.clear();
                This.arrSeal = arraySealTemplate(This.rPaper, This.divWidth / 2, This.divHeight / 2, This.jsonSeal);
            },
            // 信息编码文本改变时
            infoCodingChanged() {
                // value=value.replace(/[^\d]/g,'')
                if(this.infoCodingText && this.infoCodingText != ''){
                    // this.infoCodingText = this.infoCodingText.replace(/[^\d]/g,'');
                    this.infoCodingText = this.infoCodingText.replace(/[^\w\.\/]/ig,'');
                    if(this.infoCodingText.length > 13){
                        this.infoCodingTip = true;
                    }else{
                        this.infoCodingTip = false;
                    }
                }
                
                this.jsonSeal.infoCoding.text = this.infoCodingText == '' ? null : this.infoCodingText;
                this.drawSeal();
            },
            //税号改变
            appendix1Changed() {
                if(this.appendix1Text && this.appendix1Text != ''){
                    this.appendix1Text = this.appendix1Text.replace(/[^\w\.\/]/ig,'');
                    if(this.appendix1Text.length > 18){
                        this.appendixTip = true;
                    }else{
                        this.appendixTip = false;
                    }
                }                
                this.jsonSeal.appendix1.text = this.appendix1Text == '' ? null : this.appendix1Text;
                this.drawSeal();
            },
            //法定名称文本改变时
            legalNameChanged() {
                this.jsonSeal.legalName.text = $('#legalNameText').val() == '' ? null : $('#legalNameText').val();
                this.drawSeal();
            },
            //颜色改变时
            selectColorChanged(num,color) {
                this.colorIndex = num;
                if (this.setControlsFlag == true){return;}
                   
                this.jsonSeal.color = color;
                this.drawSeal();
            },
            saveGenImg() {
                // if (!verifyText()) // 校验参数
                //     return;
                let This = this;
                This.rPaper.clear();
                var imgWidth, imgHeight;
                if (This.jsonSeal.exFrame != null) {
                    imgWidth = This.jsonSeal.exFrame.exWidth;
                    imgHeight = This.jsonSeal.exFrame.exHeight;
                } else {
                    if (This.jsonSeal.inFrame != null) {
                        imgWidth = This.jsonSeal.inFrame.exWidth;
                        imgHeight = This.jsonSeal.inFrame.exHeight;
                    } else {
                        alert('导出图片错误！印章缺乏内圆外圆！');
                        return;
                    }
                }
                $('#divSeal').width(imgWidth);
                $('#divSeal').height(imgHeight);
                This.rPaper.setSize(imgWidth, imgHeight);
                This.rPaper.setViewBox();
                This.arrSeal = arraySealTemplate(This.rPaper, imgWidth / 2, imgHeight / 2, This.jsonSeal);
                // 修改过的saveSvgAsPng.js --> saveSvgAsPngYy.js
                saveSvg.svgAsDataUri($(This.rPaper.toSVG()).get(0), 'seal.png', {
                    'scale': 300 / 25.4
                });
                $('#divSeal').width(This.divWidth);
                $('#divSeal').height(This.divHeight);
                This.rPaper.setSize(This.divWidth, This.divHeight);
                This.rPaper.setViewBox((This.divWidth - This.viewBoxWidth) / 2, (This.divHeight - This.viewBoxHeight) / 2, This.viewBoxWidth, This.viewBoxHeight);
                This.drawSeal();
                let baseUrl = saveSvg.getImg();
                if (baseUrl == '') {
                    This.alertCommonTip("请重新生成图片");
                    return;
                }
                // this.genImgFile = baseUrl.split(',')[1];
                return baseUrl.split(',')[1];
            },
            init(){
                $(document).on('click',()=>{
                   this.cancleCopy();
                })
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-签章管理";
            }else{
                document.title="签吧-签章管理";
            }
            let This = this;
            this.getStampAndCertList();            
            this.init();
            this.$store.dispatch("changeTitle","我的账户 > 签章管理");
        }
    }
</script>
<style lang="scss" scoped>
//  @import 'stampList.scss';
 @import '../../assets/css/seal/sealMaker.css';
 @import '../../assets/css/seal/spectrum.css';
 
.stampList{
    $border:#dedede;
    $pink:#ff503f;
    //创建签章弹框
    .cover-box{
        .createStampModel{
            top: 20% !important;
            
        }
    }
    .createBox{
        .form{
            .uploadImg{
                .imgTip{
                    text-align: left;
                    line-height: 50px;
                }
                .imgShow{
                    width: 140px;
                    height: 140px;
                    text-align: center;
                    display: table-cell;
                    vertical-align: middle;
                    overflow: hidden;
                    border: 1px $border solid;
                    position: relative;
                    i{
                        font-size: 50px;
                        color: $border;
                        z-index: 1;
                        position: absolute;
                        top: 20px;
                        left: 0;
                        text-align: center;
                        width: 100%;
                    }
                    p{
                        position: absolute;
                        z-index: 1;
                        width: 100%;
                        text-align: center;
                        top:100px;
                        left: 0;
                        color: #333333;
                    }                    
                    input{
                        width: 140px;
                        height: 140px !important;
                        font-size: 100px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        opacity: 0;
                        z-index: 5;
                        font-size: 100px;
                        overflow: hidden;        
                    }
                    img{
                        max-width: 140px;
                        max-height: 140px;
                        box-sizing: border-box;
                        margin: 0 auto;
                    }
                }
            }
            .input-control{
                width: 80%;
                margin: 0 auto 20px;
                .gray{
                    background: rgb(239, 239, 239);
                }
                &:last-child{
                    margin: 0 auto;
                }
                label{
                    height: 35px;
                    line-height: 35px;
                    width: 20%;
                    float: left;
                }
                .bindUkeyTip{
                    float: left;
                    line-height: 35px;
                    width: 100%;
                    text-align: center;
                    &.red{
                        color: $pink;
                    }
                }
                .input-right{
                    width: 70%;
                    float: left;
                    display: block;
                    select{
                        width: 100%;
                        height: 38px;
                        line-height: 38px;
                        border: 1px $border solid;
                        text-indent: 10px;
                    }
                    .bindUkey{
                        width: 70%;
                        border: 1px $pink solid;
                        display: block;
                        float: left;
                        height: 35px;
                        line-height: 35px;
                        border-radius: 4px;
                        color: $pink;
                        -ms-border-radius:4px;
                    }
                    .bindUkeyTip{
                        float: left;
                        line-height: 35px;
                        padding-left: 20px;
                        &.red{
                            color: $pink;
                        }
                    }
                    input{
                        height: 35px;
                        line-height: 35px;
                        width: 100%;
                        border: 1px $border solid;
                        text-indent: 10px;
                        padding: 0;                        
                    }
                    &.color{
                        height: 30px;
                        line-height: 35px;
                        span{
                            width: 35px;
                            height: 35px;
                            margin-right: 20px;
                            float: left;
                            i{
                                opacity: 0;
                                color: #fff;
                                font-size: 18px;
                            }
                            &.active{
                                i{
                                    opacity: 1;
                                }
                            }
                            &.red{
                                background: #ff0000;
                            }
                            &.blue{
                                background: #4a90e2;
                            }

            
                        }
                    }
                    .size{
                        float: left;
                        line-height: 35px;
                        height: 35px;
                    }
                }
            }
            .canvasBox{
                margin-bottom: 20px;
                .signet{
                    width: 370px;
                    height: 280px;
                    margin: 0 auto;
                }
            }
            
        }
    }
    .stampTitle{
        padding-bottom:25px;
        a{
            padding: 5px 10px;
            background:#fff;
            border: 1px $border solid;
            border-radius: 4px;
            text-align: center;
            float: right;
            color: #4a4a4a;
            &:nth-child(2){
                margin-right: 15px;
            }
        }
    }
    .stampList_box{
        h3{
            text-indent: 10px;
            font-weight: normal;
            font-size: 14px;
        }
            .stampList_info{
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
                        }
                    }                    
                }
            }
            .list{
                padding: 0 10px 10px;
                li{
                    width: 242px;
                    height: 242px;
                    float: left;
                    border: 1px $border solid;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    .thumbnail{
                        width: 242px;
                        height: 100%;
                        position: relative;
                        .image{
                            width: 242px;
                            height: 200px;
                            text-align: center;
                            display: table-cell;
                            vertical-align: middle;
                            overflow: hidden;
                            .stampImg{
                                max-width: 240px;
                                max-height: 200px;
                                padding: 10px 10px 10px 10px;
                                box-sizing: border-box;
                                margin: 0 auto;
                            }
                        }
                        .defFlagImg{
                            width: 70px;
                            height: 70px;
                            position: absolute;
                            z-index: 100;
                            right: 0px;
                            top: 0px;
                            padding: 0;
                        }
                        .caption{
                            background:#F7F7F7;
                            padding: 8px;
                            height: 26px;
                            line-height: 26px;
                            color: #868b91;
                            position: absolute;
                            width: 226px;
                            bottom: 0;
                            left: 0;
                            span{
                                width: 70px;
                                overflow: hidden;
                                display: block;
                                float: left;
                                line-height: 24px !important;
                                color: #868b91;                               
                            }
                            .stampOptBtn {
                                margin-bottom: 0;
                                text-align: center;
                                vertical-align: middle;
                                touch-action: manipulation;
                                cursor: pointer;
                                background-image: none;
                                border: 1px solid transparent;
                                white-space: nowrap;
                                float: right;
                                margin-left: 3px;
                            }
                            i{
                                font-size: 16px;
                            }
                            .copyStampDropDown{
                                min-width: 180px;
                                width: 330px;
                                position: absolute;
                                background: #fff;
                                top:40px;
                                left: 14px;
                                z-index: 1500;
                                border: 1px solid #f6f7fd;
                                -webkit-box-shadow:0 0 10px #97a8fd;
                                -moz-box-shadow:  0 0 10px #97a8fd;
                                -ms-box-shadow:  0 0 10px #97a8fd;
                                box-shadow:  0 0 10px #97a8fd;
                                border-radius: 7px;
                                color: #555555;
                                overflow: visible;
                                .copyStampDropDownTitle {
                                    font-size: 14px;
                                    line-height: 50px;
                                    height: 50px;
                                    width: 290px;
                                    background-color: #fff;
                                    font-weight: normal;
                                    position: relative;
                                    text-align: left;
                                    padding-left: 20px;
                                    i{
                                        font-size: 0;
                                        width: 0;
                                        height: 0;
                                        border: 5px solid;
                                        border-color: transparent transparent #fff transparent;
                                        margin-left: -5px;
                                        left: 50%;
                                        position: absolute;
                                        top: -10px;
                                        z-index: 55;
                                    }
                                }
                                .eachSpanBox{
                                    height: auto;
                                    max-height: 300px;
                                }
                                .eachSpanBox span{
                                    width:290px;
                                    height:50px;
                                    line-height:50px !important;
                                    padding:0 20px;
                                    border-bottom:1px #ececec solid;
                                    &:hover{
                                        background:#f6f8fc;
                                    }
                                    &:last-child{
                                        border-bottom:0;
                                    }
                                    .stampCopyCheck {
                                        float: left;
                                        left: 0px;
                                        margin-right: 10px;
                                    }
                                    p{
                                        width:250px;
                                        word-break:keep-all;/* 不换行 */
                                        white-space:nowrap;/* 不换行 */
                                        overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                                        text-overflow:ellipsis;
                                        text-align: left;
                                        color: #4b4b4b;
                                    }
                                    .icon-check2-default{
                                        color: #ff503f;
                                    }
                                }
                                .copyStampDropDownFooter{
                                    height: 50px;
                                    width: 100%;
                                    border-top: 1px solid #ececec;
                                    position: relative;
                                    bottom: 0px;
                                    float: left;
                                    .copyCancle {
                                        border-right: 1px solid #ececec;
                                    }
                                    .copyComfirm {
                                        color: red;
                                    }
                                    span{
                                        line-height: 50px !important;
                                        width:49.5%;
                                        background-color: #fff;
                                        font-size: 14px;
                                        height: 100%;
                                        float: left;
                                        display: block;
                                    }
                                }

                            }
                        }
                        &.addStampSignal{
                            text-align: center;
                            .icon-add-signers{                                
                                line-height: 230px;
                                font-size: 100px;
                                color: #efefef;
                            }
                        }
                    }
                    &.fadeInStamp{
                        transition-duration: 1.5s;
                        transform-style: preserve-3d;
                        -webkit-transform: rotateY(0deg);
                        -moz-transform: rotateY(0deg);
                        -ms-transform: rotateY(0deg);
                        -o-transform: rotateY(0deg);
                        transform: rotateY(0deg);
                    }
                    &.rotateStamp{
                        -webkit-transform: rotateY(180deg);
                        -moz-transform: rotateY(180deg);
                        -ms-transform: rotateY(180deg);
                        -o-transform: rotateY(180deg);
                        transform: rotateY(180deg);
                    }
                }
            }
        }

        //授权弹框
        .side_left_tree{
            .tree{
                width: 80%;
                margin: 0 auto;
            }
        }

        //pin码
        .pinNum{
            width: 90%;
            margin: 0 auto;
            label{
                width: 30%;
                height: 35px;
                line-height: 35px;
            }
            input{
                width: 60%;
                height: 35px;
                margin-left: 5%;
                line-height: 35px;
                border: 1px $border solid;
            }
        }
        .gray-btn{
            background: $border !important;
            border: 1px $border solid !important;
            color: #4b4b4b !important;
        }
        
}
</style>

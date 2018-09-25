<template>
    <div class="docDetail" id="docDetail" v-cloak>
        <div class="right_col">
            <div class="panel-box panel-white docDetail_box">
                <h3>{{docInfo.docName}}<span v-if="!docInfo.isOverTime" :class="docInfo.signStatus | filterStateClass">{{docInfo.signStatusName}}</span><span v-if="docInfo.isOverTime" class="refuse">{{docInfo.isOverTime == '1'? '已过期':''}}</span></h3>
                <div>
                    <p class="memo">{{ docInfo.memo ? docInfo.memo : '无备注'}}</p>
                    <div class="btn-box">
                        <p v-if="docInfo.duration < 4133865600000">有效期：{{docInfo.duration|filterdata}}</p>
                        <p v-if="docInfo.duration >= 4133865600000">有效期：永久有效</p>
                        <ul class="clf">
                            <li v-if="docInfo.signStatus == '300' || docInfo.signStatus == 'F500'">
                                <a href="javascript:;" @click.stop="appraisalStatus = true">鉴定服务<i></i></a>
                                <div class="selectBox" v-show="appraisalStatus">
                                    <ul>
                                        <li @click.stop="appraisal">
                                            签吧鉴定服务
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <a href="javascript:;" @click.stop="previewHandle">预览</a>
                            </li>
                            <li v-if="docInfo.signStatus == '201'">
                                <a href="javascript:;" @click.stop="signDoc">签署</a>
                            </li>
                            <li>                                
                                <a href="javascript:;" @click.stop="downDoc">下载</a>
                            </li>
                            <li v-if="docInfo.canBeRepeal">
                                <a href="javascript:;" @click.stop="repealAlelrt = true">撤销</a>
                            </li>
                            <li v-if="docInfo.signStatus == '300' &&　userState != 1">
                                <a href="javascript:;" id="dirGui" @click.stop="dirStatus = true">归档到<i></i></a>
                                <div class="selectBox2" id="scrollBox" v-show="dirStatus">
                                    <ul>
                                        <li style="text-align:center;" v-if="dirList.length  == 0">暂无数据</li>
                                        <li v-for="(item,index) in dirList" :key="index" class="shengl" @click.stop="addArchiveRecord(item.dirId)">
                                            {{item.dirName}}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="panel-box panel-white signInfo">
                <h3>签署情况 <!--<span>{{docInfo.signStatusName}}</span>--><span>{{docInfo.signOrderType == '002' ? '顺序签':'任意签'}}</span><span v-show="docInfo.signatureType == '002'">{{docInfo.signatureType == '002' ? '公平签':''}}</span></h3>
                <div class="sign-list" id="content-2">
                    <ul class="clf">
                        <li class="clf" v-for="(item,index) in signers" :key="index" :class="item.isSponsor == '0' && !item.signed ? 'wait':''">
                            <span  :class="[item.accNo != '0' && docInfo.signOrderType == '002' && !item.guoqi ? '' : 'opacity']" >{{ (item.accNo) < 10 ? '0'+item.accNo : item.accNo }}</span>
                            <!-- <span  :class="[(index > 2 &&　docInfo.signOrderType == '002') ? '' : 'opacity']" v-if="isExitCarbon && isExitSignerCancle">{{ (index-2) < 10 ? '0'+(index-2) : (index-2) }}</span>
                            <span  :class="[(index > 1 &&　docInfo.signOrderType == '002') ? '' : 'opacity']" v-else-if="(isExitCarbon && !isExitSignerCancle) || (!isExitCarbon && isExitSignerCancle) ">{{ (index-1) < 10 ? '0'+(index-1) : (index-1) }}</span>
                            <span  :class="[(index > 0 &&　docInfo.signOrderType == '002') ? '' : 'opacity']" v-else>{{ (index) < 10 ? '0'+(index) : (index) }}</span> -->
                            <span>
                                <b class="line"></b>
                                <i class="icon-send-person" v-if="item.isSponsor == 1  && item.signStatus != 'D400' "></i>
                                <i class="icon-chexiao" v-else-if="item.isSponsor == 1 && item.signStatus == 'D400'"></i>
                                <b class="icon-song" v-else-if="item.isCarbon == 1">@</b>
                                <i :class="[item.signed ? 'icon-check-default':'icon-wait']" v-else-if="item.isSponsor == 0 && item.signStatus != 'D400' && item.signStatus != 'NONE'"></i>
                                <i :class="[item.signed ? 'icon-check-default': '']" v-else-if="item.signed"></i><!--真宜签个人签署成功了，真宜签对应的企业撤销了-->
                                <b class="guoqi" v-else-if="item.duration">-</b>
                                <b v-else-if="item.signStatus == 'D400'" class="icon-close"></b>
                                <b v-else class="icon-circle"></b>
                                <strong v-if="item.isSponsor == 1 && item.signStatus != 'D400' ">发起人</strong>
                                <strong v-else-if="item.isCarbon == 1">抄送人</strong>
                                <strong v-else-if="item.isSponsor == 0 && item.signStatus != 'D400' && item.signStatus != 'NONE'">{{item.signed ? '已签署' : '待签署'}}</strong>
                                <strong v-else-if="item.signed">已签署</strong><!--真宜签个人签署成功了，真宜签对应的企业撤销了-->
                                <strong v-else-if="item.duration">截止日期：{{item.duration}}</strong>                                
                                <strong v-else-if="item.signStatus == 'D400'">已撤销</strong>
                                <strong v-else></strong>
                            </span>
                            <span class="shengl" :title="item.name" >
                                <b :class="[item.isSponsor != 0 ? 'opacity icon-seal' : (item.stampType == 0 ? 'icon-seal' : 'icon-sign-pen') ]"></b>{{item.name}}
                                <strong class="faqiren" v-if="item.isSponsor == 1  && item.signStatus == 'D400'">发起人</strong>
                            </span>
                            <span v-if="item.isSponsor != 0 && item.signStatus != 'D400'">{{item.sendTime}}</span>  <!--发起时间-->
                            <span v-else-if="item.signed ">{{item.signTime}}</span>
                            <span v-else>{{item.cancelTime}}</span>
                        </li>
                        <!-- <li class="clf" v-for="(item,index) in signers" :key="index">
                            <span></span>
                            <span><b class="line"></b><i class="icon-send-person"></i><strong>发起人</strong></span>
                            <span class="shengl"><b class="opacity icon-seal"></b>张三战三张三战三张三战三张三战三张三战三张三战三张三战三张三战三张三战三张三战三张三战三张三战三</span>
                            <span>2017-04-11</span>
                        </li>
                        <li class="clf">
                            <span></span>
                            <span><b class="line"></b><b class="icon-song">@</b><strong>抄送人</strong></span>
                            <span class="shengl"><b class="opacity icon-seal"></b>李四</span>
                            <span>2017-04-11</span>
                        </li>
                        <li class="clf">
                            <span>01</span>
                            <span><b class="line"></b><i class="icon-check-default"></i><strong>已签署</strong></span>
                            <span class="shengl"><b class="icon-seal"></b>王五</span>
                            <span>2017-04-11</span>
                        </li>
                        <li class="clf wait"  >
                            <span>03</span>
                            <span><b class="line"></b><i class="icon-wait"></i><strong>待签</strong></span>
                            <span class="shengl"><b class="icon-seal"></b>八阿哥</span>
                            <span>2017-04-11</span>
                        </li> -->

                    </ul>
                </div>
            </div>
        </div>
        <showpdf v-show="pdfShow" @closePreview="closePreview"></showpdf>
        <!-- <showpdf v-show="pdfShow" :docId="docId" @closePreview="closePreview"></showpdf> -->
        <!--点击下载判断是否是公平签署弹框-->
        <alertModel :title="''" :context="fairAlertData.context" :type="fairAlertData.type"  v-show="fairAlertData.showAlert"  @cancelHandle="fairAlertData.showAlert = false" @sureHandle="sureDown" >
            <h3 slot="alert-header"><b class="icon-zhuyi" style="color:red;margin-right:5px;"></b>{{fairAlertData.title}}</h3>
            <h3 slot="alert-content">
                采用公平签署，<br/>缺少任意一个签署人的签名，<br/>已签署的签名均无效。是否继续下载？
            </h3>
        </alertModel>
        <!--确定撤销弹框-->
        <alertModel :title="'确认撤销文档？'" :context="'确定撤销文档？'" :type="2"   v-show="repealAlelrt"  @cancelHandle="repealAlelrt = false"  @sureHandle="repealDocument">
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context"  :showState="showAlertData.showAlert" :autoClose="showAlertData.autoClose" v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import showPdf from '@/components/common/getPdf/getPdf.vue';
    import Vue from 'vue';
    Vue.filter('filterStateClass', function (value) { //value为status状态码 index表示是返回的第几个 0位txt ，1为class
        let statusTxt = [];
        switch(value){
            case '200':
                statusTxt = "signing";
                break;
            case '201':
                statusTxt = "signing";
                break;
            case '202':
                statusTxt = "signing";
                break;
            case '300':
                statusTxt = "finished";
                break;
            case 'D400':
                statusTxt = "refuse";
                break;
            default:
                statusTxt = "overdue"
                break;
                 
        }
        return statusTxt;
    });
    export default{
        name:'docDetail',
        data(){
            return {
                docId:this.$route.params.docId,
                docInfo:{},
                signers:[],
                showAlertData:{        //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false,
                },
                fairAlertData:{
                    title:'重要提示',
                    context:'',
                    type:2,
                    showAlert:false
                },
                pdfShow:false,
                previewNum:0,          //点击预览的次数
                repealAlelrt:false,    //确定撤销弹框
                appraisalStatus:false, //鉴定服务状态
                dirList:[],            //文件夹列表数据
                dirStatus:false,       //归档列表状态,
                isExitCarbon:false,    //是否存在抄送人
                isExitSignerCancle:false,  //是否存在发起人撤销文档
            }
        },
        components:{
            showpdf:showPdf
        },
        computed:{
            ...mapGetters([
            'userState'
            ])
        },
        methods:{
            getDocumentInfoVo(){  //获取文档详情信息
                this.httpGet(this.URL.getDocumentInfoVo,{
                    docId:this.docId
                },(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        this.docInfo = result.data;
                        if(this.docInfo.signStatus=='300'){
                            this.searchArchiveDirList();
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            }, 
            signtorList(){     //获取签署人信息
                this.httpGet(this.URL.signtorList,{
                    docId:this.docId
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.signers = result.data.list;
                        let index = 0;
                        for(let i = 0; i < this.signers.length; i++){
                            // console.log(index)
                            this.signers[i].guoqi = false;
                            if(this.signers[i].isSponsor == 1){        //发起人
                                this.signers[i].accNo = index;
                            }else if(this.signers[i].isCarbon == 1){   //抄送人
                                this.isExitCarbon = true;
                                this.signers[i].accNo = index;
                            }else if(this.signers[i].isSponsor == 1 && this.signers[i].signStatus == 'D400'){  //发起人撤销
                                this.isExitSignerCancle = true;
                                this.signers[i].accNo = index;
                            }else if(this.signers[i].duration){      //截止日期
                                this.signers[i].accNo = index;
                                this.signers[i].guoqi = true;
                            }else{
                                this.signers[i].accNo = ++index;                                
                            }
                        }
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })

            },
            searchArchiveDirList(){  //获取文件夹数据
                this.httpGet(this.URL.searchArchiveDirList,{
                },(response)=>{
                    let result = response.data;
                    if(result.meta.success){
                        this.dirList = result.data;
                        $("#scrollBox").mCustomScrollbar("destroy");
                        setTimeout(function(){
                            $("#scrollBox").mCustomScrollbar({
                                theme:"minimal"
                            });
                        })
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            addArchiveRecord(dirId){    //添加到归档文件
                this.dirStatus = false;
                this.httpGet(this.URL.addArchiveRecord,{
                    dirId:dirId,
                    docId:this.docId
                },(response)=>{
                    var result = response.data;
                    if(result.meta.success){          
                        this.alertCommonTip("归档成功");              
                        this.getDocumentInfoVo();
                        this.signtorList();
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            signDoc(){
                window.location.href= this.linkHref + "doc/document/toSignDoc?docId="+this.docId
            },
            downDoc(){   //点击下载
                if(this.docInfo.signStatus != '300' && this.docInfo.signatureType == '002'){
                    this.fairAlertData.showAlert = true;
                }else{
                    this.sureDown();
                }
            },
            sureDown(){
                this.fairAlertData.showAlert = false;
                window.location.href=this.linkHref+'doc/documentInfo/downloadDocument?docId='+this.docId;
            },
            previewHandle(){   //点击预览
                this.pdfShow = true;
                if(this.previewNum == 0){
                    this.Event2.$emit('getpdf',this.previewNum,this.docId);
                }
                // this.previewNum ++;
            },
            closePreview(){   //关闭预览弹框
                this.pdfShow = false;
            },
            repealDocument(){  //撤销文档
                this.httpPost(this.URL.repealDocument,{
                    docId:this.docId
                },(response)=>{
                    let result = response.data;
                    this.repealAlelrt = false;
                    if(result.meta.success){
                        this.getDocumentInfoVo();
                        this.signtorList();
                    }else{
                        this.alertCommonTip("撤销文档失败");    
                    }
                })
            },
            appraisal(){   //签吧鉴定服务
                // window.location.href= this.linkHref + "doc/document/toEvidenceReport?docId="+this.docId
                this.$router.push({
                    name:"report",
                    query: { 
                        docId: this.docId
                    }
                });
            },
            init(){
                $(document).on('click',()=>{
                    this.dirStatus= false;
                    this.appraisalStatus = false;
                })
            },
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-文档详情";
            }else{
                document.title="签吧-文档详情";
            }
            this.$store.dispatch("changeTitle","我的文档 > 文档列表");
            this.getDocumentInfoVo();
            this.signtorList();
            this.init();
        }
    }
</script>
<style lang="scss" scoped>
$border:#dedede;
$pink:#ff503f;
.docDetail{
    .docDetail_box{
        h3{
            font-weight: normal;
            span{
                display: inline-block;
                padding: 0 5px;
                line-height: 25px;
                height: 25px;
                color: #fff;
                text-indent: 0;
                margin-left: 10px;
                border-radius: 5px;
                -ms-border-radius:5px;
                &.signing{
                    background:$pink;;
                }
                &.finished{
                    background:#5FB336;
                }
                &.overdue{
                    background: #C1C1C2;
                }
                &.refuse{
                    background:#C1C1C2;
                }
            }
        }
        .memo{
            height: 50px;
            line-height: 50px;
            text-indent: 25px;
            color: #4b4b4b;
        }
        .btn-box{
            height: 80px;
            line-height: 80px;
            background:#f6f8fc;
            position: relative;
            p{
                text-indent: 25px;
            }
            ul{
                position: absolute;
                right: 0;
                top: 0;
                li{
                    float: left;
                    display: block;
                    position: relative;
                    margin-right:25px;
                    a{
                        padding: 8px 30px;
                        border: 1px $border solid;
                        border-radius: 4px;
                        -ms-border-radius:4px;
                        background:#fff;
                        color: #4a4a4a;
                        font-size: 16px;
                        position: relative;
                        i{  width: 0;
                            height: 0;
                            border: 5px solid;
                            position: absolute;
                            top: 18px;
                            right: 15px;
                            display: block;
                            border-color: rgba(0,0,0,0.8) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);
    }      
                    }
                    .selectBox,.selectBox2{
                        width: 160px;
                        position: absolute;
                        top: 70px;
                        left: 50%;
                        transform: translateX(-50%);
                        -ms-transform: translateX(-50%);
                        box-shadow: 0 0 10px #ccc;
                        background: #fff;
                        border-radius: 5px;
                        -ms-border-radius:5px;
                        ul{
                            position: static;
                            width: 100%;
                            li{
                                text-align: center;
                                width: 100%;
                                height: 50px;
                                line-height: 50px;
                                cursor: pointer;
                                &:hover{
                                    background:#f6f7fc;
                                }
                            }
                        }
                    }
                    .selectBox2{
                        max-height: 300px;
                        
                        ul{
                            li{
                                padding: 0 20%;
                                width: 60%;
                                text-align: left;
                            }
                        }
                    }
                }
            }
        }        
    }
    .signInfo{
        background: #fff;
        h3{
            span{
                display: inline-block;
                border-radius: 4px;
                background:#f2f2f2;
                height: 25px;
                line-height: 25px;
                margin-left: 20px;
                text-indent: 0;
                padding: 0 8px;
                color:#919191;
                font-size:12px;
            }
        }
        .sign-list{
            // height: 260px;
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
                            width: 10%;
                            text-align: right;
                            position: relative;
                            left: 5%;
                            font-size: 18px;
                            color:#000;
                            overflow: hidden;
                            &.gray{
                                color: #ccc;
                            }
                        }
                        &:nth-child(2){
                            position: relative;
                            width: 20%;        
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
                            overflow: hidden;
                            b{
                                margin-right: 5px;
                            }
                        }
                        &:nth-child(4){
                            width: 25%;
                            color: #4a4a4a;
                            overflow: hidden;
                        }
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
}
</style>

<template>
    <section>
        <div class="right_col">
            <div class="navBtnBox" v-if="info && info.status != 1">                 <!-- -->
                <a href="javascript:;" class="fail" @click="status = -1 ; verifyCheck()">审核失败</a>
                <a href="javascript:;"  @click="status =1 ; verifyCheck()">审核通过</a>
            </div>
            <div class="navBtnBox" v-else>                
                <span>已审核通过</span>
            </div>
            <div class="detail">
               <ul v-if="info">
                    <li>
                        <span>管理人是否是法人：</span>
                        <span>{{info.type == 1 ? '是':'否'}}</span>
                    </li>
                    <li>
                       <span>企业名称：</span>
                       <span>{{info.companyName}}</span>
                    </li>
                    <li>
                       <span>营业执照注册号：</span>
                       <span>{{info.blRegNum}}</span>
                    </li>
                    <li>
                       <span>营业执照图片：</span>
                       <span>
                           <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.blImg">
                       </span>
                    </li>
                    <li>
                       <span>对公银行账号：</span>
                       <span>{{info.bankNo}}</span>
                    </li>
                    <li>
                       <span>对公银行名称：</span>
                       <span>{{info.bankName}}</span>
                    </li>
                    <li>
                        <span>对公开户支行：</span>
                        <span>{{info.subBankName}}</span>
                    </li>                    
                    <li>
                        <span>法定代表人姓名：</span>
                        <span>{{info.legalName}}</span>
                    </li>
                    <li>
                        <span>法定代表人身份证号：</span>
                        <span>{{info.legalIdcard}}</span>
                    </li>
                    <li>
                        <span>法定代表人手机号：</span>
                        <span>{{info.legalPhone}}</span>
                    </li>
                    <li v-if="info.type == 1">
                        <span>法定代表人手持身份证照：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.legalHandIdcardImg">
                        </span>
                    </li>
                    <li v-if="info.type == 0">
                        <span>法定代表人身份证正面：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.legalIdcardFrontImg">
                        </span>
                    </li>
                    <li v-if="info.type == 0">
                        <span>法定代表人身份证反面：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.legalIdcardBackImg">
                        </span>
                    </li>
                    <li>
                        <span>账号管理人姓名：</span>
                        <span>{{info.adminName}}</span>
                    </li>
                    <li>
                        <span>账号管理人身份证号：</span>
                        <span>{{info.adminIdcard}}</span>
                    </li>
                    <li v-if="info.type == 0">
                        <span>账号管理人身份证正面：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.adminIdcardFrontImg">
                        </span>
                    </li>
                    <li v-if="info.type == 0">
                        <span>账号管理人身份证反面：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.adminIdcardBackImg">
                        </span>
                    </li>
                    <li>
                        <span>账号管理人手机号：</span>
                        <span>{{info.adminPhone}}</span>
                    </li>
                    <li v-if="info.applyTab">
                        <span>企业认证申请表：</span>
                        <span>
                            <img :src="apiPath+this.URL['downloadAuthImg']+'?filePath='+info.applyTab">
                        </span>
                    </li>
                </ul>
            </div> 
        </div>
        <Loading v-show="loadingState"></Loading>         
    </section>
</template>
<script>
    export default{
        data(){
            return{
                loadingState:false,
                verifyId:'',
                info:null,
                blImg:'', //营业执照
                legalHandIdcardImg:'',     //法人手持身份证照
                legalIdcardFrontImg:"",    //法人身份证正面照
                legalIdcardBackImg:"",     //法人身份证反面照
                adminIdcardBackImg:"",     //管理人身份证正面照
                adminIdcardFrontImg:"",    //管理人身份证反面照
                checkStatus:'',            //审核状态
                status:1,

            }
        },
        methods:{
            verifyView(verifyId){
                this.loadingState = true;
                this.httpGet(this.URL['verifyView'],{
                    verifyId
                },({data})=>{
                    this.loadingState = false;
                    if(data.meta.success){
                        this.info = data.data;
                    }else{
                        this.modelCommonTip(data.meta.message||"失败")
                    }
                })
            },
            //审核接口
            verifyCheck(){
                this.loadingState = true;
                this.httpGet(this.URL['verifyCheck'],{
                    verifyId:this.verifyId,
                    status:this.status,
                    memo:'实名认证失败',
                },(res)=>{
                    let {meta,data}= res.data;
                    this.loadingState = false;
                    if(meta.success){
                        this.modelCommonTip("审核成功");
                        this.verifyView(this.verifyId);
                    }else{
                        this.modelCommonTip(meta.message)
                    }
                })
            }
        },
        mounted(){
            let verifyId = this.$route.query.verifyId || '';
            this.verifyId = verifyId;
            this.$store.dispatch('changeTitle','企业管理>实名认证审核');  
            this.verifyView(verifyId)
        }
    }
</script>
<style scoped lang="scss">
    .navBtnBox{
        position: fixed;
        width: 400px;
        right: 0;
        top: 0;
        z-index: 100;
        justify-content:flex-end;
        padding-right: 30px;
        display:flex;
        align-items:center;
        height:49px;
        a{
            height: 35px;
            line-height: 35px;
            margin-left: 20px;
            border-radius:50px;
            padding: 0 20px;
            background: #ff503f;
            cursor: pointer;
            color: #fff;
            &.fail{
                background: #ccc;
            }
        }
        span{
            color: #ff503f;
            font-weight: bold;
        }
    }
    .detail{
        background: #fff;
        padding: 20px;
        li{
            display: flex;
            justify-content:flex-start;
            // align-items:center;
            line-height: 40px;
            &.btnBox{
                margin-top: 50px;
                justify-content:center;
            }
            span{
                &:nth-child(1){
                    flex-basis:200px;
                    padding-right: 20px;
                    text-align: right;

                }
                img{
                    max-width: 80%
                }
            }
        }
        
    }
</style>
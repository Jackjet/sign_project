<template>
    <div class="report">
        <div class="right_col">
            <div class="imgBox">
                <img :src="loadingImg" alt="" v-show="loadingList.length == 0">
                <img v-show="loadingList.length > 0" v-for="(item,index) in loadingList" :key="index" :src="item" alt="">
            </div>
            <div class="bottom">
                <div>
                    <a href="javascript:history.back();" >返回</a>
                    <a href="javascript:;" @click="downloadDocEvidence" >下载</a>
                </div>
            </div>
        </div>
        <!--公共弹框-->
        <alertModel :title="'温馨提示'" :context="showAlertData.context"   :showState="showAlertData.showAlert" :autoClose="showAlertData.autoClose" v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    import loadingImg from '@/assets/images/ui2.0/loading.gif';
    export default{
        data(){
            return {
               loadingImg:loadingImg, 
               loadingList:[],
               docId:null,
               showAlertData : {   //公共弹框参数
                    showAlert:false,
                    context:'',
                    autoClose:false,
                },
            }
        },
        methods:{
            getReport(){
                this.httpGet(this.URL.report,{
                    docId:this.docId
                },(response)=>{
                    let result = response.data;
                    if(result < 1){
                        this.alertCommonTip("鉴定报告未生成");
                        return false;
                    }else{
                        let num = response.data;
                        for(let i = 0 ; i < num ; i++){
                            this.loadingList.push(this.apiPath+this.URL.getEvidenceReportImgByPage+'?pageNum='+i+'&docId='+this.docId)
                        }
                        // console.log(num)
                    }
                    // this.loadingImg = this.linkHref+'doc/report/getEvidenceReportImgByPage?pageNum=0&docId='+this.docId
                })  
            },
            downloadDocEvidence(){
                window.location.href = this.linkHref+this.URL.downloadDocEvidence+'?docId='+this.docId
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-签吧鉴定报告"
                
            }else{
                document.title="签吧-鉴定报告"
            }
            this.$store.dispatch("changeTitle","鉴定报告");
            this.docId = this.$router.history.current.query.docId;
            this.getReport();
        }
    }
</script>

<template>
    <div class="draft">
        <div class="right_col">
            <TableList
                :tableTitle="'草稿箱'"
                :tableClass="'table-four'"
                :tableLoading="draftData.tableLoading"
                :total="draftData.total"
                :currentpage="draftData.currentpage"
                :display="draftData.display"
                @pagechange="pageChangeHandel"
            >
                <ul slot="panel-content">
                    <li class="title">
                        <span>名称</span>
                        <span>创建时间</span>
                        <span>签署人</span>
                        <span>操作</span>
                    </li>
                    <li v-for="(item,index) in draftData.draftList" :key="index" @click.stop="lookFile(item.docId)">
                        <span :title="item.docName?item.docName:''">{{item.docName?item.docName:''}}</span>
                        <span>{{item.createTime?item.createTime:''}}</span>
                        <span :title="item.signators?item.signators:''">{{item.signators?item.signators:''}}</span>
                        <span><a href="javascript:;" @click.stop="lookFile(item.docId)">查看</a><a href="javascript:;" @click.stop="deleteHandle(item.docId)">删除</a></span>
                    </li>
                </ul>
            </TableList>
        </div>
        <!--确认删除草稿箱-->
        <alertModel :title="'确认删除'" :context="'确认删除此条数据？'" :showState="showDelAlert" :type="2"  v-show="showDelAlert"  @cancelHandle="showDelAlert = false" @sureHandle="sureDelHandle()">
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context"  :showState="showAlertData.showAlert" :autoClose="showAlertData.autoClose" v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
    </div>
</template>
<script>
    
    export default{
        name:"draft",
        data(){
            return{
                draftData:{   //草稿箱列表数据
                    draftList:[],   //草稿箱列表数组
                    tableLoading:false,     //列表加载状态
                    total:0,              //翻页总数
                    currentpage:1,         //table当前页数
                    display:10,            //table每页条数
                },
                showAlertData:{        //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                },
                showDelAlert:false,    //确认删除草稿箱数据状态
                delDocId:null
            }
        },
        methods:{
            searchDraft(){  //草稿箱列表数据
                this.draftData.tableLoading = true;
                this.httpGet(this.URL.searchDraft,{
                    page:this.draftData.currentpage,
                    pageSize:this.draftData.display
                },(response)=>{
                     this.draftData.tableLoading = false;
                    var result = response.data;
                    if(result.meta.success){
                        this.draftData.draftList = result.data.list;
                        this.draftData.total = result.data.totalCount;
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })

            },
            lookFile(docId){    //查看文件
                //window.location.href=this.linkHref+"doc/document/toFillin?docId="+docId;
                this.$router.push({
                    name:"toFillin",
                    query: { 
                        docId:docId
                    }
                });
            },
            deleteHandle(docId){    //点击删除
                this.showDelAlert = true;
                this.delDocId = docId;
            },
            sureDelHandle(){  //删除文件
                $.ajax({
                    type : "POST",
                    async : false,// 同步
                    url : this.apiPath + this.URL.deleteDraft,
                    data : {"docId":this.delDocId},
                    dataType : "text",
                    cache: false,
                    success : (result)=>{
                        if(result != "success"){
                            this.alertCommonTip("删除草稿失败");                            
                        }else{
                            this.showDelAlert = false;
                            this.searchDraft();
                        }
                    }
                });
                /*this.httpPost(this.URL.deleteDraft,{
                    "docId":this.delDocId
                },(response)=>{
                    console.log(response)
                })*/
            },
            pageChangeHandel(val){
                this.draftData.currentpage = val;
                this.searchDraft();
            }
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-草稿箱";
            }else{
                document.title="签吧-草稿箱";
            }
            this.searchDraft();
            
            this.$store.dispatch("changeTitle","我的文档 > 草稿箱")
        }
    }
</script>
<style lang="scss" scoped>
</style>

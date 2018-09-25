<template>
    <section>
        <div class="right_col">
            <div class="tabNav">
                <span :class="[filterData.status == '' ? 'active':'']" @click="authCompayVerify()">全部</span>
                <span :class="[filterData.status == '1' ? 'active':'']" @click="authCompayVerify('1')">审核通过</span>
                <span :class="[filterData.status == '-1' ? 'active':'']" @click="authCompayVerify('-1')">审核失败</span>
                <span :class="[filterData.status == '0' ? 'active':'']" @click="authCompayVerify('0')">未审核</span>
            </div>
           <TableList 
           tableTitle="审核列表"
           tableClass="table-eight"
           :tableLoading="tableLoading" 
            :total="pageTotal"
            :currentpage="pageIndex"
            :display="pageLength"
            @pagechange="pageChangeHandel"
           >
               <ul slot="panel-content">
                   <li class="title">
                        <span>企业名称</span>
                        <span>营业执照注册号</span>
                        <!-- <span>对公银行账号：</span>
                        <span>对公银行名称：</span>
                        <span>对公银行开户支行：</span> -->
                        <span>法人姓名</span>
                        <span>法人身份证号</span>
                        <span>账号管理人姓名</span>
                        <span>账号管理人身份证号</span>
                        <!-- <span>账号管理人手机号</span> -->
                        <span>状态</span>
                        <span>操作</span>
                    </li>
                    <li class="li-class" @click="$router.push({name:'examineDetail',query:{'verifyId':item.verifyId}})" v-for="(item,index) in list">
                        <span>{{item.companyName}}</span>
                        <span>{{item.legalIdcard}}</span>
                        <!-- <span>对公银行账号：</span>
                        <span>对公银行名称：</span>
                        <span>对公银行开户支行：</span> -->
                        <span>{{item.legalName}}</span>
                        <span>{{item.legalIdcard}}</span>
                        <span>{{item.adminName}}</span>
                        <span>{{item.adminIdcard}}</span>
                        <!-- <span>{{item.adminPhone}}</span> -->
                        <span>{{item.status == 0 ? '待审核' : item.status == 1 ? '审核通过' : '审核不通过'}}</span>
                        <span>
                            <a href="javascript:;" v-show="item.status != 1">审核</a>
                            <a href="javascript:;" v-show="item.status == 1">查看</a>
                        </span>
                    </li>
               </ul>
            </TableList> 

        </div>
    </section>
</template>
<script>
    export default{
        data(){
            return{
                tableLoading:false,
                pageTotal:null,
                pageIndex:1,
                pageLength:10,
                list:[],
                filterData:{
                    status:''
                }

            }
        },
        methods:{
            authCompayVerify(num = ''){
                this.filterData.status = num;
                const { pageIndex, pageLength,filterData} = this;
                [this.tableLoading] = [true];
                this.httpGet(this.URL['authCompayVerify'],{
                    filter:JSON.stringify(filterData),
                    pageIndex,
                    pageLength
                },({data})=>{
                    this.tableLoading = false;
                    if(data.meta.success){
                        let{pageCount,list} = data.data;
                        this.pageTotal = pageCount;
                        this.list = list;
                    }
                })
            },
            pageChangeHandel(val){

            }
        },
        mounted(){
            this.$store.dispatch('changeTitle','企业管理>实名认证审核');  
            this.authCompayVerify();
        }
    }
</script>
<style scoped lang="scss">
    .tabNav{
        display: flex;
        padding-bottom: 20px;
        span{
            padding: 0 20px;
            display:inline-block;
            cursor:pointer;
            line-height: 30px;
            background: #f6f8fc;
            border-radius: 50px;
            margin-right: 20px;
            &.active{
                background: #ff503f;
                color: #fff;
            }
        }
    }
</style>
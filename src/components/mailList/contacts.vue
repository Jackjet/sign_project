<template>
  <div class="contacts-page">
      <div class="right_col">
            <div class="search-com">
                <div class="search">
                    <label>搜索联系人</label>
                    <input type="text" placeholder="关键字：姓名、手机号码" v-model.trim="searchTitle" @keyup.enter="searchContacts">
                    <span class="search-btn" @click="searchContacts">搜索</span>
                </div>
            </div>
            <TableList
                :tableClass="'table-five'"
                :tableLoading="contactsList.tableLoading"
                :total="contactsList.pageTotal"
                :currentpage="contactsList.pageIndex"
                :display="contactsList.pageLength"
                @pagechange="pageChangeHandel"
            >   
                <div slot="panel-header" class="contacts_title">
                    <h3 class="title">
                        联系人
                        <span class="add-contacts" @click="addStatus=!addStatus"><b class="icon-add-user"></b>添加联系人</span>                    
                    </h3>
                    <div class="addContactsTable" v-show="addStatus">
                        <ul id="addContact">
                            <li><label>姓名：</label><input type="text" name="username" placeholder="请输入姓名" v-model.trim="addContactsData.name"></li>
                            <li><label>手机：</label><input type="text" name="phone" placeholder="请输入手机号码" v-model.trim.number="addContactsData.phone"></li>
                            <li><label>备注：</label><input type="text" placeholder="备注" v-model.trim="addContactsData.memo" @keyup.enter="addContacts"></li>
                            <li style="width:130px;"><div><a href="javascript:;" @click="addContacts">添加</a><a href="javascript:;" @click="cancelAdd">取消</a></div></li>
                        </ul>
                    </div>
                </div>
                <ul slot="panel-content">
                    <li class="title">
                        <span>姓名</span>
                        <span>手机号码</span>
                        <span>是否激活</span>
                        <span>备注</span>
                        <span>操作</span>
                    </li>
                    <li v-for="(item,index) in contactsList.tableList" :key="index">
                        <span>{{item.name?item.name:''}}<b v-if="item.authentication == 1">已认证</b></span>
                        <span>{{item.phone?item.phone:''}}</span>
                        <span>{{ item.activation ? '已激活':"未激活" }}</span>
                        <span>{{item.memo?item.memo:''}}</span>
                        <span><a href="javascript:;" @click="editContact(item)">编辑</a><a href="javascript:;" @click="delContactHandle(item)">删除</a></span>
                    </li>
                </ul>
            </TableList>
        </div>
        <!-- 确认删除弹框  -->
        <alertModel :title="'确认删除？'" :context="'确认删除此联系人？'" :type="2"    v-show="showDelAlert"  @cancelHandle="showDelAlert = false" @sureHandle="sureDelContact"></alertModel>
        <!-- 编辑联系人弹框 -->
        <alertModel :title="'编辑联系人'"  :type="2"    v-show="showEdiAlert"  @cancelHandle="showEdiAlert = false" @sureHandle="sureEdiContact">
            <div slot="alert-content" class="edit-content" id="editContact">
                <p v-if="editContactsData.activation"><label for="">姓名：</label><input name="username" v-model.trim="editContactsData.name" type="text" readonly disabled ></p>
                <p v-if="!editContactsData.activation"><label for="">姓名：</label><input name="username" v-model.trim="editContactsData.name" type="text" ></p>
                <p><label for="">手机：</label><input name="phone" v-model.trim="editContactsData.phone" type="text" readonly disabled></p>
                <p><label for="">备注：</label><input v-model.trim="editContactsData.memo" type="text"></p>
            </div>
        </alertModel>
        <!--公共弹框-->
        <alertModel :title="showAlertData.title" :context="showAlertData.context" :autoClose="showAlertData.autoClose" :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
        </alertModel>
        </div>
</template>
<script>
    // var contactsData = [{
    //     id:'adasdfasdf',
    //     name:"张数安",
    //     authentication:1,  //认证
    //     phone:"17098926589",
    //     activation:true,  
    //     remarks:"aaa"
    // },
    // {   
    //     id:'adasdfasdf',
    //     name:"张时代",
    //     authentication:0,
    //     phone:"17098926589",
    //     activation:false,
    //     remarks:"aaa"
    // }];
    export default{
        data(){
            return{
                searchTitle:'',           //搜索title
                TemsearchTitle:null,      //搜索联系人临时变量
                addStatus:false,          //添加联系人状态
                addContactsData:{         //添加联系人数据
                    accNo:'',
                    name:'',
                    phone:'',
                    memo:''
                },
                showEdiAlert:false,       //编辑联系人状态
                editContactsData:{        //编辑联系人数据
                    editId:null,          //编辑id
                    accNo:'',
                    name:'',
                    phone:'',
                    memo:'',
                    activation:false,    //是否激活
                },
                contactsList:{            //联系人列表数据
                    tableLoading:false,
                    tableList:[],
                    title:'',
                    pageTotal:null,
                    pageIndex:1,
                    pageLength:10,
                },
                showAlertData:{            //公共弹框参数
                    showAlert:false,
                    title:"警告",
                    context:"",
                    autoClose:false
                },
                showDelAlert:false,        //删除联系人弹框状态
                delContactId:null,         //删除id
                
            }
        },
        methods:{
            searchAccountContactList(){   //获取联系人列表
                this.contactsList.tableLoading = true;
                this.httpGet(this.URL.searchAccountContactList,{
                    searchKeyWord:this.searchTitle,
                    pageIndex:this.contactsList.pageIndex,
                    pageLength:this.contactsList.pageLength 
                },(response)=>{
                    var result = response.data;               
                    if(result.meta.success){
                        this.contactsList.tableLoading = false;
                        this.contactsList.tableList = result.data.list;
                        this.contactsList.pageTotal = result.data.totalCount;
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            addContacts(){      //确定添加联系人
                if(!this.validatePlugin($('#addContact'))){return false;}
                this.httpGet(this.URL.addAccountContact,{
                    accNo:this.addContactsData.accNo,
                    name:this.addContactsData.name,
                    phone:this.addContactsData.phone,
                    memo:this.addContactsData.memo
                },(response)=>{
                    //if(response)
                    var result = response.data;
                    if(result.meta.success){
                        /*this.showAlertData = {
                            title:'添加联系人',
                            context:'成功添加联系人',
                            showAlert:true
                        }*/
                        this.alertCommonTip('成功添加联系人');
                        this.searchAccountContactList();
                        this.cancelAdd();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            searchContacts(){   //搜索联系人
                /*if(this.searchTitle != this.TemsearchTitle){
                    this.searchAccountContactList();
                    this.TemsearchTitle = this.searchTitle;
                }*/
                this.contactsList.pageIndex = 1;
                this.Event2.$emit('tip2',1);
                this.searchAccountContactList();
            },
            cancelAdd(){        //取消添加联系人
                this.addStatus = false;
                this.addContactsData.name = this.addContactsData.phone = this.addContactsData.remarks = "";
            },
            delContactHandle(item){ //删除联系人
                this.showDelAlert = true;
                this.delContactId = item.contactId;
            },
            sureDelContact(){      //确认删除联系人
                this.httpGet(this.URL.delAccountContact,{
                    contactId:this.delContactId
                },(response)=>{
                    var result = response.data;
                    if(result.meta.success){
                        this.showDelAlert = false;
                        this.delContactId = null;
                        this.searchAccountContactList();
                    }else{
                        this.alertCommonTip(result.meta.message)
                    }
                })
            },
            editContact(item){
               this.showEdiAlert = true;
               this.editContactsData.editId = item.contactId;
               this.editContactsData = {
                    editId:"",
                    accNo:"",
                    name:"",
                    phone:"",
                    memo:"",
                    activation:false
                }                
               this.httpGet(this.URL.getAccountContact,{
                   contactId:item.contactId
               },(response)=>{
                   var result = response.data;
                   if(result.meta.success){
                    this.editContactsData = {
                        editId:item.contactId,
                        name:result.data.name,
                        accNo:result.data.accNo,
                        phone:result.data.phone,
                        memo:result.data.memo,
                        activation:item.activation
                    }
                    console.log(this.editContactsData)
                    
                   }else{
                       this.alertCommonTip(result.meta.message);
                   }
               })
            },
            sureEdiContact(){   //编辑联系人确定
                if(!this.validatePlugin($('#editContact'))){return false;}
                this.httpGet(this.URL.editAccountContact,{
                    contactId:this.editContactsData.editId,
                    accNo:this.editContactsData.accNo,
                    name:this.editContactsData.name,
                    phone:this.editContactsData.phone,
                    memo:this.editContactsData.memo
                },(response)=>{
                    //if(response)
                    var result = response.data;
                    if(result.meta.success){
                        this.showEdiAlert = false;
                        this.showAlertData = {
                            title:'编辑联系人',
                            context:'成功编辑联系人',
                            showAlert:true
                        }
                        this.searchAccountContactList();
                    }else{
                        this.alertCommonTip(result.meta.message);
                    }
                })
            },
            pageChangeHandel(val){
                this.contactsList.pageIndex = val;
                this.searchAccountContactList();
            }      
        },
        mounted(){
            if(this.cloudyState){
                document.title="云合同-联系人";
            }else{
                document.title="签吧-联系人";
            }
            this.searchAccountContactList();  
            this.$store.dispatch("changeTitle",'联系人');
        }
    }
</script>
<style lang="scss" scoped>
$border:#dedede;
.contacts-page{
    .contacts_title{
        .addContactsTable{
            ul{
                padding-left: 2.8%;
                li{
                    width: 28.3%;
                    float: left;
                    line-height: 30px;
                    padding: 12.5px 0;
                    position: relative;
                    &:nth-child(4){
                        width: 15%;
                    }
                    label{
                        width: 60px;
                        position: absolute;
                        left: 0;
                        top:12.5px;
                        height: 30px;
                        line-height: 30px;
                    }
                    input{
                        margin-left: 60px;
                        width: 60%;
                        border: 1px $border solid;
                        text-indent: 5px;
                        height: 30px;
                        line-height: 30px;
                        
                    }
                    a{
                        padding: 2px 5px;
                        border-radius: 4px;
                        -ms-border-radius:4px;
                        border: 1px $border solid;
                        color: #ccc;
                        margin-right: 15px;
                        &:nth-child(1){
                            color: #fff;
                            border: 1px #ff503f solid;
                            background: #ff503f;
                        }
                    }
                    &>div{
                        width: 120px;
                        margin: 0 auto;
                    }
                }
            }
        }
    }
    
    .table{        
        li{
            b{
                font-size: 12px !important;
                // transform: scale(0.5);
                -webkit-text-size-adjust:none;
                margin-left: 5px;
                padding: 0 2px;
                border: 1px #ff7363 solid;
                color: #ff7363;
                background: #ffd3cf;
                -ms-border-radius:2px;
                border-radius: 2px;                
            }
        }
    }

    .edit-content{
        p{
            padding: 10px 0;
            label{
                height: 30px;
                line-height: 30px;
                padding-right: 10px;
            }
            input{
                border: 1px $border solid;
                border-radius: 2px;
                -ms-border-radius:2px;
                text-indent: 5px;
                height: 30px;
                line-height: 30px;
                width: 200px;
            }
        }
    }

}
</style>


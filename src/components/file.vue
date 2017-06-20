<template>
  <div class="file statistics_count" v-cloak>
    <div class="right_col">
		<div class="file-left">
			<div class="file-edit">
				<h3>归档文件夹</h3>
				<div class="file-icon-box">
					<!-- <span @click="editHandle" :class="[editorIndex >= 0 ? 'active' : '','icon-editor']"></span> -->
					<span class="icon-add-folders-kong" @click.stop="addDir = true" :class="[addDir ? 'active' : '']" v-if="userState != 2">
                        <div class="add-folder-box" v-show="addDir">
                           <i></i>
                           <input type="text" placeholder="输入文件夹名称" name="" @click="inputInit(addFolderName)" v-model="addFolderName" @keyup.enter="sureAddHandle()">
                           <div class="btn-box clf">
                               <a href="javascript:;" class="btn-default" @click.stop="cancelAddHandle()" >取消</a>
                               <a href="javascript:;" class="btn-default btn-pink" @click.stop="sureAddHandle()">确认</a>
                           </div>
                          
                        </div>               
                    </span>
					<!-- <span class="icon-del" @click="delFolderHandle()" ></span> -->
				</div>				
			</div>
			<div class="search">
				<input type="text" placeholder="关键字：文件夹名称" v-model="seFolderName" @keyup.enter="searchHandle(seFolderName)">
				<span class="icon-search"></span>
			</div>
			<div class="contract-list mCustomScrollbar">
				<ul>
					<li v-show="dirList != 0"  @click="selectLi(index)" v-for="(item,index) in dirList"  :class="[index == selectIndex ? 'active' : '',index == editorIndex ? 'editActive':'']">
                        <i class="icon-del" @click.stop="delFolderHandle(item,index)" v-if="userState != 2"></i>
                        <i class="icon-editor" @click.stop="editHandle(index)" v-if="userState != 2"></i>
                        <span class="icon-folder"></span>
                        <p v-show="index != editorIndex"> <b :title="item.dirName" class="shengl" >{{item.dirName}}</b><span>({{item.num}})</span></p>
                        <input @keyup.enter="resetFolderName(item.dirName,item.dirId,index)" v-show="index == editorIndex" type="text" name=""   v-model="item.dirName"  @blur="resetFolderName(item.dirName,item.dirId,index)"/>
                        
                    </li>
                    <li v-if="dirList.length == 0">
                        <p class="no-message" v-text="'暂无数据！'"></p>
                    </li>
				</ul>
			</div>
		</div>
		<div class="file-right">
			<div class="panel-box panel-white">
			  <h3>{{selectTitle}}<a href="javascript:;" @click="addFileHandle()" v-if="userState != 1"><i class=" icon-send-person" ></i>添加归档</a></h3>
			  <div class="search clf">
				  <div class="search-box clf">
					<div class="row clf">
					  <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12">归档时间</div>
					  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<span class="input"><calendar @changeDate="changeStartDate" :val="'1'"></calendar></span>
						<span class="txt">至</span>
						<span class="input"><calendar @changeDate="changeEndDate"></calendar></span>
					  </div>
					  <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"><input type="text" name="" placeholder="关键字：企业名称" v-model="getReParms.searchKeyword"  @keyup.enter="searchFileHandle(getReParms.searchKeyword)"></div>
					  <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn-box"><a href="javascript:;" class="search-btn" @click="searchFileHandle(getReParms.searchKeyword)">查询</a><a href="javascript:;" @click="deleteHandle()">清空</a></div>
					</div>
				  </div>
			  </div>
		  </div>
          <div class="panel-box panel-white" style="min-height: 662px;" >
            <div class="table" :class="[userState == 1 ? 'table-five' : '']" >
              <li class="title">
                <span>名称</span>
                <span>签署方</span>
                <span>发送时间</span>
                <span>完成时间</span>
                <span>状态</span>
                <span v-show="userState != 1">操作</span>                
              </li>
              <li  v-show="againFileList.length > 0" class="li-class clf" v-for="(item,index) in againFileList">
                <span :title="item.docName">{{item.docName}}<i class="line"></i></span>
                <span :title="item.signators">{{item.signators}}</span>
                <span :title="item.sendTime | filterdata">{{item.sendTime | filterdata}}</span>
                <span :title="item.efectTime | filterdata">{{item.efectTime | filterdata}}</span>
                <span :title="item.cycle">{{item.cycle == 300 ? '已完成':'&nbsp;'}}</span>
                <span  v-show="userState != 1"><a @click="againFile($event,index)">重新归档</a><a href="javascript:;" @click="cancelFile(item)">撤销归档</a></span>     
              </li>
              <li class="no-message" v-show="loadingState">加载中，请稍后</li>
              <li class="no-message" v-show="againFileList.length == 0" v-text="'暂无数据'"></li>
              <li class="pr">
                <b>共{{pageData.total}}条记录/当前为第{{getReParms.pageIndex}}页</b>
                <div class="page-box" >
                   <pagination :total="pageData.total" :currentpage="getReParms.pageIndex" :display="getReParms.pageLength"  @pagechange="pageChangeHandel"></pagination>
                </div>
              </li>
              <div class="againAlert" id="againAlert" v-show="againFileState">
                  <i></i>
                  <div class="searchFile">
                        <span class="icon-search"></span>
                      <input type="text" name="" :value="againSeName" v-model="againSeName" @click="inputInit(againSeName)" @keydown="keyUpDown($event)">
                  </div>
                  <ul class="fileList">

                      <li v-for="(val,index) in againFolderList" :class="[againNowIndex == index ? 'active' : '']" @click="selectFile(index)">
                        <b  :class="[againNowIndex == index ? 'icon-check-default' : 'icon-circle']"></b>{{val.dirName}}
                      </li>
                      <li class="no-message" v-show="againFolderList.length == 0" v-text="'暂无数据'"></li>
                  </ul>
                  <div class="btn-box">
                      <a href="javascript:;" @click="cancelAgainFolder()">取消</a>
                      <a href="javascript:;" @click="sureAgainFolder()">确定</a>
                  </div>
              </div>
            </div>
          </div>
		</div>
    </div>
    <div class="addFileAlert" v-show="addFile.addFileState">
        <div class="cover"></div>
        <div class="addFileContent">
            <div class="alert-header">
                <h3>添加归档文件<i class="icon-close" @click="cancelBatch()"></i></h3>
            </div>
            <div class="alert-body">
                <div class="search">
                    <span class="icon-search"></span>
                    <input type="text" v-model="addFile.params.condition" name="" :value="addFile.params.condition" @click="inputInit(addFile.params.condition)"  @keydown.enter="searchFileList(addFile.params.condition)">
                </div>
                <div class="table-list">
                    <ul>
                        <!-- icon-check2-default -->
                        <li class="clf">
                            <span><i class="icon-check"></i>名称</span>
                            <span>签署方</span>
                            <span>发起时间</span>
                        </li>
                        <li class="clf" v-for="(item,index) in addFile.fileList" @click="selectFileHandle(item)">
                            <span :title="item.docName"><i :class="[item.keepValue.checkItem ? 'icon-check2-default' : 'icon-square']"></i>{{item.docName}}</span>
                            <span :title="item.signators">{{item.signators}}</span>
                            <span :title="item.sendTime">{{item.sendTime | filterdata}}</span>
                        </li>
                        <li class="no-message" v-show="addFile.fileList.length == 0" v-text="'暂无数据'">
                        <!-- @pagechange="pageChangeHandel2" -->
                        <li>
                            <p>共{{addFile.total}}条记录</p>
                            <div class="page-box"><pagination :total="addFile.total" :currentpage="addFile.params.pageIndex" :display="addFile.params.pageLength"  @pagechange="pageHandelAlert"></pagination></div>
                        </li>
                    </ul>
                </div>
                <div class="selectList">
                    <h3>已选文件<span>(单击移除)</span><!-- <b>6/244</b> --></h3>
                    <div class="table-list select-list mCustomScrollbar">
                    <ul>
                        <li class="clf">
                            <span>名称</span>
                            <span>签署方</span>
                            <span>发起时间</span>
                        </li>
                        <li class="clf" @click="delFileHandle(item)" v-for="(item,val) in selectFileList">
                            <span :title="item.docName">{{item.docName}}</span>
                            <span :title="item.signators">{{item.signators}}</span>
                            <span :title="item.sendTime">{{item.sendTime | filterdata}}</span>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
            <div class="alert-footer">
                <a class="cancel-btn" @click="cancelBatch()">取消</a>
                <a class="sure-btn" @click="batchaddArchiveRecords()">确定</a>                 
            </div>
        </div>
    </div>
    
    <!--确认删除弹框-->
    <alertModel :title="showDelAlter.title" :context="showDelAlter.context" :type="showDelAlter.type"  :showState="showDelAlter.showAlert"  v-show="showDelAlter.showAlert"  @cancelHandle="showDelAlter.showAlert = false" @sureHandle="sureDelHandle()">
        <ul slot="alert-content">
            <div class="del-alter">
                <p>该文件夹将被删除，其中的文档将<span>被撤销归档</span></p>
                <p class="gray">如需重新归档，需到文档列表操作</p>
            </div>
        </ul>
    </alertModel>
    <!--确认撤销归档弹框-->
    <alertModel :title="showCancelAlert.title" :context="showCancelAlert.context" :type="showCancelAlert.type"  :showState="showCancelAlert.showAlert"  v-show="showCancelAlert.showAlert"  @cancelHandle="showCancelAlert.showAlert = false" @sureHandle="cancelArchiveRecord()">
        <ul slot="alert-content">
            <div class="del-alter">
                <p class="text-center">确定撤销归档？</p>
                <p class="gray text-center">如需重新归档，需到文档列表操作</p>
            </div>
        </ul>
    </alertModel>

    <!--管理员删除空文件夹-->
    <alertModel :title="showAdminAlert.title" :context="showAdminAlert.context" :type="showAdminAlert.type"  :showState="showAdminAlert.showAlert"  v-show="showAdminAlert.showAlert"  @cancelHandle="showAdminAlert.showAlert = false" @sureHandle="sureDelHandle()">
    </alertModel>
   
   <!--公共弹框-->
    <alertModel :title="showAlertData.title" :context="showAlertData.context" :type="showAlertData.type"  :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false" >
    </alertModel>
  </div>
</template>

<script>
import calendar from "./calendar.vue";

export default {
  name: 'file',
  components:{
	calendar
  },
  data () {
    return {
        pageData:{           //翻页配置
            total: 0,          //总条数 
        },
        dirList:[],   
        selectIndex:0, 
        editorIndex:-1,   
        deleteIndex:-1,        
        againNowIndex:-1,      //重新归档列表当前选中下标
        againNowIndexTem:-1,   //重新归档列表当前选中下标临时变量
	    //contractList:["a","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf"],
        showAlertData:{        //公共弹框参数
            showAlert:false,
            title:"警告",
            context:""
        },
        showDelAlter:{         //删除弹框
            showAlert:false,
            title:"删除归档文件夹",
            type:2
        },
        showCancelAlert:{
            showAlert:false,
            title:"撤销归档",
            type:2
        },
        showAdminAlert:{
            showAlert:false,
            title:"删除文件夹",
            type:2
        },
        addDir:false,           //添加弹框是否显示
        addFolderName:"输入文件夹名称",       //添加文件的文件夹名称
        seFolderName:"",        //搜索的文件夹名称
        seFolderNameTem:"",     //搜索的文件夹名称临时变量
        againFileState:false,   //重新归档状态
        againSeName:"关键字：文件夹名称",
        againSeNameCenter:"",
        againFileList:[],         //重新归档文件列表
        againFolderList:[],       //重新归档文件夹列表
        getReParms:{
            signStartDate:'',
            signEndDate:'',
            dirId:null,
            searchKeyword:"",
            pageIndex:1,
            pageLength:10
        },
        modifyParams:{   //重新归档文件接口
            recordId:"",
            dirId:"",
            docId:""
        },
        cancelParams:{   //删除归档文件接口参数
            dirId:"",
            docId:""
        },
        searchTitleTem:"",   //搜索临时变量
        timeSelect:false,
        loadingState:false,
        addFile:{            //添加归档
            addFileState:false,
            fileList:[],
            total:0,
            params:{
                condition:"关键字：合同名称",
                pageIndex:1,
                pageLength:5
            },
            searchTitleTem:"",   //搜索中间变量
            //selectFileList:[]

        },
        selectFileList:[],
        batchAdd:[],      //批量添加归档文件数据
        selectTitle:""

    }
  },
  computed:{
    userState(){
        return this.$store.state.userState
    },
    roleState(){
        return this.$store.state.roleState
    }
  },
  methods:{
    deleteHandle(){    //清空
         this.getReParms.searchKeyword = "";
         this.Event2.$emit('tip','change');
         this.getReParms.signStartDate = "";
         this.getReParms.signEndDate = "";
         this.searchFileHandle();
    },
    getdirListData(){       //获取文件夹数据
        var That = this;
        //console.log("dirName:"+That.seFolderName)
        this.httpGet('doc/archiveDir/searchArchiveDirList',{
            'dirName':That.seFolderName
        },function(response){
        var result = response.data;
        if(result.meta.success){
            That.dirList = result.data;     
            That.getReParms.dirId = That.dirList[That.selectIndex].dirId;
            That.selectTitle = That.dirList[That.selectIndex].dirName; 
            for(var i = 0 ; i < That.dirList.length; i++){  
                (function(i){
                    //console.log("dirId:"+That.dirList[i].dirId)
                    That.httpGet('doc/archiveRecord/getArchiveRecordCount',{
                        'dirId':That.dirList[i].dirId
                    },function(res){
                        var result2 = res.data;
                        if(result2.meta.success){
                            That.dirList[i].num = result2.data;
                        }
                    },function(){})
                })(i);
            }      
            That.againFileListData();          
        }else{
            That.alertCommonTip(result.meta.message)
        }
      },function(response){
        console.log(response);
      })
    },
    getdirListDataRight(){       //获取文件夹数据
        var That = this;
        var searchName = "";
        if(That.againSeName == "关键字：文件夹名称"){
            searchName = "";
        }else{
            searchName = That.againSeName;
        }
        this.httpGet('doc/archiveDir/searchArchiveDirList',{
            'dirName':searchName
        },function(response){
        var result = response.data;
        if(result.meta.success){
            That.againFolderList = result.data;     
            That.getReParms.dirId = That.dirList[That.selectIndex].dirId;            
        }else{
            That.alertCommonTip(result.meta.message)
        }
      },function(response){
        console.log(response);
      })
    },
    againFileListData(){      //获取归档文件列表
        //this.loadingState = true;
        //console.log("获取归档文件列表")
        var startTime = new Date(this.getReParms.signStartDate).getTime();
        var endTime = new Date(this.getReParms.signEndDate).getTime();
        if(startTime > endTime){
            this.showAlertData = {
                showAlert:true,
                context:"开始日期大于结束日期不合法"
            }
            return;
        }
        var That = this;
        this.httpGet('doc/archiveRecord/searchArchiveRecordList',{
            signStartDate:That.getReParms.signStartDate,
            signEndDate:That.getReParms.signEndDate,
            dirId:That.getReParms.dirId,
            searchKeyword:That.getReParms.searchKeyword,
            pageIndex:That.getReParms.pageIndex,
            pageLength:That.getReParms.pageLength
        },function(response){
        var result = response.data;
        if(result.meta.success){
           // That.loadingState = false;
            That.againFileList = result.data.list;   
            That.pageData.total = result.data.totalCount;  
            That.selectTitle = That.dirList[That.selectIndex].dirName;      
        }else{
            That.alertCommonTip(result.meta.message)
        }
      },function(response){
        console.log(response);
      })
    },
    modifyArchiveRecordDir(){       //修改归档文件接口
        var That = this;
        this.httpGet('doc/archiveRecord/modifyArchiveRecordDir',{
            recordId:That.modifyParams.recordId,
            dirId:That.modifyParams.dirId,
            docId:That.modifyParams.docId
        },function(response){
        var result = response.data;
        if(result.meta.success){
            That.showAlertData = {
                showAlert:true,
                context:"重新归档成功"
            }
            That.againSeName="关键字：文件夹名称";
            That.againSeNameCenter = "";
            That.againFileState = false;
            That.againNowIndexTem = That.againNowIndex = -1; 
            That.getdirListData();
        }else{
            That.alertCommonTip(result.meta.message)
        }
      },function(response){
        console.log(response);
      })
    },
    cancelArchiveRecord(){        //撤销文件归档列表
        var That = this;
        this.httpGet('doc/archiveRecord/cancelArchiveRecord',{
            dirId:That.cancelParams.dirId,
            docId:That.cancelParams.docId
        },function(response){
        var result = response.data;
        if(result.meta.success){
           // That.loadingState = false;
            That.showCancelAlert.showAlert = false;
            That.selectFileList = [];
            That.addFile.fileList = [];
            That.showAlertData = {
                showAlert:true,
                context:"文件撤销归档成功！"
            }    
            That.againFileListData();
            That.getdirListData();
        }else{
            That.alertCommonTip(result.meta.message)
        }
      },function(response){
        console.log(response);
      })
    },
    cancelBatch(){   //取消归档
        this.addFile.addFileState = false;
        this.selectFileList = [];
        this.addFile.fileList = [];
    },
    batchaddArchiveRecords(){  
        //批量添加归档文件
        var batchAddLength = this.selectFileList.length;
        if(batchAddLength == 0) return;

        if(this.dirList.length == 0) {
            this.showAlertData = {
                showAlert:true,
                context:"请选择一个需要归档的文件夹"
            }
            return;
        }

        var dirId = this.dirList[this.selectIndex].dirId;
        this.batchAdd = [];
        for(var i = 0; i<this.selectFileList.length;i++){
            this.batchAdd.push({
                "dirId":dirId,
                "docId":this.selectFileList[i].docId
            })
        }
        var That = this;        
        $.ajax({
            type: 'POST',
            async: false,// 同步
            url: That.apiPath+'doc/archiveRecord/addArchiveRecords',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(That.batchAdd),
            dataType: 'json',
            cache: false,
            success: function(response) {
                if(response.meta.success){
                    That.addFile.addFileState = false;
                    That.againFileListData();
                    That.getdirListData();
                    That.selectFileList = [];
                    That.showAlertData = {
                        showAlert:true,
                        context:"批量归档成功！"
                    }    
                }else{
                    That.alertCommonTip(response.meta.message);
                }
            }
        });
    },
    addFileHandle(){              //添加归档文件列表
        this.addFile.addFileState = true;
        var That = this;
        var searchTitle = "";
        if(this.addFile.params.condition == "关键字：合同名称"){
            searchTitle = "";
        }else{
            searchTitle = this.addFile.params.condition;
        }
        var srcUrl = null;
        if(this.roleState == null || this.roleState == 0){   //非主管
            srcUrl = 'doc/documentList/searchDocumentList';
        }
        if(this.roleState == 1){
            srcUrl = 'doc/documentList/searchStructDocumentList';   //主管
        }

        this.httpGet(srcUrl,{
            'condition':searchTitle,
            'signStatus':300,
            'pageIndex':That.addFile.params.pageIndex,
            'pageLength':That.addFile.params.pageLength
        },function(response){
        var result = response.data;
        if(result.meta.success){            
            That.addFile.fileList = result.data.list;     
            for(var i = 0 ; i< That.addFile.fileList.length; i++){
                That.addFile.fileList[i].keepValue.checkItem = false;
                for(var j = 0;j<That.selectFileList.length;j++){
                    if(That.selectFileList[j].docId == That.addFile.fileList[i].docId){
                        That.addFile.fileList[i].keepValue.checkItem = true;
                    }
                }
            }
            That.addFile.total = result.data.totalCount;     
        }else{
            That.alertCommonTip(result.meta.message)
        }
     },function(response){
        console.log(response);
     })
    },
    searchFileList(val){        //查询归档文件列表
        if(val  == this.addFile.searchTitleTem) return

        this.addFileHandle();
        this.addFile.searchTitleTem = val;
    },
    selectFileHandle(item2){      //添加归档文件
        var state2 = item2.keepValue.checkItem;
       if(state2){
            //this.removeArr(this.selectFileList,item2);
            for(var i = 0 ; i < this.selectFileList.length;i++){
                if(item2.docId == this.selectFileList[i].docId){
                    this.selectFileList.splice(i,1);
                }
            }
            item2.keepValue.checkItem = false;
        }else{
            this.selectFileList.unshift(item2);
            item2.keepValue.checkItem = true;
        } 
    },
    delFileHandle(item){   //取消归档文件
        item.selectItem = false;
        this.removeArr(this.selectFileList,item);
    },
    searchFileHandle(val){
        if(this.timeSelect){
            this.againFileListData();
            this.timeSelect = false;
        }else{
            if(this.searchTitleTem == val) return;
            this.againFileListData();
            this.searchTitleTem = val;
        }
    },
    cancelAddHandle(){          //取消新增文件夹
        this.addDir = false;
        this.addFolderName = "输入文件夹名称";
    },
    sureAddHandle(){            //确认新增文件夹
        this.addDir = false;
        var That = this;
        if(That.addFolderName == "") return;        
        this.httpGet("doc/archiveDir/addArchiveDir",{
            "dirName":That.addFolderName
        },function(response){
            var result = response.data;
            if(result.meta.success){
                That.addDir = false;
                That.addFolderName = "";
                That.getdirListData();
            }else{
                That.alertCommonTip(result.meta.message)
            }
        },function(response){
            console.log(response);
        })
    },
    selectLi(num){             //选中文件夹
        this.selectIndex = num;
        this.getReParms.dirId = this.dirList[this.selectIndex].dirId;
        this.getReParms.searchKeyword = "";
        this.againFileListData();
    },
    editHandle(index){            //编辑文件夹名称
        this.editorIndex = index;
    },
    resetFolderName(value,id,index){          //重设文件夹名称
       var That = this;      
       if(value == "") return;   
        this.httpGet("doc/archiveDir/modifyArchiveDir",{
            "dirId":id,
            "dirName":value
        },function(response){
            var result = response.data;
            if(result.meta.success){
                That.selectIndex = index;
                That.selectTitle = value;
                That.editorIndex = -1;
            }else{
                That.alertCommonTip(result.meta.message)
            }
        },function(response){
            console.log(response);
        })
    },
    delFolderHandle(item,index){
        var That = this;
        if(this.userState == 1){
            if(item.num > 0){
                That.showAlertData = {
                    showAlert:true,
                    title:"删除归档文件夹",
                    context:"该文件夹已有用户归档的文件，无法删除。如需删除文件夹，请联系用户重新归档或撤销归档。",
                    type:1  
                }
            }else{
                That.deleteIndex = index;
                That.showAdminAlert = {
                    showAlert:true,
                    title:"删除归档文件夹",
                    context:"  确定要删除该文件夹？",
                    type:2
                }
            }
        }else{
            this.deleteIndex = index;
            if(item.num > 0){
                this.showDelAlter = {
                    showAlert:true,
                    title:"删除归档文件夹",
                    type:2  
                }
            }else{
                this.showAdminAlert = {
                    showAlert:true,
                    title:"删除归档文件夹",
                    context:"  确定要删除该文件夹？",
                    type:2
                }
            }
            
        }
        
    },
    sureDelHandle(){             //确认删除文件夹列表
        this.showDelAlter.showAlert = false;
        this.showAdminAlert.showAlert = false;
        var That = this;
        this.httpGet("doc/archiveDir/deleteArchiveDir",{
            "dirId":That.dirList[That.deleteIndex].dirId,
        },function(response){
            var result = response.data;
            if(result.meta.success){
                That.deleteIndex = -1;
                That.againFileListData();
                That.getdirListData();
            }else{
                That.alertCommonTip(result.meta.message)
            }
        },function(response){
            console.log(response);
        })
    },
    searchHandle(val){        //搜索文件夹名称
        if(this.seFolderNameTem == val) return;
        this.getdirListData();
        this.seFolderNameTem = val;
        
    },
    againFile(event,index){         //重新归档弹框显示
        this.againFileState = !this.againFileState;
        var tagX = event.target.offsetLeft;
        var tagY = event.target.offsetTop;
        var objHtml = document.getElementById("againAlert");
        objHtml.style.left=tagX-382+'px';
        objHtml.style.top=tagY+40+'px';
        this.modifyParams.recordId = this.againFileList[index].recordId;
        this.modifyParams.docId = this.againFileList[index].docId;
    },
    cancelFile(item){   //撤销归档
        this.cancelParams.dirId = item.dirId;
        this.cancelParams.docId = item.docId;
        this.showCancelAlert = {
            showAlert:true,
            type:2
        }
        
    },
    inputInit(value){
        if(value == '关键字：文件夹名称'){
            this.againSeName = ""
        }
        if(value == '关键字：合同名称'){
            this.addFile.params.condition = "";
        }

        if(value == '输入文件夹名称'){
            this.addFolderName = "";
        }
    },
    selectFile(num){   //选中归档文件
        //console.log(num)
        this.againNowIndex = num;
    },
    keyUpDown(event){       //重新归档选择
        //console.log(event.keyCode || event.button)
        if(event.keyCode == 13 && this.againSeNameCenter != this.againSeName){
            this.againSeNameCenter = this.againSeName;
            this.againNowIndex = -1;
           // console.log("请求获取归档接口");
            this.getdirListDataRight()
            return false;
        }

        if((event.keyCode == 13) && this.againNowIndex != -1 && this.againSeNameCenter == this.againSeName){
           
            if(this.againNowIndexTem != this.againNowIndex){
                 
                 this.modifyParams.dirId = this.againFolderList[this.againNowIndex].dirId;
                 //console.log("提交重新归档接口");
                 this.modifyArchiveRecordDir();
            }
            
            return false;
        }

        if(event.keyCode == 38){            
            if(this.againNowIndex == -1){
                this.againNowIndex = this.againFolderList.length - 1;
            }else{
                this.againNowIndex--;
            }
            return false;
        }
        if(event.keyCode == 40){            
            if(this.againNowIndex == this.againFolderList.length - 1){
                this.againNowIndex = -1;
            }else{
                this.againNowIndex++;
            }
            return false;
        }
        
    },
    sureAgainFolder(){        //点击确认归档
        if(this.againNowIndex != -1){
            if(this.againNowIndexTem != this.againNowIndex){
                 this.modifyParams.dirId = this.againFolderList[this.againNowIndex].dirId;
                 //console.log("提交重新归档接口");
                 this.modifyArchiveRecordDir()
            }
        }
    },
    cancelAgainFolder(){
        this.againSeName="关键字：文件夹名称";
        this.againSeNameCenter = "";
        this.againFileState = false;
        this.againNowIndexTem = this.againNowIndex = -1;
    },
	pageChangeHandel(currentNum){  //侦听翻页函数
		//console.log("我被翻页了，页码是："+currentNum);
        this.getReParms.pageIndex = currentNum;
        this.againFileListData();
	},
    pageHandelAlert(currentNum){
        this.addFile.params.pageIndex = currentNum;
        this.addFileHandle();
    },
	changeStartDate(value){
      //console.log(new Date(value).getTime())
      /*var startTime = new Date(value).getTime();
      var endTime = new Date(this.getReParms.signEndDate).getTime();
      if(startTime > endTime){
        this.showAlertData = {
            showAlert:true,
            context:"开始日期大于结束日期不合法"
        }
      }else{
        this.getReParms.signStartDate=value;
        this.timeSelect = true;
      }*/
      this.getReParms.signStartDate=value;
      this.timeSelect = true;
      
    },
    changeEndDate(value){
       // console.log(new Date(value).getTime())
      /*var startTime = new Date(this.getReParms.signStartDate).getTime();
      var endTime = new Date(value).getTime();
      if(startTime > endTime){
        this.showAlertData = {
            showAlert:true,
            context:"开始日期大于结束日期不合法"
        }
      }else{
        this.getReParms.signEndDate=value;
        this.timeSelect = true;
      }*/
      this.getReParms.signEndDate=value;
      this.timeSelect = true;
    },
    getNowDate(){
        this.getReParms.signStartDate = this.getDataFn().formatwdate;
        this.getReParms.signEndDate = this.getDataFn().currentdate;
    }
  },
  mounted(){
    this.getdirListData();
    this.getdirListDataRight();
    this.getNowDate();
    this.$store.dispatch('changeTitle','我的文档>归档');          
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
 html,body{
    min-width: 1200px !important;
 }
</style>

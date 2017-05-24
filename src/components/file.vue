<template>
  <div class="file statistics_count" v-cloak>
    <div class="right_col">
		<div class="file-left">
			<div class="file-edit">
				<h3>归档文件夹{{addDir}}</h3>
				<div class="file-icon-box">
					<span @click="editHandle" :class="[editorIndex >= 0 ? 'active' : '','icon-editor']"></span>
					<span class="icon-add-folders-kong" @click.stop="addDir = true" :class="[addDir ? 'active' : '']">
                        <div class="add-folder-box" v-show="addDir">
                           <i></i>
                           <input type="text" placeholder="输入文件夹名称" name="" v-model="addFolderName" @keyup.enter="sureAddHandle()">
                           <div class="btn-box clf">
                               <a href="javascript:;" class="btn-default" @click.stop="cancelAddHandle()" >取消</a>
                               <a href="javascript:;" class="btn-default btn-pink" @click.stop="sureAddHandle()">确认</a>
                           </div>
                          
                        </div>               
                    </span>
					<span class="icon-del" @click="delFolderHandle()" ></span>
				</div>				
			</div>
			<div class="search">
				<input type="text" placeholder="关键字：文件夹名称" v-model="seFolderName" @keyup.enter="searchHandle(seFolderName)">
				<span class="icon-search"></span>
			</div>
			<div class="contract-list mCustomScrollbar">
				<ul>
					<li v-show="dirList != 0"  @click="selectLi(index)" v-for="(item,index) in dirList"  :class="[index == selectIndex ? 'active' : '',index == editorIndex ? 'editActive':'']">
                        <span class="icon-folder"></span>
                        <p v-show="index != editorIndex">{{item.dirName}}</p>
                        <input @keyup.enter="resetFolderName(item.dirName,item.dirId)" v-show="index == editorIndex" type="text" name=""   v-model="item.dirName" />
                    </li>
                    <li v-if="dirList.length == 0">
                        <p v-text="'暂无数据，赶快添加吧！'"></p>
                    </li>
				</ul>
			</div>
		</div>
		<div class="file-right">
			<div class="panel-box panel-white">
			  <h3>经销商合同</h3>
			  <div class="search clf">
				  <div class="search-box clf">
					<div class="row clf">
					  <div class="col-lg-1 col-md-1 col-sm-12 col-xs-12">签约时间</div>
					  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
						<span class="input"><calendar @changeDate="changeStartDate"></calendar></span>
						<span class="txt">至</span>
						<span class="input"><calendar @changeDate="changeEndDate"></calendar></span>
					  </div>
					  <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"><input type="text" name="" placeholder="关键字：企业名称" v-model="getReParms.searchKeyword"  @keyup.enter="searchFileHandle(getReParms.searchKeyword)"></div>
					  <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn-box"><a href="#" class="search-btn" @click="searchFileHandle(getReParms.searchKeyword)">查询</a><a href="#">清空</a></div>
					</div>
				  </div>
			  </div>
		  </div>
          <div class="panel-box panel-white">
            <div class="table">
              <li class="title">
                <span>名称</span>
                <span>签署方</span>
                <span>发送时间</span>
                <span>完成时间</span>
                <span>状态</span>
                <span>操作</span>                
              </li>
              <li  v-show="againFileList.length > 0" class="li-class clf" v-for="(item,index) in againFileList">
                <span>{{item.docName}}<i class="line"></i></span>
                <span>{{item.signators}}</span>
                <span>{{item.sendTime}}</span>
                <span>{{item.efectTime || '暂无数据'}}</span>
                <span>{{item.cycle}}</span>
                <span><a @click="againFile($event)">重新归档</a><a href="javascript:;">撤销归档</a></span>     
              </li>
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
                  <ul class="fileList mCustomScrollbar">

                      <li v-for="(val,index) in againFolderList" :class="[againNowIndex == index ? 'active' : '']" @click="selectFile(index)">
                        <b  :class="[againNowIndex == index ? 'icon-check-default' : 'icon-circle']"></b>{{val}}
                      </li>
                  </ul>
              </div>
            </div>
          </div>
		</div>
    </div>
    <alertModel :title="showAlertData.title" :context="showAlertData.context" :type="showAlertData.type"  :showState="showAlertData.showAlert"  v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false" @sureHandle="sureHandle">
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
	    //contractList:["a","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf"],
        showAlertData:{        //公共弹框参数
            showAlert:false,
            title:"警告",
            context:""
        },
        addDir:false,          //添加弹框是否显示
        addFolderName:"",      //添加文件的文件夹名称
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
        searchTitleTem:"",
        timeSelect:false

    }
  },
  methods:{
    getdirListData(){        //获取文件夹数据
        var That = this;
        this.httpGet('doc/archiveDir/searchArchiveDirList',{
            'dirName':That.seFolderName
        },function(response){
        var result = response.data;
        if(result.meta.success){
            That.dirList = result.data;     
            That.getReParms.dirId = That.dirList[0].dirId;
            That.againFileListData();
        }else{
            That.showAlertData = {
                showAlert:true,
                context:result.meta.message
            }
        }
      },function(response){
        console.log(response);
      })
    },
    againFileListData(){      //获取归档文件列表
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
            That.againFileList = result.data.list;   
            That.pageData.total = result.data.totalCount;     
        }else{
            That.showAlertData = {
                showAlert:true,
                context:result.meta.message
            }
        }
      },function(response){
        console.log(response);
      })
    },
    searchFileHandle(val){
        //this.getReParms.searchKeyword = this.searchTitle;
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
        this.addFolderName = "";
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
                That.getdirListData();
            }
        },function(response){
            console.log(response);
        })
    },
    selectLi(num){             //选中文件夹
        if(this.selectIndex == num ) {
            this.selectIndex = -1;
        }
        else{
            this.selectIndex = num;
        }
        
    },
    editHandle(){
        if(this.selectIndex == -1){
            this.showAlertData = {
                showAlert:true,
                title:"提示",
                context:"主人，您还没有选中任何一个想要删除的列表",
                type:1
            }
        }else{
            this.editorIndex = this.selectIndex;
        }
        
    },
    resetFolderName(value,id){          //重设文件夹名称
       var That = this;      
       if(value == "") return;   
        this.httpGet("doc/archiveDir/modifyArchiveDir",{
            "dirId":id,
            "dirName":value
        },function(response){
            var result = response.data;
            if(result.meta.success){
                That.selectIndex = That.editorIndex = -1;
            }
        },function(response){
            console.log(response);
        })
    },
    delFolderHandle(){
        if(this.selectIndex == -1){
            this.showAlertData = {
                showAlert:true,
                title:"提示",
                context:"主人，您还没有选中任何一个想要删除的列表"
            }
        }else{            
            this.showAlertData = {
                showAlert:true,
                title:"提示",
                context:"确认删除？",
                type:2
            }
        }
    },
    sureHandle(){             //确认删除文件夹列表
        this.deleteIndex = this.selectIndex;
        this.showAlertData.showAlert = false;
        var That = this;
        this.httpGet("doc/archiveDir/deleteArchiveDir",{
            "dirId":That.dirList[That.deleteIndex].dirId,
        },function(response){
            var result = response.data;
            if(result.meta.success){
                That.selectIndex = That.deleteIndex = -1;
                That.getdirListData();
            }
        },function(response){
            console.log(response);
        })
    },
    searchHandle(val){        //搜索文件夹名称
        //alert(this.seFolderName)
        if(this.seFolderNameTem == val) return;
        this.getdirListData();
        this.seFolderNameTem = val;
        
    },
    againFile(event){         //重新归档弹框显示
        this.againFileState = !this.againFileState;
        var tagX = event.target.offsetLeft;
        var tagY = event.target.offsetTop;
        console.log(document.getElementById("againAlert"))
        var objHtml = document.getElementById("againAlert");
        objHtml.style.left=tagX-382+'px';
        objHtml.style.top=tagY+40+'px';
    },
    inputInit(value){
        if(value == '关键字：文件夹名称'){
            this.againSeName = ""
        }
    },
    selectFile(num){   //选中归档文件
        console.log(num)
        this.againNowIndex = num;
    },
    keyUpDown(event){
        console.log(event.keyCode)
        if(event.keyCode == 13 &&　this.againSeName != "" && this.againSeNameCenter != this.againSeName){
            this.againSeNameCenter = this.againSeName;
            console.log("请求获取归档接口");
            return false;
        }

        if(event.keyCode == 13 && this.againNowIndex != -1 && this.againSeNameCenter == this.againSeName){
            console.log("提交重新归档接口");
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
	pageChangeHandel(currentNum){  //侦听翻页函数
		console.log("我被翻页了，页码是："+currentNum);
	},
	changeStartDate(value){
      this.getReParms.signStartDate=value;
      this.timeSelect = true;
    },
    changeEndDate(value){
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
    this.getNowDate();
    
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

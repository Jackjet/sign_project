<template>
  <div class="file statistics_count">
    <div class="right_col">
		<div class="file-left">
			<div class="file-edit">
				<h3>归档文件夹{{addDir}}</h3>
				<div class="file-icon-box">
					<span @click="editHandle" :class="[editorIndex >= 0 ? 'active' : '','icon-editor']"></span>
					<span class="icon-add-folders-kong" @click.stop="addDir = true" :class="[addDir ? 'active' : '']">
                        <div class="add-folder-box" v-show="addDir">
                           <i></i>
                           <input type="text" placeholder="输入文件夹名称" name="" v-model="addFolderName">
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
				<input type="text" placeholder="关键字：文件夹名称">
				<span class="icon-search"></span>
			</div>
			<div class="contract-list mCustomScrollbar">
				<ul>
                    <!-- <li >
                        <span class="icon-folder"></span>
                        <p>asdfj</p>
                        <input type="text" name="" :value="125"  />
                        </li> -->
					<li  @click="selectLi(index)" v-for="(item,index) in dirList"  :class="[index == selectIndex ? 'active' : '',index == editorIndex ? 'editActive':'']">
                        <span class="icon-folder"></span>
                        <p v-show="index != editorIndex">{{item.dirName}}</p>
                        <input @keyup.enter="resetFolderName(item.dirName,item.dirId)" v-show="index == editorIndex" type="text" name=""   v-model="item.dirName" />
                    </li>
                    <li v-show="dirList.length == 0">
                        <p>暂无数据，赶快添加吧！</p>
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
						<span class="input"><calendar @changeDate="changeDate"></calendar></span>
						<span class="txt">至</span>
						<span class="input"><calendar @changeDate="changeDate"></calendar></span>
					  </div>
					  <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12"><input type="text" name="" placeholder="关键字：企业名称"></div>
					  <div class="col-lg-2 col-md-2 col-sm-12 col-xs-12 btn-box"><a href="#" class="search-btn">查询</a><a href="#">清空</a></div>
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
              <li class="li-class clf">
                <span>704562587@qq.com</span>
                <span>1020020155555</span>
                <span>电脑采购采购草孤傲的骄傲是</span>
                <span>1000</span>
                <span>数安时代</span>
                <span><a href="javascript:;">重新归档</a><a href="javascript:;">撤销归档</a></span>
                <i class="line"></i>
              </li>
              <li class="li-class clf">
                <span>704562587@qq.com</span>
                <span>1020020155555</span>
                <span>电脑采购采购草孤傲的骄傲是</span>
                <span>1000</span>
                <span>数安时代</span>
                <span><a href="javascript:;">重新归档</a><a href="javascript:;">撤销归档</a></span>
                <i class="line"></i>
              </li>
              <li class="pr">
                <span>共324条记录</span>
                <div class="page-box" >
                   <pagination :total="10" :currentpage="1" :display="5"  @pagechange="pageChangeHandel"></pagination>
                </div>
              </li>
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
        dirList:[],   
        selectIndex:-1, 
        editorIndex:-1,   
        deleteIndex:-1,
	    //contractList:["a","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf"],
        showAlertData:{        //公共弹框参数
            showAlert:false,
            title:"警告",
            context:""
        },
        addDir:false,         //添加弹框是否显示
        addFolderName:""      //添加文件的文件夹名称
    }
  },
  methods:{
    getdirListData(){        //获取文件夹数据
        var That = this;
        this.httpGet('doc/archiveDir/searchArchiveDirList',{},function(response){
        var result = response.data;
        if(result.meta.success){
            That.dirList = result.data;           
        }else{
            That.showAlertData = {
                showAlert:false,
                context:result.meta.message
            }
        }
      },function(response){
        console.log(response);
      })
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
	pageChangeHandel(currentNum){  //侦听翻页函数
		console.log("我被翻页了，页码是："+currentNum);
	},
	changeDate(value){
		console.log("子组件修改了日期，值为："+value)	
	}
  },
  mounted(){
    this.getdirListData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

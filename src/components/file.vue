<template>
  <div class="file statistics_count">
    <div class="right_col">
		<div class="file-left">
			<div class="file-edit">
				<h3>归档文件夹</h3>
				<div class="file-icon-box">
					<span class="icon-editor"></span>
					<span class="icon-add-folders-kong"></span>
					<span class="icon-del"></span>
				</div>				
			</div>
			<div class="search">
				<input type="text" placeholder="关键字：文件夹名称">
				<span class="icon-search"></span>
			</div>
			<div class="contract-list mCustomScrollbar">
				<ul>
					<li  v-for="item in contractList"><span class="icon-folder"></span>{{item}}</li>
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
              <li class="li-class">
                <span>704562587@qq.com</span>
                <span>1020020155555</span>
                <span>电脑采购采购草孤傲的骄傲是</span>
                <span>1000</span>
                <span>数安时代</span>
                <span>签约时间</span>
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
	    contractList:["a","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf"]
    }
  },
  methods:{
    getdirListData(){
      this.httpGet('doc/archiveDir/searchArchiveDirList',{},function(response){
        console.log(response)
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

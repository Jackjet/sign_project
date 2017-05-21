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
			  <h3>查询</h3>
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
		show:false,
		type:"date", //date datetime
		value:"2015-12-11",
		begin:"2015-12-20",
		end:"2015-12-25",
		x:0,
		y:0,
		range:true,//是否多选
      msg: 'Welcome to Your Vue.js App',
	  contractList:["a","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf","b","c","1545","asdfasf"]
    }
  },
  methods:{
    getData(){
      this.httpGet('cus/account/getCurAccount',function(response){
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
    //this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

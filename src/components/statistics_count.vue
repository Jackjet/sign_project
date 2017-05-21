<template>
  <div class="statistics_count">
    <div class="right_col">
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
      <div class="panel-box panel-white">
        <h3 class="title">统计时间：2017.05.19 13:00 <a class="btn-default btn-pink" href="#">导出Excel</a></h3>
        <div class="table">
          <li class="title">
            <span>企业名称</span>
            <span>签约次数（次/企业）</span>
          </li>
          <li>
            <span>广东信签科技信息有限公司</span>
            <span>10000</span>
          </li>
          <li>
            <span>广东信签科技信息有限公司</span>
            <span>10000</span>
          </li>
          <li class="pr">
            <span>共324条记录</span>
            <div class="page-box">
               <pagination :total="pageData.total" :currentpage="pageData.currentpage" :display="pageData.display"  @pagechange="pageChangeHandel"></pagination>
            </div>
          </li>
        </div>
      </div>
	 
    </div>
	
	</div>
</template>

<script>
import calendar from "./calendar.vue";
export default {
  name: 'statistics_count',
  components:{
	calendar
  },
  data () {
    return {
		tableData:{},
		pageData:{
			total: 81,      //总条数
			display: 15,    //每页条数
			currentpage: 1  //当前页数	
		},
		show:false,
		type:"date", //date datetime
		value:"2015-12-11",
		begin:"2015-12-20",
		end:"2015-12-25",
		x:0,
		y:0,
		range:true//是否多选
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
	change:function(propName,newVal,oldVal){
		this[propName]=newVal;
			console.log("组件tab的" +propName+ "属性变更为" +newVal);
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

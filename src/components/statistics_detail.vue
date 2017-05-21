<template>
  <div class="statistics_count statistics_detail">
    <div class="right_col">
      <div class="panel-box panel-white">
          <h3>查询</h3>
          <div class="search clf">
              <div class="search-box clf">
               <input type="text" name="" placeholder="关键字：企业名称"><a href="#" class="btn-pink btn-default">查询</a><a class="btn-default" href="#">清空</a>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white">
        <h3 class="title">统计时间：2017.05.19 13:00 <a class="btn-default btn-pink" href="#">导出Excel</a></h3>
        <div class="table">
          <li class="title">
            <span>账号(电子邮箱)</span>
            <span>签约ID</span>
            <span>名称</span>
            <span>签约金额</span>
            <span>其他签署人</span>
            <span>签约时间</span>
          </li>
          <li>
            <span>704562587@qq.com</span>
            <span>1020020155555</span>
            <span>电脑采购采购草孤傲的骄傲是</span>
            <span>1000</span>
            <span>数安时代</span>
            <span>签约时间</span>
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

export default {
  name: 'statistics_detail',
  data () {
    return {
      pageData:{
		total: 81,      //总条数
		display: 15,    //每页条数
		currentpage: 1  //当前页数	
	  }
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

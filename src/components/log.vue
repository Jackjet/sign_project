<template>
  <div class="statistics_count">
    <div class="right_col">
      <div class="tab-nav">
        <div class="tab-box">
          <router-link to="/log/user_operation/1">用户操作日志</router-link>
          <router-link to="/log/user_operation/2">文档操作日志</router-link>
          <router-link to="/log/user_operation/3">签署过程日志</router-link>
        </div>
      </div>  
      <router-view></router-view> 
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
  		
    }
  },
  methods:{
  },
  mounted(){
    document.title = "签吧-日志"; 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

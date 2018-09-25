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
export default {
  name: 'statistics_count',
  data () {
    return {}
  },
  methods:{
  },
  mounted(){
    if(this.cloudyState){
        document.title="云合同-日志";
    }else{
        document.title="签吧-日志";
    }
  }
}
</script>
<style scoped lang="scss"></style>

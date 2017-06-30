<template>
  <div>
    您所访问的页面不存在，
    <a href="#">跳转到首页</a>
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
    document.title = "404"; 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
//  @import '../assets/css/font2/font.css';
//  @import '../assets/css/base.scss';
//  @import '../assets/css/sign_check.scss';
</style>

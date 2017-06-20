<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="main_container">
      <menuBar v-show="comNav"></menuBar>
      <menuTop v-show="comNav"></menuTop>
      <router-view></router-view>	  
      <div class="footer"  v-show="comNav">
        <p>Copyright © 2017 广东信鉴信息科技有限公司 All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
import menuBar from './components/menu_left';
import menuTop from './components/nav_top';
export default {
  name: 'app',
  data(){
  	return{
  	}
  },
  computed:{
    comNav(){
      return this.$store.state.comNav;
    }
  },
  components:{
      menuBar:menuBar,
      menuTop:menuTop
  }
}
</script>
<style lang="scss" scoped>
  .footer{
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #4b4b4b;
    position: fixed;
    bottom:0px;
    left: 0px;
    width: 100%;
    background: #fff;
    p{
      font-size: 14px;
    }
  }
</style>
<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="main_container">
      <menuBar v-show="comNav"></menuBar>
      <menuTop v-show="comNav"></menuTop>
      <Model v-show="model.state" :context="model.context" :topClass="model.topClass"></Model>
      <router-view></router-view>	  
      <!-- <div class="footer"  v-show="comNav">
        <p>Copyright © 2017 广东信鉴信息科技有限公司 All Rights Reserved.</p>
      </div> -->
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
      // model:{
      //   state:false,
      //   autoClose:false
      // }
  	}
  },
  computed:{
    comNav(){
      return this.$store.state.comNav;
    },
    model(){
      return this.$store.state.model;
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
    font-family: "Microsoft YaHei", tahoma, arial, "Hiragino Sans GB", "\5B8B\4F53", sans-serif;
    p{
      font-size: 14px;
      padding-left: 170px;
    }
  }
</style>
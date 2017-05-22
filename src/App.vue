<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="main_container">
      <menuBar></menuBar>
      <menuTop></menuTop>
      <router-view></router-view>	  
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
  components:{
      menuBar:menuBar,
      menuTop:menuTop
  },
  
  methods:{
	
  }
}
</script>

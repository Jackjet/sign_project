<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="main_container">
      <menuBar></menuBar>
      <router-view></router-view>	  
    </div>
  </div>
</template>

<script>
import menuBar from './components/menu_left';
export default {
  name: 'app',
  data(){
	return{
	}
  },
  components:{
      menuBar:menuBar
  },
  
  methods:{
	
  }
}
</script>

<template>
  <div class="online_sign">
    <signar></signar>
  </div>
</template>
<script>
/*import '../assets/css/font2/font.css'
import '../assets/css/sign_check.scss'*/
import signar from './sign_check.vue'
export default {
  name: 'online_sign',
  components:{
	//calendar,
  signar
  },
  data () {
    return {
  		
    }
  },
  methods:{
  },
  mounted(){
    document.title = "签吧-在线验签"; 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
@import '../assets/css/font2/font.css';
@import '../assets/css/base.scss';
@import '../assets/css/sign_check.scss';
</style>

<template>
  <div class="online_state">
    <signstate></signstate>
  </div>
</template>

<script>
import signstate from './sign_state.vue';
export default {
  name: 'online_state',
  components:{
  signstate
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

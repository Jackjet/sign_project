<template>
  <div class="online_sign">
    <signar></signar>
  </div>
</template>
<script>
/*import '../assets/css/font2/font.css'
import '../assets/css/sign_check.scss'*/
import signar from '../file/sign_check.vue'
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
    if(this.cloudyState){
      document.title="云合同-在线验签";
    }else{
      document.title="签吧-在线验签";
    }
  }
}
</script>
<style scoped lang="scss"></style>

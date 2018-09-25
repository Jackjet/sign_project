<template>
  <div class="online_state">
    <signstate></signstate>
  </div>
</template>

<script>
import signstate from '../file/sign_state.vue';
export default {
  name: 'online_state',
  components:{
  signstate
  },
  data () {
    return { }
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

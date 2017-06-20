<template>
  <div class="index_welcome">
    
  </div>
</template>

<script>
export default {
  name: 'index_welcome',
  data () {
    return {
    }
  },
  computed:{
    userState(){
      return this.$store.state.userState
    },
    topTitle(){
      return this.$store.state.top_title;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/css/font2/font.css';
@import '../assets/css/base.scss';
.router-link-active{
  color: $pink !important;
}

</style>

<template>
  <div class="sign_check">
    <div class="right_col">
      <div class="panel-box panel-white pb180">
          <h3>文件验签</h3>
          <div class="panel-upload">
              <img src="../assets/images/sign_icon.png" alt="">
              <!--<a class="upload-btn" href="javascript:;">上传PDF文件</a>-->
              <div class="upload-btn">上传PDF文件<input type="file" value="上传PDF文件"></div>
              <p class="warn"><i class="icon-warn"></i>不支持该格式文档，请上传<span>PDF</span>文件</p>
              <div class="upload-tip">
                  <p>验证文件签名的有效性，以及是否被篡改！</p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'sign_check',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    getData(){
      this.httpGet('cus/account/getCurAccount',function(response){
        console.log(response)
      },function(response){
        console.log(response);
      })
     /* this.$http.get('api/cus/account/getCurAccount')
        .then(function (response) {
         // console.log(response);
        })
        .catch(function (response) {
         // console.log(response);
        });*/
    }
  },
  mounted(){
    //this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

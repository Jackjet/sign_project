<template>
  <div class="sign_state">
    <div class="right_col">
      <div class="panel-box panel-white">
          <h3>文件验签</h3>
          <div class="panel-contain">
              <div class="panel-img">
                  <img src="../assets/images/docThumb.png" alt="">
                  <p>文件名</p>
              </div>
          </div>
      </div>
      <div class="panel-box panel-white">
          <h3>验签结果</h3>
          <div class="panel-contain panel-success clf">
              <div class="panel-true">
                  <p><i class="icon-check-default"></i></p>
                  <h4>验证成功</h4>
              </div>
              <div class="panel-false">
                  <p><i class=" icon-close2"></i></p>
                  <h4>验证失败</h4>
                  <p class="warn"><i class="icon-warn"></i>该文件已被修改，签名无效</p>
              </div>
              <div class="panel-square clf col-lg-10 col-lg-offset-1 mt50 col-md-12 col-md-offset-0">
                  <div class="float-box">
                      <p><span>1</span>改文档的签名/签章有效 &nbsp;&nbsp;&nbsp;<span>2</span>改文档未被篡改</p>
                  </div>
                  <ul class="clf">
                      <li class="row">
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">签署方：信鉴</span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">颁发机构：数安时代</span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">签约时间：2017-01-18 14:53:59</span>
                      </li>
                      <li class="row">
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">签署方：信鉴</span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">颁发机构：数安时代</span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">签约时间：2017-01-18 14:53:59</span>
                      </li>
                  </ul>
              </div>
              <a href="#" id="contain-btn" class="clf">继续验签</a>
          </div>
      </div>
  </div>
  </div>
</template>

<script>

export default {
  name: 'sign_state',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

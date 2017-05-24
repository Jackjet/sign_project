<template>
  <div class="sign_check">
    <div class="right_col">
      <div class="panel-box panel-white pb180">
          <h3>文件验签</h3>
          <div class="panel-upload">
              <img src="../assets/images/sign_icon.png" alt="">
              <!--<a class="upload-btn" href="javascript:;">上传PDF文件</a>-->
              <div class="upload-btn">上传PDF文件<input type="file" accept="pdf" name="file" value="上传PDF文件" id="fileInput" @click="upLoadHandle()"></div>
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
      this.httpGet('cus/account/getCurAccount',{},function(response){
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
    },
    upLoadHandle(){
      var That = this;
      $('#fileInput').on('change',function(){
        var formData = new FormData();
        formData.append("uploadFile", document.getElementById("fileInput").files[0]);   
        console.log(this.files)
        console.log(this.files[0].type);
        var filesName = this.files[0].name;
        if (/pdf$/.test( this.files[0].type)){
           That.httpPost('doc/docVerify/verify',{
              "uploadFile":filesName
            },function(response){
              console.log(response)
            },function(response){
              console.log(response);
            })

           /* That.$http.post('/api/doc/docVerify/verify',{
              uploadFile:filesName,
            })
            .then(function(res){
              console.log(res);
            })
            .catch(function(err){
              console.log(err);
            });*/
        }
      })
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

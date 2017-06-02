<template>
  <div class="sign_check">
    <Loading :text="'上传中，请稍后'" v-show="submitStatus"></Loading>
    <div class="right_col" v-cloak>
      <div class="panel-box panel-white pb180">
          <h3>文件验签</h3>
          <div class="panel-upload">
              <img src="../assets/images/sign_icon.png" alt="">
              <!--<a class="upload-btn" href="javascript:;">上传PDF文件</a>-->
              <!-- <div class="upload-btn">上传PDF文件
                <input type="file" accept="pdf" name="file" value="上传PDF文件" id="fileInput" @click="upLoadHandle()">
              </div> -->
              <form id="uploadForm" method="post" enctype="multipart/form-data"  style="padding-bottom:100px;"> 
                     <!--  <a class="upload-btn" href="javascript:;">上传PDF文件</a>            -->       
                     <p class="uploadFileName">{{uploadFileName}}</p>
                      <div class="upload-btn"  @click="selectFile()">{{tipName}}
                          
                          <input type="file" id="file" name="uploadFile" >
                      </div>
                      <!-- <button type="submit" class="btn btn-primary">下一步</button> -->
                       <p class="warn" v-show="uploadWarn" ><i class="icon-warn"></i>不支持该格式文档，请上传<span>PDF</span>文件</p>
              </form>
             
              <div class="upload-tip">
                  <p>验证文件签名的有效性，以及是否被篡改！</p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/js/jquery.form.js';
export default {
  name: 'sign_check',
  data () {
    return {
      uploadWarn: false,
      uploadFileName:"",
      tipName:"上传PDF文件",
      clickStatus:true,
      submitStatus:false
    }
  },
  methods:{
    selectFile(){
      var _this = this;
      $("#file").on('change',function(){
        _this.uploadFileName = this.value;

        $('#uploadForm').ajaxSubmit({  
          url : _this.apiPath+'doc/docVerify/verify',  
          //url : 'http://apioa.cuxiaoke.cn/pc/Jackay',  

          dataType: 'json',  
          xhrFields: {
                withCredentials: true
          },
          type:'post',    
          beforeSubmit: function() {

              var val = $(':file').fieldValue();
              var arr = val[0].split('.');
              var Suffix = arr[arr.length-1];
              console.log(Suffix)
              if (val == "") {
                  return false;
              }
              if(Suffix != 'pdf'){
                _this.uploadWarn = true;
                _this.tipName = "重新上传";
                return false;
              }
              
              _this.uploadWarn = false;
              _this.submitStatus = true;
          },
          success: function(res){
                 _this.setLSData("uploadData",res.data);
                 _this.setLSData("uploadMessage",res.meta);

                 /*_this.$store.dispatch('changeStorageData',res.data);
                 _this.$store.dispatch('changeStorageMsg',res.meta);*/
                 _this.$router.push({
                    name: 'sign_state'
                  });
              /*if (res.meta.success) {
              } else {
                 _this.submitCallback(res);
              }*/
          }
          //timeout:   3000  
      });

      })

    }
  },

  mounted(){
    this.$store.dispatch('changeTitle','我的文档>验签');  
    //document.title = "我的文档>验签";
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
 @import '../assets/css/font2/font.css';
 @import '../assets/css/base.scss';
 @import '../assets/css/sign_check.scss';
</style>

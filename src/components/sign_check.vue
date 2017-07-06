<template>
  <div class="sign_check">
    <Loading :text="'上传中，请稍后'" v-show="submitStatus"></Loading>
    <div class="right_col" v-cloak>
      <div class="panel-box panel-white pb180">
          <h3>文件验签</h3>
          <div class="panel-upload">
              <img src="../assets/images/sign_icon.png" alt="">
              <p class="tip">温馨提示：上传文件不超过10M</p>
              <form id="uploadForm" method="post" enctype="multipart/form-data"  style="padding-bottom:100px;">     
                     <p class="uploadFileName">{{uploadFileName}}</p>
                      <div class="upload-btn"  @click="selectFile()">{{tipName}}
                          
                          <input type="file" id="file" name="uploadFile">
                      </div>
                       <p class="warn" v-show="uploadWarn" ><i class="icon-warn"></i>不支持该格式文档，请上传<span>PDF</span>文件</p>
              </form>
             
              <div class="upload-tip">
                  <p>验证文件签名的有效性，以及是否被篡改！</p>
              </div>
          </div>
      </div>
    </div>
    <alertModel :title="'提示'" :context="showAlertTxt" :type="1"  :showState="showAlertState"  v-show="showAlertState"  @cancelHandle="showAlertState = false" ></alertModel>
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
      submitStatus:false,
      showAlertState:false,
      showAlertTxt:'',
      routerName:null
    }
  },
  methods:{
    selectFile(){
      var _this = this;
      $("#file").unbind().on('change',function(){
        var arrTem = [];
        arrTem = this.value.split("\\");
        _this.uploadFileName = arrTem[arrTem.length-1];
        $('#uploadForm').ajaxSubmit({  
          url : _this.apiPath+'doc/docVerify/verify',  
          //url : 'http://apioa.cuxiaoke.cn/pc/Jackay',  

          /*dataType: 'json', */
          xhrFields: {
                withCredentials: true
          },
          type:'post',
          beforeSubmit: function() {
              var val = $(':file').fieldValue();  
              var arr = val[0].split('.');              
              var Suffix = arr[arr.length-1];
              if (val == "") {
                  return false;
              }
              if(Suffix != 'pdf'){
                _this.uploadWarn = true;
                _this.tipName = "重新上传";
                return false;
              }   
              
              var oMyFile = document.getElementById('file');
              var fileName = oMyFile.files[0].size / 1048576 ;
              if(fileName > 10 ){
                  _this.showAlertState = true;
                  _this.showAlertTxt = '文件大小不能大于10M';
                  $("#file").val("");
                  _this.uploadFileName = "";
                  $("#file").removeAttr('disabled');
                  return false;
              } 

              _this.uploadWarn = false;
              _this.submitStatus = true;

              $("#file").attr('disabled','disabled');
              

                           
          },
          success: function(res){
               var backData = JSON.parse(res)
                 _this.setLSData("uploadData",backData.data);
                 _this.setLSData("uploadMessage",backData.meta);
                 if(_this.$route.name == "onlineSign"){  //在线验签
                     _this.$router.push({
                        name:"onlineSignState"
                    });
                 }
                 if(_this.$route.name == "sign_check"){   //用户文件验签
                     _this.$router.push({
                        name: 'sign_state'
                    });
                 }
                
          },
          error:function(res){
            if(res.statusText == "timeout"){
              _this.submitStatus = false;
              _this.showAlertState = true;
              _this.showAlertTxt = '服务器繁忙，请稍后再试';
               $("#file").val("");
              _this.uploadFileName = "";
              $("#file").removeAttr('disabled');
            }
            
          },
          timeout:30000
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
//  @import '../assets/css/font2/font.css';
//  @import '../assets/css/base.scss';
//  @import '../assets/css/sign_check.scss';
</style>

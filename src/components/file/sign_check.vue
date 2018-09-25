<template>
  <div class="sign_check">
    <Loading :text="'文件上传中，请稍后'" v-show="submitStatus"></Loading>
    <div class="right_col" v-cloak>
      <div class="panel-box panel-white pb180">
          <h3>文件验签</h3>
          <div class="panel-upload" id="drop_area">
              <div class="form-box" >
                <img src="../../assets/images/sign_icon.png" alt="" width="210" height="149">
                <p class="tip">请上传需要验证的PDF文件<br/>文件大小需&lt;10MB</p>
                <p class="warn-tip">*点击选择上传文件或拖动文件到此处</p>
                <form id="uploadForm" method="post" enctype="multipart/form-data">     
                     <p class="uploadFileName">{{uploadFileName}}</p>
                      <div class="upload-btn"  @click="selectFile()">{{tipName}}                          
                          <input type="file" id="file" name="uploadFile" contenteditable="false"> 
                      </div>
                       <p class="warn" v-show="uploadWarn" ><i class="icon-warn"></i>不支持该格式文档，请上传<span>PDF</span>文件</p>
                </form>
              </div>
              <div class="upload-tip">
                  <p>验证文件签名的有效性，以及是否被篡改！</p>
              </div>
          </div>
      </div>
    </div>
    <!--公共弹框-->
    <alertModel :title="'温馨提示'" :context="showAlertData.context"   :showState="showAlertData.showAlert" :autoClose="showAlertData.autoClose" v-show="showAlertData.showAlert"  @cancelHandle="showAlertData.showAlert = false;showAlertData.autoClose = false;" >
    </alertModel>
  </div>
</template>

<script>
import '@/assets/js/plugin/jquery.form.js';
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
      routerName:null,
      showAlertData : {   //公共弹框参数
        showAlert:false,
        context:'',
        autoClose:false,
      },
    }
  },
  methods:{
    selectFile(){
      var _this = this;
      /*var bar = $('.bar');
      var percent = $('.percent');*/
      var TimerUpload = null ;
      $("#file").val('');
      $("#file").unbind().on('change',function(){
        var arrTem = [];
        arrTem = this.value.split("\\");
        _this.uploadFileName = arrTem[arrTem.length-1];
        $('#uploadForm').ajaxSubmit({  
          url : _this.apiPath+_this.URL.verify,  
          //url:_this.apiPath+'food/index.php?m=Api&c=Index&a=upload_file',
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
                /*_this.tipName = "重新上传";*/
                // _this.showAlertState = true;
                // _this.showAlertTxt = '不支持该格式文档，请上传PDF文件';
                _this.alertCommonTip('不支持该格式文档，请上传PDF文件');
                return false;
              }   
              
              var oMyFile = document.getElementById('file');
              
              if(oMyFile.files){  //判断ie是否支持此属性
                var fileName = oMyFile.files[0].size / 1048576 ;
                    if(fileName > 10 ){
                        // _this.showAlertState = true;
                        // _this.showAlertTxt = '文件大小不能大于10M';
                         _this.alertCommonTip('文件大小不能大于10M');
                        $("#file").val("");
                        _this.uploadFileName = "";
                        $("#file").removeAttr('disabled');
                        return false;
                    } 
              }
              _this.uploadWarn = false;
              _this.submitStatus = true;

              $("#file").attr('disabled','disabled');     
            },
            success: function(res){
                var backData = JSON.parse(res)
                 _this.setLSData("uploadData",backData.data);
                 _this.setLSData("uploadMessage",backData.meta);
                 _this.setLSData("uploadFile",_this.uploadFileName);
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
                // _this.showAlertState = true;
                // _this.showAlertTxt = '服务器繁忙，请稍后再试';
                 _this.alertCommonTip('服务器繁忙，请稍后再试');
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
    if(this.cloudyState){
      document.title="云合同-验签";
    }else{
      document.title="签吧-验签";
    }
    this.$store.dispatch('changeTitle','我的文档>验签'); 
    var That = this;
    /*拖拽上传*/
    $(function(){
        /*var bar = $('.bar');
        var percent = $('.percent');*/
        $(document).on({ 
            dragleave:function(e){    //拖离 
                e.preventDefault(); 
            }, 
            drop:function(e){  //拖后放 
                e.preventDefault(); 
            }, 
            dragenter:function(e){    //拖进 
                e.preventDefault(); 
            }, 
            dragover:function(e){    //拖来拖去 
                e.preventDefault(); 
            } 
        }); 
        function onprogress(evt){
            var loaded = evt.loaded;     //已经上传大小情况 
            var tot = evt.total;      //附件总大小 
            var per = Math.floor(100*loaded/tot);  //已经上传的百分比 
            bar.width(per+'%')
            percent.html(per+'%');
        }
        var box = document.getElementById('drop_area'); //拖拽区域 
            box.addEventListener("drop",function(e){ 
                e.preventDefault(); //取消默认浏览器拖拽效果 
                if(window.FormData){                     
                    var fileList = e.dataTransfer.files; //获取文件对象 
                    //检测是否是拖拽文件到页面的操作 
                    if(fileList.length == 0){ 
                        return false; 
                    } 
                    var filename = fileList[0].name; //图片名称 
                    That.uploadFileName = filename;

                    //检测文件是不是pdf
                    if(fileList[0].type.indexOf('pdf') === -1){ 
                        That.uploadWarn = true;
                        // That.showAlertState = true;
                        // That.showAlertTxt = '不支持该格式文档，请上传PDF文件';
                        That.alertCommonTip('不支持该格式文档，请上传PDF文件');
                        return false;
                    } 
                    //拖拉文件到浏览器                    
                    var filesize = Math.floor((fileList[0].size)/1024);                      
                    if(filesize>10240){ 
                        // That.showAlertState = true;
                        // That.showAlertTxt = '文件大小不能大于10M';
                        That.alertCommonTip('文件大小不能大于10M');
                        $("#file").val("");
                        That.uploadFileName = "";
                        $("#file").removeAttr('disabled');
                        return false; 
                    } 

                    That.uploadWarn = false;
                    That.submitStatus = true;  
                    $("#file").attr('disabled','disabled');  

                    var formData = new FormData();
                    formData.append('uploadFile', fileList[0]);                     
                    //formData.append('file', fileList[0]);                     

                    $.ajax({
                        url: That.apiPath+That.URL.verify,
                        //url:That.apiPath+'food/index.php?m=Api&c=Index&a=upload_file',
                        type: 'POST',
                        cache: false,
                        data: formData,
                        processData: false,
                        contentType: false,
                        /*xhr: function(){  
                            var xhr = $.ajaxSettings.xhr();  
                            xhr.upload.addEventListener("progress" , onprogress, false);  
                            return xhr; 
                        },*/
                        timeout:30000
                    }).done(function(res) {
                        var backData = JSON.parse(res)
                        That.setLSData("uploadData",backData.data);
                        That.setLSData("uploadMessage",backData.meta);
                        That.setLSData("uploadFile",That.uploadFileName);
                        if(That.$route.name == "onlineSign"){  //在线验签
                            That.$router.push({
                                name:"onlineSignState"
                            });
                        }
                        if(That.$route.name == "sign_check"){   //用户文件验签
                            That.$router.push({
                                name: 'sign_state'
                            });
                        } 
                    }).fail(function(res) {
                        if(res.statusText == "timeout"){
                            That.submitStatus = false;
                            // That.showAlertState = true;
                            // That.showAlertTxt = '服务器繁忙，请稍后再试';
                            That.alertCommonTip('服务器繁忙，请稍后再试');
                            $("#file").val("");
                            That.uploadFileName = "";
                            $("#file").removeAttr('disabled');
                        }
                    })
                }else{
                    // That.showAlertState = true;
                    // That.showAlertTxt = '此浏览器不支持拖拽功能，请点击选择文件上传';
                    That.alertCommonTip('此浏览器不支持拖拽功能，请点击选择文件上传');
                }   
                },false); 
              })
  }
}
</script>
<style scoped lang="scss">
</style>

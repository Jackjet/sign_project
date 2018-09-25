<template>
  <div class="sign_state">
    <div class="right_col">
      <!-- <div class="panel-box panel-white">
          <h3>文件验签</h3>
          <div class="panel-contain pr" style="min-height: 210px">
              <div class="img-box">
                  <div class="panel-img">
                    <img v-show="uploadSuccess"  alt="" :src="'data:image/png;base64,'+imgUrl" />
                    <img v-show="uploadFail" src="../../assets/images/docThumb2.png"/>
                </div>
              </div>
          </div>
      </div> -->
      <div class="panel-box panel-white">
          <h3>验签结果</h3>
          <div class="panel-contain panel-success clf">
              <div class="panel-true" v-show="uploadSuccess">
                  <!-- <p><i class="icon-check-default"></i></p> -->
                  
                  <p><img src="../../assets/images/yq_success.png"></p>
                  <h4>验证成功</h4>
                  <h4 class="file_title">{{lostorgFile}}</h4>
              </div>
              <div class="panel-false" v-show="uploadFail">
                  <!-- p><i class=" icon-close2"></i></p> -->
                  <p><img src="../../assets/images/yq_fail.png"></p>
                  <h4>验证失败</h4>
                  <p class="warn"><i class="icon-warn"></i>{{lostorgMsg.message}}</p>
              </div>
              <div class="panel-square clf col-lg-10 col-lg-offset-1 mt50 col-md-12 col-md-offset-0" v-show="uploadSuccess">
                  <div class="float-box">
                      <p><span>1</span>该文档的签名/签章有效 &nbsp;&nbsp;&nbsp;<span>2</span>该文档未被篡改</p>
                  </div>
                  <ul class="clf">
                      <li class="row clf" v-for="(item,index) in list" :key="index">
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><b>签署方：{{item.signCertName}}</b></span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><b>颁发机构：{{item.auth}}</b></span>
                          <span class="col-lg-4 col-md-4 col-sm-4 col-xs-4"><b>签约时间：{{item.signTime}}</b></span>
                      </li>
                  </ul>
              </div>
              <a href="javascript:;" id="contain-btn" class="clf" @click="againSign()">继续验签</a>
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
      lostorgData: {},
      lostorgMsg:"",
      uploadSuccess:null,
      uploadFail:null,
      imgUrl:"",
      list:[],
      lostorgFile:''
    }
  },
  computed:{
    uploadData(){
      return this.$store.state.uploadData;
    },
    uploadMessage(){
      return this.$store.state.uploadMessage;
    }
  },
  methods:{
    againSign(){      
      this.removeLSData('uploadData');
      this.removeLSData('uploadMessage');
      if(this.$route.name == "sign_state"){
        this.$router.push({         //用户验签
          name: 'sign_check'
        });
      }else{
        this.$router.push({         //在线验签
          name: 'onlineSign'
        });
      }
    },
    init(){
      if(this.lostorgMsg.success){
          this.uploadSuccess = true;
          this.imgUrl = this.lostorgData.imgBase64Str;
          this.list = this.lostorgData.list;
      }else{
          this.uploadFail = true;
      }
    }
  },
  mounted(){
    this.lostorgData = this.getLSData('uploadData');
    this.lostorgMsg = this.getLSData('uploadMessage');
    this.lostorgFile = this.getLSData('uploadFile');
    //alert(this.lostorgMsg)
    var That = this;
    setTimeout(function(){
      if(!That.lostorgMsg){
        if(That.$route.name == "sign_state"){
          That.$router.push({         //用户验签
            name: 'sign_check'
          });
        }else{
          That.$router.push({         //在线验签
            name: 'onlineSign'
          });
        }
      }
    },100)
    this.init();
    this.$store.dispatch('changeTitle','我的文档>验签');  
    if(this.cloudyState){
      document.title="云合同-验签";
    }else{
      document.title="签吧-验签";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">
//  @import '../assets/css/font2/font.css';
//  @import '../assets/css/base.scss';
//  @import '../assets/css/sign_check.scss';
</style>

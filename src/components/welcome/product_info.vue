<template>
  <div class="product">
      <div class="page1 page">
        <div class="container">          
          <h3>文件签署</h3>
          <p>发起，签署，发送，即可完成签约。支持U-key和移动端签署<br>
依托数字证书、可信PDF表单、安全网关、时间戳等核心技术，确认身份真实性，防止文件篡改</p>
          <div>
            <img src="../../assets/images/welcome/product_1.png">
          </div>
        </div>
      </div>
      <div class="page2 page">
        <div class="container"> 
          <div class="row clf">
            <div class="col-lg-4 col-md-4 col-sm-4">
              <h3>文件管理</h3>
              <p>可按照状态、发送时间、名称查询所需文档。</p>
              <p>支持对“已完成”文档进行归档。</p>
              <p>支持对文档查看权限进行管理</p>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-8">
               <img src="../../assets/images/welcome/product_3.png">
            </div>

          </div>
        </div>
      </div>
      <div class="page3 page">
        <div class="container"> 
          <div class="row clf">            
            <div class="col-lg-8 col-md-8 col-sm-8">
               <img src="../../assets/images/welcome/product_5.png">
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4">
              <h3>组织架构及权限管理</h3>
              <p>针对大型企业，支持多个用户。</p>
              <p>支持组织架构及成员管理</p>
              <p>管理员可以将其签署、</p>
              <p>查看等操作的权限分配给不同的成员，</p>
              <p>确保签署过程操作安全可控制。</p>
            </div>
          </div>
        </div>
      </div>
      <div class="page4 page">
        <div class="container"> 
          <div class="row clf">
            <div class="col-lg-4 col-md-4 col-sm-4">
              <h3>鉴定服务</h3>
              <p>提供权威司法鉴定、</p>
              <p>签署过程数据的技术报告等延伸服务。</p>
            </div>
            <div class="col-lg-8 col-md-8 col-sm-8">
               <img src="../../assets/images/welcome/product_7.png">
            </div>

          </div>
        </div>
      </div>
      <div class="page5 page">
        <div class="container">          
          <h3>集成服务</h3>
          <p>提供标准化API与业务系统集成，签署人可在业务系统中完成文件签署。<br>企业不须熟悉PKI、P7、公钥、SHA256、SM2等专业技术</p>
          <div>
            <img src="../../assets/images/welcome/product_8.png">
          </div>
        </div>
      </div>
      <div class="page6 page">
          <img  v-if="!cloudyState" src="../../assets/images/welcome/product_9.png">
          <img  v-if="cloudyState" src="../../assets/images/welcome/product_9_c.png">
      </div>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
    }
  },
  methods:{
  },
  mounted(){
    if(this.cloudyState){
      document.title="云合同-产品介绍";
    }else{
      document.title="签吧-产品介绍";
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/css/animate.min.css';


</style>

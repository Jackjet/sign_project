<template>
  <div class="welcome">
      <div class="banner"></div>
      <div class="page1 page">
        <div class="container">
          
          <h3>让签署更轻松，更安全</h3>
          <ul class="clf">
            <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6 animated zoomIn">
              <img src="../assets/images/welcome/icon1.png">
              <h4>签署简单便捷</h4>
              <p>支持U-Key和移动端签署<br>支持单独签和多人会签多种应用场景</p>
            </li>
            <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6 animated zoomIn">
              <img src="../assets/images/welcome/icon2.png">
              <h4>合法合规</h4>
              <p>第三方在线合同平台，<br>满足平等、公平的法律要求。<br>支持获得《电子认证服务许可证》的CA证书，<br>完全符合《电子签名法》相关规定</p>
            </li>
            <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6 animated zoomIn">
              <img src="../assets/images/welcome/icon3.png">
              <h4>安全稳定</h4>
              <p>通过ISO27001国际安全认证，<br>提供金融级别的全面安全保障。<br>传输存储访问高强度加密。</p>
            </li>
            <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6 animated zoomIn">
              <img src="../assets/images/welcome/icon4.png">
              <h4>司法鉴定</h4>
              <p>联合第三方司法鉴定机构，<br>证据实时保存，快速取证。</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="page page2">
          <div class="container">
            <h3>广泛的应用场景</h3>
            <ul class="row clf" id="changjing">
              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                <div class="item" @mouseenter="mouseHandle($event)" @mouseleave="mouseOutHandle($event)">
                   <div class="img">
                     <img id="imgfirst" src="../assets/images/welcome/pic1.png">
                     <div class="img-cover">
                       <p>销售采购<br>订单处理<br>劳务合同<br>内部审批</p>
                     </div>
                   </div>
                   <span>传统制造业</span>
                </div>
               
              </li>
              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                
                <div class="item" @mouseenter="mouseHandle($event)" @mouseleave="mouseOutHandle($event)">
                  <div class="img">
                     <img src="../assets/images/welcome/pic2.png">
                     <div class="img-cover" >
                       <p>买卖合同<br>服务协议<br>供应链合同</p>
                     </div>
                   </div>
                  <span>B2B电商</span>
                </div>
              </li>
              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
                <div class="item" @mouseenter="mouseHandle($event)" @mouseleave="mouseOutHandle($event)">
                  <div class="img">
                     <img src="../assets/images/welcome/pic3.png">
                     <div class="img-cover">
                       <p>投资协议<br>双方或多方借贷合同</p>
                     </div>
                   </div>
                  <span>互联网金融</span>
                </div>
              </li>
              <li class="col-lg-3 col-md-3 col-sm-6 col-xs-6 ">                
                <div class="item" @mouseenter="mouseHandle($event)" @mouseleave="mouseOutHandle($event)">
                  <div class="img">
                     <img src="../assets/images/welcome/pic4.png">
                     <div class="img-cover">
                       <p>房地产<br>医疗<br>事业单位<br>等更多行业在加入我们</p>
                     </div>
                   </div>
                  <span>更多</span>
                </div>
              </li>
            </ul>
          </div>
      </div>
      <div class="page page3">
        <h3>典型用户</h3>
        <div class="container por">
          <div class="scroll-wrap" id="scroll-wrap">
            <div class="scroll-box clf" id="scroll-box">
              <ul class="row" style="opacity:1">
                <li>
                  <img src="../assets/images/welcome/logo1.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo2.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo3.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo4.png" alt="">
                </li>
              </ul>
              <ul class="row">
                <li>
                  <img src="../assets/images/welcome/logo5.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo6.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo7.png" alt="">
                </li>
                <li>
                  <img src="../assets/images/welcome/logo8.png" alt="">
                </li>
              </ul>
            </div>
            <div class="icons">
              <a class="btn active" href="javascript:;"></a>
              <a class="btn" href="javascript:;"></a>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  data () {
    return {
      leftShow:false,
      rightShow:true
    }
  },
  methods:{
    mouseHandle(event){
      $(event.target).find('.img-cover').fadeIn()
    },
    mouseOutHandle(event){
      $(event.target).find('.img-cover').fadeOut()
    }
  },  
  mounted(){   
    var That = this;  
    $(window).scroll(function(event){
       if($(window).scrollTop() > 500){
          $('#changjing').find('.item').addClass('animated zoomIn');
       }
    })
    $(function(){
      var width = null;   //一个ul的宽度
      viewResize();       //重新计算
      function viewResize(){				 		
        var viewWidth = document.documentElement.clientWidth;				 		
        width = $('#scroll-wrap').width();
        $('#scroll-wrap').find('ul').width(width);
        $("#scroll-box").width(width*2);
      }
      window.onresize=function(){
        viewResize()
      }

      banScroll();
      function banScroll(){      

        $("#imgfirst").load(function(){
            var iNow = 0;
            var iNow2 = 0;
            var aUl = $('#scroll-wrap').find('ul');
            var clickState = true;
            width = $('#scroll-wrap').width();
            $('#scroll-wrap').find('ul').width(width);
            $("#scroll-box").width(width*2);
            var timer = setInterval(toRun,4000);
            var Timer2 = null;
            $('.btn').on('click',function(){  
              clearInterval(Timer2); 
              clearInterval(timer);           
              if(clickState){
                clickState = false;
                $('.icons .btn').removeClass('active');
                $(this).addClass('active');
                var index = $(this).index();
                $("#scroll-box").animate({
                  left:-index*width+'px'
                },1000,function(){
                  clickState = true;
                  var i = 0;
                  Timer2 = setInterval(function(){
                    i++;
                    if(i>4){
                      iNow = index;
                      iNow2 = index;
                      timer = setInterval(toRun,4000);
                      clearInterval(Timer2);
                    }

                  },1000)
                })
              }
            })           
            
            function toRun(){
              if(iNow == aUl.length-1){
                $(aUl[0]).css({"position":"relative","left":aUl.length*width+'px'});            
                iNow = 0;
				 		  }else{
				 		  	iNow++;
				 	  	}
              iNow2++;
              $('.icons .btn').removeClass('active');
              $('.icons').find('.btn').eq(iNow).addClass('active');
              $("#scroll-box").animate({
                left:-iNow2*width+'px'
              },1000,function(){
                if(iNow == 0){
                    $(aUl[0]).css({"position":"static"});
                    $('#scroll-box').css({"left":0+'px'})
                    iNow2 = 0;
                }
              })              
            }
        })        
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../assets/css/font2/font.css';
@import '../assets/css/base.scss';
@import '../assets/css/sign_check.scss';
@import '../assets/css/animate.min.css';


</style>

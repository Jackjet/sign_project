exports.install = function (Vue, options) { 
  
  //
  
  var localHost = window.location.host;

  /*开发环境*/
  const apiPath = "/api/";
  Vue.prototype.apiPath = "/api/";

  

  /*线上环境*/
   //const apiPath = localHost+'/';
   //Vue.prototype.apiPath = 'http://'+localHost+'/';


  //Vue.prototype.url = localHost;

  Vue.prototype.httpGet=function(url,data,success,fail){

      /*开发*/
      this.$http.get(apiPath+url+"?data="+new Date().getTime(),

      /*线上*/
      //this.$http.get(url+"?data="+new Date().getTime(),
     	{
     		params:data,
     		headers: {'X-Requested-With':'XMLHttpRequest'}
     	}).then(success).catch(fail)
  };

  Vue.prototype.alertCommonTip=function(msg){
      if(msg == "login.timeout"){
        msg = "用户登录已过期";
      }
      if(msg == "permission.error"){
          msg = "没有权限操作";
      }
      if(msg == "param.error"){
          msg = "提交的参数错误，无法进行操作";
      }
      if(msg == "not.allow"){
         msg = "不允许操作";
      }
      this.showAlertData = {
          showAlert:true,
          context:msg
      }
  };

  /*
   * 获取当前时间和一个月
  */
  Vue.prototype.getDataFn = function(){
    var nowdate = new Date();
    var Y = nowdate.getFullYear();
    var M = (nowdate.getMonth()+1) < 10 ? "0"+ (nowdate.getMonth()+1) : (nowdate.getMonth()+1);
    var D = nowdate.getDate();
    var currentdate = Y+'-'+M+'-'+D;

    nowdate.setMonth(nowdate.getMonth()-1);
    var y = nowdate.getFullYear();
    var m = (nowdate.getMonth()+1) < 10 ? "0"+ (nowdate.getMonth()+1) : (nowdate.getMonth()+1);
    var d = nowdate.getDate();
    var formatwdate = y+'-'+m+'-'+d;        
    /*this.statisticsParms.startTime = formatwdate;
    this.statisticsParms.endTime = nowData;*/
    return {
        "formatwdate":formatwdate,
        "currentdate":currentdate
    }
  }


 
}

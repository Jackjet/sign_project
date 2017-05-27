exports.install = function (Vue, options) {
  
  
  //
  /*开发环境*/
  var localHost = 'http://192.168.22.237:8080';
  const apiPath = "/api/";
  Vue.prototype.apiPath = "/api/";

  /*线上环境*/
  /*var localHost = window.location.host;
  const apiPath = localHost;
  Vue.prototype.apiPath = localHost;*/

  Vue.prototype.httpGet=function(url,data,success,fail){
     this.$http.get(apiPath + url,
     	{
     		params:data,
     		headers: {'X-Requested-With':'XMLHttpRequest'}
     	}).then(success).catch(fail)
  };

  Vue.prototype.httpPost=function(url,data,success,fail){
     this.$http.post(apiPath + url,
      {
        params:data,
        headers: {'X-Requested-With':'XMLHttpRequest'}
      }).then(success).catch(fail)
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

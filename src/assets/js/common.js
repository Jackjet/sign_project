exports.install = function (Vue, options) {

  const apiPath = "/api";
 // const apiPath = "http://192.168.22.237:8080"
  Vue.prototype.httpGet=function(url,data,success,fail){
  	console.log(apiPath + url)
     this.$http.get(apiPath + url,
     	{
     		params:data,
     		headers: {'X-Requested-With':'XMLHttpRequest'}
     	}).then(success).catch(fail)
  }
 
}

<template>
	<div class="right_col">
		
	<!--mCustomScrollbar-->
		<div class="content" id="content-1" style="height:100px;background:black;color:#fff">
			<p>{{msg}}</p>
		</div>
		<a href="javascript:;" @click="change">点击我哦</a>
		
		<alertModel title="删除归档文件夹" context="确认删除归档文件夹？"  :showState="showState"  v-show="showState"  		@cancelHandle="showState = false" @sureHandle="sureDele">
		</alertModel>
		
	    <alertModel title="删除归档文件夹3" context="确认删除归档文件夹3？"  :showState="showState2"  v-show="showState2"  		@cancelHandle="showState2 = false" @sureHandle="sureDele2">
			<ul slot="alert-content">
				<li v-for="item in list">{{item}}</li>
			</ul>
		</alertModel>
	  
	</div>
	
	
</template>

<script>
export default {
	name: 'hello',
	data () {
		return {
		    showState:false,
		    showState2:false,
			currentPage:1,
		    addFile:{
				fileList:[],
				total:10,
				params:{
					pageIndex:1,
					pageLength:5
				}
			},
			fileList:[],
			fileList2:[],
			selectFileList:[],
		    list:["g","d","c","a"],
		    msg: 'Welcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js AppWelcome to Your Vue.js'
		}
	},
	/*watch:{
		fileList:{
			handler(curVal,oldVal){
　　　　　　　　conosle.log(curVal,oldVal)
　　　　　　},
　　　　　　deep:true
		}
	},*/
	methods:{
		addFileHandle(){
			var _this = this;
			this.$http.get('/api/test.json').then(function(res){
				//console.log(res);
					if(_this.currentPage == 1){
							_this.fileList = res.data[0].list;
					}
					if(_this.currentPage == 2){
							_this.fileList = res.data[1].list;
					}					
					
					//console.log(_this.fileList)
					for(var i = 0 ; i<_this.fileList.length;i++){
						for(var j=0;j<_this.selectFileList.length;j++){
							if(_this.selectFileList[j].docName == _this.fileList[i].docName){
								_this.fileList[i].selectItem = true;
							}
						}
					}
					//_this.selectFileList = _this.fileList;
			}).catch(function(err){		
				alert(err)
			})	
			
		},		
		selectFileHandle(item2){		
			//this.fileList[index]['selectItem'] = !this.fileList[index]['selectItem'];

			var state2 = item2.selectItem;	       
	       if(state2){	            
	       		//console.log(this.selectFileList)
	            /*this.removeArr(this.selectFileList,item2);*/
	            
	            for(var i = 0 ; i < this.selectFileList.length;i++){
	            	if(item2.docName == this.selectFileList[i].docName){
	            		this.selectFileList.splice(i,1);
	            	}
	            }
	            item2.selectItem = false;
	        }else{
	            this.selectFileList.unshift(item2);
	            item2.selectItem = true;
	        } 
		},
		pageHandelAlert(currentNum){
			this.addFile.params.pageIndex = currentNum;
			this.currentPage = currentNum;
			this.addFileHandle();
		},
		sureDele(){
			console.log("点击了确定删除文件夹")
			this.showState=false;
		},
		sureDele2(){
			console.log("点击了确定删除文件夹3")
			this.showState2=false;
		},
		change(){
				this.msg = "可以把这段代码放在文档的底部来缩短加载网页内容的时间。这里使用了 Google 的 CDN 加速服务来加载 jQuery 和 jQuery UI，当然你也可以把这两个库上传到自己的服务器上。另外注意下 jQuery UI 这个插件被作者精简了，只包含这个插件必须的模块，大小也只有 43KB如果当你在使用类似 Google 或者 Sina 的常用 Javascript 库的加速服务的话，更推荐采用下面的这种 fallback 的写法，如果 CDN 的 JavaScript 代码没有加载成功，就会引用本地的库，而不会导致插件无法使用可以把这段代码放在文档的底部来缩短加载网页内容的时间。这里使用了 Google 的 CDN 加速服务来加载 jQuery 和 jQuery UI，当然你也可以把这两个库上传到自己的服务器上。另外注意下 jQuery UI 这个插件被作者精简了，只包含这个插件必须的模块，大小也只有 43KB如果当你在使用类似 Google 或者 Sina 的常用 Javascript 库的加速服务的话，更推荐采用下面的这种 fallback 的写法，如果 CDN 的 JavaScript 代码没有加载成功，就会引用本地的库，而不会导致插件无法使用可以把这段代码放在文档的底部来缩短加载网页内容的时间。这里使用了 Google 的 CDN 加速服务来加载 jQuery 和 jQuery UI，当然你也可以把这两个库上传到自己的服务器上。另外注意下 jQuery UI 这个插件被作者精简了，只包含这个插件必须的模块，大小也只有 43KB如果当你在使用类似 Google 或者 Sina 的常用 Javascript 库的加速服务的话，更推荐采用下面的这种 fallback 的写法，如果 CDN 的 JavaScript 代码没有加载成功，就会引用本地的库，而不会导致插件无法使用可以把这段代码放在文档的底部来缩短加载网页内容的时间。这里使用了 Google 的 CDN 加速服务来加载 jQuery 和 jQuery UI，当然你也可以把这两个库上传到自己的服务器上。另外注意下 jQuery UI 这个插件被作者精简了，只包含这个插件必须的模块，大小也只有 43KB如果当你在使用类似 Google 或者 Sina 的常用 Javascript 库的加速服务的话，更推荐采用下面的这种 fallback 的写法，如果 CDN 的 JavaScript 代码没有加载成功，就会引用本地的库，而不会导致插件无法使用可以把这段代码放在文档的底部来缩短加载网页内容的时间。这里使用了 Google 的 CDN 加速服务来加载 jQuery 和 jQuery UI，当然你也可以把这两个库上传到自己的服务器上。另外注意下 jQuery UI 这个插件被作者精简了，只包含这个插件必须的模块，大小也只有 43KB如果当你在使用类似 Google 或者 Sina 的常用 Javascript 库的加速服务的话，更推荐采用下面的这种 fallback 的写法，如果 CDN 的 JavaScript 代码没有加载成功，就会引用本地的库，而不会导致插件无法使用";
				$("#content-1").mCustomScrollbar({
					theme:"minimal"
				});
		}
	},
	mounted(){
		this.addFileHandle();
	}
}
</script>
<style scoped lang="scss">

@import '../assets/css/base.scss';
@import '../assets/css/sign_check.scss';
@import '../assets/css/jquery.mCustomScrollbar.min.css';
  
</style>

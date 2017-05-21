<template>
	<div class="cover-box">
		<div class="alert-model">
			<div class="alert-header">
				<h3>{{title}} <i class="icon-close" @click="cancelHandle"></i></h3>
			</div>
			<div class="alert-body">
				<slot name="alert-content">
					<h3>{{context}}</h3>
				</slot>
			</div>
			<div class="alert-footer">
				<slot name="alert-footer">
					<div>
						<a href="javascript:;" class="cancel-btn"  @click="cancelHandle">取消</a>
						<a href="javascript:;" class="sure-btn" @click="sureHandle">确定</a>
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>

<script>
import propsync from '../../propsync.js';
export default {
  name: 'alert-box',
  /*mixins: [propsync],*/
  props: {
		title: {			// 数据总条数
			type: String,
			default: "模态框"
		},
		context:{
			type:String,
			default:"这里是提醒文字"
		},
		showState:{
			type:Boolean,
			default:false
		}
	},
	data() {
		return {
		}
	},
	methods: {
		cancelHandle(){
			/*console.log("点击了取消")
			this.p_showState = false;*/
			this.$emit("cancelHandle")
		},
		sureHandle(){
			this.$emit("sureHandle")
		}
	}
}
</script>
<style scoped lang="scss">
 @import '../../../assets/css/font2/font.css';
 a{text-decoration:none;}
.cover-box{
	width:100%;
	height:100%;
	position:fixed;
	top:0;
	left:0;
	background:rgba(0,0,0,0.8);
	.alert-model{
		width:398px;
		position:absolute;
		top:50%;
		left:50%;
		transform:translate(-50%,-50%);
		background:#fff;
		border-radius:12px;
		padding:0 0 20px;
		.alert-header{
			height:45px;
			line-height:45px;
			padding:0;
			h3{
				font-size:16px;
				color:#4B4B4B;
				position:relative;
				border-bottom:1px #dedede solid;
				padding:0 20px;
				i{
					width:45px;
					height:45px;
					text-align:right;
					font-size:30px;
					color:#4B4B4B;
					position:absolute;
					right:0px;
					top:0;
				}
			}
			
		}
		.alert-body{
			padding:30px 20px;
			min-height:20px;
			text-align:center;
		}
		.alert-footer{
			padding:10px 50px;
			a{
				height:40px;
				line-height:40px;
				text-align:center;
				border:1px #e6e6e6 solid;
				border-radius:4px;
				display:block;
				width:40%;
				margin:2.5%;
				float:left;
				&.cancel-btn{
					background:#e6e6e6;
					color:#4b4b4b;
				}
				&.sure-btn{
					background:#ff503f;
					color:#fff;
					border:1px #ff503f solid;
					float:right;
				}
			}
		}
	}
}
</style>

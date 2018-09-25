<template>
    <div class="preview" id="preview">
        <div class="close-icon icon-close-normal" @click="closeHandle"></div>
        <div class="clearfix signMidFix">
            <div id="tableBox" class="tableBox clf">
                <div class="signFile " valign="top">
                    <div id="pdf_mid_inner" class="signMiddleInner left sign_page_scroll">
                        <div class="s-content" ><div class="page_style" style="margin:0 auto;">
                            <img id="defDocImg" width="100%"  src="../../../assets/images/ui2.0/loading.gif"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-num">
            <a href="javascript:;" @click="jumpPageNum(1)">首页</a>
            <div><input type="text" id="jump" value="1"><span>/ &nbsp;{{pdf_page_num}}</span></div>
            <a href="javascript:;" @click="jumpPageNum(pdf_page_num)">尾页</a>
        </div>
    </div>
</template>
<script>
    import loadingImg from '@/assets/images/ui2.0/loading.gif';
    export default{
        data(){
            return{
                loadingImg:loadingImg,
                pdf_page_num:0,
                PDFI:5,
                page_def_w:null,    //pdf图片宽度
                page_def_h:null,    //pdf图片高度
                pageHeight:null,    //一页的高度
                SignAreaWidth:null,  //pdf区域宽度
                PDFH:null,
                PDFW:null,
                CONH:null,                
                WH_SCALE:null,
                pageArr:[],
                timerPdf:null,
                docId:null,

            }
        },
        // props:{
        //     docId:{
        //         type:String,
        //         default:0
        //     }
        // },
        methods:{
            closeHandle(){
                this.$emit('closePreview');  
                     
            },
            getPdf(){
                this.httpGet(this.URL.getPdfPageNum,{
                    'docId':this.docId,
                },(response)=>{
                    let data = response.data;
                    if(data.substr(0, 6) == 'error_'){
                            let tipText;
                            if(data == 'error_not_decry') {
                                tipText = "文档已被加密，请联系客服还原";
                            }else if(data == 'error_not_found'){
                                tipText = "文档已被删除";
                            }else if(data == 'error_unknown'){
                                tipText = "未知错误，请联系客服处理";
                            }else if(data == 'error_not_login'){
                                tipText = "登录已超时，请重新登录";
                            }else{
                                tipText = "文档内含错误，请联系客服还原";
                            }
                            tipTxt = tipText;
                            this.alertCommonTip(tipText)                            
                            return;
                        }
                        let data_array = data.split(",");
                        this.pdf_page_num = parseInt(data_array[0]);
                        this.page_def_h = parseInt(data_array[1]);
                        this.page_def_w = parseInt(data_array[2]);
                        $("#pdf_mid_inner").empty();
                        for (var int = 0; int < this.pdf_page_num; int++) {
                                if (int != 0){
                                    $("#pdf_mid_inner").append('<div style="height:5px"></div>');
                                }
                                var pageDiv = $('<div class="s-content" ><div class="page_style"><img class="pdf_page_content" id="pdf_page_'+ int +'" pageindex='+ int +' src='+loadingImg+'></img></div></div>');
                                $("#pdf_mid_inner").append(pageDiv);
                            }
                        this.fitAtomSize();
                        this.pageHeight = $("#pdf_page_0").height()+5;
                        /*+++++滚动页面变化*/
                        $("#pdf_mid_inner").scroll((e)=>{
                            $("#jump").val(Math.floor(e.target.scrollTop/this.pageHeight)+1)
                        })
                        $("#pdf_page_0").attr('src', this.apiPath+"doc/document/getPdfImgByPage?pageNum=0&docId="+this.docId);
                })
            },
            fitAtomSize(){
                this.SignAreaWidth = $(window).width()-520;
                if (this.SignAreaWidth <= 350){
                    return;
                }
                $('#tableBox').css('width',$(window).width()+'px');  //设置table宽度
                $('#tableBox .signFile').css("width",this.SignAreaWidth+'px'); //设置pdf显示区域宽度
                this.PDFW = this.SignAreaWidth;

                // _RESIZE_SCALE = page_def_w / _PDFW;
                this.WH_SCALE = this.page_def_h / this.page_def_w;
                this.PDFH = this.PDFW * this.WH_SCALE;
                this.CONH = this.PDFH + 40;

                $(".pdf_page_content").width(this.PDFW).height(this.PDFH);
                $(".page_style").css({
                    height:this.PDFH+'px'
                });

                $("#pdf_mid_inner").scrollTop($("#pdf_mid_inner").scrollTop()+1);
            },
            fixHeight() {
                $("#pdf_preview").height($(window).height()-108);//head50+页数标题38+padding20
                $("#pdf_mid_inner").height($(window).height()-50);
            },
            jumpPageNum(count){
                $("#pdf_mid_inner").animate({scrollTop: (count-1) * this.PDFH +  + (count-1) * this.PDFI},100);
            },
            init(){
                //窗口滚动事件，动态加载pdf页面
                var This = this;
                var lastScoll = 0;
                  
                $("#pdf_mid_inner").scroll(function () {
                    var scrollTop = $(this).scrollTop() + 1;//scroll会取整，+1调整偏差
                        
                    var show_page = parseInt((scrollTop)/(This.PDFI+This.PDFH));
                  
                    if (lastScoll > scrollTop) {
                        show_page --;
                        show_page = show_page < 0 ? 0 : show_page;
                    }
                    lastScoll = scrollTop;
                    var show_num = show_page + 1;
                    if (show_num <= This.pdf_page_num) {
                        scroll_page(show_num); //下一张
                        scroll_page(show_page); //本张
                    }
                    $('.close_button').remove();
                });


                var dumpCount = 0;
                function scroll_page(show_num){
                   
                    var pdf_page = $("#pdf_page_"+show_num);
                    if(pdf_page.attr("src") && pdf_page.attr("src").indexOf('loading') == -1){
                        return;
                    }else{
                        /*This.timerPdf = function () {
                            if (dumpCount > 5){
                                console.info('waiting');
                                setInterval(This.timerPdf, 1000);
                                return
                            }
                            dumpCount++;
                            pdf_page.attr('src', This.apiPath + "doc/document/getPdfImgByPage?pageNum="+ show_num + "&docId="+This.docId);
                            pdf_page.load(function(){
                                dumpCount--;
                            });
                           
                        };*/
                        pdf_page.attr('src', This.apiPath + "doc/document/getPdfImgByPage?pageNum="+ show_num + "&docId="+This.docId);
                        setInterval(This.timerPdf, 1000);
                    }
                }

                $('#jump').bind('keypress',function(event){
                    if(event.keyCode == "13")
                    {
                        This.jumpPageNum($('#jump').val())
                    }
                });
            }
            
        },
        
        mounted(){    
            let This = this;        
            this.fixHeight();
            $(window).resize(this.fixHeight);
            this.init();
            this.fitAtomSize();
            window.onresize = this.fitAtomSize;
            this.Event2.$on('getpdf',function(num,docId){
                This.docId = docId;
                if(num == 0){
                    $("#pdf_mid_inner").html('<div class="s-content" ><div class="page_style" style="margin:0 auto;">'+
                        '<img id="defDocImg" width="100%"  src="'+loadingImg+'"/></div>'+
                    '</div>')
                    this.getPdf();
                    
                }
            }.bind(this));
        }
    }
</script>
<style lang="scss" scoped>
.signMiddleInner {
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    width: 100%;
    z-index: 100;
}
.signFile {
    margin: 0 auto;
}
.sign_page_scroll::-webkit-scrollbar-track
{
    -webkit-box-shadow: inset 0 0 0px #F3F3F3;
    border-radius: 0px;
    background-color: #F3F3F3;
}
.sign_page_scroll::-webkit-scrollbar
{
    width: 5px;
    background-color: #8C8D90;
}

.sign_page_scroll::-webkit-scrollbar-thumb
{
    border-radius: 100px;
    -webkit-box-shadow: inset 0 0 5px #8C8D90;
    background-color: #8C8D90;
}
#preview{
    width:100%;
    height:100%;
    position: fixed;
    top:0;
    left:0;
    background: rgba(0,0,0,0.8);
    z-index:1000;
    display: block;
    padding-top:50px;
    
}
#preview #titleName{
    color: #fff;
    font-size: 22px;
    line-height: 50px;
    height: 50px;
    text-align: center;
}
#preview .close-icon{
    position: fixed;
    top:10px;
    right: 10px;
    color: #fff;
    font-size: 20px;
    /*border: 2px rgba(255,255,255,0.5) solid;*/
    border-radius: 100%;
    width: 40px;
    height: 40px;
    line-height: 36px;
    text-align: center;
}
#preview .icon-close:before {
    content: '\e817';
    font-size: 38px;
    margin-left: 0px;
    color: rgba(255,255,255,0.5);
}
#preview .page-num{
    position: fixed;
    bottom:10px;
    left:50%;
    -webkit-transform: translatex(-50%);
    -moz-transform: translatex(-50%);
    -ms-transform: translatex(-50%);
    -o-transform: translatex(-50%);
    transform: translatex(-50%);
}
#preview .page-num a{
    width:50px;
    height:35px;
    -webkit-border-radius:6px;
    -moz-border-radius:6px;
    -ms-border-radius:6px;
    border-radius:6px;
    border:2px rgba(255,255,255,0.5) solid;
    float: left;
    background: rgba(0,0,0,0.5);
    color: #fff;
    text-align: center;
    line-height:32px;
    margin-right:10px;
}
#preview .page-num div{
    height:35px;
    line-height:30px;
    background: rgba(0,0,0,0.5);
    -webkit-border-radius:6px;
    -moz-border-radius:6px;
    -ms-border-radius:6px;
    border-radius:6px;
    border:2px rgba(255,255,255,0.5) solid;
    float: left;
    margin-right:10px;
    color: #fff;
    padding-right:10px;
}
#preview .page-num div span{
    width:auto !important;
    padding-right:5px;
    font-size:12px;
}
#preview .page-num div input{
    width:40px;
    text-align: center;
    height:30px;
    line-height:30px;
    background: none;
    border:none;
    border:0;
    color: #fff;
    font-size:20px;
    outline:none !important;
    appearance:none;
    float: left;
}
#preview .page-num div span{
    float: left;
    margin-top:3px;
    padding-left:5px;
    width:30px;
}
#preview .page-num div input:focus{
    ã€€ã€€border:none;
    outline: inherit;
    border-color: transparent;
    /*background-color:yellow;*/
}

#defDocImg{
    width:100%;
    height:100%;
}
// #pdf_mid_inner .s-content{
//     margin-bottom: 5px !important;
// }
</style>

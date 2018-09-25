<template>
    <div class="preview" id="preview">
        <div class="close-icon icon-close-normal"></div>
        <div class="clearfix signMidFix">
            <div id="tableBox" class="tableBox clf">
                <div class="signFile " valign="top">
                    <div id="pdf_mid_inner" class="signMiddleInner left sign_page_scroll" >
                        <div style="height:15px"></div>
                        <div class="s-content" ><div class="page_style" style="margin:0 auto;">
                            <img id="defDocImg" width="1010" height="1430.41" src="../../../assets/images/ui2.0/loading.gif"/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-num">
            <a href="javascript:;" onclick="jumpPageNum(1)">首页</a>
            <div><input type="text" id="jump" value="1"><span></span></div>
            <a href="javascript:;" onclick="lastPage()">尾页</a>
        </div>
    </div>
</template>
<script>
    import loadingImg from '@/assets/images/ui2.0/loading.gif';
    export default{
        data(){
            return{
                loadingImg:loadingImg
            }
        },
        props:{
            docId:{
                type:String,
                default:0
            }
        },
        mounted(){
            var This = this;
            var pdf_page_num = 0;
            var page_def_h;
            var page_def_w;
            var pageHeight;
            var pdf_btn_sign_count = 0;
            var _DRAGH, _DRAGW, _RESIZE_SCALE;//印章缩放比例
            var SignAreaWidth;   //pdf区域宽度
            var _PDFH, _PDFW, _CONH;
            var _PDFI =  5;
            var _WH_SCALE = null;
            getPdf();
            function resizeWindow() {
                if (window.screen) {
                    var myw = screen.availWidth;
                    var myh = screen.availHeight;
                    window.moveTo(0, 0);
                    window.resizeTo(myw, myh);
                }
            }
            function parseObj(strData){//转换对象
                return (new Function( "return " + strData ))();
            };
            function closeBrowser(){
                $("#preview").hide();
            }

            fixHeight();
            $(window).resize(fixHeight);
            function fixHeight() {
                $("#pdf_preview").height($(window).height()-108);//head50+页数标题38+padding20
                $("#pdf_mid_inner").height($(window).height()-50);
            }

            $("#pdf_sign_pic").bind('dragstart', function(){return false;})

            
            $(function($){
                fitAtomSize();
                $('#jump').bind('keypress',function(event){
                    if(event.keyCode == "13")
                    {
                        jumpPageNum($('#jump').val())
                    }
                });
            });

            $("#preview .close-icon").on('click',function(){
                closeBrowser();
            })
            function getPdf(){
                $.ajax({
                    type:"GET",
                    scriptCharset:"utf-8",
                    url:This.apiPath+This.URL.getPdfPageNum,
                    data:{'docId':This.docId},
                    cache: false,
                    success:function(data){
                        if(data.substr(0, 6) == 'error_'){
                            var tipText;
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
                            //$("#alterBox_h").modal("show").find('#alterBoxTitle_h').text(tipText);
                           /* $("#alterBox_h .btn-primary").unbind().click(function () {
                                closeBrowser();
                            });*/
                            tipTxt = tipText;
                            This.alertCommonTip(tipText)
                            
                            return;
                        }
                        var data_array = data.split(",");
                        $("#jump").siblings('span').html("/&nbsp;"+data_array[0])      /*+++++++++++++++++*/
                        pdf_page_num = parseInt(data_array[0]);
                        page_def_h = parseInt(data_array[1]);
                        page_def_w = parseInt(data_array[2]);
                        $("#totalTips").html("共"+pdf_page_num+"页");
                        $("#pdf_mid_inner").empty();
                        for (var int = 0; int < pdf_page_num; int++) {
                            for (var int = 0; int < pdf_page_num; int++) {
                                if (int != 0){
                                    $("#pdf_mid_inner").append('<div style="height:5px"></div>');
                                }
                                var pageDiv = $('<div class="s-content" ><div class="page_style"><img class="pdf_page_content" id="pdf_page_'+ int +'" pageindex='+ int +' src='+loadingImg+'></img></div></div>');
                                $("#pdf_mid_inner").append(pageDiv);
                            }
                        }
                        fitAtomSize();
                        pageHeight = $("#pdf_page_0").height()+5;
                        /*+++++滚动页面变化*/
                        $("#pdf_mid_inner").scroll(function (e) {
                            $("#jump").val(Math.floor(e.target.scrollTop/pageHeight)+1)
                        })
                        $("#pdf_page_0").attr('src', This.apiPath + "/doc/document/getPdfImgByPage?pageNum=0&docId="+This.docId);
                    },
                    error:function(data) {
                        var tipText = "服务器异常，请稍候重试";
                       This.alertCommonTip(tipText)
                        setAlertFunc(function () {
                            window.location.href = path + "/doc/documentList/sign?signStatus=201";
                        })
                        return;
                    }
                });
            }

            

            window.onresize = fitAtomSize;
            function fitAtomSize(){
                SignAreaWidth = $(window).width()-520;
                // SignAreaWidth = $(window).width()*0.6;
                if (SignAreaWidth <= 350){
                    return;
                }
                $('#tableBox').css('width',$(window).width()+'px');  //设置table宽度
                $('#tableBox .signFile').css("width",SignAreaWidth+'px'); //设置pdf显示区域宽度
                _PDFW = SignAreaWidth;

                _RESIZE_SCALE = page_def_w / _PDFW;
                _WH_SCALE = page_def_h / page_def_w;
                _PDFH = _PDFW * _WH_SCALE;
                _CONH = _PDFH + 40;

                $(".pdf_page_content").width(_PDFW).height(_PDFH);
                $(".page_style").css({
                    height:_PDFH+'px'
                });

                $("#pdf_mid_inner").scrollTop($("#pdf_mid_inner").scrollTop()+1);
            }
            /*尾页*/
            function lastPage() {
                jumpPageNum(pdf_page_num)
            }
            function jumpPage(obj, count){
                $("#pdf_mid_inner").animate({scrollTop: (count-1) * _PDFH +  + (count-1) * _PDFI},100);
                $('.previewImg').removeClass('previewImgActive');
                $(obj).parent().addClass('previewImgActive');
            }
            function jumpPageNum(count){
                $("#pdf_mid_inner").animate({scrollTop: (count-1) * _PDFH +  + (count-1) * _PDFI},100);
            }
            /*
            * 窗口滚动事件，动态加载pdf页面
            */
            var lastScoll = 0;
            $("#pdf_mid_inner").scroll(function () {
                var scrollTop = $(this).scrollTop() + 1;//scroll会取整，+1调整偏差

                var show_page = parseInt((scrollTop)/(_PDFI+_PDFH));
                if (lastScoll > scrollTop) {
                    show_page --;
                    show_page = show_page < 0 ? 0 : show_page;
                }
                lastScoll = scrollTop;
                var show_num = show_page + 1;
                if (show_num <= pdf_page_num) {
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
                    var inner = function () {
                        if (dumpCount > 5){
                            console.info('waiting');
                            setInterval(inner, 1000);
                            return
                        }
                        dumpCount++;
                        pdf_page.attr('src', This.apiPath + "doc/document/getPdfImgByPage?pageNum="+ show_num + "&docId="+This.docId);
                        pdf_page.load(function(){
                            dumpCount--;
                        });
                    };
                    setInterval(inner, 1000);
                }
            }
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
    z-index:100;
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
    border:none;
    outline: inherit;
    border-color: transparent;
    /*background-color:yellow;*/
}

#defDocImg{
    width:100%;
    height:100%;
}
</style>

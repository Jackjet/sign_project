<template>
    <div class="panel-box"  v-cloak>
        <slot name="panel-header">
            <h3 class="title" v-if="tableTitleState">{{tableTitle}}</h3>
        </slot>
        <div class="table" :class="[tableClass]">
            <div class="loadSource" :class="[cloudyState ? 'loadSource_c':'']" v-show="tableLoading">
                <p v-if="!cloudyState"><img src="../../../assets/images/loading.gif" alt="" width="80" height="51"></p>
                <p v-if="cloudyState"><img src="../../../assets/images/logo_small.png" alt="" width="48" height="48"></p>
            </div>
            <slot name="panel-content"></slot>
            <div class="no-message" v-show="total == 0  && !tableLoading">
                <p><img src="../../../assets/images/noAnyThing.png" alt="" ></p>
                <p v-text="'暂无数据'"></p>
            </div> 
            <div class="pageNumber" v-show="pageNumberState && total>1">
                <span>共{{total}}条记录/当前页为第{{currentpage}}页</span>
                <div class="page-box">
                    <pagination  :total="total" :currentpage="currentpageIndex" :display="display"  @pagechange="pageChangeHandel"></pagination>
                </div>
            </div> 
        </div>
    </div>
</template>
<script>
    export default{
        name:"table",
        data(){
            return{
                currentpageIndex:this.currentpage
            }
        },
        props:{
            tableTitle:{   //table标题
                type:String,
                default:'列表标题'
            },
            tableTitleState:{    //table标题状态默认为true   true 显示 false 隐藏  
                type:Boolean,
                default:true
            },
            tableClass:{    //给table添加样式
                type:String,
                default:''
            },
            tableLoading:{   //table数据加载状态
                type:Boolean,
                default:false
            },
            tableListData:{  //table列表数据
                type:Array,
                default:function () {
                    return []
                }
            },
            total:{          //table翻页的总页数
                type:Number,
                default:1
            },
            currentpage:{    //table翻页的当前页数
                type:Number,
                default:1
            },
            display:{        //table翻页的每页条数
                type:Number,
                default:1
            },
            pageNumberState:{  //table翻页是否显示  
                type:Boolean,
                default:true
            }
        },
        methods:{
            pageChangeHandel(val){
                this.currentpageIndex = val;
                this.$emit('pagechange',val)
            }
        }
    }
</script>
<style scoped  lang="scss">

$gray: #757575;
$gray2: #ebecf2;
$black:#4b4b4b;
$white:#fff;
$pink:#FF503F;
$pink_opa:rgba(255,80,63,0.7);
$gray3:#f6f6f6;
$border:#e6e7ed;
.panel-box{
    background: #fff;
    position: relative;
    .title{
      color: #4b4b4b;
      height: 55px;
      line-height: 55px;
      border-bottom:1px #e6e7ed solid;
      position:relative;
      font-weight: normal;
      text-indent: 0;
      padding-left: 2%;
      border-left: 4px #fff solid;
    }
    .table{
        li{
            border-left: 4px #fff solid;
            box-sizing:border-box;
            -moz-box-sizing:border-box; /* Firefox */
            -webkit-box-sizing:border-box; /* Safari */
            height: 55px;
            line-height: 55px;
            border-bottom: 1px $border solid;
            clear: both;
            &:last-child{
                border-bottom: none;
            }
            &:hover{
                border-left: 4px #FF503F solid;
            }
            &.title{
                background:#f6f8fc;
                height: 45px;
                line-height: 45px;
                padding: 0;
                width: 100%;
                font-weight: normal;
                border-left: 4px #f6f8fc solid;
                span{
                    color: #a3a3a3;
                    height: 45px;
                }
            }        
            span{
                width: 49%;
                float: left;
                padding-left:2%;
                height: 55px;
                color: #4b4b4b;
                word-break:keep-all;/* 不换行 */
                white-space:nowrap;/* 不换行 */
                overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                text-overflow:ellipsis;
                &:nth-child(1){
                    b{
                        margin-right: 10px;
                        margin-left: 20px;
                        font-size: 18px;
                    }
                    .hideIcon{
                        opacity: 0;
                        margin-left: -22px; 
                    }
                }
                
            }
            
            a{
                display: inline-block;
                margin: 0 5px;
                padding: 2px 5px;
                border:1px $border solid;
                border-radius:4px;
                height: 18px;
                line-height: 18px;
                color: #4397D7;
            }
            .more{
                border: 0;
                float: right;
                line-height: 55px;
                margin-right: 2.5%;
                font-weight: normal;
            }
        }
        .pageNumber{
            width: 100%;
            height: 55px;
            margin: 0 auto;
            line-height: 55px;
            border-bottom:1px #e6e7ed solid;
            border-top:1px #e6e7ed solid;
            position:relative;
            span{
                padding-left: 20px;
                color: #a3a3a3;
            }
        }
        .no-message{
            height: auto;
            p{
                font-size: 14px;
                line-height: 25px;
            }
        }
      .li-class{
        cursor: pointer;
      }
    }
    .table-four{
        li{
            span{
                width: 23%;
            }
        }
    }
    .table-five{
        li{
            span{
                width: 18%;
                padding-left: 2%;
            }
        }
    }
    // .table-six{
    //     li{
    //         span{
    //             width: 14.5%;
    //         }
    //     }
    // }
    .table-six{
      li{
        span{
          width:14%;
          padding-left:2%;
          word-break:keep-all;/* 不换行 */
          white-space:nowrap;/* 不换行 */
          overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow:ellipsis;
          &.widthAuto{
            width: auto;
          }
        }
      } 
    }
    .table-eight{
      li{
        span{
          width:10.5%;
          padding-left:2%;
          word-break:keep-all;/* 不换行 */
          white-space:nowrap;/* 不换行 */
          overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow:ellipsis;
          &.widthAuto{
            width: auto;
          }
        }
      } 
    }
    
    .table-elven{
      li{
        span{
          width:7%;
          padding-left:2%;
          word-break:keep-all;/* 不换行 */
          white-space:nowrap;/* 不换行 */
          overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
          text-overflow:ellipsis;
          &.widthAuto{
            width: auto;
          }
        }
      } 
    }
  }
</style>

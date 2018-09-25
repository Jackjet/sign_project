<template>
    <div class="tree">
        <div class="loadSource" v-show="treeLoading">
            <p><img src="../../../assets/images/loading.gif" alt="" width="80" height="51"></p>
        </div>
        <ul id="browser" class="treeview">
             <tree-list :treeListData="treeListData" :treeId="treeId" :showNum="showNum"  :selectAccId="selectAccId" @checkBoxSelect="checkBoxSelectHandle" @selectTreeItem="selectTreeItemHandle" :type="type" :showHandle="showHandle" @editDepartant="editDepartant" @delDepartant="delDepartant" @selectSpanCheckBox="selectSpanCheckBoxHandle" ></tree-list>  
        </ul>
    </div>
</template>

<script>
import Vue from 'vue';
Vue.filter('filterIcon', function (value,length) { //过滤颁发机构
    let statusTxt = '';
    if(value){
        if(value.indexOf('icon-company') != '-1'){
            statusTxt = 'icon-man';
        }else if(value.indexOf('tree-folder-open') != '-1' && length == 0 ){
            statusTxt = 'folderNo';
        }else{
            statusTxt = 'folder';
        }
    }    
    return statusTxt;
});
import '@/assets/css/jquery.treeview.scss';
import { mapGetters } from 'vuex';
Vue.component('tree-list',{
    name:'treelist',
    data(){
        return{
            hoverIndex:null,
            // treeId:null,
        }
    },
    computed:{
        ...mapGetters([
        'userState'
        ])
    },
    props:{
        treeListData:{
            type:Array,
            default:[]
        },
        selectAccId:{
            type:Array,
            default: function () {
                return []
            }
        },
        type:{
            type:String,
            default:'warrant'
        },
        showHandle:{
            type:Boolean,
            default:false
        },
        showNum:{
            type:Boolean,
            default:true
        },
        treeId:{
            type:String,
            default:'0'
        }

    },
    methods:{
        //对内函数        
        selectSpanHandle(event,item){
            let target = event.target;
            let nodeName = target.nodeName;
            let targetSpan = null;
            
            /*if(!target.find('b').hasClass('folderNo')){       //文件夹有子文件夹的时候  
            $('.treeview').find('.folderNoPen').removeClass('folderNoPen').addClass('folderNo');      //没有子文件夹的文件夹合上          
                if(target.find('b').hasClass('folder')){      //合上
                    // target.find('b').removeClass('folder').addClass('folderClose');
                    // target.siblings('ul').hide();                
                    target.addClass('on');
                }else{  //展开
                    // target.find('b').removeClass('folderClose').addClass('folder');
                    // target.siblings('ul').show();
                    // target.removeClass('on');
                }
            }else{  //文件夹没有子文件夹的时候     
                if(target.find('b').hasClass('folderNo')){      //展开
                    $('.treeview').find('.folderNoPen').removeClass('folderNoPen').addClass('folderNo');
                    $('.treeview').find('span').removeClass('on');
                    target.find('b').removeClass('folderNo').addClass('folderNoPen');
                    target.addClass('on');                    
                }
            }  */
            if(nodeName == 'SPAN'){
                targetSpan = $(target)
            }else{
                targetSpan = $(target).parents('span');
            }
            $('.treeview').find('span').removeClass('on');
            $(targetSpan).addClass('on');

            this.$emit("selectTreeItem",item);    
            if(item.children.length == 0 && item.iconCls == 'icon-company'){
                this.$emit("checkBoxSelect",item);
            }
        },
        editDepartantHandle(item,event){
            this.editDepartant(item);
            this.spanSelect(item,event);
        },
        delDepartantHandle(item,event){
            this.delDepartant(item);
            this.spanSelect(item,event);
        },
        selectSpanCheck(item){
            this.selectSpanCheckBoxHandle(item);
        },
        spanSelect(item,event){
            let target = event.target;
            let nodeName = target.nodeName;
            let targetSpan = null;
            if(nodeName == 'SPAN'){
                targetSpan = $(target)
            }else{
                targetSpan = $(target).parents('span');
            }
            $('.treeview').find('span').removeClass('on');
            $(targetSpan).addClass('on');
            this.$emit("selectTreeItem",item);
        },
        hoverHandle(event){
            event.stopPropagation();
            event.preventDefault();
            let target = event.target;
        },
        hoverItem(event,item){
            event.stopPropagation();
            event.preventDefault();            
            let target = event.target;
            let nodeName = target.nodeName;
            let targetSpan = null;
            if(nodeName != 'SPAN'){
                targetSpan = $(target).parents('span');
            }else{
                targetSpan = $(target);
            }
            if(this.treeId == item.id) return;
            if($(targetSpan).hasClass('onactive')){
                    $(targetSpan).removeClass('onactive');
            }else{
                $(targetSpan).addClass('onactive');
            }
            
        },
        //对外函数
        selectTreeItemHandle(val){
            this.$emit("selectTreeItem",val);
        },
        checkBoxSelectHandle(id){
            this.$emit("checkBoxSelect",id)
        },
        editDepartant(item){   //编辑部门
            this.$emit("editDepartant",item)
        },
        delDepartant(item){    //删除部门
            this.$emit("delDepartant",item)
        },
        selectSpanCheckBoxHandle(item){  //添加成员时的组织架构
           this.$emit("selectSpanCheckBox",item);
        }
        
    },
    template:`
        <div>
            <ul v-if="type == 'warrant'">
                <li v-for="(item,index) in treeListData" :key="index" :class="[(treeListData.length-1) === index ? 'lastCollapsable':'']">
                    <span @click="selectSpanHandle($event,item)" :title="item.text"><b :class="item.iconCls | filterIcon(item.children.length)"></b><b v-if="item.children.length == 0 && item.iconCls == 'icon-company'" :class="[item.checked ? 'icon-check2-default' : 'icon-square']"></b>{{item.text}} </span>
                    <tree-list :treeListData="item.children" v-if='item.children' @selectTreeItem="selectTreeItemHandle" @checkBoxSelect="checkBoxSelectHandle" :type="type"></tree-list>
                </li>
            </ul>
            <ul v-if="type == 'organization'">
                <li v-for="(item,index) in treeListData" :key="index" :class="[(treeListData.length-1) === index ? 'lastCollapsable':'']">
                    <span @click="selectSpanHandle($event,item)" :title="(item.userCount || item.userCount == '0') && showNum? item.text+'('+item.userCount+')' : item.text" @mouseover="hoverItem($event,item)" @mouseout="hoverItem($event,item)">
                        <b :class="[item.children.length > 0 ? 'folder' : 'folderNo']"></b>
                        {{item.text}}<i v-if="(item.userCount || item.userCount == '0') && showNum" class="count">({{item.userCount}})</i>
                        <strong v-show="showHandle">
                            <i class="icon-editor" title="编辑" @click.stop="editDepartantHandle(item,$event)"></i>
                            <i class="icon-del" title="删除" @click.stop="delDepartantHandle(item,$event)"></i>                                 
                        </strong> 
                    </span>
                    <tree-list :treeListData="item.children" :treeId="treeId" :showNum="showNum"  v-if='item.children' @selectTreeItem="selectTreeItemHandle" @editDepartant="editDepartant" @delDepartant="delDepartant" :type="type" :showHandle="showHandle"></tree-list>
                </li>
            </ul>
            <ul v-if="type == 'sector'">
                <li v-for="(item,index) in treeListData" :key="index" :class="[(treeListData.length-1) === index ? 'lastCollapsable':'']">
                    <span @click="selectSpanCheck(item)" :title=" item.text" @mouseover="hoverItem($event,item)" @mouseout="hoverItem($event,item)">
                        <b :class="[item.children.length > 0 ? 'folder' : 'folderNo']"></b>
                        <b :class="[item.checked ? 'icon-check2-default' : 'icon-square']"></b>
                        {{item.text}}
                    </span>
                    <tree-list :treeListData="item.children"  v-if='item.children' @selectSpanCheckBox="selectSpanCheckBoxHandle" :type="type"></tree-list>
                </li>
            </ul>
        </div>
    `
});
/*
<ul>
    <li v-for="(item,index) in treeListData" :key="index" :class="[(treeListData.length-1) === index ? 'lastCollapsable':'']">
        <span @click="selectSpanHandle($event,item)"><b :class="[item.children ? 'folder' : 'folderNo']"></b>{{item.text}} </span>
        <tree-list :treeListData="item.children" v-if='item.children' @selectTreeItem="selectTreeItemHandle"></tree-list>
    </li>
</ul>
*/
export default {
    name: 'tree',
    data(){
        return {
            hoverIndex:null,
            treeId:null,
        }
    },
    props:{
        treeListData:{
            type:Array,
            default:[]
        },
        selectAccId:{
            type:Array,
            default: function () {
                return []
            }
        },
        treeLoading:{   //table数据加载状态
            type:Boolean,
            default:false
        },
        type:{
            type:String,
            default:'warrant',    //授权  organization-组织架构
        },
        showHandle:{   //是否显示编辑和删除按钮
            type:Boolean,
            default:false
        },
        showNum:{      //是否显示部门下有几个东西
            type:Boolean,
            default:true
        }
    },
    methods:{
        selectTreeItemHandle(val){
            this.$emit("selectTreeItem",val); 
        },
        checkBoxSelectHandle(id){
            this.$emit("checkBoxSelect",id)
        },
        editDepartant(item){   //编辑部门
            this.$emit("editDepartant",item)
        },
        delDepartant(item){    //删除部门
            this.$emit("delDepartant",item)
        },
        selectSpanCheckBoxHandle(item){  //添加成员时的组织架构
        //  console.log(item)
           this.$emit("selectSpanCheckBox",item);
        }
    },
    mounted(){
        let Timer = setInterval(()=>{
            if(this.treeListData.length > 0){
                let ID = this.treeListData[0].id;
                this.treeId = ID;
                clearInterval(Timer)
            }
        },300);  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>

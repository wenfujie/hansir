<!--
 * @Author: yongtian.hong
 * @Date: 2018-11-19 09:14:03
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-18 11:11:42
 * @Description: 定制清单组件(结算页面专用)
 -->
 
<style lang='scss' scoped>
    $bottomBorder: computed(2) solid #E6E6E6;
    .absolute {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }
    .list-cont{
        /*max-height: 70%;*/
    }
    .com-border-b{
        border-bottom: $bottomBorder;
    }
    .cust-item{
        .cust-item-img{
            width: computed(100);
            height: computed(100);
        }
        .cust-item-name{
            margin-top: computed(15);
            display: inline-block;
            width: computed(100);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
        &:last-child{
            .part-list{
                border: none;
            }
        }
    }
    .part-list{
        border-bottom: $bottomBorder;
        align-items: center;
    }
    .part-item{
        line-height: computed(50);
        align-items: center;
        img{
            width: computed(80);
            height: computed(80);
        }
    }
    .part-name{
        margin-right: computed(20);
        width: computed(110);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
    }
    .main-cont{
        overflow-y: auto;
        max-height: computed(800);
    }
    .part-item-cont{width: 100%;}
</style>
<template>
    <van-actionsheet v-model="show" class="w100 list-cont" position="bottom">
        <div class="flex-vbox pdT30">
            <!-- 标题 -->
            <div class="text-center fs36 pdB30">刺绣详情</div>
            <div class="main-cont pdLr30">
                <!-- 主面料 -->
                <!--<div class="flex-vbox mgB30" v-show="params.mainFabricCode">-->
                    <!--<div class="fs30B">主面料</div>-->
                    <!--<div class="flex-between pdT20 pdB30 fs24" :class="{'com-border-b':true}">-->
                        <!--<div>{{params.mainFabricName}}</div>-->
                        <!--<div v-if="DJTYPE[params.orderPriceType]">￥ {{params.fabricPrice|Fix2}}</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!-- 部件 -->
                <!--<div class="flex-vbox mgB30">-->
                    <!--<div class="fs30B">部件</div>-->
                    <!--<div-->
                            <!--:class="['flex-between', 'pdT20', 'pdB30', 'fs24', 'part-list']"-->
                            <!--v-for="(part,index) in params.partList"-->
                            <!--:key="index"-->
                    <!--&gt;-->
                        <!--<div>{{part.partName}}</div>-->
                        <!--<div v-if="DJTYPE[params.orderPriceType]">￥ {{part.salePrice|Fix2}}</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--新版绣字绣花内容-->
                <ul v-if="embInfo">
                    <li class="flex-vbox mgB30 cust-item" v-for="(item,index) in custList" :key="item.id">
                        <div :class="['flex-between', 'pdT20', 'pdB30', 'fs28', 'part-list']">
                            <div>{{item.label}}</div>
                            <div v-if="!item.isImg">{{item.cont}}</div>
                            <div v-else class="flex-vbox">
                                <img v-lazy="getImg(item.imgUrl)" class="cust-item-img" alt="">
                                <span class="cust-item-name">{{item.cont}}</span>
                            </div>
                        </div>
                    </li>
                </ul>

                <!--<div v-show="embList.length" :class="['flex-vbox', 'mgB30', {'com-border-b':embList.length&&eptList.length}]">-->
                    <!--<div class="fs30B">绣字区域</div>-->
                    <!--<ul>-->
                        <!--<li class="flex-between pdT20 pdB30 fs24 part-item"-->
                            <!--:key="index"-->
                            <!--v-for="(item,index) in embList">-->
                            <!--<div class="flex-between part-item-cont">-->
                                <!--<div class="flex-vcenter">-->
                                    <!--<span class="fs26 part-name">{{item.regionName}}：</span>-->
                                    <!--<span class="part-font">-->
                                <!--<span class="fs30B"-->
                                      <!--:style="{'color': item.emb[0].colorNumberHx}">{{item.emb[0].content}}</span>-->
                                <!--<span class="fs28 part-font-name">（{{item.emb[0].fontsName}}）</span>-->
                            <!--</span>-->
                                <!--</div>-->
                                <!--<div>￥ {{item.emb[0].embprice|Fix2}}</div>-->
                            <!--</div>-->

                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->

                <!--<div v-show="eptList.length" :class="['flex-vbox', 'mgB30']">-->
                    <!--<div class="fs30B">绣花区域</div>-->
                    <!--<ul>-->
                        <!--<li class="flex-between pdT20 pdB30 fs24 part-item"-->
                            <!--:key="index"-->
                            <!--v-for="(item,index) in eptList">-->
                            <!--<div class="flex-between part-item-cont">-->
                                <!--<div class="flex-vcenter">-->
                                    <!--<span class="fs26 part-name">{{item.regionName}}：</span>-->
                                    <!--<img v-lazy="getImg(item.ept[0].embFileUrl)" @error="errImg($event)" alt="">-->
                                <!--</div>-->
                                <!--<div>￥ {{item.ept[0].embprice|Fix2}}</div>-->
                            <!--</div>-->
                        <!--</li>-->
                    <!--</ul>-->
                <!--</div>-->
            </div>
        </div>
        <div class="flex-button" @click="onClose()">关闭</div>
    </van-actionsheet>
</template>

<script>
import { Popup, Toast, Actionsheet } from "vant";
import check from "@/util/check";

export default {
    components: {
        'van-actionsheet': Actionsheet,
        'van-popup': Popup,
    },
    props: {
        params: Object,
        value: Boolean,
    },
    data() {
        return {
            good: this.params,
            show: false,
            // 定价类型
            DJTYPE: {
                10260501: false,
                10260502: true
            }
        };
    },
    computed:{
        // 绣字列表
        embList(){
            let partList = this.params.partList;
            if(partList && partList.length){
                return partList.filter((item)=>{
                    if(item.emb.length){
                        return true;
                    }
                })
            }else{
                return [];
            }
        },
        // 绣花列表
        eptList(){
            let partList = this.params.partList;
            if(partList && partList.length){
                return partList.filter((item)=>{
                    if(item.ept.length){
                        return true;
                    }
                })
            }else{
                return [];
            }
        },
        // 绣字或绣花内容
        embInfo(){
            if(this.embList.length){
                return this.embList[0];
            }else if(this.eptList.length){
                return this.eptList[0];
            }else{
                return null;
            }
        },
        // 刺绣详情列表
        custList(){
            let arr = [];
            let embInfo = this.embInfo;
            if(this.embList.length){
                arr = [
                    {id:1, label:'刺绣金额', cont:'￥'+embInfo.emb[0].embprice},
                    {id:2, label:'刺绣位置', cont:embInfo.regionName},
                    {id:3, label:'中英文刺绣', cont:embInfo.emb[0].content},
                    {id:4, label:'刺绣字体', cont:embInfo.emb[0].fontsName},
                    {id:5, label:'刺绣颜色', cont:embInfo.emb[0].colorName},
                ];
            }else if(this.eptList.length){
                arr = [
                    {id:1, label:'刺绣金额', cont:'￥'+embInfo.ept[0].embprice},
                    {id:2, label:'刺绣位置', cont:embInfo.regionName},
                    {id:4, label:'刺绣颜色', cont:embInfo.ept[0].colorName},
                    {id:3, label:'星座刺绣', cont:embInfo.ept[0].embName,imgUrl:embInfo.ept[0].embFileUrl,isImg:true},
                ];
            }
            return arr;
        }
    },
    methods: {
        onClose() {
            this.show = false;
        }
    },

    watch: {
        value: function (state) {
            this.show = state;

        },
        show: function (state) {
            if (!state) {
                this.$emit('input', false)
            }
        },
    }
}
</script>
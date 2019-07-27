/*
* createTime：2019-1-11
* author：fujie.wen
* description: 绣字绣花详情弹窗，引用页（good-embroider.vue ）
*/
<style lang='scss' scoped>
    .com-border-b{
        border-bottom: computed(2) solid #E6E6E6;
    }
    .title{
        padding-bottom: computed(50);
    }
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
    }
    .icon-group{
        color:#999;
        .icon-edit{
            margin-right: computed(60);
        }
    }
    .part-item{
        line-height: computed(70);
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
    .null-tip{
        color: #999;
        font-size: computed(26);
        line-height: computed(100);
    }
    .main-cont{
        height: computed(700);
        overflow-y: auto;
    }
</style>
<template>
    <van-actionsheet v-model="show" class="w100 list-cont" position="bottom">
        <div class="flex-vbox pdT30">
            <!-- 标题 -->
            <div class="text-center fs36B title">绣字绣花详情</div>

            <div class="main-cont pdLr30">
                <div v-show="embList.length" :class="['flex-vbox', 'mgB30', {'com-border-b':embList.length&&eptList.length}]">
                    <div class="fs32B">绣字区域</div>
                    <ul>
                        <li class="flex-between pdT20 pdB30 fs24 part-item"
                            :key="index"
                            v-for="(item,index) in embList">
                            <div class="flex-vcenter">
                                <span class="fs26 part-name">{{item.regionClassName}}：</span>
                                <span class="part-font">
                                <span class="fs30B"
                                      :style="{'color': item.custInfo.emb[0].colorNumberHx}">{{item.custInfo.emb[0].content}}</span>
                                <span class="fs28 part-font-name">（{{item.custInfo.emb[0].ictEmbFontsHdName}}）</span>
                            </span>
                            </div>
                            <div class="icon-group">
                                <i class="iconfont icon-bianji icon-edit" @click="$emit('handlerEdit',index,1)"></i>
                                <i class="iconfont icon-shanchu" @click="$emit('handlerRemove',item,index,1)"></i>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-show="eptList.length" :class="['flex-vbox', 'mgB30']">
                    <div class="fs32B">绣花区域</div>
                    <ul>
                        <li class="flex-between pdT20 pdB30 fs24 part-item"
                            :key="index"
                            v-for="(item,index) in eptList">
                            <div class="flex-vcenter">
                                <span class="fs26 part-name">{{item.regionClassName}}：</span>
                                <img :src="getImg(item.custInfo.ept[0].imageUrl)" @error="errImg($event)" alt="">
                            </div>
                            <div class="icon-group">
                                <i class="iconfont icon-bianji icon-edit" @click="$emit('handlerEdit',index,2)"></i>
                                <i class="iconfont icon-shanchu" @click="$emit('handlerRemove',item,index,2)"></i>
                            </div>
                        </li>
                    </ul>
                </div>

                <div v-show="!embList.length && !eptList.length" class="pd30 null-tip flex-center">绣字绣花内容为空</div>

            </div>

        </div>
        <div class="flex-button" @click="sureBtn()">确定设计</div>
    </van-actionsheet>
</template>

<script>
    import { Actionsheet } from "vant";
    export default {
        components:{
            'van-actionsheet': Actionsheet
        },
        props:{
//            show:{
//                default:true,
//                type:Boolean
//            },
            embList:Array,
            eptList:Array,
        },
        data() {
            return {
                show:false
            }
        },
        methods: {
            sureBtn() {
                this.$emit("sureEmitBill")
            }
        },
        created() {
        }
    }
</script>

<style scoped lang="scss">

</style>
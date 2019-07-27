<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-13 15:51:07
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-18 13:25:58
 * @Description: 结算页商品清单商品子项
 -->

<style lang='scss' scoped>
$size:computed(180);
.goodPic {
    padding: 0;
    margin: 0;
    width: $size;
    height: $size;
}

</style>

<template>
    <div class="flex-box bg-white pd30">
        <div class="w30">
            <div class="goodPic" :class="{'cusTag':isCustom}">
                <img :src="getImg(good.url)" @error="errImg($event)" class="w100 h100">
            </div>
        </div>
        <div class="flex-auto flex-vbox flex-between">
            <div class="fs28B">
                <p>{{good.goodsName}}</p>
                <!--<div class="fs24 grey99 mgT10" v-if="good.sellPointDesc">-->
                    <!--<span class="pdLr5 pdTb2">{{good.sellPointDesc}}</span>-->
                <!--</div>-->
                <div class="fs24 grey99 mgT10" >
                    <span class="pdLr5 pdTb2" v-show="good.mainFabricName">定制颜色：{{good.mainFabricName}}</span>
                </div>
            </div>
            <div class="mgT10">
                <!-- 定制清单 -->
                <div class="fs24 grey99 mgB10">
                    <span class="bg-gray pdLr5 pdTb2" @click.stop="showCusList()">
                        {{hasCustInfo?'刺绣详情':'无刺绣信息'}}
                        <i class="iconfont icon-down fs28" v-if="hasCustInfo"></i>
                    </span>
                </div>
                <!-- 价格数量 -->
                <div class="flex-between">
                    <div class="fs28B">
                        <span class="fs16B">¥</span>
                        {{good.dealPrice}}
                    </div>
                    <div class="fs26">x{{good.amount}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        good: Object
    },
    data() {
        return {

        }
    },
    methods: {
        showCusList() {
            this.$emit("getCusList", this.good);
        }
    },

    computed: {
        // 是否有绣字或绣花
        hasCustInfo(){
            let arr = this.good.partList;
            for(let i=0;i<arr.length;i++){
                console.log(arr[i].emb,arr[i].ept)
                if(arr[i].emb.length || arr[i].ept.length){
                    return true;
                }
            }
            return false;
        },
        // 是否定制
        isCustom: function () {
            return this.good.orderFlag == 1 ? true : false;
        },
        // 是否赠品
        isGift: function () {
            return this.good.isGift == 1 ? true : false;
        }
    },

}
</script>
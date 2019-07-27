/*
 * @Author: yongtian.hong
 * @Date: 2018-08-13 13:42:39
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 15:24:20
 * @Description: 售后服务公用商品描述组件
 */

<style lang='scss' scoped>
.img-box {
    width: computed(150);
    height: computed(150);
    margin-right: computed(20);
    img {
        width: 100%;
        height: 100%;
    }
}
.imgs {
    display: flex;
    flex-wrap: wrap;
    img {
        width: computed(150);
        height: computed(150);
        margin: computed(20) computed(20) 0 0;
    }
}

.good-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    .left {
        font-size: computed(26);
        flex: 1;
    }
    .right {
        width: 30%;
        text-align: right;
    }
}
</style>

<template>
    <div class="bg-white pd30 mgB30" v-if="data">
        <!-- 商品 -->
        <div class="flex-box mgB30" v-for="(good,index) in data.goodsList" :key="index">
            <div class="img-box">
                <img :src="getImg(good.thumb)" onerror="errImg(event)">
            </div>
            <div class="good-info">
                <div class="flex-box">
                    <div class="left">{{good.goodsName}}</div>
                    <div class="right">
                        <div class="fs26B">¥ {{good.averagePrice}}</div>
                        <div class="fs26 grey99">x{{good.ordQty}}</div>
                    </div>
                </div>
                <p class="fs26 grey99" v-if="good.mainFab">定制颜色:&nbsp;{{good.mainFab.fabName}}</p>
                <!-- 刺绣详情 -->
                <div class="flex-vcenter fs24 grey99 mgTb20" v-if="good.orderFlag">
                    <span class="bg-gray pdLr5 pdTb2" @click.stop="showEmInfo()">
                        {{emText}}
                        <i class="iconfont icon-down fs28" v-if="emText!='无刺绣信息'"></i>
                    </span>
                </div>
                <!-- 刺绣详情 -->
            </div>

            <!-- <div class="flex-auto">
                <div class="fw-bold mgB15 fs28B">{{good.goodsName}}</div>
                <div class="fw-bold mgB15 fs28B">¥ {{good.averagePrice}}</div>
                <div class="flex-between fs28 grey99">
                    <span @click.stop="showEmInfo()">{{good.mainFab.fabName}} {{good.sizeName}}</span>
                    <span>x{{good.ordQty}}</span>
                </div>
            </div>-->
        </div>
        <!-- 说明 -->
        <div class="fs28">
            <div class="mgB30">售后类型 : {{data.returnTypeName}}</div>
            <div class="mgB30">售后原因 : {{data.returnsReason}}</div>
            <div class="mgB30" v-if="isRefund && data.goodsList">退款金额 : ¥{{data.applyMoney}}</div>
            <div class="mgB30" v-if="isReturn">
                退货数量: {{data.applyAmountQty}}
                <span
                    class="mgL30"
                    v-if="data.goodsList"
                >预计退款 : ¥{{data.goodsList[0].averagePrice * data.applyAmountQty|Fix2}}</span>
            </div>
            <!-- 换货商品显示 -->
            <div class="flex-box mgB30" v-if="isChange">
                <div>换货商品 :</div>
                <div class="mgL20">
                    <div v-for="(good,index) in data.changeGoodsList" :key="index" class="mgB30">
                        <span>{{good.colorName}}</span>
                        <span class="mgL30">{{good.sizeName}}</span>
                        <span class="mgL30">x{{good.amount}}</span>
                    </div>
                </div>
            </div>
            <div class="mgB30">售后说明 : {{data.reasonMemo||"无"}}</div>
            <div class="mgB30">
                上传图片 :
                <span v-if="data.pictList && data.pictList.length==0">无</span>
            </div>
        </div>
        <!-- 用户上传的图片 -->
        <div class="imgs">
            <img
                v-for="(item,index) in data.pictList"
                :src="getImg(item.pictUrl)"
                onerror="errImg(event)"
                :key="index"
            >
        </div>
    </div>
</template>

<script>
import check from "@/util/check";

export default {
    name: "goods",
    props: {
        data: {
            type: Object,
            default: null
        },
        good: Object,
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isRefund: false, //仅退款
            isReturn: false, //退货退款
            isChange: false, //换货
            isRepair: false //返修
        };
    },
    methods: {
        initCurType() {
            // console.log("code", this.data.returnTypeCode);
            switch (this.data.returnTypeCode) {
                // 仅退款
                case "D_ONLYDRAWBACK":
                    this.isRefund = true;
                    break;
                // 换货
                case "D_CHANGEPART":
                    this.isChange = true;
                    break;
                // 返修
                case "D_REPAIR":
                    this.isRepair = true;
                    break;
                // 退货退款
                case "D_RETURNSALES":
                    this.isReturn = true;
                    break;
            }
        },
        showEmInfo() {
            if (!this.emb && !this.emp) return;
            this.$emit("input", true)
        }
    },
    computed: {
        //部件
        part: function () {
            if (check.isEmpty(this.good.parts)) return null;
            const part = this.good.parts.filter((part) => {
                // 过滤出唯一有刺绣的部位
                if (part.emb || part.embPrint) return part;
            })
            return check.isEmpty(part) ? null : part[0];
        },
        // 绣字
        emb: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.emb) ? null : this.part.emb[0];
        },
        // 绣花
        emp: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.embPrint) ? null : this.part.embPrint[0];
        },
        emText: function () {
            return (!this.emb && !this.emp) ? "无刺绣信息" : "刺绣详情"
        }
    },

    watch: {
        data: function () {
            this.initCurType();
        }
    }
};
</script>
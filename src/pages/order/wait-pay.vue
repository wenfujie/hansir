/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 19:40:37
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 16:03:23
 * @Description: 订单详情页-待付款
 */

<style lang='scss' scoped>
.bottom {
    display: flex;
    .price,
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: computed(32);
        font-family: "PingFang-SC-Medium";
    }
    .price {
        flex: 1;
        color: #0d0e09;
        background-color: #fff;
        // border-top: solid 1px #cccccc;
    }
    .btn {
        height: computed(100);
        outline: 0;
        border: 0;
        color: #fff;
    }
    .btn-gray {
        background-color: #808080;
    }
    .btn-blue {
        background-color: $maincolor;
    }
}
</style>

<template>
    <div class="flex-vbox w100 h100 bg-gray">
        <scroll-tab
            :data="packages"
            :on-tab="changePackage"
            v-if="packages.length>1"
            class="bg-white"
        ></scroll-tab>
        <order-step :pkg="pkg" class="bg-white"></order-step>
        <div class="flex-auto overflow-scroll pd30">
            <address-info :pkg="pkg"></address-info>
            <good-list :pkg="pkg" @showCusList="showCusList"></good-list>
            <order-info :order="order"></order-info>
        </div>
        <div class="bottom h100px">
            <div class="price">实付金额:￥{{actualPay | Fix2}}</div>
            <button class="btn w30 btn-gray" @click="cancelOrder()">取消订单</button>
            <button class="btn w30 btn-blue" @click="payMoney()">立即付款</button>
        </div>
        <custom-list :params="cusParams"></custom-list>
        <!-- 预约量体 -->
        <!-- <volume-appoint :order="order"/> -->
    </div>
</template>

<script>
import components from "./components";
import data from "./public/data";
import { changePkg, getOrdInfo, cancelOrder } from "./public/functions";
import { Toast } from "vant";
import wxPay from "@/util/wxPay";
import payment from "@/util/payment";
export default {
    components: components,
    data() {
        return data;
    },
    methods: {
        // 获取订单详情
        getOrderDetail() {
            getOrdInfo(this);
        },
        //取消订单
        cancelOrder() {
            cancelOrder(this).then(() => {
                this.$router.push({
                    name: "orderList",
                    params: this.order
                });
            });
        },
        //付款
        payMoney() {
            if (this.payLock) return;
            this.payLock = true;
            let billCode = this.order.billCode;
            let price = this.order.amountUnPay;
            wxPay(this, billCode, price).then(config => {
                let goodCodes = [];
                this.order.goodsList.forEach(good => {
                    goodCodes.push(good.goodsCode);
                });
                let successUrl =
                    "/reserve?fromPage=order&billCode=" +
                    billCode +
                    "&goodCodes=" +
                    goodCodes;
                let failUrl = "/waitPay?billCode=" + this.order.billCode;
                payment.miniProgramPay(config, successUrl, failUrl);
                this.payLock = false;
            });
        },
        // 展示定制清单
        showCusList(good) {
            this.cusParams = {
                billCode: this.order.billCode,
                saleOrdDtIds: good.saleOrdDtId
            };
        }
    },
    computed: {
        //实付款
        actualPay: function () {
            let money = this.order.actualAmount - this.order.amountPoint - this.order.balancePayAmount;
            if (money <= 0) {
                money = 0;
            }
            return money;
        }
    },
    created() {
        this.getOrderDetail();
    }
};
</script>
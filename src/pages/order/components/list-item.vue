/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 16:51:17
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 19:27:09
 * @Description: 订单列表item组件
 */

<style lang='scss' scoped>
.imgBox {
    width: computed(200);
    height: computed(200);
    // padding: computed(4);
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
.logo {
    width: computed(90);
    height: computed(40);
    img {
        max-width: 100%;
        max-height: 100%;
    }
}
.btnCom {
    display: flex;
    justify-content: center;
    align-items: center;
    // width: computed(150);
    // height: computed(55);
    padding: computed(5) computed(10);
    background: #fff;
    margin-left: computed(30);
    border: solid computed(1) #cccccc;
}
.cus-list {
    background: #f5f5f5;
    width: computed(130);
    padding: computed(5);
}
</style>

<template>
    <div class="bg-white mgB30" @click="toViewDetail()">
        <!-- logo + 订单状态 -->
        <div class="flex-between pd30 border-b1-c">
            <div class="logo">
                <img src="@/assets/images/order/Logo.png" alt>
            </div>
            <div class="color-red fs26">{{order.ordStatusName}}</div>
        </div>
        <!-- 商品信息 -->
        <list-item-good v-for="(good,index) in order.goodsList" :key="index" :good="good"/>
        <!-- 底部 -->
        <div class="pd30 text-right">
            <div class="fs26M mgB30">
                共 {{order.totalQty}} 件商品 实付金额
                <span class="fs26B">¥{{actualPay|Fix2|$goldDivide}}</span>
            </div>
            <div class="flex-end">
                <button
                    class="btnCom fs26"
                    @click.stop="onBtnClick(btnTypeName)"
                    v-if="btnTypeName"
                >{{btnTypeName}}</button>
                <button
                    class="btnCom fs26"
                    @click.stop="onBtnClick(btnCancel)"
                    v-if="btnCancel"
                >{{btnCancel}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import wxPay from "@/util/wxPay";
import payment from "@/util/payment";
import { cancelOrder, ordSignUp } from "@/pages/order/public/functions";
import listItemGood from './list-item-good'
export default {
    components: {
        listItemGood
    },
    props: {
        order: {
            type: Object,
            default: {}
        },
        reload: {
            type: Function
        },
        showCusList: {
            type: Function
        }
    },
    data() {
        return {
            btnTypeName: null,
            btnCancel: null,
            payLock: false,
            // 各种订单状态显示的按钮名称
            stateNames: {
                D_ORDSPAYING: "立即付款", //待付款
                D_ORDSDELIVERY: "确认收货", //待收货
                D_ORDSCOMMENTING: "立即评价" //待评价
                // D_ORDCANCEL: "再次购买" //取消订单关闭
            },
            params: {}
        };
    },
    methods: {
        // 初始化
        init() {
            let code = this.order.ordStatusCode;
            //控制取消订单按钮是否显示
            if (code === "D_ORDSPAYING") {
                this.btnCancel = "取消订单";
            } else {
                this.btnCancel = null;
            }
            this.btnTypeName = this.stateNames[this.order.ordStatusCode];
            //全局参数
            this.params = {
                busContsCode: baseConstant.busContsCode,
                billCode: this.order.billCode,
                ordStatusCode: code,
                ordStatusName: this.order.ordStatusName,
                shopCode: this.order.shopCode
            };
            // console.log("order", this.order);
        },
        // 展示定制单
        showCustomList(good) {
            if (this.showCusList) {
                this.showCusList(this.order, good);
            }
        },

        goTo(path) {
            this.$router.push({
                name: path + "",
                path: "/" + path,
                query: this.params
            });
            this.Storage.set("ordInfo", this.params);
        },
        // 查看订单详情
        toViewDetail() {
            let code = this.order.ordStatusCode;
            let receiptWayCode = this.order.receiptWayCode;
            if (code === "D_ORDSPAYING") {
                //待付款
                this.goTo("waitPay");
                console.log("code", code);
            } else if (code === "D_ORDSSHIPPING") {
                // 待发货
                this.goTo("waitShip");
            } else if (code === "D_ORDSDELIVERY") {
                // 待收货
                this.goTo("waitRecieve");
            } else if (code === "D_ORDSCOMMENTING") {
                // 待评价
                this.goTo("waitEvaluate");
            } else if (code === "D_ORDRECEIVED") {
                // 交易完成
                this.goTo("tradFinish");
            } else if (code === "D_ORDCANCEL") {
                // 已关闭的订单
                this.goTo("orderClosed");
            }
        },

        //付款
        payForOrder() {
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
                    "/submitSuccess?fromPage=order&billCode=" +
                    billCode +
                    "&goodCodes=" +
                    goodCodes;
                this.$router.go(-1);
                payment.miniProgramPay(config, successUrl, "/order-list");
                this.payLock = false;
            });
        },
        //取消订单
        cancel() {
            cancelOrder(this).then(() => {
                this.reload();
                this.btnCancel = null;
                this.btnTypeName = null;
            });
        },
        //签收(确认收货)
        signUp() {
            ordSignUp(this).then(() => {
                this.reload();
                this.btnTypeName = null;
            });
        },
        // 去评价
        toEvaluate() {
            this.goTo("orderEvaluate");
        },
        // 按钮点击触发
        onBtnClick(btnTypeName) {
            switch (btnTypeName) {
                case "立即付款":
                    this.payForOrder();
                    break;
                case "立即评价":
                    this.toEvaluate();
                    break;
                case "确认收货":
                    this.signUp();
                    break;
                case "取消订单":
                    this.cancel();
                    break;
            }
        }
    },
    computed: {
        actualPay: function () {
            if (!this.order) return;
            return this.order.amountNeedPay - this.order.amountDeduction;
        }
    },
    created() {
        this.init();
    },
    watch: {
        order: function () {
            this.init();
        }
    }
};
</script>
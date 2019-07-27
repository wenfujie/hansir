/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 19:40:37
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 17:36:07
 * @Description: 订单详情页-待收货
 */

<style lang='scss' scoped>
.bottom {
    display: flex;
    height: computed(100);
    .icon-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: computed(100);
        background-color: #fff;
        .iconfont {
            font-size: computed(40) !important;
        }
        .text {
            font-size: computed(20);
            line-height: 100%;
        }
    }
    .btn-right {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        outline: 0;
        border: 0;
        color: #fff;
        font-size: computed(30);
        font-family: "PingFang-SC-Medium";
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
            <logistic :data="pkg"></logistic>
            <address-info :pkg="pkg"></address-info>
            <good-list :pkg="pkg" @showCusList="showCusList"></good-list>
            <order-info :order="order"></order-info>
        </div>
        <div class="bottom">
            <div class="icon-box" @click="concatCumService()">
                <i class="iconfont icon-kefu"></i>
                <div class="text">客服</div>
            </div>
            <div class="btn-right" @click="comfirmRecieved()">确认收货</div>
        </div>
        <custom-list :params="cusParams"></custom-list>
    </div>
</template>

<script>
import components from "./components";
import data from "./public/data";
import { UserService } from "@/api/service";
import { changePkg, getOrdInfo, ordSignUp } from "./public/functions";
export default {
    components: components,
    data() {
        return data;
    },
    methods: {
        getOrderDetail() {
            getOrdInfo(this);
        },
        //切换包裹
        async changePackage(curPackage) {
            changePkg(this, curPackage);
        },
        // 展示定制清单
        showCusList(good) {
            this.cusParams = {
                billCode: this.order.billCode,
                saleOrdDtIds: good.saleOrdDtId
            };
        },
        //确认收货
        comfirmRecieved() {
            ordSignUp(this).then(() => {
                this.$router.push({
                    path: "/waitEvaluate",
                    query: {
                        billCode: this.$route.query.billCode
                    }
                });
            });
        },
        //联系客服
        async concatCumService() {
            contact();
        }
    },
    created() {
        this.getOrderDetail();
    }
};
</script>
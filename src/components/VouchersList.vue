/*
* createTime：2018/11/8
* author：junyong.hong
* description: 优惠券列表组件封装
*/
<template>
    <div class="vouchers">
        <!-- 优惠券列表 begin -->
        <ul
            v-if="cardList.length > 0"
            v-for="(item, index) in cardList"
            :key="index"
            class="vouchers-list"
        >
            <li class="vouchers-item">
                <div class="item">
                    <div class="item-price">
                        <!-- 显示：价格  -->
                        <!-- 灰色字体：gray-color -->
                        <div class="price" v-if="item.cardType === 1">
                            <span>¥</span>
                            <span>{{item.couponValue | Fix2}}</span>
                        </div>

                        <!-- 显示：折扣 -->
                        <!-- 灰色字体：gray-color -->
                        <div class="discount" v-if="item.cardType === 0">
                            <span>{{item.couponValue * 10}}</span>
                            <span>折</span>
                        </div>
                    </div>
                    <div class="item-info">
                        <!-- 灰色字体：gray-color -->
                        <p class="info-title">{{item.couponName}}</p>
                        <p class="info-date">{{item.couponStartTime}} - {{item.couponEndTime}}</p>
                        <p @click="showDesc(item, index)" class="info-description">使用说明
                            <i
                                class="iconfont icon-down"
                                :class="[item.showOrHide ? 'tran-up': 'tran-down']"
                            ></i>
                        </p>
                    </div>
                    <div v-if="item.isBuy === 1 && item.buyPrice>0" class="item-buy">
                        <!-- 字体：fs32 fs24 fs24-gray -->
                        <p class="buy-price fs32">售{{item.buyPrice}}元</p>
                        <div @click="getCard(item)" class="buy-btn">购买</div>
                    </div>
                    <div v-if="item.isBuy === 0 || item.buyPrice <= 0" class="item-buy">
                        <div @click="getCard(item)" class="buy-btn">领用</div>
                    </div>
                </div>
                <!-- none控制显示隐藏 -->
                <div
                    :class="[item.showOrHide ? '': 'none']"
                    v-if="item.couponMemo"
                    class="item-desc"
                >{{item.couponMemo}}</div>
            </li>
        </ul>
        <!-- 优惠券列表 end -->
        <!-- 优惠券为空 begin -->
        <div v-if="cardList.length === 0" class="empty-content bg-gray">
            <p>优惠券为空</p>
        </div>
        <!-- 优惠券为空 end -->
    </div>
</template>
<script type="text/ecmascript-6">
import { Toast } from 'vant'
import { Vouchers, Payment, Order } from '../api/service'
import wx from "weixin-js-sdk"
import payment from '../util/payment'
import Storage from "../util/storage";
export default {
    props: [
        'cardList'
    ],
    data() {
        return {
            orderCode: '',
        }
    },
    created() {
    },
    methods: {
        /**
         * 使用说明展开 或 收起
         * @param item 当前点击的对象
         * @param index 索引
         */
        showDesc(item, index) {
            item.showOrHide = !item.showOrHide
        },
        /**
         * 领取/购买优惠券/卡
         * @param item
         */
        getCard(item) {
            if (this.btnLock === true) {
                return
            }
            this.btnLock = true
            let that = this
            if ((item.isBuy !== 1) || (item.buyPrice === 0)) {
                //  领取
                let data = {}
                if (item.couponId === null) {  // 储值卡
                    data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        busContsCode: baseConstant.busContsCode,
                        cardId: item.valueCardHdId,
                    }
                } else {
                    data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        busContsCode: baseConstant.busContsCode,
                        couponsId: item.couponId,
                    }
                }
                Vouchers.saveCoupons(data).then((res) => {
                    if (res[0].state === "0") {
                        Toast('领取成功~')
                        //                            this.$router.go(-1)
                        this.$router.replace('/my-vouchers')
                    } else if (res[0].state === "1") {
                        Toast('您已经领取过该优惠券啦~')
                    } else if (res[0].state === "2") {
                        Toast('该优惠券已经被其他会员绑定~')
                    } else {
                        Toast('领取失败~')
                    }
                }).then(() => {
                    this.btnLock = false
                })
            } else if ((item.isBuy === 1) && (item.buyPrice > 0)) {
                //  购买
                let data = {}
                if (item.couponId === null) {
                    //  储值卡
                    data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        shopCode: Storage.get('USER_INFO').shopCode,
                        valuecardHdId: item.valueCardHdId,
                        busContsCode: baseConstant.busContsCode
                    }
                } else {
                    //  非储值卡
                    data = {
                        usrId: Storage.get('USER_INFO').usrId,
                        companyId: Storage.get('COMPANYID').company_id,
                        shopCode: Storage.get('USER_INFO').shopCode,
                        couponsId: item.couponId,
                        busContsCode: baseConstant.busContsCode
                    }
                }
                Vouchers.buyCoupons(data).then((res) => {
                    this.orderCode = res.billCode  //  获取订单号，调用微信支付
                    let orderData = {
                        usrId: Storage.get("USER_INFO").usrId,
                        paymentCode: "D_WEIXIN",
                        tradeTypeCode: "JSAPI",
                        paymentTypeCode: "D_FULL",
                        shopCode: Storage.get("USER_INFO").shopCode,
                        orderList: res.billCode,
                        openId: Storage.get("WECHAT_INFO").openid,
                        orderType: 'D_COUPONSORD',
                        payAmount: item.buyPrice
                    };
                    Payment.payOrder(orderData).then((config) => {
                        if (config.code === "200") {
                            let wxconfig = {
                                timeStamp: config.timeStamp,
                                nonceStr: config.nonceStr,
                                package: config.prepayId,
                                paySign: config.paySign,
                                successUrl: '/my-vouchers',
                                failUrl: '/vouchers-list'
                            }
                            payment.miniProgramPay(wxconfig, wxconfig.successUrl, wxconfig.failUrl)
                        } else {
                            Toast('支付出错了~')
                            that.btnLock = false
                            return
                        }
                    }).then(() => {
                        that.btnLock = false
                    });
                })
            }
        }
    },
    computed: {
    }
}
</script>
<style lang="scss" type="text/scss" scoped>
    @import '../assets/scss/common/vouchers.scss';
</style>
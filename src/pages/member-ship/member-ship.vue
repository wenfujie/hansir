/*
 * @Author: yongtian.hong
 * @Date: 2018-11-19 09:30:03
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-19 21:19:01
 * @Description: 会籍会员
 */

<style lang='scss' scoped>
.content {
    padding: computed(30);
}
.cardPopup {
    display: flex;
    justify-content: center;
    align-items: center;
    height: computed(30);
    padding: computed(30) 0;
    color: #0d0e09;
    font-size: computed(32);
    font-weight: bold;
    border-bottom: solid computed(2) $maincolor;
}
.grow-up{
    padding: computed(30);
    .grow-name{
        font-size:computed(36);
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:rgba(13,14,9,1);
        margin-right: computed(23)
    }
    .grow-val{
        font-size:computed(36);
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:#0D0E09;
        margin-right: computed(20)
    }
    .grow-tip{
        font-size:computed(30);
        font-family:PingFang-SC-Bold;
        font-weight:bold;
        color:#666666;
    }
    .grow-mel{
        margin-top: computed(27);
        margin-bottom: computed(14);
    }
    .grow-btm{
        overflow: hidden;
        .left,.right{
            font-size:computed(26);
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(153,153,153,1);
        }
        .left{
            float: left;
        }
        .right{
            float: right;
        }
    }

}
</style>

<template>
    <div class="flex-vbox w100 h100">
        <div class="flex-auto">
            <card-swiper
                :cards="cards"
                @onSwiper="getCurrentCardInfo"
                :showPopup.sync="showPurchase"
            />
            <div class="grow-up" v-if="showGrowthValue">
                <div class="grow-fr">
                    <span class="grow-name">成长值</span>
                    <span class="grow-val">{{userVipLevelInfo.haveConsume}}</span>
                    <span
                        class="grow-tip"
                    >（还需消费{{userVipLevelInfo.needConsume}}元升级至{{userVipLevelInfo.nextLevelName}}）</span>
                </div>
                <div class="grow-mel">
                    <van-progress
                        :pivot-text="userVipLevelInfo.haveConsume"
                        color="#f44"
                        :percentage="percentage"
                    />
                </div>
                <div class="grow-btm">
                    <span class="left">0</span>
                    <span class="right">{{userVipLevelInfo.mostConsume}}</span>
                </div>
            </div>
            <div class="content pd30 fs36B" v-if="hasTheCard">
                <p>我的特权</p>
                <div class="fs28 pdTb10" v-html="curCardLevelInfo.lable"></div>
            </div>
            <div class="content pd30 fs36B" v-if="!hasTheCard">
                <p>未开通</p>
            </div>
        </div>
        <!-- <button
            class="h100px bg-red text-center white fs30B"
            @click="TogglePurchase('purchase')"
            v-if="btnPay"
        >{{btnPay}}</button>-->
        <!-- 会员卡打包促销列表 -->
        <van-popup v-model="showPurchase" position="bottom" :overlay="showPurchase">
            <div class="cardPopup">{{curCardLevelInfo.cardLevelName}}</div>
            <div
                class="flex-between h100px flex-vcenter pdLr30"
                v-for="(item,index ) in discountList"
                :key="index"
            >
                <div class="fs28">{{item.valiPeriod}}</div>
                <div>
                    <span class="fs28B color-red">¥ {{item.price}}</span>
                    <span class="bg-black mgL30 fs28 white pdTb10 pdLr20" @click="Purchase(item)">购买</span>
                </div>
            </div>
            <div class="flex-center fs30 h100px bg-gray" @click="TogglePurchase('cancel')">取消</div>
        </van-popup>
    </div>
</template>

<script>
import cardSwiper from "./components/card-swiper";
import check from "@/util/check";
import * as userApi from "@/api/service/user-service";
import { Popup, Toast, Progress } from "vant";
import scrollTab from "@/components/ScrollTab";
import wxPay from "@/util/wxPay";
import payment from "@/util/payment";
import { UserService } from "../../api/service";
export default {
    components: {
        cardSwiper,
        "van-popup": Popup,
        "van-progress": Progress,
        scrollTab
    },
    data() {
        return {
            show: false,
            curIndex: -1,
            cards: [],
            userVipLevelInfo: {},
            curCardLevelInfo: {},
            cardLevelInfoCache: {},
            curCardPriceList: [],
            cardPriceListCache: [],
            showPurchase: false,
            active: 0,
            btnPay: "立即购买",

        };
    },
    methods: {
        // 获取开放的会员卡列表
        getCards() {
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                busContsCode: baseConstant.busContsCode
            };
            return userApi.getCardLevelList(params).catch(err => { return [] });
        },
        // 卡列表顺序重排
        sortCards(cards) {
            cards.forEach((card, index) => {
                if (card.usrName) {
                    cards.splice(index, 1);
                    cards.unshift(card);
                }
            });
            return cards;
        },
        //获取用户下一等级会员信息(成长等级信息)
        getUserNextVipLevelInfo() {
            let params = {
                usrId: Storage.get('USER_INFO').usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                companyId: Storage.get("COMPANYID").company_id
            }
            return UserService.getVipLevel(params);
        },
        //为cardPriceList元素添加有效期字段
        addValiPeriodField(priceList) {
            priceList.forEach((item) => {
                if (item.validityTerm == 0) {
                    item.valiPeriod = "永久有效";
                } else {
                    item.valiPeriod = item.validityTerm + "个月";
                }
            })
            return priceList;

        },
        // 获取会员卡打包促销价格表(用于购买)
        getCardPriceList(index) {
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                busContsCode: baseConstant.busContsCode,
                cardLevelCode: this.cards[index].cardLevelCode
            };
            return userApi.getCardVouchers(params);
        },
        // 获取当前会员卡信息(等级信息,打包价信息)
        async getCurrentCardInfo(index) {
            if (this.curIndex === index) return;
            this.curIndex = index;
            let params = {
                code: this.cards[index].cardLevelCode
            };
            if (check.isEmpty(this.cardLevelInfoCache[index])) {
                this.curCardLevelInfo = await userApi.getCardLevelDetail(params);
                this.cardLevelInfoCache[index] = this.curCardLevelInfo;
                this.curCardPriceList = this.addValiPeriodField(await this.getCardPriceList(index));
                this.cardPriceListCache[index] = this.curCardPriceList;
            } else {
                this.curCardLevelInfo = this.cardLevelInfoCache[index];
                this.curCardPriceList = this.cardPriceListCache[index];
            }
        },
        //控制显示隐藏
        TogglePurchase(key) {
            switch (key) {
                case "purchase":
                    this.showPurchase = true;
                    break;
                case "cancel":
                    this.showPurchase = false;
                    break;
                default:
                    this.showPurchase = false;
                    break;
            }
        },
        //购买&续费
        async Purchase(card) {
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                cardLevelCode: this.cards[this.curIndex].cardLevelCode,
                valiDityTerm: card.validityTerm
            };
            let cardCode = await userApi.buyCard(params);
            wxPay(this, cardCode, card.price, "D_CARDORD").then((res) => {
                payment.miniProgramPay(res, "/member-ship", "/member-ship");
            });

        },
        // 初始化
        async onInit() {
            this.cards = this.sortCards(await this.getCards());
            this.userVipLevelInfo = await this.getUserNextVipLevelInfo();
            this.getCurrentCardInfo(0);
        }
    },
    computed: {
        // 判断用户是否已经购买该卡
        hasTheCard: function () {
            if (this.curIndex < 0) return false;
            let flag = check.isEmpty(this.cards[this.curIndex].usrName);
            if (flag) {
                this.btnPay = "立即购买";
            } else {
                this.btnPay = "续费";
            }
            return !flag;
        },
        //优惠列表
        discountList: function () {
            if (check.isEmpty(this.curCardPriceList)) {
                return [{
                    validityTerm: this.curCardLevelInfo.addEffTime,
                    price: this.curCardLevelInfo.cardAmount
                }]
            }
            return this.curCardPriceList
        },
        //成长进度计算
        percentage: function () {
            if (!this.userVipLevelInfo) return 0;
            return this.userVipLevelInfo.haveConsume / this.userVipLevelInfo.mostConsume * 100;
        },
        // 控制成长值显示
        showGrowthValue: function () {
            if (!this.userVipLevelInfo) return false;
            if (this.userVipLevelInfo.effFlag == 0) return false;
            if (this.userVipLevelInfo.noRuleFlag) return false;
            if (this.curIndex < 0) return false;
            return this.cards[this.curIndex].id == this.userVipLevelInfo.nextLevelId ? true : false;
        }
    },
    created() {
        this.onInit();
    }
};
</script>
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
                @getCurrentPage="getCardDetail"
                :showPopup.sync="showPurchase"
            />
            <div class="grow-up" v-if="show&&info">
                <div class="grow-fr">
                    <span class="grow-name">成长值</span>
                    <span class="grow-val">{{info.haveConsume}}</span>
                    <span class="grow-tip">（还需消费{{info.needConsume}}元升级至{{info.nextLevelName}}）</span>
                </div>
                <div class="grow-mel">
                    <van-progress
                        :pivot-text="info.haveConsume"
                        color="#f44"
                        :percentage="percentage"
                    />
                </div>
                <div class="grow-btm">
                    <span class="left">0</span>
                    <span class="right">{{info.mostConsume}}</span>
                </div>
            </div>
            <div class="content pd30 fs36B" v-if="hasTheCard">
                <p>我的特权</p>
                <div class="fs28 pdTb10" v-html="cardDetail.lable"></div>
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
            <div class="cardPopup">{{cardDetail.cardLevelName}}</div>
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
import tabs from "@/pages/order/public/tabs";
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
            cards: [],
            curIndex: -1,
            cardDetail: {},
            cardDetails: {},
            cardInfo: {},
            cardInfos: {},
            showPurchase: false,
            tabs: tabs,
            active: 0,
            btnPay: "立即购买",
            info: {
                haveConsume: ""
            },
            cur_index: null
        };
    },
    methods: {
        // 获取开放的会员卡列表
        async getCards() {
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                busContsCode: baseConstant.busContsCode
            };
            let cards = await userApi.getCardLevelList(params) || [];
            return cards;
        },
        //获取用户拥有的会员卡等级信息,用于成长值
        async getCardLevelInfo(cards) {
            let adata = {
                usrId: Storage.get('USER_INFO').usrId,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                companyId: Storage.get("COMPANYID").company_id
            }
            this.info = await UserService.getVipLevel(adata);
            // 重组card列表排序
            cards.forEach((card, index) => {
                if (card.id == this.info.currentLvId) {
                    cards.splice(index, 1);
                    cards.unshift(card);
                }
            });
            return cards;
        },
        // 获取会员卡打包促销价格列表
        async getCardPakagePriceList(index) {
            let params = {
                shopCode: this.Storage.get("USER_INFO").shopCode,
                busContsCode: baseConstant.busContsCode,
                cardLevelCode: this.cards[index].cardLevelCode
            };
            this.cardInfo = await userApi.getCardVouchers(params);
            this.cardInfo.forEach((item) => {
                if (item.validityTerm == 0) {
                    item.valiPeriod = "永久有效";
                } else {
                    item.validityTerm = item.valiPeriod + "个月";
                }

            })
            this.cardInfos[index] = this.cardInfo;
        },
        // 获取会员卡销售信息
        async getCardDetail(index) {
            if (this.curIndex === index) return;
            this.curIndex = index;
            this.cardDetail = {};
            this.cardInfo = {};
            let params = {
                code: this.cards[index].cardLevelCode
            };
            if (this.cards[index].id == this.info.nextLevelId && !this.info.noRuleFlag) {
                this.show = true
            } else {
                this.show = false
            }
            if (check.isEmpty(this.cardDetails[index])) {
                this.cardDetail = await userApi.getCardLevelDetail(params);
                this.cardDetails[index] = this.cardDetail;
                await this.getCardPakagePriceList(index);
            } else {
                this.cardDetail = this.cardDetails[index];
                this.cardInfo = this.cardInfos[index];
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
            let cards = await this.getCards();
            this.cards = await this.getCardLevelInfo(cards);
            this.getCardDetail(0);
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
            if (check.isEmpty(this.cardInfo)) {
                return [{
                    validityTerm: this.cardDetail.addEffTime,
                    price: this.cardDetail.cardAmount
                }]
            }
            return this.cardInfo
        },
        //成长值进度
        percentage: function () {
            if (!this.info) return 0;
            return Number(this.info.haveConsume) / (Number(this.info.mostConsume) * 100);
        }
    },
    created() {
        this.onInit();
        // this.getCards();
    }
};
</script>
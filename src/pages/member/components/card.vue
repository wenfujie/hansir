<style lang='scss' scoped>
.card-wrapper {
    display: flex;
    padding-right: computed(20);
}
.goldCard {
    background: url("../../../assets/images/vipCard/golden-card.png");
}
.blackCard {
    background: url("../../../assets/images/vipCard/black-card.png");
}
.gold-card,
.black-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: computed(690);
    height: computed(340);
    color: #fff;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 5px;
    .vip-img {
        display: inline-block;
        width: computed(120);
        height: computed(45);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}

.bottom-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.bottom-right {
    display: flex;
    justify-content: center;
    align-items: center;
    .add-to-wechat {
        padding: computed(10) computed(20);
        border: solid 1px #fff;
        border-radius: computed(5);
    }
}
</style>

<template>
    <div class="card-wrapper">
        <div class="gold-card" :class="{'blackCard ':!card.vipCardImage}" :style="vipCardImg">
            <!-- <img :src=" getImg(this.card.vipCardImage)" class="w100 h100"> -->
            <div class="pd30 fs40B">
                <span class="vip-img"></span>
                <span class="fs28">{{card.cardLevelName}}</span>
            </div>
            <div class="flex-between pd30 fs28" v-if="!card.usrName">
                <div class="bottom-right">
                    <span class="add-to-wechat" v-if="card.cardAmount" @click.stop="openVip()">立即开通</span>
                </div>
            </div>
            <div class="flex-between pd30 fs28" v-if="card.usrName">
                <div class="bottom-left">
                    <span>{{card.usrName}}</span>
                    <span>{{effectDate}}</span>
                </div>
                <div
                    class="bottom-right"
                    v-if="canAddToWxCardPkgs"
                    @click.stop="addToWechatCardPkg()"
                >
                    <span class="add-to-wechat">加入微信卡包</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import check from '@/util/check'
import * as vouchersApi from "@/api/service/vouchers";
import * as orderApi from "@/api/service/order"
import * as userApi from "@/api/service/user-service"
import wx from "weixin-js-sdk"
export default {
    props: {
        index: {
            default: 0
        },
        card: {
            default: function () {
                return {}
            }
        }
    },
    methods: {
        // 开通会员
        openVip() {
            this.$emit("openVip", true);
        },
        //  获取会员卡信息
        async  getVipCardInfo() {
            let data = {
                wxUnionid: Storage.get('properties').publicAccount
            }
            return userApi.getMyCardInfo(data)
        },
        // 获取微信卡包配置
        async getCardConfig(cardId) {
            let params = {
                card_id: cardId,  //会员卡Id,
                code: this.card.cardLevelCode,
                isNeedOpenid: 0,
                wxuuid: Storage.get('properties').publicAccount
            }
            console.log(this.card.cardLevelName, params)
            return vouchersApi.getWxconfig(params)
        },
        // 获取微信签名配置
        async getWxConfig() {
            let url = window.location.href.split("#")[0];
            let params = {
                wxUUID: Storage.get('properties').publicAccount,
                unAuthorizedUrl: encodeURIComponent(url)
            }
            return orderApi.getWxSignature(params)

        },
        //  微信加入卡券
        wxInit(config, cardId, cardConfig) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: config.appId, // 必填，公众号的唯一标识
                timestamp: config.timeStamp, // 必填，生成签名的时间戳
                nonceStr: config.nonceStr, // 必填，生成签名的随机串
                signature: config.signature,// 必填，签名
                jsApiList: ['addCard'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.addCard({
                    cardList: [{
                        cardId: cardId,
                        cardExt: JSON.stringify(cardConfig)
                    }], // 需要添加的卡券列表
                    success: function (res) {
                        Toast('添加成功~')
                        var cardList = res.cardList; // 添加的卡券列表信息
                    },
                    error: function (err) {
                        Toast('添加失败~', err)
                        console.error('err', err)

                    }
                });
                wx.error(function (err) {
                    console.error('err', err)
                })
            });
        },
        //加入微信卡包
        async addToWechatCardPkg() {
            let card = await this.getVipCardInfo();
            this.$requestAll([this.getWxConfig(), this.getCardConfig(card.wxId)]).then((res) => {
                console.log("request", res)
                this.wxInit(res[0], card.wxId, res[1])
            })
        }
    },
    computed: {
        // 有效日期
        effectDate: function () {
            if (this.card.validTerm == 0) return "长期有效";
            if (check.isEmpty(this.card.expireDate)) return null;
            return this.card.expireDate.split(" ")[0] + "到期";
        },
        vipCardImg: function () {
            if (this.card.vipCardImage) {
                return {
                    'background': 'url(' + getImg(this.card.vipCardImage) + ')',
                    'background-size': "100% 100%"
                }
            } else {
                return {}
            }
        },
        // 是否持有的最高级卡
        isTopLevel: function () {
            return this.card.usrName && this.card.priorityFlag == 1 ? true : false;
        },
        //能否加入卡包
        canAddToWxCardPkgs: function () {
            return this.card.toWxCardFlag == 1 ? true : false;
        }
    }
};
</script>
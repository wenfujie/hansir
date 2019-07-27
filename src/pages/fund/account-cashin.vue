<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-21 13:53:24
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-03-21 17:34:53
 * @Description: 账户充值
 -->

<style lang='scss' scoped>
.active {
    color: #c41717;
    border-bottom: solid computed(2) #c41717;
}
.inActive {
    color: #0d0e09;
    border-bottom: solid computed(1) #dbdbdb;
}
.topPart {
    // height: computed(450);
    background: #fff;
    padding-bottom: computed(30);
}
.card-input {
    padding: computed(30);
    outline: none;
    border: none;
    border-bottom: solid computed(1) #b3b3b3;
}
::-webkit-input-placeholder {
    color: #b3b3b3;
}
.wechat {
    display: flex;
    flex-wrap: wrap;
    padding: 0 computed(30);
    margin-bottom: computed(30);
    //   height: computed(350);
}
.tab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: computed(20);
    margin-bottom: computed(30);
    width: computed(210);
    height: computed(100);
    box-sizing: border-box;
}
.tabActive {
    color: #fff;
    font-weight: bold;
    background: #c41717;
    .song {
        font-size: computed(26);
    }
}
.tabInactive {
    font-weight: bold;
    border: solid computed(2) #c41717;
    .chong {
        color: #0d0e09;
    }
    .song {
        font-size: computed(26);

        color: #c41717;
    }
}

.card {
    display: flex;
    flex-direction: column;
    margin-bottom: computed(30);
    height: computed(350);
}
</style>

<template>
    <div class="page bg-gray flex-vbox">
        <div class="topPart">
            <!-- 充值方式选择 -->
            <div class="flex-box fs30">
                <div
                    :class="['flex-auto flex-center pdTb30',{'active':mode=='wx','inActive':mode!='wx'}]"
                    @click="modeChange('wx')"
                >微信充值</div>
                <div
                    :class="['flex-auto flex-center pdTb30',{'active':mode=='card','inActive':mode!='card'}]"
                    @click="modeChange('card')"
                >充值卡充值</div>
            </div>
            <!-- 充值可选项 -->
            <div class="flex-vbox">
                <!-- 微信充值 -->
                <div class="wechat mgT30" v-if="mode=='wx'">
                    <div
                        :class="['tab',{'tabInactive':index!=sIndex,'tabActive':index==sIndex,}]"
                        v-for="(item,index) in chargeCardList"
                        :key="item.id"
                        @click.stop="select(item,index)"
                    >
                        <span class="chong fs32B">充{{item.amount}}元</span>
                        <span class="song" v-if="item.present">送{{item.present}}元</span>
                    </div>
                </div>
                <!-- 充值卡充值 -->
                <div class="flex-vbox fs28 mgB30" v-if="mode=='card'">
                    <van-field
                        clearable
                        class="card-input"
                        type="text"
                        v-model="card.number"
                        @blur="onBlur()"
                        placeholder="请输入充值卡号"
                        v-inputfix
                    />
                    <van-field
                        clearable
                        class="card-input"
                        type="text"
                        v-model="card.pwd"
                        placeholder="请输入密码"
                        v-inputfix
                    />
                </div>
                <!-- 充值操作 -->
                <div class="pdLr30 white fs30">
                    <button class="flex-button" @click="payForCharge()">立即充值</button>
                </div>
            </div>
        </div>
        <chargeCardList class="flex-auto"/>
    </div>
</template>

<script>
import { Field, Toast, Dialog } from "vant";
import chargeCardList from "./components/chargeCardList";
import * as fundApi from "@/api/service/fund";
import check from "@/util/check";
import wxPay from "@/util/wxPay";
import payment from "@/util/payment";
export default {
    components: {
        "van-field": Field,
        chargeCardList
    },
    data() {
        return {
            mode: "wx",
            sIndex: 0, //选中的充值项索引
            sModel: {}, //选中的充值项
            // 充值卡充值的卡号密码
            card: {
                number: null,
                pwd: null
            },
            chargeLock: false, //充值锁，防止多次重复点击
            chargeCard: {
                cardExist: null,
                needPassword: null,
                cardUseful: null,
                uselessMsg: null
            },//充值卡
            chargeList: [], //可使用充值列表
            cache: {} //缓存校验结果
        };
    },
    methods: {
        // 切换充值方式
        modeChange(mode) {
            this.mode = mode;
        },
        select(item, index) {
            this.sIndex = index;
            this.sModel = item;
        },

        async onBlur() {
            // this.getChargeCardInfo();
        },
        //  格式化数据处理
        formatList(list) {
            //D_PAYDISTYPEDIS  折扣
            // D_PAYDISTYPEFS  满赠
            // 新增present代表满赠额度
            if (Array.isArray(list)) {
                list.forEach(item => {
                    if (item.disTypeCode === "D_PAYDISTYPEDIS") {
                        item.present = item.amount * (1 - item.discount);
                    } else if (item.disTypeCode === "D_PAYDISTYPEDIS") {
                        item.present = item.discount;
                    }
                });
                return list;
            } else {
                return [];
            }
        },
        // 获取可充值类型列表
        async getChargeTypeList() {
            let params = {
                buscontsCode: baseConstant.busContsCode
            };
            let list = (await fundApi.getChargeTypeList(params)) || [];
            this.chargeList = this.formatList(list);
            this.sModel = check.isEmpty(this.chargeList[0])
                ? []
                : this.chargeList[0];
        },
        // 获取充值卡信息(是否需要密码,该卡是否存在)
        async getChargeCardInfo() {
            // this.chargeCard = this.cache[this.card.number];
            // if (check.isEmpty(this.chargeCard) && this.card.number) {
            //     this.chargeCard = await fundApi.getCardInfoForCheck({
            //         cardNum: this.card.number
            //     });
            //     this.cache[this.card.number] = this.chargeCard;
            // }

            return fundApi.getCardInfoForCheck({
                cardNum: this.card.number
            });
        },
        // 卡号充值校验
        async chargeCheckIsOk() {
            let flag = true;
            if (!this.card.number) {
                Toast("请输入卡号");
                return false;
            }
            this.chargeCard = await this.getChargeCardInfo();
            if (this.card.number && !this.chargeCard.cardExist) {
                Toast("该卡不存在");
                flag = false;
                return flag;
            } else if (this.chargeCard.needPassword && check.isEmpty(this.card.pwd)) {
                Toast("请输入密码");
                flag = false;
                return flag;
            } else if (this.chargeCard.needPassword && (this.card.pwd != this.chargeCard.password)) {
                Toast("密码错误,请重新输入!");
                flag = false;
                return flag;
            } else if (!this.chargeCard.cardUseful) {
                Toast(this.chargeCard.uselessMsg);
                flag = false;
                return flag;
            } else {
                return flag;
            }

        },
        // 通过卡号密码充值
        async chargeByCardNum() {
            let isOk = await this.chargeCheckIsOk();
            if (isOk) {
                Dialog.confirm({
                    message: '是否确定将金额充值至我的资金账户?'
                }).then(() => {
                    let params = {
                        cardNum: this.card.number,
                        cardPass: this.card.pwd
                    };
                    fundApi.chargeByCardNum(params).then(
                        res => {
                            if (res.code == 200) {
                                this.card = {
                                    number: null,
                                    pwd: null
                                };
                                this.$router.push("/fund-detail")
                            }
                            Toast(res.msg);
                        },
                        err => {
                            Toast("请求失败");
                        }
                    );
                });
            };

        },
        // 微信充值
        async wxCharge() {
            if (check.isEmpty(this.sModel)) {
                Toast("无任何充值可选");
                return;
            }
            if (this.chargeLock) return;
            this.chargeLock = true;
            let params = {
                paysetDtDisId: this.sModel.id,
                busContsCode: baseConstant.busContsCode
            };
            let code = await fundApi.wxCharge(params);
            let price = this.sModel.realPay;
            wxPay(this, code, price, "D_WECHATORD", "D_INPOUR").then(
                config => {
                    this.chargeLock = false;
                    let successUrl = "/fund-detail";
                    let failUrl = "/account-cashin";
                    this.$router.go(-1);
                    payment.miniProgramPay(config, successUrl, failUrl);
                },
                err => {
                    Toast("支付失败");
                    this.chargeLock = false;
                }
            );
        },
        // 充值
        async  payForCharge() {
            switch (this.mode) {
                case "wx":
                    this.wxCharge();
                    break;
                case "card":
                    this.chargeByCardNum();
                    break;
            }
        },
        // 初始化
        onInit() {
            this.getChargeTypeList();
        }
    },
    computed: {
        chargeCardList: function () {
            let list = [];
            this.chargeList.forEach((item) => {
                if (!item.discount) {
                    item.present = null;
                    item.realPay = item.amount;
                } else if (item.disTypeCode == "D_PAYDISTYPEFS") {
                    item.present = item.discount;
                    item.realPay = item.amount;
                } else if (item.disTypeCode == "D_PAYDISTYPEDIS") {
                    item.present = null;
                    item.realPay = item.amount * item.discount;
                }
                list.push(item);
            });
            return list;

        }
    },
    created() {
        this.onInit();
    }
};
</script>
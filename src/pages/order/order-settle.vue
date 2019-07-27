<!--
 * @Author: yongtian.hong
 * @Date: 2018-12-12 11:00:27
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2019-01-08 13:53:49
 * @Description: 订单结算二期
 -->
 <style scoped lang="scss">
    .shade-style{
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        .loading-style{
            position: fixed;
            top: 50%;
            left: 50%;
            margin-left:computed(-50);
            margin-top:computed(-50);
        }
    }
    .pay-foot{
        display: flex;
        position: fixed;
        bottom: 0;
        left:0;
        width:100%;
        background: #fff;
        z-index: 100;
    }
    .pay-foot-text{
        flex:1;
        padding-left: computed(30);
        display: flex;
        align-items: center;
        .pay-foot-describe{
            color: #333;
            margin-right: computed(10);
        }
    }
    .pay-foot-btn{
        background: $maincolor;
        color: #fff;
        text-align: center;
        line-height:computed(94);
        width: computed(320);
    }
    .tipBox{
        width:100%;
        height:computed(470);
        border-radius:computed(10);
        position: relative;
        .content{
            width: computed(590);
            height:computed(346);
            margin: 0 auto;
            padding: computed(30);
            background-color: #fff;
            border-radius: computed(10);
            .title{
                text-align: center;
                font-size: computed(36);
                font-weight: bold
            }
            .li_word{
                margin-top: computed(56);
                font-size: computed(30);
                line-height: computed(50)
            }
            button{
                width: 100%;
                height: computed(94);
                margin: computed(55) 0;
                background-color: #C41717;
                color: #fff
            }
        }
        .closeIcon{
            // border: computed(1) dashed rgb(136,136,136);
            z-index: 10000000;
            width: computed(64);
            height: computed(64);
            display: inline-block;
            position: absolute;
            bottom: computed(-30);
            left: 44%;
            img{
                width: 100%;
                height: 100%;

            }
        }
    }
</style>
<template>
    <div class="page bg-gray flex-vbox">
        <div class="flex-auto pd30 overflow-scroll">
            <!-- 配送方式选择 -->
            <deliver-select
                :showAreaList.sync="showAreaList"
                :areaList.sync="areaList"
                :showStoreList.sync="showStoreList"
                :storeList.sync="storeList"
                :Address="address"
                :Store="store"
                :params.sync="shipParams"
                ref="deliverSelect"
            />
            <!-- 订单商品图展示 -->
            <goodImgView @viewGoods="toViewGoodList()" :goods="shopList"/>
            <!-- 优惠券/积分使用控制 -->
            <action-cells :actionList="Actionlist"/>
            <!-- 价格信息展示 -->
            <div class="bg-white pd30">
                <div class="flex-between mgB20">
                    <span class="fs28">商品金额</span>
                    <span class="fs28B">
                        <span class="fs24B">¥</span>
                        {{totalPrice|Fix2 | $goldDivide}}
                    </span>
                </div>
                <div class="flex-between mgB20">
                    <span
                        class="fs28"
                    >会员折扣({{vipDiscount && vipDiscount!=1 ?(vipDiscount*10).toFixed(2)+'折':'无'}})</span>
                    <span class="fs28B">
                        <span class="fs24B">-¥</span>
                        {{price.vipPrice|Fix2 | $goldDivide}}
                    </span>
                </div>
                <div class="flex-between mgB20">
                    <span class="fs28">促销优惠</span>
                    <span class="fs28B">
                        <span class="fs24B">-¥</span>
                        {{promotions|Fix2 | $goldDivide}}
                    </span>
                </div>
                <div class="flex-between">
                    <span class="fs28">运费</span>
                    <span class="fs28B">
                        <span class="fs24B">¥</span>
                        {{transFee|Fix2 | $goldDivide}}
                    </span>
                </div>
            </div>
        </div>
        <!--底部按钮-->
        <div class="flex-box mgT10">
            <div class="flex-auto bg-white flex-vcenter pdL30">
                <span class="pay-foot-describe fs24">实付金额：</span>
                <span class="pay-foot-money fs30B">
                    <span class="fs24B">¥</span>
                    {{actualPay |Fix2| $goldDivide}}
                </span>
            </div>
            <div class="w40">
                <button class="flex-button" @click="handleEmitBill">结算</button>
            </div>
        </div>
        <!-- 加载动画效果 -->
        <div class="shade-style" v-show="showOnLoading">
            <div class="loading-style">
                <van-loading type="spinner" color="white"/>
            </div>
        </div>
        <!-- 折扣券 -->
        <action-sheet
            v-model="showDiscTickets"
            :title="'折扣券'"
            type="disCoupon"
            ref="disCoupon"
            :s-model="cardIds.disCouponId"
            :coupon-list="disCouponList"
            @onSelect="onSelectDiscTicket"
            @inputBlur="onInputBlur"
        />
        <!-- 现金券 -->
        <action-sheet
            v-model="showCashTickets"
            :title="'抵用券'"
            type="cashCoupon"
            ref="cashCoupon"
            :coupon-list="cashCouponList"
            :s-model="cardIds.cashCouponId"
            @onSelect="onSelectCashTicket"
            @inputBlur="onInputBlur"
        />
        <!--省市区弹窗-->
        <van-popup v-model="showAreaList" position="bottom">
            <van-area
                :area-list="areaList"
                @confirm="onAreaChange"
                @cancel="showAreaList = false"
                :visible-item-count="5"
            />
        </van-popup>
        <!--门店弹窗-->
        <van-popup v-model="showStoreList" position="bottom">
            <van-picker
                :columns="storeList"
                show-toolbar
                @cancel="showStoreList = false"
                @confirm="onStoreSelected"
            />
        </van-popup>
        <!-- 商品清单 -->
        <goodSheet v-model="showGoodsList" :goodsList="shopList" @viewCusList="viewCusList"/>
        <customList v-model="showCusList" :params="customList"/>
        <van-popup v-model="showDalog" class="pain-dalog_point">
            <div class="tipBox">
                <div class="content">
                    <div class="title">小狮妹提醒您</div>
                    <div class="li_word">
                        <div class="word_style">
                            支付后还需填写身体数据信息，才能为你提供完整服务，请您务必填写喔！
                        </div>
                        <button @click="showDalog = false">我知道了</button>
                    </div>
                </div>
                <!-- <div class="closeIcon" @click="showDalog = false">
                    <img src="../../assets/images/volume/Pop_close.png" alt>
                </div> -->
            </div>
        </van-popup>
    </div>
</template>

<script>
import {
    Base,
    Order,
    UserService,
    Vouchers,
    Payment,
    Point,
    Fund
} from "../../api/service";
import { Dialog, Loading, Toast, Area, Popup, Picker, Button } from "vant";
import customList from "./components/customList";
import wxPay from "@/util/wxPay";
import check from "@/util/check";
import payment from "../../util/payment";
import ActionCells from "./components/ActionCells";
import ActionSheet from "./components/ActionSheet";
import goodImgView from "./components/goodImgView";
import goodSheet from "./components/goodSheet";
import deliverSelect from "./components/deliver-select";

export default {
    components: {
        customList,
        ActionCells,
        ActionSheet,
        goodImgView,
        goodSheet,
        deliverSelect,
        "van-loading": Loading,
        "van-area": Area,
        "van-popup": Popup,
        "van-picker": Picker,
        "van-button": Button
    },
    data() {
        return {
            price: {}, //折扣价格
            vipDiscount: "", //vip折扣
            memo: "", //订单备注
            showOnLoading: false,
            Actionlist: {
                disCoupon: {
                    name: "折扣券",
                    value: "无可用",
                    action: this.onActionSheet,
                    renderType: "arrow",
                    type: "discTicket"
                },
                cashCoupon: {
                    name: "抵用券",
                    value: "无可用",
                    action: this.onActionSheet,
                    renderType: "arrow",
                    type: "cashTicket"
                },
                integral: {
                    value: '',
                    name: "积分",
                    action: this.onSwitch,
                    renderType: "swicth",
                    enable: true
                },
                balance: {
                    value: "-￥0",
                    name: "账户余额",
                    action: this.onSwitchBalance,
                    renderType: "swicth",
                    enable: true
                },
                memo: {
                    name: "订单备注",
                    value: "HAH",
                    action: this.onRecieveMemo,
                    renderType: "field"
                }
            },
            transFee: 0,
            balance: 0,//账户余额
            areaList: {}, // 地址列表
            address: [],
            showAreaList: false, //显示省市区选择器
            storeList: [], //  门店列表
            store: {}, //门店对象
            shipParams: {
                kdps: {},
                mdzq: {}
            },
            showStoreList: false, //显示门店选择器
            canUsePoint: false, //用户是否可以使用积分
            isPointUsed: true, //是否使用积分抵扣
            isBalanceUsed: true, //是否使用余额
            shopCart: {},
            shopList: [], //商品清单
            customList: {},
            suitsList: [], //套装
            singleList: [], //单品
            disCouponList: [], //  折扣券列表
            cashCouponList: [], //  现金券列表
            cardIds: {
                cashCouponId: null,
                disCouponId: null
            },
            showGoodsList: false, //展示商品清单上拉列表
            showCusList: false, //显示定制清单
            showDiscTickets: false, //展示折扣券上拉列表
            showCashTickets: false, //展示抵用券上拉列表
            showDalog: true //默认显示弹窗提示
        };
    },
    watch: {
        transFee() {
            if (this.isBalanceUsed) {
                // 获取用户余额信息
                this.getUserGoldInfo();
            }
        },
        "Actionlist.cashCoupon.value"(val) {
            if (this.$refs.cashCoupon.$data.selectedModel == -2) {
                this.$refs.cashCoupon.$data.errMsg = val;
            } else {
                this.$refs.cashCoupon.$data.errMsg = "";
            }
        },
        "Actionlist.disCoupon.value"(val) {
            if (this.$refs.disCoupon.$data.selectedModel == -2) {
                this.$refs.disCoupon.$data.errMsg = val;
            } else {
                this.$refs.disCoupon.$data.errMsg = "";
            }
        }
    },

    methods: {
        // 积分使用开关
        onSwitch(item, state) {
            this.isPointUsed = state;
            this.getDiscount();
        },

        onSwitchBalance(item, state) {
            this.isBalanceUsed = state;
            if (!state) {
                this.Actionlist.balance.value = "";
            } else {
                this.getUserGoldInfo();
            }
        },

        // 抵用券/折扣券展示控制
        onActionSheet(item) {
            switch (item.type) {
                case "cashTicket":
                    this.showCashTickets = true;
                    break;
                case "discTicket":
                    this.showDiscTickets = true;
                    break;
                default:
                    return false;
            }
        },
        //获取留言
        onRecieveMemo(memo) {
            this.memo = memo;
        },
        // 省市区选择
        onAreaChange(item) {
            this.showAreaList = false;
            this.address = item;
            this.storeList = [];
            this.$refs.deliverSelect.$data.storeForm.storeName = "";
            //            console.log('areaChange', item)
        },
        // 门店选择
        onStoreSelected(store) {
            this.showStoreList = false;
            this.store = store;
        },
        //优惠券/抵用券互斥,选中优惠券同时要去获取与之不可用的抵用券，反之亦然
        getUsableTickets(cardIds) {
            let params = {
                ownCompanyId: this.Storage.get("COMPANYID").company_id,
                rtlOrdInterHdId: this.orderHdId,
                cardIds: cardIds + "" || ""
            };
            return Vouchers.getCanUseCouponsList(params);
        },
        async filterCashCoupon(cardId){
            let result = await this.getUsableTickets(cardId);
            if (!result.cashList) {
                result.cashList = [];
            }
            if (!result.storeList) {
                result.storeList = [];
            }

            result.cashList.push(...result.storeList);

            this.cashCouponList.forEach((json, index) => {
                if(result.cashList.length){
                    for (let i = 0; i < result.cashList.length; i++) {
                        if (json.cardId == result.cashList[i]) {
                            json.disabled = false;
                            break;
                        } else {
                            if (i == result.cashList.length - 1) {
                                //该券不再返回可用券内 估禁用
                                json.disabled = true;
                                //
                                if(this.cardIds.cashCouponId == json.cardId){
                                    this.cardIds.cashCouponId = '';
                                    this.$refs.cashCoupon.$data.selectedModel = -1
                                    return
                                }
                            }
                        }
                    }
                }else{
                    json.disabled = true;
                }
            });
        },
        //折扣券选用回调
        async onSelectDiscTicket(item) {
            if (this.disCouponList.length == 0) {
                this.Actionlist.disCoupon.value = "无可用";
            }
            //保存选中的卡id
            this.cardIds.disCouponId = item.cardId;
            // 选择不使用折扣券，将抵用券状态置为可选
            if (!item.cardId || item.cardId == -1) {
                let discount = await this.getDiscount(); //不使用优惠券时价格需重新计算
                this.allCouponUnDisabled(this.cashCouponList);
                this.Actionlist.disCoupon.value = item.couponName;
                return;
            } else {
                await this.filterCashCoupon(item.cardId);

                this.getDiscount();
            }

        },
        // 所有权不禁用
        allCouponUnDisabled(arr){
            arr.forEach((item, index) => {
                item.disabled = false;
            });
        },

        // 用户输入卡券 失焦回调
        // msg存在表示输入券不可用
        onInputBlur(val, type) {
            let callback = () => {
                let msg = "",
                    voucherTypeName = "",
                    gold = 0,
                    cardIdString = "";
                if (type === "cashCoupon") {
                    if (this.$refs.cashCoupon.$data.selectedModel != -2) return;
                    voucherTypeName = "抵用券";
                } else {
                    if (this.$refs.disCoupon.$data.selectedModel != -2) return;
                    voucherTypeName = "抵扣券";
                }
                if (val) {
                    // 根据卡编号 获取卡id
                    Vouchers.getCouponsId({ cardCode: val }).then(res => {
                        if (res) {
                            if (type == "cashCoupon") {
                                cardIdString =
                                    res +
                                    (this.cardIds.disCouponId
                                        ? "," + this.cardIds.disCouponId
                                        : "");
                            } else {
                                // 过滤现金券 优惠券
                                this.filterCashCoupon(res);
                                cardIdString =
                                    res +
                                    (this.cardIds.cashCouponId
                                        ? "," + this.cardIds.cashCouponId
                                        : "");
                            }
                            this.getDiscount(cardIdString).then(data => {
                                if (type == "cashCoupon") {
                                    if (data.cashCouponPrice > 0) {
                                        gold = data.cashCouponPrice;
                                    } else if (data.storedValueCardPrice > 0) {
                                        gold = data.storedValueCardPrice;
                                    } else {
                                        gold = 0;
                                        msg = "该优惠券不可使用";
                                    }
                                } else {
                                    if (data.disCouponPrice > 0) {
                                        gold = data.disCouponPrice;
                                    } else {
                                        gold = 0;
                                        msg = "该优惠券不可使用";
                                    }
                                }
                                if (gold && gold > 0) {
                                    gold =
                                        "-￥" + Number(gold).toFixed(2) * 1.0;
                                    this.setTipAndId(type, gold, res);
                                } else {
                                    this.setTipAndId(type, msg, "");
                                }
                            });
                        } else {
                            msg = "找不到该" + voucherTypeName;
                            this.setTipAndId(type, msg, "");
                            if (type === "cashCoupon") {
                                this.allCouponUnDisabled(this.disCouponList);

                            } else {
                                this.allCouponUnDisabled(this.cashCouponList);
                            }
                            this.getDiscount();
                        }
                    });
                } else {
                    msg = "不使用" + voucherTypeName + "~";
                    this.setTipAndId(type, msg, "");
                    if (type === "cashCoupon") {
                        this.allCouponUnDisabled(this.disCouponList);
                    } else {
                        this.allCouponUnDisabled(this.cashCouponList);
                    }
                    this.getDiscount();
                }
            };

            // 延时解决： 选其他券时的input失焦避免调用接口
            setTimeout(() => {
                window.scrollTo(0, 5);
                callback();
            }, 100);
        },

        // 设置主页面券使用提示，和对应选中券id
        setTipAndId(type, msg, id) {
            if (type === "cashCoupon") {
                this.cardIds.cashCouponId = id;
                this.Actionlist.cashCoupon.value = msg;
            } else {
                this.cardIds.disCouponId = id;
                this.Actionlist.disCoupon.value = msg;
            }
        },

        //抵用券选用回调
        async onSelectCashTicket(item) {
            if (this.cashCouponList.length == 0) {
                //                this.Actionlist.cashCoupon.value = "无可用";
            }

            this.cardIds.cashCouponId = item.cardId;
            // 选择不使用抵用券，折扣券将状态置为可选
            if (!item.cardId || item.cardId == -1) {
                this.allCouponUnDisabled(this.disCouponList);
                this.Actionlist.cashCoupon.value = item.couponName;
                this.getDiscount();
                return;
            }

            this.getDiscount();

        },

        // 过滤折扣券（折扣券优先）
        async filterDisCoupon(cardId){
            let result = await this.getUsableTickets(cardId);
            this.disCouponList.forEach((json, index) => {
                if(result.disList.length){
                    for (let i = 0; i < result.disList.length; i++) {
                        if (json.cardId == result.disList[i]) {
                            json.disabled = false;
                            break;
                        } else {
                            if (i == result.disList.length - 1) {
                                //最后一个
                                json.disabled = true;
                            }
                        }
                    }
                }else{
                    json.disabled = true;
                }
            });
        },

        //查看商品清单
        toViewGoodList(state) {
            this.showGoodsList = true;
        },
        // 查看定制清单
        viewCusList(good) {
            this.customList = good;
            this.showCusList = true;
        },
        // 提取组合商品并合并
        combindShopList(shopCart) {
            let skuList = [];
            if (
                !check.isEmpty(shopCart.combList) &&
                check.isArray(shopCart.combList)
            ) {
                shopCart.combList.forEach(item => {
                    skuList = skuList.concat(item.skuList);
                });
            }
            return shopCart.skuList.concat(skuList);
        },
        // 获取购物清单
        async getShopList() {
            let shopCart = JSON.parse(sessionStorage.getItem(this.orderHdId));
            if (!shopCart) {
                let params = {
                    ctmUsrId: this.Storage.get("USER_INFO").usrId,
                    cookieId: this.Storage.get("USER_INFO").cookieId,
                    rtlCartTempHdId:
                        this.orderHdId || this.$route.query.orderHdId,
                    busContsCode: baseConstant.busContsCode,
                    shopCode: this.Storage.get("USER_INFO").shopCode
                };
                shopCart = await Order.getSettlementInfo(params);
                sessionStorage.setItem(
                    this.orderHdId,
                    JSON.stringify(shopCart)
                );
            }
            this.shopList = this.combindShopList(shopCart);
        },
        // 获取会员折扣
        async getVipDiscount() {
            let params = {
                wxUnionid: baseConstant.signUpTypeCode,
                usrId: this.Storage.get("USER_INFO").usrId,
                companyId: this.Storage.get("COMPANYID").company_id
            };
            let cardInfo = await UserService.getMyCardInfo(params);
            this.vipDiscount = cardInfo.discount;
        },
        // 获取用户是否可使用积分
        async getUsePointFlag(resolve) {
            let res = await Point.getUsePointFlag();
            this.Actionlist.integral.enable = res;
        },
        // 获取优惠券列表
        async getCouponsList() {
            let params = {
                shopId: this.Storage.get("USER_INFO").shopId,
                rtlOrdInterHdId: this.orderHdId,
                scopeId: 0
            };
            let couponsList = await Vouchers.getOrderCouponsList(params);
            this.disCouponList = []; //折扣券
            this.cashCouponList = []; //现金券
            couponsList.forEach(item => {
                item.disabled = false;
                if (item.discount !== null) {
                    this.disCouponList.push(item);
                } else {
                    this.cashCouponList.push(item);
                }
            });

            if (this.disCouponList.length == 0) {
                this.Actionlist.disCoupon.value = "无可用";
            } else {
                this.Actionlist.disCoupon.value = "不使用优惠券";
            }
            if (this.cashCouponList.length == 0) {
                this.Actionlist.cashCoupon.value = "无可用";
            } else {
                this.Actionlist.cashCoupon.value = "不使用优惠券";
            }
        },
        //获取价格
        async getDiscount(cardIds) {
            if (!cardIds) {
                cardIds = this.cardIdsFormat().toString();
            }
            let params = {
                companyId: this.Storage.get("COMPANYID").company_id,
                usrId: this.Storage.get("USER_INFO").usrId,
                rtlOrdInterHdId: this.orderHdId,
                cardIds: cardIds || "",
                pointFlag: this.Actionlist.integral.enable && this.isPointUsed ? 1 : 0 //是否使用积分
            };
            this.price = await Vouchers.getOrderDiscountPoint(params);
            // 如果存在积分可抵扣价格则取值,否则不显示
            if (this.Actionlist.integral.enable && this.isPointUsed == 1) {
                this.Actionlist.integral.value = "-￥" + ((+this.price.pointPirce).toFixed(2));
            } else {
                this.Actionlist.integral.value = '';
            }
            if (this.isBalanceUsed) {
                // 获取用户余额信息
                this.getUserGoldInfo();
            }
            // 设置折扣券、抵用券价格显示
            if (this.price.cashCouponPrice != 0) {
                this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.cashCouponPrice * 100) / 100);
            }
            if (this.price.storedValueCardPrice != 0) {
                this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.storedValueCardPrice * 100) / 100);
            }
            if (this.price.disCouponPrice != 0) {
                this.Actionlist.disCoupon.value = "-￥" + Number(Math.round(this.price.disCouponPrice * 100) / 100);
            }

            return this.price;
        },
        // 获取用户余额信息 设置显示值
        getUserGoldInfo() {
            let needPay = this.price.salePrice + this.transFee;
            Fund.getFundDetail({}).then(res => {
                if(res){
                    this.balance = +(res.userFund.toFixed(2));
                }else{
                    this.balance = 0;
                }
                let showUseableGold = 0;

                if (needPay > 0) {
                    if (needPay <= this.balance) {
                        showUseableGold = needPay;
                    } else {
                        showUseableGold = this.balance;
                    }
                }

                this.Actionlist.balance.value = "-￥" + ((+showUseableGold).toFixed(2));
            });
        },
        // 数据初始化
        onInit() {
            // 获取订单中间表id
            this.orderHdId = this.$route.query.orderHdId;
            // 获取购物清单
            this.getShopList();
            // 获取用户折扣
            this.getVipDiscount();
            // 获取优惠券列表
            this.getCouponsList();
            // 获取用户是否可以使用积分标志位
            this.getUsePointFlag().then(()=>{
                // 获取计算后的各种价格
                this.getDiscount();
            });
            var clientHeight =
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            window.onresize = () => {
                var nowClientHeight =
                    document.documentElement.clientHeight ||
                    document.body.clientHeight;
                if (clientHeight > nowClientHeight) {
                    //键盘弹出的事件处理
                } else {
                    //键盘收起的事件处理
                    window.scrollTo(0, 5);
                }
            };
        },
        // 订单支付支付
        toPay(billCode) {
            wxPay(this, billCode, this.actualPay).then(
                price => {
                    let goodCodes = [];
                    this.shopList.forEach(good => {
                        goodCodes.push(good.goodsCode);
                    });
                    if (price <= 0) {
                        this.saving = false;
                        this.$router.replace("/reserve" +
                            "?fromPage=order&billCode=" +
                            billCode +
                            "&goodCodes=" +
                            goodCodes
                        );
                        Order.packLevelUp({billCode:billCode});

                    } else {
                        let successUrl =
                            "/reserve" +
                            "?fromPage=order&billCode=" +
                            billCode +
                            "&goodCodes=" +
                            goodCodes;
                        let failUrl = "/waitPay?billCode=" + billCode;
                        this.saving = false;
                        this.$router.go(-1);
                        payment.miniProgramPay(price, successUrl, failUrl);
                    }
                },
                err => {
                    this.saving = false;
                    Toast("支付出错了~");
                    this.$router.replace("/waitPay?billCode=" + billCode);
                }
            );
        },
        //将选中的卡券格式化为参数,提交订单时用
        cardIdsFormat() {
            let keys = Object.keys(this.cardIds);
            let arr = [];
            keys.forEach(key => {
                if (this.cardIds[key] && this.cardIds[key] != -1) {
                    arr.push(this.cardIds[key] + "");
                }
            });
            //            console.log('arr', arr);
            return arr;
        },
        // 获取配送信息参数
        getDeliverParams() {
            let tips = {
                buyUsrMobile: "电话不能为空",
                cargoUsrName: "姓名不能为空",
                cargoMobile: "电话不能为空",
                cargoAddr: "地址不能为空",
                cargoDestrictCode: "收货人地址编码不能为空",
                recptDptId: "店铺id不能为空",
                receiptWayCode: "取货方式不能为空",
                receiptWayId: "取货方式Id不能为空"
            }
            let params = {};
            // 取出当前取货方式的参数
            for (let key in this.shipParams) {
                if (!check.isEmpty(this.shipParams[key])) {
                    params = this.shipParams[key];
                }
            }
            // 参数是否填写完整
            let isParamsAllFill = true;
            // 参数判空提示
            for (let key in params) {
                if (check.isEmpty(params[key])) {
                    Toast(tips[key]);
                    isParamsAllFill = false;
                    break;
                }
            }
            if (!isParamsAllFill) return {};
            return params;
        },
        // 提交订单
        handleEmitBill() {
            let deliverParams = this.getDeliverParams();
            if (check.isEmpty(deliverParams)) return;
            if (this.saving) return;
            this.saving = true;
            this.count++;
            let params = {
                companyId: this.Storage.get("COMPANYID").company_id,
                usrId: this.Storage.get("USER_INFO").usrId,
                billId: this.orderHdId,
                balanceFlag: this.isBalanceUsed ? 1 : 0, // 是否使用余额
                busContsCode: baseConstant.busContsCode,
                shopCode: this.Storage.get("USER_INFO").shopCode,
                shopId: this.Storage.get("USER_INFO").shopId,
                sourceCode: "D_ORDWEIN",
                cartList: this.shopList, //商品列表
                ctmUsrId: this.Storage.get("USER_INFO").usrId,
                ctmMessage: this.memo, //订单备注
                promotionList: this.cardIdsFormat(), //券数组['123',456]
                promotePartDto: [], //赠品 []
                pointFlag: this.Actionlist.integral.enable && this.isPointUsed ? 1 : 0 //是否使用积分
            };
            console.log("billPay", Object.assign(params, deliverParams));
            this.showOnLoading = true;
            Order.saveOrder(Object.assign(params, deliverParams)).then(
                billCode => {
                    this.showOnLoading = false;
                    this.toPay(billCode);
                },
                err => {
                    this.saving = false;
                }
            );

        },

    },
    computed: {
        //商品总额计算
        totalPrice: function () {
            let allAmount = 0;
            this.shopList.forEach(item => {
                allAmount += item.dealPrice * item.amount;
            });
            // console.log("allAmount")
            return allAmount;
        },
        //促销优惠计算
        promotions: function () {
            let keys = Object.keys(this.price);
            let price = 0;
            // 要计算属性写死 防止后端之后多返回字段
            let needComputedKey = ['cashCouponPrice','disCouponPrice','pointPirce','salePrice','storedValueCardPrice','vipPrice'];
            if (keys.length > 0) {
                keys.forEach(key => {
                    if(needComputedKey.indexOf(key) !== -1){
                        price += this.price[key];
                    }
                });
            }
            // console.log("promotions")
            return this.totalPrice > 0 ? this.totalPrice - price : price;
        },
        // 实付金额
        actualPay: function () {
            let actualPay = 0;
            if (this.isBalanceUsed == 1) {// 使用余额
                actualPay = (this.transFee + this.price.salePrice - this.balance);
                actualPay = actualPay < 0 ? 0 : actualPay;
            } else {
                actualPay = this.transFee + this.price.salePrice
            }
            return +(actualPay.toFixed(2));
        }
    },

    created() {
        this.onInit();
    },

    beforeDestroy() {
        this.Storage.remove('settlementAddr')
    }
};
</script>


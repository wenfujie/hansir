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
    .pay-one-good{
        display: flex;
        background: #fff;

        .pay-one-img{
            width: computed(220);
            height: computed(220);
            position: relative;
            padding-right: computed(15);

            .pay-one-type{
                position: absolute;
                left: 0;
                top:0;
                color: #fff;
                padding: 0 computed(10);
                line-height: computed(30);
                background: #D5AF6E;
                font-size: computed(22);
            }
            img{
                width: computed(220);
                height: computed(220);
            }
        }
        .pay-one-info{

            .pay-one-name{

            }
            .pay-one-cont{
                .pay-one-btn{
                    color: #999;
                    line-height: computed(36);
                    background: #F5F5F5;
                    width: computed(163);
                    font-size: computed(24);
                }
                .pay-one-price{
                    display: flex;
                    justify-content: space-between;
                    padding-top: computed(20);

                    .pay-one-num{
                        font-size: computed(20);
                    }
                }
            }
        }
    }

    .point-dialog{
        width: computed(650);
        .point-dialog-title{
            font-size: computed(36);
            text-align: center;
        }
        .point-dialog-cont{
            color: #666;
            min-height: computed(130);
        }
        .point-dialog-btn{
            text-align: center;
            color: $maincolor;
            line-height: computed(90);
            border-top: computed(2) solid #DBDBDB;
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

            <!--单个商品时-->
            <div class="pay-one-good pd30" v-if="shopList && shopList.length === 1">
                <div class="pay-one-img">
                    <img :src="getImg(shopList[0].url)" @error="errImg($event)" alt="">
                    <div class="pay-one-type" v-if="shopList[0].orderFlag == 1 || shopList[0].orderFlag == 2">定制</div>
                </div>
                <div class="pay-one-info flex-vbox flex-auto">
                    <div class="flex-auto">
                        <div class="pay-one-name fs28 flex-auto">{{shopList[0].goodsName}}</div>
                        <div class="fs24 grey99 mgT10" >
                            <span class="pdLr5 pdTb2" v-if="shopList[0] && shopList[0].mainFabricName">定制颜色：{{shopList[0].mainFabricName}}</span>
                        </div>
                    </div>
                    <div class="pay-one-cont">
                        <div class="pay-one-btn flex-center"
                             @click="viewCusList(shopList[0])">
                            <span>{{embList.length || eptList.length?'刺绣详情':'无刺绣信息'}}</span>
                            <i class="iconfont icon-down" v-if="embList.length || eptList.length"></i>
                        </div>
                        <div class="pay-one-price">
                            <div class="pay-one-money fs26B">¥{{shopList[0].dealPrice | $goldDivide}}</div>
                            <div class="pay-one-num">X{{shopList[0].amount}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 订单商品图展示 -->
            <goodImgView @viewGoods="toViewGoodList()" :goods="shopList" v-else/>
            <!-- 优惠券/积分使用控制 -->
            <action-cells :actionList="Actionlist" ref="actionCells"/>
            <!-- 价格信息展示 -->
            <div class="bg-white pd30">
                <div class="flex-between mgB20">
                    <span class="fs28">商品金额</span>
                    <span class="fs28B">
                        <span class="fs24B">¥</span>
                        {{(totalPrice - custPrice) | Fix2 | $goldDivide}}
                    </span>
                </div>
                <div class="flex-between mgB20" v-if="custPrice">
                    <span class="fs28">刺绣金额</span>
                    <span class="fs28B">
                        <span class="fs24B">¥</span>
                        {{custPrice|Fix2 | $goldDivide}}
                    </span>
                </div>
                <div class="flex-between mgB20">
                    <span class="fs28">会员折扣</span>
                    <!--<span class="fs28">会员折扣({{vipDiscount && vipDiscount!=1 ?(vipDiscount*10).toFixed(2)+'折':'无'}})</span>-->
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
        <!-- 现金券 -->
        <action-sheet
                v-model="showCashTickets"
                :title="'优惠券/体验卡'"
                type="cashCoupon"
                ref="cashCoupon"
                :coupon-list="cashCouponList"
                :s-model="cardIds.cashCouponId"
                @onSelect="onSelectCashTicket"
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
        <!--定制清单-->
        <customList v-model="showCusList"
                    :params="customList"/>
        <!--<van-popup v-model="showDalog" class="pain-dalog_point">-->
            <!--<div class="tipBox">-->
                <!--<div class="content">-->
                    <!--<div class="title">小狮妹提醒您</div>-->
                    <!--<div class="li_word">-->
                        <!--<div class="word_style">-->
                            <!--支付后还需填写身体数据信息，才能为你提供完整服务，请您务必填写喔！-->
                        <!--</div>-->
                        <!--<button @click="showDalog = false">我知道了</button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</van-popup>-->

        <!--积分说明弹窗-->
        <van-popup v-model="showPointDialogFlag">
            <div class="point-dialog">
                <p class="point-dialog-title pdTb30">积分规则</p>
                <div id="pointDialog" class="point-dialog-cont pdLr30" v-html="userPointInfo.contentText"></div>
                <div class="point-dialog-btn" @click="showPointDialogFlag = false">我知道了</div>
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
        Fund,
        Volume
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
            Dialog,
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
//                    disCoupon: {
//                        name: "折扣券",
//                        value: "无可用",
//                        action: this.onActionSheet,
//                        renderType: "arrow",
//                        type: "discTicket"
//                    },
                    cashCoupon: {
                        id:'1',
                        name: "优惠券/体验卡",
                        value: "无可用",
                        action: this.onActionSheet,
                        renderType: "arrow",
                        type: "cashTicket"
                    },
                    searchInput:{// 券搜索框
                        id:'2',
                        name: "",
                        value: "",
                        action: this.onSearchEvent,
                        renderType: "input",
                        blurAction: this.searchBlur,
                        inputAction: this.searchInput,
                        errMsg:""
                    },
                    integral: {
                        id:'3',
                        value: '',
                        name: "积分",
                        action: this.onSwitch,
                        renderType: "swicth",
                        unUseText: '',//不可用时文案用于界面提示（可用时为''）
                        clickIcon: this.onClickPointerIcon,
                        show:true,//是否展示
                        showIcon:true,//是否展示
                    },
                    balance: {
                        id:'4',
                        value: "-￥0",
                        name: "账户余额",
                        action: this.onSwitchBalance,
                        renderType: "swicth",
                        enable: true
                    },
                    memo: {
                        id:'5',
                        name: "订单备注",
                        value: "HAH",
                        action: this.onRecieveMemo,
                        renderType: "field"
                    }
                },
                userPointInfo:{},//用户积分信息
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
                    searchCouponId: null,// 搜索券id
                    disCouponId: null
                },
                showGoodsList: false, //展示商品清单上拉列表
                showCusList: false, //显示定制清单
                showDiscTickets: false, //展示折扣券上拉列表
                showCashTickets: false, //展示抵用券上拉列表
                showDalog: true, //默认显示弹窗提示
                showPointDialogFlag: false,//显示积分说明弹窗
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
//            "Actionlist.disCoupon.value"(val) {
//                if (this.$refs.disCoupon.$data.selectedModel == -2) {
//                    this.$refs.disCoupon.$data.errMsg = val;
//                } else {
//                    this.$refs.disCoupon.$data.errMsg = "";
//                }
//            }
        },

        methods: {
            // 点击积分icon
            onClickPointerIcon(){
                if(this.userPointInfo.contentText){
                    this.showPointDialogFlag = true;
                }
            },
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
            // 查找优惠券
            onSearchEvent(val){
                if (val) {
                    // 将弹框选中券重置
                    this.$refs.cashCoupon.$data.selectedModel = -1;
                    // 根据卡编号 获取卡id
                    Vouchers.getCouponsId({ cardCode: val,rtlOrdInterHdId: this.orderHdId }).then(res => {
                        if (res) {
                            this.cardIds.searchCouponId = res;
                            this.getDiscount(res,false).then(data => {
                                let price = data.cashCouponPrice || data.storedValueCardPrice || data.disCouponPrice;
                                if(price || price === 0){
                                    this.Actionlist.searchInput.errMsg = "优惠 ￥" + (Number(price).toFixed(2) * 1.0);
                                }
                                this.isSearchCouponLoad = false;// 判断查券接口是否正在加载
                            });
                        } else {
                            this.cardIds.searchCouponId = '';
                            this.Actionlist.searchInput.errMsg = "券号不存在";
                            this.isSearchCouponLoad = false;// 判断查券接口是否正在加载
                        }
                    },err=>{
                        if(err.errorCode == 880506241){
                            err.errorMsg = '该券已被使用';
                        }else if(err.errorCode == 880506236){
                            err.errorMsg = "该券状态为【未领取】或【未投放】";
                        }
                        if(err.errorMsg){
                            this.Actionlist.searchInput.errMsg = err.errorMsg;
                        }
                        this.cardIds.searchCouponId = '';
                        this.isSearchCouponLoad = false;// 判断查券接口是否正在加载
                        this.getDiscount('',false);
                    });
                }
            },
            // 查找优惠券输入框失焦
            searchBlur(val){
                if(!val){
                    this.cardIds.searchCouponId = ''
                    this.Actionlist.searchInput.errMsg = "";
                    this.getDiscount('',false).then(data => {});

                }else{
                    this.isSearchCouponLoad = true;// 判断查券接口是否正在加载
                    this.onSearchEvent(val);
                }
            },
            // 查找优惠券输入框值改变
            searchInput(val){
                this.searchInputValue = val;
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

            //抵用券选用回调
            async onSelectCashTicket(item) {

                this.cardIds.cashCouponId = item.cardId;
                // 选择不使用抵用券，折扣券将状态置为可选
                if (!item.cardId || item.cardId == -1) {
                    this.Actionlist.cashCoupon.value = item.couponName;
                    this.getDiscount();
                    return;
                }

                this.$refs.actionCells.inputEvent('clear');
                this.Actionlist.searchInput.errMsg = "";
                this.getDiscount();
            },

            //查看商品清单
            toViewGoodList(state) {
                this.showGoodsList = true;
            },
            // 查看定制清单
            viewCusList(good) {
                console.log(good)
                for(let i=0;i<good.partList.length;i++){
                    let item = good.partList[i];
                    if(item.emb.length || item.ept.length){
                        this.customList = good;
                        this.showCusList = true;
                        break;
                    }
                }
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
            // 获取用户是否可使用积分 旧版
//            async getUsePointFlag(resolve) {
//                let res = await Point.getUsePointFlag();
//                this.Actionlist.integral.enable = res;
//            },
            // 获取用户是否可使用积分 新版
            async getUsePointFlag(resolve) {
                let res = await UserService.getMinIntegral();
                this.userPointInfo = res;
                // "integralFlag":  启用积分抵现 1：启用；0停用;  "effFlag": 状态 1：启用；0停用
                if(this.userPointInfo.effFlag != 1 || this.userPointInfo.integralFlag != 1){
                    this.Actionlist.integral.show = false;
                }
                if(!this.userPointInfo.contentText){
                    this.Actionlist.integral.showIcon = false;
                }
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
                if (this.cashCouponList.length == 0) {
                    this.Actionlist.cashCoupon.value = "无可用";
                } else {
                    this.Actionlist.cashCoupon.value = "不使用优惠券/体验卡";
                }
            },
            //获取价格
            async getDiscount(cardIds,setCouponFlag=true) {
                if (!cardIds) {
                    cardIds = this.cardIdsFormat().toString();
                }
                let params = {
                    companyId: this.Storage.get("COMPANYID").company_id,
                    usrId: this.Storage.get("USER_INFO").usrId,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: cardIds || "",
                    pointFlag: this.checkoutUsePoint ? 1 : 0 //是否使用积分
                };
                this.price = await Vouchers.getOrderDiscountPoint(params);
                // 如果存在积分可抵扣价格则取值,否则不显示
                if (this.checkoutUsePoint) {
                    this.Actionlist.integral.value = `使用${this.price.point}积分抵扣` + ((+this.price.pointPirce).toFixed(2)) + '元';
                } else {
                    this.Actionlist.integral.value = '';
                }
                if (this.isBalanceUsed) {
                    // 获取用户余额信息
                    this.getUserGoldInfo();
                }

                if(setCouponFlag && this.cardIds.cashCouponId > 0){
                    // 设置折扣券、抵用券价格显示
                    if (this.price.cashCouponPrice != 0) {
                        this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.cashCouponPrice * 100) / 100);
                    }
                    if (this.price.storedValueCardPrice != 0) {
                        this.Actionlist.cashCoupon.value = "-￥" + Number(Math.round(this.price.storedValueCardPrice * 100) / 100);
                    }
                }

                if(this.Actionlist.integral.show){// 是否启用积分
                    let text = '';
                    // 是否满足积分使用第一步
                    if(this.userPointInfo.moreThanMin){//满足
                        // 是否满足积分使用第二步
                        let checkPrice = this.price.salePrice + (this.price.pointPirce?this.price.pointPirce:0);
                        // 商品价格（扣除积分前所有应扣价格）  >=  最低积分使用额度
                        if(checkPrice >= this.userPointInfo.integralValue * this.userPointInfo.ltnMinIntegral){
                            text = '';
                            if(!this.checkoutUsePoint){// 积分原本不可用
                                this.Actionlist.integral.unUseText = text;
                                if(this.isPointUsed){
                                    this.getDiscount();
                                }
                            }else{
                                this.Actionlist.integral.unUseText = text;
                            }
                        }else{
                            text = `共${this.userPointInfo.useablePoints}积分，当前订单可用0积分`;
                            if(this.checkoutUsePoint){// 积分原本可用
                                this.Actionlist.integral.unUseText = text;
                                this.getDiscount();
                            }else{
                                this.Actionlist.integral.unUseText = text;
                            }
                        }
                    }else{// 不满足
                        text = `共${this.userPointInfo.useablePoints}积分，满${this.userPointInfo.ltnMinIntegral}积分可用`;
                        if(this.checkoutUsePoint){
                            this.Actionlist.integral.unUseText = text;
                            this.getDiscount();
                        }else{
                            this.Actionlist.integral.unUseText = text;
                        }
                    }
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

//                // 获取用户是否可以使用积分标志位
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
                            // todo 临时改预约量体流程之后可能改回来
//                    let successUrl = "/reserve" + "?fromPage=order&billCode=" + billCode + "&goodCodes=" + goodCodes;
                            let successUrl = "/submitSuccess" + "?billCode=" + billCode + "&fromPage=payCode";
                            if (price <= 0) {
                                this.saving = false;
                                this.$router.replace(successUrl);
                                Order.packLevelUp({billCode:billCode});
                                Order.lockStock({billCode:billCode,operType:'FRONT_PAY'});
                            } else {
                                let failUrl = "/waitPay?billCode=" + billCode+"&ordStatusCode=D_ORDSPAYING";
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
                for(let i=0;i<keys.length;i++){
                    let item = this.cardIds[keys[i]];
                    if(item && item > 0){
                        arr[0] = item;
                        break;
                    }
                }
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
                // 判断搜索券是否正确
                if(this.isSearchCouponLoad){
                    return
                }else{
                    if(this.searchInputValue && !this.cardIds.searchCouponId){// 查券框有值 但查不到券
                        this.$refs.actionCells.inputEvent('focus');
                        return;
                    }
                }

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
                    pointFlag: this.checkoutUsePoint ? 1 : 0 //是否使用积分
                };
                console.log("billPay", Object.assign(params, deliverParams));
                this.showOnLoading = true;
                Order.saveOrder(Object.assign(params, deliverParams)).then(
                        billCode => {
                            this.showOnLoading = false;
                            this.toPay(billCode);

                            // todo 调用预约接口
                            this.appointMeas(billCode);
                            // Storage.remove("reserveParams");
                        },
                        err => {
                            this.saving = false;
                        }
                );

            },
            // 提交预约量体
            appointMeas(billCode){
                let prePageParams = this.routeParams;
                if(Storage.get('toReserveParams').measureOpCode == 'D_MSROPSIZE'){//尺码 固定走4
                    this.measure(billCode,prePageParams).then(res=>{
                    },err=>{
//                    this.saving = false;
//                    Toast("生成预约量体单出错了~");
//                    this.$router.replace("/waitPay?billCode=" + billCode);
                    })
                }else{// 量体-21 3或4
                    this.appointAndMeasure(billCode,prePageParams).then(res=>{
                    },err=>{
//                    this.saving = false;
//                    Toast("生成预约量体单出错了~");
//                    this.$router.replace("/waitPay?billCode=" + billCode);
                    })
                }
            },
            // 4.只走量体
            measure(billCode,prePageParams){
                prePageParams.liangti.billCode = billCode;
                if(!prePageParams.liangti)return;
                var data ={
                    "billCode":billCode,
                    "usrName":prePageParams.liangti.usrName,
                    "id":prePageParams.liangti.id,
                    "features": prePageParams.liangti.figureDtos|| prePageParams.liangti.features ||[]
                }
                return UserService.updateChimaInfo(data)
            },
            // 21 3/4.
            appointAndMeasure(billCode,prePageParams){
                var data = {
                    usrId: Storage.get('USER_INFO').usrId,
                    ownCompanyId: Storage.get("COMPANYID").company_id,
                    companyId: Storage.get("COMPANYID").company_id,
                    ordHdCode: billCode,
                    buscontsCode: baseConstant.busContsCode
                };
                return Volume.getBillType(data).then(res=>{
                    var s_array = []
                    for (var i = 0; i < res.length; i++) {
                        // 新加代码
                        if (res[i].measureOpCode == "D_MSROPMSR") {
                            var data = {
                                saleOrdDtId: res[i].id
                            }
                            s_array.push(data)
                        }
                    }
                    prePageParams.yuyue.rtlOrdHdCode = billCode;
                    prePageParams.yuyue.saleOrdDtList = s_array;

                    return Volume.saveVolume(prePageParams.yuyue).then(params=>{
                        console.log("updateParams有数据",prePageParams)
                        console.log("有id",params.id)
                        if(!prePageParams.liangti)return;
                        if(params.id){// 有id 3
                            var updateParams = {
                                billCode:billCode,
                                saleMeasureHdId:params.id,
                                usrName:prePageParams.liangti.usrName,
                                features: prePageParams.liangti.figureDtos||prePageParams.liangti.features || [],
                                id: prePageParams.liangti.id
                            }
                            return UserService.updateMemberBodyInfo(updateParams)
                        }else{// 无id 4
                            return this.measure(billCode,prePageParams);
                        }
                    })
                })
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
            },
            // 单件商品 有绣字部件列表
            embList(){
                let partList = this.shopList[0].partList;
                if(partList && partList.length){
                    return partList.filter((item)=>{
                        if(item.emb.length){
                            return true;
                        }
                    })
                }else{
                    return [];
                }
            },
            // 单件商品 有绣花部件列表
            eptList(){
                let partList = this.shopList[0].partList;
                if(partList && partList.length){
                    return partList.filter((item)=>{
                        if(item.ept.length){
                            return true;
                        }
                    })
                }else{
                    return [];
                }
            },
            // 绣字或绣花的价格
            custPrice(){
                if(this.shopList.length == 1){
                    if(this.embList.length){
                        return this.embList[0].emb[0].embprice * this.shopList[0].amount;
                    }
                    if(this.eptList.length){
                        return this.eptList[0].ept[0].embprice * this.shopList[0].amount;
                    }
                    return 0;
                }else{
                    return 0;
                }
            },
            // 判断是否使用积分
            checkoutUsePoint(){
                return this.Actionlist.integral.show && !this.Actionlist.integral.unUseText && this.isPointUsed;
            },
        },

        created() {
            this.routeParams = this.$route.params;
            console.log(this.routeParams,"============")
            
            console.log("原来在这",this.$route.params)
            let keyArr = Object.keys(this.routeParams);
            if(keyArr.length){
                Storage.set("reserveParams",this.routeParams);
            }else{
                // 路由没带参情况（仅选择地址页后返回）
                this.routeParams = Storage.get("reserveParams");
            }
            this.onInit();
        },

        beforeDestroy() {
            this.Storage.remove('settlementAddr')
        }
    };
</script>


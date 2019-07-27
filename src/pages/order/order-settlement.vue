/*
* createTime：2018/11/7
* author：fujie.wen
* description: 订单结算
*/
<template>
    <div class="container">

        <!--量体数据 三种头部： 1.着装人=》量体时间(已有量体数据)  2.联系人=》预约时间（无量体数据） 3.空-->
        <div class="pay-cell pay-measure-model mgB30">

            <!--量体状态为3.空-->
            <div class="pay-cell-left pay-flex1" v-if="!measureData || !measureData.billCode" @click="toMeasurePage">
                <p class="pay-measure-describe">您购买的订制商品需要您的身体数据</p>
                <p class="pay-measure-describe">请前往预约测量身体数据</p>
            </div>

            <!--量体状态为1.着装人=》量体时间  2.联系人=》预约时间-->
            <div class="pay-cell-left pay-flex1 pay-call" v-else @click="toMeasurePage">
                <span class="pay-call-user">{{true?'着装人':'联系人'}}：{{measureData.cargousrName}} </span>
                <span>{{true?'量体':'预约'}}时间：{{measureData.orderTime}} </span>
            </div>
            <div class="pay-cell-right flex-vcenter">
                <i class="iconfont icon-gengduo pay-icon-more"></i>
            </div>
        </div>

        <!--配送方式-->
        <div class="pay-get-type mgB30">
            <!--Tab-->
            <div class="pay-get-tab">
                <div class="flex-center">
                    <div :class="['flex-auto', 'fs28', 'pay-nav',{'nav-selected':delivery === item.shipCode}]"
                         @click="checkTabNav(item,index)"
                         v-for="(item,index) in deliveryType" :key="item.id">
                        {{item.shipName}}
                    </div>
                </div>
            </div>

            <!--快递配送-->
            <div v-show="delivery === 'kdps'">
                <!--已添加地址-->
                <div class="pay-get-address pd30 flex-box" v-if="addressMsg.id"  @click="changeAddress">
                    <div class="pay-address-left flex-vcenter">
                        <i class="iconfont icon-dizhidingwei pay-icon-addr"></i>
                    </div>
                    <div class="flex-auto pdLr30 pay-address-center">
                        <div class="pay-user-info">
                            <span>{{addressMsg.cargousrName}}</span>
                            <span class="pdLr30">{{addressMsg.cargoPhone}}</span>
                            <span class="pay-default" v-show="addressMsg.defaultFlag == 1">默认</span>
                        </div>
                        <p class="pay-address-cont">{{addressMsg.destDesc + addressMsg.address}}</p>
                    </div>
                    <div class="pay-address-right flex-vcenter">
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
                <!--未添加地址-->
                <div class="flex-vbox flex-center pay-no-address" @click="changeAddress" v-else>
                    <i class="iconfont icon-dizhidingwei pay-icon-addr"></i>
                    <span class="pay-no-address-msg">请添加收货地址</span>
                </div>
            </div>

            <!--门店自取-->
            <div v-show="delivery === 'mdzq'">
                <ul class="pay-selftake-list pdLr30">
                    <li class="pay-selftake-item flex-vcenter">
                        <div class="fs28 pay-item-label">取货人</div>
                        <div class="flex-auto pay-item-form">
                            <van-field
                                    v-model="storeTakeForm.username"
                                    clearable
                                    maxlength="40"
                                    placeholder="输入姓名"
                            />
                        </div>
                    </li>
                    <li class="pay-selftake-item flex-vcenter">
                        <div class="fs28 pay-item-label">联系方式</div>
                        <div class="flex-auto pay-item-form">
                            <van-field
                                    v-model="storeTakeForm.phone"
                                    clearable
                                    maxlength="11"
                                    type="number"
                                    placeholder="输入联系方式"
                            />
                        </div>
                    </li>
                    <li class="pay-selftake-item flex-vcenter" @click="showAreaList = true">
                        <div class="fs28 pay-item-label">取货地区</div>
                        <div class="flex-auto pay-item-form">
                            <van-field
                                    v-model="storeTakeForm.address"
                                    clearable disabled
                                    placeholder="选择取货地区"
                            />
                        </div>
                        <div class=" pay-item-right">
                            <i class="iconfont icon-gengduo"></i>
                        </div>
                    </li>
                    <li class="pay-selftake-item flex-vcenter" @click="toSelectStore(true)">
                        <div class="fs28 pay-item-label">取货门店</div>
                        <div class="flex-auto pay-item-form">
                            <van-field
                                    v-model="storeTakeForm.realStoreName"
                                    clearable disabled
                                    placeholder="选择取货门店"
                            />
                        </div>
                        <div class=" pay-item-right">
                            <i class="iconfont icon-gengduo"></i>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <!--商品信息-->
        <div class="pay-good-info mgB30">
            <!--单件情况-->
            <div class="pay-one-good pd30" v-if="shoppingCartList && shoppingCartList.length === 1">
                <div class="pay-one-img">
                    <img :src="getImg(shoppingCartList[0].url)" @error="errImg($event)" alt="">
                    <div class="pay-one-type" v-if="shoppingCartList[0].orderFlag == 1 || shoppingCartList[0].orderFlag == 2">定制</div>
                </div>
                <div class="pay-one-info flex-vbox flex-auto">
                    <div class="pay-one-name fs28 flex-auto">{{shoppingCartList[0].goodsName}}</div>
                    <div class="pay-one-cont">
                        <div class="pay-one-btn flex-center" @click="showCustomList(shoppingCartList[0])">
                            <span>定制清单</span>
                            <i class="iconfont icon-down"></i>
                        </div>
                        <div class="pay-one-price">
                            <div class="pay-one-money fs26B">¥{{shoppingCartList[0].dealPrice | $goldDivide}}</div>
                            <div class="pay-one-num">X1</div>
                        </div>
                    </div>
                </div>
            </div>

            <!--大于一件情况-->
            <div class="pay-more-good pd30" v-else>
                <div class="pay-more-title fs30">共{{shoppingCartList.length}}件商品</div>
                <div class="pay-more-cont flex-between" @click="showActionList(true,2)">
                    <ul class="pay-more-list">
                        <li class="pay-more-item" v-for="(item,index) in shoppingCartList" v-if="index<=2" :key="index">
                            <img :src="getImg(item.url)" @error="errImg($event)" alt="">
                            <div class="pay-more-type" v-if="item.orderFlag == 1 || item.orderFlag == 2">定制</div>
                        </li>
                    </ul>
                    <div class="pay-more-right">
                        <i class="iconfont icon-gengduo fs26"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="pay-reduce-area mgB30">
            <ul class="pay-reduce-list pdLr30">
                <li class="pay-reduce-item flex-vcenter" @click="showDeducActionList(true)">
                    <div class="pay-item-label">折扣券</div>
                    <div class="flex-auto pay-item-form" v-if="!disCouponList.length">
                        无可用
                    </div>
                    <div :class="['flex-auto', 'pay-item-form', 'fs28',{'fs28B':disCouponRadio>=0}]" v-else>
                        {{disCouponRadio>=0?`-¥${allPrice.disCoupon}`:'不使用折扣券'}}
                    </div>
                    <div class=" pay-item-right">
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </li>
                <li class="pay-reduce-item flex-vcenter"  @click="showActionList(true)">
                    <div class="pay-item-label">现金券</div>
                    <div class="flex-auto pay-item-form" v-if="!cashCouponList.length">
                        无可用
                    </div>
                    <div :class="['flex-auto', 'pay-item-form', 'fs28',{'fs28B':cashCouponRadio>=0}]" v-else>
                        {{cashCouponRadio>=0?`-¥${allPrice.cashCoupon}`:'不使用折扣券'}}
                    </div>
                    <div class=" pay-item-right">
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </li>
                <li class="pay-reduce-item flex-vcenter" v-if="usePointFlag">
                    <div class="pay-item-label">积分</div>
                    <div class="flex-auto pay-item-form fs28B">
                        {{checked?`-¥${allPrice.point}`:''}}
                    </div>
                    <div class="pay-item-right flex-vcenter">
                        <van-switch
                                :value="checked"
                                active-color="#000"
                                inactive-color="#e6e6e6"
                                @input="onInputSwitch"
                        />
                    </div>
                </li>
                <li class="pay-reduce-item flex-vcenter">
                    <div class="pay-item-label">订单备注</div>
                    <div class="flex-auto pay-item-form">
                        <van-field
                                maxlength="150"
                                v-model="memo"
                                clearable
                                placeholder="订单备注"
                        />
                    </div>
                </li>
            </ul>
        </div>

        <div class="pay-count">
            <ul class="pay-count-list pdLr30">
                <li class="pay-count-item flex-between">
                    <span class="fs28">商品金额</span>
                    <span class="fs28B">¥{{allAmount | $goldDivide}}</span>
                </li>
                <li class="pay-count-item flex-between">
                    <span class="fs28">会员折扣({{vipDiscount?vipDiscount:'无'}})</span>
                    <span class="fs28B">-¥{{allPrice.vip | $goldDivide}}</span>
                </li>
                <li class="pay-count-item flex-between">
                    <span class="fs28">促销优惠</span>
                    <span class="fs28B">-¥{{promotions | $goldDivide}}</span>
                </li>
                <li class="pay-count-item flex-between" v-show="this.delivery === 'kdps'">
                    <span class="fs28">运费</span>
                    <span class="fs28B">{{transFee == 0?'包邮':`+¥${transFee}`}}</span>
                </li>
            </ul>
        </div>

        <!--折扣券上拉菜单-->
        <van-actionsheet v-model="showDisCouponActionSheet">
            <div class="pay-action">
                <div class="pay-action-header flex-center">
                    <p>折扣券</p>
                    <i class="iconfont icon-guanbi pay-close" @click="showDeducActionList(false)"></i>
                </div>
                <ul class="pay-action-list pdLr30">
                    <!--不使用折扣券时 没有价格-->
                    <li class="pay-action-item flex-between flex-vcenter" @click="selecteVoucher('disCoupon',-1)">
                        <div class="fs28 flex-auto">不使用折扣券</div>
                        <div class="flex-vcenter">
                            <div class="pay-action-radio">
                                <van-radio :name="-1" v-model="disCouponRadio"></van-radio>
                            </div>
                        </div>
                    </li>
                    <li :class="['pay-action-item', 'flex-between', 'flex-vcenter',{'pay-action-item-disabled':item.disabled}]"
                        @click="selecteVoucher('disCoupon',index,item)"
                        v-for="(item,index) in disCouponList"
                        :key="index">
                        <div class="fs28 flex-auto">{{item.couponName}}</div>
                        <div class="flex-vcenter">
                            <div class="fs26B">{{item.discount*10}}折</div>
                            <div class="pay-action-radio">
                                <van-radio :name="index" v-model="disCouponRadio" :disabled="item.disabled"></van-radio>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="pay-action-btn" @click="showDeducActionList(false)">关闭</div>
        </van-actionsheet>

        <!--现金券上拉菜单-->
        <van-actionsheet v-model="showActionSheet">
            <div class="pay-action">
                <div class="pay-action-header flex-center">
                    <p>现金券</p>
                    <i class="iconfont icon-guanbi pay-close" @click="showActionList(false)"></i>
                </div>
                <ul class="pay-action-list pdLr30">
                    <!--不使用现金券时 没有价格-->
                    <li class="pay-action-item flex-between flex-vcenter" @click="selecteVoucher('cashCoupon',-1)">
                        <div class="fs28 flex-auto">不使用现金券</div>
                        <div class="flex-vcenter">
                            <div class="pay-action-radio">
                                <van-radio :name="-1" v-model="cashCouponRadio"></van-radio>
                            </div>
                        </div>
                    </li>
                    <li :class="['pay-action-item', 'flex-between', 'flex-vcenter',{'pay-action-item-disabled':item.disabled}]"
                        @click="selecteVoucher('cashCoupon',index,item)"
                        v-for="(item,index) in cashCouponList" :key="index">
                        <div class="fs28 flex-auto">{{item.couponName}}</div>
                        <div class="flex-vcenter">
                            <div class="fs26B">¥{{item.cardClassDto.classCode === '001'?item.cardCard.remainAmount:item.initialValue}}</div>
                            <div class="pay-action-radio">
                                <van-radio :name="index" v-model="cashCouponRadio" :disabled="item.disabled"></van-radio>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="pay-action-btn" @click="showActionList(false)">关闭</div>
        </van-actionsheet>

        <!--省市区弹窗-->
        <van-popup v-model="showAreaList" position="bottom">
            <van-area :area-list="areaList" @confirm="areaChange" @cancel="showAreaList = false" :visible-item-count="5" />
        </van-popup>

        <!--门店弹窗-->
        <van-popup v-model="showStoreList" position="bottom">
            <van-picker :columns="storeList" show-toolbar @cancel="showStoreList = false" @confirm="selectStore"/>
        </van-popup>

        <!--定制清单-->
        <custom-list :params="cusParams" ref="customList"> </custom-list>

        <!--商品清单-->
        <van-popup v-model="showGoodsList" position="bottom">
            <div class="good-action pdLr30">
                <div class="good-action-header flex-center">
                    <p>商品清单</p>
                    <i class="iconfont icon-guanbi good-close" @click="showActionList(false,2)"></i>
                </div>

                <ul class="good-action-list">
                    <li class="good-action-item pdTb30 good-action-border-b"
                        v-for="(item,index) in shoppingCartSingleList"
                        :key="index">
                        <div class="pay-some-good">
                            <div class="pay-some-img">
                                <img :src="getImg(item.url)" @error="errImg($event)" alt="">
                                <div class="pay-some-type" v-if="item.orderFlag == 1 || item.orderFlag == 2">定制</div>
                            </div>
                            <div class="pay-some-info flex-vbox flex-auto">
                                <div class="pay-some-name fs28 flex-auto">{{item.goodsName}}</div>
                                <div class="pay-some-cont">
                                    <div class="pay-some-btn flex-center" @click="showCustomList(item)">
                                        <span>定制清单</span>
                                        <i class="iconfont icon-down"></i>
                                    </div>
                                    <div class="pay-some-price">
                                        <div class="pay-some-msomey fs26B">¥{{item.dealPrice | $goldDivide}}</div>
                                        <div class="pay-some-num">X1</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <div class="good-suit" v-if="shoppingCartSuitList.length > 0">
                    <div class="good-suit-head flex-between">
                        <div class="fs28">3D定制商务套装</div>
                        <div>
                            <span class="fs24 good-head-label">套餐价</span>
                            <span class="fs26">¥{{suitAmount | $goldDivide}}</span>
                        </div>
                    </div>

                    <ul class="good-action-list">
                        <li class="good-action-item pdTb30"
                            v-for="(item,index) in shoppingCartSuitList"
                            :key="index">
                            <div class="pay-some-good">
                                <div class="pay-some-img">
                                    <img :src="getImg(item.url)" @error="errImg($event)" alt="">
                                    <div class="pay-some-type" v-if="item.orderFlag == 1 || item.orderFlag == 2">定制</div>
                                </div>
                                <div class="pay-some-info flex-vbox flex-auto">
                                    <div class="pay-some-name fs28 flex-auto">{{item.goodsName}}</div>
                                    <div class="pay-some-cont">
                                        <div class="pay-some-btn flex-center" @click="showCustomList(item)">
                                            <span>定制清单</span>
                                            <i class="iconfont icon-down"></i>
                                        </div>
                                        <div class="pay-some-price">
                                            <div class="pay-some-msomey fs26B">¥{{item.dealPrice | $goldDivide}}</div>
                                            <div class="pay-some-num">X1</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </van-popup>

        <div class="shade-style" v-show="isLoading">
            <div class="loading-style">
                <van-loading type="spinner" color="white"/>
            </div>
        </div>

        <!--底部按钮-->
        <div class="pay-foot">
            <div class="pay-foot-text">
                <span class="pay-foot-describe fs24">实付金额：</span>
                <span class="pay-foot-money fs30B">¥{{payAmount | $goldDivide}}</span>
            </div>
            <div class="pay-foot-btn fs30" @click="handleEmitBill" >提交订单</div>
        </div>
    </div>
</template>

<script>
    import {Base,Order,UserService,Vouchers,Payment,Point} from '../../api/service';
    import Storage from '../../util/storage';
    import { Dialog,Field,Switch,Actionsheet,Radio,Popup,Area,Toast,Picker,Loading } from 'vant';
    import customList from "./components/customList-params";
    import wxPay from "@/util/wxPay";
    import payment from '../../util/payment';

    export default {
        components: {
            Dialog,
            customList,
            'van-field':Field,
            'van-switch':Switch,'van-actionsheet':Actionsheet,
            'van-radio':Radio,
            'van-area': Area,
            'van-popup': Popup,
            'van-picker': Picker,
            'van-loading': Loading
        },

        data () {
            return {
                delivery:"",//选中配送方式id
                deliveryType:[],//配送方式tab
                addressMsg:{},//快递配送地址信息
                storeTakeForm:{// 门店自取表单
                    username:"",
                    phone:"",
                    address:"",// 地址名
                    addressId:"",//  地址id
                    storeId:"",// 店铺id
                    storeName:"",// 店铺名(假 地址)
                    realStoreName:"",//真店铺名
                },
                checked:true,// 积分开关
                showActionSheet: false,//现金券上拉菜单显示
                showDisCouponActionSheet: false,//折扣券上拉菜单显示
                areaList: {},// 地址列表
                showAreaList: false,//显示省市区选择器
                storeList: [], //  门店列表
                showStoreList: false,//显示门店选择器
                transFee:0,//运费
                shoppingCartList:[],//商品列表
                shoppingCartSingleList:[],//商品列表-定制单品
                shoppingCartSuitList:[],//商品列表-套装
                disCouponRadio:-1,// 折扣券值
                cashCouponRadio:-1,// 现金券值
                disCouponList: [], //  折扣券列表
                cashCouponList: [], //  现金券列表
                allPrice:{// 优惠价格展示
                    disCoupon:0,//优惠券
                    cashCoupon:0,//现金券
                    point:0,//积分
                    vip:0,//vip折扣价
                    total:0,//总价
                },
                vipDiscount:"",//vip折扣
                cusParams: {},// 定制清单组件参数
                memo:"",// 订单备注
                showGoodsList:false,//显示商品清单
                measureData:{//量体数据
                    cargousrName:"",
                    orderTime:"",
                    billCode:""
                },
                promotions:0,//促销优惠价格=》前端计算
                usePointFlag:false,//用户是否可使用积分
                isLoading:false,//显示loading标志
            }
        },
        computed:{
            // 实际金额
            payAmount(){
                let gold = 0;
                if(this.delivery == 'kdps'){
                    gold = this.allPrice.total + this.transFee;
                }else{
                    gold = this.allPrice.total;
                }
                return gold.toFixed(2);
            },

            // 所有商品金额(未计算折扣)
            allAmount(){
                let allAmount = 0;
                this.shoppingCartList.forEach(item=>{
                    allAmount += item.dealPrice;
                })
                return allAmount.toFixed(2)*1.00;
            },

            // 套装商品金额
            suitAmount(){
                let suitAmount = 0;
                this.shoppingCartSuitList.forEach(item=>{
                    suitAmount += item.dealPrice;
                })
                return suitAmount.toFixed(2)*1.00;
            },

            // 当前选中tab对象
            currentNav(){
                for(let i=0;i<this.deliveryType.length;i++){
                    if(this.deliveryType[i].shipCode == this.delivery){
                        return this.deliveryType[i]
                    }
                }
                return {};
            },
        },
        created () {
            this.initPageFunction();
        },
        watch:{
            '$route'(data){
                if(data.path.indexOf("/order-settlement") != -1){
                    this.initPageFunction();
                }
            }
        },
        methods: {
            // 切换页面后回到"订单结算" 需初始化页面方法
            initPageFunction(){
                this.orderHdId = this.$route.query.orderHdId;
                this.isLoading = true;
                this.clearData();
                let p1 = new Promise((resolve)=>{
                    this.getPage(resolve);
                })
                let p2 = new Promise((resolve)=>{
                    this.getUsePointFlag(resolve);
                })

                Promise.all([p1,p2]).then((res)=>{
                    this.getDiscount('');
                    this.isLoading = false;
                })
                this.getShipType();
                this.getCouponsList();
                this.getVipDiscount();
                this.getCityData();
                this.getAddr();
                this.getMeasureData();//获取预约量体数据

                this.isLoadingSwitch = false;
                this.saving = false;
            },

            // 获取用户是否可使用积分
            getUsePointFlag(resolve){
                Point.getUsePointFlag().then((res)=>{
                    this.checked = res?true:false;
                    this.usePointFlag = res?true:false;
                    typeof resolve ==="function" && resolve(res);
                })
            },

            // 重返页面清空数据
            clearData(){
                this.disCouponRadio = -1;// 折扣券值
                this.cashCouponRadio = -1;// 折扣券值
                this.checked = true;
                this.storeTakeForm.storeId = "";
                this.storeTakeForm.storeName = "";
                this.storeTakeForm.realStoreName = "";
                this.shoppingCartList = [];
                this.memo = "";
            },

            //获取预约量体数据
            getMeasureData(){
                let measureData = Storage.get("settlementData");
                if(measureData){
                    if(measureData.statusCodes == "MEASURE_FINISHED"){//选择量体数据时 数据不同处理
                        this.measureData.orderTime = measureData.measureLog.substring(0,10);
                        this.measureData.cargousrName = measureData.dressedusrName;
                        this.measureData.billCode = measureData.saleMeasureHdBillCode;
                    }else{
                        this.measureData.orderTime = measureData.orderTime.substring(0,10);
                        this.measureData.cargousrName = measureData.cargousrName;
                        this.measureData.billCode = measureData.billCode;
                    }
                }else{
                    this.measureData = {//量体数据
                        cargousrName:"",
                        orderTime:"",
                        billCode:""
                    }
                }
            },

            // 前往选择量体页
            toMeasurePage(){
                let ptiPartHdIdString = "";
                this.shoppingCartList.forEach((item,index)=>{
                    ptiPartHdIdString += (index > 0?','+item.ptiPartHdId:item.ptiPartHdId);
                })
                let data = `?fromPage=settlement&ptiParthdId=${ptiPartHdIdString}`;
                this.$router.push("/choiceDressed"+data);
            },

            // 显示定制清单
            showCustomList(item){
                this.cusParams = item;
                this.$nextTick(()=>{
                    this.$refs.customList.showCustomList();
                })
            },

            // 获取会员折扣
            getVipDiscount(){
                let data = {
                    "wxUnionid":baseConstant.signUpTypeCode,
                    "usrId":Storage.get('USER_INFO').usrId,
                    "companyId":Storage.get('COMPANYID').company_id
                };
                UserService.getMyCardInfo(data).then(res=>{
                    this.vipDiscount = res.vipDiscount;
                })
            },

            //'disCoupon',-1
            /**
             * 选中券事件
             * @param type 'cashCoupon':现金券  'disCoupon':折扣券
             * @param index 选中券索引 -1标识不使用
             * @param item 选中券数据 -1时为undefined
             */
            selecteVoucher(type,index,item){
                if(item && item.disabled)return
                if(type === "disCoupon"){
                    this.showDisCouponActionSheet = false;
//                    if(this.disCouponRadio === index)return;
                    this.disCouponRadio = index;
                }else{
                    this.showActionSheet = false;
//                    if(this.cashCouponRadio === index)return;
                    this.cashCouponRadio = index;
                }
                let cardsId = this.getCurrentTicket();
                console.log(cardsId)
                this.getDiscount(cardsId);
                this.getCanUseCouponsList(type);
            },

            // 获取当前选中券 type:返回格式 1=>'12,23' 2=>['12','23']
            getCurrentTicket(type=1){
                let cardIdArr = [];
                if(this.cashCouponRadio >= 0){
                    cardIdArr.push(this.cashCouponList[this.cashCouponRadio].cardId);
                }
                if(this.disCouponRadio >= 0){
                    cardIdArr.push(this.disCouponList[this.disCouponRadio].cardId);
                }

                if(type == 2){
                    return cardIdArr;
                }

                return cardIdArr.join(",");
            },

            //  获取结算页面优惠金额 cardIds: ‘cardId1,cardId2’
            getDiscount(cards,callback) {
                let data = {
                    companyId: Storage.get('COMPANYID').company_id,
                    usrId: Storage.get('USER_INFO').usrId,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: cards,
                    pointFlag: this.checked?1:0//是否使用积分
                };
                Vouchers.getOrderDiscountPoint(data).then((res) => {
                    if(this.cashCouponRadio >= 0 ){
                        if(this.cashCouponList[this.cashCouponRadio].cardClassDto.classCode != '001'){
                            this.allPrice.cashCoupon = Number(res.cashCouponPrice).toFixed(2) * 1.00;//现金券
                        }else{
                            this.allPrice.cashCoupon = Number(res.storedValueCardPrice).toFixed(2) * 1.00;//储值卡
                        }
                    }else{
                        this.allPrice.cashCoupon = 0;
                    }
                    this.allPrice.total = res.salePrice.toFixed(2) * 1.00;
                    this.allPrice.vip = Number(res.vipPrice).toFixed(2) * 1.00;
                    this.allPrice.point = res.pointPirce?Number(res.pointPirce).toFixed(2) * 1.00:0;
                    this.allPrice.disCoupon = Number(res.disCouponPrice).toFixed(2) * 1.00;
                    this.promotions = (this.allAmount - this.allPrice.disCoupon - this.allPrice.cashCoupon - this.allPrice.point - this.allPrice.vip - this.allPrice.total).toFixed(2);
                    typeof callback === "function" && callback();
                }).catch((err)=>{
                    typeof callback === "function" && callback();
                });
            },

            // 获取结算页面可用优惠券列表
            getCouponsList() {
                let data = {
                    shopId: Storage.get("USER_INFO").shopId,
                    rtlOrdInterHdId: this.orderHdId,
                    scopeId: 0,
                };
                Vouchers.getOrderCouponsList(data).then((res) => {
                    // 赋空值（监听$route防止多次push）
                    this.disCouponList = [];
                    this.cashCouponList = [];
                    res.forEach((item) => {
                        item.disabled = false;
                        if (item.discount !== null) {
                            this.disCouponList.push(item);
                        } else {
                            this.cashCouponList.push(item);
                        }
                    });
                });
            },

            // 选券后获取可用券列表，设置券禁用状态 type 'cashCoupon':现金券  'disCoupon':折扣券
            getCanUseCouponsList(type){
                let data = {
                    ownCompanyId: Storage.get('COMPANYID').company_id,
                    rtlOrdInterHdId: this.orderHdId,
                    cardIds: this.getCurrentTicket(1)
                };
                Vouchers.getCanUseCouponsList(data).then((res) => {
                    // 折扣券disList 现金券cashList 一次性储值卡storeList
                    res.cashList.push(...res.storeList);// 将现金券和一次性储值卡数组合并
                    if(type == 'disCoupon'){//选折扣券 用cashList过滤出可用的现金券
                        this.cashCouponList.forEach((item,index)=>{
                            for(let i=0;i<res.cashList.length;i++){
                                if(item.cardId == res.cashList[i]){
                                    item.disabled = false;
                                    break;
                                }else{
                                    if(i == res.cashList.length-1){//最后一个
                                        item.disabled = true;
                                    }
                                }
                            }
                        })
                    }else{//选现金券、储值卡 用disList过滤出可用的折扣券
                        this.disCouponList.forEach((item,index)=>{
                            for(let i=0;i<res.disList.length;i++){
                                if(item.cardId == res.disList[i]){
                                    item.disabled = false;
                                    break;
                                }else{
                                    if(i == res.disList.length-1){//最后一个
                                        item.disabled = true;
                                    }
                                }
                            }
                        })
                    }
                });
            },

            //  获取结算页信息
            getPage(callback) {
                let data = {
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    cookieId: Storage.get("USER_INFO").cookieId,
                    rtlCartTempHdId: this.orderHdId || this.$route.query.orderHdId,
                    busContsCode: baseConstant.busContsCode,
                    shopCode: Storage.get("USER_INFO").shopCode
                };
//                let embs = []
//                let epts = []
//                let map = {}
                Order.getSettlementInfo(data).then((res) => {
                    // 赋空值（监听$route防止多次push）
                    this.shoppingCartSuitList = [];
                    this.shoppingCartSingleList = [];
                    res.shopList.forEach(item=>{
                        if(item.orderFlag == 2){//套装
                            this.shoppingCartSuitList.push(item);
                        }else{//单品
                            this.shoppingCartSingleList.push(item);
                        }
                    })

                    this.shoppingCartList = res.shopList;
                    typeof callback === "function" && callback();
                });
            },

            //  获取快递配送地址
            getAddr() {
                this.addressMsg = {};
                let addr = Storage.get("settlementAddr");
                if (addr) {
                    this.addressMsg = addr;
                    this.getTransFee();
                } else {
                    //  获取个人默认地址
                    let data = {
                        vipUsrId: Storage.get("USER_INFO").usrId
                    };
                    UserService.getAddrList(data).then((res) => {
                        if (res && res.length > 0) {
                            for(let i=0; i<res.length; i++) {
                                if(res[i].defaultFlag === 1) {
                                    this.addressMsg = res[i];
                                    this.getTransFee();
                                    break;
                                }
                                if(res.length-1 == i){
                                    this.addressMsg = res[0];
                                    this.getTransFee();
                                }
                            }
                        }else{
                            this.addressMsg = {};
                        }
                    });
                }
            },

            //  获取运费
            getTransFee() {
                let data = {
                    id: this.orderHdId,
                    destCode: this.addressMsg.addressId
                            ? this.addressMsg.addressId
                            : this.addressMsg.districtCode
                };
                if (this.addressMsg.destId) {
                    data.destId = this.addressMsg.destId;
                }
                Order.getFreight(data).then((res) => {
                    this.transFee = res;
                });
            },

            //  获取配送方式
            getShipType() {
                let data = {
                    effFlag: 1,
                    policyTypeCode: "D_SALERETAIL"
                };
                let deliveryStorage = Storage.get('orderDelivery')
                Order.getShipType(data).then((res) => {
                    // 赋空值（监听$route防止多次push）
                    this.deliveryType = [];
                    res.forEach((item) => {
                        if (item.shipCode === "kdps" || item.shipCode === "mdzq") {
                            this.deliveryType.push(item);
                        }
                    });
                    if(deliveryStorage !== null && deliveryStorage.type) {
                        this.delivery = deliveryStorage.type;
                    }else{
                        this.delivery = this.deliveryType[0].shipCode;
                        // 默认选择快递
                        this.deliveryType.forEach((item) => {
                            if(item.shipCode.indexOf('kdps') !== -1) {
                                this.delivery = item.shipCode
                            }
                        })
                    }
                });
            },

            //预约量体-工单 聚合
            saleCtmmeasureAggregate(billCode,callback){
                let params = {
                    ownCompanyId: Storage.get("COMPANYID").company_id,
                    ordHdId: billCode,
                    saleMeasureHdCode: this.measureData.billCode,
                    usrId: Storage.get("USER_INFO").usrId,
                    companyId:Storage.get("COMPANYID").company_id
                }
                Order.saleCtmmeasureAggregate(params).then(res=>{
                    typeof callback === "function" && callback(billCode);
                }).catch((err)=>{
                    this.saving = false;
                })
            },

            // 提交订单
            handleEmitBill(){
                //提交订单锁 防止访问多次
                if(this.saving)return
                //校验失败（数据填写不全）
                if(!this.checkoutEmitBillForm())return;

                let data = {};
                if(this.delivery === "kdps"){
                    data = {
                        buyUsrMobile: this.addressMsg.cargoMobile,
                        cargoAddr: this.addressMsg.address,
                        cargoDestrictCode: this.addressMsg.districtCode
                                ? this.addressMsg.districtCode
                                : this.addressMsg.addressId,
                        cargoMobile: this.addressMsg.cargoMobile,
                        cargoUsrName: this.addressMsg.cargousrName,
                    };

                }else if(this.delivery === "mdzq"){
                    data = {
                        buyUsrMobile: this.storeTakeForm.phone,
                        cargoAddr: this.storeTakeForm.storeName,
                        cargoDestrictCode: this.storeTakeForm.addressId,
                        cargoMobile: this.storeTakeForm.phone,
                        cargoUsrName: this.storeTakeForm.username,
                        recptDptId: this.storeTakeForm.storeId,
                    };
                }

                let params = Object.assign({
                    companyId: Storage.get("COMPANYID").company_id,
                    usrId: Storage.get("USER_INFO").usrId,
                    billId: this.orderHdId,
                    busContsCode: baseConstant.busContsCode,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    shopId: Storage.get("USER_INFO").shopId,
                    sourceCode: "D_ORDWEIN",
                    cartList: this.shoppingCartList, //商品列表
                    ctmUsrId: Storage.get("USER_INFO").usrId,
                    ctmMessage: this.memo,//订单备注
                    receiptWayCode: this.delivery,//'kdps'
                    receiptWayId: this.currentNav.id,// 导航id
                    promotionList: this.getCurrentTicket(2),//券数组['123',456]
                    promotePartDto: [],//赠品 []
                    pointFlag: this.checked?1:0//是否使用积分
                },data);

                this.saving = true;
                Order.saveOrder(params).then(res=>{
                    let callback = (billCode)=>{
                        Storage.remove('settlementAddr');
                        Storage.remove("settlementData");

                        if(this.payAmount <= 0){
                            this.saving = false;
                            this.$router.replace("/bodyData"+"?fromPage=settlement&billCode="+billCode);
                        }else{
                            this.toPay(billCode);
                        }
                    }
                    this.saleCtmmeasureAggregate(res,callback);
                }).catch((err)=>{
                    this.saving = false;
                })
            },
            // 前往支付
            toPay(billCode){
                let params = {
                    usrId: Storage.get("USER_INFO").usrId,
                    paymentCode: "D_WEIXIN",
                    tradeTypeCode: "JSAPI",
                    paymentTypeCode: "D_FULL",
//                    domainName: baseConstant.domain,
                    shopCode: Storage.get("USER_INFO").shopCode,
                    orderList: billCode,
                    openId: Storage.get("WECHAT_INFO").openid,
//                    orderType: 'D_MASORD',
                    payAmount: this.payAmount
                };
                Payment.payOrder(params).then((config) => {
                    if(config.code === "200") {
                        let wxconfig = {
                            timeStamp: config.timeStamp,
                            nonceStr: config.nonceStr,
                            package: config.prepayId,
                            paySign: config.paySign,
                            successUrl: "/bodyData"+"?fromPage=settlement&billCode="+billCode,
                            failUrl: "/waitPay?billCode="+billCode
                        }
                        this.saving = false;
                        this.$router.go(-1);
                        payment.miniProgramPay(wxconfig,wxconfig.successUrl,wxconfig.failUrl)
                    }else{
                        Toast('支付出错了~')
                        this.$router.replace("/waitPay?billCode="+billCode);
                        this.saving = false;
                    }
                })
            },

            // 提交订单时 校验表单
            checkoutEmitBillForm(){
                if(this.delivery === "kdps"){
                    if (
                            !this.addressMsg.address ||
                            !this.addressMsg.cargoMobile ||
                            !this.addressMsg.cargousrName
                    ) {
                        Toast("请先完善收货信息~");
                        return false;
                    }

                }else if(this.delivery === "mdzq"){
                    switch (true){
                        case this.storeTakeForm.username.length < 2:
                            Toast("取货人姓名必须输入两个字符以上~");
                            return false;
                        case !isPhone(this.storeTakeForm.phone):
                            Toast("联系方式填写错误~");
                            return false;
                        case !this.storeTakeForm.storeId:
                            Toast("取货门店不能为空~");
                            return false;
                    }
                }

                if(!this.measureData || !this.measureData.billCode){
                    Toast("预约量体单不能为空~");
                    return false;
                }

                return true;
            },

            // 选中门店确认
            toSelectStore(boolean){
                if(boolean && this.storeList.length < 1){
                    Toast("该地区暂无可取货的门店~");
                    return;
                }
                this.showStoreList = boolean;
            },

            //  获取省市区
            getCityData () {
                Base.getDestnation().then((res) => {
                    let provinceMap = {}
                    let cityMap = {}
                    let countyMap = {}
                    res.list.forEach((item) => {
                        if(item.destTypeId === res.code[0]) {
                            provinceMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[1]) {
                            cityMap[item.code] = item.name
                        }
                        if(item.destTypeId === res.code[2]) {
                            countyMap[item.code] = item.name
                        }
                    })
                    this.areaList.province_list = provinceMap
                    this.areaList.city_list = cityMap
                    this.areaList.county_list = countyMap
                })
            },

            //  省市区选择确定
            areaChange (value) {
                if(value[2].code){
                    this.storeTakeForm.addressId = value[2].code
                }else if(value[1].code){
                    this.storeTakeForm.addressId = value[1].code
                }else{
                    this.storeTakeForm.addressId = value[0].code
                }
                this.showAreaList = false;
                this.storeTakeForm.address = `${value[0].name}-${value[1].name}-${value[2].name}`;
                this.getShopList();
            },

            // 获取门店列表
            getShopList(){
                // 将已选中门店信息清空
                this.storeTakeForm.storeId = "";
                this.storeTakeForm.storeName = "";
                this.storeTakeForm.realStoreName = "";

                let data = {
                    code: this.storeTakeForm.addressId,
                    pageNo: 1,
                    pageSize: 100
                };
                Base.getShopList(data).then((res) => {
                    if (res.list.length < 1) {
                        this.storeList = [];
                        Toast("该地区暂无可取货的门店~");
                    }else{
                        res.list.forEach((item) => {
                            item.text = item.dptName;
                            item.addressText = item.address
                        });
                        this.storeList = res.list;
                    }
                });
            },

            // 选择门店
            selectStore(value, index) {
                this.storeTakeForm.storeId = value.id;
                this.storeTakeForm.storeName = value.addressText;
                this.storeTakeForm.realStoreName = value.dptName;
                this.showStoreList = false;
            },

            // type=1显示现金券、折扣券上拉菜单 type=2商品清单上拉列表
            showActionList(boolean,type=1){
                if(type == 1){
                    this.showActionSheet = boolean;
                }else if(type == 2){
                    this.showGoodsList = boolean;
                }
            },

            // 显示现金券上拉菜单
            showDeducActionList(boolean){
                this.showDisCouponActionSheet = boolean;
            },

            // 切换积分开关
            onInputSwitch(boolean){
                // 切换开关锁
                if(this.isLoadingSwitch)return
                this.isLoadingSwitch = true;
                this.checked = boolean;
                let cardsId =this.getCurrentTicket();
                this.getDiscount(cardsId,()=>{
                    this.isLoadingSwitch = false;
                });
            },

            // 修改快递地址
            changeAddress(){
                if(this.addressMsg.id){
                    this.$router.push("/address-list?fromPage=settlement");
                }else{
                    Dialog.setDefaultOptions({confirmButtonText:'去新建'});
                    Dialog.confirm({
                        message: '您暂时没有收货地址,是否新建？ '
                    }).then(() => {
                        this.$router.push("/address-list?fromPage=settlement");
                    })
                }

            },

            // 切换配送方式
            checkTabNav(item,index){
                this.delivery = item.shipCode;
            },
        },

    }
</script>

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
    .pay-flex1{
        flex:1;
    }
    .pay-cell{
        display: flex;
        padding: computed(17) computed(30);
    }
    .pay-cell-left{
    }
    .pay-cell-right{}


    .container{
        position: relative;
        background: #f5f5f5;
        padding: computed(30);
        padding-bottom: computed(122);
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
        .pay-foot-money{}
    }
    .pay-foot-btn{
        background: $maincolor;
        color: #fff;
        text-align: center;
        line-height:computed(94);
        width: computed(320);
    }

    .pay-measure-describe{
        font-size: computed(26);
        color: #C41717;
    }
    .pay-measure-model{
        background: #fff;
    }
    .pay-call{
        font-size: computed(26);
        font-weight:bold;
        line-height: computed(66);

        .pay-call-user{
            margin-right: computed(40);
        }
    }
    .pay-icon-more{
        font-size: computed(26);
    }
    .pay-get-type{
        background: #fff;
    }
    .pay-nav{
        color: #999;
        line-height: computed(80);
        border-bottom: computed(1) solid #999;
        text-align: center;

        &.nav-selected{
            color: $blackcolor;
            font-weight: bold;
            border-color: $blackcolor;
        }
    }
    .pay-get-address{
        font-size: computed(28);
        color: #1A1A1A;

    }
    .pay-address-center{
        .pay-user-info{
            padding-bottom: computed(20);

            .pay-default{
                font-size: computed(18);
                display: inline-block;
                line-height: computed(32);
                text-align: center;
                padding: 0 computed(10);
                color: #fff;
                background: #000;
            }
        }

        .pay-address-cont{
            line-height: computed(32);
        }
    }
    .pay-icon-addr{
        color: #999;
    }

    .pay-no-address{
        width: 100%;
        padding: computed(45) 0;

        .pay-no-address-msg{
            font-size: computed(24);
            padding-top: computed(23);
        }
    }

    .pay-selftake-item{
        border-bottom: computed(1) solid #E6E6E6;
        margin-bottom: computed(1);

        &:last-child{
            border:none;
        }

        .pay-item-label{
            width: computed(130);
        }
        .pay-item-form{

        }
        .pay-item-right{
            i{
                font-size:computed(26);
            }
        }
    }

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {

        color:    #D2D2D2;
    }
    input:-moz-placeholder, textarea:-moz-placeholder {
        color:    #D2D2D2;
    }
    input::-moz-placeholder, textarea::-moz-placeholder {
        color:    #D2D2D2;
    }
    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
        color:    #D2D2D2;
    }

    .pay-good-info{
        background: #fff;
    }
    .pay-one-good{
        display: flex;

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

    .pay-more-good{

        .pay-more-title{
            padding-bottom: computed(30);
        }
        .pay-more-cont{
            align-items: center;

            .pay-more-list{
                margin-right: computed(70);
                overflow: hidden;
                flex:1;
                display: flex;
                .pay-more-item{
                    width: 33.33%;
                    height: computed(160);
                    position: relative;
                    display: flex;
                    justify-content: center;

                    .pay-more-type{
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
                        width: computed(160);
                        height: computed(160);
                    }
                }
            }
            .pay-more-right{

            }
        }
    }

    .pay-reduce-list{
        background: #fff;

        .pay-reduce-item{
            border-bottom: computed(1) solid #E6E6E6;
            margin-bottom: computed(1);
            line-height: computed(100);

            &:last-child{
                border:none;
            }

            .pay-item-label{
                width: computed(176);
            }
            .pay-item-form{
                .van-cell{
                    padding-left: 0;
                    padding-right: 0;
                }

            }
            .pay-item-right{
                i{
                    font-size:computed(26);
                }
            }
        }
    }

    .pay-count{
        background: #fff;

        .pay-count-list{


            .pay-count-item{
                line-height: computed(66.6);
            }
        }
    }

    .pay-action{

        .pay-action-header{
            height: computed(100);
            position: relative;
            font-size: computed(36);

            p{
            }
            .pay-close{
                position: absolute;
                right: computed(30);
                top:computed(30);
                color: #333;
            }
        }
    }

    .pay-action-list{
        height: computed(600);
        overflow: auto;

        .pay-action-item{
            border-bottom: computed(1) solid #E6E6E6;
            line-height: computed(100);

            &:last-child{
                border: none;
            }
            &.pay-action-item-disabled{
                color: #999;
            }
        }
    }
    .pay-action-radio{
        padding-left: computed(30);
        display: inline-block;
        flex-direction: column;
        align-items: center;
        line-height: computed(30);
    }
    .pay-action-btn{
        background: $maincolor;
        color: #fff;
        text-align: center;
        width:100%;
        line-height: computed(94);
    }

    //商品清单
    .good-action{

        .good-action-header{
            height: computed(100);
            position: relative;
            font-size: computed(36);

            p{
            }
            .good-close{
                position: absolute;
                right: 0;
                top:computed(30);
                color: #333;
            }
        }

        .good-action-list{
            max-height: computed(1100);
            overflow-y: auto;

            .good-action-item{
                &.good-action-border-b{
                    border-bottom: computed(1) solid #DBDBDB;

                    &:last-child{
                        border-bottom: none;
                    }
                }

                &:last-child{
                    border-bottom: none;
                }
                .pay-some-good{
                    display: flex;

                    .pay-some-img{
                        width: computed(220);
                        height: computed(220);
                        position: relative;
                        padding-right: computed(15);

                        .pay-some-type{
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
                    .pay-some-info{

                        .pay-some-name{

                        }
                        .pay-some-cont{
                            .pay-some-btn{
                                color: #999;
                                line-height: computed(36);
                                background: #F5F5F5;
                                width: computed(163);
                                font-size: computed(24);
                            }
                            .pay-some-price{
                                display: flex;
                                justify-content: space-between;
                                padding-top: computed(20);

                                .pay-some-num{
                                    font-size: computed(20);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .good-suit{

        .good-suit-head{
            line-height: computed(100);
            border-bottom: computed(1) solid #DBDBDB;
            padding:0 computed(30);
        }
    }
    .good-head-label{
        color: #999;
    }

</style>
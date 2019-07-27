/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品详情(新增组合商品2d展示功能-)
*/
<template>
    <div class="container">
        <!--商品信息-->
        <div class="good-info">
            <!--banner-->
            <div class="good-info-banner">
                <div class="good-head-icon">
                    <!--暂不显示分享-->
                    <!--<i class="iconfont icon-fenxiang"></i>-->
                    <i class="iconfont icon-fanhuishouye" @click="goPage('/show')"></i>
                </div>
                <van-swipe :autoplay="3000" @change="onChange">
                    <van-swipe-item v-for="(item,index) in goodDetail.urlList" :key="index">
                        <div class="good-banner-img">
                            <img :src="getImg(item.url)" @error="errImg($event)" alt>
                        </div>
                    </van-swipe-item>

                    <!--自定义指示器 li的for循环需修改-->
                    <div
                        class="custom-indicator"
                        slot="indicator"
                        v-if="goodDetail.urlList && goodDetail.urlList.length > 1"
                    >
                        <ul class="custom-list">
                            <li
                                :class="['custom-item',{'selected':currentIndex===index}]"
                                v-for="(item,index) in goodDetail.urlList"
                                :key="index"
                            ></li>
                        </ul>
                    </div>
                </van-swipe>
            </div>

            <div class="good-info-detail pd30">
                <div class="good-info-title fs32">{{goodDetail.goodName}}</div>
                <div class="good-info-price">
                    <div class="flex-box">
                        <p class="fs32B">¥{{goodDetail.salePrice | $goldDivide}}</p>
                        <p
                            class="fs28 good-tagprice"
                            v-if="goodDetail.tagPrice"
                        >¥{{goodDetail.tagPrice | $goldDivide}}</p>
                    </div>
                    <p
                        class="good-info-describe"
                        v-if="goodDetail.sellPointDesc"
                    >{{goodDetail.sellPointDesc}}</p>
                </div>
                <!--<div class="good-info-link">-->
                <!--<span class="good-link-text fs26">去定制</span>-->
                <!--<i class="iconfont icon-gengduo good-link-icon"></i>-->
                <!--</div>-->
            </div>
        </div>

        <!--商品拓展信息-->
        <div class="good-expand">
            <ul class="expand-list">
                <li
                    class="pdLr30 expand-item good-expand-discounts"
                    v-if="showVouchersLinkFlag"
                    @click="goPage('/vouchers-list')"
                >
                    <p class="pdLr10 discounts-logo">优惠</p>
                    <p class="flex-auto fs28 pdLr30 discounts-link">购礼品卡/体验卡可获得更多礼品与优惠</p>
                    <p class="iconfont icon-gengduo"></p>
                </li>
                <li
                    class="expand-item good-expand-recom"
                    v-if="goodsType === 'singleGood' && recommendPackages.length > 0"
                >
                    <p class="fs28 pdB30 recom-title">推荐套餐</p>
                    <ul class="recom-list">
                        <li
                            :class="['mgB30', 'recom-item',{'selected':false}]"
                            :key="item.ptiCombgoodHdCode"
                            @click="goPage('/goods-detail?goodsCode=' + item.ptiCombgoodHdCode +'&goodsType=groupGoods')"
                            v-for="(item,index) in recommendPackages"
                        >
                            <span class="fs26B recom-item-price">￥{{item.salePrice | $goldDivide}}</span>
                            <span class="fs24 recom-item-num">/{{item.customName}}</span>

                            <div class="recommen-logo">
                                <img :src="require('@/assets/images/goods/recommen.png')" alt>
                            </div>
                        </li>
                    </ul>
                </li>
                <li
                    class="pdLr30 expand-item good-expand-pointer"
                    v-if="presentPointer && presentPointer>0"
                >
                    <p class="pointer-logo">积</p>
                    <p class="fs28 pointer-describe">购买最多获得{{presentPointer}}积分，积分可兑换现金券</p>
                </li>
            </ul>
        </div>

        <div class="good-interval"></div>

        <!--用于插入富文本标签-->
        <div class="detail-content">
            <div class="detail-content-tab" v-for="(item,index) in goodsContent" :key="index">
                <p
                    class="tab-title"
                    :class="{'maincolor': item.showContent === true}"
                    @click="item.showContent = !item.showContent"
                >- {{item.descName}} -</p>
                <div
                    class="tab-content"
                    v-show="item.showContent === true"
                    v-html="item.descContent"
                ></div>
            </div>
        </div>

        <!--撑开底部按钮栏，防止内容被遮挡-->
        <div class="good-cut"></div>

        <!--去定制弹层-->
        <van-popup v-model="showCustom" position="bottom">
            <div class="pd30 good-custom-pop">
                <div class="pay-one-good">
                    <div class="pay-one-img">
                        <img
                            :src="getImg(goodDetail.urlList[0].url)"
                            v-if="goodDetail.urlList && goodDetail.urlList[0]"
                            @error="errImg($event)"
                            alt
                        >
                        <div class="pay-one-type">定制</div>
                    </div>
                    <div class="pay-one-info flex-vbox flex-auto">
                        <div class="pay-one-cont">
                            <div class="pay-one-money fs28B">¥{{goodDetail.salePrice | $goldDivide}}</div>
                            <span
                                class="good-info-describe-pup"
                                v-if="goodDetail.sellPointDesc"
                            >{{goodDetail.sellPointDesc}}</span>
                        </div>
                    </div>
                </div>

                <div class="good-pop-recom">
                    <p class="fs28 pdB30 pop-recom-title">套餐选择</p>
                    <ul class="mgB30 pop-recom-list">
                        <li
                            :class="['pop-recom-item',{'selected':recommenIndex === index,'disabled':!item.qty || item.qty == 0}]"
                            @click="selectPackages(item,index)"
                            :key="index"
                            v-for="(item,index) in buyablePackagesList"
                        >
                            <span
                                class="fs26B pop-recom-item-price"
                            >￥{{item.salePrice | $goldDivide}}</span>
                            <span class="fs24 pop-recom-item-num">/{{item.customName}}</span>
                        </li>
                    </ul>
                </div>

                <div class="good-stepper">
                    <p class="fs28 pdB30">数量选择</p>
                    <div class="good-stepper-container">
                        <van-stepper
                            v-model="amount"
                            integer
                            :min="1"
                            :step="1"
                            :disabled="recommenIndex<0"
                            @change="changeStepper"
                        />
                    </div>
                </div>

                <div class="good-tip" v-if="buyablePackagesInfo.maxPrice > 0">
                    <p class="good-tip-logo">提示</p>
                    <p
                        class="fs24 good-tip-cont"
                    >购买 [{{buyablePackagesInfo.maxCombo}}] 最高优惠￥{{buyablePackagesInfo.maxPrice | $goldDivide}}元。</p>
                </div>
            </div>
            <div class="good-sure-btn" @click="clickSureBtn">确定</div>
        </van-popup>

        <!--加载遮罩-->
        <div class="shade-style" v-show="isLoading">
            <div class="loading-style">
                <van-loading type="spinner" color="white"/>
            </div>
        </div>

        <div class="good-action">
            <ul class="good-action-list">
                <li class="good-action-item" @click="concatCumService">
                    <i class="iconfont icon-kefu"></i>
                    <span class="good-action-text">咨询</span>
                </li>
                <li
                    class="good-action-item"
                    v-if="goodsType ==='singleGood'"
                    @click="goPage('/goods-comment?goodsCode='+goodsCode)"
                >
                    <i class="iconfont icon-pinglun"></i>
                    <span class="good-action-text">评价</span>
                </li>
                <li class="good-action-item" @click="collectOrCancel">
                    <i
                        :class="['iconfont',,'icon-shoucang',{'iconclickCustom-shoucangxuanzhong':isCollect,'collect-color':isCollect}]"
                    ></i>
                    <span class="good-action-text">{{isCollect ? '已收藏' : '收藏'}}</span>
                </li>
            </ul>

            <div class="good-action-btn" @click="clickCustom()">立即定制</div>
        </div>
    </div>
</template>

<script>
import { Swipe, SwipeItem, Toast, Stepper, Popup } from 'vant';
import { GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn, Loading } from 'vant';
import { Goods, Collection, UserService, Order, Point, Vouchers } from "../../api/service";
import Storage from "../../util/storage";
import ComGoodEmbData from "./components/ComGoodEmbData.vue";

export default {
    components: {
        "van-swipe": Swipe,
        "van-swipe-item": SwipeItem,
        "van-goods-action": GoodsAction,
        "van-goods-action-big-btn": GoodsActionBigBtn,
        "van-goods-action-mini-btn": GoodsActionMiniBtn,
        "van-stepper": Stepper,
        "van-popup": Popup,
        "van-loading": Loading,
    },
    mixins:[ComGoodEmbData],
    data() {
        return {
            currentIndex: 0,//当前指示器位置下标
            goodDetail: {},//商品信息（单品、组合都用该字段展示）
            groupGoodDetail: {},//组合商品信息（主要用于保存）
            goodsContent: [],//商品内容
            recommenIndex: -1,//套餐已选中下标
            showCustom: false,//显示定制弹层
            showVouchersLinkFlag: false,//显示前往领券列表页链接
            amount: 1,//数量
            presentPointer: 0,//购买后赠送积分数
            recommendPackages: [],//推荐套餐（展示在主页）
            buyablePackagesInfo: {},//最优套餐信息
            buyablePackagesList: [],//可买套餐
            isLoading: false,// 显示加载遮罩
        }
    },

    computed: {
        //是否已收藏
        isCollect() {
            return this.goodDetail.collectionFlag == 1 ? true : false;
        },

        // 判断是哪种下单方式
        /**
         * 1 单品 无推荐
         * 2 单品有推荐 选组合
         * 3 单品有推荐 选单品
         * 4 组合
         * @returns {number}
         */
        buyType() {
            if (this.goodsType === 'singleGood') {
                if (this.buyablePackagesList.length > 0) {
                    if (this.recommenIndex > 0) {
                        return 2;// 单品有推荐 选组合
                    } else if (this.recommenIndex == 0) {
                        return 3;// 单品有推荐 选单品
                    } else {
                        return 5;// 单品有推荐 未选择
                    }
                } else {
                    return 1;//单品 无推荐
                }
            } else {
                return 4;// 组合
            }
        },
    },

    methods: {

        // 数量change事件
        changeStepper(val) {
            this.checkoutStockPromise().then(res => {
                if (res == 1) {

                } else {
                    Toast('库存不足~')
                }
            })
        },

        // 点击弹窗确认按钮
        clickSureBtn() {
            if (this.recommenIndex < 0) {
                Toast('请选择套餐~');
            } else {
                this.checkoutStock();
            }
        },

        // 点击去定制
        clickCustom() {
            if(this.ms_isUnSell){
                Toast('该商品已下架')
                return;
            }
            if (!checkoutAuthorized(this.$route.fullPath, this)) return;
            let buyType = this.buyType;
            switch (true) {
                case buyType == 2:
                case buyType == 3:
                case buyType == 5:// 展示弹窗
                    this.showCustom = true;
                    break;
                case buyType == 1:// 单品下单
                    this.checkoutStock();
                    break;
                case buyType == 4:// 组合下单
                    this.checkoutStock();
                    break;
            }
        },

        // 套餐选择 选中套餐
        selectPackages(item, index) {
            if (!item.qty || item.qty == 0) return;
            this.recommenIndex = index;
            this.amount = 1;
            if (index > 0) {
                this.getGroupGoodsInfoPromise(this.buyablePackagesList[index].ptiCombgoodHdCode).then((res) => {
                    this.groupGoodDetail = res;
                })
            }
        },
        // 获取商品可使用一次性储值卡
        checkoutUsableVlaueCard() {
            let data = {
                dptId: Storage.get('properties').shopId,
                //                    usrId: Storage.get('USER_INFO').usrId// 非必传
            }
            if (this.goodsType === "groupGoods") {
                data.combPartCode = this.goodDetail.ptiCombgoodHdCode;
            } else {
                data.ptiPartCode = this.goodDetail.goodCode;
            }
            Vouchers.getGoodUsableVlaueCard(data).then(res => {
                if (res && res.length > 0) {
                    this.showVouchersLinkFlag = true;
                } else {
                    this.showVouchersLinkFlag = false;
                }
            })
        },

        //  查询商品详情富文本-391-393-395-397-399-416
        getGoodsInfoTitle() {
            let data = {
                goodsId: this.goodDetail.orderGoodsId
                //                    goodsId: 416
            };
            Goods.getGoodsTitle(data).then((res) => {
                this.descContentDispose(res);
            });
        },

        // 富文本处理
        descContentDispose(list) {
            if (!list || list.length <= 0) return;
            list.forEach((item) => {
                item.showContent = false;
                if (item.descSq == 0) item.showContent = true
                let newStr = item.descContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (img, src) {
                    let index = src.indexOf('=') + 1
                    let imgData = getImg(src.substring(index, img.length))
                    return '<img src="' + imgData + '" style="width:100%">'
                })
                item.descContent = newStr
            });

            list.forEach((item) => {
                let newPre = item.descContent.replace(/\<pre\>/gi, function () {
                    return '<pre style="word-wrap: break-word;white-space:pre-wrap;">'
                })
                item.descContent = newPre
            })

            list.forEach((item) => {
                let newP = item.descContent.replace(/\<p\>/gi, function () {
                    return '<p style="word-wrap: break-word;white-space:pre-wrap;">'
                })
                item.descContent = newP
            })
            this.goodsContent = list;
        },

        // 调用取消或收藏功能
        collectOrCancel() {
            let callback = () => {
                if (this.isCollect) {
                    this.cancelCollectFunction();
                } else {
                    this.collectFunction();
                }
            }

            this.checkoutUserInfo(callback);
        },

        // 取消收藏功能
        cancelCollectFunction() {
            let data = {}
            if (this.goodsType === "groupGoods") {//收藏组合商品
                data = {
                    usrId: Storage.get('USER_INFO').usrId,
                    ownCompanyId: Storage.get('COMPANYID').company_id,
                    companyId: Storage.get('COMPANYID').company_id,
                    id: this.goodDetail.rtlCollectionDtId,
                };
                Collection.deleteCollectionComb(data).then((res) => {
                    this.getGroupGoodsInfo();
                });
                return
            }

            data = {
                usrId: Storage.get('USER_INFO').usrId,
                companyId: Storage.get('COMPANYID').company_id,
                goodCodeStr: this.goodsCode,
                ids: this.goodDetail.rtlCollectionDtId// 收藏id
            };
            Collection.deleteCollection(data).then((res) => {
                this.getGoodsInfo();
            });
        },

        // 收藏功能
        collectFunction() {
            let data = {}
            if (this.goodsType === "groupGoods") {//收藏组合商品
                data = {
                    usrId: Storage.get('USER_INFO').usrId,
                    ownCompanyId: Storage.get('COMPANYID').company_id,
                    companyId: Storage.get('COMPANYID').company_id,
                    busContsCode: baseConstant.busContsCode,
                    ptiCombgoodHdCode: this.goodDetail.ptiCombgoodHdCode,
                    shopId: Storage.get('USER_INFO').shopId
                };
                Collection.addCollectionComb(data).then((res) => {
                    this.getGroupGoodsInfo();
                });
                return
            }

            data = {
                usrId: Storage.get('USER_INFO').usrId,
                companyId: Storage.get('COMPANYID').company_id,
                busContsCode: baseConstant.busContsCode,
                goodsCode: this.goodsCode,
                shopId: Storage.get('USER_INFO').shopId
            };
            Collection.addCollection(data).then((res) => {
                this.getGoodsInfo();
            });
        },

        // 通过路由切换页面
        goPage(routerSrc) {
            //                if(routerSrc === '/vouchers-list'){//购买卡券链接
            //                    if(!checkoutAuthorized('/vouchers-list',this))return;
            //                }
            this.$router.push(routerSrc);
        },
        // 指示器切换
        onChange(index) {
            this.currentIndex = index;
        },
        getGoodsInfo(callback) {
            let data = {
                busContsCode: baseConstant.busContsCode,
                partCode: this.goodsCode,
                shopId: Storage.get('properties').shopId
            };
            Goods.getGoodsInfoCus(data).then(res => {
                let imgList = res.urlList;
                if (!imgList || imgList.length == 0) {
                    res.urlList = [];
                    res.urlList.push({ url: 'aa', fileId: '' });
                }
                this.goodDetail = res;
            }).then(() => {
                typeof callback == "function" && callback();
            })
        },
        // 获取组合商品详情
        getGroupGoodsInfo(callback) {

            // todo  'hanshi4'未返回商品名称
            this.getGroupGoodsInfoPromise(this.goodsCode).then(res => {
                // 将组合商品信息处理成对应模板展示字段

                // 无组合价格，则取商品总和价格
                if (!res.salePrice) {
                    res.salePrice = 0;
                    res.goodsList.forEach((item) => {
                        res.salePrice += item.salePrice;
                    })
                    res.salePrice = res.salePrice.toFixed(2);
                }
                res.goodName = res.comgoodsName;
                res.urlList = [{ url: res.pictFileUrl, fileId: '' }];

                this.descContentDispose(res.descList);
                this.goodDetail = res;
                this.groupGoodDetail = res;//用于保存，不做展示
                typeof callback == "function" && callback();
            })
        },

        // 获取组合商品详情promise
        getGroupGoodsInfoPromise(goodsCode) {
            let data = {
                busContsCode: baseConstant.busContsCode,
                ptiCombgoodHdCode: goodsCode,
                shopId: Storage.get('properties').shopId
            };
            return Goods.getGroupGoodsInfoCus(data)
        },

        // 根据价格计算赠送积分
        getPresentPointer() {
            Point.getComputePresentPointer({ price: this.goodDetail.salePrice }).then((res) => {
                this.presentPointer = res;
            })
        },
        //  获取用户信息
        getUserInfo(callback) {
            UserService.getUserInfo({
                "usrId": Storage.get("USER_INFO").usrId,
                "companyId": Storage.get("COMPANYID").company_id,
            }).then((res) => {
                this.userInfo = res;
                typeof callback === "function" && callback();
            });
        },

        // 咨询客服
        concatCumService() {
            let callback = () => {
                let user = this.userInfo;
                contact();
            }

            this.checkoutUserInfo(callback);
        },

        // 需要用到userId接口判断提取
        checkoutUserInfo(callback) {
            if (!checkoutAuthorized(this.$route.fullPath, this)) return;

            if (this.userInfo) {
                typeof callback === "function" && callback();
            } else {
                this.getUserInfo(callback);
            }
        },

        // 校验手机、库存
        checkoutStock() {
            if (this.isSaveing) return// 保存订单锁

            //以下方法需要用户信息
            let callback = () => {
                if (!this.userInfo.mobilePhone) {
                    this.$router.push('/bind-phone');
                } else {
                    this.isSaveing = true;

                    this.checkoutStockPromise().then(res => {
                        if (res == 1) {
                            // 单品下单 判断是否有可绣字绣花部位 若有需跳转绣花绣字页
                            if(this.buyType == 1 || this.buyType == 3){

                                for(let i=0;i<this.ms_tabList.length;i++){
                                    this.ms_getUseablePart(this.ms_tabList[i],this.goodDetail.ptiPartHdId).then((res)=>{
                                        if(res && res.length){
                                            this.$router.push('/goods-embroider?goodsCode=' + this.goodDetail.goodCode + `&amount=${this.amount}`)
                                        }else{
                                            this.ms_tabListLength--;
                                            if(this.ms_tabListLength == 0){
                                                this.buyRightNow();
                                            }
                                        }
                                    })
                                }
                            }else{
                                this.buyRightNow();
                            }
                        } else {
                            Toast("库存不足~")
                            this.isSaveing = false;
                        }
                    }, err => {
                        this.isSaveing = false;
                    })

                }
            }

            this.checkoutUserInfo(callback);
        },

        checkoutStockPromise() {
            let inventoryJudgeDtos = [];
            if (this.buyType == 1 || this.buyType == 3) {
                inventoryJudgeDtos.push({
                    "count": this.amount,
                    "orderFlag": this.goodDetail.orderFlag,
                    "ptiPartDtSkuId": this.goodDetail.ptiPartSkuId,
                    "ptiPartHdCode": this.goodDetail.goodCode,
                    "ptiPartHdId": this.goodDetail.ptiPartHdId
                })
            } else {
                this.groupGoodDetail.goodsList.forEach(item => {
                    inventoryJudgeDtos.push({
                        "count": this.amount,
                        "orderFlag": item.orderFlag,
                        "ptiPartDtSkuId": item.ptiPartSkuId,
                        "ptiPartHdCode": item.goodCode,
                        "ptiPartHdId": item.ptiPartHdId
                    })
                })
            }
            let stockData = {
                companyId: Storage.get("COMPANYID").company_id,
                ownCompanyId: Storage.get("COMPANYID").company_id,
                usrId: Storage.get("USER_INFO").usrId,
                inventoryJudgeDtos: inventoryJudgeDtos,
                shopId: Storage.get('properties').shopId
            };
            // 库存校验
            return Goods.getGroupGoodsStockCust(stockData)
        },

        // 立刻购买
        buyRightNow() {
            let orderData = this.getBuyParams();
            c_emitBill(orderData).then(res=>{
                this.$router.push("/order-settlement?orderHdId=" + res);
                this.isSaveing = false;// 保存订单锁
            },err=>{
                this.isSaveing = false;// 保存订单锁
            })
//            Order.saveCartTemp(orderData).then((res) => {
//                Order.orderPreferCal({ ordId: res }).then(()=>{
//                    this.isSaveing = false;// 保存订单锁
//                    this.$router.push("/order-settlement?orderHdId=" + res);
//                });
//            }, err => {
//                this.isSaveing = false;// 保存订单锁
//            }).catch(() => {
//                this.isSaveing = false;// 保存订单锁
//            });
        },

        // 获取购买接口参数
        getBuyParams() {
            let orderData = {
                companyId: Storage.get("COMPANYID").company_id,
                usrId: Storage.get("USER_INFO").usrId,
                ctmUsrId: Storage.get("USER_INFO").usrId,
                cookieId: Storage.get("USER_INFO").cookieId,
                shopCode: Storage.get("USER_INFO").shopCode,
                usrKey: Storage.get("USER_INFO").usrId,
                sourceCode: "D_ORDWEIN",
            };
            let partList = [];
            if (this.buyType == 1 || this.buyType == 3) {
                let firstImgInfo = this.goodDetail.urlList[0];//首张图片信息
                partList = this.getPartListParams(this.goodDetail.detailedList);
                orderData.skuList = [{
                    mainFabricId: this.goodDetail.mainFabricId,
                    amount: this.amount,
                    colorCode: this.goodDetail.colorCode,
                    dealPrice: '',
                    sizeCode: this.goodDetail.sizeCode,
                    salePrice: this.goodDetail.salePrice,
                    tagPrice: this.goodDetail.tagPrice,
                    goodsCode: this.goodDetail.goodCode,
                    thumb: firstImgInfo.url,
                    pictFileId: firstImgInfo.fileId,
                    partList: partList
                }];
                orderData.amountOrd = this.amount * this.goodDetail.salePrice;
            } else {// 组合参数groupGoodDetail
                orderData.combList = [{
                    "picFileHdId": this.groupGoodDetail.picFileHdId,
                    //                        "picFileHdId":9808,
                    "ptiCombgoodHdId": this.groupGoodDetail.id,
                    "qty": this.amount,
                    "seq": 1// 多个组合商品时  该参数递增
                }];
                orderData.combList[0].skuList = [];
                this.groupGoodDetail.goodsList.forEach(item => {
                    partList = this.getPartListParams(item.detailedList);
                    orderData.combList[0].skuList.push({
                        mainFabricId: item.mainFabricId,
                        amount: this.amount,
                        colorCode: item.colorCode,
                        dealPrice: '',
                        sizeCode: item.sizeCode,
                        salePrice: item.salePrice,
                        tagPrice: item.tagPrice,
                        goodsCode: item.goodCode,
                        //                            thumb: firstImgInfo.url,
                        pictFileId: item.pictFileId,
                        partList: partList
                    });
                })
            }
            return orderData;
        },

        // 获取部件参数（用于保存）
        getPartListParams(partList) {
            return partList.map(item => {
                return {
                    "regionCode": item.regionCode,
                    "partCode": item.partCode,
                    "fabricCode": item.fabricCode,
                    "partId": item.partId,
                    "fabricId": item.fabricId,
                    "regionId": item.regionId,
                    "memo": "",
                    "emb": [],
                    "ept": [],
                    "prt": [],
                    "salePrice": "",
                    "tagPrice": ""
                }
            })
        },

        // 获取推荐套餐
        getRecommendPackages() {
            let data = {
                shopDptId: Storage.get('properties').shopId,
                ptiPartHdId: this.goodDetail.ptiPartHdId
                //                    ptiPartHdId: 945
            }
            Goods.getRecommendPackages(data).then(res => {
                this.recommendPackages = res;
            })
        },

        // 获取购买可选套餐
        getBuyablePackages(callback) {
            let data = {
                shopDptId: Storage.get('properties').shopId,
                // todo
                //                    ptiPartHdId: 237134,
                ptiPartHdId: this.goodDetail.ptiPartHdId,
                buscontsId: baseConstant.busContsCode
            }
            Goods.getBuyablePackages(data).then(res => {
                let info = res.list;
                if (info.dttList && info.dttList.length > 0) {
                    info.dttList.unshift({
                        customName: info.customName,
                        salePrice: info.salePrice,
                        qty: info.qty,
                    });
                    this.buyablePackagesList = info.dttList;
                }

                this.buyablePackagesInfo = res;
                typeof callback === "function" && callback();
            })
        },

        //初始化页面
        initPage(goodsType = 'singleGood') {
            this.amount = 1;
            this.recommenIndex = -1;
            this.isLoading = true;


            this.goodsCode = this.$route.query.goodsCode;
            this.goodsType = goodsType;//默认定制单品'singleGood'; 组合商品'groupGoods'

            // todo 以下用于测试
            //                this.goodsType = 'groupGoods';
            //            this.goodsCode = "QX1002";
            //                this.goodsCode = "hanshi3";//雨燕配置
            //            this.goodsCode = "CS1811050001";//有部件信息

            //                this.goodsCode = "HS112001";//单品
            //                this.goodsType = "singleGood";

            let callback = null;
            if (this.goodsType === 'groupGoods') {//组合商品
                callback = () => {
                    this.getPresentPointer();
                    this.checkoutUsableVlaueCard();
                    this.ms_checkoutGoodSell();//判断是否下架
                    this.isLoading = false;
                }
                this.getGroupGoodsInfo(callback);
            } else {//定制单品
                callback = () => {
                    this.getGoodsInfoTitle();
                    this.getPresentPointer();
                    this.checkoutUsableVlaueCard();
                    this.getRecommendPackages();
                    this.ms_checkoutGoodSell();//判断是否下架
                    this.getBuyablePackages(() => {
                        this.isLoading = false;
                    });
                }
                this.getGoodsInfo(callback);
            }
        },

        //获取主面料id
        //            getMainFabricId(){
        //                let data = {
        //                    ownCompanyId: Storage.get("COMPANYID").company_id,
        //                    companyId: Storage.get("COMPANYID").company_id,
        //                    goodsCode: this.goodDetail.goodCode
        //                };
        //                Goods.getMainFabricInfo(data).then((res)=>{
        //                    this.goodDetail.mainFabricId = res.fabricId;
        //                })
        //            },
    },
    created() {
        this.initPage(this.$route.query.goodsType);
    },
    watch: {
        $route(data) {
            this.initPage(this.$route.query.goodsType);
        },
    }
}
</script>

<style scoped lang="scss">
    /*加载遮罩*/
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

    .good-interval{
        padding-bottom: computed(20);
        background: #f5f5f5;
    }
    .container{
        padding-bottom: computed(86);
        height: calc(100% - #{computed(86)});
        background: #f5f5f5;
    }
    .good-info-banner {
        background: #fff;
        position: relative;
    }
    .good-banner-img {
        height: computed(750);

        img {
            width: 100%;
            height: computed(750);
        }
    }
    .custom-indicator {
        position: absolute;
        bottom: computed(18);
        width: 100%;
    }
    .custom-list {
        justify-content: center;
        display: flex;
        width: 100%;
    }
    .custom-item {
        width: computed(14);
        height: computed(14);
        background: #a5bbd4;
        border-radius: 50%;
        margin: 0 computed(10);

        &.selected {
            background: #fff;
        }
    }
    .good-head-icon {
        display: flex;
        justify-content: flex-end;
        position: absolute;
        left: 0;
        width: 100%;
        padding: 0 computed(28);
        box-sizing: border-box;
        top: computed(28);
        z-index: 1;

        i {
            font-size: computed(40);
            color: #fff;
            background: #0d0e09;
            border-radius: 50%;
            width: computed(72);
            height: computed(72);
            text-align: center;
            line-height: computed(72);
        }
    }
    .good-info{
        margin-bottom: computed(20);
    }
    .good-info-detail {
        /*display: flex;*/
        /*flex-direction: column;*/
        /*align-items: center;*/
        background: #fff;

        .good-info-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .good-info-price {
            padding: computed(30) 0 computed(17) 0;
            line-height: computed(42);
            display: flex;
            justify-content: space-between;

            .good-info-describe{
                background: #FFE3E3;
                padding: 0 computed(14);
                color: $maincolor;
                font-size: computed(24);
            }
            .good-tagprice{
                color: #999;
                margin-left: computed(27);
                text-decoration: line-through;
            }
        }
        .good-info-link {
            line-height: computed(48);
            padding-left: computed(16);
            background: #d5af6e;
            text-align: center;
            color: #fff;
            display: flex;

            .good-link-text {
            }
            .good-link-icon {
                margin: 0 computed(5);
                font-size: computed(26);
            }
        }
    }
    .good-action {
        position: fixed;
        left: 0px;
        bottom: 0;
        padding: computed(10) computed(30) computed(10) 0;
        display: flex;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
    }
    .good-action-list {
        display: flex;
        justify-content: space-around;
        flex: 1;

        .good-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 33.33%;

            .good-action-text {
                font-size: computed(20);
                color: #333;
            }
            i {
                color: #666;
            }
            .collect-color {
                color: #c41717;
            }
        }
    }
    .good-action-btn {
        margin-left: computed(10);
        text-align: center;
        color: #fff;
        line-height: computed(72);
        background: #c41717;
        width: computed(423);
    }

    .good-expand{
        background: #fff;

        .expand-list{

            .expand-item{
                border-bottom: computed(1) solid #E6E6E6;

                &:last-child{
                    border-bottom: none;
                }
            }

            .good-expand-discounts{
                display: flex;
                height: computed(100);
                align-items: center;

                .discounts-logo{
                    line-height: computed(40);
                    height: computed(40);
                    background: $maincolor;
                    color: #fff;
                    border-radius:computed(16);
                    font-size: computed(22);
                }
                .discounts-link{
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .good-expand-recom{
                padding: computed(30);
                padding-bottom: 0;

                .recom-title{
                    color: #999;
                    line-height: 1;
                }
                .recom-list{
                    display: flex;
                    flex-wrap: wrap;

                    .recom-item{
                        border:1px solid $maincolor;
                        line-height: computed(54);
                        text-align: center;
                        width: computed(320);
                        position: relative;

                        .recom-item-price{}
                        .recom-item-num{}
                        &.selected{
                            color: #fff;
                            background: $maincolor;
                        }
                        &:nth-child(odd){
                            margin-right: computed(30);
                        }
                        .recommen-logo{
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: computed(42);
                            height: computed(42);

                            img{
                                width:100%;
                                height:100%;
                            }
                        }
                    }
                }
            }
            .good-expand-pointer{
                height: computed(100);
                align-items: center;
                display: flex;

                .pointer-logo{
                    border-radius: 50%;
                    text-align: center;
                    line-height: computed(38);
                    width: computed(38);
                    font-size: computed(22);
                    color: $maincolor;
                    border: computed(2) solid $maincolor;
                }
                .pointer-describe{
                    padding-left: computed(30);
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }

    }

    /* 商品图文信息 */
    .detail-content {
        background: #fff;

        .detail-content-p {
            > img {
                display: block;
                width: 100%;
                margin-bottom: computed(5);
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        .detail-content-tab {
            width: 100%;
            overflow: hidden;
            .tab-title {
                text-align: center;
                font-size: computed(30);
                padding: computed(40) 0;
                &.maincolor {
                    color: $maincolor;
                }
            }
            .tab-content {
                img {
                    display: block;
                    width: 100%;
                    margin-bottom: computed(5);
                }
                &.none {
                    display: none;
                }
                &.show {
                    display: block;
                }
            }
        }
    }

    .good-cut{
        height: computed(110);
        width: 100%;
        background: #F5F5F5;
    }

    .good-custom-pop{
    }
    .pay-one-good{
        display: flex;

        .pay-one-img{
            width: computed(174);
            height: computed(174);
            position: relative;
            padding-right: computed(30);

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
                width: 100%;
                height: 100%;
            }
        }
        .pay-one-info{

            .pay-one-cont{
                padding-top: computed(65);

                .pay-one-money{
                    padding-bottom: computed(25);
                }
                .good-info-describe-pup{
                    background: #FFE3E3;
                    padding: 0 computed(14);
                    color: $maincolor;
                    font-size: computed(24);
                }
            }
        }
    }

    .good-pop-recom{
        padding-top: computed(50);

        .pop-recom-title{
            line-height: 1;
        }
        .pop-recom-list{
            display: flex;
            flex-wrap: wrap;
            max-height: computed(500);
            overflow-y: auto;

            .pop-recom-item{
                border:1px solid #999;
                line-height: computed(54);
                height: computed(54);
                text-align: center;
                width: computed(320);
                margin-bottom: computed(30);
                overflow: hidden;
                white-space: nowrap;

                .pop-recom-item-price{}
                .pop-recom-item-num{}
                &.selected{
                    color: #fff;
                    background: $maincolor;
                    border-color: $maincolor;
                }
                &.disabled{
                    color: #ccc;
                    border-color: #ccc;
                }
                &:nth-child(odd){
                    margin-right: computed(30);
                }
                &:nth-last-child(1),
                &:nth-last-child(2){
                    margin-bottom: 0;
                }
            }
        }
    }
    .good-stepper{

        .good-stepper-container{

        }
    }
    .good-tip{
        display: flex;
        line-height: computed(60);
        padding-top: computed(20);

        .good-tip-logo{
            background: #FFE3E3;
            padding: 0 computed(16);
            color: $maincolor;
            font-size: computed(22);
            height: computed(32);
            line-height: computed(32);
            border-radius:computed(16);
            margin-top: computed(7);
        }
        .good-tip-cont{
            flex: 1;
            line-height: computed(45);
            padding-left: computed(12);
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }
    .good-sure-btn{
        color: #fff;
        background: $maincolor;
        text-align: center;
        line-height: computed(94);
    }
</style>
/*
 * @Author: yongtian.hong
 * @Date: 2018-08-09 15:18:01
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-14 16:13:59
 * @Description: 售后申请页面
 */
<style lang='scss' scoped>
.wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: computed(30) 0;
    box-sizing: border-box;
    .goods {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: 0 computed(30);
        margin: computed(20) 0;
        .img {
            width: computed(150);
            height: computed(150);
            margin-right: computed(20);
            img {
                width: 100%;
                height: 100%;
            }
        }
        .info {
            flex: 1;
            color: #0d0e09;
            font-size: computed(32);
            font-weight: bold;
            font-family: "PingFang-SC-Bold";
            .name {
                margin-bottom: computed(40);
            }
            .price-and-num {
                display: flex;
                justify-content: space-between;
            }
        }
    }
    .content {
        box-sizing: border-box;
        padding: computed(10);
        .group {
            display: flex;
            flex-direction: column;
            margin-bottom: computed(20);
            .title {
                color: #999999;
                font-size: computed(32);
                font-family: "PingFang-SC-Medium";
                padding: computed(10) computed(30);
                border-bottom: solid 1px #e6e6e6;
                .red {
                    color: red;
                    margin-left: computed(20);
                }
            }
            .action {
                display: flex;
                justify-content: space-between;
                color: #0d0e09;
                font-size: computed(28);
                font-family: "PingFang-SC-Bold";
                font-weight: bold;
                padding: computed(20) computed(30);
                border-bottom: solid 1px #e6e6e6;
            }
            .description {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: computed(5) 0;
                padding-right: computed(30);
                color: #cccccc;
                font-size: computed(28);
                font-family: "PingFang-SC-Medium";
                border-bottom: solid 1px #e6e6e6;
                textarea {
                    flex: 1;
                    outline: 0;
                    border: 0;
                    color: #cccccc;
                    margin-right: computed(10);
                    padding: computed(20) 0;
                }
                textarea::placeholder {
                    font-weight: normal;
                    font-family: "PingFang-SC-Medium";
                    color: #cccccc;
                }
            }
            .upload {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #999999;
                font-size: computed(32);
                font-family: "PingFang-SC-Medium";
                padding: computed(30);
                .limit {
                    font-size: computed(28);
                }
            }
            .num-select {
                display: flex;
                align-items: center;
                width: 22vw;
                padding: computed(15) computed(20);
                border-top: solid 1px #cccccc;
                border-bottom: solid 1px #cccccc;
                .iconfont {
                    font-size: computed(36);
                }
                .number {
                    margin: 0 computed(20);
                    padding: 0 computed(15);
                    min-width: 5vw;
                    line-height: 100%;
                    border-radius: 3px;
                    border: 0;
                    text-align: center;
                }
            }
        }
        .img-group {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            padding: computed(10) 0 computed(10) computed(30);
            .img-box {
                position: relative;
                width: computed(150);
                height: computed(150);
                margin: 0 computed(18) computed(30) 0;
                img {
                    width: 100%;
                    height: 100%;
                }
                .icon-box {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: computed(-20);
                    right: computed(-20);
                    width: computed(40);
                    height: computed(40);
                    color: #fff;
                    margin: 0;
                    padding: 0;
                    font-size: computed(20);
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.3);
                }
            }
        }
    }
    .bottom {
        height: computed(100);
        padding: 0 computed(30);
        .submit {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: computed(32);
            background: $maincolor;
        }
    }
}
.popup-wrap {
    width: 100vw;
    padding: computed(30) 0;
    box-sizing: border-box;
    .action-icon {
        display: flex;
        justify-content: space-between;
        font-size: computed(36);
        padding: 0 computed(30);
        margin-bottom: computed(20);
        .iconfont {
            font-size: computed(36);
        }
    }
    .group {
        box-sizing: border-box;
        .title {
            color: #0d0e09;
            font-size: computed(32);
            font-weight: medium;
            font-family: "PingFang-SC-Medium";
            padding: computed(20) 0;
        }
        .img-group {
            img {
                width: computed(120);
                height: computed(120);
                margin-right: computed(20);
            }
            .selected {
                outline: solid 1px #2ba4f3;
            }
        }
        .size-group {
            display: flex;
            flex-wrap: wrap;
            .size {
                color: #0d0e09;
                font-size: computed(28);
                border: solid 1px #cccccc;
                padding: computed(20) computed(15);
                margin: computed(20) computed(20) 0 0;
            }
            .active {
                border: 0;
                color: #fff;
                background: #2ba4f3;
            }
        }
        .num-select {
            display: flex;
            align-items: center;

            .iconfont {
                font-size: computed(36);
            }
            .number {
                margin: 0 computed(20);
                padding: 0 computed(15);
                color: #fff;
                line-height: 100%;
                border-radius: 3px;
                text-align: center;
                background-color: #2ba4f3;
            }
        }
    }
}
.border-bottom-gray {
    border-bottom: solid computed(1) #e6e6e6;
}
.padding-tb30 {
    padding-top: computed(30) !important;
    padding-bottom: computed(30) !important;
}
.padding-lr30 {
    padding-left: computed(30);
    padding-right: computed(30);
}
input::placeholder {
    color: #cccccc;
}
</style>

<template>
    <div class="wrap">
        <div class="flex-auto overflow-scroll">
            <div class="goods">
                <div class="img" :class="{'cusTag':good.orderFlag===1}">
                    <img :src="getImg(good.thumb)" onerror="errImg(event)">
                </div>
                <div class="info">
                    <div class="name">{{good.goodsName}}</div>
                    <div class="price-and-num">
                        <div class="price">￥{{good.averagePrice|Fix2}}</div>
                        <div class="num">×{{good.applyNum||0}}</div>
                    </div>
                </div>
            </div>
            <div class="content">
                <!-- 售后方式 -->
                <div class="group">
                    <div class="title">
                        售后类型
                        <span class="red">*</span>
                    </div>
                    <div class="action" @click="getPostSaleWay()">
                        {{way.returnTypeName||"请选择售后类型"}}
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
                <!-- 售后原因 -->
                <div class="group">
                    <div class="title">
                        售后原因
                        <span class="red">*</span>
                    </div>
                    <div class="action" @click="getReason()">
                        {{reason.reasonName||"请选择售后原因"}}
                        <i class="iconfont icon-gengduo"></i>
                    </div>
                </div>
                <!-- 换货商品 -->
                <div class="group" v-if="selectedGoods.length===0&&isChange">
                    <div class="title flex-vcenter pdB20">
                        换货商品
                        <span class="red">*</span>
                        <span v-if="good.orderFlag" class="fs24 grey66 pdL10">该商品为定制商品,不支持换货</span>
                    </div>
                    <div class="action" @click="changeGood()" v-if="!good.orderFlag">
                        请选择需要换货的商品
                        <i class="iconfont icon-youfan"></i>
                    </div>
                </div>
                <!-- 继续换货商品 -->
                <div class="group" v-if="selectedGoods.length>0&&isChange">
                    <div class="title flex-between">
                        <div>
                            <span>换货商品</span>
                            <span class="red">*</span>
                        </div>
                        <a class="fs28 mgR30" @click="changeGood()" v-if="remainQty>0">继续添加</a>
                    </div>
                    <div class="pdTb10 borderB1c" v-if="!good.orderFlag">
                        <div class="flex-between" v-for="(sku,index) in selectedGoods" :key="index">
                            <div class="flex-box fs32B Wrap">
                                <div class="flex-vcenter pdL30 pdTb10">
                                    <span class="color">{{sku.colorName}}</span>
                                    <span class="size mgL30">{{sku.sizeName}}</span>
                                    <span class="size mgL30">x{{sku.partAmount}}</span>
                                </div>
                            </div>
                            <div
                                class="del flex-vcenter mgR30 grey99"
                                @click="delGoodFromSelectedGoods(index)"
                            >x</div>
                        </div>
                    </div>
                </div>
                <!-- 返修数量 -->
                <div class="group" v-if="isRepair">
                    <div class="title" style="border:none">
                        返修数量
                        <span class="red">*</span>
                    </div>
                    <div class="num-select">
                        <i class="iconfont icon-jianshao" @click="minus()"></i>
                        <van-field
                            v-model="params.amount"
                            :border="false"
                            type="number"
                            pattern="[0-9]*"
                            v-inputfix
                        />
                        <i class="iconfont icon-zengjia" @click="increase()"></i>
                    </div>
                </div>
                <!-- 退货数量 -->
                <div class="group" v-if="isReturn">
                    <div class="title" style="border:none">
                        退货数量
                        <span class="red">*</span>
                    </div>
                    <div class="num-select">
                        <i class="iconfont icon-jianshao" @click="minus()"></i>
                        <van-field
                            v-model="params.amount"
                            :border="false"
                            v-inputfix
                            type="number"
                            pattern="[0-9]*"
                        />
                        <i class="iconfont icon-zengjia" @click="increase()"></i>
                    </div>
                </div>
                <!-- 退款金额 -->
                <div class="group" v-if="isRefund">
                    <div class="title border-bottom-gray">
                        退款金额
                        <span class="red">*</span>
                    </div>
                    <div class="flex-vcenter flex-between fs28 border-bottom-gray pd10">
                        <van-field
                            type="number"
                            class="flex-auto h100 pd10"
                            placeholder="请输入退款金额"
                            v-model="returnsAmount"
                            clearable
                            v-inputfix
                            :border="false"
                        />
                        <div class="grey66">(最多可退款退 {{placeholder | Fix2}} 元 )</div>
                    </div>
                </div>
                <!-- 售后说明 -->
                <div class="group">
                    <div class="title">售后说明</div>
                    <div class="description">
                        <van-field
                            type="textarea"
                            rows="1"
                            autosize
                            clearable
                            placeholder="请输入售后说明"
                            v-model="params.reasonMemo"
                            maxlength="100"
                            v-inputfix="'textarea'"
                        />
                        <span>{{params.reasonMemo.length}}/100</span>
                    </div>
                </div>
                <upload-file :good="good" :images.sync="images"/>
            </div>
        </div>
        <div class="bottom">
            <div class="submit" @click="submitPostSale()">提 交</div>
        </div>
        <!-- 换货弹窗 -->
        <van-popup v-model="show" :overlay="true" position="top">
            <div class="popup-wrap">
                <div class="action-icon">
                    <i class="iconfont icon-shanchuguanbi" @click="close()"></i>
                    <i class="iconfont icon-queding" @click="confirm()"></i>
                </div>
                <div class="goods border-bottom-gray padding-tb30">
                    <div class="img">
                        <img :src="getImg(good.thumb)" alt>
                    </div>
                    <div class="info">
                        <div class="name">{{good.goodsName}}</div>
                        <div class="price-and-num">
                            <div class="price">￥{{good.averagePrice | Fix2}}</div>
                            <div class="num">剩余可换货件数 ×{{remainQty}}</div>
                        </div>
                    </div>
                </div>
                <div class="group padding-lr30">
                    <div class="title">换货颜色</div>
                    <div class="img-group">
                        <img
                            :src="getImg(item.lumpThumb)"
                            alt
                            v-for="(item,index) in colorList"
                            :key="index"
                            :class="{'selected':index===colorSelectedIndex}"
                            @click="selectColor(item,index)"
                        >
                    </div>
                </div>
                <div class="group padding-lr30">
                    <div class="title">换货尺码</div>
                    <div class="size-group">
                        <div
                            class="size"
                            v-for="(item,index) in sizeList"
                            :key="index"
                            @click="selectSize(item,index)"
                            :class="{'active':index===sizeSelectedIndex}"
                        >{{item.sizeName}}</div>
                    </div>
                </div>
                <div class="group padding-lr30">
                    <div class="title">换货数量</div>
                    <div class="num-select">
                        <i class="iconfont icon-jianshao" @click="minusForChange()"></i>
                        <span class="number">{{skuInfo.partAmount}}</span>
                        <i class="iconfont icon-zengjia" @click="increaseForChange()"></i>
                    </div>
                </div>
            </div>
        </van-popup>
        <wheelPicker
            :data="reasons"
            :label="'reasonName'"
            :confirm="selectReason"
            :show.sync="showReason"
            v-if="showReason"
        ></wheelPicker>
        <wheelPicker
            :data="ways"
            :label="'returnTypeName'"
            :confirm="selectWay"
            :show.sync="showWays"
            v-if="showWays"
        ></wheelPicker>
    </div>
</template>

<script>
import { Popup, Toast, Dialog, Field } from "vant";
import wheelPicker from "@/components/WheelPicker";
import uploadFile from "@/pages/order/components/uploadFile";
import check from "@/util/check";
export default {
    components: {
        wheelPicker,
        uploadFile,
        "van-popup": Popup,
        "van-field": Field
    },
    data() {
        return {
            show: false,
            good: {},
            way: {},
            ways: [],
            showWays: false, //弹出选择类型下拉框
            reason: {},
            reasons: [],
            showReason: false, //弹出选择原因下拉框
            selectedGoods: [],
            colorList: [],
            colorSelectedIndex: 0,
            sizeList: [],
            sizeSelectedIndex: 0,
            returnsAmount: null, //退款总额
            isChange: false, //显示换货
            isRepair: false, //显示返修
            isReturn: false, //显示退货
            isRefund: false, //显示退款
            disableUploadfile: false,
            params: {
                amount: 1, //退回数量
                returnsAmount: null, //退款金额
                busCountsCode: baseConstant.busContsCode,
                changeReplayCode: null,
                ordDtId: 0,
                reaSonCode: "",
                reapplycode: "",
                reasonMemo: "",
                returnTypeCode: "",
                savePictInfo: [],
                skuInfo: [],
                skuId: ""
            },
            skuInfo: {
                sizeCode: "",
                sizeName: "",
                colorCode: "",
                colorName: "",
                partAmount: 0,
                ptiPartHdCode: 0
            },
            imgs: [],
            images: [],
            isDisabled: false
        };
    },
    methods: {
        // 从路由获取参数
        getRouteParams() {
            if (!check.isEmpty(this.$route.params)) {
                this.Storage.set("paramsForApply", this.$route.params);
                return this.$route.params;
            } else {
                return this.Storage.get("paramsForApply");
            }
        },
        // 初始化提交参数
        initParams() {
            this.good = this.getRouteParams();
            console.log("good", this.good);
            this.params.ordDtId = this.good.saleOrdDtId;
            this.params.skuId = this.good.skuId;
            this.params.changeReplayCode = this.good.reApplyCode || null;
            this.skuInfo.ptiPartHdCode = this.good.goodsCode;
            return this.params;
        },
        // 获取售后类型
        async getPostSaleWay() {
            if (!check.isEmpty(this.ways)) {
                this.showWays = true;
                return;
            }
            let params = {
                saleOrdDtId: this.params.ordDtId
            };
            let result = await this.$get("postSale/getWays", params);
            if (result.status === 200) {
                this.ways = result.data.returnTypeList || [];
                this.showWays = true;
            } else {
                this.ways = [];
            }
            console.log("result", this.ways);
        },
        // 选择售后类型
        selectWay(way) {
            this.way = way;
            this.isChange = false;
            this.isRepair = false;
            this.isReturn = false;
            this.isRefund = false;
            this.params.returnTypeCode = way.returnTypeCode;
            if (way.returnTypeCode === "D_CHANGEPART") {
                this.getSkuInfo();
                this.isChange = true;
            } else if (way.returnTypeCode === "D_REPAIR") {
                this.isRepair = true;
                this.params.amount = 1;
            } else if (way.returnTypeCode === "D_RETURNSALES") {
                this.isReturn = true;
                this.params.amount = 1;
            } else if (way.returnTypeCode === "D_ONLYDRAWBACK") {
                this.isRefund = true;
            }

            console.log("way", way);
        },

        // 获取可选的售后原因
        async getReason() {
            if (!check.isEmpty(this.reasons)) {
                this.showReason = true;
                return;
            }
            let params = {
                pageNum: 1,
                pageSize: 10,
                effFlag: 1
            };
            let result = await this.$get("postSale/getReason", params);

            if (result.data.list) {
                this.reasons = result.data.list;
                console.log("reasons", this.reasons);
                this.showReason = true;
            }
        },
        // 选择原因
        selectReason(reason) {
            this.reason = reason;
            console.log("reson", reason);
            this.params.reaSonCode = reason.reasonCode;
            this.showReason = false;
        },

        // 点击换货,弹出换货弹窗
        async changeGood() {
            console.log("rparams", this.$route.params);
            // 判断可选数量是否大于0
            if (this.remainQty > 0) {
                this.skuInfo.partAmount = 1;
            } else {
                this.skuInfo.partAmount = 0;
            }
            this.show = true;
        },
        // 获取换货下拉弹窗中Sku信息
        async getSkuInfo() {
            if (!check.isEmpty(this.sizeList)) {
                return;
            }
            let params = {
                busContsCode: "D_BUSCONTS_WSC",
                goodsCode: this.$route.params.goodsCode,
                shopCode: this.Storage.get("shopCode").code
            };
            let goodsInfo = await this.$get("goods/info", params);
            this.colorList = goodsInfo.colorsVoList;
            this.sizeList = goodsInfo.sizesVoList;
            // 初始化skuInfo
            this.skuInfo.sizeCode = this.sizeList[0].sizeCode;
            this.skuInfo.sizeName = this.sizeList[0].sizeName;
            this.skuInfo.colorCode = this.colorList[0].colorCode;
            this.skuInfo.colorName = this.colorList[0].colorName;

        },
        // 选择尺码
        selectSize(item, index) {
            this.sizeSelectedIndex = index;
            this.skuInfo.sizeName = item.sizeName;
            this.skuInfo.sizeCode = item.sizeCode;
            this.skuInfo.sizeId = item.sizeId;
        },
        // 选择颜色
        selectColor(item, index) {
            this.colorSelectedIndex = index;
            this.skuInfo.colorCode = item.colorCode;
            this.skuInfo.colorName = item.colorName;
            this.skuInfo.colorId = item.colorId;
        },
        // 换货商品数量加
        increaseForChange() {
            if (this.skuInfo.partAmount < this.remainQty) {
                this.skuInfo.partAmount += 1;
                this.params.amount -= 1;
            } else {
                Toast("申请数量不能大于可换货件数");
            }
        },
        // 换货商品数量减
        minusForChange() {
            this.skuInfo.partAmount -= 1;
            if (this.skuInfo.partAmount < 1) {
                this.skuInfo.partAmount = 1;
            }
        },
        // 拷贝sku信息
        copySku(skuObj) {
            let sku = {};
            let keys = Object.keys(skuObj);
            keys.forEach(key => {
                sku[key] = this.skuInfo[key];
            });
            return sku;
        },
        //确认换货
        confirm() {
            if (this.remainQty > 0) {
                let sku = this.copySku(this.skuInfo);
                this.selectedGoods.push(sku);
            }
            this.show = false;
        },
        // 删除已选中换货数据
        delGoodFromSelectedGoods(index) {
            this.selectedGoods.splice(index, 1);
        },
        // 关闭换货弹窗
        close() {
            console.log("close");
            this.show = false;
        },

        //返修/退货数量增加
        increase() {
            if (this.params.amount < this.remainQty) {
                this.params.amount += 1;
            } else {
                if (this.params.returnTypeCode == "D_REPAIR") {
                    Toast("返修数量不能大于购买数量！");
                } else if (this.params.returnTypeCode == "D_RETURNSALES") {
                    Toast("退货数量不能大于购买数量！");
                }
            }
        },
        //返修数量减
        minus() {
            if (this.params.amount === 1) return;
            this.params.amount -= 1;
        },
        //计算换货商品数
        calNumOfChange() {
            let num = 0;
            this.selectedGoods.forEach(good => {
                num += good.partAmount;
            });
            return num;
        },

        // 提交售后申请
        async submitPostSale() {
            // 必填字段判空处理
            if (check.isEmpty(this.params.returnTypeCode)) {
                Toast("请选择售后类型");
                return;
            } else if (check.isEmpty(this.params.reaSonCode)) {
                Toast("请选择售后原因");
                return;
            }
            //根据特殊售后类型执行处理
            switch (this.way.returnTypeCode) {
                case "D_ONLYDRAWBACK": // 仅退款
                    if (check.isEmpty(this.params.returnsAmount)) {
                        Toast("请填写退款金额！");
                        return;
                    } else if (this.params.returnsAmount <= 0) {
                        Toast("退款金额不能为0！");
                        return;
                    }
                    this.params.amount = this.good.applyNum;

                    break;

                case "D_CHANGEPART": // 换货
                    this.params.skuInfo = this.selectedGoods;
                    this.params.amount = this.calNumOfChange();
                    // 判断是否定制商品
                    if (this.good.orderFlag == 1) {
                        Toast("定制商品不支持申请换货！");
                        return;
                    } else if (check.isEmpty(this.selectedGoods)) {
                        Toast("请至少选择一件商品!");
                        return;
                    }
                    break;
            }
            // 提交图片
            this.params.savePictInfo = this.images;
            let result = await this.$post("postSale/submitApply", this.params);

            if (result.status === 200) {
                Toast(result.data);
                this.$router.replace({
                    name: "postSaleList"
                });
            } else {
                Toast(result.data);
            }
        }
    },
    created() {
        this.initParams();
    },
    computed: {
        //换货时剩余可选数量
        remainQty: function () {
            let num = 0;
            this.selectedGoods.forEach(good => {
                num += good.partAmount;
            });
            return this.good.applyNum - num;
        },
        placeholder: function () {
            return this.good.averagePrice * this.good.applyNum;
        },
        amount: function () { }
    },
    watch: {
        returnsAmount: function (val) {

            let allowApplyPrice = this.good.averagePrice * this.good.applyNum || 0;
            if (val > allowApplyPrice) {
                this.returnsAmount = allowApplyPrice.toFixed(2);
            } else {
                this.params.returnsAmount = val;
            }
        },
        "params.amount": function (val) {
            if (val <= 1) {
                this.params.amount = 1;
            } else if (val >= this.remainQty) {
                if (this.params.returnTypeCode == "D_REPAIR") {
                    Toast("返修数量不能大于购买数量！");
                } else if (this.params.returnTypeCode == "D_RETURNSALES") {
                    Toast("退货数量不能大于购买数量！");
                }
                this.params.amount = this.remainQty;
            } else {
                this.params.amount = val;
            }
        }
    }
};
</script>
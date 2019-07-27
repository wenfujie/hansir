<style lang='scss' scoped>
.goodPic {
    padding: 0;
    margin: 0;
    width: computed(160);
    height: computed(160);
}
.volumn:nth-child(3n-1) {
    text-align: center;
}
.volumn:nth-child(3n) {
    text-align: right;
}
.button {
    margin-left: computed(30);
    padding-top: computed(5);
    padding-bottom: computed(5);
    border: solid computed(2) #999999;
    text-align: center;
    background: #fff;
}
</style>

<template>
    <div class="flex-box bg-white pd30" @click.stop="goToViewDetail()">
        <div class="w30">
            <div class="goodPic" :class="{'cusTag':isCustom}">
                <img :src="getImg(good.thumb)" alt class="w100 h100">
            </div>
        </div>
        <div class="flex-vbox flex-auto">
            <!-- 商品名称价格 -->
            <div class="flex-between">
                <div class="fs28B w70 flex-start">{{good.goodsName}}</div>
                <div class="flex-vbox flex-end w30 pd0">
                    <div class="fs26B">¥ {{good.averagePrice}}</div>
                    <div class="fs26 grey99">x{{good.ordQty}}</div>
                </div>
            </div>
            <p class="fs26 grey99" v-if="good.mainFab">定制颜色:&nbsp;{{good.mainFab.fabName}}</p>
            <!-- 刺绣详情 -->
            <div class="flex-vcenter fs24 grey99 mgTb20" v-if="isCustom">
                <span class="bg-gray pdLr5 pdTb2" @click.stop="showCusList()">
                    {{emText}}
                    <i class="iconfont icon-down fs28" v-if="emText!='无刺绣信息'"></i>
                </span>
            </div>
            <!-- 预计发货时间 -->
            <div class="flex-box mgB10" v-if="shipTime">
                <div class="fs26B">预计发货 :&nbsp;</div>
                <div class="fs26">{{shipTime}}</div>
            </div>
            <!-- 预约量体 -->
            <div class="flex-vbox" v-if="measure&&!good.measureInfo">
                <!-- 预约时间 -->
                <div class="flex-between" @click.stop="toggle('MeasureInfo')">
                    <div class="fs26B">预约量体:</div>
                    <div class="fs26">
                        {{measure.orderTime}}
                        <i
                            class="iconfont icon-down fs32B"
                            :class="{'rotatingUp':showMeasureInfo,'rotatingDown':!showMeasureInfo}"
                        ></i>
                    </div>
                </div>
                <!-- 预约人信息 -->
                <div class="fs24 grey66 mgT20" v-show="showMeasureInfo">
                    <div class="pdTb10 flex-box" v-if="measure">
                        <div class="w35">联系人 : &nbsp;</div>
                        <div class="flex-auto">{{measure.dressPerson}}</div>
                    </div>
                    <div class="pdTb10 flex-box" v-if="measure.dressPhone">
                        <div class="w35">联系电话 : &nbsp;</div>
                        <div class="flex-auto">{{measure.dressPhone}}</div>
                    </div>
                    <div class="pdTb10 flex-box" v-if="measure.msrWayName">
                        <div class="w35">量体方式 : &nbsp;</div>
                        <div class="flex-auto">{{measure.msrWayName}}</div>
                    </div>
                    <div class="pdTb10 flex-box" v-if="measure.reservationAddr">
                        <div class="w35">量体地址 : &nbsp;</div>
                        <div class="flex-auto">{{measure.reservationAddr}}</div>
                    </div>
                </div>
            </div>
            <!-- 着装人 -->
            <div class="flex-vbox mgT10" v-if="measure&&good.measureInfo">
                <!-- 预约时间 -->
                <div class="flex-between" @click.stop="toggle('MeasureData')">
                    <div class="fs26B">着装人 : {{measure.dressPerson}}</div>
                    <div>
                        <i
                            class="iconfont icon-down fs32B"
                            :class="{rotatingUp:showMeasureData,rotatingDown:!showMeasureData}"
                        ></i>
                    </div>
                </div>
                <!-- 预约人信息 -->
                <div class="flex-box flex-wrap fs24 grey66 mgT20" v-show="showMeasureData">
                    <div
                        class="mgB10 w33 pdTb10 volumn"
                        v-for="(volumn,index) in good.measureInfo"
                        :key="index"
                    >{{volumn.measureName}} &nbsp;&nbsp;&nbsp; {{volumn.measurevalue }}</div>
                </div>
            </div>
            <div class="flex-end mgT20">
                <button
                    class="button fs26B"
                    @click.stop="onBtnClick(btnApply)"
                    v-if="btnApply"
                >{{btnApply}}</button>
                <button
                    class="button fs26B"
                    @click.stop="onBtnClick(btnViewDetail)"
                    v-if="btnViewDetail"
                >{{btnViewDetail}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import check from "@/util/check";
import postSaleApi from "@/api/service/postSale";
import { initState } from "../../postSale/public/functions";
export default {
    props: {
        good: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            btnApply: null, //申请按钮
            btnViewDetail: null, //查看详情按钮
            btnChangeDress: null, //更改着装人
            showMeasureInfo: false, //显示联系人信息
            showMeasureData: false, //显示量体数据
            unApplyableOrdStatus: ["D_TRANSCLOSE", "D_ORDSPAYING", "D_ORDCANCEL"] //不允许售后的订单状态
        };
    },
    methods: {
        //获取订单状态
        getOrdStatusCode() {
          return  this.$route.query.ordStatusCode
        },
        // 初始化售后状态
        initState() {
            this.showMeasureInfo = false;
            this.showMeasureData = false;
            console.log('goodInit',this.good);
            if (check.isEmpty(this.good)) return;
            // 如果商品存在申请单则能够查看售后详情
            if (!check.isEmpty(this.good.reapplyCodes)) {
                this.btnViewDetail = "售后详情";
            } else {
                this.btnViewDetail = null;
            }
            // 待付款/交易关闭的订单不允许售后
            let code = this.getOrdStatusCode();
            if (this.unApplyableOrdStatus.includes(code)) {
                this.btnApply = null;
                return;
            }

            if (this.good.applyable) {
                this.btnApply = "申请售后";
            } else {
                this.btnApply = null;
            }
        },
        // 控制量体信息展示隐藏
        toggle(flag) {
            switch (flag) {
                case "MeasureInfo":
                    this.showMeasureInfo = !this.showMeasureInfo;
                    break;
                case "MeasureData":
                    this.showMeasureData = !this.showMeasureData;
                    break;
            }
        },
        // 展示定制清单
        showCusList() {
            if (!this.emb && !this.emp) return;
            this.$emit("showCusList", this.good);
        },
        // 路由跳转
        goTo(path, params) {
            this.$router.push({
                name: path + "",
                path: "/" + path,
                params: params || {}
            });
        },
        // 申请售后
        applyPostSale() {
            if (!check.isEmpty(this.$route.params)) {
                this.Storage.set("shopCode", { code: this.$route.params.shopCode });
            }
            this.goTo("postSaleApply", this.good);
        },
        //查看售后详情
        viewPostSaleDaetail() {
            let num = this.good.reapplyCodes.length;
            if (num === 1) {
                let params = {
                    reapplycode: this.good.reapplyCodes[0]
                };
                this.goTo("postSaleDetail", params);
            } else {
                this.goTo("postSaleList");
            }
        },
        // 查看商品详情
        goToViewDetail() {
            this.$router.push({
                path: "goods-detail",
                query: {
                    goodsCode: this.good.goodsCode
                }
            });
        },
        //点击事件
        onBtnClick(name) {
            switch (name) {
                case "申请售后":
                    this.applyPostSale();
                    break;
                case "售后详情":
                    this.viewPostSaleDaetail();
                    break;
                case "更换着装人":
                    break;
                default:
                    this.btnApply = null;
                    this.btnViewDetail = null;
            }
        }
    },
    computed: {
        // 量体人信息
        measure: function () {
            if (check.isEmpty(this.good.measure)) return null;
            return this.good.measure[0];
        },
        // 预计发货时间
        shipTime: function () {
            if (this.getOrdStatusCode() != "D_ORDSSHIPPING") return null;
            if (this.good.nodeCode > 3) return null;
            if (check.isEmpty(this.good.estimateTime)) return null;

            return this.good.estimateTime.split(" ")[0];
        },
        // 是否定制
        isCustom: function () {
            return this.good.orderFlag == 1 ? true : false;
        },
        // 是否赠品
        isGift: function () {
            return this.good.isGift == 1 ? true : false;
        },
        //部件
        part: function () {
            if (check.isEmpty(this.good.parts)) return null;
            const part = this.good.parts.filter((part) => {
                // 过滤出唯一有刺绣的部位
                if (part.emb || part.embPrint) return part;
            })
            return check.isEmpty(part) ? null : part[0];
        },
        // 绣字
        emb: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.emb) ? null : this.part.emb[0];
        },
        // 绣花
        emp: function () {
            if (check.isEmpty(this.part)) return null;
            return check.isEmpty(this.part.embPrint) ? null : this.part.embPrint[0];
        },
        emText: function () {
            return (!this.emb && !this.emp) ? "无刺绣信息" : "刺绣详情"
        }

    },
    mounted() {
        this.initState();
    },
    watch: {
        good:{
            handler(){
                this.initState();
            },
            deep:true
        }  
    }
};
</script>
/*
 * @Author: yongtian.hong
 * @Date: 2018-10-11 15:04:24
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 14:43:42
 * @Description: 售后申请-退货退款
 */

<style lang='scss' scoped>
@import "./common";
</style>
<template>
    <div class="w100 h100 bg-gray">
        <div class="flex-vbox w100 h100">
            <div class="flex-auto overflow-scroll pd30">
                <ordState :data="data"/>
                <!-- 物流 -->
                <logis
                    :data="data"
                    :store="store"
                    :logis="logis"
                    :area="area"
                    :switchBackMode="switchBackMode"
                    :show-area-list.sync="showAreaList"
                    :show-store-list.sync="showStoreList"
                    :show-logis-list.sync="showLogisList"
                />
                <!-- 商品 -->
                <goods v-model="showEmp" :data="data" :good="good"/>
            </div>
            <div class="flex-between">
                <button
                    class="flex-center flex-auto h100px white"
                    :class="btnStyle"
                    v-if="btnName"
                    @click="btnEvent(btnName)"
                >{{btnName}}</button>
                <button
                    class="flex-center flex-auto h100px white"
                    :class="btnModifyStyle"
                    v-if="btnModify"
                    @click="btnEvent(btnModify)"
                >{{btnModify}}</button>
            </div>
        </div>
        <van-popup v-model="showAreaList" position="top">
            <van-area :area-list="cityList" @confirm="selectArea" @cancel="cancelAreaPopup"/>
        </van-popup>
        <WheelPicker
            :data="storeList"
            :label="'dptName'"
            :confirm="selectStore"
            :show.sync="showStoreList"
            v-if="showStoreList"
        />
        <WheelPicker
            :data="logisList"
            :label="'shippingName'"
            :confirm="selectLogis"
            :show.sync="showLogisList"
            v-if="showLogisList"
        />
        <em-info :good="good" v-model="showEmp"/>
    </div>
</template>

<script>
import {
    initState,
    selectArea,
    selectStore,
    selectLogis,
    switchBackMode,
    saveLogis,
    btnClickEvent
} from "./public/functions";
import data from "./public/data";
import components from "./components";
export default {
    components: components,
    data() {
        return data;
    },
    methods: {
        initState() {
            initState(this);
            console.log("data", this.data);
        },
        //选择省市区
        selectArea(list) {
            selectArea(this, list);
        },
        //关地区选择弹窗
        cancelAreaPopup() {
            this.showAreaList = false;
        },
        // 选择门店
        selectStore(store) {
            selectStore(this, store);
        },
        // 选择物流
        selectLogis(logis) {
            selectLogis(this, logis);
        },
        // 退回方式切换回调
        switchBackMode(code) {
            switchBackMode(this, code);
        },
        // 按钮事件
        btnEvent(btnName) {
            btnClickEvent(this, btnName);
        },
        // 展示刺绣信息
        showEmInfo(val) {
            alert(val)
            this.showEmp = val;
        }
    },
    computed: {
        good: function () {
            if (!this.data.goodsList) return;
            return this.data.goodsList[0]
        },
        param: function () {
            if (!this.data.goodsList) return {
                saleOrdDtIds: []
            };
            return {
                saleOrdDtIds: this.data.goodsList[0].saleOrdDtId
            }
        }
    },
    watch: {
        showEmp: function () {
            console.log('refresh')
        }
    },
    created() {
        this.initState();
    },
    beforeDestroy() {
        this.data = {};
        this.btnName = null;
        this.btnModify = null;
    }
};
</script>
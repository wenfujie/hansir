/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 19:40:37
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-13 13:19:08
 * @Description: 订单详情页-交易关闭
 */

<style lang='scss' scoped>
</style>

<template>
  <div class="flex-vbox w100 h100 bg-gray">
    <scroll-tab :data="packages" :on-tab="changePackage" v-if="packages.length>1" class="bg-white"></scroll-tab>
    <!-- <order-step :pkg="pkg" class="bg-white"></order-step> -->
    <div class="flex-auto overflow-scroll pd30">
      <good-list :pkg="pkg" @showCusList="showCusList"></good-list>

      <address-info :pkg="pkg"></address-info>

      <order-info :order="order"></order-info>
    </div>
    <custom-list :params="cusParams"></custom-list>
  </div>
</template>

<script>
import components from "./components";
import data from "./public/data";
import { changePkg, getOrdInfo } from "./public/functions";
export default {
  components: components,
  data() {
    return data;
  },
  methods: {
    getOrderDetail() {
      getOrdInfo(this);
    },
    //切换包裹
    async changePackage(curPackage) {
      changePkg(this, curPackage);
    },
    // 展示定制清单
    showCusList(good) {
      this.cusParams = {
        billCode: this.order.billCode,
        saleOrdDtIds: good.saleOrdDtId
      };
    }
  },
  created() {
    this.getOrderDetail();
  }
};
</script>
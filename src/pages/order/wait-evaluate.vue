/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 19:40:37
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 17:50:19
 * @Description: 订单详情页-待评价
 */

<style lang='scss' scoped>
.share {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: computed(100);
  height: computed(100);
  background: #fff;
}
.share-tip {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #000000;
  opacity: 0.8;
  text-align: center;
  z-index: 100;
}
</style>

<template>
  <div class="flex-vbox w100 h100 bg-gray">
    <scroll-tab :data="packages" :on-tab="changePackage" v-if="packages.length>1" class="bg-white"></scroll-tab>
    <order-step :pkg="pkg" class="bg-white"></order-step>
    <div class="flex-auto overflow-scroll pd30">
      <logistic :data="pkg"></logistic>
      <address-info :pkg="pkg"></address-info>
      <good-list :pkg="pkg" @showCusList="showCusList"></good-list>
      <order-info :order="order"></order-info>
    </div>
    <div class="flex-box w100">
      <div class="share" @click="showShareGuide()">
        <i class="iconfont icon-fenxiang1 fs40"></i>
        <div class="fs26">分享</div>
      </div>
      <div class="flex-auto flex-center h100px bg-red white" @click="goToEvaluate()">立即评价</div>
    </div>
    <div class="share-tip" @click="closeShareGuide()" v-if="isShowGuid">
      <img src="@/assets/images/order/guide.png" alt>
    </div>
    <custom-list :params="cusParams"></custom-list>
  </div>
</template>

<script>
import components from "./components";
import data from "./public/data";
import { changePkg, getOrdInfo, getParams } from "./public/functions";
import wx from "weixin-js-sdk";
export default {
  components: components,
  data() {
    return Object.assign(
      {
        isShowGuid: false
      },
      data
    );
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
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
    },
    // 去评价
    goToEvaluate() {
     this.$router.push({
                path: "/orderEvaluate",
                query: {
                    busContsCode: baseConstant.busContsCode,
                    billCode: this.$route.query.billCode
                }
            });
    },
    postMessage() {
      let url =
        window.location.href.split("#")[0] +
        "#/orderShare?billCode=" +
        this.order.billCode +
        "&usrId=" +
        this.Storage.get("USER_INFO").usrId +
        "&companyId=" +
        this.Storage.get("COMPANYID").company_id;
      console.log("url", url);
      getAuthorize({ from: "waitEvaluate", url: url });
    },
    //显示分享指导
    showShareGuide() {
      this.isShowGuid = true;
      // this.postMessage();
    },
    // 关闭分享指导
    closeShareGuide() {
      this.isShowGuid = false;
    }
  },
  async created() {
    await this.getOrderDetail();
  },
  watch: {
    order: function(ord) {
      if (ord) this.postMessage();
    }
  },
  beforeDestroy() {
    getAuthorize({ from: "waitEvaluate", url: "" });
  }
};
</script>
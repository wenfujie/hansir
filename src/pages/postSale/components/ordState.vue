<style lang='scss' scoped>
.green {
  color: lightgreen;
}
.grey {
  color: #cccccc;
}
</style>]

<template>
  <div v-if="data" class="bg-white pd30 mgB30">
    <div class="fs36 text-center mgTb20 orange">{{ordStateMap[data.applyStatusCode]}}</div>
    <div class='fs28 text-center mgB20' v-if='reasonInfo'>{{reasonInfo}}</div>
    <div class="fs30 pdTb20">
      <div class="mgB30">申请单编号：{{ data.reApplycode}}</div>
      <div class="mgB30">原订单号: {{data.billCode}}</div>
      <div class="mgB30">申请时间：{{data.applyTime}}</div>
      <div class="mgB30" v-if="data.ticketMoney">{{repairDesc}}<span class="green"> ￥{{data.ticketMoney}}</span><span class="grey">{{data.payMemo}}</span></div>
    </div>
  </div>
</template>

<script>
import { getDestnation, getShopList } from "@/api/service/base";
import ordStateMap from "../public/OrdStateMap";
export default {
  props: {
    data: {}
  },
  data() {
    return {
      reasonInfo: "",
      repairDesc: "",
      showRepairPrice: false,
      showReasonInfo: false,
      ordStateMap: ordStateMap
    };
  },
  methods: {
    init() {
      this.reasonInfo = null;
      switch (this.data.returnTypeName) {
        case "仅退款":
          this.refunds();
          console.log("仅退款");
          break;
        case "退货退款":
          this.returnGood();
          console.log("退货退款");
          break;
        case "返修":
          this.repaired();
          console.log("返修");
          break;
        case "换货":
          this.changeGood();
          console.log("换货");
          break;
      }
    },
    // 退款处理
    refunds() {
      switch (this.ordStateMap[this.data.applyStatusCode]) {
        case "待审核":
          this.reasonInfo = null;
          break;
        case "处理中":
          this.reasonInfo = null;
          break;
        case "已完成":
          this.reasonInfo = "退款资金已原路返回，以实际到账为准";
          break;
        case "已关闭":
          this.reasonInfo = null;
          break;
        case "已拒绝":
          this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
          break;
        default:
          this.reasonInfo = null;
      }
    },
    // 退货
    returnGood() {
      switch (this.ordStateMap[this.data.applyStatusCode]) {
        case "待审核":
          this.reasonInfo = null;
          break;
        case "待寄回":
          this.reasonInfo = "请寄回并填写物流信息";
          break;
        case "已寄回":
          this.reasonInfo = "处理中";
          break;
        case "已完成":
          this.reasonInfo = "退款资金已原路返回，以实际到账为准";
          break;
        case "已关闭":
          this.reasonInfo = null;
          break;
        case "已拒绝":
          this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
          break;
        default:
          this.reasonInfo = null;
      }
    },
    // 返修
    repaired() {
      switch (this.ordStateMap[this.data.applyStatusCode]) {
        case "待审核":
          this.reasonInfo = null;
          break;
        case "待支付":
          this.reasonInfo = "请先支付返修费用";
          this.repairDesc = "返修费用: ";
          break;
        case "待寄回":
          this.reasonInfo = "请寄回并填写物流信息";
          this.repairDesc = "已支付返修费用";
          break;
        case "已寄回":
          this.reasonInfo = "等待维修中";
          this.repairDesc = "已支付返修费用";
          break;
        case "待处理":
          this.reasonInfo = "等待维修中";
          this.repairDesc = "已支付返修费用";
          break;
        case "维修中":
          this.reasonInfo = "维修中";
          this.repairDesc = "已支付返修费用";
          break;
        case "维修完成":
          this.repairDesc = "已支付返修费用";
          break;
        case "已完成":
          this.repairDesc = "已支付返修费用";
          break;
        case "已关闭":
          this.reasonInfo = null;
          break;
        case "已取消":
          this.reasonInfo = null;
          break;
        case "已拒绝":
          this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
          break;
        default:
          this.reasonInfo = null;
      }
    },
    // 换货
    changeGood() {
      switch (this.ordStateMap[this.data.applyStatusCode]) {
        case "待审核":
          this.reasonInfo = null;
          break;
        case "待寄回":
          this.reasonInfo = "请寄回并填写物流信息";
          break;
        case "已寄回":
          this.reasonInfo = "处理中";
          break;
        case "已完成":
          this.reasonInfo = null;
          break;
        case "已关闭":
          this.reasonInfo = null;
          break;
        case "已拒绝":
          this.reasonInfo = "拒绝原因:" + this.data.refuseReason;
          break;
        default:
          this.reasonInfo = null;
      }
    },
    // 获取地区
    async getArea() {
      let result = await getDestnation();
      console.log("area", result);
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    });
  },
  watch: {
    data: function() {
      this.init();
    }
  }
};
</script>
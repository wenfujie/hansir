/*
 * @Author: yongtian.hong
 * @Date: 2018-08-03 16:43:04
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 10:48:08
 * @Description: 物流进度组件
 */

<style lang="scss" scoped>
.step-wrap {
  width: 100%;
  padding: computed(15) 0;
  font-size: computed(24);
  .line-wrap {
    padding: computed(15) computed(30);
    .line {
      position: relative;
      width: 100%;
      height: computed(19);
      background-color: #e6e6e6;
      .overlayer {
        position: absolute;
        left: 0;
        top: 0;
        width: 20%;
        height: 100%;
        background-color: $blackcolor;
      }
    }
  }
  .text-wrap {
    display: flex;
    justify-content: space-between;
    padding-top: 0px;
    padding-bottom: computed(10);
    .step {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .stepActive {
      color: $maincolor;
    }
    .finish {
      color: #999999;
    }
  }
}
</style>

<template>
    <div class="step-wrap">
        <div class="line-wrap">
            <div class="line">
                <div class="overlayer" ref="process"></div>
            </div>
        </div>
        <div>
            <div class="text-wrap">
                <div
                    class="step"
                    v-for="(step,index) in steps"
                    :key="index"
                    :class="{stepActive:activeIndex===index}"
                >
                    <div class="text">{{step.name}}</div>
                    <div class="time" v-if="step.time">{{step.time}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import getDeliveryWay from "../public/deliveryText";
import check from "@/util/check";
export default {
    name: "OrderStep",
    props: {
        pkg: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            steps: [],
            errMsg: {
                kdps: '已取消发货',
                mdzq: '已取消发货'
            },
            activeIndex: 1
        };
    },
    methods: {
        //初始化步骤
        init() {
            let deliveryWay = getDeliveryWay();
            this.steps = deliveryWay[this.pkg.shippingWayCode];
            // 加载配送方式映射表
            if (check.isEmpty(this.pkg.nodeTime)) {
                this.pkg.nodeCode = 3;
                this.steps[this.pkg.nodeCode - 1].name = this.errMsg[this.pkg.shippingWayCode];
            } else {
                this.steps[this.pkg.nodeCode - 1].time = this.pkg.nodeTime;
            }
            let percent = (this.pkg.nodeCode / 5) * 100;
            this.$refs.process.style.width = percent + "%";
            this.activeIndex = this.pkg.nodeCode - 1;
        }
    },
    watch: {
        pkg: function (pkg) {
            this.init();
        }
    }
};
</script>
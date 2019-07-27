<style lang='scss' scoped>
  .white{
     color:#FFFFFF;
  }
  .greyFA{
      color: #FAFAFA;
  }
   .greyF5{
      color: #F5F5F5;
  }
   .greyD2{
      color: #F5F5F5;
  }
  .grey99{
      color: #999999;
  }
  .black{
      color: #0D0E09;
  }
  .black33{
       color: #333333;
  }
  .red{
      color: #C41717;
  }
  .grey99{
     color:#999999;
  }
  .coupon{
      width: 100%;
      min-height: computed(180);
      background: url('../../../assets/images/vouchers/vouchers-bg.png');
      background-size: 100% 100%;
      box-sizing:border-box; 
      .left{
        width:computed(180);
        min-height: 100%;
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height:100%;
        width:computed(180);
        box-sizing:border-box;
      }
  }
  .button{
    width:computed(130);
    height: computed(60);
    background: #0D0E09;
    color:#fff;
  }
  .describe{
    color:#333333;
    font-size: computed(24);
    padding: computed(20);
    line-height: computed(28);
    background: #FAFAFA;
  }
  .salePrice{
    font-size: computed(32);
    font-weight: 600;
    color:#C41717;
    margin-bottom: computed(20);

  }
</style>

<template>
    <div>
        <!-- 充值卡 -->
        <div class="mgB30">
            <div class="coupon flex-box">
                <div class="left flex-vbox flex-center">
                    <div>
                        <span class="fs24">¥&nbsp;</span>
                        <span class="fs36B">200</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">充值卡</p>
                    <div class="fs26">
                        <span class="GREY.grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 GREY.grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right">
                    <div class="button flex-center" @click="operate()">使用</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="describe" v-if="showDesc">说明</div>
        </div>
    </div>
</template>

<script>
import { Vouchers, Payment, Order } from '@/api/service'
import { Toast } from 'vant'
import wxPay from "@/util/wxPay"
export default {
    props: {
        card: Object
    },
    data() {
        return {
            showDesc: false,
        }
    },
    computed: {
        // 有效期
        valiPeriod: function () {
            return "2018.12.22 - 2019.12.09"
            let start = this.card.couponStartTime.split(" ");
            let end = this.card.couponEndTime.split(" ");
            let startTime = start[0].replace(/\-/g, ".") + " " + start[1].substr(0, 5);
            let endTime = end[0].replace(/\-/g, ".") + " " + end[1].substr(0, 5);
            return startTime + "-" + endTime;
        },
    },

    methods: {
        // 使用说明显示控制
        showUsage() {
            if (this.card.couponLimit) {
                this.showDesc = !this.showDesc;
            }
        },
        //空参数过滤器
        paramsFilter(params) {
            let keys = Object.keys(params);
            keys.forEach((key) => {
                if (!params[key]) {
                    delete params[key];
                }
            });
            console.log('filter', params);
            return params;
        },
        // 操作
        user() {

        }
    },
    created() {
        console.log("card", this.card.cardTypeCode);
    },
}
</script>
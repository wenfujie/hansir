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
                        <span class="fs36B">{{card.remainAmount}}</span>
                    </div>
                </div>
                <div class="center flex-auto flex-vbox flex-between pdTb20">
                    <p class="fs28B">{{card.valuecardName}}</p>
                    <div class="fs26">
                        <span class="grey99 fs24">{{valiPeriod}}</span>
                    </div>
                    <div class="fs24 grey99" @click="showUsage()">
                        使用说明
                        <i
                            :class="['iconfont icon-down ',{'rotatingUp':showDesc,'rotatingDown':!showDesc}]"
                        ></i>
                    </div>
                </div>
                <div class="right">
                    <div class="button flex-center" @click="charge()">使用</div>
                </div>
            </div>
            <!-- 说明 -->
            <div class="flex-vbox fs24 gray" v-if="showDesc">
                <div class="flex-box mgTb20 pdLr20">
                    <div class="flex-box flex-auto">
                        <div class>卡号 :</div>
                        <div class="flex-auto pdL20">{{card.cardCode}}</div>
                    </div>
                    <div class="flex-box flex-auto">
                        <div class>密码 :</div>
                        <div class="flex-auto pdL20">{{card.password||'无需密码'}}</div>
                    </div>
                </div>
                <div v-if="card.memo">使用范围 : {{card.memo}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import * as fundApi from "@/api/service/fund";
import { Toast, Dialog } from "vant";
import wxPay from "@/util/wxPay";
export default {
    props: {
        card: Object,
        reload: Function
    },
    data() {
        return {
            showDesc: false
        };
    },
    computed: {
        // 有效期
        valiPeriod: function () {
            let start = this.card.startDate.split(" ");
            let end = this.card.endDate.split(" ");
            let startTime =
                start[0].replace(/\-/g, ".") + " " + start[1].substr(0, 5);
            let endTime =
                end[0].replace(/\-/g, ".") + " " + end[1].substr(0, 5);
            return startTime + "-" + endTime;
        }
    },

    methods: {
        // 使用说明显示控制
        showUsage() {
            this.showDesc = !this.showDesc;
        },
        // 通过卡号充值,点击使用时触发该方法
        async chargeByCardId() {
            let params = {
                cardId: this.card.id
            };
            fundApi.chargeByCardId(params).then(
                res => {
                    if (res === 1) {
                        Toast("充值成功");
//                        this.reload();
                        this.$router.push("/fund-detail");
                    } else {
                        Toast("充值失败");
                    }
                },
                err => {
                    Toast("充值失败");
                }
            );
        },
        charge() {
            Dialog.confirm({
                message: '是否确定将金额充值至我的资金账户?'
            }).then(() => {
                this.chargeByCardId();
            })
        }
    },
    created() { }
};
</script>
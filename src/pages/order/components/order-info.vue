/*
 * @Author: yongtian.hong
 * @Date: 2018-11-08 20:47:41
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-17 15:58:10
 * @Description: 订单信息
 */
 <style lang='scss' scoped>
</style>
 
 <template>
    <div class="bg-white pdLr30 mgB30">
        <div class="pdTb30 border-b1-c">
            <div class="flex-between mgB20">
                <div class="fs28">订单编号</div>
                <div class="fs26">{{order.billCode||'暂无单号'}}</div>
            </div>
            <div class="flex-between">
                <div class="fs28">下单时间</div>
                <div class="fs26">{{order.ordTime}}</div>
            </div>
        </div>
        <div class="pdTb30 border-b1-c">
            <div class="flex-between mgB20">
                <div class="fs28">优惠</div>
                <div class="fs26B">
                    <span>-¥</span>
                    {{order.totalSumAmount | Fix2}}
                </div>
            </div>
            <div class="flex-between mgB20">
                <div class="fs28">积分抵现</div>
                <div class="fs26B">
                    <span>-¥</span>
                    {{order.amountPoint | Fix2}}
                </div>
            </div>
            <div class="flex-between mgB20">
                <div class="fs28">储值卡</div>
                <div class="fs26B">
                    <span>-¥</span>
                    {{ order.discAmount | Fix2}}
                </div>
            </div>
            <div class="flex-between mgB20">
                <div class="fs28">余额抵扣</div>
                <div class="fs26B">
                    <span>-¥</span>
                    {{ order.balancePayAmount||0}}
                </div>
            </div>
            <div class="flex-between mgB20" v-if="emPrice!=0">
                <div class="fs28">刺绣费用</div>
                <div class="fs26B">
                    <span>¥</span>
                    {{ emPrice}}
                </div>
            </div>

            <div class="flex-between fs26">
                <div class="w50">订单备注</div>
                <div>{{order.ctmMessage||"暂无备注"}}</div>
            </div>
        </div>
        <div class="pdTb30 border-b1-c">
            <div class="flex-between mgB20">
                <div class="fs28">运费</div>
                <div class="fs26B">¥{{order.amountTrans | Fix2}}</div>
            </div>
            <div class="flex-between">
                <div class="fs28">商品总额</div>
                <div class="fs26B">¥{{(order.amountPart-emPrice) | Fix2}}</div>
            </div>
            <!-- <div class="flex-between mgB20">
                <div class="fs28">账户抵扣</div>
                <div class="fs26 orange">{{order.balancePayAmount||0}}</div>
            </div>-->
        </div>
        <div class="flex-end pdT20 pdB30 flex-center">
            <div class="fs24">实付金额 :&nbsp;</div>
            <div class="fs30B">¥{{actualPay|Fix2}}</div>
        </div>
    </div>
</template>
 
 <script>
import check from "@/util/check";
export default {
    props: {
        order: {
            type: Object,
            default: {}
        }
    },
    methods: {
        calEmPrice() {
            let emPrice = 0;
            if (!this.order.goodsList) return;
            this.order.goodsList.forEach((good) => {

                if (!!good.parts && good.parts.length > 0) {

                    good.parts.forEach((part) => {

                        let ems = part.emb || part.embPrint;

                        if (ems) {

                            ems.forEach((em) => {

                                emPrice += em.price;

                            })
                        }




                    })

                }

            })
            console.log('order', this.order)
            console.log('emPrice', emPrice)
            return emPrice;
        }

    },
    computed: {
        //发票信息
        invoiceInfo: function () {
            if (check.isEmpty(this.order.invoiceDetail)) {
                return "无";
            } else {
                return (
                    this.order.invoiceDetail.typeName +
                    "(" +
                    this.order.invoiceDetail.title +
                    ")"
                );
            }
        },
        //刺绣费用
        emPrice: function () {
            return this.calEmPrice()
        },

        //实付款
        actualPay: function () {
            let money = this.order.actualAmount - this.order.amountPoint - this.order.balancePayAmount;
            if (money <= 0) {
                money = 0;
            }
            return money;
        }
    },

    watch: {
        order: function () {

        }
    }
};
</script>

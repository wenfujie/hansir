/*
* createTime：2018/10/9
* author：en.chen
* description:  订单支付
*/

class paymentFun {

    //  订单支付
    static async payOrder(ctx, params) {
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.payment +  '/order-pay', params).then((res) => {
            return res
        });
    }

}

module.exports = paymentFun
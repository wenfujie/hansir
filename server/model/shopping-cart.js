/*
 * createTime：2018/7/16
 * author：en.chen
 * description: 购物车模块用于处理前端请求的中间层接口
 */

class cart {
    //  批量转移本地购物车
    static async transferValue(ctx, params) {
        let url = '/rtl-cart-hd-aggregates/transfer?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  删除购物车
    static async deleteCartValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-cart-hds/usr-id', params).then((res) => {
            return res
        });
    }

    //  保存购物车列表
    static async saveCartValue(ctx, params) {
        let url = '/rtl-cart-hd-aggregates?companyId=' + params.companyId + '&flag=' + params.flag
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  查询购物车列表
    static async getCartListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/rtl-cart-hd-aggregates', params).then((res) => {
            return res
        });
    }

    //  查询购物车数量
    static async getCartCountValue(ctx, params) {
        let url = '/rtl-cart-hds/count/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }
}

module.exports = cart
/*
 * createTime：2018/7/25
 * author：en.chen
 * description: 会员模块-地址功能模块用于处理前端请求的中间层接口
 */

class userAddr {

    //  获取用户地址列表
    static async getAddrListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss', params).then((res) => {
            return res
        });
    }

    //  新增/修改用户地址信息
    static async changeAddrValue(ctx, params) {
        let url = '/vip-info-dt-addss/dest-code/' + params.usrId + '?destCode=' + params.destCode + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        }, (err) => {});
    }

    //  删除用户地址
    static async deleteAddrListValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss', params).then((res) => {
            return res
        });
    }

    //  获取地址详情
    static async addressDetailValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-dt-addss/receive-adds-info/id', params).then((res) => {
            return res
        });
    }


}

module.exports = userAddr
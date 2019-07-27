/*
 * createTime：2018/8/21
 * author：en.chen
 * description: 会员模块-会员信息功能模块用于处理前端请求的中间层接口
 */
class userInfo {
    //  根据用户获取下一等级还需要消费的金额，名称
    static async getVipLevelInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-level-upgs/next-level/info', params).then((res) => {
            return res
        });
    }

    //  获取账户页面会员信息
    static async getVipInfoValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-info-hds/index-info/usr-id', params).then((res) => {
            return res
        });
    }

    //  获取个人资料
    static async getUserInfoValue(ctx, params) {
        let url = '/vip-info-aggregates/usr-id/' + params.usrId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }
    //  修改个人资料
    static async updateUserInfoValue(ctx, params) {
        let url = '/vip-info-hds/usr-id/' + params.usrId + '?companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取会员自定义属性
    static async getMemberInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ctms/vip-customs', params).then((res) => {
            return res
        });
    }

    // 获取AI量体特征设置
    static async getAiMemberInfo(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-feature-infos/get-by-part-codes', params).then((res) => {
            return res
        });
    }

    //  修改会员自定义属性
    static async updateMemberInfoValue(ctx, params) {
        let url = '/sp-ctms/vip-customs?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    static async updateChimaInfoValue(ctx, params) {
        let url = '/sp-ctms/vip-bill-feature?billCode=' + params.billCode + '&usrId=' + params.usrId + '&companyId=' + params.companyId;
        console.log("-------->>", params)
        // params.spVipCustomsSaveDto.ownCompanyId = params.companyId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  修改会员自定义属性(新)
    static async updateMemberBodyInfo(ctx, params) {
        let url = '/sp-ctms/vip-measure-feature?usrId=' + params.usrId + '&companyId=' + params.companyId + "&saleMeasureHdId=" + params.saleMeasureHdId
        return ctx.$put(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  新增修改着装人数据
    static async updateAiMemberBodyInfo(ctx, params) {
        console.log()
        let url = '/vip-info-dt-figures/save?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }



    //  保存我的足迹
    static async saveUserFootprintValue(ctx, params) {
        
        let url = '/footmark-hd-aggregates/insert?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.memberService + url, params).then((res) => {
            return res
        });
    }

    //  获取我的足迹
    static async getUserFootprintValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hd-aggregates/get-myfootmark', params).then((res) => {
            return res
        });
    }

    //  删除我的足迹
    static async deleteUserFootprintValue(ctx, params) {
        return ctx.$delete(ctx.baseUrl + ctx.serverPortUrl.memberService + '/footmark-hds/clear-flag', params).then((res) => {
            return res
        });
    }

    //  获取消费记录
    static async getPurchaseHistoryValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/card-info-dt-costs/consume-list/usr-id', params).then((res) => {
            return res
        });
    }

    //  获取会员推荐尺码
    static async getMemberRcmdValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-ctms/recommend-size', params).then((res) => {
            return res
        });
    }

    //  获取会员用户对应的等级设置的最低可用积分
    static async getMinIntegralValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.memberService + '/vip-level-ltns/min-integral-info', params).then((res) => {
            return res
        });
    }

    //  保存会员推荐尺码
    static async saveMemberRcmdValue(ctx, params) {
        let url = '/sp-ctms/recommend-size?usrId=' + params.usrId + '&companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params.spCommendSizeDto).then((res) => {
            return res
        });
    }
}

module.exports = userInfo
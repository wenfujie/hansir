/*
* createTime：2018/12/28
* author：zhibin.zhao
* description: 根据openid和unionid判断用户是否已存在
*/

const analysis = require('../../model/analysis')
const userLogin = require('../../model/login')
const cms = require('../../model/cms')

const mergeLogin = async function (ctx,next) {
    let properties = await cms.getProperties(ctx,ctx.params);
    ctx.params.appId = properties.data.appId
    ctx.params.appSecret = properties.data.appSecret
    let wechatInfo = await analysis.getWxData(ctx, ctx.params)
    let userSex = ''    // 默认没有性别
    if(wechatInfo.gender == 1){ // 男
        userSex = 'D_MALE'
    }else if(wechatInfo.gender == 2){   // 女
        userSex = 'D_FEMALE'
    }
    let loginData = {
        ownCompanyId: properties.data.companyId,
        companyId: properties.data.companyId,
        shopId: properties.data.shopIds,
        busContsCode: 'D_BUSCONTS_WSC',
        openId: wechatInfo.openId,
        signUpTypeCode: 'D_SMP',
        usrName: wechatInfo.nickName,
        url: wechatInfo.avatarUrl,
        sex: userSex
    }
    if (!!wechatInfo.unionId) loginData.unionId = wechatInfo.unionId
    console.log("##########", loginData)
    let userInfo = await userLogin.getUesrLoginValue(ctx, loginData)
    let loginInfo = {
        openId: wechatInfo.openId,
        companyId: properties.data.companyId,
        shopId: userInfo.data.shopId,
        shopCode: userInfo.data.shopCode,
        usrId: userInfo.data.usrId,
        wxUnionId: properties.data.mpUuid,
        publicAccount: properties.data.publicAccount
    }
    console.log(loginInfo)
    ctx.body = loginInfo;
}

module.exports = mergeLogin

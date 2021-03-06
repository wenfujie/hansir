/*
 * @Author: yongtian.hong
 * @Date: 2018-09-26 11:33:16
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-09-26 14:11:25
 * @Description: 第三方服务
 */
const thirdPartyModel = require("../../model/third-party");
class thirdPartyService {
  static async getLogis(ctx, next) {
    let params = {
      ownCompanyId: ctx.params.companyId,
      companyId: ctx.params.companyId,
      expressCode: ctx.params.expressCode,
      logisticCode: ctx.params.logisticCode
    };
    let logis = await thirdPartyModel.getLogis(ctx, params);
    ctx.body = {
      data: logis,
      statusCode: 200
    };
  }
}
module.exports = thirdPartyService;
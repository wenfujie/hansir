/*
* createTime：2018/10/12
* author：zhibin.zhao
* description: 获取wxUnionId、firameUrl、companyId
*/

const cms = require('../../model/cms')

const getProperties =  async function (ctx,next) {
    let res = await cms.getProperties(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getProperties
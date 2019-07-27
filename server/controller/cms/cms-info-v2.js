/*
* createTime：2018/7/6
* author：en.chen
* description: 内容管理获取模板内容v2
*/

const cms = require('../../model/cms')

const getCmsInfoV2 =  async function (ctx,next) {
    let res = await cms.getCmsInfoV2Value(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCmsInfoV2

/*
* createTime：2018/10/10
* author：en.chen
* description: 内容管理获取面包屑
*/

const cms = require('../../model/cms')

const getCrumbsDetail =  async function (ctx,next) {
    let res = await cms.getCrumbsDetailValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCrumbsDetail
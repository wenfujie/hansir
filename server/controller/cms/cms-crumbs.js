/*
* createTime：2018/7/13
* author：en.chen
* description: 内容管理获取面包屑
*/

const cms = require('../../model/cms')

const getCrumbs =  async function (ctx,next) {
    let res = await cms.getCrumbsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCrumbs

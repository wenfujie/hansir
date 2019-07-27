/*
* createTime：2018/7/19
* author：en.chen
* description: 内容管理获取模板导航内容
*/

const cms = require('../../model/cms')

const getNavigation =  async function (ctx,next) {
    let res = await cms.getNavigationValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getNavigation

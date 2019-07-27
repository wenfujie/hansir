/*
* createTime：2018/7/19
* author：en.chen
* description: 获取模板页面模块元素商品列表
*/

const cms = require('../../model/cms')

const getWebItemGoods =  async function (ctx,next) {
    let res = await cms.getGoodsListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getWebItemGoods

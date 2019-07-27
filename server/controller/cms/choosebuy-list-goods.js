/*
* createTime：2018/10/12
* author：en.chen
* description: 获取现购列表页面模块元素商品列表
*/

const cms = require('../../model/cms')

const getChoosebuyGoods =  async function (ctx,next) {
    let res = await cms.getGoodsItemListValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getChoosebuyGoods
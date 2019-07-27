/*
* createTime：2019/3/11
* author：fujie.wen
* description: 根据所选面料获取商品价格
*/

const goods = require('../../model/goods')

const getFabricPrice = async function (ctx,next) {
    let res = await goods.getFabricPriceValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getFabricPrice

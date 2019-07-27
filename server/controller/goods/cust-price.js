/*
* createTime：2019/3/12
* author：fujie.wen
* description: 获取商品价格（包括绣字绣花价格）
*/

const goods = require('../../model/goods')

const getCustPrice = async function (ctx,next) {
    let res = await goods.getCustPriceValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = getCustPrice

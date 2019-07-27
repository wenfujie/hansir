/*
* createTime：2019/3/8
* author：fujie.wen
* description: 根据商品id获取定制颜色
*/

const goods = require('../../model/goods')

const getCustomColors = async function (ctx,next) {
    let res = await goods.getCustomColorsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCustomColors

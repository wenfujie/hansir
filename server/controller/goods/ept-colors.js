/*
* createTime：2019/3/12
* author：fujie.wen
* description: 根据绣花主档id获取绣花颜色明细表列表
*/

const goods = require('../../model/goods')

const getEptColors = async function (ctx,next) {
    let res = await goods.getEptColorsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getEptColors

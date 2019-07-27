/*
* createTime：2018/8/10
* author：en.chen
* description:  商品模块查询热门商品列表
*/

const goods = require('../../model/goods')

const getHotGoods = async function (ctx,next) {
    let res = await goods.getHotGoodsValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getHotGoods

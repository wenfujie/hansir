/*
* createTime：2018/7/14
* author：en.chen
* description: 中间层提供给前端的商品模块api
*/

//  商品墙/商品列表
const getGoodsList = require('../controller/goods/goods-list')

//  商品墙/商品列表(过滤掉orderFlag=1的大件商品)
const getFilterGoodsList = require('../controller/goods/goods-filter')

//  推荐商品列表
const getGoodsRecommend = require('../controller/goods/recommend')

//  商品详情
const getGoodsInfo = require('../controller/goods/info')

//  组合商品详情
const goodsCombgoodInfo = require('../controller/goods/goods-combgood-info')

//  商品详情（定制）
const getGoodsInfoCusValue = require('../controller/goods/info-cus')

//  查询商品详情（组合2D展示）
const getGroupGoodsInfoCusValue = require('../controller/goods/group-info-cus')

//  商品详情目录
const getGoodsTitle = require('../controller/goods/goods-info-title')

//  查询商品分类
const getGoodsClass = require('../controller/goods/goods-class')

//  查询商品sku属性
const getGoodsSku = require('../controller/goods/goods-sku')

//  获取平台运营分类列表
const getPlatformList = require('../controller/goods/platformList')

//  获取商品评价
const getGoodsComments = require('../controller/goods/goods-comments')

//  获取风格选择列表
const goodsPropList = require('../controller/goods/prop-list')

//  获取商品尺寸大小
const getGoodsSize = require('../controller/goods/goods-size')

//  获取商品库存(大货)
const getGoodsStock = require('../controller/goods/goods-stock')

//  获取商品库存(定制单品)
const getGoodsStockCust = require('../controller/goods/goods-stockcust')

//  获取商品库存（单品、组合）
const getCommonStockCust = require('../controller/goods/common-stock-cust')

//  获取热门商品
const getHotGoods = require('../controller/goods/hot-goods')

//  获取推荐商品
const getPutGoods = require('../controller/goods/getPutGoodsValue')

//  获取商品评价综合评分
const getGoodsScore = require('../controller/goods/goods-score')

//  获取商品分类
const getGoodsLayerClass = require('../controller/goods/layer-class')

//  获取商品部件信息，主面料id
const getMainFabricInfo = require('../controller/goods/goods-fabric-info')

//  获取商品部件信息，主面料id
const getRecommendPackages = require('../controller/goods/recommend-packages')

//  获取购买可选套餐
const getBuyablePackages = require('../controller/goods/buyable-packages')

//  获取绣字颜色、字体列表
const getEmbFontColorList = require('../controller/goods/goods-font-color')

//  获取绣花图片列表
const getEmbPicList = require('../controller/goods/emb-picture')

//  根据绣花主档id获取绣花颜色明细表列表
const getEptColors = require('../controller/goods/ept-colors')

// 判断商品是否上架
const getGoodSellState = require('../controller/goods/good-sell-state')

// 根据商品id获取定制颜色
const getCustomColors = require('../controller/goods/custom-colors')

// 根据所选面料获取商品价格
const getFabricPrice = require('../controller/goods/fabric-price')

//  获取商品可绣花、绣字部位
const getUseablePart = require('../controller/goods/useable-part')

//  获取商品价格（包括绣字绣花价格）
const getCustPrice = require('../controller/goods/cust-price')

module.exports = {
    "GET/list": getGoodsList,
    "GET/recommend": getGoodsRecommend,
    "GET/info": getGoodsInfo,
    "GET/goodsCombgoodInfo": goodsCombgoodInfo,
    "GET/infoTitle": getGoodsTitle,
    "GET/goodsClass": getGoodsClass,
    "GET/goodsSku": getGoodsSku,
    "GET/platformList": getPlatformList,
    "GET/comments": getGoodsComments,
    "GET/propList": goodsPropList,
    "GET/goodsSize": getGoodsSize,
    "GET/goodsStock": getGoodsStock,
    "POST/goodsStockCust": getGoodsStockCust,
    "GET/hotGoods": getHotGoods,
    "GET/getPutGoods": getPutGoods,
    "GET/filterGoods": getFilterGoodsList,
    "GET/infoCus": getGoodsInfoCusValue,
    "GET/groupInfoCus": getGroupGoodsInfoCusValue,
    "GET/score": getGoodsScore,
    "GET/layer-class": getGoodsLayerClass,
    "GET/fabricInfo": getMainFabricInfo,
    "GET/recommendPackages": getRecommendPackages,
    "GET/buyablePackages": getBuyablePackages,
    "GET/fontColorList": getEmbFontColorList,
    "GET/embPicList": getEmbPicList,
    "GET/eptColors": getEptColors,
    "GET/useablePart": getUseablePart,
    "GET/goodSellState": getGoodSellState,
    "GET/customColors": getCustomColors,
    "GET/fabricPrice": getFabricPrice,
    "POST/commonStockCust": getCommonStockCust,
    "POST/custPrice": getCustPrice,
};

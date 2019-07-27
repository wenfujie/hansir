/*
 * createTime：2018/7/14
 * author：en.chen
 * description: 商品模块用于处理前端请求的中间层接口
 */

class goods {

    //  商品墙/商品列表
    /*    static async getGoodsListValue(ctx,params) {
            return ctx.$get(ctx.baseUrl,'/iss/sal/sp-part-goodss',params).then((res) =>{
                return res
            });
        }*/
    static async getGoodsListValue(ctx, params) {
        let url = '/sp-goods-list?busContsCode=' + params.busContsCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  商品墙/商品列表 过滤掉orderFlag=1的大件商品
    static async getFilterGoodsListValue(ctx, params) {
        let url = '/sp-goods-list/combgood_goods?busContsCode=' + params.busContsCode + '&platformCode=' + params.platformCode + '&companyId=' + params.companyId + '&queryNullBusFlag=1&shopId=' + params.shopId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  热门商品列表
    static async getHotGoodsValue(ctx, params) {
        let url = '/iss/bas/cms-searchword-hds?companyId=' + params.companyId
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.baseService + url, params).then((res) => {
            return res
        });
    }

    //  获取绣字颜色、字体列表
    static async getEmbFontColorListValue(ctx, params) {
        let url = '/ict-emb-hds-aggregate/fonnts-and-colors'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取商品可绣花、绣字部位
    static async getUseablePartValue(ctx, params) {
        let url = '/part-reg-ass-fabs/mtl-area'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取推荐商品
    static async getPutGoodsValue(ctx, params) {
        let url = '/sp-goods/what-you-want'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  查询单品推荐套餐
    static async getRecommendPackagesValue(ctx, params) {
        let url = '/pti-combpart-rela-dtts/show-list'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取购买可选套餐
    static async getBuyablePackagesValue(ctx, params) {
        let url = '/pti-combpart-rela-dts/eff-list'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  查询平台商品的推荐商品列表
    static async getGoodsRecommendValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods/goods-recommend', params).then((res) => {
            return res
        });
    }

    //  查询商品详情
    static async getGoodsInfoValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss', params).then((res) => {
            return res
        });
    }

    //  查询组合商品详情
    static async getCombGoodsInfoValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-combgood-goodss/comb-code', params).then((res) => {
            return res
        });
    }

    //  查询商品详情(定制)
    static async getGoodsInfoCusValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-hd-aggregates/good-info', params).then((res) => {
            return res
        });
    }

    //  获取绣花图片列表
    static async getEmbPicListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-goods/part-emb-prints', params).then((res) => {
            return res
        });
    }

    //  查询商品详情（组合2D展示）
    static async getGroupGoodsInfoCusValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/pti-combgood-hd-aggregates/combgood-info', params).then((res) => {
            return res
        });
    }

    //  查询商品详情目录列表
    static async getGoodsTitleValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goods-descs', params).then((res) => {
            return res
        });
    }

    //  获取商品分类
    static async getGoodsClassValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-class/simple-list', params).then((res) => {
            return res
        });
    }

    //  获取商品sku属性
    static async getGoodsSkuValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods-sku-infos/skus', params).then((res) => {
            return res
        });
    }

    //  获取平台运营分类列表
    static async getPlatformListValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + '/cms-busconcla-hds', params).then((res) => {
            return res
        });
    }

    //  获取商品评价综合评分
    static async getGoodsScoreValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods/comments/score', params).then((res) => {
            return res
        });
    }

    //  获取商品评价信息
    static async getGoodsCommentsValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + '/sp-part-goodss/goods/comments', params).then((res) => {
            return res
        });
    }

    //  获取风格选择列表
    static async getPropListValue(ctx, params) {
        let url = '/prop-hds/part-goods/' + params.code
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  获取商品尺寸列表
    static async getGoodsSizeValue(ctx, params) {
        let url = '/sp-part-goods-sizes/' + params.goodsCode + '/' + params.busContsCode
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取商品库存
    static async getGoodsStockValue(ctx, params) {
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + '/part-hds/whse-qty/goods-codes', params).then((res) => {
            return res
        });
    }

    //  获取商品库存(定制单品)
    static async getGoodsStockCustValue(ctx, params) {
        let url = `/sp-goods/fabinvy-judge`
        return ctx.$postUrl(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  商品模块查询商品库存(单品、组合)
    static async getCommonStockCustValue(ctx, params) {
        let url = `/sp-goods/inventory-judge?shopId=${params.shopId}&usrId=${params.usrId}&companyId=${params.companyId}`
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  获取商品价格（包括绣字绣花价格）
    static async getCustPriceValue(ctx, params) {
        let url = '/psm-dastp-hd-aggregates/getPrice?companyId=' + params.companyId
        return ctx.$post(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  商品分类等级查询
    static async getGoodsLayerClassValue(ctx, params) {
        let url = `/cms-busconcla-hds/layer`
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.issBas + url, params).then((res) => {
            return res
        });
    }

    //  根据绣花主档id获取绣花颜色明细表列表
    static async getEptColorsValue(ctx, params) {
        let url = '/ict-emb-hds/color-list/' + params.id
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  判断商品是否上架
    static async getGoodSellStateValue(ctx, params) {
        let url = '/sp-goods/part-sell-flag'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.shoppingCart + url, params).then((res) => {
            return res
        });
    }

    //  根据商品id获取定制颜色
    static async getCustomColorsValue(ctx, params) {
        let url = '/mat-part-fabrics/custom-colors'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }

    //  根据商品id获取定制颜色
    static async getFabricPriceValue(ctx, params) {
        let url = '/psm-dastp-hd-aggregates/add-fabric-price'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.invoice + url, params).then((res) => {
            return res
        });
    }

    //  获取商品部件信息，主面料id
    static async getMainFabricInfoValue(ctx, params) {
        let url = '/link-cfg-dts/gct-default-detail/part-code'
        return ctx.$get(ctx.baseUrl + ctx.serverPortUrl.goodsService + url, params).then((res) => {
            return res
        });
    }
}

module.exports = goods
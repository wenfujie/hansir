/*
* createTime：2019/01/12
* author：fujie.wen
* description: 立即购买 生成中间表id前要调接口（由于商品详情、绣字绣花页都需生成中间表id 估抽取公共mixins）
*/
<template></template>

<script>
    import { Goods } from "../../../api/service";
    import { Toast } from 'vant';

    export default{
        data(){
            return{

            }
        },
        created(){
            this.ms_tabList = [{id:1,title: '中英文绣字',type:'D_EMBTYPE_FONT'},{id:2,title: '星座刺绣',type:'D_EMBTYPE_EMBPIC'}];
            this.ms_tabListLength = this.ms_tabList.length;
            this.ms_goodsType = this.$route.query.goodsType;
        },
        methods:{
            // 获取商品可绣花、绣字部位
            ms_getUseablePart(item,ptiPartHdId){
                let data = {
                    type: item.type,
                    ptiPartHdId: this.goodDetail.ptiPartHdId
                }
                return Goods.getUseablePart(data);
            },
            // 判断商品是否下架
            ms_checkoutGoodSell(isBuy){
                let goodsType = this.$route.query.goodsType;
                let data = {
                    buscontsCode: baseConstant.busContsCode
                };
                if(this.ms_goodsType === 'groupGoods'){// 组合（支持多个,分隔）
                    data.combGoodsCodeList = this.groupGoodDetail.ptiCombgoodHdCode;
                }else{// 单品（支持多个,分隔）
                    data.partGoodsCodeList = this.goodDetail.goodCode;
                }
                if(isBuy){// 购买时判断下架
                    if(this.buyType == 1 || this.buyType == 3){
                        data.partGoodsCodeList = this.goodDetail.goodCode;
                        delete data.combGoodsCodeList;
                    }else{
                        data.combGoodsCodeList = this.groupGoodDetail.ptiCombgoodHdCode;
                        delete data.partGoodsCodeList;
                    }
                }
                return Goods.getGoodSellState(data).then(res=>{
                    if(res.combGoodsList && res.combGoodsList.length){// 组合
                        if(res.combGoodsList[0].sellFlag == 0){
                            this.ms_isUnSell = true;// 下架
                            Toast('该商品已下架')
                        }else{
                            this.ms_isUnSell = false;
                        }
                    }else{// 单品（支持多个,分隔）
                        if(res.partGoodsList[0].sellFlag == 0){
                            this.ms_isUnSell = true;
                            Toast('该商品已下架')
                        }else{
                            this.ms_isUnSell = false;
                        }
                    }
                })
            },
        }
    }
</script>
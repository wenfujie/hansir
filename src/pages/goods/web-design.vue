<template>
    <div class="iframe-web-design">
        <!-- <div v-show="isShelves" class="shelves">该商品已下架~</div> -->
        <iframe class="design-iframe" :src="url"></iframe>
    </div>

</template>
<script>
    import Storage from '../../util/storage'
    import { Goods, Cms } from "@/api/service"
    export default {
        name: 'web-design',
        data () {
            return {
                isShelves: false,
                url: ''
            }
        },
        methods: {},
        created () {
            this.$nextTick( () => {
                let companyId = Storage.get('COMPANYID').company_id
                let usrInfo = JSON.stringify(Storage.get('USER_INFO'))
                console.log("window.location.url",window.location.origin)
                let url = window.location.origin
                let iframeUrl = ""
                if(url.indexOf('hansir')){
                    iframeUrl = url.split('hansir')[0] + '/collocation/#/'
                }
                console.log("iframe", iframeUrl)
                let templateInfo = Storage.get('TEMPLATE_INFO')
                 let goodsCode = this.$route.query.goodsCode || '';
                // todo 测试数据
//                let goodsCode = "CS1811050001"
                let callback = (goodsCode)=>{
                    let params = {
                        ownCompanyId: companyId,
                        comgoodsCode: goodsCode,
                        buscontsCode: baseConstant.busContsCode
                    }
                    Goods.goodsCombgoodInfo(params).then((res)=>{
                        if(!res){
                            // this.isShelves = true
                            this.$router.push('/show')
                        }else{
                            let goodsTitle = res
                            this.url = iframeUrl + 'goods/web-design?companyId=' + companyId + '&busContsCode=' + baseConstant.busContsCode + '&goodsCode=' + goodsCode + '&goodsTitle=' + goodsTitle + '&userInfo=' + usrInfo

                        }
                    })
                }

                if(this.$route.query.fromPage == 'goods-list'){
                    callback(goodsCode);
                    return
                }


                let data = {
                    ownCompanyId: companyId,
                    busContsCode: baseConstant.busContsCode,
                    cmsTemplateCode: templateInfo.cmsTemplateCode,
                    navigateCode: pageCode.goodsDesign.name
                }
                Cms.getNavigation(data).then(res=>{
                    if(!!res && res.length>0 && !!res[0].navigatUrl && !!res[0].navigatUrl.split('=')[1]){
                        goodsCode = res[0].navigatUrl.split('=')[1]
                        callback(goodsCode);
                    } else {
                        this.$router.push('/show')
                    }
                })
            })
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .iframe-web-design{
        box-sizing: border-box;
        width: 100%;
        height: 100vh;
        .design-iframe{
            display: block;
            margin: 0 auto;
            width: 100%;
            height: 100%;
            border: none;
        }
        .shelves{
            text-align: center;
            margin-top: 20vw;
        }
    }
</style>

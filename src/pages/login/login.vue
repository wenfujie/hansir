/*
* createTime：2018/11/1
* author：en.chen
* description:
*/
<template>
    <div>
    </div>
</template>
<style>

</style>
<script>
    import { Login, Base, Cms } from '../../api/service'
    export default {
        data () {
            return {
                userInfo:{}
            }
        },
        methods: {
            //  获取默认模板或者千人千面模板
            getDefaultTemplate () {
                if(!Storage.get('USER_INFO')){
                    Cms.getCmsTemplate().then(res=>{
                        Storage.set('TEMPLATE_INFO', res[0])
                    }).then(()=> {
                        if(window.history.length > 2) {
                            window.history.go(-1)
                        } else{
                            this.$router.push('/show')
                        }
                    })
                }
            }
        },
        created () {
            let path = window.location.href
            /* if(path.indexOf('WECHAT_INFO') != -1){
                let wechat_info = path.split("WECHAT_INFO=")[1];
                let deWechat = decodeURIComponent(wechat_info)
                let WECHAT_INFO = JSON.parse(deWechat);
                // console.log("wechat_info", )
                Storage.set("WECHAT_INFO", WECHAT_INFO)
            } */
            if(!global.baseConstant.wxUnionid) {
                Cms.getProperties().then(res=>{
                    global.baseConstant.wxUnionid = res.mpUuid
                    global.baseConstant.publicAccount = res.publicAccount
                    Storage.set("COMPANYID", {"company_id": res.companyId})
                    Storage.set("properties", {"iframeUrl": res.iframeUrl, "wxUnionid": res.mpUuid, "shopId": res.shopIds, "publicAccount": res.publicAccount})
                    this.getDefaultTemplate()
                })
            }else{
                this.getDefaultTemplate()
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
/*
* createTime：2019/03/19
* author：JianDu.Sun
* description: 集合
*/

import { Volume,UserService } from "../../../api/service";


// 判断尺码量体
function getRouteName (to,next) {
    if(this.$route.query.successUrl != null && this.$route.query.successUrl != undefined){
        this.measureOpCode = res.measureOpCode
        this.submitData.measureOpCode = res.measureOpCode
        this.v_type = 'payCode'
        this.submitWord = '下一步'
        console.log('成功地址',decodeURIComponent(this.$route.query.successUrl))
        var s_name = decodeURIComponent(this.$route.query.successUrl)
          var resData = this.getQueryString(s_name)
          this.queryData = resData
        if(this.$route.query.successUrl == 'toEmb'){
              this.routeName = 'goodsEmbroider'
              this.queryData ={'goodsCode':this.$route.query.goodCodes}
             //  加个面料ID
        }else{
          if(s_name.indexOf('/goods-embroider') != -1){
              this.routeName = 'goodsEmbroider'
              console.log("嘿嘿嘿",this.successUrl)
          }
          if(s_name.indexOf('/order-settlement') != -1){
              this.routeName = 'orderSettlement'
          }
          this.successUrl = decodeURIComponent(this.$route.query.successUrl)
        }
     }
}

export default {getRouteName}
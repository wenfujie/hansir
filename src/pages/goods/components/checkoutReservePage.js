/*
* createTime：2019/03/16
* author：fujie.wen
* description: 下单（生成中间表id）校验前往 预约？ 量体？ 是否有历史数据？
*/

import { Volume,UserService } from "../../../api/service";

/**
 * 将对象合并到url上
 * @param url
 * @param obj 要添加的参数对象
 * @returns {*}
 */
function setRouterParams (url, obj) {

    for(let key in obj){
        if(key != 'unique_needCache'){
            url += `&${key}=${obj[key]}`;
        }
    }
    let firstParam = url.indexOf('&');
    if(firstParam != -1){
        url = url.substring(0,firstParam) + '?' + url.substring(firstParam+1);
    }
    return url;
}

// 判断尺码量体
function checkoutSizePage (to,next) {
    let data = {
        goodsCodes: to.query.goodCodes,
        busContsCode:  baseConstant.busContsCode
    }
    console.log(to,"-------==========")
    Volume.getMeasureOpInfo(data).then(res=>{
        // 预约需添加的判断参数
        to.query.fromType = 'goodOrder';
        to.query.measureOpCode = res.measureOpCode;
        Storage.set('toReserveParams',to.query);
        if(res.measureOpCode == 'D_MSROPSIZE'){//尺码
            let data = {
                partCodes: to.query.goodCodes,
                pageNum:0,
                pageSize:0
            };

            Volume.getAiMeasure(data).then(_res=>{
                if(_res && _res.length){// 有历史记录
                    next(setRouterParams('/aiCountBody', to.query));
                }else{
                    next(setRouterParams('/aiAmountBody', to.query));
                }
            })
        }else{
            next(setRouterParams('/reserve', to.query));
        }
    })
}

export default {checkoutSizePage}
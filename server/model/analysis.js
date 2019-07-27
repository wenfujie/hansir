/*
 * @Author: zhibin.zhao
 * @Date: 2018-11-13 20:54:27
 * @LastEditors: zhibin.zhhao
 * @LastEditTime: 2018-11-13 20:54:27
 * @Description: 解析小程序授权信息encryptedData
 */
const WXBizDataCrypt = require('../util/WXBizDataCrypt')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
class analysis {
    static async getWxData(ctx, params){
        let object = await this.getWxOpenId(ctx, params.code, params.appId, params.appSecret)
        console.log("object==================", params.appId)
        let pc = new WXBizDataCrypt(params.appId, object.data.session_key)
        params.userInfo = JSON.parse(params.userInfo)
        console.log("params.userInfo", params.userInfo.encryptedData, params.userInfo.iv)
        var data = pc.decryptData(params.userInfo.encryptedData , params.userInfo.iv)
        console.log("解密后的数据", data)
        return data
        // return this.getWxOpenId(params.code)
    }
    // 获取用户openid、session_key会话密钥
    static async getWxOpenId(ctx, code, appid, secret){
        let data = fs.readFileSync(path.join(__dirname, '..') + '/properties/constant.json', 'utf8')
        let constData = JSON.parse(data)
        let properties = constData.prod
        if(ctx.env === 'dev' || ctx.env === 'test'){
            properties = constData.dev
        }else if(ctx.env === 'preprod'){
            console.log("预生产环境====")
            properties = constData.preprod
        }
        let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=' + properties.grantType
        return axios.get(url).then((res) => {
            return res
        }).catch(err=>{
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", err)
        })
    }
    // 获取微信公众号（不是小程序）access_token
    static async getWechatAccessToken(){
        let url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx45b40e5b82bd74d2&secret=99a826efe9214047dc5b734ef4cd818f';
        return axios.get(url).then(res=>{
            console.log(res)
        })
    }

    // 获取微信公众号（不是小程序）蓝牙设备的id和唯一二维码
    static async getWechatAssesstoken(){
        let at = await this.getWechatAccessToken();
        let url = 'https://api.weixin.qq.com/device/getqrcode?access_token='+ at.access_token +'&product_id=51125';
        return axios.get(url).then(res=>{
            console.log(res)
        })
    }
}
module.exports = analysis
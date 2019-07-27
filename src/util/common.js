/**
 * Created by en.chen on 2018-06-20.
 */

import Vue from "vue";
import Storage from "./storage";

/**
 * 设置窗体配置
 */
global.setWin = function () {
    var winWidth = window.innerWidth
    var winHeight = window.innerHeight
    let fontSize = winWidth / 375 * 20
    document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px'
    // 窗体
    global.$win = {
        screenRatio: winHeight / winWidth,
        rem: fontSize,
        width: winWidth,
        height: winHeight,
        widthRem: winWidth / fontSize,
        heightRem: winHeight / fontSize
    }
}


/**
 * 基础业务常量，提交发版
 */
global.baseConstant = {
    // wxUnionid: 'LB36Ji0S', // 微信测试号qishon2@qishon.com wxUUID   //提交发版，测试环境用http://qsuat.qishon.com
    // redirectUri: 'https://wxxcx.qishon.com/zzb/#/login', //微信授权成功后回调地址，提交发版用
    busContsCode: 'D_BUSCONTS_WSC', // 业务触点
    // domain: "qsxls.iss.com:8088", // 新二级域名(companyId = 239)
    signUpTypeCode: 'D_SMP', //小程序登陆编码
    serverUrl: process.env.NODE_ENV == "development" ? "http://127.0.0.1:3000/" : ''
}

// 页面编码
global.pageCode = {
    //  show页模块
    'index': {
        'name': 'index',
        'children': {
            'ad': 'ad01',
            'part1': 'mk01',
            'bannerhs': 'bannerhs',// 轮播图
            'hyfl': 'huiyuanfuli',// 会员福利
            'jg01hs': 'jg01hs',// 超链接1
            'jg02hs': 'jg02hs',// 超链接2
            'jg03hs': 'jg03hs',// 超链接3
            'jg04hs': 'jg04hs',// 超链接4
            'videohs': 'videohs',// 视频
        }
    },
    //  现购模块
    'chooseBuy': {
        'name': 'choosebuy',
        'children': {
            'category': 'hsfl',
            'scene': 'choosebuy02'
        }
    },
    //  量体模块
    'volume': {
        'name': 'reserve-volume',
        'children': {
            'detail': 'yylt01'
        }
    },
    //  企业团购
    'teamPurchase': {
        'name': 'choosebuy02',
        'children': {
            'part': 'qiyetuangou',
        }
    },
    // 底部导航web3D，获取goodsCode
    'goodsDesign': {
        'name': 'hdh03'
    }
}
Vue.config.productionTip = false
Vue.prototype.Storage = Storage
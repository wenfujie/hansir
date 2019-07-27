/*
 * createTime：2018/11/1
 * author：en.chen
 * description: 项目路由
 */
import Vue from 'vue'
import Router from 'vue-router'
import checkoutReservePage from '@/pages/goods/components/checkoutReservePage'
// 登录模块路由
import loginRouter from '@/router/login.router'
import bodyData from '@/pages/bodyData/bodyData'
import myReserve from '@/pages/myReserve/myReserve'
import addressMap from '@/pages/addressMap/addressMap'

// 首页模块路由
import showRouter from '@/router/show.router'

// 商品列表模块路由
import goodsRouter from '@/router/goods.router'

// 手机号模块路由
import phoneRouter from '@/router/phone.router'

// 地址模块路由
import addressRouter from '@/router/address.router'

// 会员模块路由
import memberRouter from '@/router/member.router'

// 预约量体路由
import reserveRouter from '@/router/reserve.router'

// 身体数据路由
import bodyDataRouter from '@/router/bodyData.router'

// 预约地图路由
import addressMapRouter from '@/router/addressMap.router'

// 智能移动门店路由
import intellMobileRouter from '@/router/intellMobile.router'

// 选择着装人的路由
import choiceDressedRouter from '@/router/choiceDressed.router'

// 订单路由模块
import orderRouter from '@/router/order.router'

// 优惠券路由
import Vouchers from '@/router/vouchers.router'

//  量体师模块路由
import MeasureMaster from '@/router/measureMaster.router'

// 售后模块路由
import postSaleRouter from '@/router/postSale.router'

//  企业团购路由
import teamPurchase from '@/router/teamPurchase.router'

// 线下沙龙路由
import salon from '@/router/salon.router'

// 线下沙龙路由
import fund from '@/router/fund.router'

// demo路由
import demo from '@/router/demo.router'

import Storage from '@/util/storage';

// 量体数据路由
import countBodyData from '@/router/countBodyData.router'

import submitSuccess from '@/router/submitSuccess.router'

import aiAmountBody from '@/router/aiAmountBody.router'

import bodyFeature from '@/router/bodyFeature.router'

import aiCountBody from '@/router/aiCountBody.router'



Vue.use(Router)

const router = new Router({
    // mode: ' ',
    // base: '/hansir/',
    routes: [{
            path: '/',
            redirect: '/login'
        }, // 默认路由跳转登陆
        // 登录模块
        ...loginRouter,
        // 首页模块
        ...showRouter,
        // 商品列表模块
        ...goodsRouter,
        // 手机号功能模块
        ...phoneRouter,
        //  地址功能模块
        ...addressRouter,
        //  会员功能模块
        ...memberRouter,
        //预约量体功能模块
        ...reserveRouter,
        //身体数据功能模块
        ...bodyDataRouter,
        //预约地图功能模块
        ...addressMapRouter,
        // 订单路由模块
        ...orderRouter,
        // 智能移动门店路由
        ...intellMobileRouter,
        // 优惠券路由
        ...Vouchers,
        // 选择着装人的路由
        ...choiceDressedRouter,
        //  量体师模块
        ...MeasureMaster,
        // 售后模块路由
        ...postSaleRouter,
        //  企业团购路由
        ...teamPurchase,
        //  线下沙龙路由
        ...salon,
        // demo模块路由
        ...demo,
        // 量体预约的路由
        ...countBodyData,
        // 订单成功的路由
        ...submitSuccess,
        // 资金模块
        ...fund,
        // AI量体
        ...aiAmountBody,
        // 体型特征
        ...bodyFeature,
        // AI量体（增删改查）
        ...aiCountBody

    ]
})


/**
 * 路由拦截器
 * @param to 路由to参数
 * @param next 路由next参数
 * @param isLogin {boolean} 是否有用户信息
 * @returns {boolean}  true:不拦截；false:路由被拦截; string:不拦截，根据该string跳转
 */
let routerIntercept = function  (to,next,isLogin) {
    // 需要授权且绑定手机号  绣字绣花 ， 企业团购 ， 加入会员 ， 账户 , 领券页 ， 充值页 , 预约页
    let limitPages = ['/goods-embroider','/team-purchase','/member-ship','/member-center','/vouchers-list','/account-cashin'];
    if(limitPages.indexOf(to.path) !== -1){
        if(isLogin){
            // 登录且绑定手机
            if(Storage.get('USER_INFO') && Storage.get('USER_INFO').mobilePhone){
                next()
            }else{// 登录,未确认是否绑定手机
                c_getUserInfo().then((res)=>{
                    // 判断是否绑定手机号
                    if(!res.mobilePhone){
                        // 未绑定手机号 前往绑定页
                        let bindPhoneUrl = '/bind-phone?successUrl=' + encodeURIComponent(to.fullPath)
                        next(bindPhoneUrl)
                    }else{// 已绑手机号
                        next()
                    }
                })
            }
        }else{
            checkoutAuthorized(to.fullPath,this);
        }
        return false;
    }

    // 需要授权无需绑定手机号  3D定制
    if(to.path === '/goods-design'){
        if(isLogin){
            next()
        }else{
            checkoutAuthorized(to.fullPath,this);
        }
        return false;
    }
    if(to.path === '/intellMobileStore'){//智能移动店铺
        if(!checkoutAuthorized('',this))return false;
        getAuthorize("","/page/intellMobileStore/intellMobileStore");
        return false;
    }
    // 需要缓存参数页面 （引流页、商品详情下单跳到预约量体 涉及到页面需要缓存参数）
    let needCachePages = ['/reserve'];
    if(needCachePages.indexOf(to.path) != -1){
        for(let key in to.query){
            // unique_needCache=1在路由控制是否缓存
            if(key === 'unique_needCache' && to.query[key] === '1'){
                let sUrl = to.query.successUrl;
                if(sUrl !== 'toEmb'){
                    to.query.successUrl = encodeURIComponent(sUrl);
                }
                checkoutReservePage.checkoutSizePage(to,next);
                return false;
            }
        }
    }
    return true;
}

// 判断是否跳转
let routerInterceptControl = function (to,next,isLogin) {
    let interceptFlag = routerIntercept(to,next,isLogin);
    if(interceptFlag){
        if(typeof interceptFlag === 'string'){
            next(interceptFlag)
        }else{
            next()
        }
    }
}


router.beforeEach((to, form, next) => { /* 路由变化修改title */

    if(to.path.indexOf('measure') != -1){   // 如果是量体师模块则不做用户信息过滤
        if(to.path.indexOf('login') != -1){
            next()
        }else{
            if(!Storage.get('MEASURE_USER')){
                next('/measure-master/login')
            } else {
                next()
            }
        }
    } else{
        if(!Storage.get('USER_INFO')){
            if(!!to.query.LOGIN_INFO){
                let loginInfo = JSON.parse(to.query.LOGIN_INFO)
                let userInfo = {usrId: loginInfo.usrId, shopId: loginInfo.shopId, shopCode: loginInfo.shopCode};
                Storage.set('COMPANYID', {company_id: loginInfo.companyId})
                Storage.set('USER_INFO', userInfo)
                Storage.set('properties', {iframeUrl: loginInfo.iframeUrl, wxUnionid: loginInfo.wxUnionId, shopId: loginInfo.shopId, "publicAccount": loginInfo.publicAccount})
                Storage.set('WECHAT_INFO', {openid: loginInfo.openId})
                c_getUserInfo().then((res)=>{
                    // 判断是否绑定手机号
                    userInfo.mobilePhone = res.mobilePhone?res.mobilePhone:null;
                    Storage.set('USER_INFO', userInfo)
                }).then(()=>{
                    global.userCmsTemplate().then((res=>{
                        routerInterceptControl(to,next,true);
                        // if(!routerIntercept(to,next,true)){
                        //     return;
                        // }
                        // next()
                    }))
                })


            }else{
                console.log("没有用户信息，且小程序没授权")
                global.Const().then((res)=>{
                    routerInterceptControl(to,next,false);
                })
            }
          } else {
            console.log("已经有用户信息")
            if(to.path.indexOf('/show') != -1){
                console.log("进入首页-获取千人千面模板")
                global.userCmsTemplate().then((res=>{   // 每次回到首页要获取一次千人千面（应对临时切换模板）
                    routerInterceptControl(to,next,true);
                }))
            }else {
                routerInterceptControl(to,next,true);
            }
          }
    }

})


router.afterEach((to, from) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    getAuthorize({from:"routerChange",url:to.fullPath})//将跳转路由postmessage出去，解决苹果不会动态更新options.webviewUrl问题
})
export default router
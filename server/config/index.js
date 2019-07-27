// let ports = {};
/* let devPorts = {
    base: 8080, // 基础服务接口
    systemService: 8801, // 系统服务
    goodsService: 8802, // 商品服务
    issBas: 8803, // 基础档案服务
    memberService: 8805, // 会员服务
    shoppingCart: 8806, // 购物车
    fileSystem: 9080, // 文件系统端口
    baseService: 9999 // 基础档案服务
}
let testPorts = {} */
// let domainObject = {  //  服务端口
//     base: 'http://1.1.2.3:8080', // 基础服务接口  (发送短信验证码)
//     systemService: 'http://1.1.2.3:8801', // 系统服务
//     goodsService: 'http://1.1.2.3:8802', // 商品服务
//     issBas: 'http://1.1.2.3:8803', // 基础档案服务
//     memberService: 'http://1.1.2.3:8805', // 会员服务
//     shoppingCart: 'http://1.1.2.3:8806', // 购物车
//     fileSystemToken: 'http://testClient:testClientSecret@1.1.2.3:9080', //获取文件系统token
//     fileSystem: 'http://1.1.2.3:9080', // 文件系统端口
//     baseService: 'http://1.1.2.3:9999', // 基础档案服务
//     promotion: 'http://1.1.2.3:8809',  // 促销服务
//     koaUrl: 'http://127.0.0.1' //koa层地址
// }
let serverPortUrl = {
    base: '', // 基础服务接口
    systemService: '/iss/stm', // 系统服务
    goodsService: '/iss/mas', // 商品服务
    issBas: '/iss/bas', // 基础档案服务
    memberService: '/iss/crm', // 会员服务
    shoppingCart: '/iss/sal', // 购物车
    baseService: '', // 基础档案服务
    promotion: '/iss/spm', // 促销服务
    thirdPartyService: "/iss/thp", //第三方服务
    wxService: '/wechat/event', // 后台微信服务
    payment: '/iss/thp', // 第三方服务（订单支付）
    invoice: '/iss/acc'  //  财务接口
}

let env = process.argv.splice(2).toString();
let baseUrl = '';

if (env === 'dev') { //CICD开发环境
    baseUrl = 'http://qishon-zuul-gateway.dev.qs.com'
    global.axiosBaseUrl = 'http://qishon-zuul-gateway.dev.qs.com'
    console.log('env', env)
} else if (env === 'test') { //测试环境
    baseUrl = 'http://qishon-zuul-gateway.test.qs.com'
    global.axiosBaseUrl = 'http://qishon-zuul-gateway.test.qs.com'
    console.log('env', env)
}else if (env === 'prod') { // 线上环境
    baseUrl = 'http://qishon-zuul-gateway'
    global.axiosBaseUrl = 'http://qishon-zuul-gateway'
    console.log('env', env)
}else if (env === 'preprod') { // 预生产环境
    baseUrl = 'http://qishon-zuul-gateway'
    global.axiosBaseUrl = 'http://qishon-zuul-gateway'
    console.log('env', env)
}else { // 压测环境
    baseUrl = 'http://1.1.20.85/api'
    global.axiosBaseUrl = 'http://1.1.20.85/api'
}



module.exports = {
    port: 3000, // 应用端口
    viewsDirname: 'views', // HTML存放的文件夹名称
    viewEngine: 'jade', // 视图渲染引擎
    publicSourceDir: '/assets', // 公共资源的存放文件夹名称
    baseUrl: baseUrl,
    env: env,
    serverPortUrl: serverPortUrl
}
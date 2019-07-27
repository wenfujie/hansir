/*
* createTime：2018/9/6
* author：en.chen
* description:  获取token
*/

class getToken {

    //  通过客户端获取token
    static async getCilentToken(ctx, params) {
        let url = 'http://qishon-zuul-gateway.dev.qishon.com/uaa/oauth-client/token'
        return ctx.$post(url, params).then((res) => {
            return res
        });
    }

    //  通过密码模式获取token
    static async getPwdToken(ctx, params) {
        let url = 'http://qishon-zuul-gateway.dev.qishon.com/uaa/oauth-pwd/token'
        return ctx.$post(url, params).then((res) => {
            return res
        });
    }

}

module.exports = getToken
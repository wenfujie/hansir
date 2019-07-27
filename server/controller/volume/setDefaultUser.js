/*
* createTime：2018/11/14
* author：sun.jiandu
* description:  
*/

const userVolume = require('../../model/volume')

const setDefaultUser = async function (ctx,next) {
    let res = await userVolume.setDefaultUserValue(ctx,ctx.params);
    ctx.body = res;
}

module.exports = setDefaultUser


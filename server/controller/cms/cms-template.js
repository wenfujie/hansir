/*
* createTime：2018/7/5
* author：en.chen
* description: 内容管理获取默认模板
*/

const cms = require('../../model/cms')

const getCmsTemplate = async function (ctx,next) {
    let res = await cms.getCmsTemplateValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getCmsTemplate



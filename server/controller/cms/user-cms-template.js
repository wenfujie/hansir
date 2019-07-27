/*
* createTime：2018/7/5
* author：en.chen
* description: 内容管理获取千人千面模板
*/

const cms = require('../../model/cms')

const getUsrCmsTemplate = async function (ctx,next) {
    let res = await cms.getUsrCmsTemplateValue(ctx,ctx.params);
    ctx.body = res.data;
}

module.exports = getUsrCmsTemplate

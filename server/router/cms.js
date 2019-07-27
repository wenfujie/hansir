/*
* createTime：2018/7/5
* author：en.chen
* description: 中间层提供给前端的内容管理模块api
*/

const getCmsTemplate = require('../controller/cms/cms-template')

const getUsrCmsTemplate = require('../controller/cms/user-cms-template')

const getCmsInfoV2 = require('../controller/cms/cms-info-v2')

const getCrumbs = require('../controller/cms/cms-crumbs')

const getCrumbsDetail = require('../controller/cms/cms-crumbs-detail')

const getNavigation = require('../controller/cms/cms-navigation')

const getWebItemGoods = require('../controller/cms/cms-webitem-goods')

const getChoosebuyGoods = require('../controller/cms/choosebuy-list-goods')

const getProperties = require('../controller/cms/properties')

module.exports = {
    "GET/cmsTemplate": getCmsTemplate,
    "GET/usrCmsTemplate": getUsrCmsTemplate,
    "GET/cmsInfoV2": getCmsInfoV2,
    "GET/crumbs": getCrumbs,
    "GET/crumbsDetail": getCrumbsDetail,
    "GET/navigation": getNavigation,
    "GET/webItemGoods": getWebItemGoods,
    "GET/choosebuyGoods": getChoosebuyGoods,
    "GET/getProperties": getProperties
};

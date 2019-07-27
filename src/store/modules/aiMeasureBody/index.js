/*
* createTime：2019/3/28
* author：en.chen
* description:  量体数据仓库
*/

import Storage from '../../../util/storage'

export default {

    namespaced: true,

    state: {
        aiUserName: null,  // AI量体页面用户姓名
        aiFormData: null,  // AI量体页面表单信息
        aiParams: {  //  AI量体页面传参信息（小兄弟专属仓库，用于存储各页面间的传参）
            query: null,
            params: null
        },
        bodyFormData: null,  // 体型特征表单信息
        bodyParams: {  // 量体特征页面传参信息（小兄弟专属仓库，用于存储各页面间的传参）
            query: null,
            params: null
        },
    },
    
    actions: {

    },

    mutations: {

        //  设置数据
        setData(state,data) {
            state[data.storeKey] = data.storeValue
        },

        //  重置ai量体页面数据
        resetData(state) {
            state.aiUserName = null
            state.aiFormData = null
            state.aiParams = {
                query: null,
                params: null
            }
            state.bodyFormData = null
            state.bodyParams = {
                query: null,
                params: null
            }
        }
    }
};

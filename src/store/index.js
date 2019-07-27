/*
* createTime：2019/3/28
* author：en.chen
 * description: 引用 Redux 的作者 Dan Abramov 的话说就是：“Flux 架构就像眼镜：您自会知道什么时候需要它。”
*/

import Vue from "vue";
import Vuex from "vuex";

//  AI量体数据仓库
import aiMeasureBody from "./modules/aiMeasureBody/index";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        aiMeasureBody,
    },
    plugins: []
});
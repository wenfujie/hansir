/*
* createTime：2018/11/1
* author：fujie.wen
* description: 首页模块
*/

export default [{
    path: '/show',
    meta: {
        title: '首页',
        keepAlive: true  // 页面缓存

    },
    component: () =>
        import ('@/pages/show/show'),
}]
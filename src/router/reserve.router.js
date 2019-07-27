/*
* createTime：2018/11/6
* author：jiandu.sun
* description: 我的预约
*/

export default [
    {
        name: 'reserve',
        path: '/reserve',
        meta: {
            title: '开始定制',
            keepAlive: false  // 页面缓存
        },
        component: () =>
        import ('@/pages/myReserve/reserve'),
    },
    {   name: 'myReserve',
        path: '/myReserve',
        meta: {
            title: '我的预约',
            keepAlive: false  // 页面缓存
        },
        component: () =>
        import ('@/pages/myReserve/myReserve'),
    }
]
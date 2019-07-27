/*
* createTime：2018/11/22
* author：en.chen
* description: 线下沙龙路由
*/

export default [
    {
        path: '/salon-list',
        name: 'salonList',
        component: () =>
            import ('@/pages/salon/salon'),
        meta: {
            title: '线下沙龙'
        }
    },
    {
        path: '/salon-detail',
        name: 'salonDetail',
        component: () =>
            import ('@/pages/salon/salon-detail'),
        meta: {
            title: '线下沙龙'
        }
    }
]
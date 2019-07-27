/*
* createTime：2018/11/3
* author：en.chen
* description: 地址模块
*/
export default [
    {
        path: '/address-list',
        name: 'addressList',
        component: () =>
            import ('@/pages/address/address-list'),
        meta: {
            title: '我的地址簿'
        }
    },
    {
        path: '/address-detail',
        name: 'addressDetail',
        component: () =>
            import ('@/pages/address/address-detail'),
        meta: {
            title: '地址详情'
        }
    }
]
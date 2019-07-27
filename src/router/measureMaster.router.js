/*
* createTime：2018/11/12
* author：en.chen
* description:  量体师模块
*/

export default [
    {
        path: '/measure-master/login',
        name: 'masterLogin',
        meta: {
            title: '登陆'
        },
        component: () =>
            import ('@/pages/measureMaster/login')
    },
    {
        path: '/measure-master/master-center',
        name: 'masterCenter',
        meta: {
            title: '账户'
        },
        component: () =>
            import ('@/pages/measureMaster/master-center'),
    },
    {
        path: '/measure-master/measure-data',
        name: 'measureData',
        meta: {
            title: '填写量体数据'
        },
        component: () =>
            import ('@/pages/measureMaster/measure-data'),
    }
]
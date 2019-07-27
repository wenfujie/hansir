/*
* createTime：2018/11/2
* author：en.chen
* description: 手机号模块
*/

export default [
    {
        path: '/bind-phone',
        name: 'bindPhone',
        component: () =>
            import ('@/pages/phone/bind-phone'),
        meta: {
            title: '绑定手机号'
        }
    },
    {
        path: '/change-phone',
        name: 'changePhone',
        component: () =>
            import ('@/pages/phone/change-phone'),
        meta: {
            title: '更换绑定手机号'
        }
    }
]
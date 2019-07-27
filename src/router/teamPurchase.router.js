/*
* createTime：2018/11/20
* author：en.chen
* description:  企业团购路由
*/

export default [
    {
        path: '/team-purchase',
        name: 'teamPurchase',
        component: () =>
            import ('@/pages/team-purchase/team-purchase'),
        meta: {
            title: '企业团购'
        }
    },
]
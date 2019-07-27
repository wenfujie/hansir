export default [{
    name: 'aiAmountBody',
    path: '/aiAmountBody',
    meta: {
        title: 'AI量体',
        keepAlive: false  // 页面缓存
    },
    component: () =>
        import ('@/pages/myReserve/aiAmountBody'),
}]
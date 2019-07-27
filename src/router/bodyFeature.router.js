export default [{
    name: 'bodyFeature',
    path: '/bodyFeature',
    meta: {
        title: '体型特征',
        keepAlive: false  // 页面缓存
    },
    component: () =>
        import ('@/pages/myReserve/bodyFeature'),
}]
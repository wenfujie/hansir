
export default [{
    name: 'countBodyData',
    path: '/countBodyData',
    meta: {
        title: '量体数据'
    },
    component: () =>
        import ('@/pages/countBodyData/countBodyData'),
}]
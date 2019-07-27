export default [{
    name: 'demo',
    path: '/demo',
    meta: {
        title: 'demo'
    },
    component: () =>
        import ('@/pages/demo/demo'),
}]
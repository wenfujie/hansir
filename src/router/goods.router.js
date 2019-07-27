/*
* createTime：2018/11/2
* author：fujie.wen
* description: 商品列表模块
*/

export default [{
  name: 'goods',
  path: '/goods',
  meta: {
    title: '商品列表'
  },
  component: () =>
    import ('@/pages/goods/good-list'),
},
//     {
//   name: 'goodsDetail',
//   path: '/goods-detail',
//   meta: {
//     title: '商品详情'
//   },
//   component: () =>
//     import ('@/pages/goods/good-detail'),
// },
    {
        name: 'goodsDetail',
        path: '/goods-detail',
        meta: {
            title: '商品详情'
        },
        component: () =>
                import ('@/pages/goods/good-detail-yuyue'),
    },
    {
  name:'goodsSort',
  path: '/goods-sort',
  meta: {
    title: '分类',
    keepAlive: true  // 页面缓存
  },
  component: () =>
    import ('@/pages/goods/good-sort'),
},{
  name:'goodsComment',
  path: '/goods-comment',
  meta: {
    title: '评价'
  },
  component: () =>
    import ('@/pages/goods/good-comment'),
},{
  name:'goodsBrand',
  path: '/goods-brand',
  meta: {
    title: '品牌列表'
  },
  component: () =>
    import ('@/pages/goods/good-brand'),
},{
    name:'goodsDesign',
    path: '/goods-design',
    meta: {
        title: '3D搭配'
    },
    component: () =>
            import ('@/pages/goods/web-design'),
},{
        name:'goodsEmbroider',
        path: '/goods-embroider',
        meta: {
            title: '定制选项'
        },
        component: () =>
                import ('@/pages/goods/good-embroider-new'),
    }
]
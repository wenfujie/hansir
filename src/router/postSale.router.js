/*
 * @Author: yongtian.hong
 * @Date: 2018-08-09 09:07:55
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-11-12 15:14:17
 * @Description: 售后服务路由
 */
export default [{
    name: "postSaleApply",
    path: "/postSaleApply",
    meta: {
      title: '售后申请'
    },
    component: () =>
      import("@/pages/postSale/post-sale-apply")
  }, {
    name: "postSaleList",
    path: "/postSaleList",
    meta: {
      title: '售后申请单列表'
    },
    component: () =>
      import("@/pages/postSale/post-sale-list")
  },

  {
    name: "postSaleDetail",
    path: "/postSaleDetail",
    meta: {
      title: '售后详情'
    },
    component: () =>
      import("@/pages/postSale/post-sale-detail")
  },
];
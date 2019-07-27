/*
 * @Author: yongtian.hong
 * @Date: 2018-11-06 16:47:26
 * @LastEditors: yongtian.hong
 * @LastEditTime: 2018-12-18 10:37:40
 * @Description: 订单路由模块
 */
export default [
  {
    name: "orderList",
    path: "/order-list",
    meta: {
      title: "订单列表"
    },
    component: () => import("@/pages/order/order-list")
  },
  {
    name: "orderDetail",
    path: "/order-detail",
    meta: {
      title: "订单详情"
    },
    component: () => import("@/pages/order/order-detail")
  },
  {
    name: "waitShip",
    path: "/waitShip",
    meta: {
      title: "待发货"
    },
    component: () => import("@/pages/order/wait-ship")
  },
  {
    name: "orderClosed",
    path: "/orderClosed",
    meta: {
      title: "已关闭"
    },
    component: () => import("@/pages/order/order-closed")
  },
  {
    name: "tradFinish",
    path: "/tradFinish",
    meta: {
      title: "交易完成"
    },
    component: () => import("@/pages/order/trad-finish")
  },
  {
    name: "waitEvaluate",
    path: "/waitEvaluate",
    meta: {
      title: "待评价"
    },
    component: () => import("@/pages/order/wait-evaluate")
  },

  {
    name: "waitRecieve",
    path: "/waitRecieve",
    meta: {
      title: "待收货"
    },
    component: () => import("@/pages/order/wait-recieve")
  },
  {
    name: "waitPay",
    path: "/waitPay",
    meta: {
      title: "待付款"
    },
    component: () => import("@/pages/order/wait-pay")
  },
  {
    name: "orderShare",
    path: "/orderShare",
    meta: {
      title: "订单分享"
    },
    component: () => import("@/pages/order/orderShared")
  },
  {
    name: "orderEvaluate",
    path: "/orderEvaluate",
    component: () => import("@/pages/order/order-evaluate.vue"),
    meta: {
      title: "订单商品评价"
    }
  },
  // {
  //   name: "orderSettlement",
  //   path: "/order-settlement",
  //   component: () => import("@/pages/order/order-settle.vue"),
  //   meta: {
  //     title: "订单结算",
  //     keepAlive: false // 需要被缓存
  //   }
  // }
    {
        name: "orderSettlement",
        path: "/order-settlement",
        component: () => import("@/pages/order/order-settle-yuyue.vue"),
        meta: {
            title: "订单结算",
            keepAlive: false // 需要被缓存
        }
    }
];

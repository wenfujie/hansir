/*
 * createTime：2018/11/7
 * author：junyong.hong
 * description: 优惠券模块路由
 */
export default [
  {
    path: "/vouchers-list",
    name: "vouchersList",
    component: () => import("@/pages/vouchers/vouchers-list"),
    meta: {
      title: "领券中心"
    }
  },
  {
    path: "/my-vouchers",
    name: "myVouchers",
    component: () => import("@/pages/vouchers/my-vouchers"),
    meta: {
      title: "优惠券"
    }
  }
];

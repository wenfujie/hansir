/*
 * createTime：2018/12/21
 * author：en.chen
 * description: 资金模块
 */

export default [
  {
    path: "/fund-detail",
    name: "fundDetail",
    component: () => import("@/pages/fund/fund-detail"),
    meta: {
      title: "资金账户"
    }
  },
  {
    path: "/account-cashin",
    name: "accountCashin",
    component: () => import("@/pages/fund/account-cashin"),
    meta: {
      title: "账户充值"
    }
  }
];

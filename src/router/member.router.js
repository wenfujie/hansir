/*
 * createTime：2018/11/5
 * author：en.chen
 * description: 会员模块
 */

export default [
  {
    path: "/my-collection",
    name: "myCollection",
    component: () => import("@/pages/member/my-collection"),
    meta: {
      title: "我的收藏"
    }
  },
  {
    path: "/member-info",
    name: "memberInfo",
    component: () => import("@/pages/member/member-info"),
    meta: {
      title: "个人信息"
    }
  },
  {
    path: "/point-detail",
    name: "point",
    component: () => import("@/pages/point/point-detail"),
    meta: {
      title: "我的积分"
    }
  },
  {
    path: "/integralShop",
    name: "integralShop",
    component: () => import("@/pages/point/integralShop"),
    meta: {
      title: "积分商城"
    }
  },
  {
    path: "/shopping-list",
    name: "shoppingList",
    component: () => import("@/pages/member/shopping-list"),
    meta: {
      title: "消费记录"
    }
  },
  {
    path: "/member-center",
    name: "memberCenter",
    component: () => import("@/pages/member/member-center"),
    meta: {
      title: "账户"
    }
  },
  {
    name: "memberShip",
    path: "/member-ship",
    component: () => import("@/pages/member-ship/member-ship"),
    meta: {
      title: "我的会员"
    }
  }
];

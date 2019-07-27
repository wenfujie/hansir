import { Dialog, Toast } from "vant";

import { getShopList } from "@/api/service/base";

import { cityData } from "@/assets/js/cityData.js";
import check from "@/util/check";
import payment from "@/util/payment";
import wxPay from "@/util/wxPay";
import ordStateMap from "./OrdStateMap";

// 路由跳转
export const goTo = (vm, path) => {
  vm.$router.push({
    name: path,
    params: Object.assign(vm.data, {
      curStateName: vm.curStateName,
      curTypeName: vm.curTypeName
    })
  });
};
// 取消申请处理函数
export const cancelApplyHandler = vm => {
  return new Promise(async function(resolve, reject) {
    let params = {
      reApplyCode: ""
    };
    // 通过不同路由取参数
    if (vm.$route.name === "postSaleList") {
      params.reApplyCode = vm.data.reapplycode;
    } else {
      params.reApplyCode = getRouteParams(vm).reapplycode;
    }
    let result = await vm.$put("postSale/cancelApply", params);
    resolve(result);
  });
};

// 取消申请弹窗
export const cancelApply = vm => {
  return new Promise(async function(resolve, reject) {
    Dialog.confirm({
      title: "取消申请",
      message: "您确定要取消该售后申请单吗？",
      confirmButtonText: "确定"
    }).then(() => {
      cancelApplyHandler(vm).then(result => {
        if (result.statusCode === 200) {
          Toast("取消成功");
          resolve(result);
        } else {
          Toast("取消失败");
          console.log("取消失败");
          reject(-1);
        }
      });
    });
  });
};

// 重新申请
export const reApply = vm => {
  let good = vm.data.goodsList[0];
  let params = Object.assign(good, {
    applyNum: vm.data.applyAmountQty,
    reApplyCode: null
  });
  vm.$router.push({
    name: "postSaleApply",
    params: params
  });
};
// 修改申请
export const modifyApply = async (vm, code) => {
  let stateName = ordStateMap[code];
  if (stateName != "待审核") {
    Toast("当前申请单订单" + stateName + "无法修改申请,请重新刷新");
    return false;
  }
  let good = vm.data.goodsList[0];
  let result = await vm
    .$get("postSale/getApplyNum", {
      rtlOrdDtId: good.saleOrdDtId
    })
    .then(
      res => {
        return res;
      },
      err => {
        Toast("获取可申请数量失败");
      }
    );
  let params = Object.assign(good, {
    applyNum: vm.data.applyAmountQty + result.applyNum,
    reApplyCode: vm.data.reApplycode || vm.data.reapplycode
  });
  vm.$router.replace({
    name: "postSaleApply",
    params: params
  });
};

// 获取路由数据
export const getRouteParams = vm => {
  let params = vm.$route.params;
  if (check.isEmpty(params)) params = vm.$route.query;
  // return params;
  if (!check.isEmpty(params)) {
    vm.Storage.set("psdParams", params);
    return params;
  } else {
    return vm.Storage.get("psdParams");
  }
};

// 获取售后详情
export const getDetailAsync = async vm => {
  let params = getRouteParams(vm);

  let param = {
    reApplyCode: params.reapplycode
  };
  let result = await vm.$get("postSale/getDetail", param);

  return Object.assign(result.data, {
    curStateName: params.curStateName,
    curTypeName: params.curTypeName
  });
};

// 获取商店列表
export const getStoreList = async (vm, code) => {
  let params = {
    code: code,
    pageNo: 1,
    pageSize: 10
  };
  let result = await getShopList(params);
  return result.list;
};

//获取快递公司列表
export const getExpressCompanies = async vm => {
  let params = {
    pageNum: 1,
    pageSize: 0,
    effFlag: 1
  };
  let result = await vm.$get("postSale/getExpressCompanies", params);
  return result.data;
};

//获取省市县区的数据
export const getCityList = () => {
  return cityData;
};

// 初始化详情状态
export const initState = async vm => {
  vm.data = await getDetailAsync(vm); //获取售后详情
  vm.cityList = getCityList(); //获取省市区
  vm.logisList = await getExpressCompanies(vm); //获取快递列表
  vm.btnName = null;
  vm.btnModify = null;
  vm.returnWayCode = "kdth";
  vm.Storage.set("EXPRE", {});
  switch (vm.ordStateMap[vm.data.applyStatusCode]) {
    case "待审核":
      vm.btnName = "取消申请";
      vm.btnStyle = "bg-grey";
      vm.btnModify = "修改申请";
      break;
    case "待支付":
      vm.btnName = "立即支付";
      vm.btnStyle = "bg-red";
      break;
    case "待寄回":
      vm.btnName = "提交";
      vm.btnStyle = "bg-red";
      break;
    case "已寄回":
      vm.btnName = null;
      break;
    case "待处理":
      vm.btnName = null;
      break;
    case "已取消":
      vm.btnName = null;
      break;
    case "已拒绝":
      vm.btnName = null;
      vm.btnStyle = "bg-red";
      break;
    case "已关闭":
      vm.btnName = null;
      break;
    case "已完成":
      vm.btnName = null;
      break;
    default:
      vm.btnName = null;
      vm.btnModify = null;
  }
  vm.storeList = await getStoreList(vm);
};

// 获取门店列表
export const selectArea = async (vm, list) => {
  vm.area = list;
  vm.store = {};
  try {
    vm.storeList = await getStoreList(vm, list[2].code);
    vm.showAreaList = false;
    console.log("获取门店", vm.storeList);
  } catch (err) {
    alert("请求失败", err);
  }
};

// 选择门店
export const selectStore = async (vm, store) => {
  vm.store = store;
  vm.showStoreList = true;
  console.log("store", vm.store);
};

// 选择门店
export const selectLogis = async (vm, logis) => {
  vm.logis = logis;
  console.log("logis", logis);
};

// 付款
export const payMoney = async vm => {
  let code = vm.data.reApplycode;
  let price = vm.data.ticketMoney;
  let payType = "D_PAY_REPAIR";
  wxPay(vm, code, price, payType).then(res => {
    // Toast("支付成功");
    if (res == 0) {
      vm.initState();
    } else {
      let targetUrl = "/postSaleDetail?reapplycode=" + code;
      payment.miniProgramPay(res, targetUrl, targetUrl);
    }
  });
};

// 退回方式切换回调
export const switchBackMode = (vm, code) => {
  vm.returnWayCode = code;
  vm.store = {};
  vm.logis = {};
};

// 提交保存物流做判断
export const judgeForSubmit = (vm, params) => {
  switch (vm.returnWayCode) {
    case "kdth":
      if (check.isEmpty(params.expressCode)) {
        Toast("请填写快递单号");
        return false;
      } else if (check.isEmpty(params.shippingId)) {
        Toast("请选择物流公司");
        return false;
      } else {
        params.shopId = vm.Storage.get("USER_INFO").shopId;
        return true;
      }
      break;
    case "mdth":
      params.shippingId = null;
      if (check.isEmpty(params.shopId)) {
        Toast("请选择门店地址");
        return false;
      } else {
        params.addressId = null;
        return true;
      }
      break;
  }
};

// 保存物流
export const saveLogis = async vm => {
  let params = {
    reApplyCode: vm.data.reApplycode,
    returnWayCode: vm.returnWayCode,
    shippingId: vm.logis.id,
    addressId: vm.Storage.get("address").id,
    expressCode: vm.Storage.get("EXPRE").expressNo,
    shopId: vm.store.id
  };
  if (!judgeForSubmit(vm, params)) return;
  let result = await vm.$post("postSale/savePostSaleLogis", params);
  if (result == 500) {
    Toast("提交失败");
  } else {
    Toast("提交成功");
    initState(vm);
    vm.store = {};
    vm.logis = {};
  }
};

//   按钮点击触发事件
export const btnClickEvent = async (vm, btnName) => {
  switch (btnName) {
    case "取消申请":
      cancelApply(vm).then(() => {
        initState(vm);
      });
      break;
    case "重新申请":
      reApply(vm);
      break;
    case "修改申请":
      getDetailAsync(vm).then(res => {
        modifyApply(vm, res.applyStatusCode);
        initState(vm);
      });

      break;
    case "提交":
      saveLogis(vm);
      break;
    case "立即支付":
      payMoney(vm);
      break;
  }
};

import ordStateMap from "./OrdStateMap";
export default {
    data: {},
    store: {},
    area: [],
    logis: {},
    tips: {
        reApplyCode: "申请单号不能为空",
        returnWayCode: "退货方式不能为空",
        shippingId: "快递公司不能为空",
        addressId: "收货地址不能为空",
        expressCode: "快递单号不能为空",
        shopId: "请选择退回的门店"
    },
    btnName: null,
    btnStyle: "bg-grey",
    btnModify: null,
    btnModifyStyle: "bg-red",
    params: {},
    cityList: [],
    areaList: [],
    storeList: [],
    logisList: [],
    showAreaList: false,
    showStoreList: false,
    showLogisList: false,
    showLogisInfo: false,
    showPayBtn: false,
    showEmp: false,
    returnWayCode: "kdth",
    ordStateMap: ordStateMap
};
